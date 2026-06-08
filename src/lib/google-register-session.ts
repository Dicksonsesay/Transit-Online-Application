import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GOOGLE_REGISTER_COOKIE } from "@/lib/constants";
import { sendGoogleVerificationEmail } from "@/lib/email/send-google-verification-email";
import type { GoogleStudentProfile } from "@/lib/google-student-auth";
import {
  GOOGLE_VERIFICATION_CODE_TTL_MS,
  generateGoogleVerificationCode,
  hashGoogleVerificationCode,
  parseGoogleRegisterSession,
  serializeGoogleRegisterSession,
  type GoogleRegisterSession,
} from "@/lib/google-verification";

const GOOGLE_REGISTER_COOKIE_MAX_AGE = 60 * 15;

function getGoogleRegisterCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: GOOGLE_REGISTER_COOKIE_MAX_AGE,
    path: "/",
  };
}

export async function createGoogleRegisterVerification(
  profile: GoogleStudentProfile
): Promise<{ ok: true; session: GoogleRegisterSession } | { ok: false; error: string }> {
  const code = generateGoogleVerificationCode();
  const expiresAt = Date.now() + GOOGLE_VERIFICATION_CODE_TTL_MS;
  const session: GoogleRegisterSession = {
    email: profile.email,
    fullname: profile.fullname,
    googleId: profile.googleId,
    codeHash: hashGoogleVerificationCode(code),
    expiresAt,
    verified: false,
  };

  const emailResult = await sendGoogleVerificationEmail({
    to: profile.email,
    studentName: profile.fullname,
    verificationCode: code,
  });

  if (!emailResult.ok) {
    if (emailResult.skipped) {
      if (process.env.NODE_ENV === "development") {
        console.info(
          `[google-verify] SMTP not configured. Verification code for ${profile.email}: ${code}`
        );
      } else {
        return {
          ok: false,
          error:
            "Email service is not configured. Contact admissions to complete Google registration.",
        };
      }
    } else {
      return {
        ok: false,
        error: "Could not send the verification code. Please try again in a moment.",
      };
    }
  }

  return { ok: true, session };
}

export async function issueGoogleRegisterVerification(
  profile: GoogleStudentProfile
): Promise<{ ok: true } | { ok: false; error: string }> {
  const created = await createGoogleRegisterVerification(profile);
  if (!created.ok) {
    return created;
  }

  const cookieStore = await cookies();
  cookieStore.set(
    GOOGLE_REGISTER_COOKIE,
    serializeGoogleRegisterSession(created.session),
    getGoogleRegisterCookieOptions()
  );

  return { ok: true };
}

export function setGoogleRegisterSessionOnResponse(
  response: NextResponse,
  session: GoogleRegisterSession
) {
  response.cookies.set(
    GOOGLE_REGISTER_COOKIE,
    serializeGoogleRegisterSession(session),
    getGoogleRegisterCookieOptions()
  );
}

export async function readGoogleRegisterSession() {
  const cookieStore = await cookies();
  return parseGoogleRegisterSession(cookieStore.get(GOOGLE_REGISTER_COOKIE)?.value);
}

export async function markGoogleRegisterSessionVerified(
  session: GoogleRegisterSession
) {
  const cookieStore = await cookies();
  cookieStore.set(
    GOOGLE_REGISTER_COOKIE,
    serializeGoogleRegisterSession({
      ...session,
      verified: true,
      codeHash: "",
      expiresAt: Date.now() + GOOGLE_VERIFICATION_CODE_TTL_MS,
    }),
    getGoogleRegisterCookieOptions()
  );
}

export async function refreshGoogleRegisterVerificationCode(
  session: GoogleRegisterSession
): Promise<{ ok: true } | { ok: false; error: string }> {
  return issueGoogleRegisterVerification({
    email: session.email,
    fullname: session.fullname,
    googleId: session.googleId,
  });
}
