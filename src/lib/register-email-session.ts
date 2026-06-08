import { cookies } from "next/headers";
import { REGISTER_EMAIL_COOKIE } from "@/lib/constants";
import { sendRegisterVerificationEmail } from "@/lib/email/send-register-verification-email";
import {
  EMAIL_VERIFICATION_CODE_TTL_MS,
  generateEmailVerificationCode,
  hashEmailVerificationCode,
  parseRegisterEmailSession,
  serializeRegisterEmailSession,
  type RegisterEmailSession,
} from "@/lib/email-verification";

const REGISTER_EMAIL_COOKIE_MAX_AGE = 60 * 15;

function getRegisterEmailCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: REGISTER_EMAIL_COOKIE_MAX_AGE,
    path: "/",
  };
}

export async function createRegisterEmailVerification(input: {
  email: string;
  fullname: string;
}): Promise<{ ok: true; session: RegisterEmailSession } | { ok: false; error: string }> {
  const code = generateEmailVerificationCode();
  const expiresAt = Date.now() + EMAIL_VERIFICATION_CODE_TTL_MS;
  const session: RegisterEmailSession = {
    email: input.email,
    fullname: input.fullname,
    codeHash: hashEmailVerificationCode(code),
    expiresAt,
    verified: false,
  };

  const emailResult = await sendRegisterVerificationEmail({
    to: input.email,
    studentName: input.fullname,
    verificationCode: code,
  });

  if (!emailResult.ok) {
    if (emailResult.skipped) {
      if (process.env.NODE_ENV === "development") {
        console.info(
          `[register-email-verify] SMTP not configured. Verification code for ${input.email}: ${code}`
        );
      } else {
        return {
          ok: false,
          error:
            "Email service is not configured. Contact admissions to complete registration.",
        };
      }
    } else {
      return {
        ok: false,
        error:
          "Could not deliver the verification code. Check the email address and try again.",
      };
    }
  }

  return { ok: true, session };
}

export async function issueRegisterEmailVerification(input: {
  email: string;
  fullname: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const created = await createRegisterEmailVerification(input);
  if (!created.ok) {
    return created;
  }

  const cookieStore = await cookies();
  cookieStore.set(
    REGISTER_EMAIL_COOKIE,
    serializeRegisterEmailSession(created.session),
    getRegisterEmailCookieOptions()
  );

  return { ok: true };
}

export async function readRegisterEmailSession() {
  const cookieStore = await cookies();
  return parseRegisterEmailSession(cookieStore.get(REGISTER_EMAIL_COOKIE)?.value);
}

export async function markRegisterEmailSessionVerified(session: RegisterEmailSession) {
  const cookieStore = await cookies();
  cookieStore.set(
    REGISTER_EMAIL_COOKIE,
    serializeRegisterEmailSession({
      ...session,
      verified: true,
      codeHash: "",
      expiresAt: Date.now() + EMAIL_VERIFICATION_CODE_TTL_MS,
    }),
    getRegisterEmailCookieOptions()
  );
}

export async function refreshRegisterEmailVerificationCode(
  session: RegisterEmailSession
): Promise<{ ok: true } | { ok: false; error: string }> {
  return issueRegisterEmailVerification({
    email: session.email,
    fullname: session.fullname,
  });
}

export async function clearRegisterEmailSession() {
  const cookieStore = await cookies();
  cookieStore.delete(REGISTER_EMAIL_COOKIE);
}
