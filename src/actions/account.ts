"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, requireStudentSession } from "@/lib/session";
import { getSessionCookieName, setStudentSessionCookie } from "@/lib/student-session";

export type PasswordChangeState = {
  error?: string;
  success?: boolean;
};

export type ProfileUpdateState = {
  error?: string;
  success?: boolean;
};

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseSessionId(id: string | undefined) {
  const parsed = Number.parseInt(id ?? "", 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim() ?? "";
  return value || null;
}

async function setAdminSessionCookie(admin: {
  id: number;
  fullname: string;
  email: string;
  role: string;
}) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  const token = await encode({
    token: {
      sub: String(admin.id),
      id: String(admin.id),
      role: admin.role,
      name: admin.fullname,
      email: admin.email,
    },
    secret,
    maxAge: SESSION_MAX_AGE,
  });

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
  });
}

function readPasswordFields(formData: FormData) {
  return {
    currentPassword: formData.get("currentPassword")?.toString() ?? "",
    newPassword: formData.get("newPassword")?.toString() ?? "",
    confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
  };
}

function validateNewPasswordFields(
  newPassword: string,
  confirmPassword: string
) {
  if (!newPassword || !confirmPassword) {
    return "Complete all password fields.";
  }

  if (newPassword.length < 8) {
    return "New password must be at least 8 characters.";
  }

  if (newPassword !== confirmPassword) {
    return "New passwords do not match.";
  }

  return null;
}

function validatePasswordFields({
  currentPassword,
  newPassword,
  confirmPassword,
}: ReturnType<typeof readPasswordFields>) {
  if (!currentPassword) {
    return "Enter your current password.";
  }

  const newPasswordError = validateNewPasswordFields(newPassword, confirmPassword);
  if (newPasswordError) {
    return newPasswordError;
  }

  if (currentPassword === newPassword) {
    return "Choose a new password that is different from your current password.";
  }

  return null;
}

export async function changeStudentPasswordAction(
  _prevState: PasswordChangeState,
  formData: FormData
): Promise<PasswordChangeState> {
  const session = await requireStudentSession();
  if (!session) {
    return { error: "You must be signed in as a student." };
  }

  const studentId = parseSessionId(session.user.id);
  if (studentId === null) {
    return { error: "Invalid student session." };
  }

  const fields = readPasswordFields(formData);

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { password: true },
  });

  if (!student) {
    return { error: "Student account was not found." };
  }

  const passwordHash = student.password;
  const validationError = passwordHash
    ? validatePasswordFields(fields)
    : validateNewPasswordFields(fields.newPassword, fields.confirmPassword);

  if (validationError) {
    return { error: validationError };
  }

  if (passwordHash) {
    const currentPasswordIsValid = await bcrypt.compare(
      fields.currentPassword,
      passwordHash
    );

    if (!currentPasswordIsValid) {
      return { error: "Current password is incorrect." };
    }
  }

  const hashedPassword = await bcrypt.hash(fields.newPassword, 12);

  await prisma.student.update({
    where: { id: studentId },
    data: { password: hashedPassword },
  });

  revalidatePath("/student/change-password");
  revalidatePath("/student/profile");
  revalidatePath("/student");
  return { success: true };
}

export async function changeAdminPasswordAction(
  _prevState: PasswordChangeState,
  formData: FormData
): Promise<PasswordChangeState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const adminId = parseSessionId(session.user.id);
  if (adminId === null) {
    return { error: "Invalid admin session." };
  }

  const fields = readPasswordFields(formData);
  const validationError = validatePasswordFields(fields);
  if (validationError) {
    return { error: validationError };
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { password: true, status: true },
  });

  if (!admin || admin.status !== "active") {
    return { error: "Admin account was not found or is inactive." };
  }

  const currentPasswordIsValid = await bcrypt.compare(
    fields.currentPassword,
    admin.password
  );

  if (!currentPasswordIsValid) {
    return { error: "Current password is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(fields.newPassword, 12);

  await prisma.admin.update({
    where: { id: adminId },
    data: { password: hashedPassword },
  });

  revalidatePath("/admin/change-password");
  return { success: true };
}

export async function updateStudentProfileAction(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await requireStudentSession();
  if (!session) {
    return { error: "You must be signed in as a student." };
  }

  const studentId = parseSessionId(session.user.id);
  if (studentId === null) {
    return { error: "Invalid student session." };
  }

  const fullname = formData.get("fullname")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const genderRaw = formData.get("gender")?.toString().trim() ?? "";
  const dateOfBirthRaw = formData.get("dateOfBirth")?.toString().trim() ?? "";
  const phone = optionalText(formData, "phone");
  const address = optionalText(formData, "address");
  const nationality = optionalText(formData, "nationality");

  if (fullname.length < 2) {
    return { error: "Enter your full name." };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const gender =
    genderRaw === "male" || genderRaw === "female" || genderRaw === "other"
      ? genderRaw
      : null;

  const dateOfBirth = dateOfBirthRaw ? new Date(`${dateOfBirthRaw}T00:00:00Z`) : null;
  if (dateOfBirthRaw && Number.isNaN(dateOfBirth?.getTime())) {
    return { error: "Enter a valid date of birth." };
  }

  const existingEmail = await prisma.student.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      NOT: { id: studentId },
    },
    select: { id: true },
  });

  if (existingEmail) {
    return { error: "Another student account already uses this email." };
  }

  const updated = await prisma.student.update({
    where: { id: studentId },
    data: {
      fullname,
      email,
      gender,
      dateOfBirth,
      phone,
      address,
      nationality,
    },
    select: {
      id: true,
      fullname: true,
      email: true,
    },
  });

  await setStudentSessionCookie(updated);

  revalidatePath("/student/profile");
  return { success: true };
}

export async function updateAdminProfileAction(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const adminId = parseSessionId(session.user.id);
  if (adminId === null) {
    return { error: "Invalid admin session." };
  }

  const fullname = formData.get("fullname")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const phone = optionalText(formData, "phone");

  if (fullname.length < 2) {
    return { error: "Enter your full name." };
  }

  if (!emailPattern.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const existingEmail = await prisma.admin.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      NOT: { id: adminId },
    },
    select: { id: true },
  });

  if (existingEmail) {
    return { error: "Another admin account already uses this email." };
  }

  const updated = await prisma.admin.update({
    where: { id: adminId },
    data: {
      fullname,
      email,
      phone,
    },
    select: {
      id: true,
      fullname: true,
      email: true,
      role: true,
    },
  });

  await setAdminSessionCookie(updated);

  revalidatePath("/admin/profile");
  return { success: true };
}
