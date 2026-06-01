import { z } from "zod";

const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

const optionalString = z.string().trim().optional().or(z.literal(""));

const educationRowSchema = z.object({
  institutionName: optionalString,
  fromYear: optionalString,
  toYear: optionalString,
  certificateObtained: optionalString,
});

const examSubjectSchema = z.object({
  subject: optionalString,
  grade: optionalString,
  year: optionalString,
});

const examSittingSchema = z.object({
  examinationName: optionalString,
  yearTaken: optionalString,
  examinationNumber: optionalString,
  subjects: z.array(examSubjectSchema),
});

export const personalSchema = z
  .object({
    title: z.enum(["mr", "mrs", "miss", "other"]),
    titleOther: optionalString,
    surname: requiredString("Surname"),
    firstName: requiredString("First name"),
    otherNames: optionalString,
    sex: z.enum(["male", "female"]),
    dateOfBirth: requiredString("Date of birth"),
    contactNumbers: requiredString("Contact number"),
    email: z.string().trim().email("Enter a valid email."),
    currentAddress: requiredString("Current contact address"),
    permanentAddress: requiredString("Permanent contact address"),
    district: requiredString("District"),
    region: requiredString("Region"),
    nationality: requiredString("Nationality"),
    religion: requiredString("Religion"),
    passportPhotoUrl: requiredString("Passport photograph"),
  })
  .refine(
    (data) => data.title !== "other" || (data.titleOther?.trim().length ?? 0) > 0,
    { message: "Please specify your title.", path: ["titleOther"] }
  );

export const sponsorshipSchema = z
  .object({
    sponsorshipType: z.enum(["self", "parent_guardian", "organization", "other"]),
    sponsorshipOther: optionalString,
    sponsorName: optionalString,
    sponsorRelationship: optionalString,
    sponsorOccupation: optionalString,
    sponsorContactNumbers: optionalString,
    sponsorEmail: optionalString,
    sponsorOfficeAddress: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.sponsorshipType === "other" && !data.sponsorshipOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Please specify sponsorship type.",
        path: ["sponsorshipOther"],
      });
    }
    if (data.sponsorshipType !== "self") {
      if (!data.sponsorName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Sponsor name is required.",
          path: ["sponsorName"],
        });
      }
      if (!data.sponsorContactNumbers?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Sponsor contact number is required.",
          path: ["sponsorContactNumbers"],
        });
      }
    }
  });

export const parentGuardianSchema = z.object({
  name: requiredString("Name"),
  relationship: requiredString("Relationship"),
  occupation: requiredString("Occupation"),
  contactNumbers: requiredString("Contact number"),
  email: z
    .string()
    .trim()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Enter a valid email.",
    }),
  homeAddress: requiredString("Home address"),
});

const uploadedFileSchema = z.object({
  fileName: requiredString("File name"),
  filePath: requiredString("File"),
});

export const enrolmentSchema = z
  .object({
    programmeLevels: z
      .array(
        z.enum([
          "certificate",
          "diploma",
          "hnd",
          "degree",
          "tc",
          "htc_p",
          "htc_s",
          "short_professional",
        ])
      )
      .min(1, "Select at least one programme level."),
    firstChoiceCourse: requiredString("First choice course of study"),
    secondChoiceCourse: optionalString,
    preferredAttendance: z
      .array(z.enum(["full_time", "part_time", "distance_learning"]))
      .min(1, "Select a preferred attendance option."),
    campus: z.enum(["magburaka", "kono", "other"]),
    campusOther: optionalString,
  })
  .refine(
    (data) => data.campus !== "other" || (data.campusOther?.trim().length ?? 0) > 0,
    { message: "Please specify the campus.", path: ["campusOther"] }
  );

export const documentsSchema = z.object({
  wassce: uploadedFileSchema,
  birthCertificate: uploadedFileSchema,
  nationalId: uploadedFileSchema,
  other: z.array(uploadedFileSchema).optional(),
});

export const educationalBackgroundSchema = z
  .array(educationRowSchema)
  .min(1)
  .refine(
    (rows) =>
      rows.some(
        (r) =>
          r.institutionName?.trim() ||
          r.fromYear?.trim() ||
          r.toYear?.trim() ||
          r.certificateObtained?.trim()
      ),
    { message: "Add at least one school or institution." }
  )
  .refine(
    (rows) =>
      rows.every((r) => {
        const hasAny =
          r.institutionName?.trim() ||
          r.fromYear?.trim() ||
          r.toYear?.trim() ||
          r.certificateObtained?.trim();
        if (!hasAny) return true;
        return Boolean(r.institutionName?.trim());
      }),
    { message: "Institution name is required for each row you fill in." }
  );

export const firstSittingSchema = z
  .object({
    examinationName: requiredString("Examination name"),
    yearTaken: requiredString("Year taken"),
    examinationNumber: requiredString("Examination number"),
    subjects: z.array(examSubjectSchema).min(1),
  })
  .refine(
    (data) =>
      data.subjects.some(
        (s) => s.subject?.trim() && s.grade?.trim()
      ),
    { message: "Add at least one subject with a grade.", path: ["subjects"] }
  );

/** Second sitting is optional — validate only when the applicant starts filling it. */
export const secondSittingSchema = z
  .object({
    examinationName: optionalString,
    yearTaken: optionalString,
    examinationNumber: optionalString,
    subjects: z.array(examSubjectSchema),
  })
  .superRefine((data, ctx) => {
    const hasHeader =
      Boolean(data.examinationName?.trim()) ||
      Boolean(data.yearTaken?.trim()) ||
      Boolean(data.examinationNumber?.trim());
    const hasSubjects = data.subjects.some(
      (s) => s.subject?.trim() || s.grade?.trim()
    );

    if (!hasHeader && !hasSubjects) return;

    if (!data.examinationName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Examination name is required.",
        path: ["examinationName"],
      });
    }
    if (!data.yearTaken?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Year taken is required.",
        path: ["yearTaken"],
      });
    }
    if (!data.examinationNumber?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Examination number is required.",
        path: ["examinationNumber"],
      });
    }
    if (!data.subjects.some((s) => s.subject?.trim() && s.grade?.trim())) {
      ctx.addIssue({
        code: "custom",
        message: "Add at least one subject with a grade.",
        path: ["subjects"],
      });
    }
  });

export const universityDegreesSchema = z.array(
  z.object({
    institution: optionalString,
    degreeCertificate: optionalString,
    classDivision: optionalString,
    dateObtained: optionalString,
  })
);

export const refereesSchema = z
  .array(
    z.object({
      name: requiredString("Referee name"),
      telephone: requiredString("Telephone number"),
      email: optionalString,
      address: requiredString("Contact address"),
    })
  )
  .length(2, "Provide details for two referees.");

export const declarationSchema = z.object({
  declarerName: requiredString("Your full name"),
  agreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the declaration.",
  }),
  signature: requiredString("Signature"),
  declarationDate: requiredString("Date"),
});

export const sectionSchemas = {
  personal: personalSchema,
  enrolment: enrolmentSchema,
  educationalBackground: educationalBackgroundSchema,
  firstSitting: firstSittingSchema,
  secondSitting: secondSittingSchema,
  universityDegrees: universityDegreesSchema,
  parentGuardian: parentGuardianSchema,
  sponsorship: sponsorshipSchema,
  documents: documentsSchema,
  referees: refereesSchema,
  declaration: declarationSchema,
} as const;

export type SectionSchemaKey = keyof typeof sectionSchemas;

export function formatZodErrors(error: z.ZodError): string {
  const first = error.issues[0];
  return first?.message ?? "Please check the form and try again.";
}
