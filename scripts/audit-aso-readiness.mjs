import { readFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.cwd();

const apps = [
  {
    key: "GIFmaker",
    appId: "6783559364",
    version: "1.1.2",
    name: "GIFmaker-Gif Studio",
    subtitle: "Photos, Video & Live Photos",
    keywords: "photos,video,live photo,animation,boomerang,meme,caption,frame editor,reverse,loop",
    promotionalText: "Create polished GIFs from photos, videos, or Live Photos—then tune every frame, add captions, and export up to 1080p without uploading your media.",
    pages: ["gif-maker.html", "gif-maker-cn.html"],
    supportAnchor: 'id="gifmaker"',
    privacyAnchor: 'id="gifmaker"',
    marketingUrl: "https://www.xiaozhonglvyou.com/gif-maker.html"
  },
  {
    key: "HappyRide",
    appId: "6786365305",
    version: "1.2",
    name: "HappyRide: Auto Ride Tracker",
    subtitle: "Cycling, Walks & Runs",
    keywords: "cycling,bike,gps,apple watch,health,workout,route planner,scenic,walking,running",
    promotionalText: "Forget to tap Start? HappyRide detects cycling, walks, and runs, adds Apple Watch heart rate, and saves qualifying workouts to Apple Health.",
    pages: ["happyride-auto-ride-tracker.html", "happyride-auto-ride-tracker-cn.html"],
    supportAnchor: 'id="happyride"',
    privacyAnchor: 'id="happyride"',
    marketingUrl: "https://www.xiaozhonglvyou.com/happyride-auto-ride-tracker.html"
  }
];

const failures = [];

const characterCount = (value) => [...value].length;
const byteCount = (value) => Buffer.byteLength(value, "utf8");

function flattenJsonLd(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.["@graph"])) return parsed["@graph"];
  return [parsed];
}

function extractJsonLd(html, pageName) {
  const nodes = [];

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      nodes.push(...flattenJsonLd(JSON.parse(match[1])));
    } catch (error) {
      failures.push(`${pageName} contains invalid JSON-LD: ${error.message}`);
    }
  }

  return nodes;
}

function hasType(node, type) {
  const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
  return types.includes(type);
}

const [support, privacy, actions, aso] = await Promise.all([
  readFile(path.join(siteDir, "support.html"), "utf8"),
  readFile(path.join(siteDir, "privacy.html"), "utf8"),
  readFile(path.join(siteDir, "BACKLINK_ACTIONS.md"), "utf8"),
  readFile(path.join(siteDir, "ASO_ACTIONS.md"), "utf8")
]);

for (const app of apps) {
  if (characterCount(app.name) > 30) failures.push(`${app.key} name exceeds 30 characters`);
  if (characterCount(app.subtitle) > 30) failures.push(`${app.key} subtitle exceeds 30 characters`);
  if (byteCount(app.keywords) > 100) failures.push(`${app.key} keywords exceed 100 UTF-8 bytes`);
  if (characterCount(app.promotionalText) > 170) failures.push(`${app.key} promotional text exceeds 170 characters`);
  if (/,[ ]/.test(app.keywords)) failures.push(`${app.key} keywords contain spaces after commas`);

  if (!support.includes(app.supportAnchor)) failures.push(`${app.key} support anchor is missing`);
  if (!privacy.includes(app.privacyAnchor)) failures.push(`${app.key} privacy anchor is missing`);
  if (!actions.includes(app.marketingUrl)) failures.push(`${app.key} marketing URL is missing from BACKLINK_ACTIONS.md`);
  if (!aso.includes(app.marketingUrl)) failures.push(`${app.key} marketing URL is missing from ASO_ACTIONS.md`);

  for (const pageName of app.pages) {
    const html = await readFile(path.join(siteDir, pageName), "utf8");
    const jsonLd = extractJsonLd(html, pageName);
    const requiredSignals = [
      `app-id=${app.appId}`,
      `id${app.appId}`,
      app.marketingUrl.replace(/\.html$/, pageName.endsWith("-cn.html") ? "-cn.html" : ".html")
    ];
    for (const signal of requiredSignals) {
      if (!html.includes(signal)) failures.push(`${pageName} is missing ASO signal: ${signal}`);
    }
    if (!jsonLd.some((node) => hasType(node, "SoftwareApplication"))) {
      failures.push(`${pageName} is missing ASO signal: SoftwareApplication JSON-LD type`);
    }
    if (!jsonLd.some((node) => hasType(node, "SoftwareApplication") && node.softwareVersion === app.version)) {
      failures.push(`${pageName} is missing ASO signal: softwareVersion ${app.version}`);
    }
  }
}

const ok = failures.length === 0;
console.log(`# ASO Readiness Audit\n\nStatus: ${ok ? "PASS" : "FAIL"}`);

for (const app of apps) {
  console.log(`\n## ${app.key}`);
  console.log(`\n- Name: ${characterCount(app.name)}/30 characters`);
  console.log(`- Subtitle: ${characterCount(app.subtitle)}/30 characters`);
  console.log(`- Keywords: ${byteCount(app.keywords)}/100 UTF-8 bytes`);
  console.log(`- Promotional text: ${characterCount(app.promotionalText)}/170 characters`);
}

if (!ok) {
  console.log("\n## Failures\n");
  for (const failure of failures) console.log(`- ${failure}`);
  process.exit(1);
}

console.log("\n- Smart App Banner metadata: ready");
console.log("- Product-specific Marketing, Support, and Privacy URLs: ready");
console.log("- Public App Store changes still require App Store Connect access and Apple propagation.\n");
