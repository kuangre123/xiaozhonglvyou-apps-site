import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
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

test("Inkstone shares its branded image and identifies the real app screenshot", async () => {
  const origin = "https://www.xiaozhonglvyou.com";
  const socialImage = `${origin}/assets/og-inkstone-notes.jpg`;
  const screenshot = `${origin}/assets/inkstone-editor-screen.webp`;
  assert.ok(html.includes(`<meta property="og:image" content="${socialImage}">`));
  assert.ok(html.includes(`<meta property="og:image:secure_url" content="${socialImage}">`));
  assert.ok(html.includes(`<meta name="twitter:image" content="${socialImage}">`));
  assert.match(html, /twitter:image:alt" content="Inkstone Notes Markdown with its real iPhone editor/);

  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? "null");
  const webPage = schema["@graph"].find((entity) => entity["@type"] === "WebPage");
  const app = schema["@graph"].find((entity) => entity["@type"] === "SoftwareApplication");
  assert.equal(webPage.primaryImageOfPage["@type"], "ImageObject");
  assert.equal(webPage.primaryImageOfPage.url, screenshot);
  assert.equal(webPage.primaryImageOfPage.width, 520);
  assert.equal(webPage.primaryImageOfPage.height, 1130);
  assert.deepEqual(app.screenshot, [screenshot]);

  const image = await stat(new URL("../assets/og-inkstone-notes.jpg", import.meta.url));
  assert.ok(image.size > 10000 && image.size <= 100000, "social image stays within the JPEG budget");
  const source = await readFile(new URL("./inkstone-social-preview.html", import.meta.url), "utf8");
  assert.match(source, /src="\.\.\/assets\/inkstone-editor-screen\.webp"/);
  assert.match(source, /src="\.\.\/assets\/inkstone-icon\.webp"/);
});

test("Inkstone explains export choices without promising a portable linked vault", () => {
  assert.match(html, /<title>Inkstone Notes: Markdown Files on iPhone<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/www\.xiaozhonglvyou\.com\/inkstone-markdown-notes\.html"/);
  const section = html.match(/<section\b[^>]*id="inkstone-export-options"[^>]*>(.*?)<\/section>/s)?.[1];
  assert.ok(section, "export workflow has a stable section anchor");
  assert.match(section, /Export Markdown from iPhone as PDF or HTML/);
  assert.match(section, /Export as PDF/);
  assert.match(section, /Export as HTML/);
  assert.match(section, /Copy Styled/);
  assert.match(section, /attachments folder/);
  assert.match(section, /Share Markdown sends source text, not a \.md file/);

  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? "null");
  const faq = schema["@graph"].find((entity) => entity["@type"] === "FAQPage");
  assert.equal(faq.mainEntity.length, 6);
  assert.ok(faq.mainEntity.some((entry) => entry.name === "How do I export a Markdown note as PDF on iPhone?"));
  const wikiLinks = faq.mainEntity.find((entry) => entry.name === "Will wiki links still open my other notes in an export?");
  assert.match(wikiLinks.acceptedAnswer.text, /display text rather than links into your note collection/);
  assert.match(html, /When iCloud Drive syncing is enabled and available/);
  assert.doesNotMatch(html, /Every note is an ordinary \.md file in iCloud Drive/);
});
