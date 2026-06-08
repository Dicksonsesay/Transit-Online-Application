import { prisma } from "@/lib/prisma";

export function normalizeReceiptNumber(receiptNumber: string): string {
  return receiptNumber.trim().toUpperCase();
}

export function buildAutoReceiptNumber(pinId: number, createdAt: Date = new Date()): string {
  const year = createdAt.getFullYear();
  return `RCP-${year}-${String(pinId).padStart(5, "0")}`;
}

export async function isReceiptNumberTaken(
  receiptNumber: string,
  excludePinId?: number
): Promise<boolean> {
  const normalized = normalizeReceiptNumber(receiptNumber);
  if (!normalized) return false;

  const existing = await prisma.pin.findFirst({
    where: {
      receiptNumber: { equals: normalized, mode: "insensitive" },
      ...(excludePinId ? { NOT: { id: excludePinId } } : {}),
    },
    select: { id: true },
  });

  return Boolean(existing);
}
