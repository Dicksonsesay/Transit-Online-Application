import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiExternalLink,
  FiInfo,
} from "react-icons/fi";
import {
  APPLICATION_NOTES,
  GENERAL_ELIGIBILITY,
  PROGRAMME_LEVEL_REQUIREMENTS,
  REQUIRED_DOCUMENTS,
  REQUIREMENT_QUICK_LINKS,
  REQUIREMENT_SECTION_ICONS,
} from "@/lib/admission-requirements";
import { cn } from "@/lib/utils";

export default function RequirementsView() {
  const AcademicIcon = REQUIREMENT_SECTION_ICONS.academic;
  const DocumentsIcon = REQUIREMENT_SECTION_ICONS.documents;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div
          className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-yellow)]">
            Entry criteria
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Admission requirements
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
            Review the academic qualifications, documents, and eligibility criteria for
            degree programmes affiliated with Njala University and TEVET/NCTVA pathways
            at Transit College Sierra Leone before you apply.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/how-to-apply"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-6 py-3 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90"
            >
              How to apply
              <FiArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/90 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              View programmes
            </Link>
          </div>
        </div>
      </section>

      {/* General eligibility */}
      <section className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-blue)] text-white">
              <REQUIREMENT_SECTION_ICONS.general size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
                General eligibility
              </h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                All applicants must satisfy these conditions regardless of programme
                level.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {GENERAL_ELIGIBILITY.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-[var(--primary-blue)]">
                  {block.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-zinc-700">
                      <FiCheckCircle
                        className="mt-0.5 shrink-0 text-emerald-600"
                        size={16}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programme level requirements */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">
              <AcademicIcon size={22} aria-hidden />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
              Requirements by programme level
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-zinc-600">
              Select the level that matches your intended course of study. Diploma
              pathways are available in the same subject areas as affiliated degree
              programmes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {PROGRAMME_LEVEL_REQUIREMENTS.map((item) => (
              <article
                key={item.level}
                className={cn(
                  "overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md",
                  item.accentClass
                )}
              >
                <div className="border-b border-white/60 bg-white/60 px-5 py-4 sm:px-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                    {item.affiliation}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[var(--primary-blue)]">
                    {item.level}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.summary}
                  </p>
                </div>
                <ul className="space-y-3 bg-white/80 px-5 py-4 sm:px-6">
                  {item.requirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex gap-3 text-sm leading-relaxed text-zinc-700"
                    >
                      <FiCheckCircle
                        className="mt-0.5 shrink-0 text-emerald-600"
                        size={16}
                        aria-hidden
                      />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-[var(--dark-blue)]/5 via-white to-[var(--primary-yellow)]/10 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-yellow)] text-[var(--dark-blue)]">
              <DocumentsIcon size={22} aria-hidden />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
                Required documents
              </h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Prepare these before completing your online application. Upload clear
                scans or photos in the Supporting Documents section.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {REQUIRED_DOCUMENTS.map((block) => (
              <article
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-[var(--primary-blue)]">
                  {block.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-zinc-700">
                      <FiCheckCircle
                        className="mt-0.5 shrink-0 text-emerald-600"
                        size={16}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Important notes + quick links */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-5">
          <article className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm lg:col-span-3">
            <div className="flex gap-3">
              <FiInfo className="mt-0.5 shrink-0 text-amber-700" size={22} aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-amber-950">Important notes</h2>
                <ul className="mt-4 space-y-3">
                  {APPLICATION_NOTES.map((note) => (
                    <li
                      key={note}
                      className="text-sm leading-relaxed text-amber-950/90"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-lg font-bold text-[var(--primary-blue)]">
              Next steps
            </h2>
            {REQUIREMENT_QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[var(--primary-blue)]">
                      {link.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-zinc-600">
                      {link.description}
                    </span>
                  </span>
                  <FiExternalLink
                    className="mt-1 shrink-0 text-zinc-400"
                    size={16}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Meet the requirements?
          </h2>
          <p className="max-w-xl text-white/90">
            After paying at the bank and collecting your PIN, verify it here and
            submit your application online when you are ready.
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
