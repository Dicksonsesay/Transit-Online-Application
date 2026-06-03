import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";

export const metadata = {
  title: "Reset Password | Transit College",
  description: "Set a new password for your Transit College student portal account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full max-w-md justify-center rounded-2xl bg-white p-8 shadow-xl">
          <PageLoadingSpinner label="Loading…" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
