"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import SessionInactivityMonitor from "@/components/providers/SessionInactivityMonitor";
import { getSessionIdleTimeoutMs } from "@/lib/session-config";

const SESSION_REFETCH_INTERVAL_MS = Math.min(
  5 * 60_000,
  Math.max(60_000, Math.floor(getSessionIdleTimeoutMs("admin") / 2))
);

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={SESSION_REFETCH_INTERVAL_MS}>
      <SessionInactivityMonitor />
      {children}
    </NextAuthSessionProvider>
  );
}
