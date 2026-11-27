#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { minifyHtml } from "./minify-html.mjs";
import { isMainSiteHtmlFile } from "./standalone-privacy-pages.mjs";

const origin = "https://www.xiaozhonglvyou.com";
const modifiedDate = "2026-11-27";
const modifiedLabel = "November 27, 2026";

const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function countVisibleWords(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const text = main
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

function setMetaAndTitle(html, { title, description }) {
  if (title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`);
    for (const [attr, name] of [["property", "og:title"], ["name", "twitter:title"]]) {
      const pattern = new RegExp(`<meta\\b(?=[^>]*${attr}=["']${name}["'])[^>]*>`, "i");
      if (pattern.test(html)) {
        html = html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/, `content="${escape(title)}"`));
      }
    }
  }
  if (description) {
    for (const [attr, name] of [["name", "description"], ["property", "og:description"], ["name", "twitter:description"]]) {
      const pattern = new RegExp(`<meta\\b(?=[^>]*${attr}=["']${name}["'])[^>]*>`, "i");
      if (!pattern.test(html)) throw new Error(`Missing meta ${name}`);
      html = html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/, `content="${escape(description)}"`));
    }
  }
  return html;
}

function updateJsonLd(html, mutator) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (_, open, body, close) => {
    const data = JSON.parse(body);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      mutator(node);
      for (const child of Object.values(node)) {
        if (Array.isArray(child)) child.forEach(visit);
        else if (child && typeof child === "object") visit(child);
      }
    };
    if (Array.isArray(data)) data.forEach(visit);
    else visit(data);
    return open + JSON.stringify(data).replaceAll("<", "\\u003c") + close;
  });
}

export function updateTravelTranslator(original) {
  const file = "travel-translator.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "iPhone Travel Translator: Voice, Menu OCR & Offline (Free)";
  const description = "Translate speech, menus, and signs on iPhone with voice, camera OCR, live interpretation, and core offline pairs. Free to download — review limits first.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replace(/(<meta\b(?=[^>]*property="article:modified_time")[^>]*content=")[^"]*(")/, `$1${modifiedDate}$2`);
  html = html.replace(
    /(<p class="article-meta">Updated <time datetime=")[^"]*("[^>]*>)[\s\S]*?(<\/time>)/,
    `$1${modifiedDate}$2${modifiedLabel}$3`
  );
  const words = countVisibleWords(html);
  html = updateJsonLd(html, (node) => {
    if (node["@type"] === "Article") {
      node.headline = title;
      node.description = description;
      node.dateModified = modifiedDate;
      node.wordCount = words;
    }
  });
  return minifyHtml(html);
}

export function updateHappyRideProduct(original) {
  const file = "happyride-auto-ride-tracker.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "Free Auto Bike Ride Tracker for iPhone: No Start Button";
  const description = "Free iPhone bike ride tracker that records qualifying rides automatically with no Start button. Saves GPS routes and Apple Health workouts on iOS & Watch.";
  let html = setMetaAndTitle(original, { title, description });
  html = updateJsonLd(html, (node) => {
    if (node["@type"] === "WebPage") {
      node.name = title;
      node.description = description;
    }
  });
  return minifyHtml(html);
}

export function updateTwoPicProduct(original) {
  const file = "twopic-dual-camera.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "TwoPic Dual Camera App for iPhone: Front & Back ($0.99)";
  const description = "Record front and back iPhone cameras together with TwoPic. Picture-in-picture or split photo and video layouts. $0.99 upfront, no subscription. Check specs.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replace(
    /aria-label="Open TwoPic on App Store \(opens in a new tab\)">Open TwoPic on App Store<\/a>/,
    'aria-label="Get TwoPic Dual Camera ($0.99) on the App Store (opens in a new tab)">Get TwoPic · $0.99</a>'
  );
  html = updateJsonLd(html, (node) => {
    if (node["@type"] === "WebPage") {
      node.name = title;
      node.description = description;
    }
  });
  return minifyHtml(html);
}

