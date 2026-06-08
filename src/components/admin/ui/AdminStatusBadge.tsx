import { applicationStatusLabel } from "@/lib/application-status";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/generated/prisma/client";

const statusBadgeClass: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-800 ring-blue-200/80",
  under_review: "bg-amber-100 text-amber-800 ring-amber-200/80",
  interview_scheduled: "bg-purple-100 text-purple-800 ring-purple-200/80",
  interviewed: "bg-indigo-100 text-indigo-800 ring-indigo-200/80",
  accepted: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
  rejected: "bg-red-100 text-red-800 ring-red-200/80",
};

export default function AdminStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        statusBadgeClass[status],
        className
      )}
    >
      {applicationStatusLabel[status]}
    </span>
  );
}
