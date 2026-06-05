import AcceptanceLetterManagement from "@/components/admin/AcceptanceLetterManagement";
import { listAcceptanceLetterCandidates } from "@/lib/admin-acceptance-letters";

export default async function AcceptanceLettersPage() {
  const applicants = await listAcceptanceLetterCandidates();

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        Generate offers of admission for admitted applicants and notify students once
        published.
      </p>
      <AcceptanceLetterManagement applicants={applicants} />
    </div>
  );
}
