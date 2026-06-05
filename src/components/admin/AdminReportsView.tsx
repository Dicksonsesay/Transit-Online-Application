import type { IconType } from "react-icons";
import {
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiKey,
  FiMail,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import AdminCharts from "@/components/admin/charts/AdminCharts";
import AdminReportExportToolbar from "@/components/admin/AdminReportExportToolbar";
import { cn, formatDate } from "@/lib/utils";
import type { AdminReportsData } from "@/lib/admin-reports";

type AdminReportsViewProps = {
  report: AdminReportsData;
};

const metricCards: {
  label: string;
  key: keyof AdminReportsData["totals"];
  icon: IconType;
  cardClass: string;
  iconClass: string;
  valueClass: string;
}[] = [
  {
    label: "Total Applications",
    key: "applications",
    icon: FiUsers,
    cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
    iconClass: "bg-blue-600 text-white shadow-blue-200",
    valueClass: "text-blue-800",
  },
  {
    label: "In Review",
    key: "inReview",
    icon: FiClock,
    cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
    iconClass: "bg-amber-500 text-white shadow-amber-200",
    valueClass: "text-amber-700",
  },
  {
    label: "Accepted",
    key: "accepted",
    icon: FiCheckCircle,
    cardClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50",
    iconClass: "bg-emerald-600 text-white shadow-emerald-200",
    valueClass: "text-emerald-800",
  },
  {
    label: "Rejected",
    key: "rejected",
    icon: FiXCircle,
    cardClass: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50",
    iconClass: "bg-rose-600 text-white shadow-rose-200",
    valueClass: "text-rose-800",
  },
  {
    label: "Interviews Scheduled",
    key: "interviewsScheduled",
    icon: FiCalendar,
    cardClass: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50",
    iconClass: "bg-sky-600 text-white shadow-sky-200",
    valueClass: "text-sky-800",
  },
  {
    label: "Interviews Completed",
    key: "interviewsCompleted",
    icon: FiUserCheck,
    cardClass: "border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50",
    iconClass: "bg-indigo-600 text-white shadow-indigo-200",
    valueClass: "text-indigo-800",
  },
  {
    label: "PINs Issued",
    key: "pinsIssued",
    icon: FiKey,
    cardClass: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
    iconClass: "bg-violet-600 text-white shadow-violet-200",
    valueClass: "text-violet-800",
  },
  {
    label: "Offers of Admission",
    key: "acceptanceLetters",
    icon: FiMail,
    cardClass: "border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50",
    iconClass: "bg-teal-600 text-white shadow-teal-200",
    valueClass: "text-teal-800",
  },
];

export default function AdminReportsView({ report }: AdminReportsViewProps) {
  const maxMonthCount = Math.max(...report.monthlyApplications.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003e91] via-[#1f5fb8] to-[#f1c40f]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">Admissions Report</h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500">
              Operational snapshot for applications, interviews, PIN issuance, and
              offers of admission.
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Generated: {formatDate(report.generatedAt)}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-blue)] text-white shadow-md">
              <FiFileText size={16} aria-hidden />
            </span>
            <AdminReportExportToolbar />
          </div>
        </div>
      </section>

      <AdminCharts report={report} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const value = report.totals[card.key];
          return (
            <article
              key={card.label}
              className={cn(
                "rounded-2xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md",
                card.cardClass
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {card.label}
                  </p>
                  <p className={cn("mt-2 text-2xl font-bold", card.valueClass)}>{value}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-md",
                    card.iconClass
                  )}
                >
                  <Icon size={16} aria-hidden />
                </span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[var(--primary-blue)]">
                Conversion Metrics
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Acceptance, rejection, and completed decision rates.
              </p>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <FiTrendingUp size={16} aria-hidden />
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Acceptance Rate",
                value: `${report.conversion.acceptanceRate}%`,
                tone: "text-emerald-700",
                bg: "bg-emerald-50 border border-emerald-100",
              },
              {
                label: "Rejection Rate",
                value: `${report.conversion.rejectionRate}%`,
                tone: "text-red-700",
                bg: "bg-red-50 border border-red-100",
              },
              {
                label: "Decision Completion",
                value: `${report.conversion.completionRate}%`,
                tone: "text-indigo-700",
                bg: "bg-indigo-50 border border-indigo-100",
              },
            ].map((metric) => (
              <div key={metric.label} className={cn("rounded-xl p-4", metric.bg)}>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {metric.label}
                </p>
                <p className={cn("mt-1 text-2xl font-bold", metric.tone)}>{metric.value}</p>
              </div>
            ))}
          </div>

          <h4 className="mt-6 text-sm font-semibold text-zinc-700">Application Status Mix</h4>
          <div className="mt-3 space-y-3">
            {report.applicationsByStatus.map((status) => {
              const width =
                report.totals.applications > 0
                  ? Math.max(5, Math.round((status.value / report.totals.applications) * 100))
                  : 0;

              return (
                <div key={status.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
                    <span className="font-medium">{status.label}</span>
                    <span>{status.value}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full transition-all", status.colorClass)}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[var(--primary-blue)]">
                Monthly Applications
              </h3>
              <p className="mt-1 text-sm text-zinc-500">Last six months submission trend.</p>
            </div>
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <FiAward size={16} aria-hidden />
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {report.monthlyApplications.map((month) => {
              const width = Math.round((month.count / maxMonthCount) * 100);
              return (
                <div key={month.monthLabel}>
                  <div className="mb-1 flex items-center justify-between text-xs text-zinc-600">
                    <span className="font-medium">{month.monthLabel}</span>
                    <span>{month.count}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[var(--primary-blue)] transition-all"
                      style={{ width: `${Math.max(5, width)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-bold text-[var(--primary-blue)]">Top Programmes</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Programmes with the highest number of applications.
          </p>
        </div>
        {report.programmeBreakdown.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-zinc-500">
            No programme data available yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  <th className="px-5 py-3">Programme</th>
                  <th className="px-5 py-3">Applications</th>
                  <th className="px-5 py-3">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.programmeBreakdown.map((programme) => (
                  <tr key={programme.programmeName} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-medium text-zinc-700">
                      {programme.programmeName}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[var(--primary-blue)]">
                      {programme.count}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">{programme.share}%</td>
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
