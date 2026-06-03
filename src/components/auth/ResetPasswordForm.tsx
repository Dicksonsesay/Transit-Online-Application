"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import PasswordInput from "@/components/ui/PasswordInput";
import {
  resetStudentPasswordAction,
  type ResetPasswordState,
} from "@/actions/student-password-reset";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: ResetPasswordState = {};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [state, formAction, pending] = useActionState(
    resetStudentPasswordAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-3 pl-11 pr-4 text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  if (!token) {
    return (
      <AuthScreen>
        <div className="px-6 py-5 text-center sm:px-8 sm:py-6">
          <h1 className="text-lg font-bold text-[var(--primary-blue)]">Invalid reset link</h1>
          <p className="mt-3 text-sm text-zinc-600">
            This password reset link is missing or invalid. Request a new one from the
            login page.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Request new link
          </Link>
        </div>
      </AuthScreen>
    );
  }

  if (state?.success) {
    return (
      <AuthScreen>
        <div className="px-6 py-5 text-center sm:px-8 sm:py-6">
          <Image
            src="/logos/logo.png"
            alt="Transit College Sierra Leone"
            width={72}
            height={72}
            className="mx-auto h-16 w-16 rounded-full object-cover"
          />
          <h1 className="mt-4 text-lg font-bold text-[var(--primary-blue)]">
            Password updated
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Your password has been reset. Sign in with your PIN and new password.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Go to login
          </Link>
        </div>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen>
      <form action={formAction} className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logos/logo.png"
            alt="Transit College Sierra Leone"
            width={72}
            height={72}
            className="h-16 w-16 rounded-full object-cover"
            priority
          />
          <h1 className="mt-3 text-lg font-bold text-[var(--primary-blue)]">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Choose a new password with at least 8 characters.
          </p>
        </div>

        <input type="hidden" name="token" value={token} />

        <PasswordInput
          wrapperClassName="mt-5"
          name="newPassword"
          placeholder="New password"
          autoComplete="new-password"
          required
          minLength={8}
          inputClassName={inputClass}
        />

        <PasswordInput
          wrapperClassName="mt-3"
          name="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          minLength={8}
          inputClassName={inputClass}
        />

        {state?.error ? (
          <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Reset password"}
        </button>

        <Link
          href="/auth/forgot-password"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary-blue)] hover:underline"
        >
          Request a new link
        </Link>
      </form>
    </AuthScreen>
  );
}
