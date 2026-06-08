import { cookies } from "next/headers";
import { VERIFIED_PIN_COOKIE } from "@/lib/constants";
import { PinStatus, StudentAccountStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function generateApplicationNumber(id: number) {
  const year = new Date().getFullYear();
  return `TC-${year}-${String(id).padStart(5, "0")}`;
}

export type GoogleStudentProfile = {
  email: string;
  fullname: string;
  googleId: string;
};

export async function assertGoogleAccountCanRegister(
  profile: GoogleStudentProfile
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = profile.email.trim().toLowerCase();
  const googleId = profile.googleId.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Google did not provide a valid email address." };
  }

  const [existingGoogleId, existingEmail] = await Promise.all([
    prisma.student.findUnique({
      where: { googleId },
      select: { id: true, email: true },
    }),
    prisma.student.findUnique({
      where: { email },
      select: { id: true, googleId: true },
    }),
  ]);

  if (existingGoogleId) {
    return {
      ok: false,
      error:
        "This Google account is already linked to a student profile. Please log in instead.",
    };
  }

  if (existingEmail?.googleId && existingEmail.googleId !== googleId) {
    return {
      ok: false,
      error:
        "This email is already registered with a different Google account. Please log in or contact admissions.",
    };
  }

  if (existingEmail && !existingEmail.googleId) {
    return {
      ok: false,
      error:
        "An account with this email already exists. Log in with your PIN and password, or contact admissions.",
    };
  }

  return { ok: true };
}

export async function registerStudentWithGoogle(
  profile: GoogleStudentProfile
): Promise<{ success: true; studentId: number } | { success: false; error: string }> {
  const email = profile.email.trim().toLowerCase();
  const fullname = profile.fullname.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Google did not provide a valid email address." };
  }

  if (!fullname || fullname.length < 2) {
    return { success: false, error: "Google did not provide your full name." };
  }

  const cookieStore = await cookies();
  const verifiedPin = cookieStore.get(VERIFIED_PIN_COOKIE);

  if (!verifiedPin?.value) {
    return {
      success: false,
      error: "Please verify your PIN before creating an account with Google.",
    };
  }

  const pinId = Number.parseInt(verifiedPin.value, 10);
  if (Number.isNaN(pinId)) {
    return {
      success: false,
      error: "Invalid verification session. Verify your PIN again.",
    };
  }

  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    select: { id: true, status: true },
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

  const availability = await assertGoogleAccountCanRegister(profile);
  if (!availability.ok) {
    return { success: false, error: availability.error };
  }

  try {
    const student = await prisma.$transaction(async (tx) => {
      const created = await tx.student.create({
        data: {
          fullname,
          email,
          googleId: profile.googleId,
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
    return { success: true, studentId: student.id };
  } catch {
    return {
      success: false,
      error: "Could not create account with Google. Please try again.",
    };
  }
}

export async function loginStudentWithGoogle(
  profile: GoogleStudentProfile,
  expectedStudentId?: number
): Promise<{ success: true; studentId: number } | { success: false; error: string }> {
  const email = profile.email.trim().toLowerCase();

  if (!expectedStudentId) {
    return {
      success: false,
      error: "Enter your admission PIN, then sign in with Google.",
    };
  }

  const student = await prisma.student.findFirst({
    where: {
      id: expectedStudentId,
      OR: [{ googleId: profile.googleId }, { email }],
    },
    select: {
      id: true,
      googleId: true,
      accountStatus: true,
    },
  });

  if (!student) {
    return {
      success: false,
      error:
        "Google account does not match your PIN. Check your PIN and Google email, then try again.",
    };
  }

  if (
    student.accountStatus === StudentAccountStatus.suspended ||
    student.accountStatus === StudentAccountStatus.inactive
  ) {
    return {
      success: false,
      error: "Your account is not active. Please contact admissions.",
    };
  }

  if (!student.googleId) {
    const linkedElsewhere = await prisma.student.findUnique({
      where: { googleId: profile.googleId },
      select: { id: true },
    });

    if (linkedElsewhere && linkedElsewhere.id !== student.id) {
      return {
        success: false,
        error:
          "This Google account is already linked to another student profile. Use the correct Google account.",
      };
    }

    await prisma.student.update({
      where: { id: student.id },
      data: { googleId: profile.googleId },
    });
  }

  return { success: true, studentId: student.id };
}
