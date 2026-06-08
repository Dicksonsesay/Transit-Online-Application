import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

type AdminTableShellProps = {
  title?: string;
  subtitle?: string;
  countLabel?: string;
  children: ReactNode;
  className?: string;
};

export function AdminTableShell({
  title,
  subtitle,
  countLabel,
  children,
  className,
}: AdminTableShellProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/[0.04]",
        className
      )}
    >
      {title ? (
        <div className="flex flex-col gap-1 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--primary-blue)]">{title}</h3>
            {subtitle ? (
              <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
            ) : null}
          </div>
          {countLabel ? (
            <span className="inline-flex w-fit rounded-full bg-[var(--primary-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary-blue)] ring-1 ring-[var(--primary-blue)]/10">
              {countLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <table className="min-w-full text-left text-sm">
      {children}
    </table>
  );
}

export function AdminTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-100/90 via-slate-50 to-blue-50/40 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100/90">{children}</tbody>;
}

export function AdminTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-5 py-3.5 font-bold first:pl-5 last:pr-5", className)}>
      {children}
    </th>
  );
}

export function AdminTd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-5 py-4 align-middle first:pl-5 last:pr-5", className)}>
      {children}
    </td>
  );
}

export function AdminTableRow({
  children,
  className,
  striped,
}: {
  children: ReactNode;
  className?: string;
  striped?: boolean;
}) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent",
        striped && "even:bg-slate-50/40",
        className
      )}
    >
      {children}
    </tr>
  );
}

type AdminTableEmptyProps = {
  colSpan: number;
  icon: IconType;
  title: string;
  description: string;
};

export function AdminTableEmpty({
  colSpan,
  icon: Icon,
  title,
  description,
}: AdminTableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-16">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-[var(--primary-blue)]">
            <Icon size={24} aria-hidden />
          </span>
          <p className="mt-4 text-base font-semibold text-zinc-800">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
        </div>
      </td>
    </tr>
  );
}

export function AdminFilterTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            value === tab.key
              ? "bg-[var(--primary-blue)] text-white shadow-md shadow-blue-900/15"
              : "bg-white text-zinc-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-[var(--primary-blue)]"
          )}
        >
          {tab.label}
          {tab.count !== undefined ? (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                value === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-zinc-600"
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

export function AdminPrimaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--hero-blue)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition-all hover:opacity-95 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-slate-50 disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
