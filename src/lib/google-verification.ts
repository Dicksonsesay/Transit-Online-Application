import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const GOOGLE_VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

export type GoogleRegisterSession = {
  email: string;
  fullname: string;
  googleId: string;
  codeHash: string;
  expiresAt: number;
  verified: boolean;
};

export function generateGoogleVerificationCode() {
  return String(randomInt(100000, 1000000));
}

function verificationSecret() {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }
  return secret;
}

export function hashGoogleVerificationCode(code: string) {
  return createHash("sha256")
    .update(`${verificationSecret()}:${code.trim()}`)
    .digest("hex");
}

export function isGoogleVerificationCodeValid(code: string, codeHash: string) {
  const normalized = code.trim();
  if (!/^\d{6}$/.test(normalized)) {
    return false;
  }

  const expected = hashGoogleVerificationCode(normalized);
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(codeHash, "utf8");
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function parseGoogleRegisterSession(
  raw: string | undefined
): GoogleRegisterSession | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Partial<GoogleRegisterSession>;
    const email = parsed.email?.trim().toLowerCase();
    const fullname = parsed.fullname?.trim();
    const googleId = parsed.googleId?.trim();

    if (!email || !fullname || !googleId || !parsed.expiresAt) {
      return undefined;
    }

    if (!parsed.verified && !parsed.codeHash) {
      return undefined;
    }

    return {
      email,
      fullname,
      googleId,
      codeHash: parsed.codeHash ?? "",
      expiresAt: parsed.expiresAt,
      verified: Boolean(parsed.verified),
    };
  } catch {
    return undefined;
  }
}

export function serializeGoogleRegisterSession(session: GoogleRegisterSession) {
  return JSON.stringify(session);
}
