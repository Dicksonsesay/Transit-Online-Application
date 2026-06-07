/** Official admissions contact details for Transit College Sierra Leone. */
export const COLLEGE_CONTACT = {
  phoneDisplay: "+232 72 197 975",
  phoneE164: "+23272197975",
  email: "admission.transit@gmail.com",
  emailDisplay: "admission.transit@gmail.com",
  whatsappNumber: "23272197975",
  officeHours: "Monday – Friday, 8:00 AM – 4:00 PM",
  campus: "Transit College Sierra Leone",
  address: "1 Wonder Drive Old Pampana, Magburaka Tonkolili District",
  locationNote: "Visit the admissions office on campus during office hours for in-person support.",
} as const;

export function collegePhoneTelUrl(): string {
  return `tel:${COLLEGE_CONTACT.phoneE164.replace(/\s/g, "")}`;
}

export function collegeWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${COLLEGE_CONTACT.whatsappNumber}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function collegeEmailUrl(subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject?.trim()) params.set("subject", subject.trim());
  if (body?.trim()) params.set("body", body.trim());
  const query = params.toString();
  return `mailto:${COLLEGE_CONTACT.email}${query ? `?${query}` : ""}`;
}
