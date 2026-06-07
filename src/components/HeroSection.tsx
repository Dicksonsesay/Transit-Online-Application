import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

function ArrowIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e5a800] sm:h-9 sm:w-9">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const HERO_IMAGE = {
  src: "/images/transit-students.png",
  alt: "Transit College students in uniform standing in front of the college logo",
} as const;

const LOGO = {
  src: "/logos/logo.png",
  alt: "Transit College logo",
} as const;

function HeroLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-white/10 p-2 shadow-lg backdrop-blur-sm sm:p-2.5",
        className,
      )}
    >
      <Image
        src={LOGO.src}
        alt={LOGO.alt}
        width={128}
        height={128}
        className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28 lg:h-28 lg:w-28"
        priority
      />
    </div>
  );
}

function HeroButtons({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative z-20 flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3",
        className,
      )}
    >
      <Link
        href="/auth/verify-pin"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary-yellow)] py-2.5 pl-4 pr-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90 sm:w-auto sm:gap-3 sm:py-3 sm:pl-6 sm:pr-3 sm:text-base"
      >
        Start Application
        <ArrowIcon />
      </Link>
      <Link
        href="/student"
        className="inline-flex w-full shrink-0 items-center justify-center rounded-full border-2 border-white px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto sm:px-7 sm:py-3 sm:text-base"
      >
        Check Application
      </Link>
    </div>
  );
}

function HeroContent({
  className,
  showButtons = true,
}: {
  className?: string;
  showButtons?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-1 flex-col", className)}>
      <p className="text-sm font-medium tracking-wide text-white/90 sm:text-lg">
        WELCOME TO
      </p>
      <h1 className="mt-0.5 text-[1.65rem] font-extrabold leading-[1.05] text-[var(--primary-yellow)] sm:text-4xl xl:text-5xl">
        TRANSIT COLLEGE
      </h1>
      <h2 className="text-[1.65rem] font-extrabold leading-[1.05] text-white sm:text-4xl xl:text-5xl">
        SIERRA LEONE
      </h2>

      <div className="mt-2.5 h-1 w-20 rounded-full bg-[var(--primary-yellow)] sm:mt-3 sm:w-24" />

      <p className="mt-2.5 text-base font-semibold text-[var(--primary-yellow)] sm:mt-3 sm:text-xl">
        Transformation For Excellence
      </p>

      <p className="mt-2.5 max-w-md text-[0.8125rem] leading-relaxed text-white/95 sm:mt-3 sm:text-base">
        Apply online for admission into our various programmes. Pay at the
        bank, get your PIN and start your application today.
      </p>

      {showButtons ? (
        <HeroButtons className="mt-4 max-w-xl sm:mt-5" />
      ) : null}
    </div>
  );
}

/** Mobile hero — darkened student photo under text; logo opposite the copy. */
function HeroMobile() {
  return (
    <div className="relative w-full overflow-hidden pb-2 lg:hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE.src}
          alt=""
          fill
          className="object-cover object-[center_72%] brightness-[0.58] saturate-[0.9]"
          sizes="100vw"
          priority
          aria-hidden
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[var(--hero-blue)]/85 via-[var(--dark-blue)]/62 to-[var(--hero-blue)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/18" aria-hidden />

      <div className="relative z-10 px-4 pt-3 sm:px-8 sm:pt-4">
        <div className="flex items-start gap-3 sm:gap-5">
          <HeroContent className="-mt-0.5" showButtons={false} />
          <HeroLogo className="-mt-1 shrink-0 sm:-mt-2" />
        </div>
        <HeroButtons className="mx-auto mt-4 max-w-[17rem] sm:mt-5" />
      </div>
    </div>
  );
}

/** Full-height photo panel on the right (desktop). */
function HeroPhotoDesktop() {
  return (
    <div className="relative hidden overflow-hidden bg-[var(--hero-blue)] lg:block lg:min-h-full">
      <div
        className="pointer-events-none absolute -right-16 top-1/4 z-0 h-72 w-72 rounded-full bg-[var(--primary-yellow)]/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-1/4 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />

      <div className="relative z-[1] flex h-full min-h-[inherit] items-center px-6 py-8 xl:px-10 xl:py-10">
        <div className="group relative aspect-[1024/703] w-full max-h-[min(52vh,480px)] overflow-hidden rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            className="object-cover object-[center_42%] transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 56vw, 0px"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--dark-blue)]/50 via-transparent to-[var(--hero-blue)]/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[var(--hero-blue)]/35 via-transparent to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary-yellow)] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-4 top-4 h-10 w-10 rounded-tl-lg border-l-2 border-t-2 border-[var(--primary-yellow)]/80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 rounded-br-lg border-b-2 border-r-2 border-white/40"
            aria-hidden
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-10 bg-gradient-to-r from-[var(--hero-blue)] to-transparent xl:w-14"
        aria-hidden
      />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--hero-blue)] lg:min-h-[min(62vh,580px)]">
      <HeroMobile />

      <div className="relative z-10 hidden min-h-[inherit] lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:min-h-[min(62vh,580px)]">
        <div className="relative z-20 flex flex-col justify-center px-10 pb-8 pt-6 xl:pl-14 xl:pr-8">
          <HeroContent />
        </div>
        <HeroPhotoDesktop />
      </div>
    </section>
  );
}
