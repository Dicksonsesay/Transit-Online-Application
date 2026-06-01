"use server";

import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { findStudentByPin } from "@/lib/student-auth";
import { setStudentSessionCookie } from "@/lib/student-session";

export type StudentLoginState = {
  error?: string;
};

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

    const valid = await bcrypt.compare(password, student.password);
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
    return { error: "Unable to sign in. Please try again." };
  }
}
