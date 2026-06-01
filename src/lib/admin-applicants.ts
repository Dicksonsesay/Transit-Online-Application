import { prisma } from "@/lib/prisma";
import { mergeFormData } from "@/lib/application-form/defaults";
import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type { ApplicationFormData } from "@/types/application-form";
import type { ApplicationStatus } from "@/generated/prisma/client";

export type ApplicantListItem = {
  studentId: number;
  applicationId: number;
  applicationNumber: string | null;
  fullname: string;
  email: string;
  phone: string | null;
  programmeName: string;
  firstChoiceCourse: string | null;
  applicationStatus: ApplicationStatus;
  submittedAt: string;
};

export type ApplicantDetail = {
  studentId: number;
  applicationId: number;
  applicationNumber: string | null;
  fullname: string;
  email: string;
  phone: string | null;
  gender: string | null;
  passportPhoto: string | null;
  programmeName: string;
  programmeDepartment: string;
  applicationStatus: ApplicationStatus;
  submittedAt: string;
  formData: ApplicationFormData;
  uploadedDocuments: { documentType: string; filePath: string; uploadedAt: string }[];
};

export async function getApplicantStats() {
  const [
    total,
    submitted,
    underReview,
    accepted,
    rejected,
    interviewsScheduled,
    interviewsCompleted,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { applicationStatus: "submitted" } }),
    prisma.application.count({ where: { applicationStatus: "under_review" } }),
    prisma.application.count({ where: { applicationStatus: "accepted" } }),
    prisma.application.count({ where: { applicationStatus: "rejected" } }),
    prisma.interview.count({ where: { interviewStatus: "scheduled" } }),
    prisma.interview.count({ where: { interviewStatus: "completed" } }),
  ]);

  return {
    total,
    submitted,
    underReview,
    accepted,
    rejected,
    interviewsScheduled,
    interviewsCompleted,
  };
}

export async function listApplicants(): Promise<ApplicantListItem[]> {
  const applications = await prisma.application.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          applicationNumber: true,
          fullname: true,
          email: true,
          phone: true,
        },
      },
      programme: { select: { programmeName: true } },
    },
  });

  return applications.map((app) => {
    const payload = migrateLegacyFormData(
      (app.formPayload as ApplicationFormData | null) ?? {}
    );

    return {
      studentId: app.student.id,
      applicationId: app.id,
      applicationNumber: app.student.applicationNumber,
      fullname: app.student.fullname,
      email: app.student.email,
      phone: app.student.phone,
      programmeName: app.programme.programmeName,
      firstChoiceCourse: payload.enrolment?.firstChoiceCourse ?? null,
      applicationStatus: app.applicationStatus,
      submittedAt: app.submittedAt.toISOString(),
    };
  });
}

export async function getApplicantByStudentId(
  studentId: number
): Promise<ApplicantDetail | null> {
  const application = await prisma.application.findUnique({
    where: { studentId },
    include: {
      student: {
        select: {
          id: true,
          applicationNumber: true,
          fullname: true,
          email: true,
          phone: true,
          gender: true,
          passportPhoto: true,
        },
      },
      programme: {
        select: { programmeName: true, department: true },
      },
    },
  });

  if (!application) return null;

  const uploads = await prisma.uploadedDocument.findMany({
    where: { studentId },
    orderBy: { uploadedAt: "desc" },
    select: { documentType: true, filePath: true, uploadedAt: true },
  });

  const formData = mergeFormData(
    migrateLegacyFormData(
      (application.formPayload as ApplicationFormData | null) ?? {}
    )
  );

  return {
    studentId: application.student.id,
    applicationId: application.id,
    applicationNumber: application.student.applicationNumber,
    fullname: application.student.fullname,
    email: application.student.email,
    phone: application.student.phone,
    gender: application.student.gender,
    passportPhoto: application.student.passportPhoto,
    programmeName: application.programme.programmeName,
    programmeDepartment: application.programme.department,
    applicationStatus: application.applicationStatus,
    submittedAt: application.submittedAt.toISOString(),
    formData,
    uploadedDocuments: uploads.map((u) => ({
      documentType: u.documentType,
      filePath: u.filePath,
      uploadedAt: u.uploadedAt.toISOString(),
    })),
  };
}

export async function getRecentApplicants(limit = 5): Promise<ApplicantListItem[]> {
  const all = await listApplicants();
  return all.slice(0, limit);
}
