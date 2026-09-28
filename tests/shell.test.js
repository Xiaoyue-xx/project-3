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
});

test("the shell loads local CSS and an ES module", () => {
  assert.match(html, /href="styles\/main\.css"/);
  assert.match(html, /type="module" src="scripts\/app\.js"/);
});

test("the baseline includes responsive and reduced-motion rules", () => {
  assert.match(css, /@media \(max-width: 48rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
