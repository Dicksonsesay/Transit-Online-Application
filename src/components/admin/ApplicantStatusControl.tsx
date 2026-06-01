"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateApplicationStatusAction } from "@/actions/admin-applicants";
import { applicationStatusLabel } from "@/lib/application-status";
import { showError, showSuccess } from "@/lib/alerts";
import type { ApplicationStatus } from "@/generated/prisma/client";

const STATUS_OPTIONS: ApplicationStatus[] = [
  "submitted",
  "under_review",
  "interview_scheduled",
  "interviewed",
  "accepted",
  "rejected",
];

type ApplicantStatusControlProps = {
  studentId: number;
  currentStatus: ApplicationStatus;
};

export default function ApplicantStatusControl({
  studentId,
  currentStatus,
}: ApplicantStatusControlProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(next: ApplicationStatus) {
    setStatus(next);
    startTransition(async () => {
      const result = await updateApplicationStatusAction(studentId, next);
      if (result.error) {
        setStatus(currentStatus);
        await showError("Update failed", result.error);
        return;
      }
      await showSuccess("Status updated", `Application marked as ${applicationStatusLabel[next]}.`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label htmlFor="application-status" className="text-sm font-medium text-zinc-700">
        Application status
      </label>
      <select
        id="application-status"
        value={status}
        disabled={pending}
        onChange={(e) => handleChange(e.target.value as ApplicationStatus)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20 disabled:opacity-60"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {applicationStatusLabel[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
