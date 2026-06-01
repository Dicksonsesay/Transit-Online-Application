import StudentInterviewView from "@/components/student/StudentInterviewView";
import { getStudentInterview } from "@/lib/student-interview";
import { requireStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Interview Schedule | Transit College",
};

export default async function InterviewPage() {
  const session = await requireStudentSession();
  if (!session) redirect("/auth/login");

  const studentId = Number.parseInt(session.user.id, 10);
  const interview = Number.isNaN(studentId)
    ? null
    : await getStudentInterview(studentId);

  return <StudentInterviewView interview={interview} />;
}
