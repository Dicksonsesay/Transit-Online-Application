import InterviewManagement from "@/components/admin/InterviewManagement";
import { listApplicantsForInterview, listInterviews } from "@/lib/admin-interviews";
import { getDefaultInterviewVenueFromSettings } from "@/lib/system-settings";

export const metadata = {
  title: "Interviews | Admin | Transit College",
};

export default async function InterviewsPage() {
  const [interviews, applicants, defaultInterviewVenue] = await Promise.all([
    listInterviews(),
    listApplicantsForInterview(),
    getDefaultInterviewVenueFromSettings(),
  ]);

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        Schedule interviews for applicants and update outcomes after each session.
      </p>
      <InterviewManagement
        interviews={interviews}
        applicants={applicants}
        defaultInterviewVenue={defaultInterviewVenue}
      />
    </div>
  );
}
