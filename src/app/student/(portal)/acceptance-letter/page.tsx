import Link from "next/link";
import { FiFileText } from "react-icons/fi";
import { redirect } from "next/navigation";
import StudentAcceptanceLetterView from "@/components/student/StudentAcceptanceLetterView";
import StudentPageHero from "@/components/student/ui/StudentPageHero";
import { requireStudentSession } from "@/lib/session";
import { getStudentAcceptanceLetter } from "@/lib/student-acceptance-letter";

export default async function AcceptanceLetterPage() {
  const session = await requireStudentSession();
  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    redirect("/auth/login");
  }

  const data = await getStudentAcceptanceLetter(studentId);
  if (!data) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <StudentPageHero
          badge="Acceptance letter"
          icon={FiFileText}
          title="No application found"
          description="Submit your admission application first. Your acceptance letter will be available here after you are admitted."
        />
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm ring-1 ring-slate-900/5 sm:px-10">
          <Link
            href="/student/application"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--hero-blue)] px-6 py-3 text-sm font-bold text-white hover:opacity-95"
          >
            Go to My Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StudentAcceptanceLetterView
      studentName={data.studentName}
      applicationStatus={data.applicationStatus}
      programmeName={data.programmeName}
      programmeDepartment={data.programmeDepartment}
      courseName={data.courseName}
      admissionYear={data.admissionYear}
      letter={data.letter}
    />
  );
}
