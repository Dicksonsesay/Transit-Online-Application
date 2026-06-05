import type { NotificationType } from "@/generated/prisma/client";

export function getNotificationHref(type: NotificationType): string {
  switch (type) {
    case "interview":
      return "/student/interview";
    case "acceptance":
      return "/student/offer-admission";
    case "rejection":
      return "/student/status";
    case "general":
    default:
      return "/student";
  }
}
