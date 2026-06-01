import { prisma } from "@/lib/prisma";

export function normalizePinCode(pinCode: string) {
  return pinCode.trim().toUpperCase();
}

export async function findStudentByPin(pinCode: string) {
  const normalized = normalizePinCode(pinCode);
  if (!normalized) return null;

  return prisma.student.findFirst({
    where: {
      OR: [
        { pin: { pinCode: { equals: normalized, mode: "insensitive" } } },
        { usedPin: { pinCode: { equals: normalized, mode: "insensitive" } } },
      ],
    },
  });
}
