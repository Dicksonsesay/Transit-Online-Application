"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/student-notifications";
import type { NotificationType } from "@/generated/prisma/client";
import { cn, formatDate } from "@/lib/utils";

export type StudentMessageItem = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  notificationType: NotificationType;
  createdAt: string;
  href: string;
};

type StudentMessagesViewProps = {
  messages: StudentMessageItem[];
};

const typeLabel: Record<NotificationType, string> = {
  interview: "Interview",
  acceptance: "Offer of admission",
  rejection: "Admission",
  general: "General",
};

export default function StudentMessagesView({ messages }: StudentMessagesViewProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleOpen(id: number, href: string, isRead: boolean) {
    startTransition(async () => {
      if (!isRead) {
        await markNotificationReadAction(id);
      }
      router.push(href);
      router.refresh();
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-600">
          {unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
            : "All caught up"}
        </p>
        {unreadCount > 0 ? (
          <button
            type="button"
            disabled={pending}
            onClick={handleMarkAllRead}
            className="text-sm font-semibold text-[var(--primary-blue)] hover:underline disabled:opacity-60"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-zinc-600">No messages yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Updates about your application and interview will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg) => (
            <li key={msg.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleOpen(msg.id, msg.href, msg.isRead)}
                className={cn(
                  "w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-shadow hover:shadow-md",
                  !msg.isRead && "border-[var(--primary-blue)]/30 bg-blue-50/30"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--primary-blue)]">{msg.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {typeLabel[msg.notificationType]} · {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  {!msg.isRead ? (
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--primary-blue)]" />
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-zinc-700">{msg.message}</p>
                <p className="mt-2 text-xs font-semibold text-[var(--primary-blue)]">
                  View details →
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-center text-sm text-zinc-500">
        Interview updates also appear on your{" "}
        <Link href="/student/interview" className="font-semibold text-[var(--primary-blue)] hover:underline">
          Interview
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
