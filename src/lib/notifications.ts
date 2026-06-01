import { sendStudentNotificationEmail } from "@/lib/email/send-student-notification-email";
import { getNotificationHref } from "@/lib/notification-routes";
import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/generated/prisma/client";

export { getNotificationHref } from "@/lib/notification-routes";

export type NavbarNotification = {
  id: number;
  title: string;
  message: string;
  href: string;
  createdAt: string;
  isRead: boolean;
  notificationType: NotificationType;
};

export async function createStudentNotification(input: {
  studentId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
}) {
  const notification = await prisma.notification.create({
    data: {
      studentId: input.studentId,
      title: input.title,
      message: input.message,
      notificationType: input.notificationType,
    },
  });

  try {
    await sendStudentNotificationEmail({
      studentId: input.studentId,
      title: input.title,
      message: input.message,
      notificationType: input.notificationType,
    });
  } catch (error) {
    console.error(
      "[notification] In-app notification saved but email delivery failed:",
      error
    );
  }

  return notification;
}

export async function getStudentNavbarNotifications(
  studentId: number,
  limit = 8
): Promise<NavbarNotification[]> {
  const rows = await prisma.notification.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      notificationType: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    notificationType: row.notificationType,
    createdAt: row.createdAt.toISOString(),
    href: getNotificationHref(row.notificationType),
  }));
}

export async function getRecentNotificationsForAdmin(limit = 10) {
  const rows = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      student: { select: { fullname: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    studentName: row.student.fullname,
    title: row.title,
    message: row.message,
    notificationType: row.notificationType,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getStudentNotifications(studentId: number) {
  const rows = await prisma.notification.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      notificationType: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    notificationType: row.notificationType,
    createdAt: row.createdAt.toISOString(),
    href: getNotificationHref(row.notificationType),
  }));
}
