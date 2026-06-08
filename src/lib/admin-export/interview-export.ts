import * as XLSX from "xlsx";
import { listInterviews, type InterviewListItem } from "@/lib/admin-interviews";
import { interviewStatusLabel } from "@/lib/interview-status";
import { buildCsv } from "@/lib/admin-export/csv-utils";
import { exportFilename, formatPdfDate } from "@/lib/pdf/pdf-styles";

export async function getInterviewsForExport() {
  const interviews = await listInterviews();
  return { interviews };
}

function interviewRows(interviews: InterviewListItem[]) {
  return interviews.map((i) => [
    i.applicationNumber ?? "",
    i.studentName,
    i.email,
    i.interviewDate,
    formatPdfDate(i.interviewTime).split(", ").slice(1).join(", ") || i.interviewTime.slice(11, 16),
    i.venue ?? "",
    interviewStatusLabel[i.interviewStatus],
    i.scheduledByName,
    i.remarks ?? "",
  ]);
}

export function buildInterviewRegisterCsv(
  interviews: InterviewListItem[],
  collegeName: string
) {
  const headerBlock = [
    `${collegeName} — Interview Register`,
    `Generated,${new Date().toISOString()}`,
    `Total Interviews,${interviews.length}`,
    "",
  ];

  const table = buildCsv(
    [
      "Application No.",
      "Student Name",
      "Email",
      "Date",
      "Time",
      "Venue",
      "Status",
      "Scheduled By",
      "Remarks",
    ],
    interviewRows(interviews)
  );

  return `${headerBlock.join("\n")}${table}`;
}

export function buildInterviewRegisterWorkbook(
  interviews: InterviewListItem[],
  collegeName: string
) {
  const wb = XLSX.utils.book_new();
  const summarySheet = XLSX.utils.aoa_to_sheet([
    [`${collegeName} — Interview Register`],
    ["Generated", new Date().toISOString()],
    ["Total Interviews", interviews.length],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const sheet = XLSX.utils.json_to_sheet(
    interviews.map((i) => ({
      "Application No.": i.applicationNumber ?? "",
      "Student Name": i.studentName,
      Email: i.email,
      Date: i.interviewDate,
      Time: new Date(i.interviewTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Venue: i.venue ?? "",
      Status: interviewStatusLabel[i.interviewStatus],
      "Scheduled By": i.scheduledByName,
      Remarks: i.remarks ?? "",
    }))
  );
  XLSX.utils.book_append_sheet(wb, sheet, "Interviews");

  return Buffer.from(
    XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as ArrayBuffer
  );
}

export function interviewExportFilename(ext: string) {
  return exportFilename("transit-interviews", ext);
}
