import Link from "next/link";
import {
  FiAward,
  FiCheckCircle,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiInfo,
} from "react-icons/fi";
import StudentPageHero from "@/components/student/ui/StudentPageHero";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/generated/prisma/client";

type StudentAcceptanceLetterViewProps = {
  studentName: string;
  applicationStatus: ApplicationStatus;
  programmeName: string;
  programmeDepartment: string;
  courseName: string | null;
  admissionYear: string;
  letter: {
    id: number;
    generatedAt: string;
    letterReference: string;
  } | null;
};

function PendingAcceptanceView() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <StudentPageHero
        badge="Acceptance letter"
        icon={FiAward}
        title="Letter not available yet"
        description="Your official acceptance letter will appear here once the admissions office marks your application as accepted and publishes the document."
      />
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="px-6 py-10 text-center sm:px-10">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-[var(--primary-blue)]">
            <FiInfo size={28} aria-hidden />
          </span>
          <h2 className="mt-5 text-xl font-bold text-[var(--primary-blue)]">
            Still under review
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-600">
            Continue checking your portal Messages and email. When you are accepted, you
            will be able to download your letter from this page.
          </p>
          <Link
            href="/student/status"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--hero-blue)] px-6 py-3 text-sm font-bold text-white hover:opacity-95"
          >
            View admission status
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StudentAcceptanceLetterView({
  studentName,
  applicationStatus,
  programmeName,
  programmeDepartment,
  courseName,
  admissionYear,
  letter,
}: StudentAcceptanceLetterViewProps) {
  if (applicationStatus !== "accepted") {
    return <PendingAcceptanceView />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <StudentPageHero
        badge="Congratulations"
        icon={FiAward}
        title="You have been accepted!"
        description="Welcome to Transit College Sierra Leone. Your admission has been confirmed—download your official acceptance letter below."
        accentClass="from-[var(--dark-blue)] via-[var(--hero-blue)] to-[#0d4a94]"
      />

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[var(--primary-yellow)]/15 via-white to-blue-50/50 px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-blue)] text-white shadow-lg">
              <FiCheckCircle size={28} aria-hidden />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
                Admitted student
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[var(--primary-blue)]">
                {studentName}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Admission year {admissionYear}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 sm:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Programme
            </p>
            <p className="mt-2 text-base font-bold text-[var(--primary-blue)]">
              {programmeName}
            </p>
            <p className="mt-1 text-sm text-zinc-600">{programmeDepartment}</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Course of study
            </p>
            <p className="mt-2 text-sm font-bold leading-snug text-[var(--dark-blue)]">
              {courseName ?? "—"}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
              Letter status
            </p>
            {letter ? (
              <>
                <p className="mt-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                  Ready to download
                </p>
                <p className="mt-2 font-mono text-[11px] text-zinc-500">
                  Ref: {letter.letterReference}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Generated {formatDate(letter.generatedAt)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  Being prepared
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                  Your letter is being finalised. Check back soon or watch your email.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:flex-wrap sm:px-8">
          {letter ? (
            <>
              <a
                href="/api/student/acceptance-letter/pdf?download=1"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary-yellow)] px-6 py-3 text-sm font-bold text-[var(--dark-blue)] shadow-sm hover:opacity-95"
              >
                <FiDownload size={18} aria-hidden />
                Download acceptance letter
              </a>
              <a
                href="/api/student/acceptance-letter/pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-[var(--primary-blue)] hover:bg-slate-50"
              >
                <FiExternalLink size={18} aria-hidden />
                Open PDF
              </a>
            </>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-6 py-3 text-sm font-bold text-slate-500"
            >
              <FiDownload size={18} aria-hidden />
              Letter not ready yet
            </button>
          )}
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm text-blue-900">
        <FiFileText className="mt-0.5 shrink-0" size={18} aria-hidden />
        <p>
          Save or print your acceptance letter for registration and official records. Contact
          admissions if any detail needs correction.
        </p>
      </div>
    </div>
  );
}
