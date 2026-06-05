import { NextResponse } from "next/server";
import { requireStudentSession } from "@/lib/session";
import {
  saveStudentUpload,
  type UploadCategory,
} from "@/lib/student-upload";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CATEGORIES = new Set<UploadCategory>([
  "passport_photo",
  "wassce",
  "birth_certificate",
  "national_id",
  "other",
]);

export async function POST(request: Request) {
  const session = await requireStudentSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = Number.parseInt(session.user.id, 10);
  if (Number.isNaN(studentId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const formData = await request.formData();
  const category = formData.get("category")?.toString() as UploadCategory;
  const file = formData.get("file");

  if (!category || !CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Invalid upload category" }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const saved = await saveStudentUpload(studentId, category, file);

    if (category === "passport_photo") {
      await prisma.student.update({
        where: { id: studentId },
        data: { passportPhoto: saved.filePath },
      });
    } else if (category === "other") {
      await prisma.uploadedDocument.create({
        data: {
          studentId,
          documentType: "other",
          filePath: saved.filePath,
        },
      });
    } else {
      const existing = await prisma.uploadedDocument.findFirst({
        where: { studentId, documentType: category },
      });
      if (existing) {
        await prisma.uploadedDocument.update({
          where: { id: existing.id },
          data: { filePath: saved.filePath, uploadedAt: new Date() },
        });
      } else {
        await prisma.uploadedDocument.create({
          data: {
            studentId,
            documentType: category,
            filePath: saved.filePath,
          },
        });
      }
    }

    return NextResponse.json({
      filePath: saved.filePath,
      fileName: saved.fileName,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
