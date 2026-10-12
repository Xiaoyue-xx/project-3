import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  ASSEMBLED_OUTFITS,
  ASSET_INVENTORY,
  COLOR_PALETTES,
  PIXEL_CHARACTER_ASSET_IDS,
  PROTECTION_LAYER_IDS,
  getAssetHref,
  getChibiLayerTransform,
} from "../data/assets.js";
import {
  CHARACTER_PRESENTATIONS,
  OUTFIT_CATEGORIES,
  OUTFIT_STYLES,
  SKIN_TONES,
} from "../data/content.js";

const sprite = await readFile(new URL("../assets/art.svg", import.meta.url), "utf8");
const pixelSprite = await readFile(new URL("../assets/pixel-characters.svg", import.meta.url), "utf8");
const galleryHtml = await readFile(new URL("../dev/asset-gallery.html", import.meta.url), "utf8");
const galleryCss = await readFile(new URL("../dev/asset-gallery.css", import.meta.url), "utf8");
const galleryJs = await readFile(new URL("../dev/asset-gallery.js", import.meta.url), "utf8");
const previewSvg = await readFile(new URL("../dev/asset-preview.svg", import.meta.url), "utf8");
const previewRenderer = await readFile(
  new URL("../dev/render-asset-preview.mjs", import.meta.url),
  "utf8",
);
const pixelRenderer = await readFile(new URL("../scripts/pixel-art.js", import.meta.url), "utf8");

