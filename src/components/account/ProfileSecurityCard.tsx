import Link from "next/link";
import { FiChevronRight, FiLock, FiShield } from "react-icons/fi";

type ProfileSecurityCardProps = {
  changePasswordHref: string;
};

export default function ProfileSecurityCard({
  changePasswordHref,
}: ProfileSecurityCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
          <FiShield size={18} aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-bold text-[var(--primary-blue)]">Security</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Keep your account secure with a strong, unique password.
          </p>
        </div>
      </div>

      <Link
        href={changePasswordHref}
        className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm font-semibold text-[var(--primary-blue)] transition-colors hover:border-[var(--primary-blue)]/30 hover:bg-white"
      >
        <span className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--primary-blue)] shadow-sm">
            <FiLock size={15} aria-hidden />
          </span>
          Change password
        </span>
        <FiChevronRight size={18} className="shrink-0 text-zinc-400" aria-hidden />
      </Link>
    </article>
  );
}
