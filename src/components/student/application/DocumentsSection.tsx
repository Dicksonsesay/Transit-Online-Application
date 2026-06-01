"use client";

import { FiTrash2 } from "react-icons/fi";
import DocumentUploadField from "@/components/student/application/DocumentUploadField";
import { SectionTitle } from "@/components/student/application/form-ui";
import type { ApplicationDocuments, UploadedFileMeta } from "@/types/application-form";

type DocumentsSectionProps = {
  data: ApplicationDocuments;
  onChange: (data: ApplicationDocuments) => void;
};

export default function DocumentsSection({ data, onChange }: DocumentsSectionProps) {
  const setSlot = (
    key: "wassce" | "birthCertificate" | "nationalId",
    meta: UploadedFileMeta
  ) => onChange({ ...data, [key]: meta });

  const otherFiles = data.other ?? [];

  return (
    <div className="space-y-5">
      <SectionTitle>Supporting Documents</SectionTitle>
      <p className="text-sm text-zinc-600">
        Upload clear copies of your documents. Required items are marked with an
        asterisk.
      </p>

      <DocumentUploadField
        label="WASSCE / Testimonial"
        category="wassce"
        required
        value={data.wassce}
        onUploaded={(meta) => setSlot("wassce", meta)}
      />

      <DocumentUploadField
        label="Birth Certificate"
        category="birth_certificate"
        required
        value={data.birthCertificate}
        onUploaded={(meta) => setSlot("birthCertificate", meta)}
      />

      <DocumentUploadField
        label="National ID"
        category="national_id"
        required
        value={data.nationalId}
        onUploaded={(meta) => setSlot("nationalId", meta)}
      />

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[var(--primary-blue)]">
          Other relevant documents
        </p>
        {otherFiles.map((file, index) => (
          <div
            key={`${file.filePath}-${index}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
          >
            <span className="truncate text-zinc-700">{file.fileName}</span>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  other: otherFiles.filter((_, i) => i !== index),
                })
              }
              className="shrink-0 text-red-600 hover:text-red-700"
              aria-label="Remove document"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
        <DocumentUploadField
          label="Add another document"
          category="other"
          onUploaded={(meta) =>
            onChange({ ...data, other: [...otherFiles, meta] })
          }
        />
        {otherFiles.length === 0 ? (
          <p className="text-xs text-zinc-400">
            Optional — certificates, references, or other supporting files.
          </p>
        ) : null}
      </div>
    </div>
  );
}
