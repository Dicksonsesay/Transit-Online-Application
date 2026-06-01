import PageLoadingSpinner from "@/components/shared/PageLoadingSpinner";
import { cn } from "@/lib/utils";

type PageLoadingScreenProps = {
  variant?: "fullscreen" | "embedded" | "auth";
  label?: string;
  className?: string;
};

export default function PageLoadingScreen({
  variant = "embedded",
  label = "Loading",
  className,
}: PageLoadingScreenProps) {
  if (variant === "fullscreen") {
    return (
      <div
        className={cn(
          "flex min-h-dvh w-full items-center justify-center bg-zinc-50",
          className
        )}
      >
        <PageLoadingSpinner label={label} size="lg" />
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div
        className={cn(
          "flex w-full max-w-md flex-col items-center justify-center rounded-2xl bg-white/95 px-8 py-12 shadow-lg",
          className
        )}
      >
        <PageLoadingSpinner label={label} size="md" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[min(24rem,50dvh)] w-full items-center justify-center py-16",
        className
      )}
    >
      <PageLoadingSpinner label={label} size="md" />
    </div>
  );
}
