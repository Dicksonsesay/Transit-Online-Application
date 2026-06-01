export type EmailConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo: string | undefined;
  portalUrl: string;
  collegeName: string;
};

export function isEmailConfigured(): boolean {
  if (process.env.EMAIL_ENABLED === "false") return false;
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS
  );
}

export function getEmailConfig(): EmailConfig {
  const portalUrl =
    process.env.PORTAL_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3000";

  const collegeName =
    process.env.APP_NAME?.trim() || "Transit College Sierra Leone";

  const from =
    process.env.EMAIL_FROM?.trim() ||
    `"${collegeName} Admissions" <noreply@transitcollege.sl>`;

  return {
    enabled: isEmailConfigured(),
    host: process.env.SMTP_HOST?.trim() ?? "",
    port: Number.parseInt(process.env.SMTP_PORT ?? "587", 10) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER?.trim() ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from,
    replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
    portalUrl: portalUrl.replace(/\/$/, ""),
    collegeName,
  };
}
