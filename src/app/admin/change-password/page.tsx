import { changeAdminPasswordAction } from "@/actions/account";
import PasswordChangeForm from "@/components/account/PasswordChangeForm";

export const metadata = {
  title: "Change Password | Transit College",
};

export default function AdminChangePasswordPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PasswordChangeForm
        action={changeAdminPasswordAction}
        submitLabel="Update admin password"
      />
    </div>
  );
}
