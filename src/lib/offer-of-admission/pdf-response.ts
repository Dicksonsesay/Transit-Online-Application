import { NextResponse } from "next/server";

export function offerOfAdmissionPdfResponse(
  pdfBytes: Uint8Array,
  fileName: string,
  download: boolean
) {
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
      "Cache-Control": "private, no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
