import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VERIFIED_PIN_COOKIE } from "@/lib/constants";
import { verifyAdmissionPin } from "@/lib/pin";

const COOKIE_MAX_AGE = 60 * 60 * 2;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const pinCode = typeof body.pinCode === "string" ? body.pinCode : "";

    if (!pinCode.trim()) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const result = await verifyAdmissionPin(pinCode);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.message },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(VERIFIED_PIN_COOKIE, String(result.pinId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    return NextResponse.json({
      valid: true,
      message: "PIN verified successfully.",
      redirectTo: "/auth/register",
    });
  } catch (error) {
    console.error("PIN verify error:", error);
    return NextResponse.json(
      { valid: false, message: "Unable to verify PIN. Please try again." },
      { status: 500 }
    );
  }
}
