"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { FiKey } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import {
  loginStudentAction,
  type StudentLoginState,
} from "@/actions/student-login";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: StudentLoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginStudentAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-3 pl-11 pr-4 text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

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
          <p className="mt-3 text-xs font-bold tracking-wide text-[var(--primary-blue)] sm:text-sm">
            TRANSIT COLLEGE
            <br />
            SIERRA LEONE
          </p>
          <h1 className="mt-2 text-lg font-bold text-[var(--primary-blue)]">
            Login to your account
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Use the PIN from the bank and your password.
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
            placeholder="Enter PIN"
            autoComplete="username"
            required
            className={`${inputClass} uppercase`}
          />
        </div>

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
            href="#"
            className="text-sm font-medium text-[var(--primary-blue)] hover:underline"
          >
            Forgot Password?
          </Link>
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
          {pending ? "Signing in…" : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-zinc-600">
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
