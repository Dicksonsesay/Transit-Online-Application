import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import PinRegisterPDFDocument from "@/components/admin/pdf/PinRegisterPDFDocument";
import {
  buildPinRegisterCsv,
  buildPinRegisterWorkbook,
  getPinsForExport,
  pinExportFilename,
  type PinExportFilter,
} from "@/lib/admin-export/pin-export";
import { getCollegeBranding } from "@/lib/pdf/college-branding";
import { requireAdminSession } from "@/lib/session";

const FORMATS = new Set(["pdf", "xlsx", "csv"]);
const FILTERS = new Set<PinExportFilter>(["all", "unused", "used"]);

export async function GET(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "pdf";
  const filterParam = (url.searchParams.get("status") ?? "all") as PinExportFilter;

  if (!FORMATS.has(format)) {
    return NextResponse.json({ error: "Invalid export format" }, { status: 400 });
  }

  if (!FILTERS.has(filterParam)) {
    return NextResponse.json({ error: "Invalid status filter" }, { status: 400 });
  }

  const [{ pins, summary, filter }, branding] = await Promise.all([
    getPinsForExport(filterParam),
    getCollegeBranding(),
  ]);

  const filterLabel =
    filter === "all" ? "All PINs" : filter === "used" ? "Used PINs" : "Unused PINs";

  if (format === "csv") {
    return new NextResponse(
      buildPinRegisterCsv(pins, summary, branding.collegeName),
      {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${pinExportFilename(filter, "csv")}"`,
        },
      }
    );
  }

  if (format === "xlsx") {
    const buffer = buildPinRegisterWorkbook(pins, summary, branding.collegeName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${pinExportFilename(filter, "xlsx")}"`,
      },
    });
  }

  const pdfBuffer = await renderToBuffer(
    <PinRegisterPDFDocument
      pins={pins}
      summary={summary}
      collegeName={branding.collegeName}
      tagline={branding.tagline}
      logoSrc={branding.logoSrc}
      filterLabel={filterLabel}
    />
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pinExportFilename(filter, "pdf")}"`,
    },
  });
}
