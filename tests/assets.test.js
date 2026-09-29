import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ASSEMBLED_OUTFITS,
  ASSET_INVENTORY,
  COLOR_PALETTES,
  PROTECTION_LAYER_IDS,
} from "../data/assets.js";
import {
  CHARACTER_PRESENTATIONS,
  OUTFIT_CATEGORIES,
  OUTFIT_STYLES,
} from "../data/content.js";

const sprite = await readFile(new URL("../assets/art.svg", import.meta.url), "utf8");
const galleryHtml = await readFile(new URL("../dev/asset-gallery.html", import.meta.url), "utf8");
const galleryCss = await readFile(new URL("../dev/asset-gallery.css", import.meta.url), "utf8");
const galleryJs = await readFile(new URL("../dev/asset-gallery.js", import.meta.url), "utf8");
const previewSvg = await readFile(new URL("../dev/asset-preview.svg", import.meta.url), "utf8");
const previewRenderer = await readFile(
  new URL("../dev/render-asset-preview.mjs", import.meta.url),
  "utf8",
);

const symbolMatches = [...sprite.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">/g)];
const symbolIds = symbolMatches.map((match) => match[1]);
const symbolIdSet = new Set(symbolIds);

test("the SVG sprite is an original symbol library with unique IDs and view boxes", () => {
  assert.match(sprite, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">/);
  assert.equal(symbolIds.length, symbolIdSet.size);
  assert.equal(symbolIds.length, 90);
  assert.ok(symbolMatches.every(([, , viewBox]) => /^(0 0 260 (480|90)|0 0 (64 64|100 64))$/.test(viewBox)));
  assert.doesNotMatch(sprite, /<image|data:image|(?:href|src)="https?:\/\//);
});

test("every inventoried and internally referenced symbol exists", () => {
  const inventoryIds = Object.values(ASSET_INVENTORY).flat();
  assert.equal(inventoryIds.length, 90);
  assert.equal(new Set(inventoryIds).size, inventoryIds.length);
  for (const id of inventoryIds) assert.ok(symbolIdSet.has(id), id);

  const internalReferences = [...sprite.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const id of internalReferences) assert.ok(symbolIdSet.has(id), `internal use: ${id}`);
});

test("the manifest assembles all 90 fitted outfits in a safe z-order", () => {
  assert.equal(ASSEMBLED_OUTFITS.length, 90);
  assert.equal(new Set(ASSEMBLED_OUTFITS.map(({ fitId }) => fitId)).size, 90);

  for (const outfit of ASSEMBLED_OUTFITS) {
    assert.equal(outfit.layerIds.length, 4);
    assert.match(outfit.layerIds[0], /^character-/);
    assert.match(outfit.layerIds[1], /^lower-/);
    assert.match(outfit.layerIds[2], /^upper-/);
    assert.match(outfit.layerIds[3], /^footwear-/);
    assert.ok(outfit.layerIds.every((id) => symbolIdSet.has(id)), outfit.fitId);
    assert.match(outfit.accessibleSummary, /character wearing .+\.$/);
  }

  for (const character of CHARACTER_PRESENTATIONS) {
    for (const category of OUTFIT_CATEGORIES) {
      for (const style of OUTFIT_STYLES) {
        const matching = ASSEMBLED_OUTFITS.filter((outfit) => (
          outfit.character === character
          && outfit.category === category
          && outfit.style === style
        ));
        assert.equal(matching.length, 3, `${character}/${category}/${style}`);
      }
    }
  }
});

test("weather protection and all three color palettes reference usable assets", () => {
  assert.deepEqual(Object.keys(PROTECTION_LAYER_IDS), ["rain", "wind", "snowFootwear"]);
  for (const id of Object.values(PROTECTION_LAYER_IDS)) assert.ok(symbolIdSet.has(id), id);
  assert.equal(COLOR_PALETTES.length, 3);
  assert.ok(COLOR_PALETTES.every((palette) => (
    Object.values(palette).every((color) => /^#[0-9a-f]{6}$/i.test(color))
  )));
});

test("the development gallery exposes labels, responsive layouts, and all asset groups", () => {
  assert.match(galleryHtml, /<html lang="en">/);
  assert.match(galleryHtml, /data-outfit-gallery/);
  assert.match(galleryHtml, /data-icon-gallery/);
  assert.match(galleryJs, /role="img" aria-label=/);
  assert.match(galleryJs, /ASSEMBLED_OUTFITS\.map/);
  assert.match(galleryJs, /ASSET_INVENTORY\.weather/);
  assert.match(galleryJs, /ASSET_INVENTORY\.reminders/);
  assert.match(galleryJs, /ASSET_INVENTORY\.status/);
  assert.match(galleryCss, /repeat\(auto-fit, minmax\(/);
  assert.match(galleryCss, /@media \(max-width: 36rem\)/);
  assert.match(galleryCss, /@media \(max-width: 21rem\)/);
  assert.match(previewSvg, /character-male/);
  assert.match(previewSvg, /character-female/);
  assert.match(previewSvg, /weather-thunderstorm/);
  assert.match(previewRenderer, /replaceAll\("\.\.\/assets\/art\.svg#", "#"\)/);
  assert.match(previewRenderer, /ASSEMBLED_OUTFITS\.map/);
  assert.match(previewRenderer, /what-to-wear-asset-contact-sheet\.svg/);
});
