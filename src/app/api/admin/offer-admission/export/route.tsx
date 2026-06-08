import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import AcceptedStudentsPDFDocument from "@/components/admin/pdf/AcceptedStudentsPDFDocument";
import {
  acceptedExportFilename,
  buildAcceptedStudentsCsv,
  buildAcceptedStudentsWorkbook,
  getAcceptedStudentsForExport,
} from "@/lib/admin-export/accepted-export";
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

  const [{ students }, branding] = await Promise.all([
    getAcceptedStudentsForExport(),
    getCollegeBranding(),
  ]);

  if (format === "csv") {
    return new NextResponse(
      buildAcceptedStudentsCsv(students, branding.collegeName),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${acceptedExportFilename("csv")}"`,
        },
      }
    );
  }

  if (format === "xlsx") {
    const buffer = buildAcceptedStudentsWorkbook(students, branding.collegeName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${acceptedExportFilename("xlsx")}"`,
      },
    });
  }

  const pdfBuffer = await renderToBuffer(
    <AcceptedStudentsPDFDocument
      students={students}
      collegeName={branding.collegeName}
      tagline={branding.tagline}
      logoSrc={branding.logoSrc}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${acceptedExportFilename("pdf")}"`,
    },
  });
}
