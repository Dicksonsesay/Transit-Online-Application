import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | Transit College",
  description: "Reset your student portal password using your admission PIN and registered email.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
