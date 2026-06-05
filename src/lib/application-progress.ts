import type { ApplicationStatus } from "@/generated/prisma/client";

export type AdmissionProgressStepId =
  | "submitted"
  | "under_review"
  | "interview"
  | "accepted"
  | "acceptance_letter";

export type AdmissionProgressStep = {
  id: AdmissionProgressStepId;
  label: string;
  index: number;
};

export const ADMISSION_PROGRESS_STEPS: AdmissionProgressStep[] = [
  { id: "submitted", label: "Submitted", index: 0 },
  { id: "under_review", label: "Under Review", index: 1 },
  { id: "interview", label: "Interview", index: 2 },
  { id: "accepted", label: "Accepted", index: 3 },
  { id: "acceptance_letter", label: "Offer of Admission", index: 4 },
];

export type AdmissionProgressStepState = "complete" | "current" | "upcoming";

export type AdmissionProgressStepView = AdmissionProgressStep & {
  state: AdmissionProgressStepState;
  date: Date | null;
  displayLabel: string;
};

function statusStepIndex(
  status: ApplicationStatus,
  hasAcceptanceLetter: boolean
): number {
  switch (status) {
    case "submitted":
      return 0;
    case "under_review":
      return 1;
    case "interview_scheduled":
    case "interviewed":
      return 2;
    case "accepted":
      return hasAcceptanceLetter ? 4 : 3;
    case "rejected":
      return 3;
    default:
      return 0;
  }
}

function resolveStepState(
  stepIndex: number,
  currentIndex: number,
  status: ApplicationStatus,
  hasAcceptanceLetter: boolean
): AdmissionProgressStepState {
  if (status === "accepted" && hasAcceptanceLetter) {
    return "complete";
  }
  if (stepIndex < currentIndex) {
    return "complete";
  }
  if (stepIndex === currentIndex) {
    return "current";
  }
  return "upcoming";
}

export function getAdmissionProgressSteps(input: {
  status: ApplicationStatus | null;
  submittedAt: Date | null;
  interviewDate: Date | null;
  acceptanceLetterGeneratedAt: Date | null;
}): AdmissionProgressStepView[] | null {
  if (!input.status || !input.submittedAt) {
    return null;
  }

  const hasAcceptanceLetter = Boolean(input.acceptanceLetterGeneratedAt);
  const currentIndex = statusStepIndex(input.status, hasAcceptanceLetter);

  return ADMISSION_PROGRESS_STEPS.map((step) => {
    const state = resolveStepState(
      step.index,
      currentIndex,
      input.status!,
      hasAcceptanceLetter
    );

    let date: Date | null = null;
    if (step.id === "submitted") {
      date = input.submittedAt;
    } else if (step.id === "interview" && input.interviewDate) {
      date = input.interviewDate;
    } else if (step.id === "acceptance_letter" && input.acceptanceLetterGeneratedAt) {
      date = input.acceptanceLetterGeneratedAt;
    }

    let displayLabel = step.label;
    if (step.id === "accepted" && input.status === "rejected") {
      displayLabel = "Not Admitted";
    }

    return { ...step, state, date, displayLabel };
  });
}
