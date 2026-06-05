import { FiCheck } from "react-icons/fi";
import type { AdmissionProgressStepView } from "@/lib/application-progress";
import { cn, formatDate } from "@/lib/utils";

type ApplicationStatusProgressProps = {
  steps: AdmissionProgressStepView[];
};

export default function ApplicationStatusProgress({
  steps,
}: ApplicationStatusProgressProps) {
  const currentIndex = steps.findIndex((s) => s.state === "current");
  const activeIndex = currentIndex >= 0 ? currentIndex : steps.length - 1;

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      aria-label="Application progress"
    >
      <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--primary-blue)]">
        Application Progress
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Track your application from submission through interview, acceptance, and
        your official offer of admission.
      </p>

      <ol className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        {steps.map((step, index) => {
          const isComplete = step.state === "complete";
          const isCurrent = step.state === "current";
          const connectorComplete = index < activeIndex;

          return (
            <li
              key={step.id}
              className="relative flex flex-1 flex-col items-center text-center sm:min-w-0"
            >
              {index > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-1/2 top-5 hidden h-0.5 w-full -translate-y-1/2 sm:block",
                    connectorComplete
                      ? "bg-emerald-500"
                      : index === activeIndex
                        ? "bg-gradient-to-r from-emerald-500 to-violet-600"
                        : "bg-slate-200"
                  )}
                  style={{ width: "calc(100% - 2.5rem)", left: "calc(-50% + 1.25rem)" }}
                />
              ) : null}

              <span
                className={cn(
                  "relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm",
                  isComplete && "bg-emerald-500",
                  isCurrent && "bg-violet-600 ring-4 ring-violet-100",
                  !isComplete && !isCurrent && "bg-slate-300 text-slate-600"
                )}
              >
                {isComplete ? (
                  <FiCheck size={18} aria-hidden />
                ) : (
                  <span aria-hidden>{index + 1}</span>
                )}
              </span>

              <span className="mt-3 block text-sm font-semibold text-[var(--dark-blue)]">
                {step.displayLabel}
              </span>
              {step.date ? (
                <span className="mt-0.5 block text-xs text-zinc-500">
                  {formatDate(step.date)}
                </span>
              ) : (
                <span className="mt-0.5 block text-xs text-transparent select-none">
                  —
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
