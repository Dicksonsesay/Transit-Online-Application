import { prisma } from "@/lib/prisma";
import { PinStatus } from "@/generated/prisma/client";

export async function verifyAdmissionPin(pinCode: string) {
  const normalized = pinCode.trim().toUpperCase();

  if (!normalized) {
    return { valid: false as const, message: "Please enter your PIN." };
  }

  const pin = await prisma.pin.findFirst({
    where: { pinCode: { equals: normalized, mode: "insensitive" } },
    select: {
      id: true,
      pinCode: true,
      status: true,
      amount: true,
    },
  });

  if (!pin) {
    return { valid: false as const, message: "Invalid PIN. Please check and try again." };
  }

  if (pin.status === PinStatus.used) {
    return {
      valid: false as const,
      message: "This PIN has already been used. Please log in to your account.",
    };
  }

  return {
    valid: true as const,
    pinId: pin.id,
    pinCode: pin.pinCode,
    amount: pin.amount.toString(),
  };
}
