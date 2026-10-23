#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { portfolioMarketCheckedDate, portfolioMarketFacts } from "./portfolio-market-facts.mjs";

const countries = [
  ["fr", "France"], ["de", "Germany"], ["us", "United States"],
  ["my", "Malaysia"], ["jp", "Japan"], ["se", "Sweden"],
  ["eg", "Egypt"], ["it", "Italy"], ["pl", "Poland"]
];
const apps = [
  { id: "6768019606", name: "AI Cleaning", page: "iphone-photo-cleaner.html" },
  { id: "6755734543", name: "Translation Specialist", page: "travel-translator.html" },
  { id: "6761301764", name: "Anti-spy screen", page: "mac-screen-privacy.html", mac: true },
  { id: "6766485393", name: "Anti-spy screen Lite", page: "mac-screen-privacy.html", mac: true },
  { id: "6783559364", name: "GIFmaker", page: "gif-maker.html" },
  { id: "6786365305", name: "HappyRide", page: "happyride-auto-ride-tracker.html" },
  { id: "6775935474", name: "Lele Health (Laleme)", page: "lailemma-period-tracker.html" },
  { id: "6810287923", name: "Inkstone", page: "inkstone-markdown-notes.html" },
  { id: "6800405096", name: "TwoPic", page: "twopic-dual-camera.html" }
];
const hubs = [
  {
    file: "fr-fr.html", country: "fr", lang: "fr-FR", kicker: "Catalogue en France",
    title: "D’autres apps dans l’App Store France.",
    summary: "Retrouvez les autres apps du catalogue et leurs fiches françaises. Les pages produit liées sont en anglais ; vérifiez dans l’App Store les langues de l’interface, la compatibilité, les fonctionnalités et les prix locaux.",
    productLabel: "Page produit en anglais", storeLabel: "App Store France", newTab: "s’ouvre dans un nouvel onglet"
  },
  {
    file: "de-de.html", country: "de", lang: "de-DE", kicker: "App-Katalog in Deutschland",
    title: "Weitere Apps im deutschen App Store.",
    summary: "Hier finden Sie weitere Apps aus dem Katalog mit deutschen Store-Einträgen. Die verlinkten Produktseiten sind auf Englisch; prüfen Sie im App Store die verfügbaren Oberflächensprachen, Kompatibilität, Funktionen und lokalen Preise.",
    productLabel: "Produktseite auf Englisch", storeLabel: "Deutscher App Store", newTab: "öffnet einen neuen Tab"
  },
  {
    file: "us-apps.html", country: "us", lang: "en-US", kicker: "US app directory",
    title: "More apps with US App Store listings.",
    summary: "Compare the remaining apps in the catalog and open their US listings. These product pages are in English; check app interface languages, compatibility, features, and local prices separately in the App Store.",
    productLabel: "Product page in English", storeLabel: "US App Store", newTab: "opens in a new tab"
  },
  {
    file: "ja-jp.html", country: "jp", lang: "ja-JP", kicker: "日本向けアプリ一覧",
    title: "日本のApp Storeで確認できるその他のアプリ。",
    summary: "カタログ内のその他のアプリと、日本のストアページへのリンクです。リンク先の製品ページは英語です。アプリの対応言語、互換性、機能、日本での価格はApp Storeで個別に確認してください。",
    productLabel: "英語の製品ページ", storeLabel: "日本のApp Store", newTab: "新しいタブで開く"
  },
  {
    file: "it-it.html", country: "it", lang: "it-IT", kicker: "Catalogo per l’Italia",
    title: "Altre app nell’App Store italiano.",
    summary: "Confronta le altre app del catalogo e apri le schede italiane. Le pagine prodotto collegate sono in inglese; verifica separatamente nell’App Store le lingue dell’interfaccia, la compatibilità, le funzioni e i prezzi locali.",
    productLabel: "Pagina prodotto in inglese", storeLabel: "App Store Italia", newTab: "si apre in una nuova scheda"
  },
  {
    file: "netherlands-nordics-apps.html", country: "se", lang: "sv-SE", kicker: "Appkatalog för Sverige",
    title: "Fler appar i svenska App Store.",
    summary: "Här finns fler appar från katalogen med länkar till den svenska App Store-butiken. Produktsidorna är på engelska; kontrollera apparnas gränssnittsspråk, kompatibilitet, funktioner och lokala priser separat i svenska App Store.",
    productLabel: "Produktsida på engelska", storeLabel: "Svenska App Store", newTab: "öppnas i en ny flik"
  }
];

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function attr(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2]?.replaceAll("&amp;", "&") ?? "";
}

