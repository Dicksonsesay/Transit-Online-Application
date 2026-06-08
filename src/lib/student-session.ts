import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { SESSION_MAX_AGE } from "@/lib/session-config";
import { encodeAuthSessionToken } from "@/lib/session-token";

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
  return encodeAuthSessionToken({
    sub: String(student.id),
    id: String(student.id),
    role: "student",
    name: student.fullname,
    email: student.email,
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
