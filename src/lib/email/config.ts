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

function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Public base URL for links in emails and redirects.
 * On Vercel, prefers VERCEL_* when PORTAL_URL / NEXTAUTH_URL still point at localhost.
 */
export function resolvePortalBaseUrl(): string {
  const isDeployed =
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production";

  const fromEnv = [
    process.env.PORTAL_URL?.trim(),
    process.env.NEXTAUTH_URL?.trim(),
  ].filter((v): v is string => Boolean(v));

  for (const raw of fromEnv) {
    const url = normalizeBaseUrl(raw);
    if (isDeployed && isLocalhostUrl(url)) continue;
    return url;
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return normalizeBaseUrl(vercelProduction);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return normalizeBaseUrl(vercelUrl);
  }

  return "http://localhost:3000";
}

export function isEmailConfigured(): boolean {
  if (process.env.EMAIL_ENABLED === "false") return false;
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS
  );
}

export function getEmailConfig(): EmailConfig {
  const portalUrl = resolvePortalBaseUrl();

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
    portalUrl,
    collegeName,
  };
}
