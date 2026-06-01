import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import PortalWelcomeBanner from "@/components/shared/PortalWelcomeBanner";
import { getAdminRecentActivities } from "@/lib/admin-dashboard-activity";
import { getApplicantStats, getRecentApplicants } from "@/lib/admin-applicants";
import { getAdminReportsData } from "@/lib/admin-reports";
import { requireAdminSession } from "@/lib/session";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const adminName = session?.user.name ?? "Administrator";

  const [stats, recentApplicants, recentActivities, chartReport] = await Promise.all([
    getApplicantStats(),
    getRecentApplicants(8),
    getAdminRecentActivities(6),
    getAdminReportsData(),
  ]);

  return (
    <div className="space-y-8">
      <PortalWelcomeBanner
        portalLabel="Admissions Control Center"
        dashboardTitle="Admin Dashboard"
        userName={adminName}
        description="Centralize applicant review, interviews, acceptance letters, notifications, and reporting from one professional workspace."
      />

      <AdminDashboardOverview
        stats={stats}
        recentApplicants={recentApplicants}
        recentActivities={recentActivities}
        chartReport={chartReport}
      />
    </div>
  );
}
