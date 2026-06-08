import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  assertGoogleAccountCanRegister,
  loginStudentWithGoogle,
} from "@/lib/google-student-auth";
import {
  createGoogleRegisterVerification,
  setGoogleRegisterSessionOnResponse,
} from "@/lib/google-register-session";
import { GOOGLE_LOGIN_PIN_COOKIE } from "@/lib/constants";
import { appendStudentSessionCookie } from "@/lib/student-session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function loginRedirect(request: NextRequest, error: string) {
  const url = new URL("/auth/login", request.nextUrl.origin);
  url.searchParams.set("error", error);
  const response = NextResponse.redirect(url);
  response.cookies.delete(GOOGLE_LOGIN_PIN_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const mode = request.nextUrl.searchParams.get("mode") ?? "login";
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.trim().toLowerCase();
    const fullname = session?.user?.name?.trim();
    const googleId = session?.user?.id;

    if (!email || !googleId) {
      return loginRedirect(request, "google");
    }

    if (!process.env.NEXTAUTH_SECRET) {
      return loginRedirect(request, "config");
    }

    const profile = {
      email,
      fullname: fullname || email.split("@")[0],
      googleId,
    };

    if (mode === "register") {
      if (session.user?.emailVerified === false) {
        return NextResponse.redirect(
          new URL(
            `/auth/register?error=${encodeURIComponent(
              "Your Google email is not verified. Use a registered Google account with a verified email address."
            )}`,
            request.nextUrl.origin
          )
        );
      }

      const availability = await assertGoogleAccountCanRegister(profile);
      if (!availability.ok) {
        const response = NextResponse.redirect(
          new URL(
            `/auth/register?error=${encodeURIComponent(availability.error)}`,
            request.nextUrl.origin
          )
        );
        return response;
      }

      const verification = await createGoogleRegisterVerification(profile);
      if (!verification.ok) {
        return NextResponse.redirect(
          new URL(
            `/auth/register?error=${encodeURIComponent(verification.error)}`,
            request.nextUrl.origin
          )
        );
      }

      const response = NextResponse.redirect(
        new URL("/auth/register?from=google", request.nextUrl.origin)
      );
      setGoogleRegisterSessionOnResponse(response, verification.session);
      return response;
    }

    const expectedStudentId = Number.parseInt(
      request.cookies.get(GOOGLE_LOGIN_PIN_COOKIE)?.value ?? "",
      10
    );

    const result = await loginStudentWithGoogle(
      profile,
      Number.isNaN(expectedStudentId) ? undefined : expectedStudentId
    );

    if (!result.success) {
      return loginRedirect(request, result.error);
    }

    const student = await prisma.student.findUnique({
      where: { id: result.studentId },
      select: { id: true, fullname: true, email: true },
    });

    if (!student) {
      return loginRedirect(request, "session");
    }

    const response = NextResponse.redirect(new URL("/student", request.nextUrl.origin));
    response.cookies.delete(GOOGLE_LOGIN_PIN_COOKIE);
    await appendStudentSessionCookie(response, student);
    return response;
  } catch {
    return loginRedirect(request, "Google sign-in failed. Please try again.");
  }
}
