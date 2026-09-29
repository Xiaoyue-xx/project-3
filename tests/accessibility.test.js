import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const css = await readFile(new URL("../styles/main.css", import.meta.url), "utf8");

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255);
  const linear = channels.map((value) => (
    value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

test("primary text and control color pairs meet WCAG AA normal-text contrast", () => {
  const pairs = [
    ["#241c35", "#fffdf9"],
    ["#5f566f", "#fffdf9"],
    ["#ffffff", "#7163e8"],
    ["#4937bd", "#fffdf9"],
    ["#385b47", "#e2f5e9"],
    ["#5f566f", "#ffe5f1"],
    ["#5f566f", "#e7f7ff"],
    ["#4937bd", "#ece9ff"],
  ];
  for (const [foreground, background] of pairs) {
    assert.ok(
      contrastRatio(foreground, background) >= 4.5,
      `${foreground} on ${background} must meet 4.5:1`,
    );
  }
});

test("landmarks, live regions, dialogs, and meaningful artwork have text equivalents", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /data-character-art[^>]+role="img"[^>]+aria-label=/);
  assert.match(html, /data-dialog="location" aria-labelledby="location-dialog-title"/);
  assert.match(html, /data-dialog="preferences" aria-labelledby="preferences-dialog-title"/);
  assert.match(html, /data-dialog="outfit" aria-labelledby="outfit-dialog-title"/);
  assert.match(html, /data-dialog="carry" aria-labelledby="carry-dialog-title"/);
  assert.match(html, /data-open-information aria-label="Information"/);
});

test("focus, target size, text reflow, and reduced motion have explicit rules", () => {
  assert.match(css, /button \{[^}]*min-height: 2\.75rem/s);
  assert.match(css, /:focus-visible \{[^}]*outline:/s);
  assert.match(css, /min-width: 320px/);
  assert.match(css, /grid-template-columns: minmax\(0, 1\.05fr\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation-iteration-count: 1 !important/);
});
