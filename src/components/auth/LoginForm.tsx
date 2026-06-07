"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FiKey } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import {
  loginStudentAction,
  type StudentLoginState,
} from "@/actions/student-login";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: StudentLoginState = {};

type LoginFormProps = {
  googleEnabled?: boolean;
  initialError?: string;
};

export default function LoginForm({
  googleEnabled = false,
  initialError,
}: LoginFormProps) {
  const [pin, setPin] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [state, formAction, pending] = useActionState(
    loginStudentAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-2.5 pl-11 pr-4 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  const errorMessage = googleError || state?.error || initialError;

  return (
    <AuthScreen>
      <form action={formAction} className="px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/auth/student-login.svg"
            alt=""
            width={64}
            height={64}
            className="h-16 w-16"
            priority
          />
          <h1 className="mt-2 text-lg font-bold text-[var(--primary-blue)] sm:text-xl">
            Student Login Portal
          </h1>
          <p className="mt-0.5 text-xs text-zinc-600 sm:text-sm">
            Login to your account
          </p>
          <p className="mt-0.5 text-xs leading-snug text-zinc-500">
            Use your admission PIN with your password, or verify with Google.
          </p>
        </div>

        <div className="relative mt-4">
          <FiKey
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
            aria-hidden
          />
          <input
            type="text"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter admission PIN"
            autoComplete="username"
            required
            className={`${inputClass} uppercase`}
          />
        </div>

        {googleEnabled ? (
          <div className="mt-3 space-y-3">
            <GoogleAuthButton
              mode="login"
              disabled={pending}
              pin={pin}
              onError={setGoogleError}
            />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                or use password
              </span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>
          </div>
        ) : null}

        <PasswordInput
          wrapperClassName="mt-3"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
          inputClassName={inputClass}
        />

        <div className="mt-1.5 text-right">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-[var(--primary-blue)] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {errorMessage ? (
          <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-3 w-full rounded-lg bg-[var(--hero-blue)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        >
          {pending ? "Signing in…" : "Login with PIN & Password"}
        </button>

        <p className="mt-3 pb-1 text-center text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/verify-pin"
            className="font-semibold text-[var(--primary-yellow)] hover:underline"
          >
            Verify PIN
          </Link>
        </p>
      </form>
    </AuthScreen>
  );
}
