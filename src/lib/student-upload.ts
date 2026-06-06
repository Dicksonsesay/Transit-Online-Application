import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { put } from "@vercel/blob";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB

const ALLOWED_MIME: Record<string, string[]> = {
  passport_photo: ["image/jpeg", "image/png", "image/webp"],
  wassce: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  birth_certificate: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  national_id: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  other: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
};

export type UploadCategory =
  | "passport_photo"
  | "wassce"
  | "birth_certificate"
  | "national_id"
  | "other";

function shouldUseBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function resolvePublicFileUrl(
  filePath: string | null | undefined,
  baseOrigin?: string
): string | undefined {
  if (!filePath) return undefined;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  if (!baseOrigin) return filePath;
  return `${baseOrigin}${filePath.startsWith("/") ? filePath : `/${filePath}`}`;
}

export function validateUploadFile(
  category: UploadCategory,
  file: File
): string | null {
  const allowed = ALLOWED_MIME[category];
  if (!allowed.includes(file.type)) {
    return "File type not allowed. Use PDF, JPG, or PNG.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 8 MB.";
  }
  return null;
}

async function saveToBlobStorage(
  studentId: number,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const blob = await put(`students/${studentId}/${fileName}`, buffer, {
    access: "private",
    contentType,
    addRandomSuffix: false,
  });
  return blob.url;
}

async function saveToLocalDisk(
  studentId: number,
  fileName: string,
  buffer: Buffer
): Promise<string> {
  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "students",
    String(studentId)
  );
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);
  return `/uploads/students/${studentId}/${fileName}`;
}

export async function saveStudentUpload(
  studentId: number,
  category: UploadCategory,
  file: File
): Promise<{ filePath: string; fileName: string }> {
  const validationError = validateUploadFile(category, file);
  if (validationError) {
    throw new Error(validationError);
  }

  const ext = path.extname(file.name) || ".bin";
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "").slice(0, 10);
  const unique = randomBytes(8).toString("hex");
  const fileName = `${category}-${Date.now()}-${unique}${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  if (shouldUseBlobStorage()) {
    const filePath = await saveToBlobStorage(studentId, fileName, buffer, contentType);
    return { filePath, fileName: file.name };
  }

  if (process.env.VERCEL) {
    throw new Error(
      "File uploads are not configured for production. Add Vercel Blob storage to the project and set BLOB_READ_WRITE_TOKEN."
    );
  }

  const filePath = await saveToLocalDisk(studentId, fileName, buffer);
  return { filePath, fileName: file.name };
}
