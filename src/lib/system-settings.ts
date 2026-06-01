import {
  DEFAULT_ADMISSION_PIN_AMOUNT,
  DEFAULT_INTERVIEW_VENUE,
} from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const SYSTEM_SETTING_KEYS = {
  college_display_name: "college_display_name",
  academic_year: "academic_year",
  admission_intake: "admission_intake",
  default_pin_amount: "default_pin_amount",
  default_interview_venue: "default_interview_venue",
  contact_email: "contact_email",
  contact_phone: "contact_phone",
  applications_open: "applications_open",
  welcome_message: "welcome_message",
} as const;

export type SystemSettingKey =
  (typeof SYSTEM_SETTING_KEYS)[keyof typeof SYSTEM_SETTING_KEYS];

export type SystemSettings = {
  collegeDisplayName: string;
  academicYear: string;
  admissionIntake: string;
  defaultPinAmount: number;
  defaultInterviewVenue: string;
  contactEmail: string;
  contactPhone: string;
  applicationsOpen: boolean;
  welcomeMessage: string;
};

const DEFAULTS: SystemSettings = {
  collegeDisplayName: "Transit College Sierra Leone",
  academicYear: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
  admissionIntake: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
  defaultPinAmount: DEFAULT_ADMISSION_PIN_AMOUNT,
  defaultInterviewVenue: DEFAULT_INTERVIEW_VENUE,
  contactEmail: "admission.transit@gmail.com",
  contactPhone: "+232 72 197 975",
  applicationsOpen: true,
  welcomeMessage:
    "Welcome to the Transit College Online Admission Portal. Complete your application after paying at the bank and verifying your PIN.",
};

const KEY_TO_FIELD: Record<SystemSettingKey, keyof SystemSettings> = {
  [SYSTEM_SETTING_KEYS.college_display_name]: "collegeDisplayName",
  [SYSTEM_SETTING_KEYS.academic_year]: "academicYear",
  [SYSTEM_SETTING_KEYS.admission_intake]: "admissionIntake",
  [SYSTEM_SETTING_KEYS.default_pin_amount]: "defaultPinAmount",
  [SYSTEM_SETTING_KEYS.default_interview_venue]: "defaultInterviewVenue",
  [SYSTEM_SETTING_KEYS.contact_email]: "contactEmail",
  [SYSTEM_SETTING_KEYS.contact_phone]: "contactPhone",
  [SYSTEM_SETTING_KEYS.applications_open]: "applicationsOpen",
  [SYSTEM_SETTING_KEYS.welcome_message]: "welcomeMessage",
};

const FIELD_TO_KEY = Object.fromEntries(
  Object.entries(KEY_TO_FIELD).map(([k, v]) => [v, k])
) as Record<keyof SystemSettings, SystemSettingKey>;

function serializeValue(field: keyof SystemSettings, value: unknown): string {
  if (field === "applicationsOpen") return value ? "true" : "false";
  if (field === "defaultPinAmount") return String(value);
  return String(value ?? "");
}

function parseStoredValue(
  field: keyof SystemSettings,
  raw: string | undefined
): string | number | boolean {
  if (raw === undefined) return DEFAULTS[field] as string | number | boolean;
  if (field === "applicationsOpen") return raw === "true";
  if (field === "defaultPinAmount") {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : DEFAULTS.defaultPinAmount;
  }
  return raw;
}

export async function ensureDefaultSystemSettings() {
  if (!("systemSetting" in prisma) || !prisma.systemSetting) {
    throw new Error(
      "Database client is out of date. Stop the dev server, run `npx prisma generate`, then restart."
    );
  }

  for (const [field, key] of Object.entries(FIELD_TO_KEY) as [
    keyof SystemSettings,
    SystemSettingKey,
  ][]) {
    const value = serializeValue(field, DEFAULTS[field]);
    await prisma.systemSetting.upsert({
      where: { key },
      create: { key, value },
      update: {},
    });
  }
}

export async function getSystemSettings(): Promise<SystemSettings> {
  const rows = await prisma.systemSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const result = { ...DEFAULTS };

  for (const [field, key] of Object.entries(FIELD_TO_KEY) as [
    keyof SystemSettings,
    SystemSettingKey,
  ][]) {
    const parsed = parseStoredValue(field, map.get(key));
    (result as Record<keyof SystemSettings, unknown>)[field] = parsed;
  }

  return result;
}

export async function getDefaultPinAmountFromSettings(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.defaultPinAmount;
}

export async function getDefaultInterviewVenueFromSettings(): Promise<string> {
  const settings = await getSystemSettings();
  return settings.defaultInterviewVenue;
}

export async function saveSystemSettings(
  input: Partial<SystemSettings>
): Promise<SystemSettings> {
  const current = await getSystemSettings();
  const merged = { ...current, ...input };

  for (const field of Object.keys(FIELD_TO_KEY) as (keyof SystemSettings)[]) {
    await prisma.systemSetting.upsert({
      where: { key: FIELD_TO_KEY[field] },
      create: {
        key: FIELD_TO_KEY[field],
        value: serializeValue(field, merged[field]),
      },
      update: { value: serializeValue(field, merged[field]) },
    });
  }

  return merged;
}

export function systemSettingsToFormState(settings: SystemSettings) {
  return {
    collegeDisplayName: settings.collegeDisplayName,
    academicYear: settings.academicYear,
    admissionIntake: settings.admissionIntake,
    defaultPinAmount: String(settings.defaultPinAmount),
    defaultInterviewVenue: settings.defaultInterviewVenue,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    applicationsOpen: settings.applicationsOpen ? "on" : "",
    welcomeMessage: settings.welcomeMessage,
  };
}
