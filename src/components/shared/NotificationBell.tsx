"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiBell } from "react-icons/fi";
import { deleteNotificationAction } from "@/actions/student-notifications";
import { cn, formatDate } from "@/lib/utils";

export type NotificationBellItem = {
  id: number | string;
  title: string;
  message: string;
  href: string;
  createdAt: string;
  isRead?: boolean;
};

type NotificationBellProps = {
  role: "student" | "admin";
  initialItems: NotificationBellItem[];
  initialUnreadCount: number;
  pollUrl: string;
  viewAllHref?: string;
};

export default function NotificationBell({
  role,
  initialItems,
  initialUnreadCount,
  pollUrl,
  viewAllHref,
}: NotificationBellProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [pulse, setPulse] = useState(false);
  const prevUnread = useRef(initialUnreadCount);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const keyFor = (id: NotificationBellItem["id"]) => `${role}:${String(id)}`;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(pollUrl, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        items: NotificationBellItem[];
        unreadCount: number;
      };
      const filteredItems = data.items.filter((item) => !dismissedIds.has(keyFor(item.id)));
      setItems(filteredItems);
      if (data.unreadCount > prevUnread.current) {
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
      }
      prevUnread.current = data.unreadCount;
      setUnreadCount(Math.max(0, data.unreadCount - dismissedIds.size));
    } catch {
      /* ignore polling errors */
    }
  }, [dismissedIds, pollUrl, role]);

  useEffect(() => {
    setItems(initialItems);
    setUnreadCount(initialUnreadCount);
    prevUnread.current = initialUnreadCount;
  }, [initialItems, initialUnreadCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("dismissed-notification-ids");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      setDismissedIds(new Set(parsed));
    } catch {
      window.sessionStorage.removeItem("dismissed-notification-ids");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      "dismissed-notification-ids",
      JSON.stringify(Array.from(dismissedIds))
    );
  }, [dismissedIds]);

  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    const onFocus = () => void fetchNotifications();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchNotifications]);

  async function handleItemClick(item: NotificationBellItem) {
    setOpen(false);
    const notificationKey = keyFor(item.id);
    setDismissedIds((prev) => new Set(prev).add(notificationKey));
    setItems((prev) => prev.filter((n) => n.id !== item.id));
    if (item.isRead === false || role === "admin") {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    if (role === "student" && typeof item.id === "number") {
      await deleteNotificationAction(item.id);
    }

    router.push(item.href);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-lg text-[var(--dark-blue)] transition-colors hover:bg-black/10",
          pulse && "animate-pulse"
        )}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
      >
        <FiBell size={20} aria-hidden />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--dark-blue)] px-1 text-[10px] font-bold text-white ring-2 ring-[var(--primary-yellow)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl",
              "fixed left-4 right-4 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[min(calc(100vw-2rem),22rem)]"
            )}
          >
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-[var(--primary-blue)]">Notifications</p>
              {unreadCount > 0 ? (
                <p className="text-xs text-zinc-500">{unreadCount} unread</p>
              ) : null}
            </div>

            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-zinc-500">
                  No notifications yet.
                </li>
              ) : (
                items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => void handleItemClick(item)}
                      className={cn(
                        "w-full border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50",
                        item.isRead === false && "bg-blue-50/50"
                      )}
                    >
                      <p className="text-sm font-semibold text-[var(--primary-blue)]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {viewAllHref ? (
              <div className="border-t border-slate-100 p-2">
                <Link
                  href={viewAllHref}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-center text-sm font-semibold text-[var(--primary-blue)] hover:bg-slate-50"
                >
                  View all
                </Link>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
