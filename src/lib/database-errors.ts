/** Map Prisma/database errors to user-friendly auth messages. */
export function mapDatabaseAuthError(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const code = "code" in error ? String(error.code) : "";
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  if (code === "P2022" && message.includes("google_id")) {
    return "Google sign-in is not set up in the database yet. Ask your administrator to run: npx prisma migrate deploy";
  }

  if (code === "P1001") {
    return "Cannot reach the database right now. Check your connection and try again.";
  }

  return null;
}
