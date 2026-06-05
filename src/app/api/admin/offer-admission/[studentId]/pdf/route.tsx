import { NextResponse } from "next/server";
import { getAcceptanceLetterCandidateByStudentId } from "@/lib/admin-acceptance-letters";
import { buildOfferOfAdmissionInput } from "@/lib/offer-of-admission/build-input";
import { generateOfferOfAdmissionPdf } from "@/lib/offer-of-admission/generate-pdf";
import { offerOfAdmissionPdfResponse } from "@/lib/offer-of-admission/pdf-response";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    return NextResponse.json({ error: "Offer of admission not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";

  const pdfBytes = await generateOfferOfAdmissionPdf(
    buildOfferOfAdmissionInput({
      studentName: applicant.studentName,
      programmeName: applicant.programmeName,
      courseName: applicant.courseName,
      admissionYear: applicant.admissionYear,
      generatedAt: applicant.letter.generatedAt,
      programmeLevels: applicant.programmeLevels,
    })
  );

  const fileName = `Offer-of-Admission-${
    applicant.applicationNumber ?? `student-${studentId}`
  }.pdf`;

  return offerOfAdmissionPdfResponse(pdfBytes, fileName, download);
}
