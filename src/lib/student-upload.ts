import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

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

  const dir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "students",
    String(studentId)
  );
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const absolutePath = path.join(dir, fileName);
  await writeFile(absolutePath, buffer);

  const publicPath = `/uploads/students/${studentId}/${fileName}`;
  return { filePath: publicPath, fileName: file.name };
}
