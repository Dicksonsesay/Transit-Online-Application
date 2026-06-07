import Link from "next/link";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiExternalLink,
  FiShield,
} from "react-icons/fi";
import PublicPageHero from "@/components/public/PublicPageHero";
import {
  ALL_AFFILIATED_PROGRAMMES,
  ALL_COLLEGE_PROGRAMMES,
  ALL_TEVET_PROGRAMMES,
  NJALA_AFFILIATION_INTRO,
  PROGRAMME_CATEGORIES,
  PROGRAMME_LEVEL_LABELS,
  TEVET_ACCREDITATION_INTRO,
  type CollegeProgramme,
} from "@/lib/college-programmes";
import { cn } from "@/lib/utils";

function LevelBadge({ programme }: { programme: CollegeProgramme }) {
  const isNjala = programme.affiliation === "njala";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        isNjala
          ? "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]"
          : "bg-emerald-100 text-emerald-800"
      )}
    >
      {PROGRAMME_LEVEL_LABELS[programme.level]}
    </span>
  );
}

function ProgrammeListItem({ programme }: { programme: CollegeProgramme }) {
  return (
    <li className="flex gap-3 py-3.5 text-sm leading-snug text-[var(--dark-blue)]">
      <FiCheckCircle
        className="mt-0.5 shrink-0 text-emerald-600"
        size={16}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <span className="font-medium">{programme.name}</span>
        <LevelBadge programme={programme} />
      </div>
    </li>
  );
}

export default function ProgramsView() {
  const njalaCount = ALL_AFFILIATED_PROGRAMMES.length;
  const tevetCount = ALL_TEVET_PROGRAMMES.length;
  const categoryCount = PROGRAMME_CATEGORIES.length;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      <PublicPageHero
        blobPosition="both"
        eyebrow={
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--primary-yellow)] ring-1 ring-white/25">
            <FiAward size={14} aria-hidden />
            Njala University &amp; TEVET/NCTVA
          </div>
        }
        title={
          <h1 className="mt-4 max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Programmes offered at Transit College
          </h1>
        }
        description="Transit College Sierra Leone offers degree programmes affiliated with Njala University, and Higher National Diplomas, Diplomas, Teacher Certificates, Higher Teacher Certificates, and other certificate programmes accredited with TEVET/NCTVA."
      >
        <p className="mt-3 text-sm font-medium text-[var(--primary-yellow)]">
          {njalaCount} degree programmes and {tevetCount} TEVET/NCTVA pathways across{" "}
          {categoryCount} areas of study
        </p>
      </PublicPageHero>

      {/* Affiliation notices */}
      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-blue)] text-white">
              <FiCheckCircle size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[var(--primary-blue)]">
                Affiliated with Njala University
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {NJALA_AFFILIATION_INTRO}
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <FiShield size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold text-emerald-800">
                Accredited with TEVET/NCTVA
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                {TEVET_ACCREDITATION_INTRO}
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-[1400px] justify-end">
          <Link
            href="/how-to-apply"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 border-[var(--primary-blue)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-blue)] transition-colors hover:bg-[var(--primary-blue)] hover:text-white"
          >
            How to apply
            <FiExternalLink size={16} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Programme categories */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-blue)]">
              Programme catalogue
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
              Browse by area of study
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600">
              Each field includes Njala University degree options where applicable, plus
              equivalent TEVET/NCTVA diploma, HND, teacher certificate, and certificate
              pathways.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PROGRAMME_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <article
                  key={category.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md",
                    category.accentClass
                  )}
                >
                  <div className="flex items-start gap-4 border-b border-white/60 bg-white/50 px-5 py-4 sm:px-6">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md",
                        category.iconClass
                      )}
                    >
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[var(--primary-blue)]">
                        {category.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-600">{category.description}</p>
                    </div>
                  </div>
                  <ul className="divide-y divide-slate-200/80 bg-white/80 px-5 py-2 sm:px-6">
                    {category.programmes.map((programme) => (
                      <ProgrammeListItem key={programme.name} programme={programme} />
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full lists */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-[var(--dark-blue)]/5 via-white to-[var(--primary-yellow)]/10 px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[var(--primary-blue)] sm:text-2xl">
              Njala University degree programmes
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              All programmes listed below are included in the affiliation approval from
              Njala University.
            </p>
            <ol className="mt-6 space-y-3">
              {ALL_AFFILIATED_PROGRAMMES.map((programme, index) => (
                <li
                  key={programme}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-blue)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="font-medium leading-snug text-[var(--dark-blue)]">
                    {programme}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-emerald-800 sm:text-2xl">
              TEVET/NCTVA programmes
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Higher National Diplomas, Diplomas, Higher Teacher Certificates (Primary
              &amp; Secondary), Teacher Certificates, and certificate programmes
              accredited with TEVET/NCTVA.
            </p>
            <ol className="mt-6 space-y-3">
              {ALL_TEVET_PROGRAMMES.map((programme, index) => (
                <li
                  key={programme.name}
                  className="flex gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium leading-snug text-[var(--dark-blue)]">
                      {programme.name}
                    </span>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {PROGRAMME_LEVEL_LABELS[programme.level]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[1400px] text-center text-sm text-zinc-500">
          {ALL_COLLEGE_PROGRAMMES.length} total programme pathways listed across Njala
          University affiliation and TEVET/NCTVA accreditation.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to apply for a programme?
          </h2>
          <p className="max-w-xl text-white/90">
            Verify your admission PIN and submit your application online. Choose your
            programme level and course of study during enrolment.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/verify-pin"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-6 py-3 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90"
            >
              Start application
              <FiArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/how-to-apply"
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View application steps
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
