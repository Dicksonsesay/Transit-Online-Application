import Image from "next/image";
import Link from "next/link";
import { FiMail, FiMessageCircle, FiPhone } from "react-icons/fi";
import {
  COLLEGE_CONTACT,
  collegeEmailUrl,
  collegePhoneTelUrl,
  collegeWhatsAppUrl,
} from "@/lib/college-contact";

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-white/10 bg-[var(--dark-blue)] text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Image
              src="/logos/logo.png"
              alt="Transit College"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold text-[var(--primary-yellow)]">
                Transit College Sierra Leone
              </p>
              <p className="mt-1 text-xs text-white/65">Transformation For Excellence</p>
              <p className="mt-3 text-xs leading-relaxed text-white/55">
                Online admission portal for degree and TEVET/NCTVA programmes.
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary-yellow)]">
              Contact
            </p>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <a
                  href={collegePhoneTelUrl()}
                  className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white"
                >
                  <FiPhone size={15} aria-hidden />
                  {COLLEGE_CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={collegeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white"
                >
                  <FiMessageCircle size={15} aria-hidden />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={collegeEmailUrl()}
                  className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white"
                >
                  <FiMail size={15} aria-hidden />
                  {COLLEGE_CONTACT.emailDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary-yellow)]">
              Quick links
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/how-to-apply" className="text-white/85 hover:text-white">
                  How to apply
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-white/85 hover:text-white">
                  Programmes
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="text-white/85 hover:text-white">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-semibold text-[var(--primary-yellow)] hover:underline">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Transit College Sierra Leone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
