import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const currentName = "Laleme - Health Tracker";
const oldName = /Lailemma - Period &(?:amp;)? Fertility/;
const read = file => readFile(new URL(`../${file}`, import.meta.url), "utf8");
const schema = html => JSON.parse(html.match(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);

test("home and app cards use the current Laleme name without changing destinations", async () => {
  for (const file of ["index.html", "apps.html"]) {
    const html = await read(file);
    const card = html.match(/<article[^>]*data-new-app-card="lailemma-period-fertility"[\s\S]*?<\/article>/)?.[0];
    assert.ok(card);
    assert.ok(card.includes(`<h3>${currentName}</h3>`));
    assert.ok(card.includes(`alt="${currentName} icon"`));
    assert.ok(card.includes(`aria-label="${currentName} on the App Store (opens in a new tab)"`));
    assert.ok(card.includes('href="lailemma-period-tracker.html"'));
    assert.ok(card.includes('data-store-product="lailemma-period-fertility"'));
    assert.match(card, /id6775935474/);
    assert.doesNotMatch(card, oldName);
    assert.match(card, /formerly Lailemma/);
  }
});

test("support identifies nine apps rather than counting the old name as a tenth", async () => {
  const html = await read("support.html");
  const about = schema(html).about;
  assert.equal(about.length, 9);
  assert.equal(new Set(about).size, 9);
  assert.ok(about.includes(currentName));
  assert.ok(about.includes("Inkstone Notes Markdown"));
  assert.ok(about.includes("TwoPic Dual Camera"));
  assert.doesNotMatch(html, oldName);
  assert.match(html, /id="support-lailemma"/);
});

test("the product entity retains the historical name as an alias, not a duplicate app", async () => {
  const html = await read("lailemma-period-tracker.html");
  const app = schema(html)["@graph"].find(node => node["@type"] === "SoftwareApplication");
  assert.equal(app.name, currentName);
  assert.ok(app.alternateName.includes("Lailemma - Period & Fertility"));
  assert.ok(app.alternateName.includes("来了么"));
  assert.match(html, /rel="canonical" href="https:\/\/www\.xiaozhonglvyou\.com\/lailemma-period-tracker\.html"/);
});
