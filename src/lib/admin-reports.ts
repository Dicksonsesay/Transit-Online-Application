import { prisma } from "@/lib/prisma";

export type AdminReportsData = {
  generatedAt: string;
  totals: {
    applications: number;
    accepted: number;
    rejected: number;
    inReview: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
    pinsIssued: number;
    acceptanceLetters: number;
  };
  conversion: {
    acceptanceRate: number;
    rejectionRate: number;
    completionRate: number;
  };
  applicationsByStatus: { label: string; value: number; colorClass: string }[];
  programmeBreakdown: { programmeName: string; count: number; share: number }[];
  monthlyApplications: { monthLabel: string; count: number }[];
};

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabelFromKey(key: string) {
  const [year, month] = key.split("-").map((v) => Number.parseInt(v, 10));
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "2-digit" }).format(date);
}

export async function getAdminReportsData(): Promise<AdminReportsData> {
  const now = new Date();
  const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  const [
    applications,
    totalApplications,
    accepted,
    rejected,
    submitted,
    underReview,
    interviewScheduled,
    interviewed,
    interviewsScheduled,
    interviewsCompleted,
    pinsIssued,
    acceptanceLetters,
  ] = await Promise.all([
    prisma.application.findMany({
      select: {
        applicationStatus: true,
        submittedAt: true,
        programme: { select: { programmeName: true } },
      },
      orderBy: { submittedAt: "asc" },
    }),
    prisma.application.count(),
    prisma.application.count({ where: { applicationStatus: "accepted" } }),
    prisma.application.count({ where: { applicationStatus: "rejected" } }),
    prisma.application.count({ where: { applicationStatus: "submitted" } }),
    prisma.application.count({ where: { applicationStatus: "under_review" } }),
    prisma.application.count({
      where: { applicationStatus: "interview_scheduled" },
    }),
    prisma.application.count({ where: { applicationStatus: "interviewed" } }),
    prisma.interview.count({ where: { interviewStatus: "scheduled" } }),
    prisma.interview.count({ where: { interviewStatus: "completed" } }),
    prisma.pin.count(),
    prisma.acceptanceLetter.count(),
  ]);

  const inReview = submitted + underReview;
  const acceptanceRate =
    totalApplications > 0 ? Math.round((accepted / totalApplications) * 100) : 0;
  const rejectionRate =
    totalApplications > 0 ? Math.round((rejected / totalApplications) * 100) : 0;
  const completionRate =
    totalApplications > 0
      ? Math.round(((accepted + rejected) / totalApplications) * 100)
      : 0;

  const programmeMap = new Map<string, number>();
  for (const application of applications) {
    const current = programmeMap.get(application.programme.programmeName) ?? 0;
    programmeMap.set(application.programme.programmeName, current + 1);
  }

  const programmeBreakdown = Array.from(programmeMap.entries())
    .map(([programmeName, count]) => ({
      programmeName,
      count,
      share: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const monthTemplate: string[] = [];
  for (let i = 0; i < 6; i += 1) {
    const monthDate = new Date(
      Date.UTC(startMonth.getUTCFullYear(), startMonth.getUTCMonth() + i, 1)
    );
    monthTemplate.push(monthKey(monthDate));
  }

  const monthCount = new Map<string, number>(monthTemplate.map((k) => [k, 0]));
  for (const application of applications) {
    if (application.submittedAt < startMonth) continue;
    const key = monthKey(application.submittedAt);
    monthCount.set(key, (monthCount.get(key) ?? 0) + 1);
  }

  const monthlyApplications = monthTemplate.map((key) => ({
    monthLabel: monthLabelFromKey(key),
    count: monthCount.get(key) ?? 0,
  }));

  return {
    generatedAt: now.toISOString(),
    totals: {
      applications: totalApplications,
      accepted,
      rejected,
      inReview,
      interviewsScheduled,
      interviewsCompleted,
      pinsIssued,
      acceptanceLetters,
    },
    conversion: {
      acceptanceRate,
      rejectionRate,
      completionRate,
    },
    applicationsByStatus: [
      { label: "Submitted", value: submitted, colorClass: "bg-blue-500" },
      { label: "Under Review", value: underReview, colorClass: "bg-amber-500" },
      {
        label: "Interview Scheduled",
        value: interviewScheduled,
        colorClass: "bg-purple-500",
      },
      { label: "Interviewed", value: interviewed, colorClass: "bg-indigo-500" },
      { label: "Accepted", value: accepted, colorClass: "bg-emerald-500" },
      { label: "Rejected", value: rejected, colorClass: "bg-red-500" },
    ],
    programmeBreakdown,
    monthlyApplications,
  };
}
