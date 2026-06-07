import type {
  ApplicationFormData,
  EnrolmentInformation,
  ProgrammeLevelChoice,
} from "@/types/application-form";

const VALID_PROGRAMME_LEVELS = new Set<ProgrammeLevelChoice>([
  "certificate",
  "diploma",
  "hnd",
  "degree",
  "tc",
  "htc_p",
  "htc_s",
  "short_professional",
]);

export function normalizeProgrammeLevels(
  value: unknown
): ProgrammeLevelChoice[] {
  if (Array.isArray(value)) {
    return value.filter(
      (level): level is ProgrammeLevelChoice =>
        typeof level === "string" && VALID_PROGRAMME_LEVELS.has(level as ProgrammeLevelChoice)
    );
  }

  if (
    typeof value === "string" &&
    VALID_PROGRAMME_LEVELS.has(value as ProgrammeLevelChoice)
  ) {
    return [value as ProgrammeLevelChoice];
  }

  return [];
}

/** Map legacy draft values after section reorder or field renames. */
export function migrateLegacyFormData(
  data: ApplicationFormData
): ApplicationFormData {
  const migrated = { ...data };

  if (migrated.enrolment) {
    const raw = migrated.enrolment as EnrolmentInformation & {
      wassceSubjectsPassed?: string;
      englishInclusive?: string;
      programmeLevel?: ProgrammeLevelChoice | string;
    };

    const levels = normalizeProgrammeLevels(
      raw.programmeLevels ?? raw.programmeLevel
    ).map((level) =>
      (level as string) === "undergraduate" ? "degree" : level
    ) as ProgrammeLevelChoice[];

    migrated.enrolment = {
      programmeLevels: levels,
      firstChoiceCourse: raw.firstChoiceCourse ?? "",
      secondChoiceCourse: raw.secondChoiceCourse ?? "",
      preferredAttendance: raw.preferredAttendance ?? [],
      campus: raw.campus ?? "magburaka",
      campusOther: raw.campusOther,
    };
  }

  return migrated;
}
