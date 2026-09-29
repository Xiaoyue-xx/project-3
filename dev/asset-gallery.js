import { ASSEMBLED_OUTFITS, ASSET_INVENTORY, COLOR_PALETTES } from "../data/assets.js";

const SVG_PATH = "../assets/art.svg";
const outfitGallery = document.querySelector("[data-outfit-gallery]");
const iconGallery = document.querySelector("[data-icon-gallery]");
const filter = document.querySelector("[data-gallery-filter]");

function useElement(symbolId) {
  return `<use href="${SVG_PATH}#${symbolId}"></use>`;
}

if (outfitGallery) {
  outfitGallery.innerHTML = ASSEMBLED_OUTFITS.map((outfit, index) => {
    const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];
    const style = [
      `--garment-primary:${palette.primary}`,
      `--garment-secondary:${palette.secondary}`,
      `--garment-dark:${palette.dark}`,
    ].join(";");
    return `
      <article class="outfit-card" data-character="${outfit.character}">
        <svg viewBox="0 0 260 480" role="img" aria-label="${outfit.accessibleSummary}" style="${style}">
          ${useElement("decor-blob")}
          ${outfit.layerIds.map(useElement).join("")}
        </svg>
        <div class="card-copy">
          <strong>${outfit.fitId}</strong>
          <p>${outfit.category} · ${outfit.style}</p>
        </div>
      </article>`;
  }).join("");
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
