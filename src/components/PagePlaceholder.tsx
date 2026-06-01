import Link from "next/link";

type PagePlaceholderProps = {
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
};

export default function PagePlaceholder({
  title,
  description,
  backHref = "/",
  backLabel = "Back to dashboard",
}: PagePlaceholderProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-[var(--primary-blue)]">{title}</h2>
      <p className="mt-2 max-w-2xl text-zinc-600">{description}</p>
      <p className="mt-2 text-sm text-zinc-400">
        This section will be implemented next.
      </p>
      <Link
        href={backHref}
        className="mt-6 inline-flex rounded-lg bg-[var(--hero-blue)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {backLabel}
      </Link>
    </div>
  );
}
