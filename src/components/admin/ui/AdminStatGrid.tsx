import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export type AdminStatItem = {
  label: string;
  value: number | string;
  helper: string;
  icon: IconType;
  cardClass: string;
  iconClass: string;
  valueClass: string;
};

type AdminStatGridProps = {
  items: AdminStatItem[];
  className?: string;
};

export function AdminStatGrid({ items, className }: AdminStatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5",
        className
      )}
    >
      {items.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.label}
            className={cn(
              "group relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              card.cardClass
            )}
          >
            <div
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl transition-opacity group-hover:opacity-80"
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                  {card.label}
                </p>
                <p className={cn("mt-2 text-3xl font-bold tabular-nums", card.valueClass)}>
                  {card.value}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg ring-1 ring-black/5",
                  card.iconClass
                )}
              >
                <Icon size={18} aria-hidden />
              </span>
            </div>
            <p className="relative mt-3 text-xs leading-relaxed text-zinc-600">
              {card.helper}
            </p>
          </article>
        );
      })}
    </div>
  );
}
