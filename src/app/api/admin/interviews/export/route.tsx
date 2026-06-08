import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import InterviewRegisterPDFDocument from "@/components/admin/pdf/InterviewRegisterPDFDocument";
import {
  buildInterviewRegisterCsv,
  buildInterviewRegisterWorkbook,
  getInterviewsForExport,
  interviewExportFilename,
} from "@/lib/admin-export/interview-export";
import { getCollegeBranding } from "@/lib/pdf/college-branding";
import { requireAdminSession } from "@/lib/session";

const FORMATS = new Set(["pdf", "xlsx", "csv"]);

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = new URL(request.url).searchParams.get("format") ?? "pdf";
  if (!FORMATS.has(format)) {
    return NextResponse.json({ error: "Invalid export format" }, { status: 400 });
  }

  const [{ interviews }, branding] = await Promise.all([
    getInterviewsForExport(),
    getCollegeBranding(),
  ]);

  if (format === "csv") {
    return new NextResponse(
      buildInterviewRegisterCsv(interviews, branding.collegeName),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${interviewExportFilename("csv")}"`,
        },
      }
    );
  }

  if (format === "xlsx") {
    const buffer = buildInterviewRegisterWorkbook(interviews, branding.collegeName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${interviewExportFilename("xlsx")}"`,
      },
    });
  }

  const pdfBuffer = await renderToBuffer(
    <InterviewRegisterPDFDocument
      interviews={interviews}
      collegeName={branding.collegeName}
      tagline={branding.tagline}
      logoSrc={branding.logoSrc}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${interviewExportFilename("pdf")}"`,
    },
  });
}
