import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export const EMAIL_VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

export type RegisterEmailSession = {
  email: string;
  fullname: string;
  codeHash: string;
  expiresAt: number;
  verified: boolean;
};

export type GoogleRegisterSession = RegisterEmailSession & {
  googleId: string;
};

export function generateEmailVerificationCode() {
  return String(randomInt(100000, 1000000));
}

function verificationSecret() {
  const secret = process.env.NEXTAUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }
  return secret;
}

export function normalizeEmailVerificationCode(code: string) {
  return code.replace(/\D/g, "").trim();
}

export function hashEmailVerificationCode(code: string) {
  return createHash("sha256")
    .update(`${verificationSecret()}:${normalizeEmailVerificationCode(code)}`)
    .digest("hex");
}

export function isEmailVerificationCodeValid(code: string, codeHash: string) {
  const normalized = normalizeEmailVerificationCode(code);
  if (!/^\d{6}$/.test(normalized)) {
    return false;
  }

  const expected = hashEmailVerificationCode(normalized);
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(codeHash, "utf8");
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export function parseRegisterEmailSession(
  raw: string | undefined
): RegisterEmailSession | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Partial<RegisterEmailSession>;
    const email = parsed.email?.trim().toLowerCase();
    const fullname = parsed.fullname?.trim();

    if (!email || !fullname || !parsed.expiresAt) {
      return undefined;
    }

    if (!parsed.verified && !parsed.codeHash) {
      return undefined;
    }

    return {
      email,
      fullname,
      codeHash: parsed.codeHash ?? "",
      expiresAt: parsed.expiresAt,
      verified: Boolean(parsed.verified),
    };
  } catch {
    return undefined;
  }
}

export function serializeRegisterEmailSession(session: RegisterEmailSession) {
  return JSON.stringify(session);
}

export function parseGoogleRegisterSession(
  raw: string | undefined
): GoogleRegisterSession | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as Partial<GoogleRegisterSession>;
    const base = parseRegisterEmailSession(raw);
    const googleId = parsed.googleId?.trim();

    if (!base || !googleId) {
      return undefined;
    }

    return {
      ...base,
      googleId,
    };
  } catch {
    return undefined;
  }
}

export function serializeGoogleRegisterSession(session: GoogleRegisterSession) {
  return JSON.stringify(session);
}

// Backward-compatible aliases used by Google registration flow.
export const GOOGLE_VERIFICATION_CODE_TTL_MS = EMAIL_VERIFICATION_CODE_TTL_MS;
export const generateGoogleVerificationCode = generateEmailVerificationCode;
export const normalizeGoogleVerificationCode = normalizeEmailVerificationCode;
export const hashGoogleVerificationCode = hashEmailVerificationCode;
export const isGoogleVerificationCodeValid = isEmailVerificationCodeValid;
