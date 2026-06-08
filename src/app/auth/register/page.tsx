import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm, {
  type GoogleRegisterProfile,
} from "@/components/auth/RegisterForm";
import {
  GOOGLE_REGISTER_COOKIE,
  REGISTER_EMAIL_COOKIE,
  VERIFIED_PIN_COOKIE,
} from "@/lib/constants";
import { isGoogleOAuthEnabled } from "@/lib/google-oauth-config";
import {
  parseGoogleRegisterSession,
  parseRegisterEmailSession,
} from "@/lib/email-verification";

export const metadata = {
  title: "Create Account | Transit College",
  description: "Create your student account after PIN verification.",
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string; from?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const cookieStore = await cookies();
  const verifiedPin = cookieStore.get(VERIFIED_PIN_COOKIE);

  if (!verifiedPin?.value) {
    redirect("/auth/verify-pin");
  }

  const { error, from } = await searchParams;
  const googleSession = parseGoogleRegisterSession(
    cookieStore.get(GOOGLE_REGISTER_COOKIE)?.value
  );
  const registerEmailSession = parseRegisterEmailSession(
    cookieStore.get(REGISTER_EMAIL_COOKIE)?.value
  );

  const googleProfile: GoogleRegisterProfile | undefined = googleSession
    ? { email: googleSession.email, fullname: googleSession.fullname }
    : undefined;
  const googleEnabled = isGoogleOAuthEnabled();
  const googleEmailVerified = Boolean(googleSession?.verified);
  const manualEmailVerified = Boolean(registerEmailSession?.verified);
  const manualRegisterProfile = registerEmailSession
    ? {
        email: registerEmailSession.email,
        fullname: registerEmailSession.fullname,
      }
    : undefined;
  const registerEmailPending =
    registerEmailSession && !registerEmailSession.verified
      ? manualRegisterProfile
      : undefined;
  const showGoogleVerificationNotice = from === "google" && googleSession && !googleEmailVerified;

  return (
    <RegisterForm
      googleEnabled={googleEnabled}
      googleProfile={googleProfile}
      googleEmailVerified={googleEmailVerified}
      manualEmailVerified={manualEmailVerified}
      manualRegisterProfile={manualRegisterProfile}
      registerEmailPending={registerEmailPending}
      showGoogleVerificationNotice={showGoogleVerificationNotice}
      initialError={error ? decodeURIComponent(error) : undefined}
    />
  );
}
