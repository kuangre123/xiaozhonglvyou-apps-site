import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const site = path.resolve(import.meta.dirname, "..");
const file = "iphone-photo-cleaner-comparison.html";
const html = await readFile(path.join(site, file), "utf8");
const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });

test("comparison keeps its established intent, canonical, and synchronized freshness", async () => {
  assert.ok(html.includes("<title>Best Photo Cleaner App for iPhone: 3 Compared (2026)</title>"));
  assert.ok(html.includes(`rel="canonical" href="https://www.xiaozhonglvyou.com/${file}"`));
  assert.ok(html.includes('href="best-iphone-photo-cleaner-app.html">free iPhone photo cleaner guide</a>'));
  assert.ok(html.includes('Updated <time datetime="2026-10-03">October 3, 2026</time>'));
  assert.ok(html.includes('article:modified_time" content="2026-10-03"'));
  const article = nodes.find((node) => node["@type"] === "Article");
  assert.equal(article.headline, "Best Photo Cleaner App for iPhone: 3 Compared (2026)");
  assert.ok(article.keywords.includes("best photo cleaner app for iPhone"));
  assert.equal(article.dateModified, "2026-10-03");
  assert.equal(article.citation.length, 6);
  const decision = await readFile(path.join(site, "best-iphone-photo-cleaner-app.html"), "utf8");
  assert.ok(decision.includes("Free iPhone Photo Cleaner App: Limits &amp; Pro (2026)"));
});

test("free baseline, safe review, local languages, and current listing facts are visible", () => {
  for (const id of ["apple-photos", "duplicates-vs-similar"]) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1);
  }
  assert.ok(html.includes('href="#apple-photos"'));
  assert.ok(html.includes('href="https://support.apple.com/en-us/104967"'));
  assert.ok(html.includes('href="https://support.apple.com/en-us/102260"'));
  assert.ok(html.includes('href="https://developer.apple.com/documentation/PhotoKit/delivering-an-enhanced-privacy-experience-in-your-photos-app"'));
  for (const localized of ["ja-jp-best-iphone-photo-cleaner.html", "de-de-beste-iphone-foto-cleaner.html", "tr-tr-en-iyi-iphone-fotograf-temizleme.html"]) {
    assert.ok(html.includes(`href="${localized}"`));
  }
  assert.ok(html.includes("6.22.0"));
  assert.ok(html.includes(">5.32<"));
  assert.ok(html.includes("Japanese and German listed; Turkish not listed"));
  assert.ok(html.includes("Face ID Private Vault, Live Photo Slimming, burst review"));
  assert.ok(!html.includes("Siri shortcuts"));
  assert.ok(!html.includes("verified August 2026"));
  for (const [, row] of html.matchAll(/<div role="row">([\s\S]*?)<\/div>/g)) {
    assert.equal([...row.matchAll(/role="(?:cell|columnheader)"/g)].length, 4, row);
  }
});

test("all seven FAQs match visible answers and preserve free-use and recovery limits", () => {
  const faq = nodes.find((node) => node["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 7);
  for (const q of faq.mainEntity) assert.ok(html.includes(`<summary>${q.name}</summary><p>${q.acceptedAnswer.text}</p>`));
  const pricing = faq.mainEntity.find((q) => q.name.includes("pricing"));
  assert.match(pricing.acceptedAnswer.text, /one successful in-app cleanup action across eligible tools/);
  const deletion = faq.mainEntity.find((q) => q.name.includes("automatically"));
  assert.match(deletion.acceptedAnswer.text, /not a daily free-deletion allowance/);
  const privacy = faq.mainEntity.find((q) => q.name.includes("privacy labels"));
  assert.match(privacy.acceptedAnswer.text, /not verified by Apple/);
  const recovery = faq.mainEntity.find((q) => q.name.includes("iCloud"));
  assert.match(recovery.acceptedAnswer.text, /30 days/);
  assert.match(recovery.acceptedAnswer.text, /not just clearing a local cache/);
});

test("comparison content regeneration is idempotent without duplicating sections or FAQs", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "photo-comparison-current-"));
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
    assert.equal([...afterFirst.matchAll(/id="apple-photos"/g)].length, 1);
    assert.equal([...afterFirst.matchAll(/<summary>/g)].length, 7);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});
