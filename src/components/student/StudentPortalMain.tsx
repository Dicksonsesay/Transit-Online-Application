"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import StudentTopBar from "@/components/student/StudentTopBar";
import type { NotificationBellItem } from "@/components/shared/NotificationBell";

const pageTitles: Record<string, string> = {
  "/student": "Student Dashboard",
  "/student/application": "Application Form",
  "/student/interview": "Interview",
  "/student/acceptance-letter": "Offer of Admission",
  "/student/change-password": "Change Password",
  "/student/profile": "My Profile",
  "/student/status": "Admission Status",
};

type StudentPortalMainProps = {
  children: ReactNode;
  studentName: string;
  notifications: NotificationBellItem[];
  unreadCount: number;
  onMenuClick?: () => void;
};

export default function StudentPortalMain({
  children,
  studentName,
  notifications,
  unreadCount,
  onMenuClick,
}: StudentPortalMainProps) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Student Portal";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#f8f9fa]">
      <StudentTopBar
        title={title}
        studentName={studentName}
        notifications={notifications}
        unreadCount={unreadCount}
        onMenuClick={onMenuClick}
      />
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
