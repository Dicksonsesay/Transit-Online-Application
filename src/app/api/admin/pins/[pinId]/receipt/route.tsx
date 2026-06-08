import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import PinReceiptPDFDocument from "@/components/admin/pdf/PinReceiptPDFDocument";
import { getPinReceiptData } from "@/lib/admin-pins";
import { getCollegeBranding } from "@/lib/pdf/college-branding";
import { requireAdminSession } from "@/lib/session";

type RouteContext = { params: Promise<{ pinId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pinId = Number.parseInt((await context.params).pinId, 10);
  if (!Number.isInteger(pinId) || pinId < 1) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
  }

  const [receipt, branding] = await Promise.all([
    getPinReceiptData(pinId),
    getCollegeBranding(),
  ]);

  if (!receipt) {
    return NextResponse.json({ error: "PIN not found" }, { status: 404 });
  }

  const pdfBuffer = await renderToBuffer(
    <PinReceiptPDFDocument
      receipt={receipt}
      collegeName={branding.collegeName}
      tagline={branding.tagline}
      logoSrc={branding.logoSrc}
    />
  );

  const filename = `pin-receipt-${receipt.receiptNumber}.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}
