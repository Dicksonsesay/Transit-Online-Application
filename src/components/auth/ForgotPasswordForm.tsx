"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { FiKey, FiMail } from "react-icons/fi";
import {
  requestStudentPasswordResetAction,
  type ForgotPasswordState,
} from "@/actions/student-password-reset";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: ForgotPasswordState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestStudentPasswordResetAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-3 pl-11 pr-4 text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

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
            Check your email
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            {state.message ?? "If an account matches your details, reset instructions were sent."}
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to login
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
            Forgot password
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Enter your admission PIN and the email you used when registering. We will
            send you a link to reset your password.
          </p>
        </div>

        <div className="relative mt-5">
          <FiKey
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
            aria-hidden
          />
          <input
            type="text"
            name="pin"
            placeholder="Admission PIN"
            autoComplete="username"
            required
            className={`${inputClass} uppercase`}
          />
        </div>

        <div className="relative mt-3">
          <FiMail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
            aria-hidden
          />
          <input
            type="email"
            name="email"
            placeholder="Registered email address"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>

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
          {pending ? "Sending…" : "Send reset link"}
        </button>

        <Link
          href="/auth/login"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary-blue)] hover:underline"
        >
          <span aria-hidden>←</span> Back to login
        </Link>
      </form>
    </AuthScreen>
  );
}
