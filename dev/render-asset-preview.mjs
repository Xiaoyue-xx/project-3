import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ASSEMBLED_OUTFITS, COLOR_PALETTES } from "../data/assets.js";

const sprite = await readFile(new URL("../assets/art.svg", import.meta.url), "utf8");
const preview = await readFile(new URL("./asset-preview.svg", import.meta.url), "utf8");
const spriteContent = sprite
  .replace(/^<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");
const renderedPreview = preview
  .replace(/(<svg[^>]*>)/, `$1\n<defs>${spriteContent}</defs>`)
  .replaceAll("../assets/art.svg#", "#");
const outputPath = join(tmpdir(), "what-to-wear-asset-preview.svg");
const contactSheetPath = join(tmpdir(), "what-to-wear-asset-contact-sheet.svg");

await writeFile(outputPath, renderedPreview, "utf8");

const columns = 10;
const cardWidth = 150;
const cardHeight = 260;
const contactCards = ASSEMBLED_OUTFITS.map((outfit, index) => {
  const x = (index % columns) * cardWidth;
  const y = Math.floor(index / columns) * cardHeight;
  const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];
  const layers = outfit.layerIds.map((id) => `<use href="#${id}"/>`).join("");
  return `<g transform="translate(${x} ${y})">
    <rect x="5" y="5" width="140" height="250" rx="14" fill="#fffdf9" stroke="#241c35" stroke-width="3"/>
    <svg x="12" y="10" width="126" height="205" viewBox="0 0 260 480" style="--garment-primary:${palette.primary};--garment-secondary:${palette.secondary};--garment-dark:${palette.dark}">
      <use href="#decor-blob"/>${layers}
    </svg>
    <text x="12" y="232" fill="#241c35" font-family="sans-serif" font-size="9" font-weight="700">${outfit.fitId}</text>
    <text x="12" y="247" fill="#4b425d" font-family="sans-serif" font-size="8">${outfit.category} · ${outfit.style}</text>
  </g>`;
}).join("");
const contactSheet = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 2340">
  <defs>${spriteContent}</defs>
  <rect width="1500" height="2340" fill="#f7f3ff"/>
  ${contactCards}
</svg>`;

await writeFile(contactSheetPath, contactSheet, "utf8");
console.log(outputPath);
console.log(contactSheetPath);
