import { buildGoogleVerificationEmail } from "./templates";
import { sendEmail } from "./mailer";

export async function sendGoogleVerificationEmail(input: {
  to: string;
  studentName: string;
  verificationCode: string;
}) {
  const { subject, html, text } = buildGoogleVerificationEmail({
    studentName: input.studentName,
    verificationCode: input.verificationCode,
  });

  return sendEmail({
    to: input.to,
    subject,
    html,
    text,
  });
}
