import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PageLoadingScreen from "@/components/shared/PageLoadingScreen";
import { getAdminAlertCount, getAdminNavbarAlerts } from "@/lib/admin-alerts";
import { requireAdminSession } from "@/lib/session";

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/auth/admin/login");
  }

  const [alerts, unreadCount] = await Promise.all([
    getAdminNavbarAlerts(),
    getAdminAlertCount(),
  ]);

  const notifications = alerts.map((a) => ({
    id: a.id,
    title: a.title,
    message: a.message,
    href: a.href,
    createdAt: a.createdAt,
    isRead: false,
  }));

  return (
    <AdminShell
      adminName={session.user.name ?? "Administrator"}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={<PageLoadingScreen variant="fullscreen" label="Loading admin portal" />}
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
