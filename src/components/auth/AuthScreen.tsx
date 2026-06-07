import Image from "next/image";
import type { ReactNode } from "react";

type AuthScreenProps = {
  children: ReactNode;
  showLogoInHeader?: boolean;
};

/** White card only — blue background & navbar come from auth layout */
export default function AuthScreen({
  children,
  showLogoInHeader = false,
}: AuthScreenProps) {
  return (
    <div className="w-full rounded-2xl bg-white shadow-xl">
      {showLogoInHeader ? (
        <div className="flex items-center gap-3 bg-[var(--primary-yellow)] px-5 py-3">
          <Image
            src="/logos/logo.png"
            alt="Transit College"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
        </div>
      ) : null}
      {children}
    </div>
  );
}
