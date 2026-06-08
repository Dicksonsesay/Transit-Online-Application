import { encode } from "next-auth/jwt";
import {
  SESSION_MAX_AGE,
  getSessionLastActivity,
} from "@/lib/session-config";

type AuthSessionTokenPayload = {
  sub: string;
  id: string;
  role: string;
  name: string;
  email: string;
};

export async function encodeAuthSessionToken(token: AuthSessionTokenPayload) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  return encode({
    token: {
      ...token,
      lastActivity: getSessionLastActivity(),
    },
    secret,
    maxAge: SESSION_MAX_AGE,
  });
}
