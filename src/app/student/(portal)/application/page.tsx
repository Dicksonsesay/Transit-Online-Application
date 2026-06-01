import ApplicationWizard from "@/components/student/application/ApplicationWizard";
import SubmittedApplicationView from "@/components/student/application/SubmittedApplicationView";
import { getStudentApplicationContext } from "@/lib/application-form/db";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Application | Transit College",
};

export default async function ApplicationPage() {
  const session = await requireStudentSession();
  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    redirect("/auth/login");
  }

  const ctx = await getStudentApplicationContext(studentId);

  if (ctx.isSubmitted && ctx.application) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { applicationNumber: true },
    });

    return (
      <SubmittedApplicationView
        status={ctx.application.applicationStatus}
        submittedAt={ctx.application.submittedAt}
        applicationNumber={student?.applicationNumber ?? null}
      />
    );
  }

  return (
    <ApplicationWizard
      initialSection={ctx.draft.currentSection}
      initialData={ctx.draft.formData}
    />
  );
}
