import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import AcceptanceLetterPDFDocument from "@/components/acceptance/AcceptanceLetterPDFDocument";
import { getAcceptanceLetterCandidateByStudentId } from "@/lib/admin-acceptance-letters";
import { requireAdminSession } from "@/lib/session";

export async function GET(
  request: Request,
  context: { params: Promise<{ studentId: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { studentId: studentIdParam } = await context.params;
  const studentId = Number.parseInt(studentIdParam, 10);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid student." }, { status: 400 });
  }

  const applicant = await getAcceptanceLetterCandidateByStudentId(studentId);
  if (!applicant?.letter) {
    return NextResponse.json({ error: "Acceptance letter not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";
  const pdfBuffer = await renderToBuffer(
    <AcceptanceLetterPDFDocument
      letterReference={applicant.letter.letterReference}
      date={applicant.letter.generatedAt}
      studentName={applicant.studentName}
      programmeName={applicant.programmeName}
      courseName={applicant.courseName ?? applicant.programmeName}
      admissionYear={applicant.admissionYear}
    />
  );

  const pdfBytes = new Uint8Array(pdfBuffer);
  const fileName = `Acceptance-Letter-${
    applicant.applicationNumber ?? `student-${studentId}`
  }.pdf`;

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
    },
  });
}
