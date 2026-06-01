export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/** e.g. 20th June, 2025 */
export function formatDateLong(date: Date | string): string {
  const d = new Date(date);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);

  return `${day}${suffix} ${monthYear}`;
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-SL", {
    style: "currency",
    currency: "SLE",
    minimumFractionDigits: 2,
  }).format(value);
}
