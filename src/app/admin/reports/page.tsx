import AdminReportsView from "@/components/admin/AdminReportsView";
import { getAdminReportsData } from "@/lib/admin-reports";

export default async function ReportsPage() {
  const report = await getAdminReportsData();

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        View admission performance, operational volume, and key conversion metrics.
      </p>
      <AdminReportsView report={report} />
    </div>
  );
}
