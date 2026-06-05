"use server";

import { revalidatePath } from "next/cache";
import { createStudentNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { getAcceptanceLetterCandidateByStudentId } from "@/lib/admin-acceptance-letters";

function buildLetterReference(studentId: number) {
  const year = new Date().getUTCFullYear();
  const nonce = String(Date.now()).slice(-6);
  return `TCSL-AL-${year}-${studentId}-${nonce}`;
}

async function upsertAcceptanceLetter(studentId: number, adminId: number) {
  const reference = buildLetterReference(studentId);

  return prisma.acceptanceLetter.upsert({
    where: { studentId },
    update: {
      generatedById: adminId,
      generatedAt: new Date(),
      letterReference: reference,
      pdfPath: `/api/admin/acceptance-letters/${studentId}/pdf?download=1`,
    },
    create: {
      studentId,
      generatedById: adminId,
      generatedAt: new Date(),
      letterReference: reference,
      pdfPath: `/api/admin/acceptance-letters/${studentId}/pdf?download=1`,
    },
  });
}

export async function generateAcceptanceLetterAction(studentId: number) {
  const session = await requireAdminSession();
  if (!session) return { error: "You must be signed in as an admin." };

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Invalid applicant." };
  }

  const candidate = await getAcceptanceLetterCandidateByStudentId(studentId);
  if (!candidate) {
    return { error: "Applicant must be accepted before generating a letter." };
  }

  const adminId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(adminId)) {
    return { error: "Invalid admin session." };
  }

  const letter = await upsertAcceptanceLetter(studentId, adminId);

  revalidatePath("/admin/acceptance-letters");
  revalidatePath("/admin/applicants");
  revalidatePath(`/admin/applicants/${studentId}`);
  revalidatePath("/student/acceptance-letter");

  return { success: true, letterReference: letter.letterReference };
}

export async function sendAcceptanceLetterAction(studentId: number) {
  const session = await requireAdminSession();
  if (!session) return { error: "You must be signed in as an admin." };

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Invalid applicant." };
  }

  const candidate = await getAcceptanceLetterCandidateByStudentId(studentId);
  if (!candidate) {
    return { error: "Applicant must be accepted before sending a letter." };
  }

  const adminId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(adminId)) {
    return { error: "Invalid admin session." };
  }

  const letter = await upsertAcceptanceLetter(studentId, adminId);

  await createStudentNotification({
    studentId,
    notificationType: "acceptance",
    title: "Offer of Admission Available",
    message:
      "Congratulations! Your offer of admission has been published. Open your student portal to view or download it. A copy of this notice has been sent to your registered email.",
  });

  revalidatePath("/admin/acceptance-letters");
  revalidatePath("/student");
  revalidatePath("/student/messages");
  revalidatePath("/student/acceptance-letter");

  return { success: true, letterReference: letter.letterReference };
}
