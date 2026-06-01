import { NextResponse } from "next/server";
import { getStudentNavbarNotifications } from "@/lib/notifications";
import { getUnreadNotificationCount } from "@/lib/student-dashboard";
import { requireStudentSession } from "@/lib/session";

export async function GET() {
  const session = await requireStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const [items, unreadCount] = await Promise.all([
    getStudentNavbarNotifications(studentId),
    getUnreadNotificationCount(studentId),
  ]);

  return NextResponse.json({ items, unreadCount });
}
