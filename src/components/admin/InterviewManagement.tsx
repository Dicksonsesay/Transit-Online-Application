"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import {
  deleteScheduledInterviewAction,
  scheduleInterviewAction,
  updateInterviewStatusAction,
} from "@/actions/admin-interviews";
import { AdminPageIntro, AdminToolbar } from "@/components/admin/ui/AdminToolbar";
import AdminExportToolbar from "@/components/admin/AdminExportToolbar";
import { AdminStatGrid, type AdminStatItem } from "@/components/admin/ui/AdminStatGrid";
import {
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableRow,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui/AdminTable";
import { interviewStatusBadgeClass, interviewStatusLabel } from "@/lib/interview-status";
import type { ApplicantForInterview, InterviewListItem } from "@/lib/admin-interviews";
import type { InterviewStatus } from "@/generated/prisma/client";
import {
  formatCalendarDateShort,
  formatCalendarTime,
  toCalendarDateString,
} from "@/lib/calendar-date";
import { cn } from "@/lib/utils";
import { confirmDelete, showError, showSuccess } from "@/lib/alerts";

type InterviewManagementProps = {
  interviews: InterviewListItem[];
  applicants: ApplicantForInterview[];
  defaultInterviewVenue: string;
};

const initialScheduleState: { error?: string; success?: boolean } = {};

export default function InterviewManagement({
  interviews,
  applicants,
  defaultInterviewVenue,
}: InterviewManagementProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [pendingStatus, startStatus] = useTransition();
  const [pendingDelete, startDelete] = useTransition();

  const [scheduleState, scheduleAction, scheduling] = useActionState(
    scheduleInterviewAction,
    initialScheduleState
  );
  const celebratedScheduleRef = useRef(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interviews;
    return interviews.filter(
      (i) =>
        i.studentName.toLowerCase().includes(q) ||
        (i.applicationNumber?.toLowerCase().includes(q) ?? false) ||
        (i.venue?.toLowerCase().includes(q) ?? false)
    );
  }, [interviews, query]);

  useEffect(() => {
    if (!scheduleState.success || scheduling || celebratedScheduleRef.current) return;
    celebratedScheduleRef.current = true;
    void showSuccess("Interview scheduled", "The applicant has been notified by email and in the portal.").then(() => {
      setShowForm(false);
      setSelectedStudentId("");
      router.refresh();
    });
  }, [scheduleState.success, scheduling, router]);

  function handleStatusChange(interviewId: number, status: InterviewStatus) {
    startStatus(async () => {
      const result = await updateInterviewStatusAction(interviewId, status);
      if (result.error) {
        await showError("Update failed", result.error);
        return;
      }
      await showSuccess("Updated", `Interview marked as ${interviewStatusLabel[status]}.`);
      router.refresh();
    });
  }

  function handleDelete(item: InterviewListItem) {
    startDelete(async () => {
      const result = await confirmDelete(
        `the scheduled interview for ${item.studentName}`,
        {
          text: "This removes the interview record so you can reschedule if needed. Completed interview records cannot be deleted.",
        }
      );
      if (!result.isConfirmed) return;

      const response = await deleteScheduledInterviewAction(item.id);
      if (response.error) {
        await showError("Cannot delete", response.error);
        return;
      }
      await showSuccess(
        "Interview removed",
        `${item.studentName}'s scheduled interview has been deleted.`
      );
      router.refresh();
    });
  }

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const defaultDate = toCalendarDateString(tomorrow);
  const scheduledCount = interviews.filter((i) => i.interviewStatus === "scheduled").length;
  const completedCount = interviews.filter((i) => i.interviewStatus === "completed").length;
  const missedOrCancelledCount = interviews.filter(
    (i) => i.interviewStatus === "missed" || i.interviewStatus === "cancelled"
  ).length;
  const availableApplicants = applicants.filter((a) => !a.hasScheduledInterview).length;

  const statCards: AdminStatItem[] = [
    {
      label: "Total interviews",
      value: interviews.length,
      helper: "All interview records",
      icon: FiCalendar,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white",
      valueClass: "text-blue-800",
    },
    {
      label: "Scheduled",
      value: scheduledCount,
      helper: "Upcoming sessions",
      icon: FiClock,
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
      iconClass: "bg-amber-500 text-white",
      valueClass: "text-amber-700",
    },
    {
      label: "Completed",
      value: completedCount,
      helper: "Finished interviews",
      icon: FiCheckCircle,
      cardClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
      iconClass: "bg-emerald-600 text-white",
      valueClass: "text-emerald-800",
    },
    {
      label: "Follow-up",
      value: missedOrCancelledCount,
      helper: "Missed or cancelled",
      icon: FiXCircle,
      cardClass: "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-red-50",
      iconClass: "bg-rose-600 text-white",
      valueClass: "text-rose-800",
    },
    {
      label: "Ready to schedule",
      value: availableApplicants,
      helper: "Without active interview",
      icon: FiUsers,
      cardClass: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
      iconClass: "bg-violet-600 text-white",
      valueClass: "text-violet-800",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageIntro
        icon={FiCalendar}
        title="Interview scheduling"
        description="Schedule admission interviews, notify applicants by email and portal message, and track outcomes."
      />

      <AdminStatGrid items={statCards} />

      <AdminToolbar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by applicant, application no., or venue…"
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              {filtered.length} of {interviews.length} records
            </span>
            <AdminExportToolbar compact basePath="/api/admin/interviews/export" />
          </div>
        }
      >
        <AdminPrimaryButton onClick={() => setShowForm((v) => !v)}>
          <FiCalendar size={16} aria-hidden />
          {showForm ? "Close form" : "Schedule interview"}
        </AdminPrimaryButton>
      </AdminToolbar>

      {showForm ? (
        <form
          action={scheduleAction}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4 sm:px-6">
            <h3 className="text-base font-bold text-[var(--primary-blue)]">
              Schedule new interview
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              The applicant receives an email and portal notification automatically.
            </p>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <label htmlFor="studentId" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Applicant
              </label>
              <select
                id="studentId"
                name="studentId"
                required
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              >
                <option value="">Select applicant…</option>
                {applicants.map((a) => (
                  <option key={a.studentId} value={a.studentId}>
                    {a.fullname}
                    {a.applicationNumber ? ` (${a.applicationNumber})` : ""}
                    {a.hasScheduledInterview ? " — has scheduled interview" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="interviewDate" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Date
              </label>
              <input
                id="interviewDate"
                name="interviewDate"
                type="date"
                required
                defaultValue={defaultDate}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
            </div>
            <div>
              <label htmlFor="interviewTime" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Time
              </label>
              <input
                id="interviewTime"
                name="interviewTime"
                type="time"
                required
                defaultValue="10:00"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="venue" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Venue
              </label>
              <input
                id="venue"
                name="venue"
                type="text"
                defaultValue={defaultInterviewVenue}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="meetingLink" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Meeting link (optional)
              </label>
              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                placeholder="https://…"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="remarks" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                Remarks (optional)
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={2}
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
            </div>
          </div>
          {scheduleState.error ? (
            <p className="px-6 pb-2 text-sm font-medium text-red-600">{scheduleState.error}</p>
          ) : null}
          <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
            <button
              type="submit"
              disabled={scheduling}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              {scheduling ? "Scheduling…" : "Schedule & notify"}
            </button>
            <AdminSecondaryButton type="button" onClick={() => setShowForm(false)}>
              Cancel
            </AdminSecondaryButton>
          </div>
        </form>
      ) : null}

      <AdminTableShell
        title="Interview roster"
        subtitle="Manage dates, venues, and interview outcomes"
        countLabel={`${filtered.length} shown`}
      >
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Applicant</AdminTh>
            <AdminTh>Date & time</AdminTh>
            <AdminTh>Venue</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableEmpty
                colSpan={5}
                icon={FiCalendar}
                title="No interviews yet"
                description="Schedule an interview using the button above. Applicants will be notified by email."
              />
            ) : (
              filtered.map((item) => (
                <AdminTableRow key={item.id} striped>
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-blue)] to-[var(--hero-blue)] text-xs font-bold text-white">
                        {item.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--primary-blue)]">
                          {item.studentName}
                        </p>
                        <p className="text-xs text-zinc-500">{item.email}</p>
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd>
                    <p className="font-medium text-zinc-800">
                      {formatCalendarDateShort(item.interviewDate)}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {formatCalendarTime(item.interviewTime)}
                    </p>
                  </AdminTd>
                  <AdminTd className="max-w-[200px]">
                    <p className="line-clamp-2 text-sm text-zinc-600">
                      {item.venue ?? "—"}
                    </p>
                  </AdminTd>
                  <AdminTd>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                        interviewStatusBadgeClass[item.interviewStatus]
                      )}
                    >
                      {interviewStatusLabel[item.interviewStatus]}
                    </span>
                  </AdminTd>
                  <AdminTd className="text-right">
                    {item.interviewStatus === "scheduled" ? (
                      <div className="flex items-center justify-end gap-1">
                        <select
                          disabled={pendingStatus || pendingDelete}
                          defaultValue=""
                          onChange={(e) => {
                            const value = e.target.value as InterviewStatus;
                            if (value) handleStatusChange(item.id, value);
                            e.target.value = "";
                          }}
                          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15 disabled:opacity-50"
                        >
                          <option value="">Update status…</option>
                          <option value="completed">Completed</option>
                          <option value="missed">Missed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={pendingDelete || pendingStatus}
                          className="rounded-xl p-2.5 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          title="Remove scheduled interview"
                          aria-label={`Remove interview for ${item.studentName}`}
                        >
                          <FiTrash2 size={16} aria-hidden />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-400">No actions</span>
                    )}
                  </AdminTd>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminTableShell>
    </div>
  );
}