function storeIdentity(href) {
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" || url.hostname !== "apps.apple.com") return null;
    const match = url.pathname.match(/^\/([a-z]{2})\/app\/(?:[^/]+\/)?id(\d+)\/?$/i);
    return match ? { country: match[1].toLowerCase(), id: match[2], url } : null;
  } catch {
    return null;
  }
}

// The checked-in facts contain only Apple Lookup destinations verified in the stated markets.
// Missing evidence is a build error, rather than a reason to manufacture a storefront URL.
export function validatePortfolioMarketFacts(facts = portfolioMarketFacts, checkedDate = portfolioMarketCheckedDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkedDate)) throw new Error("Missing portfolio market verification date");
  if (!Array.isArray(facts)) throw new Error("Portfolio market facts must be an array");
  const routes = new Map();
  for (const app of apps) {
    const records = facts.filter((record) => String(record.id) === app.id);
    if (records.length !== 1) throw new Error(`Expected one verified storefront record for ${app.name}`);
    const record = records[0];
    for (const [country] of countries) {
      if (!record.availableCountries?.includes(country)) throw new Error(`Unverified availability for ${app.id} in ${country}`);
      const identity = storeIdentity(record.storefrontUrls?.[country]);
      if (!identity || identity.id !== app.id || identity.country !== country) throw new Error(`Invalid verified storefront URL for ${app.id} in ${country}`);
      const url = identity.url;
      url.searchParams.set("uo", "4");
      if (app.mac) url.searchParams.set("mt", "12");
      routes.set(`${app.id}:${country}`, url.toString());
    }
  }
  return routes;
}

function sectionPattern(id) {
  return new RegExp(`<section\\b(?=[^>]*\\bid\\s*=\\s*["']${id}["'])[^>]*>[\\s\\S]*?<\\/section\\s*>`, "gi");
}

function withoutSection(html, id) {
  return html.replace(sectionPattern(id), "");
}

function upsertSection(html, id, section, file) {
  const base = withoutSection(html, id);
  if (!/<\/main\s*>/i.test(base)) throw new Error(`Missing </main> in ${file}`);
  return section ? base.replace(/<\/main\s*>/i, (end) => `${section}${end}`) : base;
}

function visibleMain(html, file) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)?.[1];
  if (main === undefined) throw new Error(`Missing main content in ${file}`);
  return main.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
}

function updateExistingArticleWordCounts(html, file) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main\s*>/i)?.[1];
  if (main === undefined) throw new Error(`Missing main content in ${file}`);
  const wordCount = main.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  return html.replace(/(<script\b(?=[^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>)([\s\S]*?)(<\/script\s*>)/gi, (block, open, json, close) => {
    const parsed = JSON.parse(json);
    let changed = false;
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
      if (types.includes("Article") && typeof node.wordCount === "number" && node.wordCount !== wordCount) {
        node.wordCount = wordCount;
        changed = true;
      }
      Object.values(node).forEach(visit);
    };
    visit(parsed);
    return changed ? open + JSON.stringify(parsed).replaceAll("<", "\\u003c") + close : block;
  });
}

function stableTracking(app, html) {
  const identities = [...visibleMain(withoutSection(html, "regional-app-storefronts"), app.page).matchAll(/<a\b[^>]*>/gi)]
    .map(([tag]) => ({ tag, identity: storeIdentity(attr(tag, "href")) }))
    .filter(({ identity }) => identity?.id === app.id);
  const tracked = identities.filter(({ tag }) => attr(tag, "data-analytics-event") === "app_store_click");
  const products = new Set(tracked.map(({ tag }) => attr(tag, "data-store-product")).filter(Boolean));
  const storefronts = new Set(tracked.map(({ tag }) => attr(tag, "data-storefront")).filter(Boolean));
  const storefront = app.mac ? "mac-app-store" : "ios-app-store";
  if (products.size !== 1 || storefronts.size !== 1 || !storefronts.has(storefront)) {
    throw new Error(`Missing or inconsistent existing App Store tracking for ${app.name} in ${app.page}`);
  }
  return { ...app, product: [...products][0], storefront };
}

