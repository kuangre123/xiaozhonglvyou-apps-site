import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { applyInternationalSearch } from "./apply-international-search.mjs";
import { internationalSearchMarkets } from "./international-search-content.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");
test("market updates preserve page identity and become stable after one run", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "international-search-"));
  try {
    await writeFile(path.join(dir, "styles.css"), await readFile(path.join(siteDir, "styles.css")));
    const files = [...internationalSearchMarkets.map((m) => m.file), "netherlands-nordics-apps.html"];
    const originals = new Map();
    for (const file of files) {
      const html = await readFile(path.join(siteDir, file), "utf8");
      originals.set(file, html);
      await writeFile(path.join(dir, file), html);
    }
    await writeFile(path.join(dir, "unrelated.html"), "<main>Preserve this page</main>");
    await applyInternationalSearch(dir);
    const first = new Map();
    for (const m of internationalSearchMarkets) {
      const html = await readFile(path.join(dir, m.file), "utf8");
      first.set(m.file, html);
      for (const pattern of [/<title>[\s\S]*?<\/title>/, /<h1\b[^>]*>[\s\S]*?<\/h1>/, /<link rel="canonical"[^>]*>/, /<html\b[^>]*>/]) {
        assert.equal(html.match(pattern)?.[0], originals.get(m.file).match(pattern)?.[0], `${m.file} identity`);
      }
      assert.equal((html.match(/id="local-task-help"/g) ?? []).length, 1);
      assert.ok(html.includes(`lang="${m.lang}" aria-labelledby="local-task-help-title"`));
      assert.ok(html.includes('cycling-speed-calculator.html?mode=time#ride-tool'));
      if (["es", "gb"].includes(m.country)) {
        const catalog = html.match(/<section\b[^>]*id="international-app-catalog"[\s\S]*?<\/section>/)?.[0] ?? "";
        const links = [...catalog.matchAll(/<a\b[^>]*data-analytics-event="app_store_click"[^>]*>/g)].map(([tag]) => tag);
        assert.equal(links.length, 9);
        const ids = links.map((tag) => tag.match(/\/id(\d+)/)?.[1]);
        assert.equal(new Set(ids).size, 9);
        for (const link of links) {
          assert.ok(link.includes(`apps.apple.com/${m.country}/`));
          assert.ok(link.includes(`data-store-country="${m.country}"`));
          assert.ok(link.includes('rel="noopener noreferrer"'));
        }
      }
    }
    const shared = await readFile(path.join(dir, "netherlands-nordics-apps.html"), "utf8");
    assert.ok(shared.includes('href="nl-nl.html" hreflang="nl-NL"'));
    assert.ok(shared.includes('href="sv-se.html" hreflang="sv-SE"'));
    assert.doesNotMatch(shared, /lang="sv-SE" aria-labelledby="(?:happyride-local-rides|regional-app-directory)-title"/);
    first.set("netherlands-nordics-apps.html", shared);
    await applyInternationalSearch(dir);
    for (const [file, html] of first) assert.equal(await readFile(path.join(dir, file), "utf8"), html, `${file} idempotency`);
    assert.equal(await readFile(path.join(dir, "unrelated.html"), "utf8"), "<main>Preserve this page</main>");
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("Dutch page has reciprocal regional alternates and local storefronts", async () => {
  const html = await readFile(path.join(siteDir, "nl-nl.html"), "utf8");
  assert.match(html, /<html lang="nl-NL">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www.xiaozhonglvyou.com\/nl-nl.html">/);
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
  assert.equal(alternates.length, 34);
  const targets = new Set(alternates.map(([, , href]) => href));
  for (const target of targets) {
    const filename = target.endsWith(".html") ? target.split("/").at(-1) : "index.html";
    const peer = await readFile(path.join(siteDir, filename), "utf8");
    assert.ok(peer.includes('hreflang="nl-NL" href="https://www.xiaozhonglvyou.com/nl-nl.html"'), filename);
  }
  const stores = [...html.matchAll(/<a\b[^>]*href="https:\/\/apps.apple.com\/([^/]+)\/[^>]*>/g)].map(([tag, country]) => ({ tag, country }));
  assert.equal(stores.length, 11);
  assert.ok(stores.every((store) => store.country === "nl" && store.tag.includes('data-store-country="nl"')));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, body]) => { const data = JSON.parse(body); return data["@graph"] ?? [data]; });
  const faq = schemas.find((n) => n["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 6);
  for (const question of faq.mainEntity) assert.ok(html.includes(question.name));
});
