"use client";

import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiUserCheck,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { AdminPageIntro, AdminToolbar } from "@/components/admin/ui/AdminToolbar";
import { AdminStatGrid, type AdminStatItem } from "@/components/admin/ui/AdminStatGrid";
import {
  AdminTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableRow,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui/AdminTable";
import ApplicantDecisionActions from "@/components/admin/ApplicantDecisionActions";
import AdminExportToolbar from "@/components/admin/AdminExportToolbar";
import { applicationStatusLabel } from "@/lib/application-status";
import type { ApplicantListItem } from "@/lib/admin-applicants";
import type { ApplicationStatus } from "@/generated/prisma/client";
import { cn, formatDate } from "@/lib/utils";

type ApplicantsListProps = {
  applicants: ApplicantListItem[];
  stats: {
    total: number;
    submitted: number;
    underReview: number;
    accepted: number;
    rejected: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
  };
};

type StatusFilter = "all" | ApplicationStatus;

const statusBadgeClass: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-800 ring-1 ring-blue-200/60",
  under_review: "bg-amber-100 text-amber-800 ring-1 ring-amber-200/60",
  interview_scheduled: "bg-purple-100 text-purple-800 ring-1 ring-purple-200/60",
  interviewed: "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/60",
  accepted: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60",
  rejected: "bg-red-100 text-red-800 ring-1 ring-red-200/60",
};

export default function ApplicantsList({ applicants, stats }: ApplicantsListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applicants.filter((a) => {
      const matchesStatus =
        statusFilter === "all" || a.applicationStatus === statusFilter;
      const matchesQuery =
        !q ||
        a.fullname.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.applicationNumber?.toLowerCase().includes(q) ?? false) ||
        (a.firstChoiceCourse?.toLowerCase().includes(q) ?? false);
      return matchesStatus && matchesQuery;
    });
  }, [applicants, query, statusFilter]);

  const inProcess = stats.submitted + stats.underReview;

  const statCards: AdminStatItem[] = [
    {
      label: "Total applications",
      value: stats.total,
      helper: "Complete applicant pool",
      icon: FiUsers,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white",
      valueClass: "text-blue-800",
    },
    {
      label: "Submitted",
      value: stats.submitted,
      helper: "Awaiting first review",
      icon: FiClock,
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
      iconClass: "bg-amber-500 text-white",
      valueClass: "text-amber-700",
    },
    {
      label: "Under review",
      value: stats.underReview,
      helper: `${inProcess} total in process`,
      icon: FiFileText,
      cardClass: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
      iconClass: "bg-violet-600 text-white",
      valueClass: "text-violet-800",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      helper: "Approved applicants",
      icon: FiCheckCircle,
      cardClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
      iconClass: "bg-emerald-600 text-white",
      valueClass: "text-emerald-800",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      helper: "Declined applications",
      icon: FiXCircle,
      cardClass: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50",
      iconClass: "bg-rose-600 text-white",
      valueClass: "text-rose-800",
    },
    {
      label: "Interview activity",
      value: stats.interviewsScheduled + stats.interviewsCompleted,
      helper: `${stats.interviewsScheduled} scheduled · ${stats.interviewsCompleted} done`,
      icon: FiUserCheck,
      cardClass: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50",
      iconClass: "bg-sky-600 text-white",
      valueClass: "text-sky-800",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageIntro
        icon={FiUsers}
        title="Applicants"
        description="Review submitted applications, track admission status, and open full applicant profiles."
      />

      <AdminStatGrid items={statCards} className="2xl:grid-cols-6" />

      <AdminToolbar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by name, email, application no., or course…"
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
            >
              <option value="all">All statuses</option>
              {(Object.keys(applicationStatusLabel) as ApplicationStatus[]).map((s) => (
                <option key={s} value={s}>
                  {applicationStatusLabel[s]}
                </option>
              ))}
            </select>
            <AdminExportToolbar
              compact
              basePath="/api/admin/applicants/export"
              query={{
                status: statusFilter === "all" ? undefined : statusFilter,
              }}
            />
          </div>
        }
      />

      <AdminTableShell
        title="Application register"
        subtitle="Accept or reject after interview · View opens the full applicant record"
        countLabel={`${filtered.length} applicant${filtered.length === 1 ? "" : "s"}`}
      >
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Applicant</AdminTh>
            <AdminTh>Application No.</AdminTh>
            <AdminTh>Course choice</AdminTh>
            <AdminTh>Programme</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Submitted</AdminTh>
            <AdminTh className="min-w-[11rem] text-right">Decision</AdminTh>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableEmpty
                colSpan={7}
                icon={FiUsers}
                title={applicants.length === 0 ? "No applications yet" : "No matches found"}
                description={
                  applicants.length === 0
                    ? "Applications will appear here once students submit their forms."
                    : "Try adjusting your search or status filter."
                }
              />
            ) : (
              filtered.map((applicant) => (
                <AdminTableRow key={applicant.studentId}>
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-yellow)] to-amber-500 text-xs font-bold text-[var(--dark-blue)]">
                        {applicant.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--primary-blue)]">
                          {applicant.fullname}
                        </p>
                        <p className="truncate text-xs text-zinc-500">{applicant.email}</p>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <span className="inline-block rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-zinc-700">
                      {applicant.applicationNumber ?? "—"}
                    </span>
                  </AdminTd>
                  <AdminTd className="max-w-[180px]">
                    <p className="line-clamp-2 text-sm text-zinc-700">
                      {applicant.firstChoiceCourse ?? "—"}
                    </p>
                  </AdminTd>
                  <AdminTd className="max-w-[160px]">
                    <p className="line-clamp-2 text-sm text-zinc-600">
                      {applicant.programmeName}
                    </p>
                  </AdminTd>
                  <AdminTd>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                        statusBadgeClass[applicant.applicationStatus]
                      )}
                    >
                      {applicationStatusLabel[applicant.applicationStatus]}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="text-sm text-zinc-600">
                      {formatDate(applicant.submittedAt)}
                    </span>
                  </AdminTd>
                  <AdminTd className="text-right">
                    <ApplicantDecisionActions
                      studentId={applicant.studentId}
                      fullname={applicant.fullname}
                      applicationStatus={applicant.applicationStatus}
                    />
                  </AdminTd>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminTableShell>
    </div>
  );
}
