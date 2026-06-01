import { APPLICATION_SECTIONS } from "@/types/application-form";
import { cn } from "@/lib/utils";

type ApplicationProgressProps = {
  currentSection: number;
  onJump?: (sectionId: number) => void;
  maxReachable?: number;
};

export default function ApplicationProgress({
  currentSection,
  onJump,
  maxReachable = currentSection,
}: ApplicationProgressProps) {
  const total = APPLICATION_SECTIONS.length;
  const progressPercent = Math.round((currentSection / total) * 100);
  const currentTitle =
    APPLICATION_SECTIONS.find((s) => s.id === currentSection)?.title ?? "";

  return (
    <nav
      aria-label="Application form progress"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
            Application progress
          </p>
          <p className="mt-1 text-base font-bold text-[var(--primary-blue)] sm:text-lg">
            Section {currentSection} of {total}
          </p>
          <p className="mt-0.5 text-sm text-zinc-600">{currentTitle}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-[var(--primary-blue)]">
            {progressPercent}%
          </p>
          <p className="text-xs text-zinc-500">complete</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-yellow)] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Application completion"
        />
      </div>

      <ol className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {APPLICATION_SECTIONS.map((section) => {
          const isActive = section.id === currentSection;
          const isComplete = section.id < currentSection;
          const canJump = onJump && section.id <= maxReachable;

          const pillClass = cn(
            "shrink-0 rounded-xl px-2.5 py-2 text-center transition-all sm:min-w-[4.5rem]",
            isActive
              ? "bg-[var(--primary-yellow)] text-[var(--dark-blue)] shadow-md shadow-amber-900/10 ring-2 ring-[var(--primary-yellow)]/50"
              : isComplete
                ? "bg-[var(--primary-blue)] text-white hover:opacity-90"
                : "bg-slate-100 text-zinc-500"
          );

          const content = (
            <>
              <span className="block text-xs font-bold">{section.id}</span>
              <span className="mt-0.5 hidden max-w-[5rem] truncate text-[9px] font-semibold uppercase leading-tight sm:block">
                {section.title.split(" ")[0]}
              </span>
            </>
          );

          return (
            <li key={section.id}>
              {canJump ? (
                <button
                  type="button"
                  onClick={() => onJump(section.id)}
                  className={pillClass}
                  title={section.title}
                  aria-current={isActive ? "step" : undefined}
                >
                  {content}
                </button>
              ) : (
                <span
                  className={cn(pillClass, !isActive && !isComplete && "opacity-60")}
                  title={section.title}
                  aria-current={isActive ? "step" : undefined}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
