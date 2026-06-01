export function getProfileInitials(fullname: string): string {
  return fullname
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatProfileLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

type StatusTone = "success" | "warning" | "danger" | "neutral" | "info";

export function getAccountStatusTone(status: string): StatusTone {
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "accepted") return "success";
  if (normalized === "pending" || normalized === "under_review") return "warning";
  if (normalized === "inactive" || normalized === "suspended" || normalized === "rejected") {
    return "danger";
  }
  return "neutral";
}

export const statusBadgeStyles: Record<StatusTone, string> = {
  success: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-100 text-amber-800 ring-amber-200",
  danger: "bg-red-100 text-red-800 ring-red-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-blue-100 text-blue-800 ring-blue-200",
};
