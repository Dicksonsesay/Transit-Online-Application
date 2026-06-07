export function mapStudentLoginError(error: string): string {
  switch (error) {
    case "google":
      return "Google sign-in session expired before login completed. Enter your PIN and try again.";
    case "config":
      return "Server configuration error. Contact support.";
    case "OAuthSignin":
      return "Google sign-in could not start. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and NEXTAUTH_URL in .env, then restart the dev server.";
    case "OAuthCallback":
      return "Google sign-in was interrupted. Please try again.";
    case "OAuthAccountNotLinked":
      return "This Google account is not linked to your student profile.";
    case "Configuration":
      return "Google sign-in is not configured correctly on the server.";
    case "AccessDenied":
      return "Google sign-in was cancelled.";
    default:
      return decodeURIComponent(error);
  }
}
