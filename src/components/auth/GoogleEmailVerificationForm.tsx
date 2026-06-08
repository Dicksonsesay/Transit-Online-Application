"use client";

import { useActionState, useEffect, useState } from "react";
import { FiMail, FiRefreshCw, FiShield } from "react-icons/fi";
import {
  resendGoogleVerificationCodeAction,
  verifyGoogleEmailCodeAction,
  type GoogleVerifyFormState,
} from "@/actions/register";

const initialState: GoogleVerifyFormState = {};

type GoogleEmailVerificationFormProps = {
  email: string;
  onVerified?: () => void;
};

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"*".repeat(Math.max(local.length - visible.length, 3))}@${domain}`;
}

export default function GoogleEmailVerificationForm({
  email,
  onVerified,
}: GoogleEmailVerificationFormProps) {
  const [state, verifyAction, verifyPending] = useActionState(
    verifyGoogleEmailCodeAction,
    initialState
  );
  const [resendState, setResendState] = useState<GoogleVerifyFormState>({});
  const [resendPending, setResendPending] = useState(false);

  useEffect(() => {
    if (state.success) {
      onVerified?.();
    }
  }, [state.success, onVerified]);

  async function handleResend() {
    setResendPending(true);
    setResendState({});
    try {
      const result = await resendGoogleVerificationCodeAction();
      setResendState(result);
    } finally {
      setResendPending(false);
    }
  }

  const feedback = state.error ?? state.success ?? resendState.error ?? resendState.success;
  const feedbackIsError = Boolean(state.error ?? resendState.error);

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
      <div className="flex items-start gap-2 text-sm text-[var(--primary-blue)]">
        <FiShield className="mt-0.5 shrink-0" size={16} aria-hidden />
        <div>
          <p className="font-semibold">Verify your Google email</p>
          <p className="mt-1 text-zinc-600">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-zinc-800">{maskEmail(email)}</span>. Enter it below to
            confirm this is a valid, registered Google account.
          </p>
        </div>
      </div>

      <form action={verifyAction} className="mt-4 space-y-3">
        <div className="relative">
          <FiMail
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            size={16}
            aria-hidden
          />
          <input
            type="text"
            name="verificationCode"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            placeholder="6-digit verification code"
            required
            className={inputClass}
          />
        </div>

        {feedback ? (
          <p
            className={`text-sm font-medium ${feedbackIsError ? "text-red-600" : "text-emerald-700"}`}
            role="alert"
          >
            {feedback}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            disabled={verifyPending}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[var(--hero-blue)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyPending ? "Verifying…" : "Verify code"}
          </button>
          <button
            type="button"
            disabled={resendPending || verifyPending}
            onClick={() => void handleResend()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw size={14} aria-hidden />
            {resendPending ? "Sending…" : "Resend code"}
          </button>
        </div>
      </form>
    </div>
  );
}
