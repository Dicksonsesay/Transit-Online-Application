export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type {
  AdminRole,
  AdminStatus,
  PinStatus,
  Gender,
  StudentAccountStatus,
  ProgrammeStatus,
  ApplicationStatus,
  InterviewStatus,
  NotificationType,
} from "@/generated/prisma/client";
