import LoginForm from "@/components/auth/LoginForm";
import { mapStudentLoginError } from "@/lib/auth-errors";
import { isGoogleOAuthEnabled } from "@/lib/google-oauth-config";
import { SESSION_EXPIRED_MESSAGE } from "@/lib/session-config";

export const metadata = {
  title: "Student Login | Transit College",
  description: "Login to your Transit College admission account.",
};

type StudentLoginPageProps = {
  searchParams: Promise<{ error?: string; reason?: string }>;
};

export default async function StudentLoginPage({
  searchParams,
}: StudentLoginPageProps) {
  const { error, reason } = await searchParams;

  const initialError =
    reason === "session_expired"
      ? SESSION_EXPIRED_MESSAGE
      : error
        ? mapStudentLoginError(error)
        : undefined;

  return (
    <LoginForm
      googleEnabled={isGoogleOAuthEnabled()}
      initialError={initialError}
    />
  );
}
