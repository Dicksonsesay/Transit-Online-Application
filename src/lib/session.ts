import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_ROLES = new Set(["super_admin", "admin", "admissions_officer"]);

type AppSession = Session & {
  user: NonNullable<Session["user"]> & { id: string; role?: string };
};

export async function getSession() {
  return getServerSession(authOptions);
}

function isActiveSession(session: Session | null): session is AppSession {
  return Boolean(session?.user?.id);
}

export async function requireStudentSession() {
  const session = await getSession();
  if (!isActiveSession(session) || session.user.role !== "student") {
    return null;
  }
  return session;
}

export async function requireAdminSession() {
  const session = await getSession();
  if (
    !isActiveSession(session) ||
    !session.user.role ||
    !ADMIN_ROLES.has(session.user.role)
  ) {
    return null;
  }
  return session;
}

export function isAdminRole(role?: string) {
  return role ? ADMIN_ROLES.has(role) : false;
}
