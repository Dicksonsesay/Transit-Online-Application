import { prisma } from "@/lib/prisma";
import { InterviewStatus } from "@/generated/prisma/client";

export async function getUnreadNotificationCount(studentId: number) {
  return prisma.notification.count({
    where: { studentId, isRead: false },
  });
}

export async function getStudentDashboardData(studentId: number) {
  const [student, applicationFormDraft] = await Promise.all([
    prisma.student.findUnique({
    where: { id: studentId },
    select: {
      fullname: true,
      applicationNumber: true,
      application: {
        select: { applicationStatus: true, submittedAt: true },
      },
      acceptanceLetter: {
        select: { generatedAt: true },
      },
      interviews: {
        where: {
          interviewStatus: {
            in: [InterviewStatus.scheduled, InterviewStatus.completed],
          },
        },
        orderBy: [{ interviewDate: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: {
          interviewDate: true,
          interviewTime: true,
          venue: true,
          meetingLink: true,
          interviewStatus: true,
        },
      },
      _count: {
        select: {
          notifications: { where: { isRead: false } },
        },
      },
    },
  }),
    prisma.applicationFormDraft.findUnique({
      where: { studentId },
      select: { currentSection: true, submittedAt: true },
    }),
  ]);

  if (!student) return null;

  return { ...student, applicationFormDraft };
}
