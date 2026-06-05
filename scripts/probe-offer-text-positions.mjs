import { readFileSync } from "fs";
import { PDFDocument } from "pdf-lib";

const bytes = readFileSync("public/templates/offer-of-admission-template.pdf");
const doc = await PDFDocument.load(bytes);
console.log("pages:", doc.getPageCount());
for (let i = 0; i < doc.getPageCount(); i++) {
  const page = doc.getPages()[i];
  const { width, height } = page.getSize();
  console.log(`page ${i + 1}: ${width} x ${height}`);
}
