"use server";

import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { VERIFIED_PIN_COOKIE } from "@/lib/constants";
import { verifyAdmissionPin } from "@/lib/pin";

const COOKIE_MAX_AGE = 60 * 60 * 2;

export type VerifyPinState = {
  error?: string;
};

export async function verifyPinAction(
  _prevState: VerifyPinState,
  formData: FormData
): Promise<VerifyPinState> {
  const pinCode = formData.get("pinCode")?.toString() ?? "";

  if (!pinCode.trim()) {
    return { error: "Please enter your PIN." };
  }

  try {
    const result = await verifyAdmissionPin(pinCode);

    if (!result.valid) {
      return { error: result.message };
    }

    const cookieStore = await cookies();
    cookieStore.set(VERIFIED_PIN_COOKIE, String(result.pinId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    redirect("/auth/register");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Unable to verify PIN. Please try again later." };
  }
}
