import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

type StudentPageHeroProps = {
  badge?: string;
  title: string;
  description: string;
  icon?: IconType;
  accentClass?: string;
  children?: ReactNode;
};

export default function StudentPageHero({
  badge,
  title,
  description,
  icon: Icon,
  accentClass = "from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)]",
  children,
}: StudentPageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10",
        accentClass
      )}
    >
      <div
        className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-[var(--primary-yellow)]/25 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        {badge ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary-yellow)] ring-1 ring-white/20">
            {Icon ? <Icon size={14} aria-hidden /> : null}
            {badge}
          </span>
        ) : null}
        <h1 className={cn("text-2xl font-bold sm:text-3xl", badge ? "mt-4" : "")}>
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}
