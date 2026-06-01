import { redirect } from "next/navigation";

export default function VerifyPinRedirect() {
  redirect("/auth/verify-pin");
}
