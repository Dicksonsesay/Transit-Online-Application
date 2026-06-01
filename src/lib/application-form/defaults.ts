import { migrateLegacyFormData } from "@/lib/application-form/migrate-form-data";
import type {
  ApplicationDocuments,
  ApplicationFormData,
  EducationRow,
  ExamSitting,
  ExamSubjectRow,
  RefereeRow,
  UniversityDegreeRow,
} from "@/types/application-form";

export const emptyEducationRow = (): EducationRow => ({
  institutionName: "",
  fromYear: "",
  toYear: "",
  certificateObtained: "",
});

export const emptyExamSubjectRow = (): ExamSubjectRow => ({
  subject: "",
  grade: "",
  year: "",
});

export const emptyExamSitting = (): ExamSitting => ({
  examinationName: "",
  yearTaken: "",
  examinationNumber: "",
  subjects: Array.from({ length: 3 }, emptyExamSubjectRow),
});

export const emptyUniversityDegreeRow = (): UniversityDegreeRow => ({
  institution: "",
  degreeCertificate: "",
  classDivision: "",
  dateObtained: "",
});

export const emptyRefereeRow = (): RefereeRow => ({
  name: "",
  telephone: "",
  email: "",
  address: "",
});

export const emptyDocuments = (): ApplicationDocuments => ({});

export const defaultFormData = (): ApplicationFormData => ({
  educationalBackground: [emptyEducationRow()],
  firstSitting: emptyExamSitting(),
  secondSitting: emptyExamSitting(),
  universityDegrees: [emptyUniversityDegreeRow()],
  referees: [emptyRefereeRow(), emptyRefereeRow()],
  documents: emptyDocuments(),
});

export function mergeFormData(
  stored: ApplicationFormData | null | undefined
): ApplicationFormData {
  const defaults = defaultFormData();
  if (!stored) return defaults;

  const storedMigrated = migrateLegacyFormData(stored);

  return migrateLegacyFormData({
    ...defaults,
    ...storedMigrated,
    educationalBackground:
      stored.educationalBackground?.length
        ? stored.educationalBackground
        : defaults.educationalBackground,
    firstSitting: {
      ...emptyExamSitting(),
      ...stored.firstSitting,
      subjects:
        stored.firstSitting?.subjects?.length
          ? stored.firstSitting.subjects
          : emptyExamSitting().subjects,
    },
    secondSitting: {
      ...emptyExamSitting(),
      ...stored.secondSitting,
      subjects:
        stored.secondSitting?.subjects?.length
          ? stored.secondSitting.subjects
          : emptyExamSitting().subjects,
    },
    universityDegrees:
      stored.universityDegrees?.length
        ? stored.universityDegrees
        : defaults.universityDegrees,
    referees:
      storedMigrated.referees?.length === 2
        ? storedMigrated.referees
        : [emptyRefereeRow(), emptyRefereeRow()],
    documents: {
      ...emptyDocuments(),
      ...storedMigrated.documents,
    },
  });
}
