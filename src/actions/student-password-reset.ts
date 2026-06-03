"use server";

import bcrypt from "bcryptjs";
import { resolvePortalBaseUrl } from "@/lib/email/config";
import { sendPasswordResetEmail } from "@/lib/email/send-password-reset-email";
import {
  generatePasswordResetToken,
  getPasswordResetExpiry,
  hashPasswordResetToken,
} from "@/lib/password-reset";
import { prisma } from "@/lib/prisma";
import { findStudentByPinAndEmail } from "@/lib/student-auth";

export type ForgotPasswordState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export type ResetPasswordState = {
  error?: string;
  success?: boolean;
};

const RESET_SUCCESS_MESSAGE =
  "If an account matches your PIN and email, you will receive password reset instructions shortly. Check your inbox and spam folder.";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateNewPassword(newPassword: string, confirmPassword: string) {
  if (!newPassword || !confirmPassword) {
    return "Enter and confirm your new password.";
  }
  if (newPassword.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (newPassword !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
}

export async function requestStudentPasswordResetAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const pin = formData.get("pin")?.toString() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";

  if (!pin.trim() || !email) {
    return { error: "Enter your admission PIN and registered email." };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    const student = await findStudentByPinAndEmail(pin, email);

    if (
      student &&
      student.accountStatus !== "suspended" &&
      student.accountStatus !== "inactive"
    ) {
      const { token, tokenHash } = generatePasswordResetToken();
      const expiresAt = getPasswordResetExpiry();

      await prisma.passwordResetToken.deleteMany({
        where: { studentId: student.id },
      });

      await prisma.passwordResetToken.create({
        data: {
          studentId: student.id,
          tokenHash,
          expiresAt,
        },
      });

      const resetUrl = `${resolvePortalBaseUrl()}/auth/reset-password?token=${encodeURIComponent(token)}`;

      const emailResult = await sendPasswordResetEmail({
        to: student.email,
        studentName: student.fullname,
        resetUrl,
      });

      if (process.env.NODE_ENV === "development") {
        console.info("[password-reset] Reset link:", resetUrl);
        if (!emailResult.ok) {
          console.warn("[password-reset] Email delivery:", emailResult);
        }
      }
    }

    return { success: true, message: RESET_SUCCESS_MESSAGE };
  } catch (error) {
    console.error("[password-reset:request]", error);
    return {
      error: "Unable to process your request. Please try again or contact admissions.",
    };
  }
}

export async function resetStudentPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const token = formData.get("token")?.toString().trim() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (!token) {
    return {
      error: "Invalid or missing reset link. Request a new password reset email.",
    };
  }

  const validationError = validateNewPassword(newPassword, confirmPassword);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const tokenHash = hashPasswordResetToken(token);
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { student: { select: { id: true, accountStatus: true } } },
    });

    if (!record || record.expiresAt < new Date()) {
      return {
        error: "This reset link is invalid or has expired. Request a new password reset.",
      };
    }

    if (
      record.student.accountStatus === "suspended" ||
      record.student.accountStatus === "inactive"
    ) {
      return {
        error: "Your account is not active. Please contact admissions.",
      };
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.student.update({
        where: { id: record.studentId },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { studentId: record.studentId },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("[password-reset:reset]", error);
    return { error: "Unable to reset your password. Please try again." };
  }
}
