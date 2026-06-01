import { toCalendarDateString } from "@/lib/calendar-date";
import { prisma } from "@/lib/prisma";
import { InterviewStatus } from "@/generated/prisma/client";

export type StudentInterviewData = {
  id: number;
  interviewDate: string;
  interviewTime: string;
  venue: string | null;
  meetingLink: string | null;
  interviewStatus: InterviewStatus;
  remarks: string | null;
} | null;

export async function getStudentInterview(
  studentId: number
): Promise<StudentInterviewData> {
  const interview = await prisma.interview.findFirst({
    where: {
      studentId,
      interviewStatus: {
        in: [
          InterviewStatus.scheduled,
          InterviewStatus.completed,
          InterviewStatus.missed,
        ],
      },
    },
    orderBy: [{ interviewDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      interviewDate: true,
      interviewTime: true,
      venue: true,
      meetingLink: true,
      interviewStatus: true,
      remarks: true,
    },
  });

  if (!interview) return null;

  return {
    id: interview.id,
    interviewDate: toCalendarDateString(interview.interviewDate),
    interviewTime: interview.interviewTime.toISOString(),
    venue: interview.venue,
    meetingLink: interview.meetingLink,
    interviewStatus: interview.interviewStatus,
    remarks: interview.remarks,
  };
}
