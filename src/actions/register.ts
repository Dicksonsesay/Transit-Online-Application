"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GOOGLE_REGISTER_COOKIE, VERIFIED_PIN_COOKIE } from "@/lib/constants";
import {
  markGoogleRegisterSessionVerified,
  readGoogleRegisterSession,
  refreshGoogleRegisterVerificationCode,
} from "@/lib/google-register-session";
import { registerStudentWithGoogle } from "@/lib/google-student-auth";
import { isGoogleVerificationCodeValid } from "@/lib/google-verification";
import { PinStatus, StudentAccountStatus } from "@/generated/prisma/client";
import { setStudentSessionCookie } from "@/lib/student-session";

export type RegisterInput = {
  fullname: string;
  email: string;
  password: string;
};

export type RegisterResult =
  | { success: true; email: string; pinCode: string }
  | { success: false; error: string };

export type RegisterFormState = {
  error?: string;
  success?: string;
};

export type GoogleVerifyFormState = {
  error?: string;
  success?: string;
};

function generateApplicationNumber(id: number) {
  const year = new Date().getFullYear();
  return `TC-${year}-${String(id).padStart(5, "0")}`;
}

export async function registerStudent(
  input: RegisterInput
): Promise<RegisterResult> {
  const fullname = input.fullname?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!fullname || fullname.length < 2) {
    return { success: false, error: "Please enter your full name." };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!password || password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters.",
    };
  }

  const cookieStore = await cookies();
  const verifiedPin = cookieStore.get(VERIFIED_PIN_COOKIE);

  if (!verifiedPin?.value) {
    return {
      success: false,
      error: "Please verify your PIN before creating an account.",
    };
  }

  const pinId = Number.parseInt(verifiedPin.value, 10);
  if (Number.isNaN(pinId)) {
    return { success: false, error: "Invalid verification session. Verify PIN again." };
  }

  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    select: { id: true, status: true, pinCode: true },
  });

  if (!pin) {
    return { success: false, error: "PIN not found. Please verify your PIN again." };
  }

  if (pin.status === PinStatus.used) {
    return {
      success: false,
      error: "This PIN has already been used. Please log in instead.",
    };
  }

  const existingEmail = await prisma.student.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingEmail) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const student = await prisma.$transaction(async (tx) => {
      const created = await tx.student.create({
        data: {
          fullname,
          email,
          password: hashedPassword,
          pinId: pin.id,
          accountStatus: StudentAccountStatus.active,
        },
      });

      await tx.pin.update({
        where: { id: pin.id },
        data: {
          status: PinStatus.used,
          usedByStudentId: created.id,
          usedAt: new Date(),
        },
      });

      return await tx.student.update({
        where: { id: created.id },
        data: {
          applicationNumber: generateApplicationNumber(created.id),
        },
      });
    });

    cookieStore.delete(VERIFIED_PIN_COOKIE);

    return { success: true, email: student.email, pinCode: pin.pinCode };
  } catch {
    return {
      success: false,
      error: "Could not create account. Please try again.",
    };
  }
}

export async function verifyGoogleEmailCodeAction(
  _prevState: GoogleVerifyFormState,
  formData: FormData
): Promise<GoogleVerifyFormState> {
  const code = formData.get("verificationCode")?.toString().trim() ?? "";
  const session = await readGoogleRegisterSession();

  if (!session) {
    return {
      error: "Google verification expired. Please sign in with Google again.",
    };
  }

  if (session.verified) {
    return { success: "Your Google email is already verified. You can create your account." };
  }

  if (Date.now() > session.expiresAt) {
    return {
      error: "This verification code has expired. Click “Resend code” to get a new one.",
    };
  }

  if (!isGoogleVerificationCodeValid(code, session.codeHash)) {
    return { error: "Invalid verification code. Check your email and try again." };
  }

  await markGoogleRegisterSessionVerified(session);
  return {
    success: "Google email verified. You can now create your student account.",
  };
}

export async function resendGoogleVerificationCodeAction(): Promise<GoogleVerifyFormState> {
  const session = await readGoogleRegisterSession();

  if (!session) {
    return {
      error: "Google verification expired. Please sign in with Google again.",
    };
  }

  if (session.verified) {
    return { success: "Your Google email is already verified." };
  }

  const result = await refreshGoogleRegisterVerificationCode(session);
  if (!result.ok) {
    return { error: result.error };
  }

  return {
    success: `A new verification code has been sent to ${session.email}.`,
  };
}

/** Complete registration after Google identity verification. */
export async function registerWithGoogleAction(
  _prevState: RegisterFormState,
  _formData: FormData
): Promise<RegisterFormState> {
  const session = await readGoogleRegisterSession();

  if (!session) {
    return {
      error: "Google verification expired. Please sign in with Google again.",
    };
  }

  if (!session.verified) {
    return {
      error: "Enter the verification code sent to your Google email before creating your account.",
    };
  }

  const profile = {
    email: session.email,
    fullname: session.fullname,
    googleId: session.googleId,
  };

  const result = await registerStudentWithGoogle(profile);

  if (!result.success) {
    return { error: result.error };
  }

  if (!process.env.NEXTAUTH_SECRET) {
    return {
      error:
        "Account created but NEXTAUTH_SECRET is missing from .env. Please log in with Google.",
    };
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: result.studentId },
      select: { id: true, fullname: true, email: true },
    });

    if (!student) {
      return { error: "Account created but session failed. Please log in." };
    }

    cookieStore.delete(GOOGLE_REGISTER_COOKIE);
    await setStudentSessionCookie(student);
    redirect("/student");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Account created but sign-in failed. Please log in." };
  }
}

/** Clear Google pre-fill and return to manual registration. */
export async function clearGoogleRegisterAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GOOGLE_REGISTER_COOKIE);
  redirect("/auth/register");
}

/** Register account, set session cookie, and redirect to student dashboard. */
export async function registerStudentAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const fullname = formData.get("fullname")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const result = await registerStudent({ fullname, email, password });

  if (!result.success) {
    return { error: result.error };
  }

  if (!process.env.NEXTAUTH_SECRET) {
    return {
      error:
        "Account created but NEXTAUTH_SECRET is missing from .env. Add it and log in with your PIN.",
    };
  }

  try {
    const student = await prisma.student.findFirst({
      where: { email: result.email },
      select: { id: true, fullname: true, email: true },
    });

    if (!student) {
      return { error: "Account created but session failed. Please log in." };
    }

    await setStudentSessionCookie(student);
    redirect("/student");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Account created but sign-in failed. Please log in." };
  }
}
