export type GoogleOAuthConfig = {
  clientId: string;
  clientSecret: string;
};

/** Returns Google OAuth credentials only when they look valid. */
export function getGoogleOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) return null;
  if (!clientId.endsWith(".apps.googleusercontent.com")) return null;
  if (clientSecret.length < 20) return null;

  return { clientId, clientSecret };
}

export function isGoogleOAuthEnabled(): boolean {
  return getGoogleOAuthConfig() !== null;
}
