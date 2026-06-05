import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const { generateOfferOfAdmissionPdf } = await import(
  pathToFileURL(path.join(root, "src/lib/offer-of-admission/generate-pdf.ts")).href
);

const pdfBytes = await generateOfferOfAdmissionPdf({
  studentName: "Dickson Sesay",
  programmeName: "Diploma in Nursing",
  courseName: "BSc. Computer Science",
  date: new Date("2026-06-04"),
  admissionYear: "2026",
  programmeLevels: ["diploma"],
});

const out = path.join(root, "public", "templates", "offer-test-output.pdf");
writeFileSync(out, pdfBytes);
console.log("Wrote", out);
