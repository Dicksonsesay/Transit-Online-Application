import AdminNotificationComposer from "@/components/admin/AdminNotificationComposer";
import { listApplicantsForInterview } from "@/lib/admin-interviews";
import { getRecentNotificationsForAdmin } from "@/lib/notifications";

export const metadata = {
  title: "Notifications | Admin | Transit College",
};

export default async function NotificationsPage() {
  const [applicants, recentSent] = await Promise.all([
    listApplicantsForInterview(),
    getRecentNotificationsForAdmin(12),
  ]);

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        Send updates to students about interviews, decisions, and other admission
        matters.
      </p>
      <AdminNotificationComposer applicants={applicants} recentSent={recentSent} />
    </div>
  );
}
