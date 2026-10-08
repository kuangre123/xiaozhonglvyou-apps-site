import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { updateGifmakerRelease } from "./apply-gifmaker-release.mjs";

const site = new URL("../", import.meta.url);

function nodes(html) {
  const result = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;
    if (node["@type"]) result.push(node);
    Object.values(node).forEach(visit);
  };
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) visit(JSON.parse(json));
  return result;
}

test("GIFmaker published product entities use the verified 1.1.6 release", async () => {
  for (const file of ["index.html", "gif-maker.html", "gif-maker-cn.html", "best-gif-maker-apps-iphone.html", "make-gif-on-iphone-guide.html"]) {
    const html = await readFile(new URL(file, site), "utf8");
    const app = nodes(html).find((node) => node["@type"] === "SoftwareApplication" && node.url?.includes("/id6783559364"));
    assert.ok(app, `${file}: missing GIFmaker entity`);
    assert.equal(app.softwareVersion, "1.1.6", file);
    assert.ok(Array.isArray(app.availableLanguage), `${file}: missing language list`);
    for (const language of ["Japanese", "German", "Spanish"]) assert.ok(app.availableLanguage.includes(language), `${file}: ${language}`);
    assert.equal(Number(app.offers.price), 0.99);
  }
});

test("release synchronization is idempotent and leaves title/canonical intent intact", async () => {
  for (const file of ["index.html", "gif-maker.html", "gif-maker-cn.html", "media-kit.html"]) {
    const original = await readFile(new URL(file, site), "utf8");
    const once = updateGifmakerRelease(file, original);
    assert.equal(updateGifmakerRelease(file, once), once, file);
    assert.equal(once.match(/<title>[^<]*<\/title>/)?.[0], original.match(/<title>[^<]*<\/title>/)?.[0]);
    assert.equal(once.match(/<link rel="canonical"[^>]+>/)?.[0], original.match(/<link rel="canonical"[^>]+>/)?.[0]);
    assert.equal((once.match(/data-gifmaker-languages=/g) ?? []).length, file.startsWith("gif-maker") ? 1 : 0);
  }
});

test("GIFmaker product copy and media facts do not advertise the old release", async () => {
  for (const file of ["gif-maker.html", "gif-maker-cn.html", "media-kit.html", "index.html"]) {
    const html = await readFile(new URL(file, site), "utf8");
    assert.doesNotMatch(html, /1\.1\.4/, file);
    assert.match(html, /1\.1\.6/, file);
  }
  for (const file of ["gif-maker.html", "gif-maker-cn.html"]) {
    const html = await readFile(new URL(file, site), "utf8");
    assert.match(html, /data-gifmaker-languages="1\.1\.6"/);
    assert.equal(nodes(html).find((node) => node["@type"] === "WebPage").dateModified, "2026-10-08");
  }
});

test("priority markets advertise GIFmaker localization without inventing Turkish support", async () => {
  const japanese = await readFile(new URL("ja-jp.html", site), "utf8");
  const german = await readFile(new URL("de-de.html", site), "utf8");
  const turkish = await readFile(new URL("tr-tr.html", site), "utf8");
  assert.match(japanese, /GIFmaker 1\.1\.6は日本語/);
  assert.doesNotMatch(japanese, /GIFmakerとHappyRideにも日本語UIの掲載はありません/);
  assert.match(german, /GIFmaker 1\.1\.6 bietet Deutsch/);
  assert.match(turkish, /GIFmaker 1\.1\.6/);
  assert.match(turkish, /GIFmaker ve HappyRide için Türkçe arayüz listelenmiyor/);
  const mexico = await readFile(new URL("es-mx.html", site), "utf8");
  assert.match(mexico, /GIFmaker 1\.1\.6 incluye español/);
  assert.doesNotMatch(mexico, /GIFmaker y HappyRide no se presentan aquí como apps con interfaz en español/);
  for (const html of [japanese, german, turkish, mexico]) {
    assert.equal(nodes(html).find((node) => node["@type"] === "WebPage").dateModified, "2026-10-08");
  }
});

test("existing snippet updater migrates the prior price-check date without losing release copy", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "gifmaker-snippet-migration-"));
  try {
    const html = await readFile(new URL("gif-maker.html", site), "utf8");
    await writeFile(path.join(directory, "gif-maker.html"), html.replaceAll("October 8, 2026", "October 2, 2026"));
    const result = spawnSync(process.execPath, [fileURLToPath(new URL("./apply-ctr-snippet-optimizations.mjs", import.meta.url)), "--site-dir", directory, "--file", "gif-maker.html"], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const updated = await readFile(path.join(directory, "gif-maker.html"), "utf8");
    assert.ok(updated.includes("checked on October 8, 2026"));
    assert.ok(updated.includes('data-gifmaker-languages="1.1.6"'));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
