"use client";

import EmailVerificationCodeForm from "@/components/auth/EmailVerificationCodeForm";
import {
  resendRegisterEmailCodeAction,
  verifyRegisterEmailCodeAction,
} from "@/actions/register";

type RegisterEmailVerificationFormProps = {
  email: string;
  onVerified?: () => void;
};

export default function RegisterEmailVerificationForm({
  email,
  onVerified,
}: RegisterEmailVerificationFormProps) {
  return (
    <EmailVerificationCodeForm
      email={email}
      title="Verify your email address"
      description="We sent a 6-digit code to"
      verifyAction={verifyRegisterEmailCodeAction}
      resendAction={resendRegisterEmailCodeAction}
      onVerified={onVerified}
    />
  );
}
