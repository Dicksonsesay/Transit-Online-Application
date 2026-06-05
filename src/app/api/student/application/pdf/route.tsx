import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { requireStudentSession } from "@/lib/session";
import ApplicationPDFDocument from "@/components/student/application/ApplicationPDFDocument";
import { resolvePublicFileUrl } from "@/lib/student-upload";
import type { ApplicationFormData } from "@/types/application-form";

export async function GET(request: Request) {
  const session = await requireStudentSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const url = new URL(request.url);
  const download = url.searchParams.get("download") === "1";
  const baseOrigin = url.origin;

  const [student, application] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: { fullname: true, applicationNumber: true, passportPhoto: true },
    }),
    prisma.application.findUnique({
      where: { studentId },
      select: {
        applicationStatus: true,
        submittedAt: true,
        formPayload: true,
      },
    }),
  ]);

  if (!student || !application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const passportPhotoUrl =
    resolvePublicFileUrl(student.passportPhoto, baseOrigin) ?? null;

  const pdfBuffer = await renderToBuffer(
    <ApplicationPDFDocument
      applicationNumber={student.applicationNumber}
      studentName={student.fullname}
      submittedAt={application.submittedAt}
      formPayload={
        ((application.formPayload ?? {}) as unknown as ApplicationFormData)
      }
      passportPhotoUrl={passportPhotoUrl}
    />
  );

  const pdfBytes = new Uint8Array(pdfBuffer);

  const fileName = `Application-${
    student.applicationNumber ?? `student-${studentId}`
  }.pdf`;

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
    },
  });
}

