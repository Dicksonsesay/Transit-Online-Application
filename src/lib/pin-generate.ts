import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

/** Characters that are easy to read and type (no 0/O, 1/I). */
const PIN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomPinSegment(length: number): string {
  const bytes = randomBytes(length);
  let segment = "";
  for (let i = 0; i < length; i++) {
    segment += PIN_CHARS[bytes[i]! % PIN_CHARS.length];
  }
  return segment;
}

/** e.g. TC-2026-K7M3NP */
export function buildPinCode(): string {
  const year = new Date().getFullYear();
  return `TC-${year}-${randomPinSegment(6)}`;
}

export async function generateUniquePinCode(maxAttempts = 12): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const pinCode = buildPinCode();
    const existing = await prisma.pin.findFirst({
      where: { pinCode: { equals: pinCode, mode: "insensitive" } },
      select: { id: true },
    });
    if (!existing) return pinCode;
  }
  throw new Error("Unable to generate a unique PIN. Please try again.");
}
