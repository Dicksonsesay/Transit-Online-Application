"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AdminReportsData } from "@/lib/admin-reports";

const STATUS_COLORS = [
  "#2563eb",
  "#d97706",
  "#9333ea",
  "#4f46e5",
  "#059669",
  "#dc2626",
];

const CHART_TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  fontSize: 12,
};

type AdminChartsProps = {
  report: Pick<
    AdminReportsData,
    "applicationsByStatus" | "monthlyApplications" | "programmeBreakdown"
  >;
  compact?: boolean;
};

export default function AdminCharts({ report, compact = false }: AdminChartsProps) {
  const statusData = report.applicationsByStatus.map((s, i) => ({
    name: s.label,
    value: s.value,
    fill: STATUS_COLORS[i % STATUS_COLORS.length],
  }));

  const monthlyData = report.monthlyApplications.map((m) => ({
    name: m.monthLabel,
    applications: m.count,
  }));

  const programmeData = report.programmeBreakdown.slice(0, compact ? 5 : 8).map((p) => ({
    name:
      p.programmeName.length > 28
        ? `${p.programmeName.slice(0, 26)}…`
        : p.programmeName,
    fullName: p.programmeName,
    applications: p.count,
  }));

  const chartHeight = compact ? 220 : 280;

  return (
    <div
      className={
        compact
          ? "grid gap-4 lg:grid-cols-2"
          : "grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
      }
    >
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
        <h3 className="text-sm font-bold text-[var(--primary-blue)]">
          Applications by status
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">Current pipeline distribution</p>
        <div className="mt-3" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={compact ? 40 : 55}
                outerRadius={compact ? 70 : 90}
                paddingAngle={2}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-1">
        <h3 className="text-sm font-bold text-[var(--primary-blue)]">
          Monthly submissions
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">Last six months</p>
        <div className="mt-3" style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#003e91"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#f1c40f", stroke: "#003e91", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      {programmeData.length > 0 && (
        <article
          className={
            compact
              ? "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2"
              : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3"
          }
        >
          <h3 className="text-sm font-bold text-[var(--primary-blue)]">
            Top programmes
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500">Application volume by programme</p>
          <div className="mt-3" style={{ height: compact ? 240 : 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={programmeData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={compact ? 100 : 130}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(value) => [value, "Applications"]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.fullName ?? ""
                  }
                />
                <Bar dataKey="applications" fill="#003e91" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      )}
    </div>
  );
}
