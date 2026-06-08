export {
  EMAIL_VERIFICATION_CODE_TTL_MS as GOOGLE_VERIFICATION_CODE_TTL_MS,
  generateEmailVerificationCode as generateGoogleVerificationCode,
  normalizeEmailVerificationCode as normalizeGoogleVerificationCode,
  hashEmailVerificationCode as hashGoogleVerificationCode,
  isEmailVerificationCodeValid as isGoogleVerificationCodeValid,
  parseGoogleRegisterSession,
  serializeGoogleRegisterSession,
  type GoogleRegisterSession,
} from "@/lib/email-verification";
