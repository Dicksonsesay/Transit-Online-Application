import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiMail,
} from "react-icons/fi";
import ApplicationStatusProgress from "@/components/student/ApplicationStatusProgress";
import PortalWelcomeBanner from "@/components/shared/PortalWelcomeBanner";
import { formatApplicationStatus } from "@/lib/application-status";
import { getAdmissionProgressSteps } from "@/lib/application-progress";
import { formatCalendarDateShort } from "@/lib/calendar-date";
import type { ApplicationStatus, InterviewStatus } from "@/generated/prisma/client";

type StudentDashboardProps = {
  studentName: string;
  applicationNumber: string | null;
  applicationStatus: ApplicationStatus | null;
  applicationSubmittedAt: Date | null;
  acceptanceLetterGeneratedAt: Date | null;
  applicationDraftSection?: number | null;
  unreadMessages: number;
  interview: {
    interviewDate: Date;
    interviewTime: Date;
    venue: string | null;
    meetingLink: string | null;
    interviewStatus: InterviewStatus;
  } | null;
};

export default function StudentDashboard({
  studentName,
  applicationNumber,
  applicationStatus,
  applicationSubmittedAt,
  acceptanceLetterGeneratedAt,
  applicationDraftSection,
  unreadMessages,
  interview,
}: StudentDashboardProps) {
  const status =
    applicationDraftSection && !applicationStatus
      ? {
          label: "In Progress",
          description: `Continue your application — you are on section ${applicationDraftSection} of 11.`,
        }
      : formatApplicationStatus(applicationStatus ?? undefined);

  const interviewLabel =
    interview?.interviewStatus === "scheduled"
      ? "Scheduled"
      : interview?.interviewStatus === "completed"
        ? "Completed"
        : "Not Scheduled";

  const interviewDescription = interview
    ? interview.interviewStatus === "scheduled"
      ? `Your interview is on ${formatCalendarDateShort(interview.interviewDate)}${
          interview.venue ? ` at ${interview.venue}` : ""
        }.`
      : "Your interview has been completed."
    : "You will be notified once an interview is scheduled.";

  const progressSteps = getAdmissionProgressSteps({
    status: applicationStatus,
    submittedAt: applicationSubmittedAt,
    interviewDate: interview?.interviewDate ?? null,
    acceptanceLetterGeneratedAt,
  });

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PortalWelcomeBanner
        portalLabel="Student Admission Portal"
        dashboardTitle="Student Dashboard"
        userName={studentName}
        description="Track your application status, interview schedule, messages, and admission documents."
      />

      {applicationNumber ? (
        <p className="-mt-2 text-sm font-medium text-[var(--primary-blue)]/80">
          Application No: {applicationNumber}
        </p>
      ) : null}

      {progressSteps ? (
        <ApplicationStatusProgress steps={progressSteps} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl bg-[#fff8dc] p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">
              <FiFileText size={18} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-[var(--primary-blue)]">
                Application Status
              </h2>
              <p className="mt-2 text-lg font-bold text-[var(--dark-blue)]">
                {status.label}
              </p>
              <p className="mt-1 text-sm text-zinc-600">{status.description}</p>
              <Link
                href="/student/application"
                className="mt-4 inline-block rounded-lg bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                View Application
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <FiCalendar size={18} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-[var(--primary-blue)]">Interview</h2>
              <p className="mt-2 text-lg font-bold text-[var(--dark-blue)]">
                {interviewLabel}
              </p>
              <p className="mt-1 text-sm text-zinc-600">{interviewDescription}</p>
              <Link
                href="/student/interview"
                className="mt-4 inline-block rounded-lg border-2 border-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-[var(--hero-blue)] transition-colors hover:bg-[var(--hero-blue)] hover:text-white"
              >
                View Details
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <FiMail size={18} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-[var(--primary-blue)]">Messages</h2>
              <p className="mt-2 text-lg font-bold text-[var(--dark-blue)]">
                {unreadMessages > 0
                  ? `${unreadMessages} New Message${unreadMessages === 1 ? "" : "s"}`
                  : "No New Messages"}
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {unreadMessages > 0
                  ? `You have ${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}.`
                  : "You are all caught up."}
              </p>
              <Link
                href="/student/messages"
                className="mt-4 inline-block rounded-lg bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                View Messages
              </Link>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-[var(--primary-blue)]">Next Steps</h2>
          <ul className="mt-4 space-y-3">
            {[
              "Ensure all documents are uploaded",
              "Check your email regularly",
              "Wait for interview schedule",
            ].map((step) => (
              <li key={step} className="flex items-start gap-3 text-sm text-zinc-700">
                <FiCheckCircle
                  className="mt-0.5 shrink-0 text-[var(--primary-blue)]"
                  size={18}
                  aria-hidden
                />
                {step}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
