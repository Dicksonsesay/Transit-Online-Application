import { redirect } from "next/navigation";
import { changeStudentPasswordAction } from "@/actions/account";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";
import { getStudentPasswordStatus } from "@/lib/student-account";
import { requireStudentSession } from "@/lib/session";

export async function generateMetadata() {
  const session = await requireStudentSession();
  if (!session) {
    return { title: "Password | Transit College" };
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    return { title: "Password | Transit College" };
  }

  const { hasPassword } = await getStudentPasswordStatus(studentId);

  return {
    title: hasPassword
      ? "Change Password | Transit College"
      : "Set Password | Transit College",
  };
}

export default async function ChangePasswordPage() {
  const session = await requireStudentSession();
  if (!session) {
    redirect("/auth/login");
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    redirect("/auth/login");
  }

  const { hasPassword } = await getStudentPasswordStatus(studentId);

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
      <PasswordChangeForm
        action={changeStudentPasswordAction}
        hasPassword={hasPassword}
      />
    </div>
  );
}
