"use server";

import { revalidatePath } from "next/cache";
import { getDefaultInterviewVenueFromSettings } from "@/lib/system-settings";
import { createStudentNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/session";
import {
  formatCalendarDateLong,
  formatCalendarTime,
  parseCalendarDateInput,
  parseCalendarTimeInput,
} from "@/lib/calendar-date";
import type { InterviewStatus } from "@/generated/prisma/client";

function parseAdminId(sessionUserId: string | undefined): number | null {
  const id = Number.parseInt(sessionUserId ?? "", 10);
  return Number.isNaN(id) ? null : id;
}

function parseDateAndTime(
  dateStr: string,
  timeStr: string
): { interviewDate: Date; interviewTime: Date } | { error: string } {
  const interviewDate = parseCalendarDateInput(dateStr);
  if (Number.isNaN(interviewDate.getTime())) {
    return { error: "Enter a valid interview date." };
  }

  const interviewTime = parseCalendarTimeInput(timeStr);
  if (Number.isNaN(interviewTime.getTime())) {
    return { error: "Enter a valid interview time." };
  }

  return { interviewDate, interviewTime };
}

function revalidateInterviewPaths(studentId?: number) {
  const paths = [
    "/student",
    "/student/interview",
    "/student/messages",
    "/admin",
    "/admin/interviews",
    "/admin/applicants",
  ];
  for (const path of paths) {
    revalidatePath(path);
  }
  if (studentId) {
    revalidatePath(`/admin/applicants/${studentId}`);
  }
}

export async function scheduleInterviewAction(
  _prev: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) return { error: "You must be signed in as an admin." };

  const adminId = parseAdminId(session.user.id);
  if (adminId === null) return { error: "Invalid admin session." };

  const studentId = Number.parseInt(formData.get("studentId")?.toString() ?? "", 10);
  const dateStr = formData.get("interviewDate")?.toString().trim() ?? "";
  const timeStr = formData.get("interviewTime")?.toString().trim() ?? "";
  const defaultVenue = await getDefaultInterviewVenueFromSettings();
  const venue = formData.get("venue")?.toString().trim() || defaultVenue;
  const meetingLink = formData.get("meetingLink")?.toString().trim() || null;
  const remarks = formData.get("remarks")?.toString().trim() || null;

  if (!Number.isInteger(studentId) || studentId < 1) {
    return { error: "Select an applicant." };
  }

  const parsed = parseDateAndTime(dateStr, timeStr);
  if ("error" in parsed) return { error: parsed.error };

  const application = await prisma.application.findUnique({
    where: { studentId },
  });

  if (!application) {
    return { error: "Applicant not found or has not submitted an application." };
  }

  const existing = await prisma.interview.findFirst({
    where: { studentId, interviewStatus: "scheduled" },
    select: { id: true },
  });

  if (existing) {
    await prisma.interview.update({
      where: { id: existing.id },
      data: {
        interviewDate: parsed.interviewDate,
        interviewTime: parsed.interviewTime,
        venue,
        meetingLink,
        remarks,
        scheduledById: adminId,
      },
    });
  } else {
    await prisma.interview.create({
      data: {
        studentId,
        scheduledById: adminId,
        interviewDate: parsed.interviewDate,
        interviewTime: parsed.interviewTime,
        venue,
        meetingLink,
        remarks,
      },
    });
  }

  await prisma.application.update({
    where: { studentId },
    data: { applicationStatus: "interview_scheduled" },
  });

  const dateLabel = formatCalendarDateLong(parsed.interviewDate);
  const timeLabel = formatCalendarTime(parsed.interviewTime);

  const meetingLine = meetingLink
    ? ` Online meeting link: ${meetingLink}`
    : "";

  await createStudentNotification({
    studentId,
    notificationType: "interview",
    title: "Interview scheduled",
    message: `Your interview is scheduled for ${dateLabel} at ${timeLabel}. Venue: ${venue}.${meetingLine} Please arrive 15 minutes early with all original documents. You will also receive this update by email.`,
  });

  revalidateInterviewPaths(studentId);
  return { success: true };
}

export async function updateInterviewStatusAction(
  interviewId: number,
  status: InterviewStatus,
  remarks?: string | null
): Promise<{ error?: string; success?: boolean }> {
  const session = await requireAdminSession();
  if (!session) return { error: "You must be signed in as an admin." };

  if (!Number.isInteger(interviewId) || interviewId < 1) {
    return { error: "Invalid interview." };
  }

  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { student: { select: { id: true } } },
  });

  if (!interview) return { error: "Interview not found." };

  await prisma.interview.update({
    where: { id: interviewId },
    data: {
      interviewStatus: status,
      remarks: remarks ?? interview.remarks,
    },
  });

  if (status === "completed") {
    await prisma.application.update({
      where: { studentId: interview.studentId },
      data: { applicationStatus: "interviewed" },
    });
  }

  const statusMessages: Partial<Record<InterviewStatus, string>> = {
    completed:
      "Your interview has been marked as completed. Admissions will contact you about the next steps.",
    missed:
      "You missed your scheduled interview. Please contact the admissions office to reschedule.",
    cancelled:
      "Your scheduled interview has been cancelled. Please check your messages for updates.",
  };

  if (statusMessages[status]) {
    await createStudentNotification({
      studentId: interview.studentId,
      notificationType: "interview",
      title: `Interview ${status}`,
      message: statusMessages[status]!,
    });
  }

  revalidateInterviewPaths(interview.studentId);
  return { success: true };
}
