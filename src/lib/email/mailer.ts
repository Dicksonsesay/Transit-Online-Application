import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { getEmailConfig, isEmailConfigured } from "./config";

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter | null {
  if (!isEmailConfigured()) return null;
  if (cachedTransport) return cachedTransport;

  const config = getEmailConfig();
  cachedTransport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return cachedTransport;
}

export type SendEmailResult =
  | { ok: true; messageId?: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

export async function sendEmail(
  options: Mail.Options
): Promise<SendEmailResult> {
  const config = getEmailConfig();

  if (!config.enabled) {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[email:skipped] SMTP not configured —",
        options.to,
        options.subject
      );
    }
    return {
      ok: false,
      skipped: true,
      reason: "SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env.",
    };
  }

  const transport = getTransport();
  if (!transport) {
    return { ok: false, skipped: true, reason: "Email transport unavailable." };
  }

  try {
    const info = await transport.sendMail({
      from: config.from,
      replyTo: config.replyTo,
      ...options,
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    console.error("[email:error]", message);
    return { ok: false, skipped: false, error: message };
  }
}
