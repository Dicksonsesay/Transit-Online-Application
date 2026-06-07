import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loginStudentWithGoogle } from "@/lib/google-student-auth";
import { GOOGLE_LOGIN_PIN_COOKIE, GOOGLE_REGISTER_COOKIE } from "@/lib/constants";
import { setStudentSessionCookie } from "@/lib/student-session";
import { prisma } from "@/lib/prisma";

type GoogleFinishPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function GoogleFinishPage({
  searchParams,
}: GoogleFinishPageProps) {
  const { mode } = await searchParams;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  const fullname = session?.user?.name?.trim();
  const googleId = session?.user?.id;

  if (!email || !googleId) {
    redirect("/auth/login?error=google");
  }

  if (!process.env.NEXTAUTH_SECRET) {
    redirect("/auth/login?error=config");
  }

  const profile = {
    email,
    fullname: fullname || email.split("@")[0],
    googleId,
  };

  const cookieStore = await cookies();

  if (mode === "register") {
    cookieStore.set(
      GOOGLE_REGISTER_COOKIE,
      JSON.stringify(profile),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 15,
        path: "/",
      }
    );
    redirect("/auth/register?from=google");
  }

  const expectedStudentId = Number.parseInt(
    cookieStore.get(GOOGLE_LOGIN_PIN_COOKIE)?.value ?? "",
    10
  );
  cookieStore.delete(GOOGLE_LOGIN_PIN_COOKIE);

  const result = await loginStudentWithGoogle(
    profile,
    Number.isNaN(expectedStudentId) ? undefined : expectedStudentId
  );

  if (!result.success) {
    const error = encodeURIComponent(result.error);
    redirect(`/auth/login?error=${error}`);
  }

  const student = await prisma.student.findUnique({
    where: { id: result.studentId },
    select: { id: true, fullname: true, email: true },
  });

  if (!student) {
    redirect("/auth/login?error=session");
  }

  await setStudentSessionCookie(student);
  redirect("/student");
}
