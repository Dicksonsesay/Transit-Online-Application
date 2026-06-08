"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FiCopy, FiDollarSign, FiKey, FiPlus, FiPrinter, FiTrash2, FiUserCheck } from "react-icons/fi";
import AdminExportToolbar, { openPinReceipt } from "@/components/admin/AdminExportToolbar";
import {
  deleteUnusedPinAction,
  generateAdmissionPinAction,
  type GeneratePinState,
} from "@/actions/admin-pins";
import { AdminPageIntro, AdminToolbar } from "@/components/admin/ui/AdminToolbar";
import { AdminStatGrid, type AdminStatItem } from "@/components/admin/ui/AdminStatGrid";
import {
  AdminFilterTabs,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableRow,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui/AdminTable";
import {
  confirmDelete,
  showError,
  showSuccess,
  Swal,
} from "@/lib/alerts";
import { DEFAULT_ADMISSION_PIN_AMOUNT } from "@/lib/constants";
import type { PinRevenueSummary } from "@/lib/admin-export/pin-export";
import type { PinListItem } from "@/lib/admin-pins";
import type { PinStatus } from "@/generated/prisma/client";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type PinManagementProps = {
  pins: PinListItem[];
  stats: { unused: number; used: number; total: number };
  revenue: PinRevenueSummary;
};

type FilterStatus = "all" | PinStatus;

const initialGenerateState: GeneratePinState = {};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function PinManagement({ pins, stats, revenue }: PinManagementProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, startDelete] = useTransition();

  const [generateState, generateAction, generating] = useActionState(
    generateAdmissionPinAction,
    initialGenerateState
  );
  const celebratedPinRef = useRef<string | null>(null);

  const filteredPins = useMemo(() => {
    if (filter === "all") return pins;
    return pins.filter((pin) => pin.status === filter);
  }, [pins, filter]);

  async function handleGenerateSuccess(pinCode: string, pinId?: number) {
    const copyResult = await Swal.fire({
      icon: "success",
      title: "PIN generated",
      html: `<p class="text-sm text-zinc-600 mb-3">Give this PIN to the student after bank payment. They use it at <strong>Verify PIN</strong> to register.</p>
        <p class="font-mono text-2xl font-bold tracking-wide text-[#003e91]">${pinCode}</p>`,
      confirmButtonText: pinId ? "Print receipt" : "Copy PIN",
      showDenyButton: Boolean(pinId),
      denyButtonText: "Copy PIN",
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonColor: "#003e91",
      denyButtonColor: "#059669",
      cancelButtonColor: "#6c757d",
    });

    if (copyResult.isConfirmed && pinId) {
      openPinReceipt(pinId);
    } else if (copyResult.isDenied || (copyResult.isConfirmed && !pinId)) {
      const copied = await copyToClipboard(pinCode);
      if (copied) {
        await showSuccess("Copied", "PIN copied to clipboard.");
      } else {
        await showError("Copy failed", "Please copy the PIN manually.");
      }
    }

    setShowForm(false);
    router.refresh();
  }

  useEffect(() => {
    const pinCode = generateState.pinCode;
    if (!pinCode || generating || celebratedPinRef.current === pinCode) {
      return;
    }
    celebratedPinRef.current = pinCode;
    void handleGenerateSuccess(pinCode, generateState.pinId);
  }, [generateState.pinCode, generateState.pinId, generating]);

  async function handleCopy(pinCode: string) {
    const copied = await copyToClipboard(pinCode);
    if (copied) {
      await showSuccess("Copied", `${pinCode} copied to clipboard.`);
    } else {
      await showError("Copy failed", "Could not copy to clipboard.");
    }
  }

  function handleDelete(pin: PinListItem) {
    startDelete(async () => {
      const result = await confirmDelete(`PIN ${pin.pinCode}`);
      if (!result.isConfirmed) return;

      const response = await deleteUnusedPinAction(pin.id);
      if (response.error) {
        await showError("Cannot delete", response.error);
        return;
      }
      await showSuccess("PIN removed", `${pin.pinCode} has been deleted.`);
      router.refresh();
    });
  }

  const statCards: AdminStatItem[] = [
    {
      label: "Unused PINs",
      value: stats.unused,
      helper: "Available for new students",
      icon: FiKey,
      cardClass: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
      iconClass: "bg-emerald-600 text-white",
      valueClass: "text-emerald-800",
    },
    {
      label: "Used PINs",
      value: stats.used,
      helper: "Redeemed at registration",
      icon: FiUserCheck,
      cardClass: "border-slate-200 bg-gradient-to-br from-slate-50 via-white to-zinc-50",
      iconClass: "bg-slate-600 text-white",
      valueClass: "text-slate-800",
    },
    {
      label: "Total PINs",
      value: stats.total,
      helper: "All PINs in the system",
      icon: FiKey,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white",
      valueClass: "text-blue-800",
    },
    {
      label: "Total collected",
      value: formatCurrency(revenue.totalAmount),
      helper: `${stats.used} used · ${stats.unused} unused`,
      icon: FiDollarSign,
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
      iconClass: "bg-amber-500 text-white",
      valueClass: "text-amber-800",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageIntro
        icon={FiKey}
        title="Admission PIN management"
        description="Generate PINs after bank payments and track which students have registered with each PIN."
        accentClass="from-[var(--dark-blue)] via-[var(--hero-blue)] to-[#0d4a94]"
      />

      <AdminStatGrid items={statCards} className="sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4" />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--primary-blue)]">PIN revenue summary</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Standard admission fee: {formatCurrency(DEFAULT_ADMISSION_PIN_AMOUNT)} per PIN
            </p>
          </div>
          <AdminExportToolbar
            basePath="/api/admin/pins/export"
            query={{ status: filter === "all" ? undefined : filter }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Total value",
              amount: revenue.totalAmount,
              detail: `${revenue.totalPins} PINs`,
            },
            {
              label: "Used (redeemed)",
              amount: revenue.usedAmount,
              detail: `${revenue.usedCount} PINs`,
            },
            {
              label: "Unused (outstanding)",
              amount: revenue.unusedAmount,
              detail: `${revenue.unusedCount} PINs`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--primary-blue)]">
                {formatCurrency(item.amount)}
              </p>
              <p className="text-xs text-zinc-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <AdminFilterTabs
            tabs={[
              { key: "all" as const, label: "All", count: pins.length },
              { key: "unused" as const, label: "Unused", count: stats.unused },
              { key: "used" as const, label: "Used", count: stats.used },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>

        <form action={generateAction}>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:p-5">
            {!showForm ? (
              <input type="hidden" name="amount" value={DEFAULT_ADMISSION_PIN_AMOUNT} />
            ) : null}
            <div className="min-w-[12rem] flex-1 sm:min-w-[14rem]">
              <label
                htmlFor="receiptNumber"
                className="mb-1 block text-xs font-semibold text-zinc-600"
              >
                Receipt No.
              </label>
              <input
                id="receiptNumber"
                name="receiptNumber"
                type="text"
                placeholder="Unique bank receipt number"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm uppercase outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
              />
              <p className="mt-1 text-[11px] text-zinc-500">
                Each receipt number can only be used once in the system.
              </p>
            </div>
            <button
              type="submit"
              disabled={generating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--hero-blue)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
            >
              <FiPlus size={18} aria-hidden />
              {generating ? "Generating…" : "Generate PIN"}
            </button>
            <AdminSecondaryButton type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? "Hide amount" : "Custom amount"}
            </AdminSecondaryButton>
          </div>
        </div>

        {showForm ? (
          <div className="border-t border-slate-100 bg-gradient-to-r from-amber-50/50 to-white px-5 py-4 sm:px-6">
            <label htmlFor="amount" className="mb-1.5 block text-sm font-semibold text-zinc-700">
              Amount (SLE)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              defaultValue={DEFAULT_ADMISSION_PIN_AMOUNT}
              className="max-w-xs rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:ring-2 focus:ring-[var(--primary-blue)]/15"
            />
          </div>
        ) : null}

          {generateState.error ? (
            <p className="border-t border-slate-100 px-5 py-3 text-sm font-medium text-red-600" role="alert">
              {generateState.error}
            </p>
          ) : null}
        </form>
      </div>

      <AdminTableShell
        title="PIN register"
        subtitle="Receipt numbers, PIN codes, student usage, and payment amounts"
        countLabel={`${filteredPins.length} PIN${filteredPins.length === 1 ? "" : "s"}`}
      >
        <AdminTable className="min-w-[72rem]">
          <AdminTableHead>
            <AdminTh>Receipt No.</AdminTh>
            <AdminTh>PIN code</AdminTh>
            <AdminTh>Amount</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh>Generated by</AdminTh>
            <AdminTh>Student</AdminTh>
            <AdminTh>Created</AdminTh>
            <AdminTh className="sticky right-0 z-10 min-w-[11rem] bg-slate-100/95 text-right shadow-[-6px_0_12px_-8px_rgba(15,23,42,0.25)]">
              Actions
            </AdminTh>
          </AdminTableHead>
          <AdminTableBody>
            {filteredPins.length === 0 ? (
              <AdminTableEmpty
                colSpan={8}
                icon={FiKey}
                title={filter === "all" ? "No PINs yet" : `No ${filter} PINs`}
                description="Generate a PIN after the student pays the admission fee at the bank."
              />
            ) : (
              filteredPins.map((pin) => (
                <AdminTableRow key={pin.id} striped className="group">
                  <AdminTd>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-zinc-700">
                      {pin.receiptNumber}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    <span className="inline-flex items-center rounded-lg bg-[var(--primary-blue)]/10 px-2.5 py-1.5 font-mono text-sm font-bold tracking-wider text-[var(--primary-blue)]">
                      {pin.pinCode}
                    </span>
                  </AdminTd>
                  <AdminTd className="font-semibold text-zinc-800">
                    {formatCurrency(pin.amount)}
                  </AdminTd>
                  <AdminTd>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                        pin.status === "unused"
                          ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60"
                          : "bg-slate-200 text-slate-700 ring-1 ring-slate-300/60"
                      )}
                    >
                      {pin.status === "unused" ? "Unused" : "Used"}
                    </span>
                  </AdminTd>
                  <AdminTd className="text-sm text-zinc-600">{pin.generatedByName}</AdminTd>
                  <AdminTd className="text-sm text-zinc-600">
                    {pin.usedByStudentName ? (
                      <>
                        <span className="font-medium text-zinc-800">
                          {pin.usedByStudentName}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {pin.usedByStudentEmail}
                        </span>
                      </>
                    ) : (
                      "—"
                    )}
                  </AdminTd>
                  <AdminTd className="text-sm text-zinc-600">
                    {formatDate(pin.createdAt)}
                    {pin.usedAt ? (
                      <span className="mt-0.5 block text-xs text-zinc-400">
                        Used {formatDate(pin.usedAt)}
                      </span>
                    ) : null}
                  </AdminTd>
                  <AdminTd className="sticky right-0 z-10 min-w-[11rem] bg-white shadow-[-6px_0_12px_-8px_rgba(15,23,42,0.12)] group-hover:bg-blue-50/80 even:bg-slate-50/90">
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openPinReceipt(pin.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                        title="Print receipt"
                        aria-label={`Print receipt for ${pin.pinCode}`}
                      >
                        <FiPrinter size={14} aria-hidden />
                        Print
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(pin.pinCode)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[var(--primary-blue)] transition-colors hover:bg-blue-100"
                        title="Copy PIN"
                        aria-label={`Copy ${pin.pinCode}`}
                      >
                        <FiCopy size={14} aria-hidden />
                        Copy
                      </button>
                      {pin.status === "unused" ? (
                        <button
                          type="button"
                          onClick={() => handleDelete(pin)}
                          disabled={pendingDelete}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                          title="Delete unused PIN"
                          aria-label={`Delete ${pin.pinCode}`}
                        >
                          <FiTrash2 size={14} aria-hidden />
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </AdminTd>
                </AdminTableRow>
              ))
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminTableShell>
    </div>
  );
}
