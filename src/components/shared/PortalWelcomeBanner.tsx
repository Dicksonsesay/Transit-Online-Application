type PortalWelcomeBannerProps = {
  portalLabel: string;
  dashboardTitle: string;
  userName: string;
  description?: string;
};

export default function PortalWelcomeBanner({
  portalLabel,
  dashboardTitle,
  userName,
  description,
}: PortalWelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-7">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#003e91] via-[#1f5fb8] to-[#f1c40f]" />
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {portalLabel}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[var(--primary-blue)] lg:text-3xl">
        Welcome back,{" "}
        <span className="text-[var(--dark-blue)]">{userName}</span>
      </h1>
      <p className="mt-1 text-sm font-semibold text-[var(--primary-blue)]/80">
        {dashboardTitle}
      </p>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm text-zinc-600 lg:text-base">{description}</p>
      ) : null}
    </section>
  );
}
