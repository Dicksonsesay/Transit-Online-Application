import { buildRegisterEmailVerificationEmail } from "./templates";
import { sendEmail } from "./mailer";

export async function sendRegisterVerificationEmail(input: {
  to: string;
  studentName: string;
  verificationCode: string;
}) {
  const { subject, html, text } = buildRegisterEmailVerificationEmail({
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
