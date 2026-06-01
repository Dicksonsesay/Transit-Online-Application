import { prisma } from "@/lib/prisma";
import { mergeFormData } from "@/lib/application-form/defaults";
import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type { ApplicationFormData } from "@/types/application-form";

export async function getStudentAcceptanceLetter(studentId: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      fullname: true,
      application: {
        select: {
          applicationStatus: true,
          submittedAt: true,
          formPayload: true,
          programme: {
            select: {
              programmeName: true,
              department: true,
            },
          },
        },
      },
      acceptanceLetter: {
        select: {
          id: true,
          generatedAt: true,
          letterReference: true,
        },
      },
    },
  });

  if (!student?.application) return null;

  const formData = mergeFormData(
    migrateLegacyFormData(
      (student.application.formPayload as ApplicationFormData | null) ?? {}
    )
  );

  return {
    studentName: student.fullname,
    applicationStatus: student.application.applicationStatus,
    programmeName: student.application.programme.programmeName,
    programmeDepartment: student.application.programme.department,
    courseName: formData.enrolment?.firstChoiceCourse ?? null,
    admissionYear: String(student.application.submittedAt.getUTCFullYear()),
    letter: student.acceptanceLetter
      ? {
          id: student.acceptanceLetter.id,
          generatedAt: student.acceptanceLetter.generatedAt.toISOString(),
          letterReference: student.acceptanceLetter.letterReference,
        }
      : null,
  };
}
