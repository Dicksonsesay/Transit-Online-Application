import { prisma } from "@/lib/prisma";

export type AdminNavbarAlert = {
  id: string;
  title: string;
  message: string;
  href: string;
  createdAt: string;
};

export async function getAdminNavbarAlerts(limit = 8): Promise<AdminNavbarAlert[]> {
  const [newApplications, upcomingInterviews] = await Promise.all([
    prisma.application.findMany({
      where: { applicationStatus: "submitted" },
      orderBy: { submittedAt: "desc" },
      take: limit,
      include: {
        student: {
          select: {
            id: true,
            fullname: true,
            applicationNumber: true,
          },
        },
      },
    }),
    prisma.interview.findMany({
      where: {
        interviewStatus: "scheduled",
        interviewDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      orderBy: [{ interviewDate: "asc" }, { interviewTime: "asc" }],
      take: 5,
      include: {
        student: {
          select: { id: true, fullname: true },
        },
      },
    }),
  ]);

  const applicationAlerts: AdminNavbarAlert[] = newApplications.map((app) => ({
    id: `app-${app.id}`,
    title: "New application submitted",
    message: `${app.student.fullname}${
      app.student.applicationNumber
        ? ` (${app.student.applicationNumber})`
        : ""
    } is awaiting review.`,
    href: `/admin/applicants/${app.student.id}`,
    createdAt: app.submittedAt.toISOString(),
  }));

  const interviewAlerts: AdminNavbarAlert[] = upcomingInterviews.map((item) => ({
    id: `interview-${item.id}`,
    title: "Upcoming interview",
    message: `${item.student.fullname} — ${item.interviewDate.toLocaleDateString("en-GB")}`,
    href: "/admin/interviews",
    createdAt: item.createdAt.toISOString(),
  }));

  return [...applicationAlerts, ...interviewAlerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getAdminAlertCount(): Promise<number> {
  const [submittedCount, todayInterviews] = await Promise.all([
    prisma.application.count({ where: { applicationStatus: "submitted" } }),
    prisma.interview.count({
      where: {
        interviewStatus: "scheduled",
        interviewDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
  ]);

  return submittedCount + todayInterviews;
}
