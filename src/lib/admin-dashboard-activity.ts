import { prisma } from "@/lib/prisma";

export type AdminRecentActivity = {
  id: string;
  title: string;
  timestamp: string;
  href: string;
  type: "accepted" | "interview" | "completed" | "letter" | "application";
};

export async function getAdminRecentActivities(
  limit = 8
): Promise<AdminRecentActivity[]> {
  const [accepted, submitted, interviews, letters] = await Promise.all([
    prisma.application.findMany({
      where: { applicationStatus: "accepted" },
      orderBy: { submittedAt: "desc" },
      take: limit,
      include: { student: { select: { id: true, fullname: true } } },
    }),
    prisma.application.findMany({
      where: { applicationStatus: "submitted" },
      orderBy: { submittedAt: "desc" },
      take: limit,
      include: { student: { select: { id: true, fullname: true } } },
    }),
    prisma.interview.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { student: { select: { fullname: true } } },
    }),
    prisma.acceptanceLetter.findMany({
      orderBy: { generatedAt: "desc" },
      take: limit,
      include: { student: { select: { id: true, fullname: true } } },
    }),
  ]);

  const activities: AdminRecentActivity[] = [
    ...accepted.map((item) => ({
      id: `accepted-${item.id}`,
      title: `${item.student.fullname} has been accepted.`,
      timestamp: item.submittedAt.toISOString(),
      href: `/admin/applicants/${item.student.id}`,
      type: "accepted" as const,
    })),
    ...submitted.map((item) => ({
      id: `submitted-${item.id}`,
      title: `New application submitted by ${item.student.fullname}.`,
      timestamp: item.submittedAt.toISOString(),
      href: `/admin/applicants/${item.student.id}`,
      type: "application" as const,
    })),
    ...interviews.map((item) => ({
      id: `interview-${item.id}`,
      title:
        item.interviewStatus === "completed"
          ? `${item.student.fullname} interview completed.`
          : `Interview scheduled for ${item.student.fullname}.`,
      timestamp: item.createdAt.toISOString(),
      href: "/admin/interviews",
      type:
        item.interviewStatus === "completed"
          ? ("completed" as const)
          : ("interview" as const),
    })),
    ...letters.map((item) => ({
      id: `letter-${item.id}`,
      title: `Acceptance letter generated for ${item.student.fullname}.`,
      timestamp: item.generatedAt.toISOString(),
      href: `/admin/applicants/${item.student.id}`,
      type: "letter" as const,
    })),
  ];

  return activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
}
