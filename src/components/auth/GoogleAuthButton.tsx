"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { prepareGoogleLoginAction } from "@/actions/student-login";

type GoogleAuthButtonProps = {
  mode: "register" | "login";
  disabled?: boolean;
  pin?: string;
  onError?: (message: string) => void;
};

function mapOAuthError(error: string): string {
  switch (error) {
    case "OAuthSignin":
      return "Google sign-in could not start. Check your Google OAuth settings in .env and restart the server.";
    case "OAuthCallback":
      return "Google sign-in was interrupted. Please try again.";
    case "OAuthAccountNotLinked":
      return "This Google account is not linked to your student profile.";
    case "Configuration":
      return "Google sign-in is not configured correctly on the server.";
    default:
      return "Google sign-in failed. Please try again.";
  }
}

export default function GoogleAuthButton({
  mode,
  disabled = false,
  pin = "",
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const label =
    mode === "register" ? "Continue with Google" : "Sign in with Google";

  async function handleClick() {
    setLoading(true);
    onError?.("");

    try {
      if (mode === "login") {
        const prep = await prepareGoogleLoginAction(pin);
        if (!prep.success) {
          onError?.(prep.error);
          return;
        }
      }

      const result = await signIn("google", {
        callbackUrl: `/auth/google/finish?mode=${mode}`,
        redirect: false,
      });

      if (result?.error) {
        onError?.(mapOAuthError(result.error));
        return;
      }

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch {
      onError?.("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={() => void handleClick()}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <FcGoogle size={18} aria-hidden />
      {loading ? "Connecting to Google…" : label}
    </button>
  );
}
