"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginDropdown from "@/components/LoginDropdown";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home", match: "home" as const },
  { href: "/how-to-apply", label: "How to Apply", match: "path" as const },
  { href: "/programs", label: "Programs", match: "path" as const },
  { href: "/requirements", label: "Requirements", match: "path" as const },
  { href: "/contact", label: "Contact Us", match: "path" as const },
];

function isNavActive(
  link: (typeof navLinks)[number],
  pathname: string
): boolean {
  if (link.match === "home") {
    return pathname === "/";
  }
  return pathname === link.href;
}

function navLinkClassName(active: boolean, mobile = false) {
  return cn(
    "whitespace-nowrap text-sm font-medium transition-colors",
    !mobile && "lg:text-[15px]",
    active
      ? "rounded-md bg-[var(--primary-yellow)] px-2.5 py-1 font-semibold text-[var(--dark-blue)] shadow-sm ring-1 ring-[var(--primary-yellow)]/80"
      : "text-[var(--primary-blue)] hover:text-[var(--dark-blue)]"
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] overflow-visible border-b border-slate-200/80 bg-white shadow-sm">
        <div className="relative z-[100] mx-auto flex min-h-[72px] max-w-[1400px] items-center justify-between gap-3 overflow-visible px-4 py-2 sm:gap-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Image
              src="/logos/logo.png"
              alt="Transit College logo"
              width={48}
              height={48}
              className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
              priority
            />
            <span className="min-w-0">
              <span className="block truncate text-xs font-bold leading-tight text-[var(--primary-blue)] sm:text-sm lg:text-base xl:text-lg">
                TRANSIT COLLEGE SIERRA LEONE
              </span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[11px]">
                Online Admission Portal
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-4 md:flex lg:gap-6"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const active = isNavActive(link, pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLinkClassName(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <LoginDropdown />
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 rounded-full bg-[var(--primary-yellow)] px-5 py-2 text-sm font-semibold text-[var(--dark-blue)] md:hidden"
          >
            Login
          </Link>
        </div>

        <nav
          className="flex items-center gap-3 overflow-x-auto border-t border-slate-100 px-4 py-2.5 md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const active = isNavActive(link, pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={navLinkClassName(active, true)}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="text-zinc-300" aria-hidden>
            |
          </span>
          <Link
            href="/auth/login"
            className="whitespace-nowrap text-sm font-medium text-[var(--primary-blue)]"
          >
            Student Login
          </Link>
          <Link
            href="/auth/admin/login"
            className="whitespace-nowrap text-sm font-medium text-[var(--primary-blue)]"
          >
            Admin Login
          </Link>
        </nav>
      </header>
      <div
        aria-hidden
        className="pointer-events-none h-[8.75rem] shrink-0 md:h-[5.25rem]"
      />
    </>
  );
}
