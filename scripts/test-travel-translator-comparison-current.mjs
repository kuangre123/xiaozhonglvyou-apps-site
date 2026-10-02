import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const site = path.resolve(import.meta.dirname, "..");
const file = "best-travel-translator-apps-iphone.html";
const html = await readFile(path.join(site, file), "utf8");
const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });
const article = nodes.find((node) => node["@type"] === "Article");

function countVisibleWords(value) {
  const main = value.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? value;
  const text = main
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text ? text.split(/\s+/).length : 0;
}

test("translator comparison retains its target intent and synchronized update date", () => {
  assert.ok(html.includes(`<title>Best Translator App for iPhone: 3 Compared (2026)</title>`));
  assert.ok(html.includes('rel="canonical" href="https://www.xiaozhonglvyou.com/best-travel-translator-apps-iphone.html"'));
  assert.ok(html.includes('Updated <time datetime="2026-10-03">October 3, 2026</time>'));
  assert.ok(html.includes('article:modified_time" content="2026-10-03"'));
  assert.equal(article.dateModified, "2026-10-03");
  assert.equal(article.headline, "Best Translator App for iPhone: 3 Compared (2026)");
});

test("comparison reflects current official store facts without conflating language counts", () => {
  assert.match(html, /Translation Specialist: Speak; this comparison uses Translation Specialist for brevity/);
  assert.match(html, /current US App Store listings on <time datetime="2026-10-03">October 3, 2026<\/time>/);
  assert.match(html, /Store copy advertises 20 app languages; App Store language metadata lists English plus 7 more; live interpretation is separately described as supporting 17 languages/);
  assert.match(html, /US App Store size at check date[\s\S]*?308\.3 MB[\s\S]*?986\.8 MB; check available storage and download on Wi-Fi/);
  assert.match(html, /Version 2\.2\.3, released September 7, 2026, requires iOS 17\.4 or later/);
  assert.match(html, /US App Store listing requires iOS 18 or later/);
  assert.ok(!html.includes("20 app interface languages"));
  for (const url of [
    "https://apps.apple.com/us/app/google-translate/id414706506",
    "https://apps.apple.com/us/app/translation-specialist/id6755734543",
    "https://support.google.com/translate/answer/6142473",
    "https://support.apple.com/guide/iphone/translate-with-the-camera"
  ]) {
    assert.ok(html.includes(url), `missing first-party source: ${url}`);
  }
});

test("matrix rows and Article word count stay structurally synchronized", () => {
  assert.ok(article);
  assert.equal(article.wordCount, countVisibleWords(html));
  for (const [, row] of html.matchAll(/<div role="row">([\s\S]*?)<\/div>/g)) {
    assert.equal([...row.matchAll(/role="(?:cell|columnheader)"/g)].length, 4, row);
  }
});

test("translator comparison content regeneration is idempotent", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "translator-comparison-current-"));
  try {
    await writeFile(path.join(temp, file), html);
    const args = [path.join(site, "scripts", "apply-ctr-snippet-optimizations.mjs"), "--site-dir", temp, "--file", file];
    const first = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(first.status, 0, first.stderr);
    const afterFirst = await readFile(path.join(temp, file), "utf8");
    const second = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stdout, /Updated 0 CTR-focused pages/);
    assert.equal(await readFile(path.join(temp, file), "utf8"), afterFirst);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
