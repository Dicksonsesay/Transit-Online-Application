"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import type { NotificationBellItem } from "@/components/shared/NotificationBell";

type AdminShellProps = {
  adminName: string;
  notifications: NotificationBellItem[];
  unreadCount: number;
  children: ReactNode;
};

export default function AdminShell({
  adminName,
  notifications,
  unreadCount,
  children,
}: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-zinc-50">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <AdminSidebar
        mobileOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar
          adminName={adminName}
          notifications={notifications}
          unreadCount={unreadCount}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
