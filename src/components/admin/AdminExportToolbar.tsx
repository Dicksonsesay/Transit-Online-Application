"use client";

import { useState } from "react";
import { FiDownload, FiFileText, FiGrid, FiPrinter } from "react-icons/fi";
import { cn } from "@/lib/utils";

type ExportFormat = "pdf" | "xlsx" | "csv";

type AdminExportToolbarProps = {
  basePath: string;
  query?: Record<string, string | undefined>;
  label?: string;
  compact?: boolean;
  showPrint?: boolean;
};

const exportOptions: {
  format: ExportFormat;
  label: string;
  description: string;
  icon: typeof FiFileText;
}[] = [
  {
    format: "pdf",
    label: "PDF",
    description: "Printable document",
    icon: FiFileText,
  },
  {
    format: "xlsx",
    label: "Excel",
    description: "Spreadsheet download",
    icon: FiGrid,
  },
  {
    format: "csv",
    label: "CSV",
    description: "Comma-separated values",
    icon: FiDownload,
  },
];

function buildExportUrl(
  basePath: string,
  format: ExportFormat,
  query?: Record<string, string | undefined>
) {
  const params = new URLSearchParams({ format });
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) params.set(key, value);
  }
  return `${basePath}?${params.toString()}`;
}

export default function AdminExportToolbar({
  basePath,
  query,
  label = "Export",
  compact = false,
  showPrint = true,
}: AdminExportToolbarProps) {
  const [loading, setLoading] = useState<ExportFormat | "print" | null>(null);

  async function handleExport(format: ExportFormat) {
    setLoading(format);
    try {
      const res = await fetch(buildExportUrl(basePath, format, query));
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `export.${format === "xlsx" ? "xlsx" : format}`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.alert("Could not export. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function handlePrint() {
    setLoading("print");
    try {
      const res = await fetch(buildExportUrl(basePath, "pdf", query));
      if (!res.ok) throw new Error("Print failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.onload = () => printWindow.print();
      }
    } catch {
      window.alert("Could not open print preview. Try downloading the PDF instead.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", compact && "gap-1.5")}>
      {!compact ? (
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          {label}
        </span>
      ) : null}
      {showPrint ? (
        <button
          type="button"
          title="Open PDF and print"
          disabled={loading !== null}
          onClick={() => void handlePrint()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-[var(--primary-blue)] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 sm:px-3 sm:text-sm"
        >
          <FiPrinter size={14} aria-hidden />
          {loading === "print" ? "Opening…" : "Print"}
        </button>
      ) : null}
      {exportOptions.map((option) => {
        const Icon = option.icon;
        const isLoading = loading === option.format;
        return (
          <button
            key={option.format}
            type="button"
            title={option.description}
            disabled={loading !== null}
            onClick={() => void handleExport(option.format)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-[var(--primary-blue)] shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60 sm:px-3 sm:text-sm",
              isLoading && "ring-2 ring-[var(--primary-yellow)]"
            )}
          >
            <Icon size={14} aria-hidden />
            {isLoading ? "Exporting…" : option.label}
          </button>
        );
      })}
    </div>
  );
}

export function openPinReceipt(pinId: number) {
  window.open(`/api/admin/pins/${pinId}/receipt`, "_blank");
}
