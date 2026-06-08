import fs from "node:fs";
import path from "node:path";
import { getSystemSettings } from "@/lib/system-settings";

export async function getCollegeBranding() {
  const settings = await getSystemSettings();
  const logoPath = path.join(process.cwd(), "public", "logos", "logo.png");
  let logoSrc: string | undefined;

  if (fs.existsSync(logoPath)) {
    const buffer = fs.readFileSync(logoPath);
    logoSrc = `data:image/png;base64,${buffer.toString("base64")}`;
  }

  return {
    collegeName: settings.collegeDisplayName,
    tagline: "Transformation For Excellence",
    logoSrc,
  };
}
