import AdminSettingsView from "@/components/admin/AdminSettingsView";
import {
  ensureDefaultSystemSettings,
  getSystemSettings,
} from "@/lib/system-settings";
import { isEmailConfigured } from "@/lib/email/config";
import { requireAdminSession } from "@/lib/session";

export default async function SettingsPage() {
  await requireAdminSession();
  await ensureDefaultSystemSettings();
  const settings = await getSystemSettings();

  return (
    <div>
      <p className="mb-6 text-zinc-600">
        Manage admission intake preferences, default fees, interview venue, and portal
        contact details.
      </p>
      <AdminSettingsView
        settings={settings}
        emailConfigured={isEmailConfigured()}
      />
    </div>
  );
}
