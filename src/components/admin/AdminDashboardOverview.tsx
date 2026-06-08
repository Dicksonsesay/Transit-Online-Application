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
import type { AdminRecentActivity } from "@/lib/admin-dashboard-activity";
import AdminCharts from "@/components/admin/charts/AdminCharts";
import AdminSectionHeader from "@/components/admin/ui/AdminSectionHeader";
import AdminStatusBadge from "@/components/admin/ui/AdminStatusBadge";
import { AdminStatGrid, type AdminStatItem } from "@/components/admin/ui/AdminStatGrid";
import {
  AdminTable,
  AdminTableBody,
  AdminTableHead,
  AdminTableRow,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui/AdminTable";
import type { ApplicantListItem } from "@/lib/admin-applicants";
import type { AdminReportsData } from "@/lib/admin-reports";
import { cn, formatDate, formatTime } from "@/lib/utils";

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

export default function AdminDashboardOverview({
  stats,
  recentApplicants,
  recentActivities,
  chartReport,
}: AdminDashboardOverviewProps) {
  const acceptanceRate =
    stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const summaryCards: AdminStatItem[] = [
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
      <AdminStatGrid items={summaryCards} className="xl:grid-cols-5" />

      <section className="space-y-4">
        <AdminSectionHeader
          title="Admissions analytics"
          description="Status mix, monthly trend, and top programmes at a glance."
          icon={FiTrendingUp}
          iconClass="bg-emerald-100 text-emerald-700"
          action={
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1 rounded-xl bg-[var(--primary-blue)]/10 px-3 py-2 text-sm font-semibold text-[var(--primary-blue)] transition-colors hover:bg-[var(--primary-blue)]/15"
            >
              Full reports
              <FiArrowRight size={15} aria-hidden />
            </Link>
          }
        />
        <AdminCharts report={chartReport} compact />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.04] lg:col-span-2">
          <div className="border-b border-slate-100 px-5 py-4">
            <AdminSectionHeader
              title="Admissions performance"
              description="High-level status distribution for current applicants."
              icon={FiTrendingUp}
              iconClass="bg-emerald-100 text-emerald-700"
            />
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {[
              {
                label: "Accepted",
                value: stats.accepted,
                percent: stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0,
                bg: "bg-emerald-50 border border-emerald-100",
                text: "text-emerald-700",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                percent: stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0,
                bg: "bg-red-50 border border-red-100",
                text: "text-red-700",
              },
              {
                label: "In process",
                value: stats.submitted + stats.underReview,
                percent:
                  stats.total > 0
                    ? Math.round(((stats.submitted + stats.underReview) / stats.total) * 100)
                    : 0,
                bg: "bg-amber-50 border border-amber-100",
                text: "text-amber-700",
              },
            ].map((item) => (
              <div key={item.label} className={cn("rounded-xl p-4", item.bg)}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {item.label}
                </p>
                <p className={cn("mt-1 text-2xl font-bold tabular-nums", item.text)}>
                  {item.value}
                </p>
                <p className="text-xs text-zinc-500">{item.percent}% of total applications</p>
              </div>
            ))}
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-indigo-50 shadow-sm ring-1 ring-sky-100/80">
          <div className="border-b border-sky-100/80 bg-white/40 px-5 py-4">
            <AdminSectionHeader
              title="Interview pipeline"
              description="Scheduled sessions and completed interviews."
              icon={FiCalendar}
              iconClass="bg-sky-600 text-white shadow-md shadow-sky-200"
            />
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-sky-100 bg-white/90 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold tabular-nums text-sky-800">
                  {stats.interviewsScheduled}
                </p>
                <p className="text-xs font-medium text-zinc-500">Scheduled</p>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white/90 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold tabular-nums text-indigo-800">
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
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.04]">
          <div className="border-b border-slate-100 px-5 py-4">
            <AdminSectionHeader
              title="Review queue"
              description="Applications requiring immediate action from admissions staff."
              icon={FiUserCheck}
              iconClass="bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]"
            />
          </div>
          <div className="p-5">
            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-6 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-blue)] text-white shadow-md">
                <FiUserCheck size={22} aria-hidden />
              </span>
              <p className="mt-3 text-3xl font-bold tabular-nums text-[var(--primary-blue)]">
                {stats.submitted + stats.underReview}
              </p>
              <p className="text-sm text-zinc-500">Pending review and decision</p>
            </div>
            <Link
              href="/admin/applicants"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-blue)] hover:underline"
            >
              Open applicant queue
              <FiArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </article>

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.04]">
          <div className="border-b border-slate-100 px-5 py-4">
            <AdminSectionHeader
              title="Recent activity"
              description="Latest movement across applications, interviews, and letters."
              icon={FiFileText}
              action={
                <Link
                  href="/admin/notifications"
                  className="hidden text-sm font-semibold text-[var(--primary-blue)] hover:underline sm:inline"
                >
                  View all
                </Link>
              }
            />
          </div>

          {recentActivities.length === 0 ? (
            <div className="flex items-center justify-center px-5 py-12 text-center text-sm text-zinc-500">
              No recent activity yet.
            </div>
          ) : (
            <div className="max-h-72 divide-y divide-slate-100 overflow-y-auto">
              {recentActivities.map((activity) => {
                const style = activityStyles[activity.type];
                const Icon = style.icon;
                return (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    className="group flex gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/80"
                  >
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1",
                        style.iconClass
                      )}
                    >
                      <Icon size={14} aria-hidden />
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
        </section>
      </div>

      <AdminTableShell
        title="Recent applicants"
        subtitle="Students who recently submitted admission applications."
        countLabel={`${recentApplicants.length} shown`}
      >
        {recentApplicants.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-zinc-500">
            No applications submitted yet.
          </p>
        ) : (
          <AdminTable>
            <AdminTableHead>
              <AdminTh>Applicant</AdminTh>
              <AdminTh>Course</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Submitted</AdminTh>
              <AdminTh className="text-right">Action</AdminTh>
            </AdminTableHead>
            <AdminTableBody>
              {recentApplicants.map((applicant) => (
                <AdminTableRow key={applicant.studentId} striped>
                  <AdminTd>
                    <p className="font-semibold text-[var(--primary-blue)]">
                      {applicant.fullname}
                    </p>
                    <p className="text-xs text-zinc-500">{applicant.email}</p>
                  </AdminTd>
                  <AdminTd className="text-zinc-600">
                    {applicant.firstChoiceCourse ?? "—"}
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge status={applicant.applicationStatus} />
                  </AdminTd>
                  <AdminTd className="text-zinc-500">
                    {formatDate(applicant.submittedAt)}
                  </AdminTd>
                  <AdminTd className="text-right">
                    <Link
                      href={`/admin/applicants/${applicant.studentId}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary-blue)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--primary-blue)] transition-colors hover:bg-[var(--primary-blue)]/15"
                    >
                      Details
                      <FiArrowRight size={12} aria-hidden />
                    </Link>
                  </AdminTd>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
        )}
      </AdminTableShell>
    </div>
  );
}
