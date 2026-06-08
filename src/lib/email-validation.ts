import { resolveMx } from "node:dns/promises";

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "grr.la",
  "sharklasers.com",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "throwaway.email",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "trashmail.com",
  "mailnesia.com",
  "mintemail.com",
  "emailondeck.com",
]);

const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeRegistrationEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isDisposableEmailDomain(email: string): boolean {
  const domain = normalizeRegistrationEmail(email).split("@")[1];
  if (!domain) return true;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

export async function domainHasMxRecords(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function validateRegistrationEmail(
  email: string
): Promise<{ ok: true; normalized: string } | { ok: false; error: string }> {
  const normalized = normalizeRegistrationEmail(email);

  if (!normalized || !EMAIL_FORMAT_RE.test(normalized)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (isDisposableEmailDomain(normalized)) {
    return {
      ok: false,
      error:
        "Disposable email addresses are not allowed. Use a real email account you can access.",
    };
  }

  const domain = normalized.split("@")[1];
  if (!(await domainHasMxRecords(domain))) {
    return {
      ok: false,
      error:
        "This email domain cannot receive messages. Use a registered email address from a real provider.",
    };
  }

  return { ok: true, normalized };
}
