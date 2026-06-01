import { NextResponse } from "next/server";
import { getAdminAlertCount, getAdminNavbarAlerts } from "@/lib/admin-alerts";
import { requireAdminSession } from "@/lib/session";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [items, unreadCount] = await Promise.all([
    getAdminNavbarAlerts(),
    getAdminAlertCount(),
  ]);

  return NextResponse.json({ items, unreadCount });
}
