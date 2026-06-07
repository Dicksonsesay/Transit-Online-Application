import { ALL_COLLEGE_PROGRAMME_NAMES } from "@/lib/college-programmes";
import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type { ApplicationFormData } from "@/types/application-form";

function normalizeProgrammeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/** First-choice course from the applicant's enrolment section. */
export function resolveApplicantCourseChoice(
  enrolment: ApplicationFormData["enrolment"] | undefined
): string | null {
  const firstChoice = enrolment?.firstChoiceCourse?.trim();
  return firstChoice || null;
}

/** Prefer the applicant's chosen course; fall back to the linked programme record. */
export function resolveApplicantProgrammeDisplay(
  enrolment: ApplicationFormData["enrolment"] | undefined,
  linkedProgrammeName: string
): string {
  return resolveApplicantCourseChoice(enrolment) ?? linkedProgrammeName;
}

/** Resolve programme display from stored application JSON and linked programme row. */
export function resolveProgrammeFromFormPayload(
  formPayload: unknown,
  linkedProgrammeName: string
): string {
  const payload = migrateLegacyFormData(
    (formPayload as ApplicationFormData | null) ?? {}
  );
  return resolveApplicantProgrammeDisplay(payload.enrolment, linkedProgrammeName);
}

/** Match a free-text course choice to a known college programme name. */
export function matchCollegeProgrammeName(search: string): string | null {
  const normalized = normalizeProgrammeText(search);
  if (!normalized) return null;

  const exact = ALL_COLLEGE_PROGRAMME_NAMES.find(
    (name) => normalizeProgrammeText(name) === normalized
  );
  if (exact) return exact;

  return (
    ALL_COLLEGE_PROGRAMME_NAMES.find((name) => {
      const programme = normalizeProgrammeText(name);
      return programme.includes(normalized) || normalized.includes(programme);
    }) ?? null
  );
}
