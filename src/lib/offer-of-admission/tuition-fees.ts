import type { ProgrammeLevelChoice } from "@/types/application-form";

export type OfferTuitionLevel = "degree" | "hnd" | "diploma" | "certificate" | "htc" | "tc";

const LEVEL_PRIORITY: ProgrammeLevelChoice[] = [
  "degree",
  "hnd",
  "diploma",
  "htc_p",
  "htc_s",
  "certificate",
  "tc",
  "short_professional",
];

export function resolvePrimaryProgrammeLevel(
  levels: ProgrammeLevelChoice[] | undefined
): ProgrammeLevelChoice {
  if (!levels?.length) return "degree";
  for (const level of LEVEL_PRIORITY) {
    if (levels.includes(level)) return level;
  }
  return levels[0];
}

export function mapToOfferTuitionLevel(
  level: ProgrammeLevelChoice
): OfferTuitionLevel {
  if (level === "degree") return "degree";
  if (level === "hnd") return "hnd";
  if (level === "diploma") return "diploma";
  if (level === "certificate" || level === "short_professional") return "certificate";
  if (level === "htc_p" || level === "htc_s") return "htc";
  if (level === "tc") return "tc";
  return "degree";
}

export function isPublicHealthProgramme(text: string): boolean {
  return /public\s*health/i.test(text);
}

export function getOfferTuitionFee(
  level: OfferTuitionLevel,
  courseName: string,
  programmeName: string
): number {
  const isPublicHealth =
    isPublicHealthProgramme(courseName) || isPublicHealthProgramme(programmeName);

  switch (level) {
    case "degree":
      return isPublicHealth ? 7148 : 6782;
    case "hnd":
      return isPublicHealth ? 6628 : 5338;
    case "diploma":
      return isPublicHealth ? 5351 : 4247;
    case "certificate":
      return isPublicHealth ? 4885 : 3117;
    case "htc":
      return 5338;
    case "tc":
      return 3177;
    default:
      return isPublicHealth ? 7148 : 6782;
  }
}

export function formatTuitionFee(amount: number): string {
  return `NLe ${amount.toLocaleString("en-US")}`;
}
