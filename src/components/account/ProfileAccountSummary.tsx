import { FiCalendar } from "react-icons/fi";
import ProfileStatusBadge from "@/components/account/ProfileStatusBadge";
import { formatProfileLabel } from "@/lib/profile-display";

type ProfileAccountSummaryProps = {
  items: { label: string; value: string; showBadge?: boolean }[];
  memberSince: string;
};

export default function ProfileAccountSummary({
  items,
  memberSince,
}: ProfileAccountSummaryProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-[var(--primary-blue)]">Account</h2>
      <p className="mt-0.5 text-sm text-zinc-500">Membership and access details</p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="text-sm text-zinc-500">{item.label}</span>
            {item.showBadge ? (
              <ProfileStatusBadge status={item.value} />
            ) : (
              <span className="text-right text-sm font-semibold text-[var(--dark-blue)]">
                {formatProfileLabel(item.value)}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-zinc-600">
        <FiCalendar size={14} className="shrink-0 text-[var(--primary-blue)]" aria-hidden />
        <span>
          Member since <strong className="text-[var(--dark-blue)]">{memberSince}</strong>
        </span>
      </div>
    </article>
  );
}
