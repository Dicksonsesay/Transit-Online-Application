import { getNotificationHref } from "@/lib/notification-routes";
import type { NotificationType } from "@/generated/prisma/client";
import { getEmailConfig } from "./config";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notificationTypeLabel(type: NotificationType): string {
  switch (type) {
    case "interview":
      return "Interview update";
    case "acceptance":
      return "Offer of admission";
    case "rejection":
      return "Application decision";
    case "general":
    default:
      return "Portal notification";
  }
}

export function buildStudentNotificationEmail(input: {
  studentName: string;
  title: string;
  message: string;
  notificationType: NotificationType;
}): { subject: string; html: string; text: string } {
  const { collegeName, portalUrl } = getEmailConfig();
  const portalPath = getNotificationHref(input.notificationType);
  const actionUrl = `${portalUrl}${portalPath}`;
  const safeName = escapeHtml(input.studentName);
  const safeTitle = escapeHtml(input.title);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br />");
  const category = notificationTypeLabel(input.notificationType);

  const subject = `[${collegeName}] ${input.title}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#0a3d7a,#1e5aa8);padding:24px 28px;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f4b400;">${escapeHtml(collegeName)}</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;">${safeTitle}</h1>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${escapeHtml(category)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Dear ${safeName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">${safeMessage}</p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:999px;background:#1e5aa8;">
                    <a href="${actionUrl}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Open student portal</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#64748b;">
                You are receiving this email because you registered on the ${escapeHtml(collegeName)} Online Admission Portal.
                Sign in with the email address you used during registration to view full details.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">
                Transformation For Excellence · ${escapeHtml(collegeName)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${collegeName}\n\n${input.title}\n\nDear ${input.studentName},\n\n${input.message}\n\nOpen your portal: ${actionUrl}\n`;

  return { subject, html, text };
}

export function buildPasswordResetEmail(input: {
  studentName: string;
  resetUrl: string;
}): { subject: string; html: string; text: string } {
  const { collegeName } = getEmailConfig();
  const safeName = escapeHtml(input.studentName);
  const safeUrl = escapeHtml(input.resetUrl);
  const subject = `[${collegeName}] Reset your student portal password`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,#0a3d7a,#1e5aa8);padding:24px 28px;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#f4b400;">${escapeHtml(collegeName)}</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;">Password reset</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Dear ${safeName},</p>
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
                We received a request to reset the password for your student portal account.
                Click the button below to choose a new password. This link expires in one hour.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:999px;background:#1e5aa8;">
                    <a href="${safeUrl}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Reset password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#64748b;word-break:break-all;">
                Or copy this link into your browser:<br />
                <a href="${safeUrl}" style="color:#1e5aa8;">${safeUrl}</a>
              </p>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#64748b;">
                If you did not request a password reset, you can ignore this email. Your password will not change.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;">
                Transformation For Excellence · ${escapeHtml(collegeName)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${collegeName}\n\nPassword reset\n\nDear ${input.studentName},\n\nReset your password using this link (expires in 1 hour):\n${input.resetUrl}\n\nIf you did not request this, ignore this email.\n`;

  return { subject, html, text };
}
