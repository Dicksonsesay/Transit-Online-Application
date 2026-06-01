export type TitleOption = "mr" | "mrs" | "miss" | "other";

export type SponsorshipType =
  | "self"
  | "parent_guardian"
  | "organization"
  | "other";

export type ProgrammeLevelChoice =
  | "certificate"
  | "diploma"
  | "hnd"
  | "degree"
  | "tc"
  | "htc_p"
  | "htc_s"
  | "short_professional";

export type AttendanceOption = "full_time" | "part_time" | "distance_learning";

export type CampusOption = "magburaka" | "kono" | "other";

export type EducationRow = {
  institutionName: string;
  fromYear: string;
  toYear: string;
  certificateObtained: string;
};

export type ExamSubjectRow = {
  subject: string;
  grade: string;
  year: string;
};

export type ExamSitting = {
  examinationName: string;
  yearTaken: string;
  examinationNumber: string;
  subjects: ExamSubjectRow[];
};

export type UniversityDegreeRow = {
  institution: string;
  degreeCertificate: string;
  classDivision: string;
  dateObtained: string;
};

export type RefereeRow = {
  name: string;
  telephone: string;
  email: string;
  address: string;
};

export type UploadedFileMeta = {
  fileName: string;
  filePath: string;
};

export type ApplicationDocuments = {
  wassce?: UploadedFileMeta;
  birthCertificate?: UploadedFileMeta;
  nationalId?: UploadedFileMeta;
  other?: UploadedFileMeta[];
};

export type PersonalInformation = {
  title: TitleOption;
  titleOther?: string;
  surname: string;
  firstName: string;
  otherNames?: string;
  sex: "male" | "female";
  dateOfBirth: string;
  contactNumbers: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  district: string;
  region: string;
  nationality: string;
  religion: string;
  passportPhotoUrl?: string;
};

export type SponsorshipInformation = {
  sponsorshipType: SponsorshipType;
  sponsorshipOther?: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorOccupation?: string;
  sponsorContactNumbers?: string;
  sponsorEmail?: string;
  sponsorOfficeAddress?: string;
};

export type ParentGuardianInformation = {
  name: string;
  relationship: string;
  occupation: string;
  contactNumbers: string;
  email: string;
  homeAddress: string;
};

export type EnrolmentInformation = {
  programmeLevels: ProgrammeLevelChoice[];
  firstChoiceCourse: string;
  secondChoiceCourse: string;
  preferredAttendance: AttendanceOption[];
  campus: CampusOption;
  campusOther?: string;
};

export type DeclarationInformation = {
  declarerName: string;
  agreed: boolean;
  signature: string;
  declarationDate: string;
};

export type ApplicationFormData = {
  personal?: PersonalInformation;
  enrolment?: EnrolmentInformation;
  educationalBackground?: EducationRow[];
  firstSitting?: ExamSitting;
  secondSitting?: ExamSitting;
  universityDegrees?: UniversityDegreeRow[];
  parentGuardian?: ParentGuardianInformation;
  sponsorship?: SponsorshipInformation;
  documents?: ApplicationDocuments;
  referees?: RefereeRow[];
  declaration?: DeclarationInformation;
};

export const APPLICATION_SECTION_COUNT = 11;

export const APPLICATION_SECTIONS = [
  { id: 1, key: "personal", title: "Personal Information" },
  { id: 2, key: "enrolment", title: "Enrolment Information" },
  { id: 3, key: "educationalBackground", title: "Educational Background" },
  { id: 4, key: "firstSitting", title: "Entry Qualifications — First Sitting" },
  { id: 5, key: "secondSitting", title: "Entry Qualifications — Second Sitting" },
  { id: 6, key: "universityDegrees", title: "University or College Degree" },
  { id: 7, key: "parentGuardian", title: "Parent / Guardian Information" },
  { id: 8, key: "sponsorship", title: "Sponsorship Information" },
  { id: 9, key: "documents", title: "Supporting Documents" },
  { id: 10, key: "referees", title: "Referees" },
  { id: 11, key: "declaration", title: "Declaration" },
] as const;

export type ApplicationSectionKey =
  (typeof APPLICATION_SECTIONS)[number]["key"];

export const DOCUMENT_TYPE_LABELS = {
  wassce: "WASSCE / Testimonial",
  birth_certificate: "Birth Certificate",
  national_id: "National ID",
  other: "Other relevant document",
  passport_photo: "Passport photograph",
} as const;
