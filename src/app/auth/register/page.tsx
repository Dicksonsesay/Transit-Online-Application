import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import { VERIFIED_PIN_COOKIE } from "@/lib/constants";

export const metadata = {
  title: "Create Account | Transit College",
  description: "Create your student account after PIN verification.",
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const verifiedPin = cookieStore.get(VERIFIED_PIN_COOKIE);

  if (!verifiedPin?.value) {
    redirect("/auth/verify-pin");
  }

  return <RegisterForm />;
}
