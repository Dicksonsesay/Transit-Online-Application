"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiCalendar,
  FiFileText,
  FiGrid,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import { studentPortalNav } from "@/config/student-navigation";
import { cn } from "@/lib/utils";

const navIcons: Record<string, IconType> = {
  Dashboard: FiGrid,
  "My Application": FiFileText,
  Interview: FiCalendar,
  "Offer of Admission": FiAward,
  "Change Password": FiLock,
};

type StudentSidebarProps = {
  mobileOpen?: boolean;
  onNavigate?: () => void;
};

export default function StudentSidebar({
  mobileOpen = false,
  onNavigate,
}: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[260px] shrink-0 flex-col bg-[var(--hero-blue)] text-white transition-transform duration-200 lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      aria-label="Student portal navigation"
    >
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-5">
        <Image
          src="/logos/logo.png"
          alt="Transit College"
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-[11px] font-bold leading-tight tracking-wide">
            TRANSIT COLLEGE
          </p>
          <p className="text-[10px] font-semibold text-[var(--primary-yellow)]">
            Student Portal
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Student portal">
        {studentPortalNav.map((item) => {
          const Icon = navIcons[item.label] ?? FiGrid;
          const active =
            pathname === item.href ||
            (item.href !== "/student" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--primary-yellow)] text-[var(--dark-blue)]"
                  : "text-white/95 hover:bg-white/10"
              )}
            >
              <Icon size={18} className="shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/95 transition-colors hover:bg-white/10"
        >
          <FiLogOut size={18} aria-hidden />
          Logout
        </button>
      </div>
    </aside>
  );
}
