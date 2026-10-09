import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const filename = "make-gif-on-iphone-guide.html";
const html = await readFile(new URL(`../${filename}`, import.meta.url), "utf8");
const generator = fileURLToPath(new URL("./apply-ctr-snippet-optimizations.mjs", import.meta.url));
const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });
const section = (source, id) => source.match(new RegExp(`<section\\b[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/section>`))?.[0];

test("GIF guide explains preview, saving the generated result and actual sharing limits", () => {
  const workflow = section(html, "make-gif-with-shortcuts");
  assert.ok(workflow);
  assert.equal([...workflow.matchAll(/<strong>\d\. /g)].length, 4);
  for (const text of ["Select Multiple", "at least two different still images", "Quick Look", "Close the preview to continue", "GIF produced by Make GIF", "Renaming a JPG to .gif does not create"]) {
    assert.ok(workflow.includes(text), `Missing workflow check: ${text}`);
  }
  assert.ok(!workflow.includes("Add Make GIF after Select Photos and preview the animated result."));
  const sharing = section(html, "gif-sharing-checks");
  for (const text of ["Only one image changes nothing", "Save File input", "receiving device", "Live Photo sent through Mail becomes a still image", "not the same as an exported GIF"]) {
    assert.ok(sharing?.includes(text), `Missing output check: ${text}`);
  }
  for (const id of ["make-gif-with-shortcuts", "make-gif-steps", "gif-sharing-checks"]) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1);
    assert.ok(html.includes(`href="#${id}"`));
  }
  for (const source of [
    "https://support.apple.com/en-au/104966",
    "https://support.apple.com/en-euro/guide/shortcuts/apd84c576f8c/ios",
    "https://support.apple.com/en-euro/guide/shortcuts/apda75604f37/ios"
  ]) assert.ok(html.includes(`href="${source}"`));
  assert.ok(!html.includes("https://support.apple.com/en-us/105029"));
});

test("output checks preserve GIF guide intent, video HowTo, FAQs, media and product price", () => {
  assert.ok(html.includes("<title>How to Create an Animated GIF on iPhone (2026)</title>"));
  assert.ok(html.includes(`<link rel="canonical" href="https://www.xiaozhonglvyou.com/${filename}">`));
  const article = nodes.find((node) => node["@type"] === "Article");
  assert.equal(article.datePublished, "2026-08-10");
  assert.equal(article.dateModified, "2026-10-09");
  assert.ok(html.includes('article:modified_time" content="2026-10-09"'));
  assert.ok(html.includes('Updated <time datetime="2026-10-09">October 9, 2026</time>'));
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  const words = main.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  assert.equal(article.wordCount, words);
  const howTo = nodes.find((node) => node["@type"] === "HowTo");
  assert.equal(howTo.step.length, 5);
  assert.equal(howTo.name, "How to make a GIF on iPhone from video");
  for (const step of howTo.step) {
    assert.ok(html.includes(`id="${step.url.split("#")[1]}"`));
    assert.ok(html.includes(`<strong>${step.position}. ${step.name}</strong><p>${step.text}</p>`));
  }
  const faq = nodes.find((node) => node["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 5);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(`<summary>${question.name}</summary><p>${question.acceptedAnswer.text}</p>`));
  }
  for (const image of ["gifmaker-editor-screen.webp", "gifmaker-export-screen.webp"]) {
    assert.ok(html.includes(`src="assets/${image}"`));
  }
  assert.equal(article.about[0].offers.price, "0.99");
  assert.ok(html.includes('data-store-product="gifmaker-gif-studio"'));
});

test("GIF output-check generation is idempotent and migrates existing or absent Shortcuts sections", async () => {
  const legacy = [
    '<section class="section content-section alt-section" id="make-gif-with-shortcuts"><div class="section-inner content-grid"><div>',
    '<p class="section-kicker">Built-in GIF file</p><h2>Make a GIF from photos with Shortcuts.</h2>',
    "<p>Open Shortcuts and build a workflow with Select Photos, Make GIF, then Save File. Choose several still photos, run the shortcut, and save the result to Files. Open the saved file to check its animation and .gif extension.</p>",
    '<p>Apple documents the <a href="https://support.apple.com/guide/shortcuts/intro-to-shortcuts-apdf22b0444c/ios" target="_blank" rel="noopener noreferrer">Make GIF action</a> and <a href="https://support.apple.com/guide/shortcuts/apdaf74d75a5/ios" target="_blank" rel="noopener noreferrer">Save File action</a> in Shortcuts.</p>',
    '</div><div class="content-list"><div><strong>1. Select photos</strong><p>Add Select Photos and enable multiple selection. Choose the still images when you run the shortcut.</p></div>',
    '<div><strong>2. Make GIF</strong><p>Add Make GIF after Select Photos and preview the animated result.</p></div>',
    '<div><strong>3. Save the file</strong><p>Add Save File after Make GIF, choose a location in Files, and confirm the saved file is a .gif.</p></div></div></div></section>'
  ].join("");
  const currentSection = section(html, "make-gif-with-shortcuts");
  const withoutSharing = html.replace(section(html, "gif-sharing-checks"), "");
  const fixtures = [html, withoutSharing.replace(currentSection, legacy), withoutSharing.replace(currentSection, "")];
  const directory = await mkdtemp(path.join(tmpdir(), "gif-output-checks-"));
  try {
    for (const fixture of fixtures) {
      const file = path.join(directory, filename);
      await writeFile(file, fixture);
      execFileSync(process.execPath, [generator, "--site-dir", directory, "--file", filename]);
      const first = await readFile(file, "utf8");
      assert.equal(first, html);
      execFileSync(process.execPath, [generator, "--site-dir", directory, "--file", filename]);
      assert.equal(await readFile(file, "utf8"), first);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
