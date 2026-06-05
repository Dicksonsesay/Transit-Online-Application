import type { NavItem } from "@/types";

const studentBase = "/student";

export const studentNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Verify PIN", href: "/auth/verify-pin" },
  { label: "Register", href: "/auth/register" },
  { label: "Login", href: "/auth/login" },
  { label: "Dashboard", href: studentBase },
  { label: "Application", href: `${studentBase}/application` },
  { label: "Documents", href: `${studentBase}/documents` },
  { label: "Interview", href: `${studentBase}/interview` },
  { label: "Messages", href: `${studentBase}/messages` },
  { label: "Offer of Admission", href: `${studentBase}/acceptance-letter` },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Applicants", href: "/admin/applicants" },
  { label: "PIN Management", href: "/admin/pins" },
  { label: "Interviews", href: "/admin/interviews" },
  { label: "Offers of Admission", href: "/admin/acceptance-letters" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Settings", href: "/admin/settings" },
];
