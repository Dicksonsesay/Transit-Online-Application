import type { NotificationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { buildStudentNotificationEmail } from "./templates";
import { sendEmail } from "./mailer";

export async function sendStudentNotificationEmail(input: {
  studentId: number;
  title: string;
  message: string;
  notificationType: NotificationType;
}): Promise<void> {
  const student = await prisma.student.findUnique({
    where: { id: input.studentId },
    select: { email: true, fullname: true },
  });

  if (!student?.email) {
    console.warn(
      `[email] No email on file for student ${input.studentId}; skipping.`
    );
    return;
  }

  const { subject, html, text } = buildStudentNotificationEmail({
    studentName: student.fullname,
    title: input.title,
    message: input.message,
    notificationType: input.notificationType,
  });

  await sendEmail({
    to: student.email,
    subject,
    html,
    text,
  });
}
