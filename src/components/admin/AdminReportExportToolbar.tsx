"use client";

import { useState } from "react";
import { FiDownload, FiFileText, FiGrid } from "react-icons/fi";
import { cn } from "@/lib/utils";

type ExportFormat = "pdf" | "xlsx" | "csv";

const exportOptions: {
  format: ExportFormat;
  label: string;
  description: string;
  icon: typeof FiFileText;
}[] = [
  {
    format: "pdf",
    label: "PDF",
    description: "Printable summary report",
    icon: FiFileText,
  },
  {
    format: "xlsx",
    label: "Excel",
    description: "Spreadsheet with multiple sheets",
    icon: FiGrid,
  },
  {
    format: "csv",
    label: "CSV",
    description: "Comma-separated values",
    icon: FiDownload,
  },
];

export default function AdminReportExportToolbar() {
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  async function handleExport(format: ExportFormat) {
    setLoading(format);
    try {
      const res = await fetch(`/api/admin/reports/export?format=${format}`);
      if (!res.ok) {
        throw new Error("Export failed");
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename =
        match?.[1] ?? `transit-admissions-report.${format === "xlsx" ? "xlsx" : format}`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("Could not export the report. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Export
      </span>
      {exportOptions.map((option) => {
        const Icon = option.icon;
        const isLoading = loading === option.format;
        return (
          <button
            key={option.format}
            type="button"
            title={option.description}
            disabled={loading !== null}
            onClick={() => handleExport(option.format)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[var(--primary-blue)] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60",
              isLoading && "ring-2 ring-[var(--primary-yellow)]"
            )}
          >
            <Icon size={15} aria-hidden />
            {isLoading ? "Exporting…" : option.label}
          </button>
        );
      })}
    </div>
  );
}
