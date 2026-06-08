import * as XLSX from "xlsx";
import { listApplicants, type ApplicantListItem } from "@/lib/admin-applicants";
import { applicationStatusLabel } from "@/lib/application-status";
import type { ApplicationStatus } from "@/generated/prisma/client";
import { buildCsv } from "@/lib/admin-export/csv-utils";
import { exportFilename } from "@/lib/pdf/pdf-styles";

export type ApplicantExportFilter = "all" | ApplicationStatus;

export async function getApplicantsForExport(filter: ApplicantExportFilter = "all") {
  const applicants = await listApplicants();
  const filtered =
    filter === "all"
      ? applicants
      : applicants.filter((a) => a.applicationStatus === filter);
  return { applicants: filtered, filter };
}

function applicantRows(applicants: ApplicantListItem[]) {
  return applicants.map((a) => [
    a.applicationNumber ?? "",
    a.fullname,
    a.email,
    a.phone ?? "",
    a.programmeName,
    a.firstChoiceCourse ?? "",
    applicationStatusLabel[a.applicationStatus],
    a.submittedAt.slice(0, 10),
  ]);
}

export function buildApplicantRegisterCsv(
  applicants: ApplicantListItem[],
  collegeName: string,
  title: string
) {
  const headerBlock = [
    `${collegeName} — ${title}`,
    `Generated,${new Date().toISOString()}`,
    `Total Records,${applicants.length}`,
    "",
  ];

  const table = buildCsv(
    [
      "Application No.",
      "Full Name",
      "Email",
      "Phone",
      "Programme",
      "First Choice",
      "Status",
      "Submitted",
    ],
    applicantRows(applicants)
  );

  return `${headerBlock.join("\n")}${table}`;
}

export function buildApplicantRegisterWorkbook(
  applicants: ApplicantListItem[],
  collegeName: string,
  title: string
) {
  const wb = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.aoa_to_sheet([
    [`${collegeName} — ${title}`],
    ["Generated", new Date().toISOString()],
    ["Total Records", applicants.length],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const sheet = XLSX.utils.json_to_sheet(
    applicants.map((a) => ({
      "Application No.": a.applicationNumber ?? "",
      "Full Name": a.fullname,
      Email: a.email,
      Phone: a.phone ?? "",
      Programme: a.programmeName,
      "First Choice": a.firstChoiceCourse ?? "",
      Status: applicationStatusLabel[a.applicationStatus],
      Submitted: a.submittedAt.slice(0, 10),
    }))
  );
  XLSX.utils.book_append_sheet(wb, sheet, "Applicants");

  return Buffer.from(
    XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as ArrayBuffer
  );
}

export function applicantExportFilename(kind: string, ext: string) {
  return exportFilename(`transit-${kind}`, ext);
}
