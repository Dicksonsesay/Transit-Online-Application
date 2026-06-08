import AdminReportsView from "@/components/admin/AdminReportsView";
import { getAdminReportsData } from "@/lib/admin-reports";

export default async function ReportsPage() {
  const report = await getAdminReportsData();
  return <AdminReportsView report={report} />;
}
