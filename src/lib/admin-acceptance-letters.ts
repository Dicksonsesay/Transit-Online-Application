import { prisma } from "@/lib/prisma";
import { mergeFormData } from "@/lib/application-form/defaults";
import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type { ApplicationFormData } from "@/types/application-form";
import type { ProgrammeLevelChoice } from "@/types/application-form";

export type AcceptanceLetterCandidate = {
  studentId: number;
  applicationNumber: string | null;
  studentName: string;
  studentEmail: string;
  programmeName: string;
  programmeDepartment: string;
  courseName: string | null;
  programmeLevels: ProgrammeLevelChoice[];
  admissionYear: string;
  generatedAt: string | null;
  letterReference: string | null;
};

export async function listAcceptanceLetterCandidates(): Promise<
  AcceptanceLetterCandidate[]
> {
  const applications = await prisma.application.findMany({
    where: { applicationStatus: "accepted" },
    orderBy: { submittedAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          fullname: true,
          email: true,
          applicationNumber: true,
          acceptanceLetter: {
            select: {
              generatedAt: true,
              letterReference: true,
            },
          },
        },
      },
      programme: {
        select: { programmeName: true, department: true },
      },
    },
  });

  return applications.map((application) => {
    const payload = mergeFormData(
      migrateLegacyFormData(
        (application.formPayload as ApplicationFormData | null) ?? {}
      )
    );

    return {
      studentId: application.student.id,
      applicationNumber: application.student.applicationNumber,
      studentName: application.student.fullname,
      studentEmail: application.student.email,
      programmeName: application.programme.programmeName,
      programmeDepartment: application.programme.department,
      courseName: payload.enrolment?.firstChoiceCourse ?? null,
      programmeLevels: payload.enrolment?.programmeLevels ?? [],
      admissionYear: String(application.submittedAt.getUTCFullYear()),
      generatedAt: application.student.acceptanceLetter?.generatedAt.toISOString() ?? null,
      letterReference: application.student.acceptanceLetter?.letterReference ?? null,
    };
  });
}

export async function getAcceptanceLetterCandidateByStudentId(studentId: number) {
  const application = await prisma.application.findUnique({
    where: { studentId },
    include: {
      student: {
        select: {
          id: true,
          fullname: true,
          email: true,
          applicationNumber: true,
          acceptanceLetter: {
            select: {
              id: true,
              generatedAt: true,
              letterReference: true,
            },
          },
        },
      },
      programme: {
        select: { programmeName: true, department: true },
      },
    },
  });

  if (!application || application.applicationStatus !== "accepted") {
    return null;
  }

  const payload = mergeFormData(
    migrateLegacyFormData((application.formPayload as ApplicationFormData | null) ?? {})
  );

  return {
    studentId: application.student.id,
    applicationNumber: application.student.applicationNumber,
    studentName: application.student.fullname,
    studentEmail: application.student.email,
    programmeName: application.programme.programmeName,
    programmeDepartment: application.programme.department,
    courseName: payload.enrolment?.firstChoiceCourse ?? null,
    programmeLevels: payload.enrolment?.programmeLevels ?? [],
    admissionYear: String(application.submittedAt.getUTCFullYear()),
    letter: application.student.acceptanceLetter
      ? {
          id: application.student.acceptanceLetter.id,
          generatedAt: application.student.acceptanceLetter.generatedAt,
          letterReference: application.student.acceptanceLetter.letterReference,
        }
      : null,
  };
}
