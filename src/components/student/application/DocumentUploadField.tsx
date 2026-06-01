"use client";

import { useRef, useState } from "react";
import { FiFile, FiUpload } from "react-icons/fi";
import { showError, showSuccess } from "@/lib/alerts";
import type { UploadedFileMeta } from "@/types/application-form";
import type { UploadCategory } from "@/lib/student-upload";

type DocumentUploadFieldProps = {
  label: string;
  category: UploadCategory;
  required?: boolean;
  value?: UploadedFileMeta;
  onUploaded: (meta: UploadedFileMeta) => void;
};

export default function DocumentUploadField({
  label,
  category,
  required,
  value,
  onUploaded,
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("file", file);

      const res = await fetch("/api/student/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as {
        filePath?: string;
        fileName?: string;
        error?: string;
      };

      if (!res.ok || !data.filePath) {
        await showError("Upload failed", data.error ?? "Could not upload file.");
        return;
      }

      onUploaded({
        filePath: data.filePath,
        fileName: data.fileName ?? file.name,
      });
      await showSuccess("Uploaded", `${label} saved successfully.`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--primary-blue)]">
            {label}
            {required ? <span className="text-red-500"> *</span> : null}
          </p>
          {value ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
              <FiFile size={14} aria-hidden />
              {value.fileName}
            </p>
          ) : (
            <p className="mt-1 text-xs text-zinc-400">PDF, JPG, or PNG (max 8 MB)</p>
          )}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--hero-blue)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            <FiUpload size={16} aria-hidden />
            {uploading ? "Uploading…" : value ? "Replace file" : "Upload file"}
          </button>
        </div>
      </div>
    </div>
  );
}
