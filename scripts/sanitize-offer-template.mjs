/**
 * One-shot: erase baked-in sample placeholders from offer-of-admission-template.pdf
 * so generated letters never show ghost text (Augustine Samura, sample dates, etc.).
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const TEMPLATE_PATH = path.join(
  root,
  "public",
  "templates",
  "offer-of-admission-template.pdf"
);

const PAGE_HEIGHT = 792;
const COVER = rgb(1, 1, 1);

function yFromTop(distanceFromTop) {
  return PAGE_HEIGHT - distanceFromTop;
}

function coverRegion(page, { x, yTop, width, height }) {
  const baselineY = yFromTop(yTop);
  page.drawRectangle({
    x,
    y: baselineY - 6,
    width,
    height,
    color: COVER,
    borderWidth: 0,
  });
}

/** Placeholder regions from offer-of-admission-template.pdf (Letter of Offer for Admission). */
const SAMPLE_REGIONS = [
  // Date value (after "Date:")
  { x: 460, yTop: 182, width: 100, height: 22 },
  // "(Full Name of Student)"
  { x: 70, yTop: 225, width: 330, height: 22 },
  // "Dear ,"
  { x: 70, yTop: 253, width: 190, height: 22 },
  // Programme value (after "Programme:")
  { x: 174, yTop: 392, width: 355, height: 20 },
  // Tuition: (2026/2026 Session) -
  { x: 174, yTop: 433, width: 200, height: 22 },
];

const templateBytes = readFileSync(TEMPLATE_PATH);
const pdfDoc = await PDFDocument.load(templateBytes);
const page = pdfDoc.getPages()[0];

for (const region of SAMPLE_REGIONS) {
  coverRegion(page, region);
}

writeFileSync(TEMPLATE_PATH, await pdfDoc.save());
console.log("Sanitized template:", TEMPLATE_PATH);
