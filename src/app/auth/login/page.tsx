import LoginForm from "@/components/auth/LoginForm";
import { mapStudentLoginError } from "@/lib/auth-errors";
import { isGoogleOAuthEnabled } from "@/lib/google-oauth-config";

export const metadata = {
  title: "Student Login | Transit College",
  description: "Login to your Transit College admission account.",
};

type StudentLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function StudentLoginPage({
  searchParams,
}: StudentLoginPageProps) {
  const { error } = await searchParams;

  const initialError = error ? mapStudentLoginError(error) : undefined;

  return (
    <LoginForm
      googleEnabled={isGoogleOAuthEnabled()}
      initialError={initialError}
    />
  );
}
