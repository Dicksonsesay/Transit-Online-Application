"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiChevronDown,
  FiLock,
  FiLogOut,
  FiMenu,
  FiUser,
} from "react-icons/fi";
import NotificationBell, {
  type NotificationBellItem,
} from "@/components/shared/NotificationBell";
import { getAdminPageTitle } from "@/config/admin-page-titles";

type AdminTopBarProps = {
  adminName: string;
  notifications: NotificationBellItem[];
  unreadCount: number;
  onMenuClick?: () => void;
};

export default function AdminTopBar({
  adminName,
  notifications,
  unreadCount,
  onMenuClick,
}: AdminTopBarProps) {
  const pathname = usePathname();
  const title = getAdminPageTitle(pathname);
  const [open, setOpen] = useState(false);

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--dark-blue)]/15 bg-[var(--primary-yellow)] px-4 py-3 shadow-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--dark-blue)] transition-colors hover:bg-black/10 md:hidden"
            aria-label="Open navigation menu"
          >
            <FiMenu size={22} aria-hidden />
          </button>
        ) : null}
        <h1 className="truncate text-xl font-bold text-[var(--dark-blue)] sm:text-2xl">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <NotificationBell
          role="admin"
          initialItems={notifications}
          initialUnreadCount={unreadCount}
          pollUrl="/api/admin/alerts"
        />
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-[var(--dark-blue)] transition-colors hover:bg-black/10"
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dark-blue)] text-white">
              <FiUser size={18} aria-hidden />
            </span>
            <span className="hidden max-w-[140px] truncate sm:inline">
              {adminName}
            </span>
            <FiChevronDown
              size={16}
              className={
                open ? "rotate-180 transition-transform" : "transition-transform"
              }
              aria-hidden
            />
          </button>

          {open ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-30 cursor-default"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              >
                <Link
                  href="/admin/profile"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <FiUser size={16} aria-hidden />
                  Profile
                </Link>
                <Link
                  href="/admin/change-password"
                  role="menuitem"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  <FiLock size={16} aria-hidden />
                  Change password
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => signOut({ callbackUrl: "/auth/admin/login" })}
                >
                  <FiLogOut size={16} aria-hidden />
                  Logout
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
