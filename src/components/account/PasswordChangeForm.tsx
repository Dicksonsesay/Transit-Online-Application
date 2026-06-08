"use client";

import { useActionState, useEffect, useRef } from "react";
import { FiCheckCircle, FiLock } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import type { PasswordChangeState } from "@/actions/account";

type PasswordAction = (
  prevState: PasswordChangeState,
  formData: FormData
) => Promise<PasswordChangeState>;

type PasswordChangeFormProps = {
  action: PasswordAction;
  id?: string;
  submitLabel?: string;
  hasPassword?: boolean;
};

const initialState: PasswordChangeState = {};

export default function PasswordChangeForm({
  action,
  id = "change-password",
  submitLabel,
  hasPassword = true,
}: PasswordChangeFormProps) {
  const isSetMode = !hasPassword;
  const resolvedSubmitLabel =
    submitLabel ?? (isSetMode ? "Set password" : "Update password");
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  return (
    <form
      id={id}
      ref={formRef}
      action={formAction}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <FiLock size={18} aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">
              {isSetMode ? "Set a password" : "Change password"}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isSetMode
                ? "Your account uses Google sign-in. Add a password if you also want to sign in with your email."
                : "Enter your current password before choosing a new one."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {hasPassword ? (
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              Current password
            </label>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              autoComplete="current-password"
              required
              iconSize={16}
              inputClassName={inputClass}
            />
          </div>
        ) : null}

        <div>
          <label
            htmlFor="newPassword"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            New password
          </label>
          <PasswordInput
            id="newPassword"
            name="newPassword"
            autoComplete="new-password"
            minLength={8}
            required
            iconSize={16}
            inputClassName={inputClass}
          />
          <p className="mt-1.5 text-xs text-zinc-500">Minimum 8 characters.</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={8}
            required
            iconSize={16}
            inputClassName={inputClass}
          />
        </div>

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
            {isSetMode ? "Password set successfully." : "Password updated successfully."}
          </p>
        ) : null}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : resolvedSubmitLabel}
        </button>
      </div>
    </form>
  );
}
