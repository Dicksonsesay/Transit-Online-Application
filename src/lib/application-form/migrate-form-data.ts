import type {
  ApplicationFormData,
  EnrolmentInformation,
  ProgrammeLevelChoice,
} from "@/types/application-form";

/** Map legacy draft values after section reorder or field renames. */
export function migrateLegacyFormData(
  data: ApplicationFormData
): ApplicationFormData {
  const migrated = { ...data };

  if (migrated.enrolment) {
    const raw = migrated.enrolment as EnrolmentInformation & {
      wassceSubjectsPassed?: string;
      englishInclusive?: string;
    };
    const levels = raw.programmeLevels.map((level) =>
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
