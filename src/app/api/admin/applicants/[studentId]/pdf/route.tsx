import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ApplicationPDFDocument from "@/components/student/application/ApplicationPDFDocument";
import { getApplicantByStudentId } from "@/lib/admin-applicants";
import { resolvePublicFileUrl } from "@/lib/student-upload";
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
    return NextResponse.json({ error: "Invalid applicant" }, { status: 400 });
  }

  const applicant = await getApplicantByStudentId(studentId);
  if (!applicant) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";
  const baseOrigin = url.origin;

  const passportPhotoUrl =
    resolvePublicFileUrl(applicant.passportPhoto, baseOrigin) ?? null;

  const pdfBuffer = await renderToBuffer(
    <ApplicationPDFDocument
      applicationNumber={applicant.applicationNumber}
      studentName={applicant.fullname}
      submittedAt={applicant.submittedAt}
      formPayload={applicant.formData}
      passportPhotoUrl={passportPhotoUrl}
    />
  );

  const pdfBytes = new Uint8Array(pdfBuffer);
  const fileName = `Application-${
    applicant.applicationNumber ?? `student-${studentId}`
  }.pdf`;

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
    },
  });
}
