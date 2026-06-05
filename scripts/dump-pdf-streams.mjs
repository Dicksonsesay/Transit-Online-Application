import { readFileSync } from "fs";
import zlib from "zlib";

const bytes = readFileSync("public/templates/offer-of-admission-template.pdf");
const text = bytes.toString("latin1");
const re = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let i = 0;
let match;
while ((match = re.exec(text)) !== null) {
  const raw = match[1];
  try {
    const buf = Buffer.from(raw, "binary");
    const inflated = zlib.inflateSync(buf);
    const content = inflated.toString("latin1");
    if (/BT|Tm|Tj|TJ|Augustine|Date/i.test(content)) {
      console.log(`\n--- stream ${i} (${content.length} chars) ---\n`);
      console.log(content.slice(0, 4000));
    }
    i++;
  } catch {
    i++;
  }
}
