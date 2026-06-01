"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiClock,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
} from "react-icons/fi";
import {
  COLLEGE_CONTACT,
  collegeEmailUrl,
  collegePhoneTelUrl,
  collegeWhatsAppUrl,
} from "@/lib/college-contact";
import { DEFAULT_ADMISSION_PIN_AMOUNT } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";

type ContactChannel = {
  title: string;
  description: string;
  value: string;
  href: string;
  external?: boolean;
  icon: IconType;
  accentClass: string;
  iconClass: string;
  cta: string;
};

const channels: ContactChannel[] = [
  {
    title: "Phone",
    description: "Call the admissions office during working hours.",
    value: COLLEGE_CONTACT.phoneDisplay,
    href: collegePhoneTelUrl(),
    icon: FiPhone,
    accentClass: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
    iconClass: "bg-[var(--primary-blue)] text-white",
    cta: "Call now",
  },
  {
    title: "WhatsApp",
    description: "Message us on WhatsApp for quick questions about admission.",
    value: COLLEGE_CONTACT.phoneDisplay,
    href: collegeWhatsAppUrl(
      "Hello, I would like to enquire about admission at Transit College Sierra Leone."
    ),
    external: true,
    icon: FiMessageCircle,
    accentClass: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    iconClass: "bg-emerald-600 text-white",
    cta: "Chat on WhatsApp",
  },
  {
    title: "Email",
    description: "Send detailed enquiries or document requests by email.",
    value: COLLEGE_CONTACT.emailDisplay,
    href: collegeEmailUrl(
      "Admission enquiry – Transit College",
      "Hello,\n\nI would like to enquire about:\n\n"
    ),
    icon: FiMail,
    accentClass: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    iconClass: "bg-amber-500 text-white",
    cta: "Send email",
  },
];

const quickLinks = [
  {
    title: "How to apply",
    description: "Step-by-step guide from bank payment to submission.",
    href: "/how-to-apply",
  },
  {
    title: "Verify your PIN",
    description: "Start your application after paying the admission fee.",
    href: "/auth/verify-pin",
  },
  {
    title: "Programmes",
    description: "Browse Njala and TEVET/NCTVA pathways.",
    href: "/programs",
  },
  {
    title: "Requirements",
    description: "Check entry qualifications before you apply.",
    href: "/requirements",
  },
];

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleEmailEnquiry(e: React.FormEvent) {
    e.preventDefault();
    const body = [
      name.trim() ? `Name: ${name.trim()}` : "",
      email.trim() ? `Reply-to: ${email.trim()}` : "",
      "",
      message.trim() || "(No message provided)",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = collegeEmailUrl(
      `Admission enquiry from ${name.trim() || "prospective student"}`,
      body
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--dark-blue)] via-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div
          className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-[var(--primary-yellow)]/20 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-yellow)]">
            Get in touch
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Contact admissions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            The admissions team at Transit College Sierra Leone is ready to help with
            PINs, applications, programmes, and general admission enquiries.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--primary-blue)] sm:text-3xl">
              Reach us directly
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-zinc-600">
              Choose the channel that works best for you. We aim to respond as soon as
              possible during office hours.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.title}
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "group flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                    channel.accentClass
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-md",
                      channel.iconClass
                    )}
                  >
                    <Icon size={22} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[var(--primary-blue)]">
                    {channel.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                    {channel.description}
                  </p>
                  <p className="mt-4 text-base font-bold text-[var(--dark-blue)]">
                    {channel.value}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--hero-blue)] group-hover:underline">
                    {channel.cta}
                    <FiArrowRight size={16} aria-hidden />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hours & location + form */}
      <section className="border-t border-slate-200 bg-gradient-to-br from-[var(--dark-blue)]/5 via-white to-[var(--primary-yellow)]/10 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2">
          <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <h2 className="text-xl font-bold text-[var(--primary-blue)]">
                Visit &amp; office hours
              </h2>
            </div>
            <div className="space-y-5 p-6">
              <div className="flex gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[var(--primary-blue)]">
                  <FiMapPin size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">
                    {COLLEGE_CONTACT.campus}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {COLLEGE_CONTACT.locationNote}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <FiClock size={18} aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">Office hours</p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {COLLEGE_CONTACT.officeHours}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900 ring-1 ring-blue-100">
                <p className="font-semibold">Admission fee reminder</p>
                <p className="mt-1 text-blue-800/90">
                  Pay {formatCurrency(DEFAULT_ADMISSION_PIN_AMOUNT)} at the bank, collect
                  your PIN, then apply online. PIN and payment questions are handled by
                  admissions.
                </p>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-900/5">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <h2 className="text-xl font-bold text-[var(--primary-blue)]">
                Send an enquiry
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Your email app will open with your message addressed to admissions.
              </p>
            </div>
            <form onSubmit={handleEmailEnquiry} className="space-y-4 p-6">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Your name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-zinc-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Your email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-zinc-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-zinc-200 bg-slate-50/50 px-3 py-2.5 text-sm outline-none focus:border-[var(--primary-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-blue)]/15"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--hero-blue)] px-5 py-3 text-sm font-bold text-white hover:opacity-95"
              >
                <FiSend size={18} aria-hidden />
                Open email to send
              </button>
            </form>
          </article>
        </div>
      </section>

      {/* Quick links */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="text-center text-2xl font-bold text-[var(--primary-blue)]">
            Helpful links
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="font-bold text-[var(--primary-blue)]">{link.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{link.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--hero-blue)]">
                  Learn more
                  <FiArrowRight size={14} aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[var(--hero-blue)] to-[var(--primary-blue)] px-4 py-12 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start your application?
          </h2>
          <p className="max-w-xl text-white/90">
            Verify your admission PIN and complete your application online today.
          </p>
          <Link
            href="/auth/verify-pin"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--primary-yellow)] px-8 py-3.5 text-sm font-bold text-[var(--dark-blue)] hover:opacity-95"
          >
            Verify PIN &amp; apply
            <FiArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
