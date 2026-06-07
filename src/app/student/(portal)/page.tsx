import { redirect } from "next/navigation";
import StudentDashboard from "@/components/student/StudentDashboard";
import { getStudentDashboardData } from "@/lib/student-dashboard";
import { requireStudentSession } from "@/lib/session";

export const metadata = {
  title: "Student Dashboard | Transit College",
  description: "Student admission portal dashboard",
};

export default async function StudentDashboardPage() {
  const session = await requireStudentSession();

  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    redirect("/auth/login");
  }

  const data = await getStudentDashboardData(studentId);

  if (!data) {
    redirect("/auth/login");
  }

  const interview = data.interviews[0] ?? null;

  return (
    <StudentDashboard
      studentName={data.fullname}
      applicationNumber={data.applicationNumber}
      applicationStatus={data.application?.applicationStatus ?? null}
      applicationSubmittedAt={data.application?.submittedAt ?? null}
      acceptanceLetterPublishedAt={data.acceptanceLetter?.publishedAt ?? null}
      applicationDraftSection={
        data.application ? null : data.applicationFormDraft?.currentSection ?? null
      }
      unreadMessages={data._count.notifications}
      interview={interview}
    />
  );
}
