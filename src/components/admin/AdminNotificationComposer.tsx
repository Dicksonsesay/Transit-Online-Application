"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendStudentNotificationAction } from "@/actions/admin-notifications";
import type { ApplicantForInterview } from "@/lib/admin-interviews";
import { formatDate } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/alerts";
import type { NotificationType } from "@/generated/prisma/client";

type SentNotification = {
  id: number;
  studentName: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  createdAt: string;
};

type AdminNotificationComposerProps = {
  applicants: ApplicantForInterview[];
  recentSent: SentNotification[];
};

const initialState: { error?: string; success?: boolean } = {};

const typeOptions: { value: NotificationType; label: string }[] = [
  { value: "general", label: "General message" },
  { value: "interview", label: "Interview update" },
  { value: "acceptance", label: "Acceptance" },
  { value: "rejection", label: "Rejection" },
];

export default function AdminNotificationComposer({
  applicants,
  recentSent,
}: AdminNotificationComposerProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    sendStudentNotificationAction,
    initialState
  );
  const [studentId, setStudentId] = useState("");
  const celebratedRef = useRef(false);

  const selectedApplicant = useMemo(
    () => applicants.find((a) => a.studentId === Number.parseInt(studentId, 10)),
    [applicants, studentId]
  );

  useEffect(() => {
    if (!state.success || pending || celebratedRef.current) return;
    celebratedRef.current = true;
    void showSuccess("Notification sent", "The student will see it in their portal.").then(
      () => router.refresh()
    );
  }, [state.success, pending, router]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        action={formAction}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 className="text-lg font-bold text-[var(--primary-blue)]">Send notification</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Message appears in the student&apos;s Messages and notification bell.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="notify-student" className="mb-1 block text-sm font-medium text-zinc-700">
              Student
            </label>
            <select
              id="notify-student"
              name="studentId"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)]"
            >
              <option value="">Select student…</option>
              {applicants.map((a) => (
                <option key={a.studentId} value={a.studentId}>
                  {a.fullname}
                  {a.applicationNumber ? ` (${a.applicationNumber})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="notificationType" className="mb-1 block text-sm font-medium text-zinc-700">
              Type
            </label>
            <select
              id="notificationType"
              name="notificationType"
              required
              defaultValue="general"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)]"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-zinc-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder={
                selectedApplicant
                  ? `Message for ${selectedApplicant.fullname}`
                  : "Notification title"
              }
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)]"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-zinc-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Write your message to the student…"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)]"
            />
          </div>
        </div>

        {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 rounded-lg bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send notification"}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-[var(--primary-blue)]">Recently sent</h3>
        {recentSent.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No notifications sent yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentSent.map((item) => (
              <li key={item.id} className="py-3">
                <p className="text-sm font-semibold text-[var(--primary-blue)]">{item.title}</p>
                <p className="text-xs text-zinc-500">
                  To {item.studentName} · {formatDate(item.createdAt)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{item.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
