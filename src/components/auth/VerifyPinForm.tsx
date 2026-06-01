"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FiLock } from "react-icons/fi";
import { verifyPinAction, type VerifyPinState } from "@/actions/verify-pin";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: VerifyPinState = {};

export default function VerifyPinForm() {
  const [state, formAction, pending] = useActionState(verifyPinAction, initialState);

  return (
    <AuthScreen showLogoInHeader>
      <form action={formAction} className="px-6 py-5 sm:px-8 sm:py-6">
        <h1 className="text-xl font-bold text-[var(--primary-blue)]">Verify PIN</h1>
        <p className="mt-1.5 text-sm text-zinc-600">
          Enter the PIN provided by the bank to create your account and start
          your application.
        </p>

        <div className="relative mt-4">
          <FiLock
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
            aria-hidden
          />
          <input
            type="text"
            name="pinCode"
            placeholder="Enter PIN"
            autoComplete="off"
            required
            defaultValue=""
            className="w-full rounded-lg border border-zinc-300 py-3.5 pl-11 pr-4 uppercase text-[var(--dark-blue)] outline-none transition-colors placeholder:normal-case placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20"
          />
        </div>

        {state?.error ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Verifying…" : "Verify & Proceed"}
        </button>

        <Link
          href="/auth/login"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary-blue)] hover:underline"
        >
          <span aria-hidden>←</span> Back to Login
        </Link>
      </form>
    </AuthScreen>
  );
}
