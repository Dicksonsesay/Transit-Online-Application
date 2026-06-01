"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  getSystemSettings,
  saveSystemSettings,
} from "@/lib/system-settings";
import { requireAdminSession } from "@/lib/session";

const academicYearSchema = z
  .string()
  .regex(/^\d{4}\/\d{4}$/, "Use format YYYY/YYYY (e.g. 2026/2027).")
  .refine((value) => {
    const [a, b] = value.split("/").map((v) => Number.parseInt(v, 10));
    return Number.isFinite(a) && Number.isFinite(b) && b === a + 1;
  }, "End year must be start year + 1 (e.g. 2026/2027).");

const settingsSchema = z.object({
  collegeDisplayName: z.string().min(2, "College name is required."),
  academicYear: academicYearSchema,
  admissionIntake: academicYearSchema,
  defaultPinAmount: z.coerce
    .number()
    .positive("PIN amount must be greater than zero."),
  defaultInterviewVenue: z.string().min(5, "Interview venue is required."),
  contactEmail: z.string().email("Enter a valid contact email."),
  contactPhone: z.string().min(8, "Contact phone is required."),
  applicationsOpen: z.boolean(),
  welcomeMessage: z.string().max(500).optional(),
});

export type AdminSettingsFormState = {
  error?: string;
  success?: string;
};

export async function updateSystemSettingsAction(
  _prev: AdminSettingsFormState,
  formData: FormData
): Promise<AdminSettingsFormState> {
  const session = await requireAdminSession();
  if (!session) {
    return { error: "You must be signed in as an admin." };
  }

  const parsed = settingsSchema.safeParse({
    collegeDisplayName: formData.get("collegeDisplayName")?.toString().trim(),
    academicYear: formData.get("academicYear")?.toString().trim(),
    admissionIntake: formData.get("admissionIntake")?.toString().trim(),
    defaultPinAmount: formData.get("defaultPinAmount")?.toString().trim(),
    defaultInterviewVenue: formData.get("defaultInterviewVenue")?.toString().trim(),
    contactEmail: formData.get("contactEmail")?.toString().trim(),
    contactPhone: formData.get("contactPhone")?.toString().trim(),
    applicationsOpen: formData.get("applicationsOpen") === "on",
    welcomeMessage: formData.get("welcomeMessage")?.toString().trim() ?? "",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid settings.";
    return { error: first };
  }

  try {
    await saveSystemSettings({
      ...parsed.data,
      welcomeMessage: parsed.data.welcomeMessage ?? "",
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    revalidatePath("/admin/pins");
    revalidatePath("/admin/interviews");

    return { success: "Settings saved successfully." };
  } catch {
    return { error: "Could not save settings. Please try again." };
  }
}

export async function loadSystemSettingsForAdmin() {
  await requireAdminSession();
  return getSystemSettings();
}
