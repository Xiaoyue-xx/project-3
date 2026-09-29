import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles/main.css", import.meta.url), "utf8");

test("the document declares an English responsive application shell", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /data-weather-experience/);
  assert.match(html, /data-character-art/);
  assert.match(html, /data-forecast-list/);
});

test("the shell loads local CSS and an ES module", () => {
  assert.match(html, /href="styles\/main\.css"/);
  assert.match(html, /type="module" src="scripts\/app\.js"/);
});

test("the baseline includes responsive and reduced-motion rules", () => {
  assert.match(css, /@media \(max-width: 63\.99rem\)/);
  assert.match(css, /@media \(min-width: 64rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /grid-template-columns: minmax\(18rem, 1\.05fr\).*minmax\(22rem, 1\.15fr\).*minmax\(18rem, 0\.8fr\)/);
  assert.match(css, /min-width: 20rem/);
});

test("the main screen exposes complete location, date, unit, and source context", () => {
  assert.match(html, /data-location-label/);
  assert.match(html, /data-date-strip/);
  assert.match(html, /data-unit="fahrenheit"/);
  assert.match(html, /data-source-badge/);
  assert.match(html, />7-Day</);
});

test("approved interactions use labeled dialogs without excluded controls", () => {
  for (const dialog of ["location", "preferences", "outfit", "carry"]) {
    assert.match(html, new RegExp(`data-dialog="${dialog}"`));
  }
  assert.match(html, /data-use-device-location/);
  assert.match(html, /value="male"/);
  assert.match(html, /value="female"/);
  assert.match(html, /value="campus-casual"/);
  assert.match(html, /value="sporty"/);
  assert.match(html, /value="streetwear"/);
  assert.doesNotMatch(html, /favorite locations|notifications/i);
});
