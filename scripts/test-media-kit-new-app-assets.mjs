import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../media-kit.html", import.meta.url), "utf8");
const origin = "https://www.xiaozhonglvyou.com";
const section = html.match(/<section\b[^>]*id="new-app-media-assets"[^>]*>(.*?)<\/section>/s)?.[1];
const assets = [
  ["inkstone-icon.webp", 256, 256],
  ["inkstone-editor-screen.webp", 520, 1130],
  ["og-inkstone-notes.jpg", 1200, 630],
  ["lailemma-icon.webp", 256, 256],
  ["lailemma-readiness-home.webp", 520, 1125],
  ["lailemma-readiness-detail.webp", 520, 1125],
  ["lailemma-readiness-snapshot.webp", 520, 1125],
  ["lailemma-readiness-all-metrics.webp", 520, 1125],
  ["twopic-icon.webp", 256, 256],
  ["twopic-pip-screen.webp", 520, 1130]
];

test("media kit previews and downloads all ten genuine new-app assets", async () => {
  assert.ok(section, "asset section exists");
  assert.equal((html.match(/id="new-app-media-assets"/g) ?? []).length, 1);
  assert.equal((section.match(/data-media-product=/g) ?? []).length, 3);
  assert.equal((section.match(/<figure\b/g) ?? []).length, assets.length);
  for (const [file, width, height] of assets) {
    const figure = section.split(`data-media-asset="${file}">`)[1]?.split("</figure>")[0];
    assert.ok(figure, `${file} has a preview`);
    assert.ok(figure.includes(`src="assets/${file}" width="${width}" height="${height}"`));
    assert.ok(figure.includes(`href="assets/${file}" download="${file}"`));
    assert.match(figure, /loading="lazy" decoding="async" alt="[^"]+"/);
    assert.ok((await stat(new URL(`../assets/${file}`, import.meta.url))).size > 1000);
  }
});

test("media assets disclose language and distinguish graphics from screenshots", () => {
  assert.match(section, /English interface/);
  assert.match(section, /Simplified Chinese interface/);
  assert.match(section, /Branded graphic/);
  assert.match(section, /not an Apple score or a medical diagnosis/);
  assert.match(section, /no translated interface is implied/);
  assert.ok(html.includes('href="#new-app-media-assets"'));
});

test("media kit keeps stable product URLs and refreshes only verified new-app facts", () => {
  assert.ok(html.includes(`rel="canonical" href="${origin}/media-kit.html"`));
  const coverage = html.slice(html.indexOf("Canonical coverage links")).split("</section>")[0];
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const list = schema["@graph"].find((node) => node["@id"] === `${origin}/media-kit.html#apps`);
  assert.equal(list.numberOfItems, 9);
  assert.equal(list.itemListElement.length, 9);
  for (const [page, name] of [
    ["inkstone-markdown-notes.html", "Inkstone Notes Markdown"],
    ["lailemma-period-tracker.html", "Laleme - Health Tracker"],
    ["twopic-dual-camera.html", "TwoPic Dual Camera"]
  ]) {
    assert.ok(coverage.includes(`href="${page}"`));
    assert.equal(list.itemListElement.find((item) => item.url === `${origin}/${page}`).name, name);
  }
  assert.match(html, /the three newer listings were checked on October 3, 2026/);
  assert.match(html, /original six listings were checked on August 3, 2026/);
  assert.doesNotMatch(html, /Lailemma - Period &(?:amp;)? Fertility/);
});

test("image sitemap exposes the new media-kit assets on the existing URL", async () => {
  const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
  const entry = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)]
    .find((match) => match[1].includes(`<loc>${origin}/media-kit.html</loc>`))?.[1];
  assert.ok(entry);
  for (const [file] of assets) {
    assert.ok(entry.includes(`<image:loc>${origin}/assets/${file}</image:loc>`));
  }
});

test("media-kit preview sizing is scoped and preserves the whole screenshot", async () => {
  const styles = await readFile(new URL("../new-apps.css", import.meta.url), "utf8");
  assert.match(styles, /\.media-assets-grid\{[^}]*minmax\(180px,1fr\)/);
  assert.match(styles, /\.media-asset-preview\{[^}]*height:340px/);
  assert.match(styles, /\.media-asset-preview img\{[^}]*object-fit:contain/);
  assert.match(styles, /\.media-asset figcaption\{[^}]*overflow-wrap:anywhere/);
});
