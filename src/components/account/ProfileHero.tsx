import type { ReactNode } from "react";
import { FiEdit3 } from "react-icons/fi";
import { formatProfileLabel, getProfileInitials } from "@/lib/profile-display";

type ProfileHeroProps = {
  fullname: string;
  subtitle: string;
  portalLabel: string;
  badges?: { label: string; value: string }[];
  onEdit?: () => void;
  editLabel?: string;
  children?: ReactNode;
};

export default function ProfileHero({
  fullname,
  subtitle,
  portalLabel,
  badges = [],
  onEdit,
  editLabel = "Edit profile",
  children,
}: ProfileHeroProps) {
  const initials = getProfileInitials(fullname) || "?";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#003e91] via-[#1a4fa3] to-[#2563b8] p-6 text-white shadow-md sm:p-8">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" aria-hidden />
      <div className="absolute -bottom-12 right-1/4 h-32 w-32 rounded-full bg-[var(--primary-yellow)]/10" aria-hidden />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold tracking-wide text-white ring-2 ring-white/25 backdrop-blur-sm sm:h-24 sm:w-24 sm:text-3xl"
            aria-hidden
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {portalLabel}
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">{fullname}</h1>
            <p className="mt-1 text-sm text-white/85">{subtitle}</p>
            {badges.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white ring-1 ring-white/25"
                  >
                    {formatProfileLabel(badge.value)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--primary-yellow)] px-5 py-2.5 text-sm font-semibold text-[var(--dark-blue)] shadow-lg transition-opacity hover:opacity-95"
            >
              <FiEdit3 size={16} aria-hidden />
              {editLabel}
            </button>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
