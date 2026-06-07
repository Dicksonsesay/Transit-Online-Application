"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FiCheckCircle, FiMail, FiUser } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import {
  clearGoogleRegisterAction,
  registerStudentAction,
  registerWithGoogleAction,
  type RegisterFormState,
} from "@/actions/register";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: RegisterFormState = {};

export type GoogleRegisterProfile = {
  fullname: string;
  email: string;
};

type RegisterFormProps = {
  googleEnabled?: boolean;
  googleProfile?: GoogleRegisterProfile;
  initialError?: string;
};

export default function RegisterForm({
  googleEnabled = false,
  googleProfile,
  initialError,
}: RegisterFormProps) {
  const usingGoogle = Boolean(googleProfile);
  const [state, formAction, pending] = useActionState(
    usingGoogle ? registerWithGoogleAction : registerStudentAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  const readOnlyInputClass = `${inputClass} bg-zinc-50 text-zinc-700`;

  const errorMessage = state?.error ?? initialError;

  return (
    <AuthScreen>
      <form action={formAction} className="px-6 py-4 sm:px-8">
        <h1 className="text-lg font-bold text-[var(--primary-blue)]">
          Create Account
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          {usingGoogle
            ? "Your Google account has been verified. Review your details below, then create your account."
            : "Create your account manually or verify with Google after PIN verification."}
        </p>

        {usingGoogle ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            <FiCheckCircle className="mt-0.5 shrink-0" size={16} aria-hidden />
            <p>
              Signed in with Google. Your name and email are verified and will
              be used for your student account.
            </p>
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

        <div className="relative mt-3">
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
            readOnly={usingGoogle}
            defaultValue={googleProfile?.fullname ?? ""}
            className={usingGoogle ? readOnlyInputClass : inputClass}
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
            readOnly={usingGoogle}
            defaultValue={googleProfile?.email ?? ""}
            className={usingGoogle ? readOnlyInputClass : inputClass}
          />
        </div>

        {!usingGoogle ? (
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

        <button
          type="submit"
          disabled={pending}
          className="mt-3 w-full rounded-lg bg-[var(--hero-blue)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending
            ? "Creating account…"
            : usingGoogle
              ? "Create Account with Google"
              : "Create Account & Continue"}
        </button>

        {usingGoogle ? (
          <button
            type="submit"
            formAction={clearGoogleRegisterAction}
            className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:text-[var(--primary-blue)]"
          >
            Register manually instead
          </button>
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
      </form>
    </AuthScreen>
  );
}
