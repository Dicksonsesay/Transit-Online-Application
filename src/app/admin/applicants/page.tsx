import ApplicantsList from "@/components/admin/ApplicantsList";
import { getApplicantStats, listApplicants } from "@/lib/admin-applicants";

export const metadata = {
  title: "Applicants | Admin | Transit College",
};

export default async function ApplicantsPage() {
  const [applicants, stats] = await Promise.all([
    listApplicants(),
    getApplicantStats(),
  ]);

  return <ApplicantsList applicants={applicants} stats={stats} />;
}
