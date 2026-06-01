"use client";

import { useActionState } from "react";
import { FiInfo, FiMail, FiSave, FiSettings } from "react-icons/fi";
import {
  updateSystemSettingsAction,
  type AdminSettingsFormState,
} from "@/actions/admin-settings";
import { isEmailConfigured } from "@/lib/email/config";
import type { SystemSettings } from "@/lib/system-settings";
import { cn } from "@/lib/utils";

type AdminSettingsViewProps = {
  settings: SystemSettings;
  emailConfigured: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none ring-[var(--primary-blue)]/30 focus:border-[var(--primary-blue)] focus:ring-2";

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export default function AdminSettingsView({
  settings,
  emailConfigured,
}: AdminSettingsViewProps) {
  const [state, formAction, pending] = useActionState<
    AdminSettingsFormState,
    FormData
  >(updateSystemSettingsAction, {});

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#003e91] via-[#1f5fb8] to-[#f1c40f]" />
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-blue)] text-white">
            <FiSettings size={18} aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">
              System settings
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500">
              Configure admission intake details, default PIN amount, interview venue,
              portal contact information, and whether new applications are accepted.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <aside className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 lg:col-span-1">
          <div className="flex items-start gap-2">
            <FiInfo className="mt-0.5 shrink-0 text-sky-700" aria-hidden />
            <div className="text-sm text-sky-900">
              <p className="font-semibold">Email delivery</p>
              <p className="mt-1 text-sky-800/90">
                SMTP credentials are configured in server environment variables (
                <code className="text-xs">.env</code>), not on this page.
              </p>
              <p
                className={cn(
                  "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  emailConfigured
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {emailConfigured ? "SMTP configured" : "SMTP not configured"}
              </p>
            </div>
          </div>
        </aside>

        <form
          action={formAction}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 lg:p-6"
        >
          {state.error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {state.success}
            </p>
          )}

          <div>
            <h3 className="text-base font-bold text-[var(--primary-blue)]">
              College & intake
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="College display name" required>
                <input
                  name="collegeDisplayName"
                  defaultValue={settings.collegeDisplayName}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Academic year" required hint="e.g. 2026/2027">
                <input
                  name="academicYear"
                  defaultValue={settings.academicYear}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Admission intake" required hint="e.g. 2026/2027">
                <input
                  name="admissionIntake"
                  defaultValue={settings.admissionIntake}
                  required
                  className={inputClass}
                />
              </Field>
              <Field
                label="Default admission PIN amount (SLL)"
                required
                hint="Used when generating PINs in admin"
              >
                <input
                  name="defaultPinAmount"
                  type="number"
                  min={1}
                  step="0.01"
                  defaultValue={settings.defaultPinAmount}
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--primary-blue)]">
              Interviews & portal
            </h3>
            <div className="mt-4 grid gap-4">
              <Field label="Default interview venue" required>
                <input
                  name="defaultInterviewVenue"
                  defaultValue={settings.defaultInterviewVenue}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Portal welcome message">
                <textarea
                  name="welcomeMessage"
                  rows={3}
                  defaultValue={settings.welcomeMessage}
                  className={inputClass}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <input
                  type="checkbox"
                  name="applicationsOpen"
                  defaultChecked={settings.applicationsOpen}
                  className="h-4 w-4 rounded border-slate-300 text-[var(--primary-blue)]"
                />
                <span className="text-sm text-zinc-700">
                  <span className="font-semibold">Accept new applications</span>
                  <span className="mt-0.5 block text-xs text-zinc-500">
                    When unchecked, students can still log in but you may communicate
                    that intake is closed on the public site.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[var(--primary-blue)]">
              <FiMail size={16} aria-hidden />
              Public contact
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Contact email" required>
                <input
                  name="contactEmail"
                  type="email"
                  defaultValue={settings.contactEmail}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Contact phone" required>
                <input
                  name="contactPhone"
                  defaultValue={settings.contactPhone}
                  required
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              <FiSave size={16} aria-hidden />
              {pending ? "Saving…" : "Save settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
