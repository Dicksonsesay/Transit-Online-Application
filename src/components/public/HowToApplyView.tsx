import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiLogIn,
  FiMail,
  FiUserPlus,
} from "react-icons/fi";
import { APPLICATION_SECTIONS } from "@/types/application-form";
import { DEFAULT_ADMISSION_PIN_AMOUNT } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";

type ApplyStep = {
  step: number;
  title: string;
  description: string;
  icon: IconType;
  href?: string;
  linkLabel?: string;
};

const mainSteps: ApplyStep[] = [
  {
    step: 1,
    title: "Pay at the bank and collect your PIN",
    description: `Visit the designated bank and pay the admission fee (typically ${formatCurrency(DEFAULT_ADMISSION_PIN_AMOUNT)}). After payment, the bank will issue your official receipt and unique admission PIN. Keep both safe—you need your PIN to register on the portal.`,
    icon: FiCreditCard,
  },
  {
    step: 2,
    title: "Verify your PIN",
    description:
      "Open the Online Admission Portal and enter the PIN you received at the bank. Successful verification unlocks account registration.",
    icon: FiCheckCircle,
    href: "/auth/verify-pin",
    linkLabel: "Verify PIN now",
  },
  {
    step: 3,
    title: "Create your student account",
    description:
      "Complete the registration form with your personal details, email, and password. Your verified PIN is tied to your new student account.",
    icon: FiUserPlus,
    href: "/auth/register",
    linkLabel: "Register (after PIN verification)",
  },
  {
    step: 4,
    title: "Complete the online application",
    description: `Fill in all ${APPLICATION_SECTIONS.length} sections of the application form. Use Save & Continue to move forward—you can return to earlier sections before final submission.`,
    icon: FiFileText,
    href: "/auth/login",
    linkLabel: "Login to continue application",
  },
  {
    step: 5,
    title: "Submit and track your progress",
    description:
      "Submit your completed application to receive an application number. Use your student dashboard to check status, messages, interview details, and your offer of admission when available.",
    icon: FiLogIn,
    href: "/auth/login",
    linkLabel: "Go to student login",
  },
];

const afterSubmission = [
  {
    title: "Application review",
    description: "Admissions staff review your submitted form and documents.",
    icon: FiFileText,
  },
  {
    title: "Interview",
    description: "If selected, you will receive interview date, time, and venue in your portal.",
    icon: FiCalendar,
  },
  {
    title: "Decision & offer of admission",
    description: "When accepted, your dashboard updates and your official offer of admission becomes available to view or download.",
    icon: FiMail,
  },
];

const documentTypes = [
  "WASSCE results / testimonial",
  "Birth certificate",
  "National ID",
  "Passport photograph",
  "Other supporting documents (as applicable)",
];

export default function HowToApplyView() {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div
          className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-yellow)]">
            Admissions guide
          </p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            How to apply online
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Follow these steps to move from bank payment and PIN collection to a submitted
            application on the Transit College Online Admission Portal—secure,
            PIN-based, and available 24/7.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/verify-pin"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-6 py-3 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90"
            >
              Start with PIN verification
              <FiArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/90 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Already registered? Login
            </Link>
          </div>
        </div>
      </section>

      {/* Main steps */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
              Application steps
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-zinc-600">
              Work through each step in order. Pay at the bank, collect your PIN there,
              then verify it online before creating your account.
            </p>
          </div>

          <ol className="space-y-5">
            {mainSteps.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === mainSteps.length - 1;
              return (
                <li
                  key={item.step}
                  className="relative flex gap-4 sm:gap-6"
                >
                  {!isLast ? (
                    <span
                      className="absolute left-6 top-14 hidden h-[calc(100%+1.25rem)] w-0.5 bg-gradient-to-b from-[var(--primary-blue)] to-[var(--primary-yellow)] sm:block"
                      aria-hidden
                    />
                  ) : null}
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-blue)] text-lg font-bold text-white shadow-md shadow-blue-900/20">
                    {item.step}
                  </span>
                  <article className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-yellow)]/25 text-[var(--dark-blue)]">
                          <Icon size={22} aria-hidden />
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-[var(--primary-blue)]">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {item.href && item.linkLabel ? (
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--hero-blue)] hover:underline"
                      >
                        {item.linkLabel}
                        <FiArrowRight size={16} aria-hidden />
                      </Link>
                    ) : null}
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Application sections + documents */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-[var(--dark-blue)]/5 via-white to-[var(--primary-yellow)]/10 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--primary-blue)]">
              What you will complete online
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              The application form has {APPLICATION_SECTIONS.length} sections. Prepare
              your details and documents before you begin.
            </p>
            <ul className="mt-5 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm text-zinc-700">
              {APPLICATION_SECTIONS.map((section) => (
                <li
                  key={section.id}
                  className="flex gap-2 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="font-semibold text-[var(--primary-blue)]">
                    {section.id}.
                  </span>
                  <span>{section.title}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--primary-blue)]">
              Documents to prepare
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Upload clear scans or photos where requested in the Supporting Documents
              section.
            </p>
            <ul className="mt-5 space-y-3">
              {documentTypes.map((doc) => (
                <li
                  key={doc}
                  className="flex items-start gap-3 text-sm text-zinc-700"
                >
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-emerald-600"
                    size={18}
                    aria-hidden
                  />
                  {doc}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-200">
              <strong className="font-semibold">Tip:</strong> Save your progress as you
              go. You can log out and return later from the student portal before you
              submit.
            </p>
          </article>
        </div>
      </section>

      {/* After submission */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--primary-blue)]">
              After you submit
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-zinc-600">
              Track everything from your student dashboard—no need to visit the office
              for routine status updates.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3">
            {afterSubmission.map((item, i) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className={cn(
                    "rounded-2xl border p-6 text-center shadow-sm",
                    i === 1
                      ? "border-[var(--primary-yellow)]/40 bg-[var(--primary-yellow)]/10"
                      : "border-slate-200 bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl",
                      i === 1
                        ? "bg-[var(--primary-yellow)] text-[var(--dark-blue)]"
                        : "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]"
                    )}
                  >
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold text-[var(--primary-blue)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-r from-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to begin?
          </h2>
          <p className="max-w-xl text-white/90">
            Verify your PIN from the bank, create your account, and complete your
            application today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/verify-pin"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-6 py-3 text-sm font-semibold text-[var(--dark-blue)] hover:opacity-90"
            >
              Verify PIN
              <FiArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