const symbolMatches = [...sprite.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">/g)];
const symbolIds = symbolMatches.map((match) => match[1]);
const symbolIdSet = new Set(symbolIds);
const pixelSymbolMatches = [...pixelSprite.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">/g)];
const pixelSymbolIds = pixelSymbolMatches.map((match) => match[1]);
const pixelSymbolIdSet = new Set(pixelSymbolIds);
const pixelDefinedIds = new Set(
  [...pixelSprite.matchAll(/<(?:symbol|g) id="([^"]+)"/g)].map((match) => match[1]),
);

test("the SVG sprite is an original symbol library with unique IDs and view boxes", () => {
  assert.match(sprite, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg">/);
  assert.equal(symbolIds.length, symbolIdSet.size);
  assert.equal(symbolIds.length, 90);
  assert.ok(symbolMatches.every(([, , viewBox]) => /^(0 0 260 (480|90)|0 0 (64 64|100 64))$/.test(viewBox)));
  assert.doesNotMatch(sprite, /<image|data:image|(?:href|src)="https?:\/\//);
});

test("every inventoried and internally referenced symbol exists", () => {
  const inventoryIds = Object.values(ASSET_INVENTORY).flat();
  assert.equal(inventoryIds.length, 93);
  assert.equal(new Set(inventoryIds).size, inventoryIds.length);
  for (const id of inventoryIds) {
    assert.ok(symbolIdSet.has(id) || pixelSymbolIdSet.has(id), id);
  }

  const internalReferences = [...sprite.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const id of internalReferences) assert.ok(symbolIdSet.has(id), `internal use: ${id}`);
});

test("the character system uses a complete hard-edged pixel SVG sprite", () => {
  assert.equal(pixelSymbolIds.length, 62);
  assert.equal(pixelSymbolIdSet.size, 62);
  assert.deepEqual(new Set(PIXEL_CHARACTER_ASSET_IDS), pixelSymbolIdSet);
  assert.ok(pixelSymbolMatches.every(([, , viewBox]) => viewBox === "0 0 260 480"));
  assert.match(pixelSprite, /shape-rendering: crispEdges/);
  assert.match(pixelSprite, /stroke-linecap: butt/);
  assert.match(pixelSprite, /stroke-linejoin: miter/);
  const pathData = [...pixelSprite.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(pathData.every((value) => !/[AaCcQqSsTt]/.test(value)));
  assert.doesNotMatch(pixelSprite, /<image|data:image|(?:href|src)="https?:\/\//);
  const pixelReferences = [...pixelSprite.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  for (const id of pixelReferences) assert.ok(pixelDefinedIds.has(id), `pixel reference: ${id}`);
  for (const id of PIXEL_CHARACTER_ASSET_IDS) {
    assert.equal(getAssetHref(id), `assets/pixel-characters.svg#${id}`);
  }
  assert.equal(getAssetHref("weather-clear"), "assets/art.svg#weather-clear");
});

test("chibi proportion transforms align headwear, tops, bottoms, shoes, and protection layers", () => {
  assert.equal(getChibiLayerTransform("upper-tee"), "matrix(1 0 0 .52 0 78)");
  assert.equal(getChibiLayerTransform("lower-jeans"), "matrix(1 0 0 .62 0 47)");
  assert.equal(getChibiLayerTransform("footwear-canvas"), "matrix(1 0 0 .62 0 47)");
  assert.equal(getChibiLayerTransform("modifier-knit-hat"), "matrix(1.3 0 0 1.18 -39 -16)");
  assert.equal(getChibiLayerTransform("modifier-gloves"), "matrix(1 0 0 .62 0 47)");
  assert.equal(getChibiLayerTransform("modifier-rain-shell"), "matrix(1 0 0 .52 0 78)");
  assert.equal(getChibiLayerTransform("modifier-waterproof-boots"), "matrix(1 0 0 .62 0 47)");
  assert.equal(getChibiLayerTransform("base-tunic"), getChibiLayerTransform("lower-jeans"));
  assert.equal(getChibiLayerTransform("character-crop"), null);
});

test("the browser renderer expands pixel layers locally for Safari color support", () => {
  assert.match(pixelRenderer, /new DOMParser\(\)/);
  assert.match(pixelRenderer, /copyExpandedNode/);
  assert.match(pixelRenderer, /style\.textContent = sprite\.querySelector\("style"\)/);
  assert.match(pixelRenderer, /--skin-tone/);
  assert.match(pixelRenderer, /--garment-primary/);
  assert.match(pixelRenderer, /new URL\(\s*`\.\.\/\$\{PIXEL_CHARACTER_SPRITE_PATH\}\?[^`]+`,/);
  assert.match(pixelRenderer, /group\.setAttribute\("transform", transform\)/);
});

test("the reference-led character keeps block shading and uses the shared hooded tunic", () => {
  assert.match(pixelRenderer, /layerId\.startsWith\("character-"\)/);
  assert.match(pixelRenderer, /source\.classList\.contains\("pixel-detail"\)/);
  assert.match(pixelRenderer, /source\.classList\.contains\("ink"\)/);
  assert.match(pixelRenderer, /source\.classList\.contains\("sheen"\)/);
  assert.doesNotMatch(pixelRenderer, /classList\.contains\("skin-shadow"\)/);
  assert.match(pixelRenderer, /copyExpandedNode\(child, sprite, svg\.ownerDocument, isCharacterLayer\)/);
  assert.match(pixelSprite, /matrix\(1\.3 0 0 1\.18 -39 -16\)/);
  assert.match(pixelSprite, /matrix\(1 0 0 \.62 0 47\)/);
  assert.match(pixelSprite, /id="pixel-big-eyes"/);
  assert.match(pixelSprite, /id="pixel-hood"/);
  assert.match(pixelSprite, /id="base-tunic"/);
  assert.equal(getChibiLayerTransform("lower-jeans"), getChibiLayerTransform("footwear-canvas"));
  assert.equal(getChibiLayerTransform("lower-jeans"), getChibiLayerTransform("modifier-waterproof-boots"));
});

test("the manifest assembles all 180 fitted outfits in a safe z-order", () => {
  assert.equal(ASSEMBLED_OUTFITS.length, 180);
  assert.equal(new Set(ASSEMBLED_OUTFITS.map(({ fitId }) => fitId)).size, 180);

  for (const outfit of ASSEMBLED_OUTFITS) {
    assert.equal(outfit.layerIds.length, 5);
    assert.match(outfit.layerIds[0], /^character-/);
    assert.match(outfit.layerIds[1], /^lower-/);
    assert.equal(outfit.layerIds[2], "base-tunic");
    assert.match(outfit.layerIds[3], /^upper-/);
    assert.match(outfit.layerIds[4], /^footwear-/);
    assert.ok(outfit.layerIds.every((id) => pixelSymbolIdSet.has(id)), outfit.fitId);
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
  assert.equal(SKIN_TONES.length, 5);
  assert.ok(SKIN_TONES.every(({ base, shadow, blush }) => (
    [base, shadow, blush].every((color) => /^#[0-9a-f]{6}$/i.test(color))
  )));
});

test("the development gallery exposes labels, responsive layouts, and all asset groups", () => {
  assert.match(galleryHtml, /<html lang="en">/);
  assert.match(galleryHtml, /180 assembled entries/);
  assert.match(galleryHtml, /data-outfit-gallery/);
  assert.match(galleryHtml, /data-icon-gallery/);
  assert.match(galleryJs, /role="img" aria-label=/);
  assert.match(galleryJs, /ASSEMBLED_OUTFITS\.map/);
  assert.match(galleryJs, /getChibiLayerTransform/);
  assert.match(galleryJs, /ASSET_INVENTORY\.weather/);
  assert.match(galleryJs, /ASSET_INVENTORY\.reminders/);
  assert.match(galleryJs, /ASSET_INVENTORY\.status/);
  assert.match(galleryCss, /repeat\(auto-fit, minmax\(/);
  assert.match(galleryCss, /@media \(max-width: 36rem\)/);
  assert.match(galleryCss, /@media \(max-width: 21rem\)/);
  assert.match(previewSvg, /character-crop/);
  assert.match(previewSvg, /character-waves/);
  assert.match(previewSvg, /weather-thunderstorm/);
  assert.match(previewRenderer, /replaceAll\("\.\.\/assets\/art\.svg#", "#"\)/);
  assert.match(previewRenderer, /ASSEMBLED_OUTFITS\.map/);
  assert.match(previewRenderer, /what-to-wear-asset-contact-sheet\.svg/);
});
