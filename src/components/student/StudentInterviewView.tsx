"use client";

import {
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiInfo,
  FiMapPin,
  FiVideo,
} from "react-icons/fi";
import { interviewStatusBadgeClass, interviewStatusLabel } from "@/lib/interview-status";
import type { StudentInterviewData } from "@/lib/student-interview";
import {
  formatCalendarDateLong,
  formatCalendarTime,
  parseCalendarDateParts,
} from "@/lib/calendar-date";
import { cn } from "@/lib/utils";

type StudentInterviewViewProps = {
  interview: StudentInterviewData;
};

function buildCalendarUrl(interview: NonNullable<StudentInterviewData>): string {
  const { year, month, day } = parseCalendarDateParts(interview.interviewDate);
  const time = new Date(interview.interviewTime);
  const hours = time.getUTCHours();
  const minutes = time.getUTCMinutes();

  const start = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day, hours + 1, minutes, 0, 0));

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Transit College Admission Interview",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: interview.venue ?? "Transit College Sierra Leone",
    location: interview.venue ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function InfoCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof FiCalendar;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md",
        accent
      )}
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[var(--primary-blue)] shadow-sm ring-1 ring-slate-200/80">
        <Icon size={18} aria-hidden />
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold leading-snug text-[var(--dark-blue)] sm:text-base">
        {value}
      </p>
    </div>
  );
}

export default function StudentInterviewView({ interview }: StudentInterviewViewProps) {
  if (!interview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
          <div className="bg-gradient-to-br from-[var(--hero-blue)] to-[var(--primary-blue)] px-6 py-10 text-center text-white sm:px-10">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <FiCalendar size={28} aria-hidden />
            </span>
            <h2 className="mt-5 text-2xl font-bold">No interview scheduled yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/85">
              When admissions schedules your interview, the date, time, and venue will
              appear here. You will also receive an email and a message in your portal.
            </p>
          </div>
          <div className="px-6 py-8 sm:px-10">
            <div className="flex items-start gap-3 rounded-2xl bg-blue-50 px-4 py-4 text-sm text-blue-900 ring-1 ring-blue-100">
              <FiInfo className="mt-0.5 shrink-0" size={18} aria-hidden />
              <p>
                Keep checking your <strong>Messages</strong> and registered email for
                updates from the admissions office.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isUpcoming = interview.interviewStatus === "scheduled";
  const calendarUrl = buildCalendarUrl(interview);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)] p-6 text-white shadow-lg sm:p-8">
        <div
          className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[var(--primary-yellow)]/25 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary-yellow)] ring-1 ring-white/20">
              <FiCalendar size={14} aria-hidden />
              {isUpcoming ? "Upcoming interview" : "Interview record"}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-white/20",
                interview.interviewStatus === "scheduled"
                  ? "bg-[var(--primary-yellow)] text-[var(--dark-blue)]"
                  : "bg-white/20 text-white"
              )}
            >
              {interviewStatusLabel[interview.interviewStatus]}
            </span>
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
            {formatCalendarDateLong(interview.interviewDate)}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--primary-yellow)]">
            <FiClock size={20} aria-hidden />
            {formatCalendarTime(interview.interviewTime)}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85">
            {isUpcoming
              ? "Please review the details below and arrive prepared with your original documents."
              : "Your interview details are recorded below for your reference."}
          </p>
        </div>
      </section>

      {/* Detail cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard
          icon={FiCalendar}
          label="Interview date"
          value={formatCalendarDateLong(interview.interviewDate)}
          accent="border-blue-100 bg-gradient-to-br from-blue-50 to-white"
        />
        <InfoCard
          icon={FiClock}
          label="Interview time"
          value={formatCalendarTime(interview.interviewTime)}
          accent="border-amber-100 bg-gradient-to-br from-amber-50 to-white"
        />
        <div className="sm:col-span-2">
          <InfoCard
            icon={FiMapPin}
            label="Venue"
            value={interview.venue ?? "To be confirmed"}
            accent="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white"
          />
        </div>
      </div>

      {interview.meetingLink ? (
        <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md">
                <FiVideo size={20} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-violet-900">Online meeting</p>
                <p className="mt-0.5 text-xs text-violet-700/80">
                  Join using the link provided by admissions
                </p>
              </div>
            </div>
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
            >
              Join meeting
              <FiExternalLink size={16} aria-hidden />
            </a>
          </div>
        </section>
      ) : null}

      {interview.remarks ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
            Remarks from admissions
          </p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{interview.remarks}</p>
        </section>
      ) : null}

      {isUpcoming ? (
        <>
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            <FiClock className="mt-0.5 shrink-0 text-amber-700" size={18} aria-hidden />
            <div>
              <p className="font-semibold">Before you arrive</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-amber-900/90">
                <li>Arrive at least 15 minutes early</li>
                <li>Bring all original certificates and valid ID</li>
                <li>Dress formally and check your Messages for any changes</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-8 py-3.5 text-sm font-bold text-[var(--dark-blue)] shadow-md shadow-amber-900/10 transition-transform hover:scale-[1.02]"
            >
              <FiCalendar size={18} aria-hidden />
              Add to Google Calendar
            </a>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm text-zinc-600">
          Status:{" "}
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              interviewStatusBadgeClass[interview.interviewStatus]
            )}
          >
            {interviewStatusLabel[interview.interviewStatus]}
          </span>
        </div>
      )}
    </div>
  );
}
