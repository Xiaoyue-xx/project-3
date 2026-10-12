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
  assert.match(html, /type="module" src="scripts\/app\.js(?:\?[^"]*)?"/);
});

test("the baseline includes responsive and reduced-motion rules", () => {
  assert.match(css, /@media \(max-width: 63\.99rem\)/);
  assert.match(css, /@media \(min-width: 64rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.05fr\).*minmax\(0, 1\.15fr\).*minmax\(0, 0\.8fr\)/);
  assert.match(css, /min-width: 320px/);
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
  for (const character of ["crop", "curls", "waves", "bob"]) {
    assert.match(html, new RegExp(`value="${character}"`));
  }
  for (const tone of ["deep", "dark", "medium", "tan", "light"]) {
    assert.match(html, new RegExp(`name="skinTone" value="${tone}"`));
  }
  assert.match(html, /value="campus-casual"/);
  assert.match(html, /value="sporty"/);
  assert.match(html, /value="streetwear"/);
  assert.doesNotMatch(html, /favorite locations|notifications/i);
});

test("the information screen includes every required disclosure and source", () => {
  assert.match(html, /data-information-screen/);
  assert.match(html, /Created by xiaoyuex_x/);
  assert.match(html, /with AI assistance/);
  assert.match(html, /Open-Meteo Forecast API/);
  assert.match(html, /CC BY 4\.0/);
  assert.match(html, /National Weather Service/);
  assert.match(html, /CDC extreme-heat guidance/);
  assert.match(html, /EPA UV Index guidance/);
  assert.match(html, /original artwork/);
  assert.match(html, /There is no account, analytics identifier, favorites list, location history, or stored weather history/);
});

test("the main screen provides visible loading and retry structures", () => {
  assert.match(html, /data-loading-skeleton/);
  assert.match(html, /data-retry-weather/);
  assert.match(html, /data-empty-title/);
});
