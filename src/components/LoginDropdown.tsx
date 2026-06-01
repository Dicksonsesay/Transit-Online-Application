"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogIn, FiShield } from "react-icons/fi";

const loginOptions = [
  {
    href: "/auth/login",
    label: "Student Login",
    description: "Applicants & students",
    icon: FiLogIn,
  },
  {
    href: "/auth/admin/login",
    label: "Admin Login",
    description: "Staff & administrators",
    icon: FiShield,
  },
];

export default function LoginDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-yellow)] px-5 py-2 text-sm font-semibold text-[var(--dark-blue)] transition-opacity hover:opacity-90 sm:gap-2 sm:px-7 sm:py-2.5 sm:text-base"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Login
        <FiChevronDown
          size={18}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[9999] w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-2xl"
        >
          {loginOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link
                key={option.href}
                href={option.href}
                role="menuitem"
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <Icon
                  className="mt-0.5 shrink-0 text-[var(--primary-blue)]"
                  size={18}
                  aria-hidden
                />
                <span>
                  <span className="block text-sm font-semibold text-[var(--primary-blue)]">
                    {option.label}
                  </span>
                  <span className="block text-xs text-zinc-500">
                    {option.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
