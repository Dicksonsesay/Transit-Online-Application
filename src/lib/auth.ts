import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findStudentByPin } from "@/lib/student-auth";
import { getGoogleOAuthConfig } from "@/lib/google-oauth-config";

const googleOAuth = getGoogleOAuthConfig();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    ...(googleOAuth
      ? [
          GoogleProvider({
            clientId: googleOAuth.clientId,
            clientSecret: googleOAuth.clientSecret,
          }),
        ]
      : []),
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

        if (!student.password) return null;

        const passwordHash = student.password;
        const valid = await bcrypt.compare(password, passwordHash);
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
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && user) {
        token.id = account.providerAccountId;
        token.email = user.email;
        token.name = user.name;
        const googleProfile = profile as { email_verified?: boolean } | undefined;
        token.emailVerified = googleProfile?.email_verified ?? true;
      } else if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
};
