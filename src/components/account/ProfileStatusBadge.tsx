import {
  formatProfileLabel,
  getAccountStatusTone,
  statusBadgeStyles,
} from "@/lib/profile-display";
import { cn } from "@/lib/utils";

type ProfileStatusBadgeProps = {
  status: string;
  className?: string;
};

export default function ProfileStatusBadge({
  status,
  className,
}: ProfileStatusBadgeProps) {
  const tone = getAccountStatusTone(status);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        statusBadgeStyles[tone],
        className
      )}
    >
      {formatProfileLabel(status)}
    </span>
  );
}