export function addHomeExtensionDiscovery(original, locale) {
  const isZh = locale === "zh";
  const href = isZh ? "chrome-extensions-cn.html" : "chrome-extensions.html";
  let html = original;
  if (!isZh) {
    if (!/<section\b[^>]*id="browser-tools"[^>]*>[\s\S]*?href="chrome-extensions\.html"[\s\S]*?<\/section>/.test(html)) {
      const card = '<a class="region-card" href="chrome-extensions.html"><strong>Chrome extensions (free)</strong><span>Mask webpage emails or amounts before screen sharing, or build GIFs from still images.</span></a>';
      html = html.replace(
        /(<section\b[^>]*id="browser-tools"[^>]*>[\s\S]*?<div class="region-grid">[\s\S]*?)(<a class="region-card" href="tools\.html">)/,
        `$1${card}$2`
      );
    }
  } else {
    const card = '<article class="tool-card"><h3><a href="chrome-extensions-cn.html">Chrome 扩展：网页遮挡与 GIF 制作</a></h3><p>共享屏幕前遮挡网页里的邮箱和金额，或把静态图片做成无水印 GIF，两款扩展均可免费安装。</p></article>';
    // Strip any prior misplaced card outside #browser-tools-cn before inserting into #browser-tools-cn
    html = html.replace(card, "");
    if (!/<section\b[^>]*id="browser-tools-cn"[^>]*>[\s\S]*?href="chrome-extensions-cn\.html"[\s\S]*?<\/section>/.test(html)) {
      html = html.replace(
        /(<section\b[^>]*id="browser-tools-cn"[^>]*>[\s\S]*?<div class="tool-card-grid">[\s\S]*?)(<\/div><p><a href="tools-cn\.html">)/,
        `$1${card}$2`
      );
    }
  }
  return minifyHtml(html);
}

function findHeroHighPriorityWebp(html) {
  const heroSections = [...html.matchAll(/<section\b[^>]*class="[^"]*\b(?:hero|page-hero)\b[^"]*"[^>]*>[\s\S]*?<\/section>/gi)];
  for (const [section] of heroSections) {
    for (const [picture] of section.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi)) {
      if (!/\bfetchpriority="high"/i.test(picture)) continue;
      const sourceMatch = picture.match(/<source\b[^>]*type="image\/webp"[^>]*srcset="([^"\s,]+)"/i)
        || picture.match(/<source\b[^>]*srcset="([^"\s,]+)"[^>]*type="image\/webp"/i);
      if (sourceMatch?.[1]?.endsWith(".webp")) return sourceMatch[1];
    }
    for (const [img] of section.matchAll(/<img\b[^>]*fetchpriority="high"[^>]*>/gi)) {
      const src = img.match(/\bsrc="([^"]+)"/i)?.[1] ?? "";
      if (src.endsWith(".webp")) return src;
    }
  }
  return null;
}

export function ensureHeroImagePreload(html) {
  if (/<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])[^>]*>/i.test(html)) {
    return html;
  }
  const webp = findHeroHighPriorityWebp(html);
  if (!webp) return html;
  const preload = `<link rel="preload" href="${webp}" as="image" type="image/webp" fetchpriority="high">`;
  if (!/<link\b[^>]*rel="stylesheet"[^>]*>/i.test(html)) return html;
  return html.replace(/(<link\b[^>]*rel="stylesheet"[^>]*>)/i, `${preload}$1`);
}

const targetedUpdaters = new Map([
  ["travel-translator.html", updateTravelTranslator],
  ["happyride-auto-ride-tracker.html", updateHappyRideProduct],
  ["twopic-dual-camera.html", updateTwoPicProduct],
  ["index.html", (html) => addHomeExtensionDiscovery(html, "en")],
  ["zh-cn.html", (html) => addHomeExtensionDiscovery(html, "zh")]
]);

export async function applyCtrConversion20261127(siteDir) {
  const htmlFiles = (await readdir(siteDir))
    .filter((file) => isMainSiteHtmlFile(file) && file !== "404.html")
    .sort();
  const updatedFiles = [];
  let preloadsAdded = 0;

  for (const file of htmlFiles) {
    const target = path.join(siteDir, file);
    const before = await readFile(target, "utf8");
    let after = before;
    const updater = targetedUpdaters.get(file);
    if (updater) after = updater(after);
    const beforePreload = after;
    after = ensureHeroImagePreload(after);
    if (after !== beforePreload) preloadsAdded += 1;
    if (after !== before) {
      await writeFile(target, after, "utf8");
      updatedFiles.push(file);
    }
  }

  console.log(`CTR & conversion 2026-11-27: updated ${updatedFiles.length} pages (${preloadsAdded} hero WebP preloads added).`);
  return { updatedFiles, preloadsAdded };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const index = process.argv.indexOf("--site-dir");
  const siteDir = path.resolve(index < 0 ? process.env.SITE_DIR ?? path.join(import.meta.dirname, "..") : process.argv[index + 1]);
  await applyCtrConversion20261127(siteDir);
}
