import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findStudentByPin } from "@/lib/student-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      id: "student",
      name: "Student",
      credentials: {
        pin: { label: "PIN", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const pin = credentials?.pin?.trim();
        const password = credentials?.password;

        if (!pin || !password) return null;

        const student = await findStudentByPin(pin);
        if (!student) return null;

        if (student.accountStatus === "suspended" || student.accountStatus === "inactive") {
          return null;
        }

        const valid = await bcrypt.compare(password, student.password);
        if (!valid) return null;

        return {
          id: String(student.id),
          email: student.email,
          name: student.fullname,
          role: "student",
        };
      },
    }),
    CredentialsProvider({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) return null;

        const admin = await prisma.admin.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });

        if (!admin || admin.status !== "active") return null;

        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return null;

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.fullname,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
