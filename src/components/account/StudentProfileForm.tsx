"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiSave, FiX } from "react-icons/fi";
import {
  updateStudentProfileAction,
  type ProfileUpdateState,
} from "@/actions/account";

type StudentProfileFormProps = {
  student: {
    fullname: string;
    email: string;
    gender: string | null;
    dateOfBirth: string;
    phone: string;
    address: string;
    nationality: string;
  };
  onCancel?: () => void;
  onSaved?: () => void;
};

const initialState: ProfileUpdateState = {};

export default function StudentProfileForm({
  student,
  onCancel,
  onSaved,
}: StudentProfileFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateStudentProfileAction,
    initialState
  );

  useEffect(() => {
    if (state.success && !pending) {
      router.refresh();
      onSaved?.();
    }
  }, [onSaved, pending, router, state.success]);

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-[var(--dark-blue)] outline-none transition-colors focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-[var(--primary-blue)]">Edit profile</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          Keep your personal and contact information up to date.
        </p>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <fieldset>
          <legend className="text-sm font-semibold text-[var(--primary-blue)]">
            Contact
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="fullname"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Full name
              </label>
              <input
                id="fullname"
                name="fullname"
                defaultValue={student.fullname}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={student.email}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={student.phone}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-[var(--primary-blue)]">
            Personal details
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="gender"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={student.gender ?? ""}
                className={inputClass}
              >
                <option value="">Not provided</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Date of birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={student.dateOfBirth}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                defaultValue={student.nationality}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                defaultValue={student.address}
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        {state.error ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p
            className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800"
            role="status"
          >
            <FiCheckCircle size={16} aria-hidden />
            Profile updated successfully.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSave size={16} aria-hidden />
          {pending ? "Saving..." : "Save changes"}
        </button>
        {onCancel ? (
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiX size={16} aria-hidden />
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
