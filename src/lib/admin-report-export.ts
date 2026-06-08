import * as XLSX from "xlsx";
import type { AdminReportsData } from "@/lib/admin-reports";

function escapeCsvCell(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function buildReportsCsv(report: AdminReportsData): string {
  const lines: string[] = [
    "Transit College — Admissions Report",
    `Generated,${report.generatedAt}`,
    "",
    "Summary Metric,Value",
    `Total Applications,${report.totals.applications}`,
    `Accepted,${report.totals.accepted}`,
    `Rejected,${report.totals.rejected}`,
    `In Review,${report.totals.inReview}`,
    `Interviews Scheduled,${report.totals.interviewsScheduled}`,
    `Interviews Completed,${report.totals.interviewsCompleted}`,
    `PINs Issued,${report.totals.pinsIssued}`,
    `Offers of Admission,${report.totals.acceptanceLetters}`,
    "",
    "PIN Revenue Metric,Count,Amount (SLE)",
    `Total PIN Value,${report.pinRevenue.usedCount + report.pinRevenue.unusedCount},${report.pinRevenue.totalAmount.toFixed(2)}`,
    `Used PIN Value,${report.pinRevenue.usedCount},${report.pinRevenue.usedAmount.toFixed(2)}`,
    `Unused PIN Value,${report.pinRevenue.unusedCount},${report.pinRevenue.unusedAmount.toFixed(2)}`,
    "",
    "Conversion Metric,Percentage",
    `Acceptance Rate,${report.conversion.acceptanceRate}%`,
    `Rejection Rate,${report.conversion.rejectionRate}%`,
    `Decision Completion,${report.conversion.completionRate}%`,
    "",
    "Application Status,Count",
    ...report.applicationsByStatus.map(
      (s) => `${escapeCsvCell(s.label)},${s.value}`
    ),
    "",
    "Month,Applications",
    ...report.monthlyApplications.map(
      (m) => `${escapeCsvCell(m.monthLabel)},${m.count}`
    ),
    "",
    "Programme,Applications,Share %",
    ...report.programmeBreakdown.map(
      (p) =>
        `${escapeCsvCell(p.programmeName)},${p.count},${p.share}`
    ),
  ];

  return lines.join("\n");
}

export function buildReportsWorkbook(report: AdminReportsData): Buffer {
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["Transit College — Admissions Report"],
    ["Generated", report.generatedAt],
    [],
    ["Metric", "Value"],
    ["Total Applications", report.totals.applications],
    ["Accepted", report.totals.accepted],
    ["Rejected", report.totals.rejected],
    ["In Review", report.totals.inReview],
    ["Interviews Scheduled", report.totals.interviewsScheduled],
    ["Interviews Completed", report.totals.interviewsCompleted],
    ["PINs Issued", report.totals.pinsIssued],
    ["Offers of Admission", report.totals.acceptanceLetters],
    [],
    ["PIN Revenue", "Count", "Amount (SLE)"],
    [
      "Total PIN Value",
      report.pinRevenue.usedCount + report.pinRevenue.unusedCount,
      report.pinRevenue.totalAmount,
    ],
    ["Used PIN Value", report.pinRevenue.usedCount, report.pinRevenue.usedAmount],
    ["Unused PIN Value", report.pinRevenue.unusedCount, report.pinRevenue.unusedAmount],
    [],
    ["Conversion", "Rate %"],
    ["Acceptance Rate", report.conversion.acceptanceRate],
    ["Rejection Rate", report.conversion.rejectionRate],
    ["Decision Completion", report.conversion.completionRate],
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const statusSheet = XLSX.utils.json_to_sheet(
    report.applicationsByStatus.map((s) => ({
      Status: s.label,
      Count: s.value,
    }))
  );
  XLSX.utils.book_append_sheet(wb, statusSheet, "By Status");

  const monthlySheet = XLSX.utils.json_to_sheet(
    report.monthlyApplications.map((m) => ({
      Month: m.monthLabel,
      Applications: m.count,
    }))
  );
  XLSX.utils.book_append_sheet(wb, monthlySheet, "Monthly");

  const programmeSheet = XLSX.utils.json_to_sheet(
    report.programmeBreakdown.map((p) => ({
      Programme: p.programmeName,
      Applications: p.count,
      "Share %": p.share,
    }))
  );
  XLSX.utils.book_append_sheet(wb, programmeSheet, "Programmes");

  return Buffer.from(
    XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as ArrayBuffer
  );
}

export function reportExportFilename(ext: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  return `transit-admissions-report-${stamp}.${ext}`;
}
