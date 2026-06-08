"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FiArrowLeft, FiKey, FiShield } from "react-icons/fi";
import { verifyPinAction, type VerifyPinState } from "@/actions/verify-pin";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: VerifyPinState = {};

const steps = [
  { label: "Verify PIN", active: true },
  { label: "Register", active: false },
  { label: "Apply", active: false },
];

export default function VerifyPinForm() {
  const [state, formAction, pending] = useActionState(verifyPinAction, initialState);

  return (
    <AuthScreen>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--primary-blue)] via-[var(--hero-blue)] to-[var(--primary-yellow)]"
          aria-hidden
        />

        <div className="bg-gradient-to-br from-[var(--hero-blue)]/8 via-white to-[var(--primary-yellow)]/10 px-6 pb-2 pt-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--hero-blue)] to-[var(--primary-blue)] text-white shadow-lg shadow-blue-900/20 ring-1 ring-white/40">
                <FiKey size={28} aria-hidden />
              </span>
              <span className="absolute -bottom-1.5 -right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-yellow)] text-[var(--dark-blue)] shadow-md ring-2 ring-white">
                <FiShield size={15} aria-hidden />
              </span>
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-blue)]">
              Step 1 · Admission PIN Verification
            </p>
            <h1 className="mt-1.5 text-2xl font-bold text-[var(--primary-blue)]">
              Verify Your PIN
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-600">
              Enter the admission PIN from your bank payment receipt to unlock account
              registration on the portal.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2">
                <span
                  className={
                    step.active
                      ? "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[var(--primary-blue)] px-2 text-xs font-bold text-white shadow-sm"
                      : "inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-zinc-100 px-2 text-xs font-semibold text-zinc-400"
                  }
                >
                  {index + 1}
                </span>
                <span
                  className={
                    step.active
                      ? "text-xs font-semibold text-[var(--primary-blue)]"
                      : "hidden text-xs font-medium text-zinc-400 sm:inline"
                  }
                >
                  {step.label}
                </span>
                {index < steps.length - 1 ? (
                  <span className="mx-1 hidden h-px w-6 bg-zinc-200 sm:block" aria-hidden />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <form action={formAction} className="px-6 py-6 sm:px-8 sm:py-7">
          <label htmlFor="pinCode" className="block text-sm font-semibold text-zinc-700">
            Admission PIN
          </label>
          <p className="mt-1 text-xs text-zinc-500">
            Found on your official bank receipt after payment.
          </p>

          <div className="relative mt-3">
            <FiKey
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary-blue)]/50"
              size={18}
              aria-hidden
            />
            <input
              id="pinCode"
              type="text"
              name="pinCode"
              placeholder="e.g. TC-XXXX-001"
              autoComplete="off"
              required
              defaultValue=""
              className="w-full rounded-xl border-2 border-zinc-200 bg-slate-50/80 py-3.5 pl-11 pr-4 font-mono text-base uppercase tracking-[0.2em] text-[var(--dark-blue)] outline-none transition-all placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-blue)]/10"
            />
          </div>

          {state?.error ? (
            <p
              className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-[var(--hero-blue)] to-[var(--primary-blue)] py-3.5 text-base font-semibold text-white shadow-md shadow-blue-900/15 transition-all hover:opacity-95 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Verifying PIN…" : "Verify & Continue to Registration"}
          </button>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-xs leading-relaxed text-zinc-600">
            <span className="font-semibold text-[var(--primary-blue)]">Tip:</span> Keep your
            receipt safe. You will need the same PIN if you return to complete registration
            later.
          </div>

          <Link
            href="/auth/login"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary-blue)] transition-colors hover:text-[var(--hero-blue)]"
          >
            <FiArrowLeft size={15} aria-hidden />
            Back to Login
          </Link>
        </form>
      </div>
    </AuthScreen>
  );
}
