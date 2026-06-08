const ADMIN_ROLES = new Set(["super_admin", "admin", "admissions_officer"]);

function parseIdleMinutes(envValue: string | undefined, defaultMinutes: number) {
  if (!envValue) return defaultMinutes;

  const parsed = Number.parseInt(envValue, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultMinutes;
}

export const STUDENT_SESSION_IDLE_TIMEOUT_MINUTES = parseIdleMinutes(
  process.env.STUDENT_SESSION_IDLE_TIMEOUT_MINUTES,
  45
);
export const ADMIN_SESSION_IDLE_TIMEOUT_MINUTES = parseIdleMinutes(
  process.env.ADMIN_SESSION_IDLE_TIMEOUT_MINUTES,
  15
);

export const SESSION_MAX_AGE = 30 * 24 * 60 * 60;

export function isAdminSessionRole(role?: string) {
  return role ? ADMIN_ROLES.has(role) : false;
}

export function getSessionIdleTimeoutMs(role?: string) {
  const minutes = isAdminSessionRole(role)
    ? ADMIN_SESSION_IDLE_TIMEOUT_MINUTES
    : STUDENT_SESSION_IDLE_TIMEOUT_MINUTES;

  return minutes * 60 * 1000;
}

export function resolveSessionIdleTimeoutMs(
  role: string | undefined,
  pathname: string | null
) {
  if (role) {
    return getSessionIdleTimeoutMs(role);
  }

  if (pathname?.startsWith("/admin")) {
    return getSessionIdleTimeoutMs("admin");
  }

  return getSessionIdleTimeoutMs("student");
}

export function getSessionLastActivity() {
  return Date.now();
}

export function isSessionIdleExpired(
  lastActivity?: number | null,
  role?: string
) {
  if (!lastActivity) return false;
  return Date.now() - lastActivity > getSessionIdleTimeoutMs(role);
}

export function resolveSessionLastActivity(token: {
  lastActivity?: number;
  iat?: number;
}) {
  if (typeof token.lastActivity === "number") {
    return token.lastActivity;
  }

  if (typeof token.iat === "number") {
    return token.iat * 1000;
  }

  return undefined;
}

export const SESSION_EXPIRED_MESSAGE =
  "Your session expired due to inactivity. Please sign in again.";
