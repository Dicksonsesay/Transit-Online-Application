import { Suspense } from "react";
import { redirect } from "next/navigation";
import StudentShell from "@/components/student/StudentShell";
import PageLoadingScreen from "@/components/shared/PageLoadingScreen";
import { getStudentNavbarNotifications } from "@/lib/notifications";
import { getStudentPasswordStatus } from "@/lib/student-account";
import { getUnreadNotificationCount } from "@/lib/student-dashboard";
import { requireStudentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function StudentPortalLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStudentSession();

  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  const [unreadMessages, notifications, passwordStatus] = Number.isNaN(studentId)
    ? [
        0,
        [] as Awaited<ReturnType<typeof getStudentNavbarNotifications>>,
        { hasPassword: true, usesGoogleSignIn: false },
      ]
    : await Promise.all([
        getUnreadNotificationCount(studentId),
        getStudentNavbarNotifications(studentId),
        getStudentPasswordStatus(studentId),
      ]);

  return (
    <StudentShell
      studentName={session.user.name ?? "Student"}
      unreadMessages={unreadMessages}
      notifications={notifications}
      hasPassword={passwordStatus.hasPassword}
    >
      {children}
    </StudentShell>
  );
}

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <PageLoadingScreen variant="fullscreen" label="Loading student portal" />
      }
    >
      <StudentPortalLayoutContent>{children}</StudentPortalLayoutContent>
    </Suspense>
  );
}
