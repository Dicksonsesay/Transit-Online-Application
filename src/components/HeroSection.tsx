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

const BLUE_PATH =
  "M 0 0 V 100 H 10 C 36 88, 46 72, 48 50 C 46 28, 36 10, 42 0 H 0 Z";

const YELLOW_PATH =
  "M 10 100 C 36 88, 46 72, 48 50 C 46 28, 36 10, 42 0 L 56 0 C 52 10, 60 28, 59 50 C 58 72, 50 88, 20 100 Z";

const PHOTO_CLIP_PATH =
  "M 0.56 0 C 0.52 0.1, 0.6 0.28, 0.59 0.5 C 0.58 0.72, 0.5 0.88, 0.2 1 L 1 1 L 1 0 Z";

const HERO_IMAGE = {
  src: "/images/transit-students.png",
  alt: "Transit College students in uniform standing in front of the college logo",
} as const;

function HeroCurvedBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <clipPath id="hero-photo-clip" clipPathUnits="objectBoundingBox">
          <path d={PHOTO_CLIP_PATH} />
        </clipPath>
      </defs>
      <path fill="var(--hero-blue)" d={BLUE_PATH} />
      <path fill="#f4b400" d={YELLOW_PATH} />
    </svg>
  );
}

function HeroCampusImageMobile() {
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

export default function HeroSection() {
  return (
    <section className="relative min-h-[min(52vh,520px)] overflow-hidden bg-[var(--hero-blue)] lg:min-h-[min(62vh,580px)]">
      <HeroCurvedBackground />

      <div
        className="absolute inset-0 z-[1] hidden lg:block"
        style={{ clipPath: "url(#hero-photo-clip)" }}
      >
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          className="object-cover object-center"
          sizes="55vw"
          priority
        />
      </div>

      <div className="relative z-20 flex h-full flex-col lg:flex-row">
        <div className="flex h-full w-full flex-col justify-center px-5 py-6 sm:px-8 lg:w-[48%] lg:max-w-[48%] lg:shrink-0 lg:px-10 lg:py-8 xl:pl-14 xl:pr-8">
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

          <HeroCampusImageMobile />

          <div className="mt-5 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/auth/verify-pin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--primary-yellow)] py-2.5 pl-5 pr-2.5 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90 sm:gap-3 sm:py-3 sm:pl-6 sm:pr-3 sm:text-base"
            >
              Start Application
              <ArrowIcon />
            </Link>
            <Link
              href="/student"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:px-7 sm:py-3 sm:text-base"
            >
              Check Application
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-0 flex-1 lg:block" aria-hidden />
      </div>
    </section>
  );
}
