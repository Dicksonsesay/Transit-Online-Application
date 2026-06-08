import { prisma } from "@/lib/prisma";
import type { PinStatus } from "@/generated/prisma/client";

export type PinListItem = {
  id: number;
  pinCode: string;
  receiptNumber: string | null;
  amount: string;
  status: PinStatus;
  createdAt: string;
  usedAt: string | null;
  generatedByName: string;
  usedByStudentName: string | null;
  usedByStudentEmail: string | null;
};

export async function listAdmissionPins(): Promise<PinListItem[]> {
  const pins = await prisma.pin.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      generatedBy: { select: { fullname: true } },
      usedByStudent: {
        select: { fullname: true, email: true },
      },
    },
  });

  return pins.map((pin) => ({
    id: pin.id,
    pinCode: pin.pinCode,
    receiptNumber: pin.receiptNumber,
    amount: pin.amount.toString(),
    status: pin.status,
    createdAt: pin.createdAt.toISOString(),
    usedAt: pin.usedAt?.toISOString() ?? null,
    generatedByName: pin.generatedBy.fullname,
    usedByStudentName: pin.usedByStudent?.fullname ?? null,
    usedByStudentEmail: pin.usedByStudent?.email ?? null,
  }));
}

export async function getPinStats() {
  const [unused, used, total] = await Promise.all([
    prisma.pin.count({ where: { status: "unused" } }),
    prisma.pin.count({ where: { status: "used" } }),
    prisma.pin.count(),
  ]);
  return { unused, used, total };
}

export async function getPinReceiptData(pinId: number) {
  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    include: {
      generatedBy: { select: { fullname: true } },
    },
  });

  if (!pin) return null;

  return {
    pinCode: pin.pinCode,
    receiptNumber:
      pin.receiptNumber ??
      `RCP-${new Date().getFullYear()}-${String(pin.id).padStart(5, "0")}`,
    amount: pin.amount.toString(),
    generatedByName: pin.generatedBy.fullname,
    createdAt: pin.createdAt.toISOString(),
  };
}
