"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_ADMISSION_PIN_AMOUNT } from "@/lib/constants";
import { getDefaultPinAmountFromSettings } from "@/lib/system-settings";
import { generateUniquePinCode } from "@/lib/pin-generate";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import { PinStatus } from "@/generated/prisma/client";

export type GeneratePinState = {
  error?: string;
  pinCode?: string;
  pinId?: number;
};

function parseAdminId(sessionUserId: string | undefined): number | null {
  const id = Number.parseInt(sessionUserId ?? "", 10);
  return Number.isNaN(id) ? null : id;
}

export async function generateAdmissionPinAction(
  _prevState: GeneratePinState,
  formData: FormData
): Promise<GeneratePinState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const adminId = parseAdminId(session.user.id);
  if (adminId === null) {
    return { error: "Invalid admin session." };
  }

  const amountRaw = formData.get("amount")?.toString().trim();
  const receiptNumber = formData.get("receiptNumber")?.toString().trim() || null;

  const defaultAmount = await getDefaultPinAmountFromSettings();
  const amount = amountRaw ? Number.parseFloat(amountRaw) : defaultAmount;

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a valid payment amount greater than zero." };
  }

  try {
    const pinCode = await generateUniquePinCode();

    const pin = await prisma.pin.create({
      data: {
        pinCode,
        amount,
        receiptNumber,
        generatedById: adminId,
        status: PinStatus.unused,
      },
    });

    const year = new Date().getFullYear();
    const finalReceiptNumber =
      receiptNumber ?? `RCP-${year}-${String(pin.id).padStart(5, "0")}`;

    if (!receiptNumber) {
      await prisma.pin.update({
        where: { id: pin.id },
        data: { receiptNumber: finalReceiptNumber },
      });
    }

    revalidatePath("/admin/pins");
    return { pinCode, pinId: pin.id };
  } catch {
    return { error: "Could not generate PIN. Please try again." };
  }
}

export async function deleteUnusedPinAction(
  pinId: number
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  if (!Number.isInteger(pinId) || pinId < 1) {
    return { error: "Invalid PIN." };
  }

  const pin = await prisma.pin.findUnique({
    where: { id: pinId },
    select: { status: true, pinCode: true },
  });

  if (!pin) {
    return { error: "PIN not found." };
  }

  if (pin.status !== PinStatus.unused) {
    return { error: "Only unused PINs can be removed." };
  }

  await prisma.pin.delete({ where: { id: pinId } });

  revalidatePath("/admin/pins");
  return { success: true };
}
