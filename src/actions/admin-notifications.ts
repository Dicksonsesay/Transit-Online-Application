"use server";

import { revalidatePath } from "next/cache";
import { createStudentNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import type { NotificationType } from "@/generated/prisma/client";

const ALLOWED_TYPES = new Set<NotificationType>([
  "interview",
  "acceptance",
  "rejection",
  "general",
]);

export async function sendStudentNotificationAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) return { error: "You must be signed in as an admin." };

  const studentId = Number.parseInt(formData.get("studentId")?.toString() ?? "", 10);
  const title = formData.get("title")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";
  const notificationType = formData.get("notificationType")?.toString() as NotificationType;

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Select a student." };
  }

  if (!title || title.length < 3) {
    return { error: "Enter a notification title (at least 3 characters)." };
  }

  if (!message || message.length < 5) {
    return { error: "Enter a message (at least 5 characters)." };
  }

  if (!ALLOWED_TYPES.has(notificationType)) {
    return { error: "Invalid notification type." };
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });

  if (!student) return { error: "Student not found." };

  await createStudentNotification({
    studentId,
    title,
    message,
    notificationType,
  });

  revalidatePath("/admin/notifications");
  revalidatePath("/student/messages");
  revalidatePath("/student");

  return { success: true };
}
