"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { GOOGLE_LOGIN_PIN_COOKIE } from "@/lib/constants";
import { mapDatabaseAuthError } from "@/lib/database-errors";
import { findStudentByPin } from "@/lib/student-auth";
import { setStudentSessionCookie } from "@/lib/student-session";

export type StudentLoginState = {
  error?: string;
};

export type PrepareGoogleLoginResult =
  | { success: true }
  | { success: false; error: string };

/** Store the PIN-verified student before redirecting to Google OAuth. */
export async function prepareGoogleLoginAction(
  pin: string
): Promise<PrepareGoogleLoginResult> {
  const trimmedPin = pin.trim();
  if (!trimmedPin) {
    return { success: false, error: "Enter your admission PIN before Google sign-in." };
  }

  try {
    const student = await findStudentByPin(trimmedPin);
    if (!student) {
      return {
        success: false,
        error: "Invalid PIN. Check your admission PIN and try again.",
      };
    }

    if (
      student.accountStatus === "suspended" ||
      student.accountStatus === "inactive"
    ) {
      return {
        success: false,
        error: "Your account is not active. Please contact admissions.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(GOOGLE_LOGIN_PIN_COOKIE, String(student.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        mapDatabaseAuthError(error) ??
        "Unable to verify your PIN for Google sign-in. Please try again.",
    };
  }
}

export async function loginStudentAction(
  _prevState: StudentLoginState,
  formData: FormData
): Promise<StudentLoginState> {
  const pin = formData.get("pin")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!pin.trim() || !password) {
    return { error: "Enter your PIN and password." };
  }

  if (!process.env.NEXTAUTH_SECRET) {
    return {
      error:
        "Server configuration error: NEXTAUTH_SECRET is missing. Add it to your .env file and restart the dev server.",
    };
  }

  try {
    const student = await findStudentByPin(pin);
    if (!student) {
      return { error: "Invalid PIN or password." };
    }

    if (
      student.accountStatus === "suspended" ||
      student.accountStatus === "inactive"
    ) {
      return {
        error: "Your account is not active. Please contact admissions.",
      };
    }

    if (!student.password) {
      return {
        error:
          "This account uses Google sign-in. Enter your PIN above, then click “Sign in with Google”.",
      };
    }

    const passwordHash = student.password;
    const valid = await bcrypt.compare(password, passwordHash);
    if (!valid) {
      return { error: "Invalid PIN or password." };
    }

    await setStudentSessionCookie({
      id: student.id,
      fullname: student.fullname,
      email: student.email,
    });

    redirect("/student");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        mapDatabaseAuthError(error) ??
        "Unable to sign in. Please try again.",
    };
  }
}
