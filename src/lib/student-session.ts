import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";

const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function getSessionCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
}

export function getStudentSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
  };
}

export async function encodeStudentSessionToken(student: {
  id: number;
  fullname: string;
  email: string;
}) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  return encode({
    token: {
      sub: String(student.id),
      id: String(student.id),
      role: "student",
      name: student.fullname,
      email: student.email,
    },
    secret,
    maxAge: SESSION_MAX_AGE,
  });
}

export async function appendStudentSessionCookie(
  response: NextResponse,
  student: { id: number; fullname: string; email: string }
) {
  const token = await encodeStudentSessionToken(student);
  response.cookies.set(
    getSessionCookieName(),
    token,
    getStudentSessionCookieOptions()
  );
}

export async function setStudentSessionCookie(student: {
  id: number;
  fullname: string;
  email: string;
}) {
  const token = await encodeStudentSessionToken(student);
  const cookieStore = await cookies();
  cookieStore.set(
    getSessionCookieName(),
    token,
    getStudentSessionCookieOptions()
  );
}
