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

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        Review submitted applications and open any applicant to see their full
        details.
      </p>
      <ApplicantsList applicants={applicants} stats={stats} />
    </div>
  );
}
