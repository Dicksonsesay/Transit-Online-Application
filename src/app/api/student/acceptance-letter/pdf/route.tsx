import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import AcceptanceLetterPDFDocument from "@/components/acceptance/AcceptanceLetterPDFDocument";
import { getStudentAcceptanceLetter } from "@/lib/student-acceptance-letter";
import { requireStudentSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await requireStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  const letter = await getStudentAcceptanceLetter(studentId);
  if (!letter || letter.applicationStatus !== "accepted" || !letter.letter) {
    return NextResponse.json({ error: "Acceptance letter not available." }, { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const pdfBuffer = await renderToBuffer(
    <AcceptanceLetterPDFDocument
      letterReference={letter.letter.letterReference}
      date={letter.letter.generatedAt}
      studentName={letter.studentName}
      programmeName={letter.programmeName}
      courseName={letter.courseName ?? letter.programmeName}
      admissionYear={letter.admissionYear}
    />
  );

  const pdfBytes = new Uint8Array(pdfBuffer);
  const fileName = `Acceptance-Letter-${letter.studentName.replace(/\s+/g, "-")}.pdf`;

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
    },
  });
}
