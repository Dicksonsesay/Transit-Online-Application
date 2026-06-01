import { toCalendarDateString } from "@/lib/calendar-date";
import { prisma } from "@/lib/prisma";
import type { InterviewStatus } from "@/generated/prisma/client";

export type InterviewListItem = {
  id: number;
  studentId: number;
  studentName: string;
  applicationNumber: string | null;
  email: string;
  interviewDate: string;
  interviewTime: string;
  venue: string | null;
  meetingLink: string | null;
  interviewStatus: InterviewStatus;
  remarks: string | null;
  scheduledByName: string;
  createdAt: string;
};

export type ApplicantForInterview = {
  studentId: number;
  fullname: string;
  applicationNumber: string | null;
  email: string;
  applicationStatus: string;
  hasScheduledInterview: boolean;
};

export async function listInterviews(): Promise<InterviewListItem[]> {
  const rows = await prisma.interview.findMany({
    orderBy: [{ interviewDate: "desc" }, { createdAt: "desc" }],
    include: {
      student: {
        select: {
          id: true,
          fullname: true,
          applicationNumber: true,
          email: true,
        },
      },
      scheduledBy: { select: { fullname: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    studentId: row.student.id,
    studentName: row.student.fullname,
    applicationNumber: row.student.applicationNumber,
    email: row.student.email,
    interviewDate: toCalendarDateString(row.interviewDate),
    interviewTime: row.interviewTime.toISOString(),
    venue: row.venue,
    meetingLink: row.meetingLink,
    interviewStatus: row.interviewStatus,
    remarks: row.remarks,
    scheduledByName: row.scheduledBy.fullname,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function listApplicantsForInterview(): Promise<ApplicantForInterview[]> {
  const applications = await prisma.application.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      student: {
        select: {
          id: true,
          fullname: true,
          applicationNumber: true,
          email: true,
          interviews: {
            where: { interviewStatus: "scheduled" },
            take: 1,
            select: { id: true },
          },
        },
      },
    },
  });

  return applications.map((app) => ({
    studentId: app.student.id,
    fullname: app.student.fullname,
    applicationNumber: app.student.applicationNumber,
    email: app.student.email,
    applicationStatus: app.applicationStatus,
    hasScheduledInterview: app.student.interviews.length > 0,
  }));
}
