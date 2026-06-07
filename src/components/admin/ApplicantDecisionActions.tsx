"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiCheck, FiEye, FiX } from "react-icons/fi";
import { decideApplicantAfterInterviewAction } from "@/actions/admin-applicants";
import { applicationStatusLabel } from "@/lib/application-status";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import type { ApplicationStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type ApplicantDecisionActionsProps = {
  studentId: number;
  fullname: string;
  applicationStatus: ApplicationStatus;
};

export default function ApplicantDecisionActions({
  studentId,
  fullname,
  applicationStatus,
}: ApplicantDecisionActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const showDecisionButtons = applicationStatus === "interviewed";

  function handleDecision(decision: "accepted" | "rejected") {
    const isAccept = decision === "accepted";
    const label = applicationStatusLabel[decision];

    void confirmAction(
      isAccept ? "Accept this applicant?" : "Reject this application?",
      isAccept
        ? `${fullname} will be marked as accepted and notified by email and portal message.`
        : `${fullname} will be marked as rejected and notified by email and portal message.`,
      {
        confirmButtonText: isAccept ? "Yes, accept" : "Yes, reject",
        confirmButtonColor: isAccept ? "#059669" : "#dc3545",
      }
    ).then((result) => {
      if (!result.isConfirmed) return;

      startTransition(async () => {
        const response = await decideApplicantAfterInterviewAction(studentId, decision);
        if (response.error) {
          await showError("Decision failed", response.error);
          return;
        }
        await showSuccess(
          isAccept ? "Applicant accepted" : "Application rejected",
          `${fullname} has been marked as ${label}.`
        );
        router.refresh();
      });
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {showDecisionButtons ? (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleDecision("accepted")}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm transition-opacity hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-2 sm:text-xs"
            title="Accept applicant"
          >
            <FiCheck size={13} aria-hidden />
            Accept
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => handleDecision("rejected")}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-red-700 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:py-2 sm:text-xs"
            title="Reject application"
          >
            <FiX size={13} aria-hidden />
            Reject
          </button>
        </>
      ) : applicationStatus === "accepted" ? (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 ring-1 ring-emerald-200/80 sm:text-xs"
          )}
        >
          <FiCheck size={12} aria-hidden />
          Admitted
        </span>
      ) : applicationStatus === "rejected" ? (
        <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-800 ring-1 ring-red-200/80 sm:text-xs">
          <FiX size={12} aria-hidden />
          Declined
        </span>
      ) : null}

      <Link
        href={`/admin/applicants/${studentId}`}
        className="inline-flex items-center gap-1 rounded-lg bg-[var(--hero-blue)] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:opacity-95 sm:px-3 sm:py-2 sm:text-xs"
      >
        <FiEye size={13} aria-hidden />
        View
      </Link>
    </div>
  );
}
