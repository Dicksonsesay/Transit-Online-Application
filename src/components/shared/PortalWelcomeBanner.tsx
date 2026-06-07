type PortalWelcomeBannerProps = {
  portalLabel: string;
  dashboardTitle: string;
  userName: string;
  description?: string;
  /** Optional badge shown on the right (e.g. application number). */
  badge?: { label: string; value: string };
  variant?: "student" | "admin";
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PortalWelcomeBanner({
  portalLabel,
  dashboardTitle,
  userName,
  description,
  badge,
  variant = "student",
}: PortalWelcomeBannerProps) {
  const initials = getInitials(userName);
  const accentClass =
    variant === "admin"
      ? "from-[#001a45] via-[var(--dark-blue)] to-[var(--hero-blue)]"
      : "from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)]";

  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${accentClass} p-5 shadow-[0_18px_40px_-14px_rgba(0,31,84,0.45)] sm:p-6 lg:p-8`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[var(--primary-yellow)]/20 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-white/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[var(--primary-yellow)]/10 blur-xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold text-[var(--primary-yellow)] shadow-inner ring-2 ring-white/20 backdrop-blur-sm sm:h-16 sm:w-16 sm:text-xl">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-yellow)] sm:text-xs">
              {portalLabel}
            </p>
            <h1 className="mt-1.5 text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
              Welcome back,{" "}
              <span className="text-[var(--primary-yellow)]">{userName}</span>
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/85">{dashboardTitle}</p>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70 lg:text-[0.9375rem]">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {badge ? (
          <div className="shrink-0 self-start rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm lg:self-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">
              {badge.label}
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold text-[var(--primary-yellow)] sm:text-base">
              {badge.value}
            </p>
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--primary-yellow)] to-transparent"
        aria-hidden
      />
    </section>
  );
}
