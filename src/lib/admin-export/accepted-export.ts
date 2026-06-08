import * as XLSX from "xlsx";
import {
  listAcceptanceLetterCandidates,
  type AcceptanceLetterCandidate,
} from "@/lib/admin-acceptance-letters";
import { buildCsv } from "@/lib/admin-export/csv-utils";
import { exportFilename } from "@/lib/pdf/pdf-styles";

export async function getAcceptedStudentsForExport() {
  const students = await listAcceptanceLetterCandidates();
  return { students };
}

function acceptedRows(students: AcceptanceLetterCandidate[]) {
  return students.map((s) => [
    s.applicationNumber ?? "",
    s.studentName,
    s.studentEmail,
    s.programmeName,
    s.courseName ?? "",
    s.admissionYear,
    s.letterReference ?? "",
    s.publishedAt ? "Sent" : s.generatedAt ? "Draft" : "Pending",
    s.publishedAt?.slice(0, 10) ?? s.generatedAt?.slice(0, 10) ?? "",
  ]);
}

export function buildAcceptedStudentsCsv(
  students: AcceptanceLetterCandidate[],
  collegeName: string
) {
  const headerBlock = [
    `${collegeName} — Accepted Students Register`,
    `Generated,${new Date().toISOString()}`,
    `Total Accepted,${students.length}`,
    "",
  ];

  const table = buildCsv(
    [
      "Application No.",
      "Student Name",
      "Email",
      "Programme",
      "Course",
      "Admission Year",
      "Letter Ref.",
      "Offer Status",
      "Date",
    ],
    acceptedRows(students)
  );

  return `${headerBlock.join("\n")}${table}`;
}

export function buildAcceptedStudentsWorkbook(
  students: AcceptanceLetterCandidate[],
  collegeName: string
) {
  const wb = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.aoa_to_sheet([
    [`${collegeName} — Accepted Students`],
    ["Generated", new Date().toISOString()],
    ["Total Accepted", students.length],
    [
      "Offers Sent",
      students.filter((s) => s.publishedAt).length,
    ],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const sheet = XLSX.utils.json_to_sheet(
    students.map((s) => ({
      "Application No.": s.applicationNumber ?? "",
      "Student Name": s.studentName,
      Email: s.studentEmail,
      Programme: s.programmeName,
      Course: s.courseName ?? "",
      "Admission Year": s.admissionYear,
      "Letter Ref.": s.letterReference ?? "",
      "Offer Status": s.publishedAt ? "Sent" : s.generatedAt ? "Draft" : "Pending",
      Date: s.publishedAt?.slice(0, 10) ?? s.generatedAt?.slice(0, 10) ?? "",
    }))
  );
  XLSX.utils.book_append_sheet(wb, sheet, "Accepted Students");

  return Buffer.from(
    XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as ArrayBuffer
  );
}

export function acceptedExportFilename(ext: string) {
  return exportFilename("transit-accepted-students", ext);
}
