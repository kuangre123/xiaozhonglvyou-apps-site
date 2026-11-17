import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { frenchPhotoFile, frenchPhotoFaq, updateFrenchPhotoWorkflow } from "./french-photo-workflow.mjs";

const site = new URL("../", import.meta.url);
test("French workflow keeps the established page identity, media and publication date", async () => {
  const original = execFileSync("git", ["show", `f6ef469:${frenchPhotoFile}`], { cwd: site, encoding: "utf8" });
  const html = updateFrenchPhotoWorkflow(original);
  for (const pattern of [/<title>[\s\S]*?<\/title>/, /<h1>[\s\S]*?<\/h1>/, /<link rel="canonical"[^>]*>/, /"datePublished":"[^"]+"/, /<div class="page-hero-media">[\s\S]*?<\/div>/]) {
    assert.equal(html.match(pattern)?.[0], original.match(pattern)?.[0]);
  }
  assert.deepEqual([...html.matchAll(/<link rel="alternate" hreflang="[^"]+"[^>]*>/g)].map(([tag]) => tag), [...original.matchAll(/<link rel="alternate" hreflang="[^"]+"[^>]*>/g)].map(([tag]) => tag));
  assert.equal(updateFrenchPhotoWorkflow(html), html, "second generation must not duplicate steps or links");
  assert.throws(() => updateFrenchPhotoWorkflow(original.replace(`rel="canonical" href="https://www.xiaozhonglvyou.com/${frenchPhotoFile}"`, 'rel="canonical" href="https://www.xiaozhonglvyou.com/wrong.html"')), /canonical/);
});

test("French page exposes a built-in path, correct Pro boundary and matching FAQ markup", async () => {
  const html = await readFile(new URL(frenchPhotoFile, site), "utf8");
  const steps = html.match(/<section\b[^>]*id="doublons-sans-app"[\s\S]*?<\/section>/)[0];
  assert.equal((steps.match(/<li>/g) ?? []).length, 5);
  assert.match(html, /href="#doublons-sans-app"/);
  assert.match(html, /href="#classement-ia-pro"/);
  assert.match(html, /catégorisation automatique à Pro/);
  assert.match(html, /datetime="2026-11-18">18 novembre 2026/);
  assert.match(steps, /verrouillé/);
  assert.match(steps, /Photos iCloud/);
  assert.match(steps, /30 jours/);
  const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
  const faq = nodes.find((n) => n["@type"] === "FAQPage");
  assert.deepEqual(faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]), frenchPhotoFaq);
  assert.equal((html.match(/<details\b/g) ?? []).length, frenchPhotoFaq.length);
  const article = nodes.find((n) => n["@type"] === "Article");
  assert.equal(article.datePublished, "2026-06-07");
  assert.equal(article.dateModified, "2026-11-18");
  assert.equal(article.about[0].offers.priceCurrency, "EUR");
  for (const citation of article.citation) assert.ok(html.includes(`href="${citation}"`));
  for (const [tag] of html.matchAll(/<a\b[^>]*href="https:\/\/apps.apple.com\/[^>]*>/g)) {
    assert.match(tag, /apps.apple.com\/fr\//);
    assert.match(tag, /data-analytics-event="app_store_click"/);
    assert.match(tag, /data-store-country="fr"/);
  }
});
