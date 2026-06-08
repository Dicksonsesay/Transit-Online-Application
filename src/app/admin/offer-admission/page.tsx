import AcceptanceLetterManagement from "@/components/admin/AcceptanceLetterManagement";
import { listAcceptanceLetterCandidates } from "@/lib/admin-acceptance-letters";

export default async function AcceptanceLettersPage() {
  const applicants = await listAcceptanceLetterCandidates();
  return <AcceptanceLetterManagement applicants={applicants} />;
}
