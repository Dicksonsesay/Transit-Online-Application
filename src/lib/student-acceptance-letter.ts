import { prisma } from "@/lib/prisma";
import { mergeFormData } from "@/lib/application-form/defaults";
import { resolveApplicantProgrammeDisplay } from "@/lib/application-form/programme-resolution";
import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type { ApplicationFormData, ProgrammeLevelChoice } from "@/types/application-form";

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
          publishedAt: true,
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

  const publishedLetter =
    student.acceptanceLetter?.publishedAt != null
      ? {
          id: student.acceptanceLetter.id,
          generatedAt: student.acceptanceLetter.generatedAt.toISOString(),
          publishedAt: student.acceptanceLetter.publishedAt.toISOString(),
          letterReference: student.acceptanceLetter.letterReference,
        }
      : null;

  return {
    studentName: student.fullname,
    applicationStatus: student.application.applicationStatus,
    programmeName: resolveApplicantProgrammeDisplay(
      formData.enrolment,
      student.application.programme.programmeName
    ),
    programmeDepartment: student.application.programme.department,
    courseName: formData.enrolment?.firstChoiceCourse ?? null,
    programmeLevels: (formData.enrolment?.programmeLevels ?? []) as ProgrammeLevelChoice[],
    admissionYear: String(student.application.submittedAt.getUTCFullYear()),
    letter: publishedLetter,
  };
}
