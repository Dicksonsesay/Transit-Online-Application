import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import AdminReportsPDFDocument from "@/components/admin/AdminReportsPDFDocument";
import { getAdminReportsData } from "@/lib/admin-reports";
import {
  buildReportsCsv,
  buildReportsWorkbook,
  reportExportFilename,
} from "@/lib/admin-report-export";
import { getSystemSettings } from "@/lib/system-settings";
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

  const [report, settings] = await Promise.all([
    getAdminReportsData(),
    getSystemSettings(),
  ]);

  if (format === "csv") {
    const body = buildReportsCsv(report);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${reportExportFilename("csv")}"`,
      },
    });
  }

  if (format === "xlsx") {
    const buffer = buildReportsWorkbook(report);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${reportExportFilename("xlsx")}"`,
      },
    });
  }

  const pdfBuffer = await renderToBuffer(
    <AdminReportsPDFDocument
      report={report}
      collegeName={settings.collegeDisplayName}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${reportExportFilename("pdf")}"`,
    },
  });
}
