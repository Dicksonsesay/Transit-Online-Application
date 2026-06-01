import { ApplicationStatus } from "@/generated/prisma/client";

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  interviewed: "Interviewed",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const applicationStatusDescription: Record<ApplicationStatus, string> = {
  submitted: "Your application has been submitted and is awaiting review.",
  under_review: "Your application is being reviewed.",
  interview_scheduled: "Your application is under review and an interview is scheduled.",
  interviewed: "Your interview has been completed. A decision is pending.",
  accepted: "Congratulations! Your application has been accepted.",
  rejected: "Your application was not successful. Contact admissions for details.",
};

export function formatApplicationStatus(status: ApplicationStatus | null | undefined) {
  if (!status) {
    return {
      label: "Not Started",
      description: "Complete your application form to begin the admission process.",
    };
  }
  return {
    label: applicationStatusLabel[status],
    description: applicationStatusDescription[status],
  };
}
