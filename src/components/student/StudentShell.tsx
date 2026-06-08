"use client";

import { useState, type ReactNode } from "react";
import StudentPortalMain from "@/components/student/StudentPortalMain";
import StudentSidebar from "@/components/student/StudentSidebar";
import type { NotificationBellItem } from "@/components/shared/NotificationBell";

type StudentShellProps = {
  studentName: string;
  unreadMessages: number;
  notifications: NotificationBellItem[];
  hasPassword?: boolean;
  children: ReactNode;
};

export default function StudentShell({
  studentName,
  unreadMessages,
  notifications,
  hasPassword = true,
  children,
}: StudentShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <StudentSidebar
        mobileOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
        hasPassword={hasPassword}
      />

      <StudentPortalMain
        studentName={studentName}
        notifications={notifications}
        unreadCount={unreadMessages}
        hasPassword={hasPassword}
        onMenuClick={() => setSidebarOpen(true)}
      >
        {children}
      </StudentPortalMain>
    </div>
  );
}
