import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_ROLES = new Set(["super_admin", "admin", "admissions_officer"]);

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireStudentSession() {
  const session = await getSession();
  if (!session?.user || session.user.role !== "student") {
    return null;
  }
  return session;
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session?.user?.role || !ADMIN_ROLES.has(session.user.role)) {
    return null;
  }
  return session;
}

export function isAdminRole(role?: string) {
  return role ? ADMIN_ROLES.has(role) : false;
}
