import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm, {
  type GoogleRegisterProfile,
} from "@/components/auth/RegisterForm";
import { GOOGLE_REGISTER_COOKIE, VERIFIED_PIN_COOKIE } from "@/lib/constants";
import { isGoogleOAuthEnabled } from "@/lib/google-oauth-config";

export const metadata = {
  title: "Create Account | Transit College",
  description: "Create your student account after PIN verification.",
};

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

function parseGoogleProfile(raw: string | undefined): GoogleRegisterProfile | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as {
      email?: string;
      fullname?: string;
      googleId?: string;
    };

    const email = parsed.email?.trim().toLowerCase();
    const fullname = parsed.fullname?.trim();

    if (!email || !fullname || !parsed.googleId) {
      return undefined;
    }

    return { email, fullname };
  } catch {
    return undefined;
  }
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const cookieStore = await cookies();
  const verifiedPin = cookieStore.get(VERIFIED_PIN_COOKIE);

  if (!verifiedPin?.value) {
    redirect("/auth/verify-pin");
  }

  const { error } = await searchParams;
  const googleProfile = parseGoogleProfile(
    cookieStore.get(GOOGLE_REGISTER_COOKIE)?.value
  );
  const googleEnabled = isGoogleOAuthEnabled();

  return (
    <RegisterForm
      googleEnabled={googleEnabled}
      googleProfile={googleProfile}
      initialError={error ? decodeURIComponent(error) : undefined}
    />
  );
}
