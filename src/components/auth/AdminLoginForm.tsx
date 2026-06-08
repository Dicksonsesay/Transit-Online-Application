"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail } from "react-icons/fi";
import PasswordInput from "@/components/ui/PasswordInput";
import AuthScreen from "@/components/auth/AuthScreen";

type AdminLoginFormProps = {
  initialError?: string;
};

export default function AdminLoginForm({
  initialError,
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("admin", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password, or account is inactive.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 py-3 pl-11 pr-4 text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/20";

  return (
    <AuthScreen>
      <form onSubmit={handleSubmit} className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/auth/admin-login.svg"
            alt=""
            width={80}
            height={80}
            className="h-20 w-20"
            priority
          />
          <h1 className="mt-3 text-xl font-bold text-[var(--primary-blue)]">
            Admin Portal Login
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Sign in to manage admissions
          </p>
        </div>

        <div className="relative mt-5">
          <FiMail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            size={18}
            aria-hidden
          />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>

        <PasswordInput
          wrapperClassName="mt-3"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          required
          inputClassName={inputClass}
        />

        {error ? (
          <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-[var(--hero-blue)] py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login to Admin"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-600">
          <Link
            href="/"
            className="font-medium text-[var(--primary-blue)] hover:underline"
          >
            ← Back to home
          </Link>
          <span className="mx-2 text-zinc-300">|</span>
          <Link
            href="/auth/login"
            className="font-semibold text-[var(--primary-yellow)] hover:underline"
          >
            Student login
          </Link>
        </p>
      </form>
    </AuthScreen>
  );
}
