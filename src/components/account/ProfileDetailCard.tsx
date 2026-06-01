import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export type ProfileDetailItem = {
  label: string;
  value: string;
  icon: IconType;
  iconClass?: string;
  fullWidth?: boolean;
};

type ProfileDetailCardProps = {
  title: string;
  description?: string;
  items: ProfileDetailItem[];
};

export default function ProfileDetailCard({
  title,
  description,
  items,
}: ProfileDetailCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-[var(--primary-blue)]">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
        ) : null}
      </div>
      <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "flex gap-3 bg-white px-5 py-4 sm:px-6",
                item.fullWidth && "sm:col-span-2"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  item.iconClass ?? "bg-slate-100 text-[var(--primary-blue)]"
                )}
              >
                <Icon size={16} aria-hidden />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {item.label}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-[var(--dark-blue)]">
                  {item.value}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </article>
  );
}
