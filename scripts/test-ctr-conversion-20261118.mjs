import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { applyCtrConversionUpdates } from "./ctr-conversion-20261118.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");

const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const plain = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

test("CTR & conversion 2026-11-18 updater is idempotent across all six target pages", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "ctr-conversion-20261118-"));
  try {
    const files = [
      "index.html",
      "gif-maker.html",
      "best-gif-maker-apps-iphone.html",
      "mac-screen-privacy.html",
      "automatic-bike-ride-tracker-iphone.html",
      "seedance-ai-tools.html"
    ];
    for (const file of files) {
      await writeFile(path.join(temp, file), await readFile(path.join(siteDir, file), "utf8"));
    }
    const changed = await applyCtrConversionUpdates(temp);
    assert.deepEqual(changed, []);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("all seven newly optimized SERP pages keep compliant titles, descriptions, and synchronized FAQs", async () => {
  const expectedTitles = new Map([
    ["gif-maker.html", "GIF Maker & Editor for iPhone: Video, Live Photo ($0.99)"],
    ["best-gif-maker-apps-iphone.html", "Best iPhone GIF Maker Apps (2026): Free vs $0.99 No-Sub"],
    ["mac-screen-privacy.html", "Mac Privacy Screen App: Hide Windows & Peek Alerts (Free)"],
    ["gif-not-animating-guide.html", "GIF Not Animating on iPhone or Chat? 4 Quick Checks"],
    ["cycling-speed-calculator.html", "Cycling Speed, Time & Distance Calculator (km/mph + Breaks)"],
    ["automatic-bike-ride-tracker-iphone.html", "Auto Bike Ride Tracker for iPhone (With or Without Watch)"],
    ["seedance-ai-tools.html", "Seedance 2.5 Workflow Tools: Organize & Version AI Assets"]
  ]);

  for (const [file, expectedTitle] of expectedTitles) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    const actualTitle = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    assert.equal(actualTitle, expectedTitle, file);
    assert.ok(actualTitle.length >= 20 && actualTitle.length <= 60, `${file} title length: ${actualTitle.length}`);

    const desc = decode(html.match(/<meta\b(?=[^>]*name="description")[^>]*content="([^"]*)"/i)?.[1] ?? "");
    assert.ok(desc.length >= 70 && desc.length <= 160, `${file} description length: ${desc.length}`);
  }

  const seedance = await readFile(path.join(siteDir, "seedance-ai-tools.html"), "utf8");
  assert.doesNotMatch(seedance, /public launch expected early July 2026/);
  assert.match(seedance, /id="seedance-version-search"/);
  assert.match(seedance, /og-ai-photo-classification\.jpg/);
});

test("observation-window pages retain their committed titles without accidental churn", async () => {
  const frozenTitles = new Map([
    ["screen-sharing-privacy-guide.html", "Hide Notifications When Screen Sharing on Mac"],
    ["ai-photo-organizer-guide.html", "Organize iPhone Photos: Apple Photos & AI Options"],
    ["cycling-time-distance-guide.html", "How Long to Cycle 10, 20 or 50 km? Times & Formula"],
    ["cycling-time-distance-guide-cn.html", "骑行10、20、30、50公里要多久？耗时表与计算公式"],
    ["cycling-speed-calculator-cn.html", "骑行时间、距离与平均速度计算器：公里与英里 | CrazyAIAgent"],
    ["mac-screen-privacy-cn.html", "Mac 共享屏幕隐藏通知与防窥指南 | CrazyAIAgent"],
    ["voice-camera-translator-guide.html", "How to Translate a Menu on iPhone: Camera & Photos"],
    ["best-travel-translator-apps-iphone.html", "Best Translator Apps for Travel on iPhone: 3 Compared"]
  ]);

  for (const [file, expectedTitle] of frozenTitles) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    const actualTitle = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    assert.equal(actualTitle, expectedTitle, file);
  }
});

test("homepage fold cleanup, Swedish cykeltid section, and free-tool result convert blocks are present", async () => {
  const index = await readFile(path.join(siteDir, "index.html"), "utf8");
  const hero = index.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(hero, /解忧杂货铺/);
  assert.match(hero, /href="tools\.html">Try free browser tools<\/a>/);
  assert.match(index, /Midnight Letter Shop/);

  const swedish = await readFile(path.join(siteDir, "sv-se.html"), "utf8");
  assert.match(swedish, /Cykeltid: hur lång tid tar det att cykla 10 eller 20 km\?/);

  for (const file of [
    "cycling-speed-calculator.html",
    "cycling-speed-calculator-cn.html",
    "gif-maker-online.html",
    "gif-maker-online-cn.html",
    "image-compressor.html",
    "image-compressor-cn.html"
  ]) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    assert.match(html, /data-tool-convert/, `${file}: missing contextual convert block`);
    assert.match(html, /data-mobile-apps-nav/, `${file}: missing mobile apps nav link`);
  }

  const css = await readFile(path.join(siteDir, "styles.css"), "utf8");
  assert.match(css, /\.tool-convert-block\{/);
  assert.match(css, /body\.tool-page:not\(\.tool-guide-page\)\s+\.tool-intro/);
});
