import { NextResponse } from "next/server";
import { buildOfferOfAdmissionInput } from "@/lib/offer-of-admission/build-input";
import { generateOfferOfAdmissionPdf } from "@/lib/offer-of-admission/generate-pdf";
import { offerOfAdmissionPdfResponse } from "@/lib/offer-of-admission/pdf-response";
import { getStudentAcceptanceLetter } from "@/lib/student-acceptance-letter";
import { requireStudentSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    return NextResponse.json(
      { error: "Offer of admission is not available until admissions publishes it." },
      { status: 404 }
    );
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const pdfBytes = await generateOfferOfAdmissionPdf(
    buildOfferOfAdmissionInput({
      studentName: letter.studentName,
      programmeName: letter.programmeName,
      courseName: letter.courseName,
      admissionYear: letter.admissionYear,
      generatedAt: letter.letter.generatedAt,
      programmeLevels: letter.programmeLevels,
    })
  );

  const fileName = `Offer-of-Admission-${letter.studentName.replace(/\s+/g, "-")}.pdf`;

  return offerOfAdmissionPdfResponse(pdfBytes, fileName, download);
}
