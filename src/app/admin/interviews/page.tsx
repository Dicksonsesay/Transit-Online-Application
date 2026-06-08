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
    <InterviewManagement
      interviews={interviews}
      applicants={applicants}
      defaultInterviewVenue={defaultInterviewVenue}
    />
  );
}
