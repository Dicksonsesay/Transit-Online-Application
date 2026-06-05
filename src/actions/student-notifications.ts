"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/session";

function getStudentId(sessionUserId: string | undefined): number | null {
  const id = Number.parseInt(sessionUserId ?? "", 10);
  return Number.isNaN(id) ? null : id;
}

export async function markNotificationReadAction(
  notificationId: number
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireStudentSession();
  if (!session) return { error: "You must be signed in." };

  const studentId = getStudentId(session.user.id);
  if (studentId === null) return { error: "Invalid session." };

  if (!Number.isInteger(notificationId) || notificationId < 1) {
    return { error: "Invalid notification." };
  }

  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, studentId },
    select: { id: true },
  });

  if (!notification) return { error: "Notification not found." };

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  revalidatePath("/student");
  revalidatePath("/student/messages");

  return { success: true };
}

export async function markAllNotificationsReadAction(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const session = await requireStudentSession();
  if (!session) return { error: "You must be signed in." };

  const studentId = getStudentId(session.user.id);
  if (studentId === null) return { error: "Invalid session." };

  await prisma.notification.updateMany({
    where: { studentId, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/student");
  revalidatePath("/student/messages");

  return { success: true };
}

export async function deleteNotificationAction(
  notificationId: number
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireStudentSession();
  if (!session) return { error: "You must be signed in." };

  const studentId = getStudentId(session.user.id);
  if (studentId === null) return { error: "Invalid session." };

  if (!Number.isInteger(notificationId) || notificationId < 1) {
    return { error: "Invalid notification." };
  }

  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, studentId },
    select: { id: true },
  });

  if (!notification) return { error: "Notification not found." };

  await prisma.notification.delete({
    where: { id: notificationId },
  });

  revalidatePath("/student");
  revalidatePath("/student/messages");
  revalidatePath("/student/offer-admission");
  revalidatePath("/student/interview");

  return { success: true };
}
