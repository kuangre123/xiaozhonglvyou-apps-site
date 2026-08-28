import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");

const pageKeywords = new Map([
  ["directory.html", "App page directory, iPhone app guides, photo cleaner guides, travel translator guides, Mac privacy app guides, App Store market pages"],
  ["privacy.html", "app privacy, iPhone app permissions, photo privacy, on-device photo processing, Apple Health permissions, Mac screen privacy"],
  ["search.html", "search iPhone apps, photo cleaner guides, travel translator apps, Mac privacy apps, App Store app directory"],
  ["support.html", "app support, iPhone app support, Mac app support, AI photo cleaner support, GIF maker support, bike ride tracker support, travel translator support"]
]);

function updateKeywords(html, keywords, fileName) {
  const keywordsPattern = /<meta\b(?=[^>]*name=["']keywords["'])[^>]*>/i;
  const descriptionPattern = /<meta\b(?=[^>]*name=["']description["'])[^>]*>/i;

  if (keywordsPattern.test(html)) {
    return html.replace(keywordsPattern, (tag) => tag.replace(/content=(['"])[^'"]*\1/i, `content="${keywords}"`));
  }

  if (!descriptionPattern.test(html)) {
    throw new Error(`Cannot add keywords to ${fileName}: meta description is missing`);
  }

  return html.replace(descriptionPattern, (descriptionTag) => `${descriptionTag}<meta name="keywords" content="${keywords}">`);
}

let changed = 0;

for (const [fileName, keywords] of pageKeywords) {
  const filePath = path.join(siteDir, fileName);
  const original = await readFile(filePath, "utf8");
  const updated = updateKeywords(original, keywords, fileName);

  if (updated === original) continue;
  await writeFile(filePath, updated, "utf8");
  changed += 1;
}

console.log(`Applied topic keywords to ${pageKeywords.size} public pages; changed ${changed}.`);
