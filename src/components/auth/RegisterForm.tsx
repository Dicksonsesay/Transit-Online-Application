"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { FiCheckCircle, FiMail, FiSend, FiUser } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import GoogleEmailVerificationForm from "@/components/auth/GoogleEmailVerificationForm";
import RegisterEmailVerificationForm from "@/components/auth/RegisterEmailVerificationForm";
import {
  clearGoogleRegisterAction,
  registerStudentAction,
  registerWithGoogleAction,
  sendRegisterEmailCodeAction,
  type RegisterFormState,
} from "@/actions/register";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: RegisterFormState = {};

export type GoogleRegisterProfile = {
  fullname: string;
  email: string;
};

type RegisterProfile = {
  email: string;
  fullname: string;
};

type RegisterFormProps = {
  googleEnabled?: boolean;
  googleProfile?: GoogleRegisterProfile;
  googleEmailVerified?: boolean;
  manualEmailVerified?: boolean;
  manualRegisterProfile?: RegisterProfile;
  registerEmailPending?: RegisterProfile;
  showGoogleVerificationNotice?: boolean;
  initialError?: string;
};

export default function RegisterForm({
  googleEnabled = false,
  googleProfile,
  googleEmailVerified = false,
  manualEmailVerified = false,
  manualRegisterProfile,
  registerEmailPending,
  showGoogleVerificationNotice = false,
  initialError,
}: RegisterFormProps) {
  const router = useRouter();
  const usingGoogle = Boolean(googleProfile);
  const [localGoogleVerified, setLocalGoogleVerified] = useState(googleEmailVerified);
  const [localManualVerified, setLocalManualVerified] = useState(manualEmailVerified);
  const googleReady = usingGoogle && (googleEmailVerified || localGoogleVerified);
  const manualReady = !usingGoogle && (manualEmailVerified || localManualVerified);

  useEffect(() => {
    setLocalGoogleVerified(googleEmailVerified);
  }, [googleEmailVerified]);

  useEffect(() => {
    setLocalManualVerified(manualEmailVerified);
  }, [manualEmailVerified]);

  const [state, formAction, pending] = useActionState(
    usingGoogle ? registerWithGoogleAction : registerStudentAction,
    initialState
  );
  const [sendCodeState, sendCodeAction, sendingCode] = useActionState(
    sendRegisterEmailCodeAction,
    initialState
  );

  useEffect(() => {
    if (sendCodeState.success) {
      router.refresh();
    }
  }, [sendCodeState.success, router]);

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  const readOnlyInputClass = `${inputClass} bg-zinc-50 text-zinc-700`;

  const errorMessage = state?.error ?? initialError;
  const pendingEmail = registerEmailPending?.email;
  const pendingFullname = registerEmailPending?.fullname;

  function handleGoogleVerified() {
    setLocalGoogleVerified(true);
    router.refresh();
  }

  function handleManualVerified() {
    setLocalManualVerified(true);
    router.refresh();
  }

  return (
    <AuthScreen>
      <div className="px-6 py-4 sm:px-8">
        <h1 className="text-lg font-bold text-[var(--primary-blue)]">Create Account</h1>
        <p className="mt-1 text-sm text-zinc-600">
          {googleReady
            ? "Your Google email is verified. Review your details below, then create your account."
            : manualReady
              ? "Your email is verified. Complete your password below to create your account."
              : usingGoogle
                ? "Confirm the verification code sent to your Google email to continue."
                : "Verify your real email address before creating your student account."}
        </p>

        {showGoogleVerificationNotice && googleProfile ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
            <FiMail className="mt-0.5 shrink-0" size={16} aria-hidden />
            <p>
              A verification code has been sent to your Google email. Enter it below to
              continue. Each Google account can only be used once.
            </p>
          </div>
        ) : null}

        {usingGoogle && !googleReady && googleProfile ? (
          <GoogleEmailVerificationForm
            email={googleProfile.email}
            onVerified={handleGoogleVerified}
          />
        ) : null}

        {googleReady ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            <FiCheckCircle className="mt-0.5 shrink-0" size={16} aria-hidden />
            <p>
              Google email verified. Your name and email will be used for your student
              account.
            </p>
          </div>
        ) : null}

        {!usingGoogle && !manualReady ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <p className="text-sm font-semibold text-[var(--primary-blue)]">
              Step 1 · Verify your email
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
              We send a 6-digit code to confirm your email is real and registered. Fake or
              disposable addresses are not accepted.
            </p>

            <form action={sendCodeAction} className="mt-4 space-y-3">
              <div className="relative">
                <FiUser
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                  aria-hidden
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  defaultValue={pendingFullname ?? ""}
                  className={inputClass}
                />
              </div>

              <div className="relative">
                <FiMail
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                  aria-hidden
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Registered email address"
                  autoComplete="email"
                  required
                  defaultValue={pendingEmail ?? ""}
                  className={inputClass}
                />
              </div>

              {sendCodeState.error ? (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {sendCodeState.error}
                </p>
              ) : null}

              {sendCodeState.success ? (
                <p className="text-sm font-medium text-emerald-700" role="status">
                  {sendCodeState.success}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={sendingCode}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--hero-blue)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend size={15} aria-hidden />
                {sendingCode ? "Sending code…" : "Send verification code"}
              </button>
            </form>

            {pendingEmail ? (
              <RegisterEmailVerificationForm
                email={pendingEmail}
                onVerified={handleManualVerified}
              />
            ) : null}
          </div>
        ) : null}

        {manualReady ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            <FiCheckCircle className="mt-0.5 shrink-0" size={16} aria-hidden />
            <p>Email verified. Enter your password below to finish creating your account.</p>
          </div>
        ) : null}

        {!usingGoogle && googleEnabled ? (
          <div className="mt-4 space-y-3">
            <GoogleAuthButton mode="register" disabled={pending} />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                or register manually
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
          </div>
        ) : null}

        <form action={formAction} className="mt-3">
          {(usingGoogle || manualReady) && (
            <>
              <div className="relative">
                <FiUser
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                  aria-hidden
                />
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  readOnly={usingGoogle || manualReady}
                  defaultValue={
                    googleProfile?.fullname ??
                    manualRegisterProfile?.fullname ??
                    pendingFullname ??
                    ""
                  }
                  className={usingGoogle || manualReady ? readOnlyInputClass : inputClass}
                />
              </div>

              <div className="relative mt-3">
                <FiMail
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={16}
                  aria-hidden
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  readOnly={usingGoogle || manualReady}
                  defaultValue={
                    googleProfile?.email ?? manualRegisterProfile?.email ?? pendingEmail ?? ""
                  }
                  className={usingGoogle || manualReady ? readOnlyInputClass : inputClass}
                />
              </div>
            </>
          )}

          {!usingGoogle && manualReady ? (
            <>
              <PasswordInput
                wrapperClassName="mt-3"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                minLength={8}
                required
                iconSize={16}
                inputClassName={inputClass}
              />

              <PasswordInput
                wrapperClassName="mt-3"
                name="confirmPassword"
                placeholder="Confirm password"
                autoComplete="new-password"
                minLength={8}
                required
                iconSize={16}
                inputClassName={inputClass}
              />
            </>
          ) : null}

          {errorMessage ? (
            <p className="mt-2 text-sm font-medium text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {(usingGoogle || manualReady) && (
            <button
              type="submit"
              disabled={pending || (usingGoogle && !googleReady) || (!usingGoogle && !manualReady)}
              className="mt-3 w-full rounded-lg bg-[var(--hero-blue)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Creating account…"
                : usingGoogle
                  ? "Create Account with Google"
                  : "Create Account & Continue"}
            </button>
          )}

          {usingGoogle && !googleReady ? (
            <p className="mt-2 text-center text-xs text-zinc-500">
              Verify your Google email above before creating your account.
            </p>
          ) : null}

          {!usingGoogle && !manualReady ? (
            <p className="mt-2 text-center text-xs text-zinc-500">
              Verify your email above before you can create your account.
            </p>
          ) : null}
        </form>

        {usingGoogle ? (
          <form action={clearGoogleRegisterAction} className="mt-2">
            <button
              type="submit"
              className="w-full rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-[var(--primary-blue)]"
            >
              Register manually instead
            </button>
          </form>
        ) : null}

        <p className="mt-3 text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[var(--primary-blue)] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthScreen>
  );
}
