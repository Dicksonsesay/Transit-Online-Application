import { prisma } from "@/lib/prisma";

export function normalizePinCode(pinCode: string) {
  return pinCode.trim().toUpperCase();
}

const studentPinWhere = (normalizedPin: string) => ({
  OR: [
    { pin: { pinCode: { equals: normalizedPin, mode: "insensitive" as const } } },
    { usedPin: { pinCode: { equals: normalizedPin, mode: "insensitive" as const } } },
  ],
});

export async function findStudentByPin(pinCode: string) {
  const normalized = normalizePinCode(pinCode);
  if (!normalized) return null;

  return prisma.student.findFirst({
    where: studentPinWhere(normalized),
  });
}

export async function findStudentByPinAndEmail(pinCode: string, email: string) {
  const normalized = normalizePinCode(pinCode);
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalized || !normalizedEmail) return null;

  return prisma.student.findFirst({
    where: {
      email: { equals: normalizedEmail, mode: "insensitive" },
      ...studentPinWhere(normalized),
    },
  });
}
