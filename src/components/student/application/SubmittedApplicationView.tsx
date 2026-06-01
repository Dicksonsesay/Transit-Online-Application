import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiDownload,
  FiExternalLink,
  FiFileText,
} from "react-icons/fi";
import { applicationStatusDescription, applicationStatusLabel } from "@/lib/application-status";
import StudentPageHero from "@/components/student/ui/StudentPageHero";
import { cn, formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/generated/prisma/client";

type SubmittedApplicationViewProps = {
  status: ApplicationStatus;
  submittedAt: Date;
  applicationNumber: string | null;
};

const statusStyles: Record<
  ApplicationStatus,
  { badge: string; ring: string; iconBg: string }
> = {
  submitted: {
    badge: "bg-blue-100 text-blue-800",
    ring: "ring-blue-200/60",
    iconBg: "bg-blue-600",
  },
  under_review: {
    badge: "bg-amber-100 text-amber-800",
    ring: "ring-amber-200/60",
    iconBg: "bg-amber-500",
  },
  interview_scheduled: {
    badge: "bg-purple-100 text-purple-800",
    ring: "ring-purple-200/60",
    iconBg: "bg-purple-600",
  },
  interviewed: {
    badge: "bg-indigo-100 text-indigo-800",
    ring: "ring-indigo-200/60",
    iconBg: "bg-indigo-600",
  },
  accepted: {
    badge: "bg-emerald-100 text-emerald-800",
    ring: "ring-emerald-200/60",
    iconBg: "bg-emerald-600",
  },
  rejected: {
    badge: "bg-red-100 text-red-800",
    ring: "ring-red-200/60",
    iconBg: "bg-red-600",
  },
};

export default function SubmittedApplicationView({
  status,
  submittedAt,
  applicationNumber,
}: SubmittedApplicationViewProps) {
  const styles = statusStyles[status];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <StudentPageHero
        badge="Application received"
        icon={FiCheckCircle}
        title="Your application is submitted"
        description="The admissions office has received your form. Track updates in your dashboard, Messages, and registered email."
      />

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg",
                  styles.iconBg
                )}
              >
                <FiCheckCircle size={28} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                  Current status
                </p>
                <span
                  className={cn(
                    "mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold ring-1",
                    styles.badge,
                    styles.ring
                  )}
                >
                  {applicationStatusLabel[status]}
                </span>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
                  {applicationStatusDescription[status]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Submitted on
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--primary-blue)]">
              {formatDate(submittedAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Application number
            </p>
            <p className="mt-2 font-mono text-lg font-bold text-[var(--dark-blue)]">
              {applicationNumber ?? "Pending assignment"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:flex-wrap sm:px-8">
          <a
            href="/api/student/application/pdf?download=1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary-yellow)] px-5 py-3 text-sm font-bold text-[var(--dark-blue)] shadow-sm hover:opacity-95"
          >
            <FiDownload size={18} aria-hidden />
            Download PDF
          </a>
          <a
            href="/api/student/application/pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-[var(--primary-blue)] hover:bg-slate-50"
          >
            <FiExternalLink size={18} aria-hidden />
            View &amp; print
          </a>
          <Link
            href="/student"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--hero-blue)] px-5 py-3 text-sm font-bold text-white hover:opacity-95 sm:ml-auto"
          >
            Dashboard
            <FiArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm text-blue-900">
        <FiFileText className="mt-0.5 shrink-0" size={18} aria-hidden />
        <p>
          Your application can no longer be edited. Check <strong>Admission Status</strong> and{" "}
          <strong>Messages</strong> for interview invitations and decisions.
        </p>
      </div>
    </div>
  );
}
