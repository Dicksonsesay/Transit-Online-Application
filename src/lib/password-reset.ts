import { createHash, randomBytes } from "crypto";

const RESET_TOKEN_BYTES = 32;
export const PASSWORD_RESET_EXPIRY_MS = 60 * 60 * 1000;

export function generatePasswordResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(RESET_TOKEN_BYTES).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  return { token, tokenHash };
}

export function hashPasswordResetToken(token: string): string {
  return createHash("sha256").update(token.trim()).digest("hex");
}

export function getPasswordResetExpiry(): Date {
  return new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);
}
