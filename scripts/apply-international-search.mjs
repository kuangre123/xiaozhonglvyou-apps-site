#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { internationalSearchMarkets, additionalMarketCatalogs } from "./international-search-content.mjs";
import { internationalStoreFacts } from "./international-store-facts.mjs";
import { minifyHtml } from "./minify-html.mjs";
import { isMainSiteHtmlFile } from "./standalone-privacy-pages.mjs";

const origin = "https://www.xiaozhonglvyou.com";
const products = [
  ["6768019606", "AI Cleaning", "iphone-photo-cleaner.html", "ai-cleaning-photo-cleaner"],
  ["6755734543", "Translation Specialist", "travel-translator.html", "translation-specialist"],
  ["6761301764", "Anti-spy screen", "mac-screen-privacy.html", "anti-spy-screen", true],
  ["6766485393", "Anti-spy screen Lite", "mac-screen-privacy.html#lite", "anti-spy-screen-lite", true],
  ["6783559364", "GIFmaker", "gif-maker.html", "gifmaker-gif-studio"],
  ["6786365305", "HappyRide", "happyride-auto-ride-tracker.html", "happyride-auto-ride-tracker"],
  ["6810287923", "Inkstone Notes Markdown", "inkstone-markdown-notes.html", "inkstone-notes-markdown"],
  ["6800405096", "TwoPic Dual Camera", "twopic-dual-camera.html", "twopic-dual-camera"],
  ["6775935474", "Lele Health", "lailemma-period-tracker.html", "lailemma-period-fertility"]
];
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const sectionPattern = (id) => new RegExp(`<section\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>[\\s\\S]*?<\\/section>`, "gi");
function upsert(html, id, section) {
  const stripped = html.replace(sectionPattern(id), "");
  if (!stripped.includes("</main>")) throw new Error(`Missing main for ${id}`);
  return stripped.replace("</main>", `${section}</main>`);
}
function guideLink(href, label, lang, market) {
  const suffix = lang === "en" && !market.lang.startsWith("en") ? ` (${market.english})` : "";
  return `<a href="${escape(href)}" hreflang="${lang}">${escape(label + suffix)}</a>`;
}
function taskSection(m) {
  const list = (items) => `<ol>${items.map((x) => `<li>${escape(x)}</li>`).join("")}</ol>`;
  return `<section class="section content-section alt-section" id="local-task-help" lang="${m.lang}" aria-labelledby="local-task-help-title"><div class="section-inner"><div class="section-heading"><div><h2 id="local-task-help-title">${escape(m.title)}</h2></div><p>${escape(m.intro)}</p></div><div class="market-product-grid"><article class="market-product"><div><h3>${escape(m.photoTitle)}</h3>${list(m.photo)}</div><p>${guideLink(...m.photoLink, m)}</p></article><article class="market-product"><div><h3>${escape(m.menuTitle)}</h3>${list(m.menu)}</div><p>${guideLink("voice-camera-translator-guide.html", m.menuLink, "en", m)}</p></article><article class="market-product"><div><h3>${escape(m.rideTitle)}</h3><p>${escape(m.ride)}</p></div><p>${guideLink("cycling-speed-calculator.html?mode=time#ride-tool", m.rideLink, "en", m)}</p></article></div></div></section>`;
}
function upsertTaskHelp(html, market) {
  const stripped = html.replace(sectionPattern("local-task-help"), "");
  const marker = /<section\b(?=[^>]*\bclass=["']section\b)[^>]*>/i;
  if (!marker.test(stripped)) throw new Error(`Missing content section in ${market.file}`);
  return stripped.replace(marker, (section) => `${taskSection(market)}${section}`);
}
function catalogSection(m) {
  const catalog = additionalMarketCatalogs[m.country];
  const cards = products.map(([id, name, page, tracking, mac], index) => {
    const fact = internationalStoreFacts[m.country]?.[id];
    if (!fact) throw new Error(`Missing ${m.country} evidence for ${id}`);
    const url = new URL(fact.trackViewUrl);
    if (url.hostname !== "apps.apple.com" || !url.pathname.startsWith(`/${m.country}/`) || !url.pathname.endsWith(`/id${id}`)) throw new Error(`Invalid ${m.country} storefront for ${id}`);
    url.searchParams.set("uo", "4");
    if (mac) url.searchParams.set("mt", "12");
    return `<article class="market-product"><div><p class="market-product-label">${mac ? "Mac" : "iPhone"}</p><h3>${escape(name)}</h3><p>${escape(catalog.products[index])}</p></div><div class="market-product-actions">${guideLink(page, catalog.details, "en", m)}<a class="store-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(name)} — ${escape(m.storeLabel)}" data-analytics-event="app_store_click" data-store-product="${tracking}" data-storefront="${mac ? "mac" : "ios"}-app-store" data-store-country="${m.country}">${escape(m.storeLabel)}</a></div></article>`;
  }).join("");
  return `<section class="section local-products" id="international-app-catalog" lang="${m.lang}" aria-labelledby="international-app-catalog-title"><div class="section-inner"><div class="section-heading"><div><h2 id="international-app-catalog-title">${escape(m.more)}</h2></div><p>${escape(catalog.intro)}</p></div><div class="market-product-grid">${cards}</div></div></section>`;
}
function markEnglishDestinations(html, m) {
  if (m.lang.startsWith("en")) return html;
  const englishPaths = new Set(["tools.html", "apps.html", "guides.html", "regions.html", "support.html", "privacy.html", "cycling-speed-calculator.html", ...products.map((p) => p[2].split("#")[0]), "duplicate-photo-cleaner-guide.html", "voice-camera-translator-guide.html", "screen-sharing-privacy-guide.html", "make-gif-on-iphone-guide.html", "automatic-bike-ride-tracker-iphone.html", "ai-photo-classification.html", "ai-photo-organizer-guide.html", "private-ai-photo-cleaner.html", "iphone-photo-cleaner-comparison.html"]);
  return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (anchor, attrs, label) => {
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href || !englishPaths.has(href.split(/[?#]/)[0])) return anchor;
    // Existing explanatory sentences already identify the guide-table language.
    const hasLanguage = /\bhreflang=/.test(attrs);
    if (hasLanguage && !label.includes("Free tools")) return anchor;
    const suffix = label.includes(m.english) || /\bEN\b/.test(label) ? "" : ` (${escape(m.english)})`;
    return `<a${attrs}${hasLanguage ? "" : ' hreflang="en"'}>${label}${suffix}</a>`;
  });
}
function updatePageDate(html) {
  return html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (block, attrs, body) => {
    const data = JSON.parse(body);
    const nodes = data["@graph"] ?? [data];
    for (const node of nodes) if (["WebPage", "CollectionPage"].includes(node["@type"])) node.dateModified = "2026-11-15";
    return `<script${attrs}>${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
  });
}
export async function applyInternationalSearch(siteDir) {
  for (const m of internationalSearchMarkets) {
    const file = path.join(siteDir, m.file);
    const current = await readFile(file, "utf8");
    let updated = markEnglishDestinations(current, m);
    if (additionalMarketCatalogs[m.country]) updated = upsert(updated, "international-app-catalog", catalogSection(m));
    updated = upsertTaskHelp(updated, m);
    updated = minifyHtml(updatePageDate(updated));
    if (updated !== current) await writeFile(file, updated);
    console.log(`${updated === current ? "Verified" : "Updated"} ${m.file}`);
  }
  // The shared English route keeps its URL and Nordic English alternates.
  // Native Dutch and Swedish catalogs carry their own storefront destinations.
  const file = path.join(siteDir, "netherlands-nordics-apps.html");
  const current = await readFile(file, "utf8");
  let updated = current.replace(sectionPattern("happyride-local-rides"), "").replace(sectionPattern("regional-app-directory"), "");
  updated = upsert(updated, "native-market-choices", `<section class="section content-section" id="native-market-choices" lang="en"><div class="section-inner"><h2>Read in Dutch or Swedish.</h2><p>Choose the local catalog for task guidance, app interface language information and links to your App Store.</p><div class="region-grid"><a class="region-card" href="nl-nl.html" hreflang="nl-NL" lang="nl"><span>Nederland</span><strong>Nederlandse uitleg en App Store</strong></a><a class="region-card" href="sv-se.html" hreflang="sv-SE" lang="sv"><span>Sverige</span><strong>Svensk vägledning och App Store</strong></a></div></div></section>`);
  updated = minifyHtml(updatePageDate(updated));
  if (updated !== current) await writeFile(file, updated);

  // A visible choice, in addition to head annotations, makes the Dutch page
  // discoverable from existing regional navigation.
  for (const name of (await readdir(siteDir)).filter(isMainSiteHtmlFile)) {
    const page = path.join(siteDir, name);
    const before = await readFile(page, "utf8");
    if (!before.includes('hreflang="nl-NL"') || /<body[\s\S]*href="nl-nl.html"/.test(before)) continue;
    const after = before.replace('<div class="region-grid">', '<div class="region-grid"><a class="region-card" href="nl-nl.html" hreflang="nl-NL" lang="nl"><span>Nederland</span><strong>Nederlands · App Store Nederland</strong></a>');
    if (after !== before) await writeFile(page, after);
  }
  // Existing pages referenced an older CSS token. Refresh only that cache key;
  // the CSS and JavaScript contents stay owned by their existing generators.
  const cssHash = createHash("sha256").update(await readFile(path.join(siteDir, "styles.css"))).digest("hex").slice(0, 12);
  for (const name of (await readdir(siteDir)).filter(isMainSiteHtmlFile)) {
    const page = path.join(siteDir, name);
    const before = await readFile(page, "utf8");
    const after = before.replace(/(href=["']\/?styles\.css\?v=)[a-f0-9]{12}/g, `$1${cssHash}`);
    if (after !== before) await writeFile(page, after);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argIndex = process.argv.indexOf("--site-dir");
  await applyInternationalSearch(path.resolve(argIndex >= 0 ? process.argv[argIndex + 1] : process.env.SITE_DIR ?? path.join(import.meta.dirname, "..")));
}
