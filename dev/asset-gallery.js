import {
  ASSEMBLED_OUTFITS,
  ASSET_INVENTORY,
  COLOR_PALETTES,
  getAssetHref,
  getChibiLayerTransform,
} from "../data/assets.js?chibi-2026-10-12-v2";
import { SKIN_TONES } from "../data/content.js";
import { renderPixelArt } from "../scripts/pixel-art.js";

const outfitGallery = document.querySelector("[data-outfit-gallery]");
const iconGallery = document.querySelector("[data-icon-gallery]");
const filter = document.querySelector("[data-gallery-filter]");

function useElement(symbolId) {
  const use = `<use href="${getAssetHref(symbolId, "../")}"></use>`;
  const transform = getChibiLayerTransform(symbolId);
  return transform ? `<g transform="${transform}">${use}</g>` : use;
}

if (outfitGallery) {
  outfitGallery.innerHTML = ASSEMBLED_OUTFITS.map((outfit, index) => {
    const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];
    const style = [
      `--garment-primary:${palette.primary}`,
      `--garment-secondary:${palette.secondary}`,
      `--garment-dark:${palette.dark}`,
      `--shoe-color:${palette.shoe}`,
    ].join(";");
    return `
      <article class="outfit-card" data-character="${outfit.character}">
        <svg viewBox="0 0 260 360" role="img" aria-label="${outfit.accessibleSummary}" style="${style}" data-outfit-layers="${outfit.layerIds.join(" ")}" data-palette-index="${index % COLOR_PALETTES.length}">
        </svg>
        <div class="card-copy">
          <strong>${outfit.fitId}</strong>
          <p>${outfit.category} · ${outfit.style}</p>
        </div>
      </article>`;
  }).join("");

  const renderTasks = [...outfitGallery.querySelectorAll("[data-outfit-layers]")].map((svg) => {
    const palette = COLOR_PALETTES[Number(svg.dataset.paletteIndex)];
    return renderPixelArt(svg, svg.dataset.outfitLayers.split(" "), {
      tone: SKIN_TONES[2],
      palette: [palette.primary, palette.secondary, palette.dark, palette.shoe],
      ariaLabel: svg.getAttribute("aria-label"),
    });
  });
  await Promise.all(renderTasks);
}

const iconIds = [
  ...ASSET_INVENTORY.weather,
  ...ASSET_INVENTORY.reminders,
  ...ASSET_INVENTORY.status,
];

if (iconGallery) {
  iconGallery.innerHTML = iconIds.map((iconId) => `
    <article class="icon-card">
      <svg viewBox="0 0 64 64" role="img" aria-label="${iconId.replaceAll("-", " ")}">
        ${useElement(iconId)}
      </svg>
      <p>${iconId}</p>
    </article>`).join("");
}

filter?.addEventListener("change", () => {
  const selected = filter.value;
  document.querySelectorAll("[data-character]").forEach((card) => {
    card.hidden = selected !== "all" && card.dataset.character !== selected;
  });
});
