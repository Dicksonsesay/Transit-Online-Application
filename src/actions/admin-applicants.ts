"use server";

import { revalidatePath } from "next/cache";
import { applicationStatusLabel } from "@/lib/application-status";
import { createStudentNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { ApplicationStatus } from "@/generated/prisma/client";

const ALLOWED_STATUSES = new Set<ApplicationStatus>([
  "submitted",
  "under_review",
  "interview_scheduled",
  "interviewed",
  "accepted",
  "rejected",
]);

export async function updateApplicationStatusAction(
  studentId: number,
  status: ApplicationStatus
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Invalid applicant." };
  }

  if (!ALLOWED_STATUSES.has(status)) {
    return { error: "Invalid status." };
  }

  const application = await prisma.application.findUnique({
    where: { studentId },
    select: { id: true },
  });

  if (!application) {
    return { error: "Application not found." };
  }

  await prisma.application.update({
    where: { studentId },
    data: { applicationStatus: status },
  });

  const notificationType =
    status === "accepted"
      ? "acceptance"
      : status === "rejected"
        ? "rejection"
        : "general";

  await createStudentNotification({
    studentId,
    notificationType,
    title: `Application status: ${applicationStatusLabel[status]}`,
    message: `Your application status has been updated to "${applicationStatusLabel[status]}". Sign in to your portal for details. This update has also been sent to your registered email.`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/applicants");
  revalidatePath(`/admin/applicants/${studentId}`);
  revalidatePath("/student");
  revalidatePath("/student/messages");
  revalidatePath("/student/status");

  if (status === "accepted") {
    revalidatePath("/admin/offer-admission");
    revalidatePath("/student/offer-admission");
  }

  return { success: true };
}

export async function decideApplicantAfterInterviewAction(
  studentId: number,
  decision: "accepted" | "rejected"
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Invalid applicant." };
  }

  const application = await prisma.application.findUnique({
    where: { studentId },
    select: { applicationStatus: true },
  });

  if (!application) {
    return { error: "Application not found." };
  }

  if (application.applicationStatus !== "interviewed") {
    return {
      error: "Only applicants who have completed their interview can be accepted or rejected here.",
    };
  }

  return updateApplicationStatusAction(studentId, decision);
}
