import Image from "next/image";
import Link from "next/link";

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

function HeroPhotoMobile() {
  return (
    <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/20 shadow-lg shadow-black/25 sm:mt-5 sm:aspect-[5/3] lg:hidden">
      <Image
        src={HERO_IMAGE.src}
        alt={HERO_IMAGE.alt}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 0px"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--hero-blue)]/30 via-transparent to-transparent"
        aria-hidden
      />
    </div>
  );
}

/** Full-height photo panel on the right (desktop). */
function HeroPhotoDesktop() {
  return (
    <div className="relative hidden min-h-[280px] overflow-hidden bg-[#e8a317] lg:block lg:min-h-full">
      <div className="absolute inset-y-0 inset-x-2 sm:inset-x-3 lg:inset-x-4">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          className="object-contain object-center"
          sizes="(min-width: 1024px) 56vw, 0px"
          priority
        />
      </div>
      {/* Thin edge fade only — does not cover the students */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-6 bg-gradient-to-r from-[var(--hero-blue)]/90 to-transparent lg:w-8"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-4 bg-gradient-to-l from-[#c9890f]/80 to-transparent lg:w-6"
        aria-hidden
      />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-[min(52vh,520px)] overflow-hidden bg-[var(--hero-blue)] lg:min-h-[min(68vh,620px)]">
      <div className="relative z-10 grid min-h-[inherit] lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
        <div className="relative z-20 flex flex-col justify-center px-5 py-6 sm:px-8 lg:px-10 lg:py-10 xl:pl-14 xl:pr-8">
          <p className="text-base font-medium tracking-wide text-white sm:text-lg">
            WELCOME TO
          </p>
          <h1 className="mt-0.5 text-2xl font-extrabold leading-[1.08] text-[var(--primary-yellow)] sm:text-4xl xl:text-5xl">
            TRANSIT COLLEGE
          </h1>
          <h2 className="text-2xl font-extrabold leading-[1.08] text-white sm:text-4xl xl:text-5xl">
            SIERRA LEONE
          </h2>

          <div className="mt-3 h-1 w-24 rounded-full bg-[var(--primary-yellow)]" />

          <p className="mt-3 text-lg font-semibold text-[var(--primary-yellow)] sm:text-xl">
            Transformation For Excellence
          </p>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/95 sm:text-base">
            Apply online for admission into our various programmes. Pay at the
            bank, get your PIN and start your application today.
          </p>

          <HeroPhotoMobile />

          <div className="relative z-20 mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/auth/verify-pin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary-yellow)] py-2.5 pl-5 pr-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90 sm:gap-3 sm:py-3 sm:pl-6 sm:pr-3 sm:text-base"
            >
              Start Application
              <ArrowIcon />
            </Link>
            <Link
              href="/student"
              className="inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-7 sm:py-3 sm:text-base"
            >
              Check Application
            </Link>
          </div>
        </div>

        <HeroPhotoDesktop />
      </div>
    </section>
  );
}
