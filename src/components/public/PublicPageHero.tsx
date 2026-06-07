import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PublicPageHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
  blobPosition?: "left" | "right" | "both";
};

export default function PublicPageHero({
  eyebrow,
  title,
  description,
  children,
  blobPosition = "right",
}: PublicPageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
      {blobPosition === "left" || blobPosition === "both" ? (
        <div
          className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
          aria-hidden
        />
      ) : null}
      {blobPosition === "right" || blobPosition === "both" ? (
        <>
          <div
            className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative mx-auto max-w-[1400px]">
        <div className="flex items-start gap-4 sm:gap-6 lg:items-center lg:gap-10">
          <div className="min-w-0 flex-1">
            {eyebrow}
            {typeof title === "string" ? (
              <h1
                className={cn(
                  "max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight",
                  eyebrow ? "mt-2 sm:mt-3" : "",
                )}
              >
                {title}
              </h1>
            ) : (
              title
            )}
            {typeof description === "string" ? (
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg">
                {description}
              </p>
            ) : (
              description
            )}
            {children}
          </div>

          <div className="hidden shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 p-2 shadow-lg backdrop-blur-sm sm:p-2.5 lg:flex">
            <Image
              src="/logos/logo.png"
              alt="Transit College"
              width={128}
              height={128}
              className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24 lg:h-28 lg:w-28"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
