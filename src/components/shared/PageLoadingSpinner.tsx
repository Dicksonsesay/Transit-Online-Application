import { cn } from "@/lib/utils";

type PageLoadingSpinnerProps = {
  /** Accessible label for screen readers */
  label?: string;
  /** Spinner diameter */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 border-[3px]",
  md: "h-11 w-11 border-4",
  lg: "h-14 w-14 border-4",
};

export default function PageLoadingSpinner({
  label = "Loading",
  size = "md",
  className,
}: PageLoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-[var(--primary-yellow)] border-t-[var(--primary-blue)]",
          sizeClasses[size]
        )}
      />
      <p className="text-sm font-medium text-zinc-600">{label}…</p>
    </div>
  );
}
