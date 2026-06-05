import { readFileSync } from "fs";
import { PDFDocument } from "pdf-lib";

const bytes = readFileSync("public/templates/offer-of-admission-template.pdf");
const doc = await PDFDocument.load(bytes);
const page = doc.getPages()[0];
const { width, height } = page.getSize();
console.log("Page size:", width, height);