function storeAnchor(app, country, label, ariaLabel, routes) {
  const href = routes.get(`${app.id}:${country}`);
  // Verified Apple URLs are URL-encoded. Retain query separators to match the site's telemetry parser.
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="${escapeHtml(app.product)}" data-storefront="${app.storefront}" data-store-country="${country}" aria-label="${escapeHtml(ariaLabel)}">${escapeHtml(label)}</a>`;
}

function productSection(pageApps, routes) {
  const rows = pageApps.map((app) => `<div><strong>${escapeHtml(app.name)}</strong><p>${countries.map(([country, name]) => storeAnchor(app, country, name, `${app.name} in the ${name} App Store (opens in a new tab)`, routes)).join(" · ")}</p></div>`).join("");
  return `<section class="section content-section" id="regional-app-storefronts" aria-labelledby="regional-app-storefronts-title"><div class="section-inner content-grid"><div><p class="section-kicker">Regional App Store listings</p><h2 id="regional-app-storefronts-title">Choose your local App Store listing.</h2><p>Open a regional listing to check local prices, compatibility, supported app languages, and the features included in your store. This product page is in English; the app’s interface languages are listed separately in the App Store.</p></div><div class="content-list">${rows}</div></div></section>`;
}

function hubSection(hub, missingApps, routes) {
  if (!missingApps.length) return "";
  const rows = missingApps.map((app) => `<div><strong>${escapeHtml(app.name)}</strong><p><a href="${app.page}" hreflang="en">${escapeHtml(hub.productLabel)}</a> · ${storeAnchor(app, hub.country, hub.storeLabel, `${app.name} — ${hub.storeLabel} (${hub.newTab})`, routes)}</p></div>`).join("");
  return `<section class="section content-section" id="regional-app-directory" lang="${hub.lang}" aria-labelledby="regional-app-directory-title"><div class="section-inner content-grid"><div><p class="section-kicker">${escapeHtml(hub.kicker)}</p><h2 id="regional-app-directory-title">${escapeHtml(hub.title)}</h2><p>${escapeHtml(hub.summary)}</p></div><div class="content-list">${rows}</div></div></section>`;
}

function parseSiteDir(argv) {
  let directory = process.env.SITE_DIR || path.resolve(import.meta.dirname, "..");
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--site-dir") throw new Error(`Unknown argument: ${argv[index]}`);
    directory = argv[++index];
    if (!directory || directory.startsWith("--")) throw new Error("--site-dir requires a directory");
  }
  return path.resolve(process.cwd(), directory);
}

async function applyPortfolioMarketDiscovery(siteDir) {
  const routes = validatePortfolioMarketFacts();
  const productPages = [...new Set(apps.map((app) => app.page))];
  const files = [...productPages, ...hubs.map((hub) => hub.file)];
  const originals = new Map(await Promise.all(files.map(async (file) => [file, await readFile(path.join(siteDir, file), "utf8")])));
  const trackedApps = apps.map((app) => stableTracking(app, originals.get(app.page)));
  const updates = new Map();
  for (const file of productPages) {
    updates.set(file, upsertSection(originals.get(file), "regional-app-storefronts", productSection(trackedApps.filter((app) => app.page === file), routes), file));
  }
  let addedHubLinks = 0;
  for (const hub of hubs) {
    const original = originals.get(hub.file);
    const existing = new Set([...visibleMain(withoutSection(original, "regional-app-directory"), hub.file).matchAll(/<a\b[^>]*>/gi)]
      .map(([tag]) => storeIdentity(attr(tag, "href")))
      .filter((identity) => identity?.country === hub.country)
      .map((identity) => identity.id));
    const missing = trackedApps.filter((app) => !existing.has(app.id));
    addedHubLinks += missing.length;
    // A mixed app directory cannot truthfully promote one app through a page-wide Smart App Banner.
    const updated = upsertSection(original, "regional-app-directory", hubSection(hub, missing, routes), hub.file)
      .replace(/<meta\b(?=[^>]*\bname\s*=\s*["']apple-itunes-app["'])[^>]*>/gi, "");
    updates.set(hub.file, updated);
  }
  let changed = 0;
  // Compute and validate every page before writing, so a broken source page cannot leave a partial migration.
  for (const [file, updated] of updates) {
    updates.set(file, updateExistingArticleWordCounts(updated, file));
  }
  for (const [file, updated] of updates) {
    if (updated === originals.get(file)) continue;
    await writeFile(path.join(siteDir, file), updated, "utf8");
    changed += 1;
  }
  console.log(`Applied 81 verified product/storefront routes and ${addedHubLinks} missing hub links; changed ${changed} pages.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await applyPortfolioMarketDiscovery(parseSiteDir(process.argv.slice(2)));
}
