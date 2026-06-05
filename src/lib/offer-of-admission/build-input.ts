import type { ProgrammeLevelChoice } from "@/types/application-form";
import type { OfferOfAdmissionPdfInput } from "./generate-pdf";

export function buildOfferOfAdmissionInput(args: {
  studentName: string;
  programmeName: string;
  courseName: string | null;
  admissionYear: string;
  generatedAt: Date | string;
  programmeLevels?: ProgrammeLevelChoice[];
}): OfferOfAdmissionPdfInput {
  return {
    studentName: args.studentName,
    programmeName: args.programmeName,
    courseName: args.courseName ?? args.programmeName,
    date: args.generatedAt,
    admissionYear: args.admissionYear,
    programmeLevels: args.programmeLevels,
  };
}
