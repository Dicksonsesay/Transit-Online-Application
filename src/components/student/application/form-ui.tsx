import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-slate-50/50 px-3 py-2.5 text-sm text-[var(--dark-blue)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 border-b border-slate-200 pb-4">
      <h2 className="text-lg font-bold text-[var(--primary-blue)] sm:text-xl">
        {children}
      </h2>
    </div>
  );
}

export function Field({
  label,
  children,
  className,
  required,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
      {message}
    </p>
  );
}

export function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-zinc-300 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
      />
      {label}
    </label>
  );
}

export function CheckboxOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-300 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
      />
      {label}
    </label>
  );
}

export function FormActions({
  onPrevious,
  showPrevious,
  pending,
  isLastSection,
}: {
  onPrevious?: () => void;
  showPrevious: boolean;
  pending: boolean;
  isLastSection: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
      {showPrevious && onPrevious ? (
        <button
          type="button"
          onClick={onPrevious}
          disabled={pending}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--primary-blue)] ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
      ) : (
        <span />
      )}
      <button
        type="submit"
        disabled={pending}
        className={cn(
          "rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto",
          isLastSection
            ? "bg-[var(--primary-yellow)] text-[var(--dark-blue)] hover:opacity-95"
            : "bg-[var(--hero-blue)] hover:opacity-95"
        )}
      >
        {pending
          ? "Saving…"
          : isLastSection
            ? "Submit Application"
            : "Save & Continue"}
      </button>
    </div>
  );
}
