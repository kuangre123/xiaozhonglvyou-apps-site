import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");

const products = new Map([
  ["6768019606", { product: "ai-cleaning-photo-cleaner", storefront: "ios-app-store", label: "AI Cleaning - Photo Cleaner" }],
  ["6755734543", { product: "translation-specialist", storefront: "ios-app-store", label: "Translation Specialist" }],
  ["6783559364", { product: "gifmaker-gif-studio", storefront: "ios-app-store", label: "GIFmaker-Gif Studio" }],
  ["6786365305", { product: "happyride-auto-ride-tracker", storefront: "ios-app-store", label: "HappyRide: Auto Ride Tracker" }],
  ["6761301764", { product: "anti-spy-screen", storefront: "mac-app-store", label: "Anti-spy screen" }],
  ["6766485393", { product: "anti-spy-screen-lite", storefront: "mac-app-store", label: "Anti-spy screen Lite" }]
]);

function getAttribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`\\b${escaped}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2] ?? "";
}

function setAttribute(tag, name, value) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\s+${escaped}\\s*=\\s*(["']).*?\\1`, "i");
  const attribute = ` ${name}="${value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}"`;
  if (pattern.test(tag)) return tag.replace(pattern, attribute);
  return tag.replace(/\s*>$/, `${attribute}>`);
}

function normalizeAnchor(tag) {
  const href = getAttribute(tag, "href").replaceAll("&amp;", "&");
  if (!href.includes("https://apps.apple.com/")) return tag;
  const appId = href.match(/\/id(\d+)/i)?.[1];
  const product = products.get(appId);
  if (!product) return tag;

  const existingRel = getAttribute(tag, "rel").split(/\s+/).filter(Boolean);
  const rel = [...new Set([...existingRel, "noopener", "noreferrer"])].join(" ");
  let updated = tag;
  updated = setAttribute(updated, "target", "_blank");
  updated = setAttribute(updated, "rel", rel);
  updated = setAttribute(updated, "data-analytics-event", "app_store_click");
  updated = setAttribute(updated, "data-store-product", product.product);
  updated = setAttribute(updated, "data-storefront", product.storefront);
  if (!getAttribute(updated, "aria-label")) {
    updated = setAttribute(updated, "aria-label", `${product.label} on the App Store (opens in a new tab)`);
  }
  return updated;
}

const files = (await readdir(siteDir)).filter((name) => name.endsWith(".html")).sort();
let changedFiles = 0;
let changedLinks = 0;

for (const fileName of files) {
  const filePath = path.join(siteDir, fileName);
  const html = await readFile(filePath, "utf8");
  let fileChanges = 0;
  let updated = html.replace(/<a\b[^>]*>/gi, (tag) => {
    const normalized = normalizeAnchor(tag);
    if (normalized !== tag) fileChanges += 1;
    return normalized;
  });
  updated = updated.replace(/script\.js\?v=[^"']+/g, "script.js?v=20260718-conversion");

  if (updated === html) continue;
  await writeFile(filePath, updated);
  changedFiles += 1;
  changedLinks += fileChanges;
}

console.log(`App Store link normalization: ${changedLinks} links across ${changedFiles}/${files.length} HTML files changed.`);
