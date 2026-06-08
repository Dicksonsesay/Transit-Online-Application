import QRCode from "qrcode";

export async function generateQrCodeDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 120,
    margin: 1,
    errorCorrectionLevel: "M",
  });
}

export function getVerifyPinPortalUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, "");
  return `${normalized}/auth/verify-pin`;
}
