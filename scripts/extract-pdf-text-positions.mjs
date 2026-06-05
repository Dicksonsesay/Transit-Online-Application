import { readFileSync } from "fs";
import zlib from "zlib";

const bytes = readFileSync("public/templates/offer-of-admission-template.pdf");
const pdf = bytes.toString("latin1");

function decodeTJArray(raw) {
  const parts = [];
  const re = /\((?:\\.|[^\\)])*\)|<-?\d+(\.\d+)?>/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    const token = match[0];
    if (token.startsWith("(")) {
      const inner = token.slice(1, -1);
      const decoded = inner
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(Number(oct)))
        .replace(/\\n/g, "\n")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")")
        .replace(/\\\\/g, "\\");
      parts.push(decoded);
    }
  }
  return parts.join("");
}

function parseStream(content) {
  const results = [];
  const blocks = content.split("BT");
  for (const block of blocks.slice(1)) {
    const end = block.indexOf("ET");
    if (end < 0) continue;
    const segment = block.slice(0, end);
    let x = 0;
    let y = 0;
    let fontSize = 12;
    const lines = segment.split(/\r?\n/);
    for (const line of lines) {
      const tf = line.match(/^\/F\d+ ([\d.]+) Tf$/);
      if (tf) fontSize = Number(tf[1]);

      const tm = line.match(/^1 0 0 1 ([\d.-]+) ([\d.-]+) Tm$/);
      const td = line.match(/^([\d.-]+) ([\d.-]+) Td$/);
      if (tm) {
        x = Number(tm[1]);
        y = Number(tm[2]);
      } else if (td) {
        x += Number(td[1]);
        y += Number(td[2]);
      }

      const tj = line.match(/^\((.*)\) Tj$/);
      if (tj) {
        const decoded = decodeTJArray(`(${tj[1]})`);
        if (decoded.trim()) results.push({ x, y, fontSize, text: decoded });
        continue;
      }

      const tjArr = line.match(/^\[(.+)\] TJ$/);
      if (tjArr) {
        const decoded = decodeTJArray(`[${tjArr[1]}]`);
        if (decoded.trim()) results.push({ x, y, fontSize, text: decoded });
      }
    }
  }
  return results;
}

const PAGE_HEIGHT = 792;
const re = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
const all = [];
while ((match = re.exec(pdf)) !== null) {
  try {
    const inflated = zlib.inflateSync(Buffer.from(match[1], "binary"));
    all.push(...parseStream(inflated.toString("latin1")));
  } catch {
    // ignore
  }
}

const keywords =
  /Date|October|Augustine|Samura|Dear|Programme|Tuition|NLe|Bachelor|Start Date|Duration/i;

for (const item of all.filter((i) => keywords.test(i.text)).sort((a, b) => b.y - a.y || a.x - b.x)) {
  const yTop = (PAGE_HEIGHT - item.y).toFixed(1);
  console.log(
    `x=${item.x.toFixed(1)} y_pdf=${item.y.toFixed(1)} y_top=${yTop} fs=${item.fontSize} | ${item.text}`
  );
}

console.log("\nTotal parsed:", all.length);
