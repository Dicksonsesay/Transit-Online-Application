import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { SESSION_EXPIRED_MESSAGE } from "@/lib/session-config";

export const metadata = {
  title: "Admin Login | Transit College",
  description: "Sign in to the Transit College admissions admin portal.",
};

type AdminLoginPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const { reason } = await searchParams;

  return (
    <AdminLoginForm
      initialError={
        reason === "session_expired" ? SESSION_EXPIRED_MESSAGE : undefined
      }
    />
  );
}
