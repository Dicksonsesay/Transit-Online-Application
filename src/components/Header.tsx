"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiCheckSquare,
  FiFileText,
  FiHome,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";
import LoginDropdown from "@/components/LoginDropdown";
import { cn } from "@/lib/utils";

const navLinks: {
  href: string;
  label: string;
  icon: IconType;
  match: "home" | "path";
}[] = [
  { href: "/", label: "Home", icon: FiHome, match: "home" },
  { href: "/how-to-apply", label: "How to Apply", icon: FiFileText, match: "path" },
  { href: "/programs", label: "Programmes", icon: FiBookOpen, match: "path" },
  { href: "/requirements", label: "Requirements", icon: FiCheckSquare, match: "path" },
  { href: "/contact", label: "Contact Us", icon: FiMail, match: "path" },
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

function mobileNavLinkClassName(active: boolean) {
  return cn(
    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
    active
      ? "bg-[var(--primary-yellow)]/20 font-semibold text-[var(--dark-blue)]"
      : "text-[var(--primary-blue)] hover:bg-slate-50 hover:text-[var(--dark-blue)]"
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(event.target as Node)
      ) {
        setMobileNavOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileNavOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileNavOpen]);

  return (
    <>
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[90] bg-black/40 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <header className="fixed top-0 left-0 right-0 z-[100] overflow-visible border-b border-slate-200/80 bg-white shadow-sm">
        <div className="relative z-[100] mx-auto flex min-h-[72px] max-w-[1400px] items-center justify-between gap-3 overflow-visible px-4 py-2 sm:gap-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div ref={mobileNavRef} className="relative shrink-0 md:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--primary-blue)] transition-colors hover:bg-slate-100 hover:text-[var(--dark-blue)]"
                aria-expanded={mobileNavOpen}
                aria-haspopup="menu"
                aria-label={
                  mobileNavOpen ? "Close navigation menu" : "Open navigation menu"
                }
              >
                {mobileNavOpen ? (
                  <FiX size={22} aria-hidden />
                ) : (
                  <FiMenu size={22} aria-hidden />
                )}
              </button>

              {mobileNavOpen ? (
                <nav
                  role="menu"
                  aria-label="Mobile navigation"
                  className="absolute left-0 top-[calc(100%+0.5rem)] z-[9999] w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
                >
                  {navLinks.map((link) => {
                    const active = isNavActive(link, pathname);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        className={mobileNavLinkClassName(active)}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Icon size={18} className="shrink-0" aria-hidden />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              ) : null}
            </div>

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
          </div>

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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LoginDropdown />
          </div>
        </div>
      </header>
      <div
        aria-hidden
        className="pointer-events-none h-[5.25rem] shrink-0"
      />
    </>
  );
}
