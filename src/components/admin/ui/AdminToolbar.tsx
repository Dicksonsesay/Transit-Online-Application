import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";

type AdminToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function AdminToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  children,
  meta,
  className,
}: AdminToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="relative min-w-0 flex-1 sm:max-w-md">
        <FiSearch
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          size={18}
          aria-hidden
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-zinc-200 bg-slate-50/80 py-2.5 pl-10 pr-4 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {meta}
        {children}
      </div>
    </div>
  );
}

type AdminPageIntroProps = {
  title: string;
  description: string;
  icon?: IconType;
  accentClass?: string;
};

export function AdminPageIntro({
  title,
  description,
  icon: Icon,
  accentClass = "from-[var(--hero-blue)] to-[var(--primary-blue)]",
}: AdminPageIntroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br px-5 py-5 text-white shadow-md sm:px-6 sm:py-6",
        accentClass
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[var(--primary-yellow)]/20 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        {Icon ? (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Icon size={22} aria-hidden />
          </span>
        ) : null}
        <div>
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/85">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
