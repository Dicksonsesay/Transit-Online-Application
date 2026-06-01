/** Date-only helpers (no timezone shift on calendar days). */

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})/;

export function parseCalendarDateParts(
  value: Date | string
): { year: number; month: number; day: number } {
  if (typeof value === "string") {
    const match = value.match(DATE_ONLY_RE);
    if (match) {
      return {
        year: Number(match[1]),
        month: Number(match[2]),
        day: Number(match[3]),
      };
    }
  }

  const d = typeof value === "string" ? new Date(value) : value;
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Parse HTML date input (YYYY-MM-DD) for database storage. */
export function parseCalendarDateInput(dateStr: string): Date {
  const match = dateStr.trim().match(DATE_ONLY_RE);
  if (!match) {
    return new Date(Number.NaN);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
}

/** Parse HTML time input (HH:mm) for database storage. */
export function parseCalendarTimeInput(timeStr: string): Date {
  const [hours, minutes] = timeStr.trim().split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return new Date(Number.NaN);
  }
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

export function toCalendarDateString(date: Date): string {
  const { year, month, day } = parseCalendarDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function ordinalSuffix(day: number): string {
  if (day % 10 === 1 && day !== 11) return "st";
  if (day % 10 === 2 && day !== 12) return "nd";
  if (day % 10 === 3 && day !== 13) return "rd";
  return "th";
}

/** e.g. 28th May, 2026 — always uses the calendar day stored, not local TZ. */
export function formatCalendarDateLong(value: Date | string): string {
  const { year, month, day } = parseCalendarDateParts(value);
  const monthYear = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  return `${day}${ordinalSuffix(day)} ${monthYear}`;
}

export function formatCalendarDateShort(value: Date | string): string {
  const { year, month, day } = parseCalendarDateParts(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatCalendarTime(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}
