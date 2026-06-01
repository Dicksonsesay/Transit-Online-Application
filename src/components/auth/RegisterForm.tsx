"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FiMail, FiUser } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import {
  registerStudentAction,
  type RegisterFormState,
} from "@/actions/register";
import AuthScreen from "@/components/auth/AuthScreen";

const initialState: RegisterFormState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerStudentAction,
    initialState
  );

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-3 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  return (
    <AuthScreen>
      <form action={formAction} className="px-6 py-4 sm:px-8">
        <h1 className="text-lg font-bold text-[var(--primary-blue)]">
          Create Account
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Enter your details to create your account and start your application.
        </p>

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
            className={inputClass}
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
            className={inputClass}
          />
        </div>

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

        {state?.error ? (
          <p className="mt-2 text-sm font-medium text-red-600" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-3 w-full rounded-lg bg-[var(--hero-blue)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create Account & Continue"}
        </button>

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
