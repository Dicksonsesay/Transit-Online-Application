import { buildPasswordResetEmail } from "./templates";
import { sendEmail } from "./mailer";

export async function sendPasswordResetEmail(input: {
  to: string;
  studentName: string;
  resetUrl: string;
}) {
  const { subject, html, text } = buildPasswordResetEmail({
    studentName: input.studentName,
    resetUrl: input.resetUrl,
  });

  return sendEmail({
    to: input.to,
    subject,
    html,
    text,
  });
}
