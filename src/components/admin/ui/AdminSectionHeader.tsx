import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminSectionHeaderProps = {
  title: string;
  description?: string;
  icon?: IconType;
  iconClass?: string;
  action?: ReactNode;
  className?: string;
};

export default function AdminSectionHeader({
  title,
  description,
  icon: Icon,
  iconClass = "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
  action,
  className,
}: AdminSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5",
              iconClass
            )}
          >
            <Icon size={18} aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--primary-blue)]">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-sm leading-relaxed text-zinc-500">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
