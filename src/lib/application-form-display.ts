import type {
  AttendanceOption,
  CampusOption,
  ProgrammeLevelChoice,
  SponsorshipType,
  TitleOption,
} from "@/types/application-form";

export function formatTitle(title: TitleOption, other?: string): string {
  const map: Record<TitleOption, string> = {
    mr: "Mr.",
    mrs: "Mrs.",
    miss: "Miss.",
    other: other?.trim() || "Other",
  };
  return map[title] ?? title;
}

export function formatProgrammeLevel(level: ProgrammeLevelChoice): string {
  const map: Record<ProgrammeLevelChoice, string> = {
    certificate: "Certificate",
    diploma: "Diploma",
    hnd: "Higher National Diploma",
    degree: "Degree",
    tc: "TC",
    htc_p: "HTC (P)",
    htc_s: "HTC(S)",
    short_professional: "Short Professional Course",
  };
  return map[level] ?? level;
}

export function formatAttendance(option: AttendanceOption): string {
  const map: Record<AttendanceOption, string> = {
    full_time: "Full Time",
    part_time: "Part Time",
    distance_learning: "Distance Learning",
  };
  return map[option] ?? option;
}

export function formatCampus(campus: CampusOption, other?: string): string {
  if (campus === "other" && other?.trim()) return other.trim();
  const map: Record<CampusOption, string> = {
    magburaka: "Magburaka",
    kono: "Kono",
    other: "Other",
  };
  return map[campus] ?? campus;
}

export function formatSponsorshipType(type: SponsorshipType, other?: string): string {
  const map: Record<SponsorshipType, string> = {
    self: "Self",
    parent_guardian: "Parent/Guardian",
    organization: "Organization/Employee",
    other: other?.trim() || "Other",
  };
  return map[type] ?? type;
}

export function displayValue(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}
