import type { InterviewStatus } from "@/generated/prisma/client";

export const interviewStatusLabel: Record<InterviewStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  missed: "Missed",
  cancelled: "Cancelled",
};

export const interviewStatusBadgeClass: Record<InterviewStatus, string> = {
  scheduled: "bg-emerald-100 text-emerald-800",
  completed: "bg-blue-100 text-blue-800",
  missed: "bg-amber-100 text-amber-800",
  cancelled: "bg-red-100 text-red-800",
};
