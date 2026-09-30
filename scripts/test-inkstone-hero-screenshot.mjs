import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const pagePath = fileURLToPath(new URL("../inkstone-markdown-notes.html", import.meta.url));
const html = await readFile(pagePath, "utf8");

test("Inkstone's real screenshot is eager and part of the product hero", () => {
  const heroStart = html.indexOf('<section class="page-hero new-app-intro">');
  const heroEnd = html.indexOf("</section>", heroStart);
  const screenshotStart = html.indexOf('src="assets/inkstone-editor-screen.webp"');
  assert.ok(heroStart >= 0 && heroEnd > heroStart, "product hero exists");
  assert.ok(screenshotStart > heroStart && screenshotStart < heroEnd, "screenshot is inside the hero");

  const screenshot = html.slice(screenshotStart - 8, html.indexOf(">", screenshotStart));
  assert.match(screenshot, /width="520" height="1130"/);
  assert.match(screenshot, /loading="eager" fetchpriority="high"/);
  assert.match(screenshot, /alt="Inkstone Notes Markdown editor showing links, task lists and rich-text copy controls"/);
  assert.match(html, /The iPhone editor works directly with Markdown files\./);
  assert.doesNotMatch(html, /<section class="section new-app-visual"/);
});
