import { readFileSync } from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ProgrammeLevelChoice } from "@/types/application-form";
import { formatDateForOffer } from "@/lib/utils";
import {
  formatTuitionFee,
  getOfferTuitionFee,
  mapToOfferTuitionLevel,
  resolvePrimaryProgrammeLevel,
} from "./tuition-fees";

export type OfferOfAdmissionPdfInput = {
  studentName: string;
  programmeName: string;
  courseName: string;
  date: Date | string;
  admissionYear: string;
  programmeLevels?: ProgrammeLevelChoice[];
};

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "templates",
  "offer-of-admission-template.pdf"
);

/** US Letter template (612 × 792 pt) */
const PAGE_HEIGHT = 792;
const FONT_SIZE = 12;
const TEXT_COLOR = rgb(0, 0, 0);
const COVER_COLOR = rgb(1, 1, 1);

/** Convert distance from top of page (pt) to PDF y (origin bottom-left). */
function yFromTop(distanceFromTop: number, pageHeight = PAGE_HEIGHT): number {
  return pageHeight - distanceFromTop;
}

function dearFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts[0] ?? fullName;
}

function buildProgrammeLine(programmeName: string, courseName: string): string {
  const programme = programmeName.trim();
  const course = courseName.trim();
  if (programme && course && programme.toLowerCase() !== course.toLowerCase()) {
    return `${programme} in ${course}.`;
  }
  return course || programme || "—";
}

function formatSessionYear(admissionYear: string): string {
  if (/^\d{4}\/\d{4}$/.test(admissionYear.trim())) {
    return admissionYear.trim();
  }
  const startYear = Number.parseInt(admissionYear, 10);
  if (Number.isFinite(startYear)) {
    return `${startYear}/${startYear + 1}`;
  }
  return admissionYear.trim();
}

function buildTuitionLine(admissionYear: string, amount: number): string {
  const sessionYear = formatSessionYear(admissionYear);
  return `(${sessionYear} Session) - ${formatTuitionFee(amount)}`;
}

function wrapText(
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);
    if (width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

/** Tight white-out around a single text baseline (avoids clipping nearby template lines). */
function coverTextLine(
  page: ReturnType<PDFDocument["getPages"]>[number],
  opts: { x: number; baselineY: number; width: number; fontSize: number }
) {
  const descenderPad = 2;
  const ascenderPad = Math.ceil(opts.fontSize * 0.92);
  page.drawRectangle({
    x: opts.x - 2,
    y: opts.baselineY - descenderPad,
    width: opts.width + 4,
    height: descenderPad + ascenderPad,
    color: COVER_COLOR,
    borderWidth: 0,
  });
}

/** Erase template placeholder text (distance from top of page, pt). */
function drawCoveredText(
  page: ReturnType<PDFDocument["getPages"]>[number],
  opts: {
    x: number;
    yTop: number;
    coverWidth: number;
    text: string;
    font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
    fontSize?: number;
    maxWidth?: number;
    lineHeight?: number;
  }
) {
  const fontSize = opts.fontSize ?? FONT_SIZE;
  const lineHeight = opts.lineHeight ?? 14;
  const baselineY = yFromTop(opts.yTop);

  const lines = opts.maxWidth
    ? wrapText(opts.text, opts.font, fontSize, opts.maxWidth)
    : [opts.text];

  lines.forEach((line, index) => {
    const lineBaseline = baselineY - index * lineHeight;
    coverTextLine(page, {
      x: opts.x,
      baselineY: lineBaseline,
      width: opts.coverWidth,
      fontSize,
    });
    page.drawText(line, {
      x: opts.x,
      y: lineBaseline,
      size: fontSize,
      font: opts.font,
      color: TEXT_COLOR,
    });
  });
}

export async function generateOfferOfAdmissionPdf(
  input: OfferOfAdmissionPdfInput
): Promise<Uint8Array> {
  const templateBytes = readFileSync(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const dateLabel = formatDateForOffer(input.date);
  const programmeLine = buildProgrammeLine(input.programmeName, input.courseName);
  const primaryLevel = resolvePrimaryProgrammeLevel(input.programmeLevels);
  const tuitionLevel = mapToOfferTuitionLevel(primaryLevel);
  const tuitionAmount = getOfferTuitionFee(
    tuitionLevel,
    input.courseName,
    input.programmeName
  );
  const tuitionText = buildTuitionLine(input.admissionYear, tuitionAmount);
  const greetingName = dearFirstName(input.studentName);

  // Positions: distance from top of page (pt), extracted from
  // public/templates/offer-of-admission-template.pdf (Letter of Offer for Admission).

  drawCoveredText(page, {
    x: 417,
    yTop: 184.2,
    coverWidth: 140,
    text: `Date: ${dateLabel}`,
    font,
  });

  // "(Full Name of Student)" placeholder
  drawCoveredText(page, {
    x: 72,
    yTop: 227.9,
    coverWidth: 320,
    text: input.studentName,
    font,
  });

  // "Dear ," placeholder
  drawCoveredText(page, {
    x: 72,
    yTop: 255.6,
    coverWidth: 180,
    text: `Dear ${greetingName},`,
    font,
  });

  // "Programme:" value only — Start Date (408.3) and Duration (422.1) stay untouched.
  drawCoveredText(page, {
    x: 176,
    yTop: 394.5,
    coverWidth: 350,
    text: programmeLine,
    font,
    maxWidth: 340,
    lineHeight: 13,
  });

  // Tuition value only — must not extend upward into Duration (422.1).
  drawCoveredText(page, {
    x: 176,
    yTop: 435.9,
    coverWidth: 280,
    text: tuitionText,
    font,
  });

  return pdfDoc.save();
}
