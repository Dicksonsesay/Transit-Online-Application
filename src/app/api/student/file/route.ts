import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdminSession, requireStudentSession } from "@/lib/session";
import { studentOwnsStoredFile } from "@/lib/student-upload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function contentTypeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

export async function GET(request: Request) {
  const [studentSession, adminSession] = await Promise.all([
    requireStudentSession(),
    requireAdminSession(),
  ]);

  if (!studentSession?.user?.id && !adminSession?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storedPath = new URL(request.url).searchParams.get("path")?.trim();
  if (!storedPath) {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  if (studentSession?.user?.id) {
    const studentId = Number.parseInt(studentSession.user.id, 10);
    if (Number.isNaN(studentId) || !studentOwnsStoredFile(studentId, storedPath)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } else if (
    !storedPath.includes("/uploads/students/") &&
    !storedPath.includes("students/")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    if (/^https?:\/\//i.test(storedPath)) {
      const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
      if (!token) {
        return NextResponse.json(
          { error: "Blob storage is not configured" },
          { status: 500 }
        );
      }

      const blobResponse = await fetch(storedPath, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!blobResponse.ok) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      const buffer = Buffer.from(await blobResponse.arrayBuffer());
      const contentType =
        blobResponse.headers.get("content-type") ??
        contentTypeFromPath(storedPath);

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "private, max-age=3600",
        },
      });
    }

    const relativePath = storedPath.replace(/^\/+/, "");
    const absolutePath = path.join(process.cwd(), "public", relativePath);
    const uploadsRoot = path.join(process.cwd(), "public", "uploads", "students");
    const resolved = path.resolve(absolutePath);

    if (!resolved.startsWith(uploadsRoot)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const buffer = await readFile(resolved);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypeFromPath(resolved),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
