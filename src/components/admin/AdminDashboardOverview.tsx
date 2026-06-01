import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMail,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import { applicationStatusLabel } from "@/lib/application-status";
import type { AdminRecentActivity } from "@/lib/admin-dashboard-activity";
import AdminCharts from "@/components/admin/charts/AdminCharts";
import type { ApplicantListItem } from "@/lib/admin-applicants";
import type { AdminReportsData } from "@/lib/admin-reports";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { ApplicationStatus } from "@/generated/prisma/client";

type AdminDashboardOverviewProps = {
  stats: {
    total: number;
    submitted: number;
    underReview: number;
    accepted: number;
    rejected: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
  };
  recentApplicants: ApplicantListItem[];
  recentActivities: AdminRecentActivity[];
  chartReport: Pick<
    AdminReportsData,
    "applicationsByStatus" | "monthlyApplications" | "programmeBreakdown"
  >;
};

const statusBadgeClass: Record<ApplicationStatus, string> = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-amber-100 text-amber-800",
  interview_scheduled: "bg-purple-100 text-purple-800",
  interviewed: "bg-indigo-100 text-indigo-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminDashboardOverview({
  stats,
  recentApplicants,
  recentActivities,
  chartReport,
}: AdminDashboardOverviewProps) {
  const acceptanceRate =
    stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const summaryCards: {
    label: string;
    value: number | string;
    icon: IconType;
    cardClass: string;
    iconClass: string;
    valueClass: string;
    helper: string;
  }[] = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: FiUsers,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white shadow-blue-200",
      valueClass: "text-blue-800",
      helper: "All submitted applications in the system.",
    },
    {
      label: "Awaiting Review",
      value: stats.submitted,
      icon: FiClock,
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
      iconClass: "bg-amber-500 text-white shadow-amber-200",
      valueClass: "text-amber-700",
      helper: "New applications pending first review.",
    },
    {
      label: "Under Review",
      value: stats.underReview,
      icon: FiFileText,
      cardClass: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
      iconClass: "bg-violet-600 text-white shadow-violet-200",
      valueClass: "text-violet-800",
      helper: "Applications currently being evaluated.",
    },
    {
      label: "Interviews",
      value: stats.interviewsScheduled,
      icon: FiCalendar,
      cardClass: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50",
      iconClass: "bg-sky-600 text-white shadow-sky-200",
      valueClass: "text-sky-800",
      helper: `${stats.interviewsCompleted} completed interviews.`,
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: FiCheckCircle,
      cardClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50",
      iconClass: "bg-emerald-600 text-white shadow-emerald-200",
      valueClass: "text-emerald-800",
      helper: `${acceptanceRate}% acceptance rate.`,
    },
  ];

  const activityStyles: Record<
    AdminRecentActivity["type"],
    { icon: IconType; iconClass: string }
  > = {
    accepted: {
      icon: FiCheckCircle,
      iconClass: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    },
    interview: {
      icon: FiCalendar,
      iconClass: "bg-sky-100 text-sky-700 ring-sky-200",
    },
    completed: {
      icon: FiUserCheck,
      iconClass: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    },
    letter: {
      icon: FiMail,
      iconClass: "bg-amber-100 text-amber-700 ring-amber-200",
    },
    application: {
      icon: FiFileText,
      iconClass: "bg-orange-100 text-orange-700 ring-orange-200",
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md",
                card.cardClass
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {card.label}
                  </p>
                  <p className={cn("mt-2 text-3xl font-bold", card.valueClass)}>
                    {card.value}
                  </p>
                </div>
                <span
                  className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-md", card.iconClass)}
                >
                  <Icon size={16} aria-hidden />
                </span>
              </div>
              <p className="mt-3 text-xs text-zinc-600">{card.helper}</p>
            </div>
          );
        })}
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">
              Admissions analytics
            </h2>
            <p className="text-sm text-zinc-500">
              Status mix, monthly trend, and top programmes at a glance.
            </p>
          </div>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-blue)] hover:underline"
          >
            Full reports & export
            <FiArrowRight size={15} aria-hidden />
          </Link>
        </div>
        <AdminCharts report={chartReport} compact />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[var(--primary-blue)]">
                Admissions Performance
              </h2>
              <p className="text-sm text-zinc-500">
                High-level status distribution for current applicants.
              </p>
            </div>
            <FiTrendingUp className="text-emerald-600" size={20} aria-hidden />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Accepted",
                value: stats.accepted,
                percent: stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0,
                bg: "bg-emerald-50",
                text: "text-emerald-700",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                percent: stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0,
                bg: "bg-red-50",
                text: "text-red-700",
              },
              {
                label: "In Process",
                value: stats.submitted + stats.underReview,
                percent:
                  stats.total > 0
                    ? Math.round(((stats.submitted + stats.underReview) / stats.total) * 100)
                    : 0,
                bg: "bg-amber-50",
                text: "text-amber-700",
              },
            ].map((item) => (
              <div key={item.label} className={cn("rounded-xl p-4", item.bg)}>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {item.label}
                </p>
                <p className={cn("mt-1 text-2xl font-bold", item.text)}>{item.value}</p>
                <p className="text-xs text-zinc-500">{item.percent}% of total applications</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-sky-900">Interview Pipeline</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Scheduled sessions and completed interview activity.
              </p>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white shadow-md shadow-sky-200">
              <FiCalendar size={16} aria-hidden />
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/80 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-sky-800">
                {stats.interviewsScheduled}
              </p>
              <p className="text-xs font-medium text-zinc-500">Scheduled</p>
            </div>
            <div className="rounded-xl bg-white/80 p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-indigo-800">
                {stats.interviewsCompleted}
              </p>
              <p className="text-xs font-medium text-zinc-500">Completed</p>
            </div>
          </div>
          <Link
            href="/admin/interviews"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-800 hover:underline"
          >
            Manage interviews
            <FiArrowRight size={15} aria-hidden />
          </Link>
        </article>

      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--primary-blue)]">Review Queue</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Applications requiring immediate action from admissions staff.
          </p>
          <div className="mt-4 flex flex-1 flex-col justify-center rounded-xl border border-dashed border-zinc-300 bg-slate-50 p-4 text-center">
            <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">
              <FiUserCheck size={18} aria-hidden />
            </span>
            <p className="mt-2 text-2xl font-bold text-[var(--primary-blue)]">
              {stats.submitted + stats.underReview}
            </p>
            <p className="text-xs text-zinc-500">Pending review and decision</p>
          </div>
          <Link
            href="/admin/applicants"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-blue)] hover:underline"
          >
            Open applicant queue
            <FiArrowRight size={15} aria-hidden />
          </Link>
        </article>

        <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--primary-blue)]">
                Recent Activity
              </h2>
              <p className="text-sm text-zinc-500">
                Latest admissions movement across applications, interviews, and letters.
              </p>
            </div>
            <Link
              href="/admin/notifications"
              className="hidden shrink-0 text-sm font-semibold text-[var(--primary-blue)] hover:underline sm:inline"
            >
              View All
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-5 py-10 text-center text-sm text-zinc-500">
              No recent activity yet.
            </div>
          ) : (
            <div className="max-h-72 flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {recentActivities.map((activity) => {
                const style = activityStyles[activity.type];
                const Icon = style.icon;
                return (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    className="group flex gap-3 py-3.5 transition-colors hover:bg-slate-50/60"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1",
                        style.iconClass
                      )}
                    >
                      <Icon size={13} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug text-zinc-700 transition-colors group-hover:text-[var(--primary-blue)]">
                        {activity.title}
                      </span>
                      <span className="mt-1 block text-xs text-zinc-500">
                        {formatDate(activity.timestamp)}, {formatTime(activity.timestamp)}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="border-t border-slate-100 px-5 py-3 text-center sm:hidden">
            <Link
              href="/admin/notifications"
              className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
            >
              View All
            </Link>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">
              Recent Applicants
            </h2>
            <p className="text-sm text-zinc-500">
              Students who recently submitted admission applications.
            </p>
          </div>
          <Link
            href="/admin/applicants"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-blue)] hover:underline"
          >
            View all
            <FiArrowRight size={16} aria-hidden />
          </Link>
        </div>

        {recentApplicants.length === 0 ? (
          <div
            className="px-5 py-10 text-center text-sm text-zinc-500"
          >
            No applications submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase text-zinc-500">
                  <th className="px-5 py-3">Applicant</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApplicants.map((applicant) => (
                  <tr key={applicant.studentId} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[var(--primary-blue)]">
                        {applicant.fullname}
                      </p>
                      <p className="text-xs text-zinc-500">{applicant.email}</p>
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {applicant.firstChoiceCourse ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                          statusBadgeClass[applicant.applicationStatus]
                        )}
                      >
                        {applicationStatusLabel[applicant.applicationStatus]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">
                      {formatDate(applicant.submittedAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/applicants/${applicant.studentId}`}
                        className="text-sm font-semibold text-[var(--primary-blue)] hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
