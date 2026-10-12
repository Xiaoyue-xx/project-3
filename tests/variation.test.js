import assert from "node:assert/strict";
import test from "node:test";

import {
  CHARACTER_PRESENTATIONS,
  OUTFIT_CATEGORIES,
  OUTFIT_RECIPES,
  OUTFIT_STYLES,
  REMINDER_CONTENT,
  applyProtectiveLayers,
  getOutfitRecipes,
} from "../data/content.js";
import {
  createVariationSeed,
  selectContentVariants,
  stableHash,
  stableIndex,
} from "../scripts/variation.js";

const selectionInput = {
  latitude: 40.7128,
  longitude: -74.006,
  date: "2026-09-28",
  character: "waves",
  style: "campus-casual",
  category: "comfortable",
  modifiers: {},
  reminderTypes: ["rain", "wind", "uv", "hydration", "layers", "thunderstorm"],
};

test("the manifest contains exactly 45 reviewed semantic recipes", () => {
  const recipes = OUTFIT_CATEGORIES.flatMap((category) => (
    OUTFIT_STYLES.flatMap((style) => OUTFIT_RECIPES[category][style])
  ));

  assert.equal(recipes.length, 45);
  assert.equal(new Set(recipes.map(({ id }) => id)).size, 45);
  assert.ok(recipes.every(({ items }) => items.length === 3));
});

test("all 180 character/category/style slots have three equivalent fitted recipes", () => {
  const slots = [];
  for (const character of CHARACTER_PRESENTATIONS) {
    for (const category of OUTFIT_CATEGORIES) {
      for (const style of OUTFIT_STYLES) {
        const recipes = getOutfitRecipes(category, style, character);
        slots.push({ character, category, style, recipes });
        assert.equal(recipes.length, 3);
        assert.ok(recipes.every((entry) => entry.character === character));
        assert.equal(new Set(recipes.map(({ fitId }) => fitId)).size, 3);
      }
    }
  }

  assert.equal(slots.length, 60);
  assert.equal(slots.reduce((total, slot) => total + slot.recipes.length, 0), 180);

  for (const category of OUTFIT_CATEGORIES) {
    for (const style of OUTFIT_STYLES) {
      const referenceItems = getOutfitRecipes(category, style, CHARACTER_PRESENTATIONS[0]).map(({ items }) => items);
      for (const character of CHARACTER_PRESENTATIONS.slice(1)) {
        assert.deepEqual(getOutfitRecipes(category, style, character).map(({ items }) => items), referenceItems);
      }
    }
  }
});

test("every reminder type has three English variants and its own icon", () => {
  assert.deepEqual(Object.keys(REMINDER_CONTENT), [
    "rain", "snow", "wind", "uv", "hydration", "layers", "thunderstorm",
  ]);
  for (const { iconId, wording } of Object.values(REMINDER_CONTENT)) {
    assert.match(iconId, /^reminder-/);
    assert.equal(wording.length, 3);
    assert.ok(wording.every((text) => /[.!]$/.test(text)));
  }
});

test("protective rules add rain and wind layers and replace footwear for snow", () => {
  const base = getOutfitRecipes("warm", "streetwear", "crop")[0];
  const protectedOutfit = applyProtectiveLayers(base, { rain: true, snow: true, wind: true });

  assert.deepEqual(protectedOutfit.protectionLayers, ["wind-resistant rain shell"]);
  assert.deepEqual(protectedOutfit.carryItems, ["umbrella"]);
  assert.equal(protectedOutfit.items.at(-1), "waterproof winter boots");
  assert.equal(protectedOutfit.footwearOverride, "crop:waterproof-winter-boots");
  assert.match(protectedOutfit.accessibleSummary, /waterproof winter boots/);
  assert.match(protectedOutfit.accessibleSummary, /wind-resistant rain shell/);
});

test("seed normalization rounds coordinates and preserves the approved dimensions", () => {
  assert.equal(createVariationSeed(selectionInput), (
    "40.713|-74.006|2026-09-28|waves|campus-casual"
  ));
  assert.equal(createVariationSeed({ ...selectionInput, latitude: -0 }), (
    "0.000|-74.006|2026-09-28|waves|campus-casual"
  ));
});

test("FNV-1a hashing and salted indexing are deterministic", () => {
  assert.equal(stableHash("what-to-wear"), 1058247437);
  const seed = createVariationSeed(selectionInput);
  assert.equal(stableIndex(seed, "outfit", 3), stableIndex(seed, "outfit", 3));
  assert.notEqual(stableHash(`outfit|${seed}`), stableHash(`rain-copy|${seed}`));
});

test("the same selection is stable across calls and fresh module instances", async () => {
  const first = selectContentVariants(selectionInput);
  const second = selectContentVariants(selectionInput);
  const freshModule = await import(`../scripts/variation.js?reload=${Date.now()}`);
  const afterReload = freshModule.selectContentVariants(selectionInput);

  assert.deepEqual(first, second);
  assert.deepEqual(first, afterReload);
});

test("outfit, color, and reminder salts produce broad independent coverage", () => {
  const reminderTypes = Object.keys(REMINDER_CONTENT);
  const selections = [];
  for (let index = 0; index < 180; index += 1) {
    const day = String((index % 28) + 1).padStart(2, "0");
    selections.push(selectContentVariants({
      ...selectionInput,
      latitude: 25 + index * 0.137,
      longitude: -124 + index * 0.211,
      date: `2026-10-${day}`,
      reminderTypes,
    }));
  }

  assert.deepEqual(new Set(selections.map(({ outfitIndex }) => outfitIndex)), new Set([0, 1, 2]));
  assert.deepEqual(new Set(selections.map(({ colorIndex }) => colorIndex)), new Set([0, 1, 2]));
  for (const [reminderIndex, type] of reminderTypes.entries()) {
    assert.deepEqual(
      new Set(selections.map(({ reminders }) => reminders[reminderIndex].wordingIndex)),
      new Set([0, 1, 2]),
      `${type} wording coverage`,
    );
  }

  const outfitRainPairs = new Set(selections.map(({ outfitIndex, reminders }) => (
    `${outfitIndex}:${reminders[0].wordingIndex}`
  )));
  const rainWindPairs = new Set(selections.map(({ reminders }) => (
    `${reminders[0].wordingIndex}:${reminders[1].wordingIndex}`
  )));
  assert.ok(outfitRainPairs.size > 3);
  assert.ok(rainWindPairs.size > 3);
  assert.ok(selections.some(({ outfitIndex, reminders }) => (
    outfitIndex !== reminders[0].wordingIndex
  )));
});

test("content selection rejects invalid seed dimensions and reminder types", () => {
  assert.throws(() => createVariationSeed({ ...selectionInput, latitude: Number.NaN }), TypeError);
  assert.throws(() => createVariationSeed({ ...selectionInput, date: "09/28/2026" }), TypeError);
  assert.throws(() => stableIndex("seed", "salt", 0), RangeError);
  assert.throws(() => selectContentVariants({
    ...selectionInput,
    reminderTypes: ["not-a-reminder"],
  }), RangeError);
});
