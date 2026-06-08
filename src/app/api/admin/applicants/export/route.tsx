import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ApplicantRegisterPDFDocument from "@/components/admin/pdf/ApplicantRegisterPDFDocument";
import {
  applicantExportFilename,
  buildApplicantRegisterCsv,
  buildApplicantRegisterWorkbook,
  getApplicantsForExport,
  type ApplicantExportFilter,
} from "@/lib/admin-export/applicant-export";
import { applicationStatusLabel } from "@/lib/application-status";
import { getCollegeBranding } from "@/lib/pdf/college-branding";
import { requireAdminSession } from "@/lib/session";
import type { ApplicationStatus } from "@/generated/prisma/client";

const FORMATS = new Set(["pdf", "xlsx", "csv"]);
const STATUS_FILTERS = new Set<ApplicantExportFilter>([
  "all",
  "submitted",
  "under_review",
  "interview_scheduled",
  "interviewed",
  "accepted",
  "rejected",
]);

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "pdf";
  const filterParam = (url.searchParams.get("status") ?? "all") as ApplicantExportFilter;

  if (!FORMATS.has(format)) {
    return NextResponse.json({ error: "Invalid export format" }, { status: 400 });
  }

  if (!STATUS_FILTERS.has(filterParam)) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
  }

  const [{ applicants, filter }, branding] = await Promise.all([
    getApplicantsForExport(filterParam),
    getCollegeBranding(),
  ]);

  const filterLabel =
    filter === "all"
      ? "All applicants"
      : applicationStatusLabel[filter as ApplicationStatus];

  const title =
    filter === "accepted"
      ? "Accepted Students Register"
      : filter === "interview_scheduled" || filter === "interviewed"
        ? "Interview Pipeline Register"
        : "Applicant Register";

  const exportKind =
    filter === "all"
      ? "applicants"
      : filter === "accepted"
        ? "accepted-students"
        : `applicants-${filter}`;

  if (format === "csv") {
    return new NextResponse(
      buildApplicantRegisterCsv(applicants, branding.collegeName, title),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${applicantExportFilename(exportKind, "csv")}"`,
        },
      }
    );
  }

  if (format === "xlsx") {
    const buffer = buildApplicantRegisterWorkbook(
      applicants,
      branding.collegeName,
      title
    );
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${applicantExportFilename(exportKind, "xlsx")}"`,
      },
    });
  }

  const pdfBuffer = await renderToBuffer(
    <ApplicantRegisterPDFDocument
      applicants={applicants}
      collegeName={branding.collegeName}
      tagline={branding.tagline}
      logoSrc={branding.logoSrc}
      title={title}
      filterLabel={filterLabel}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${applicantExportFilename(exportKind, "pdf")}"`,
    },
  });
}
