import { changeStudentPasswordAction } from "@/actions/account";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

export const metadata = {
  title: "Change Password | Transit College",
};

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
      <PasswordChangeForm action={changeStudentPasswordAction} />
    </div>
  );
}
