import type { IconType } from "react-icons";
import { FiClock, FiLock, FiSearch, FiShield } from "react-icons/fi";

const features: {
  title: string;
  description: string;
  icon: IconType;
  iconClass: string;
}[] = [
  {
    title: "Secure & Easy",
    description: "PIN-based access",
    icon: FiLock,
    iconClass: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
  },
  {
    title: "24/7 Access",
    description: "Apply anytime",
    icon: FiClock,
    iconClass: "bg-[var(--primary-yellow)]/25 text-[var(--dark-blue)]",
  },
  {
    title: "Track Application",
    description: "Check status online",
    icon: FiSearch,
    iconClass: "bg-[var(--primary-blue)]/10 text-[var(--primary-blue)]",
  },
  {
    title: "Safe & Reliable",
    description: "Your data is protected",
    icon: FiShield,
    iconClass: "bg-[var(--primary-yellow)]/25 text-[var(--dark-blue)]",
  },
];

export default function HomeFeaturesSection() {
  return (
    <section
      id="features"
      className="relative shrink-0 overflow-hidden px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
      aria-labelledby="home-features-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[#0d4a94]"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--primary-yellow)] to-transparent"
        aria-hidden
      />
      <div
        className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[var(--primary-yellow)]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--dark-blue)]/40 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-yellow)]">
            Online admission
          </p>
          <h2
            id="home-features-heading"
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
          >
            Why apply with Transit College
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
            A simple, secure process designed for students across Sierra Leone.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const accentYellow = index % 2 === 1;
            return (
              <li
                key={feature.title}
                className="group flex flex-col items-center rounded-2xl border border-white/15 bg-white/95 px-5 py-8 text-center shadow-lg shadow-black/20 backdrop-blur-sm transition-transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span
                  className={`h-1 w-12 rounded-full ${accentYellow ? "bg-[var(--primary-yellow)]" : "bg-[var(--primary-blue)]"}`}
                  aria-hidden
                />
                <span
                  className={`mt-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-inset ${feature.iconClass} ${accentYellow ? "ring-[var(--primary-yellow)]/40" : "ring-[var(--primary-blue)]/15"}`}
                >
                  <Icon size={26} strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-[var(--primary-blue)] sm:text-lg">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-600">{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
