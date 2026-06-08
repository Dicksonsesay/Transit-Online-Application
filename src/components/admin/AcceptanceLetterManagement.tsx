"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FiAward,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiMail,
  FiSend,
  FiUsers,
} from "react-icons/fi";
import {
  generateAcceptanceLetterAction,
  sendAcceptanceLetterAction,
} from "@/actions/admin-acceptance-letters";
import { AdminPageIntro, AdminToolbar } from "@/components/admin/ui/AdminToolbar";
import AdminExportToolbar from "@/components/admin/AdminExportToolbar";
import { AdminStatGrid, type AdminStatItem } from "@/components/admin/ui/AdminStatGrid";
import {
  AdminTable,
  AdminTableBody,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableRow,
  AdminTableShell,
  AdminTd,
  AdminTh,
} from "@/components/admin/ui/AdminTable";
import type { AcceptanceLetterCandidate } from "@/lib/admin-acceptance-letters";
import { showError, showSuccess } from "@/lib/alerts";
import { cn, formatDate } from "@/lib/utils";

type AcceptanceLetterManagementProps = {
  applicants: AcceptanceLetterCandidate[];
};

export default function AcceptanceLetterManagement({
  applicants,
}: AcceptanceLetterManagementProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applicants;
    return applicants.filter((item) => {
      return (
        item.studentName.toLowerCase().includes(q) ||
        item.studentEmail.toLowerCase().includes(q) ||
        item.programmeName.toLowerCase().includes(q) ||
        (item.courseName?.toLowerCase().includes(q) ?? false) ||
        (item.applicationNumber?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [applicants, query]);

  const generatedCount = applicants.filter((item) => item.generatedAt).length;
  const sentCount = applicants.filter((item) => item.publishedAt).length;
  const pendingCount = applicants.length - generatedCount;
  const readyToSendCount = applicants.filter(
    (item) => item.generatedAt && !item.publishedAt
  ).length;
  const statCards: AdminStatItem[] = [
    {
      label: "Accepted applicants",
      value: applicants.length,
      helper: "Eligible for offers",
      icon: FiUsers,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white",
      valueClass: "text-blue-800",
    },
    {
      label: "Generated",
      value: generatedCount,
      helper: "Offers prepared",
      icon: FiCheckCircle,
      cardClass: "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
      iconClass: "bg-blue-600 text-white",
      valueClass: "text-blue-800",
    },
    {
      label: "Pending",
      value: pendingCount,
      helper: "Awaiting generation",
      icon: FiFileText,
      cardClass: "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50",
      iconClass: "bg-amber-500 text-white",
      valueClass: "text-amber-700",
    },
    {
      label: "Ready to send",
      value: readyToSendCount,
      helper: "Generated, not yet published",
      icon: FiSend,
      cardClass: "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
      iconClass: "bg-violet-600 text-white",
      valueClass: "text-violet-800",
    },
    {
      label: "Published",
      value: sentCount,
      helper: "Visible to students",
      icon: FiMail,
      cardClass: "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50",
      iconClass: "bg-sky-600 text-white",
      valueClass: "text-sky-800",
    },
  ];

  function handleGenerate(studentId: number) {
    startTransition(async () => {
      const result = await generateAcceptanceLetterAction(studentId);
      if (result.error) {
        await showError("Generation failed", result.error);
        return;
      }
      await showSuccess(
        "Offer generated",
        result.letterReference
          ? `Reference: ${result.letterReference}`
          : "Offer of admission generated successfully."
      );
      router.refresh();
    });
  }

  function handleSend(studentId: number) {
    startTransition(async () => {
      const result = await sendAcceptanceLetterAction(studentId);
      if (result.error) {
        await showError("Send failed", result.error);
        return;
      }
      await showSuccess(
        "Offer sent",
        "The student has been notified by email and can download the offer in their portal."
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageIntro
        icon={FiAward}
        title="Offer of admission desk"
        description="Generate official offers of admission for admitted students and notify them by email and portal message."
        accentClass="from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)]"
      />

      <AdminStatGrid items={statCards} />

      <AdminToolbar
        searchValue={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search by name, email, programme or course…"
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
              {filtered.length} accepted
            </span>
            <AdminExportToolbar compact basePath="/api/admin/offer-admission/export" />
          </div>
        }
      />

      <AdminTableShell
        title="Accepted applicants"
        subtitle="Generate PDF offers and publish to student portals"
        countLabel={`${filtered.length} record${filtered.length === 1 ? "" : "s"}`}
      >
        <AdminTable>
          <AdminTableHead>
            <AdminTh>Applicant</AdminTh>
            <AdminTh>Programme</AdminTh>
            <AdminTh>Course</AdminTh>
            <AdminTh>Year</AdminTh>
            <AdminTh>Offer status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </AdminTableHead>
          <AdminTableBody>
            {filtered.length === 0 ? (
              <AdminTableEmpty
                colSpan={6}
                icon={FiAward}
                title={applicants.length === 0 ? "No accepted applicants" : "No matches"}
                description={
                  applicants.length === 0
                    ? "Accept applicants from the Applicants page to generate offers here."
                    : "Try a different search term."
                }
              />
            ) : (
              filtered.map((item) => (
                <AdminTableRow key={item.studentId} striped>
                  <AdminTd>
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-blue)] to-[var(--hero-blue)] text-xs font-bold text-white">
                        {item.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--primary-blue)]">
                          {item.studentName}
                        </p>
                        <p className="text-xs text-zinc-500">{item.studentEmail}</p>
                        {item.applicationNumber ? (
                          <p className="mt-0.5 font-mono text-[10px] text-zinc-400">
                            {item.applicationNumber}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </AdminTd>
                  <AdminTd className="max-w-[180px]">
                    <p className="text-sm font-medium text-zinc-800">{item.programmeName}</p>
                    <p className="text-xs text-zinc-500">{item.programmeDepartment}</p>
                  </AdminTd>
                  <AdminTd className="max-w-[160px] text-sm text-zinc-700">
                    {item.courseName ?? "—"}
                  </AdminTd>
                  <AdminTd>
                    <span className="inline-flex rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-zinc-700">
                      {item.admissionYear}
                    </span>
                  </AdminTd>
                  <AdminTd>
                    {item.publishedAt ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-2">
                        <p className="text-xs font-bold text-emerald-800">Published</p>
                        <p className="mt-0.5 text-[11px] text-emerald-700/80">
                          Sent {formatDate(item.publishedAt)}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] text-emerald-600">
                          {item.letterReference}
                        </p>
                      </div>
                    ) : item.generatedAt ? (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2">
                        <p className="text-xs font-bold text-blue-800">Generated</p>
                        <p className="mt-0.5 text-[11px] text-blue-700/80">
                          {formatDate(item.generatedAt)}
                        </p>
                        <p className="mt-1 text-[10px] text-blue-700/70">
                          Awaiting send to student
                        </p>
                      </div>
                    ) : (
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200/60">
                        Not generated
                      </span>
                    )}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap justify-end gap-2">
                      {item.generatedAt ? (
                        <a
                          href={`/api/admin/offer-admission/${item.studentId}/pdf?download=1`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-slate-50"
                        >
                          <FiDownload size={13} aria-hidden />
                          PDF
                        </a>
                      ) : null}
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleGenerate(item.studentId)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:opacity-60",
                          item.generatedAt
                            ? "border-zinc-200 text-zinc-700 hover:bg-slate-50"
                            : "border-[var(--hero-blue)] bg-blue-50 text-[var(--hero-blue)] hover:bg-[var(--hero-blue)] hover:text-white"
                        )}
                      >
                        {item.generatedAt ? "Regenerate" : "Generate"}
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleSend(item.studentId)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--hero-blue)] px-3 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
                      >
                        <FiMail size={13} aria-hidden />
                        {item.publishedAt ? "Resend" : "Send to student"}
                      </button>
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
