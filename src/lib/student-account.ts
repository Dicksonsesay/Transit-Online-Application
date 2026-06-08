import { prisma } from "@/lib/prisma";

export async function getStudentPasswordStatus(studentId: number) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { password: true, googleId: true },
  });

  return {
    hasPassword: Boolean(student?.password),
    usesGoogleSignIn: Boolean(student?.googleId),
  };
}
