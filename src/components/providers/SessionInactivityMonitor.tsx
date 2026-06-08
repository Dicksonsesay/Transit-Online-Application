"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { resolveSessionIdleTimeoutMs } from "@/lib/session-config";

const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;
const SESSION_UPDATE_THROTTLE_MS = 60_000;

function isProtectedPortalPath(pathname: string | null) {
  return Boolean(
    pathname?.startsWith("/student") || pathname?.startsWith("/admin")
  );
}

function getSignOutCallbackUrl(pathname: string | null) {
  if (pathname?.startsWith("/admin")) {
    return "/auth/admin/login?reason=session_expired";
  }

  return "/auth/login?reason=session_expired";
}

export default function SessionInactivityMonitor() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastUpdateRef = useRef(0);
  const idleTimeoutMs = resolveSessionIdleTimeoutMs(
    session?.user?.role,
    pathname
  );

  const resetIdleTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void signOut({ callbackUrl: getSignOutCallbackUrl(pathname) });
    }, idleTimeoutMs);
  }, [idleTimeoutMs, pathname]);

  const recordActivity = useCallback(() => {
    resetIdleTimer();

    const now = Date.now();
    if (now - lastUpdateRef.current < SESSION_UPDATE_THROTTLE_MS) {
      return;
    }

    lastUpdateRef.current = now;
    void update();
  }, [resetIdleTimer, update]);

  useEffect(() => {
    if (status !== "authenticated" || !isProtectedPortalPath(pathname)) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    resetIdleTimer();

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, recordActivity, { passive: true });
    }

    function handleVisibilityChange() {
      if (document.visibilityState !== "visible") {
        return;
      }

      void update().then((nextSession) => {
        if (!nextSession?.user?.id) {
          void signOut({ callbackUrl: getSignOutCallbackUrl(pathname) });
          return;
        }

        resetIdleTimer();
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, recordActivity);
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, pathname, recordActivity, resetIdleTimer, update]);

  return null;
}
