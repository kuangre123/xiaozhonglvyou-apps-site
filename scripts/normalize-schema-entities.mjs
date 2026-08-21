import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const breadcrumbsOnly = process.argv.includes("--breadcrumbs-only");
const itemListsOnly = process.argv.includes("--itemlists-only");
const origin = "https://www.xiaozhonglvyou.com";
const developerId = `${origin}/#developer`;
const publisherId = `${origin}/#publisher`;
const websiteId = `${origin}/#website`;
const appStoreDeveloperUrl = "https://apps.apple.com/us/developer/bo-chen/id1321915789?uo=4";

const products = new Map([
  [
    "AI Cleaning - Photo Cleaner",
    {
      appId: "6768019606",
      url: "https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4",
      image: `${origin}/assets/ai-cleaning-icon.png`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "iOS",
      softwareVersion: "1.1.3",
      price: "0.00",
      priceCurrency: "USD"
    }
  ],
  [
    "Translation Specialist",
    {
      appId: "6755734543",
      url: "https://apps.apple.com/us/app/translation-specialist/id6755734543?uo=4",
      image: `${origin}/assets/travel-translator-icon.png`,
      applicationCategory: "TravelApplication",
      operatingSystem: "iOS",
      softwareVersion: "2.1.0",
      price: "0.00",
      priceCurrency: "USD"
    }
  ],
  [
    "Anti-spy screen",
    {
      appId: "6761301764",
      url: "https://apps.apple.com/us/app/anti-spy-screen/id6761301764?mt=12&uo=4",
      image: `${origin}/assets/anti-spy-icon.png`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "macOS",
      softwareVersion: "1.5.1",
      price: "2.99",
      priceCurrency: "USD"
    }
  ],
  [
    "Anti-spy screen Lite",
    {
      appId: "6766485393",
      url: "https://apps.apple.com/us/app/anti-spy-screen-lite/id6766485393?mt=12&uo=4",
      image: `${origin}/assets/anti-spy-lite-icon.png`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "macOS",
      softwareVersion: "1.4.1",
      price: "0.00",
      priceCurrency: "USD"
    }
  ],
  [
    "GIFmaker-Gif Studio",
    {
      appId: "6783559364",
      url: "https://apps.apple.com/us/app/gifmaker-gif-studio/id6783559364?uo=4",
      image: `${origin}/assets/gifmaker-icon.png`,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "iOS",
      softwareVersion: "1.1.2",
      price: "0.00",
      priceCurrency: "USD"
    }
  ],
  [
    "HappyRide: Auto Ride Tracker",
    {
      appId: "6786365305",
      url: "https://apps.apple.com/us/app/happyride-auto-ride-tracker/id6786365305?uo=4",
      image: `${origin}/assets/happyride-icon.png`,
      applicationCategory: "HealthApplication",
      operatingSystem: "iOS, watchOS",
      softwareVersion: "1.2",
      price: "0.00",
      priceCurrency: "USD"
    }
  ]
]);

const productKeywords = new Map([
  ["AI Cleaning - Photo Cleaner", ["AI photo cleaner", "photo organization", "duplicate photo cleanup", "on-device AI", "iPhone storage cleanup"]],
  ["Translation Specialist", ["travel translator", "voice translation", "camera translation", "travel language app", "on-device travel tools"]],
  ["Anti-spy screen", ["Mac screen privacy", "screen sharing privacy", "window protection", "presentation privacy", "macOS utility"]],
  ["GIFmaker-Gif Studio", ["GIF maker for iPhone", "photos to GIF", "video to GIF", "Live Photo to GIF", "on-device GIF editor"]],
  ["HappyRide: Auto Ride Tracker", ["automatic cycling tracker", "bike ride tracker", "Apple Watch cycling", "Apple Health workout", "background activity detection"]]
]);

const articleProductByFile = new Map([
  ["iphone-photo-cleaner.html", "AI Cleaning - Photo Cleaner"],
  ["iphone-photo-cleaner-comparison.html", "AI Cleaning - Photo Cleaner"]
]);

const hubLists = new Map([
  [
    "apps.html",
    {
      name: "App Store Utility Apps",
      items: [
        ["AI Cleaning - Photo Cleaner", `${origin}/ai-photo-classification.html`],
        ["Translation Specialist", `${origin}/travel-translator.html`],
        ["GIFmaker-Gif Studio", `${origin}/gif-maker.html`],
        ["Free Bike Ride Tracker App", `${origin}/happyride-auto-ride-tracker.html`],
        ["Anti-spy screen", `${origin}/mac-screen-privacy.html`],
        ["Anti-spy screen Lite", `${origin}/mac-screen-privacy.html#lite`]
      ]
    }
  ],
  [
    "guides.html",
    {
      name: "App Guides",
      items: [
        ["Free Photo Cleaner App for iPhone", `${origin}/best-iphone-photo-cleaner-app.html`],
        ["AI Photo Organizer Guide", `${origin}/ai-photo-organizer-guide.html`],
        ["iPad Photo Organizer Guide", `${origin}/ipad-photo-organizer-guide.html`],
        ["Duplicate Photo Cleaner Guide", `${origin}/duplicate-photo-cleaner-guide.html`],
        ["Private AI Photo Cleaner Guide", `${origin}/private-ai-photo-cleaner.html`],
        ["iPhone Storage Cleanup Guide", `${origin}/iphone-storage-cleanup-guide.html`],
        ["AI Cleaning vs Cleanup vs Cleaner Kit", `${origin}/iphone-photo-cleaner-comparison.html`],
        ["German iPhone Foto Cleaner Guide", `${origin}/iphone-foto-cleaner-de.html`],
        ["French Nettoyeur Photo iPhone Guide", `${origin}/nettoyeur-photo-iphone-fr.html`],
        ["How to Translate Menus and Conversations on iPhone", `${origin}/voice-camera-translator-guide.html`],
        ["Best Translator Apps for Travel", `${origin}/best-travel-translator-apps-iphone.html`],
        ["Hide Notifications When Screen Sharing on Mac", `${origin}/screen-sharing-privacy-guide.html`],
        ["How to Make a GIF on iPhone From Video", `${origin}/make-gif-on-iphone-guide.html`],
        ["How to Track a Bike Ride on iPhone", `${origin}/automatic-bike-ride-tracker-iphone.html`]
      ]
    }
  ],
  [
    "regions.html",
    {
      name: "Market and Localized App Pages",
      items: [
        ["United States App Page", `${origin}/us-apps.html`],
        ["United Kingdom App Page", `${origin}/uk-apps.html`],
        ["Canada and Australia App Page", `${origin}/canada-australia-apps.html`],
        ["Singapore App Page", `${origin}/singapore-apps.html`],
        ["Switzerland App Page", `${origin}/switzerland-apps.html`],
        ["Netherlands and Nordics App Page", `${origin}/netherlands-nordics-apps.html`],
        ["Decision Guides", `${origin}/guides.html`],
        ["Simplified Chinese App Page", `${origin}/zh-cn.html`],
        ["Traditional Chinese App Page", `${origin}/zh-hant.html`],
        ["German App Page", `${origin}/de-de.html`],
        ["French App Page", `${origin}/fr-fr.html`],
        ["Spanish App Page", `${origin}/es-es.html`],
        ["Italian App Page", `${origin}/it-it.html`],
        ["Korean App Page", `${origin}/ko-kr.html`],
        ["Japanese App Page", `${origin}/ja-jp.html`]
      ]
    }
  ]
]);

function developerEntity() {
  return {
    "@type": "Person",
    "@id": developerId,
    name: "Bo Chen",
    alternateName: "bo chen",
    jobTitle: "Independent iOS and macOS Developer",
    description: "Independent developer of focused iPhone, iPad, Apple Watch, and Mac apps.",
    url: `${origin}/about.html`,
    email: "mailto:cb123428316@gmail.com",
    sameAs: [appStoreDeveloperUrl],
    knowsAbout: [
      "iOS apps",
      "iPadOS apps",
      "watchOS apps",
      "macOS apps",
      "on-device AI",
      "AI photo classification",
      "photo cleanup",
      "GIF creation",
      "cycling and activity tracking",
      "travel translation",
      "screen privacy"
    ]
  };
}

function publisherEntity() {
  return {
    "@type": ["Organization", "Brand"],
    "@id": publisherId,
    name: "CrazyAIAgent",
    url: `${origin}/`,
    logo: {
      "@type": "ImageObject",
      url: `${origin}/apple-touch-icon.png`
    },
    image: `${origin}/assets/anti-spy-screen.png`,
    description: "Independent App Store utility portfolio for photo organization, GIF creation, activity tracking, travel translation, and screen privacy.",
    founder: { "@id": developerId },
    contactPoint: {
      "@type": "ContactPoint",
      email: "mailto:cb123428316@gmail.com",
      contactType: "customer support",
      availableLanguage: ["en", "zh-Hans", "zh-Hant"]
    },
    sameAs: [
      appStoreDeveloperUrl,
      ...[...products.values()].map((product) => product.url),
      "https://github.com/kuangre123/xiaozhonglvyou-apps-site"
    ],
    owns: [
      { "@id": `${origin}/#ai-cleaning` },
      { "@id": `${origin}/#travel-translator` },
      { "@id": `${origin}/#gifmaker` },
      { "@id": `${origin}/#happyride` },
      { "@id": `${origin}/#anti-spy-screen` },
      { "@id": `${origin}/#anti-spy-lite` }
    ]
  };
}

function typeList(node) {
  return Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]].filter(Boolean);
}

function hasType(node, type) {
  return typeList(node).includes(type);
}

function canonicalFromHtml(html, fileName) {
  const match = html.match(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ?? (fileName === "index.html" ? `${origin}/` : `${origin}/${fileName}`);
}

function normalizeKeywords(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function appIdMatches(url, appId) {
  return typeof url === "string" && new RegExp(`/id${appId}(?:[?/#]|$)`).test(url);
}

function fullProductEntity(name) {
  const product = products.get(name);
  return {
    "@type": "SoftwareApplication",
    name,
    url: product.url,
    downloadUrl: product.url,
    image: product.image,
    applicationCategory: product.applicationCategory,
    operatingSystem: product.operatingSystem,
    softwareVersion: product.softwareVersion,
    author: { "@id": developerId },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.priceCurrency,
      availability: "https://schema.org/InStock"
    }
  };
}

function normalizeSoftwareApplication(node) {
  const product = products.get(node.name);
  if (!product) return node;

  const url = appIdMatches(node.url, product.appId) ? node.url : product.url;
  const downloadUrl = appIdMatches(node.downloadUrl, product.appId) ? node.downloadUrl : url;

  return {
    ...node,
    url,
    downloadUrl,
    image: product.image,
    applicationCategory: product.applicationCategory,
    operatingSystem: node.operatingSystem || product.operatingSystem,
    softwareVersion: product.softwareVersion,
    author: { "@id": developerId },
    publisher: { "@id": publisherId },
    provider: { "@id": publisherId },
    offers: {
      ...(node.offers || {}),
      "@type": "Offer",
      price: node.offers?.price ?? product.price,
      priceCurrency: node.offers?.priceCurrency ?? product.priceCurrency,
      availability: "https://schema.org/InStock"
    }
  };
}

function productNamesWithin(value, names = new Set()) {
  if (!value || typeof value !== "object") return names;
  if (hasType(value, "SoftwareApplication") && products.has(value.name)) names.add(value.name);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach((item) => productNamesWithin(item, names));
    else productNamesWithin(child, names);
  }
  return names;
}

function normalizeArticle(node, fileName, canonical) {
  const productNames = productNamesWithin(node);
  const mappedProduct = articleProductByFile.get(fileName);
  const about = Array.isArray(node.about) ? [...node.about] : node.about ? [node.about] : [];
  const aboutProductNames = productNamesWithin({ about });

  if (mappedProduct && !aboutProductNames.has(mappedProduct)) {
    about.push(fullProductEntity(mappedProduct));
    productNames.add(mappedProduct);
  }

  const keywords = new Set(normalizeKeywords(node.keywords));
  for (const productName of productNames) {
    for (const keyword of productKeywords.get(productName) || []) keywords.add(keyword);
  }
  if (keywords.size < 4) {
    ["independent app developer", "App Store utility", "privacy-first apps", "CrazyAIAgent"].forEach((keyword) => keywords.add(keyword));
  }

  return {
    ...node,
    "@id": `${canonical}#article`,
    isPartOf: { "@id": websiteId },
    mainEntityOfPage: canonical,
    author: developerEntity(),
    publisher: publisherEntity(),
    keywords: [...keywords].slice(0, 12),
    ...(about.length > 0 ? { about } : {})
  };
}

function normalizePage(node, fileName, canonical) {
  const updated = {
    ...node,
    "@id": `${canonical}#page`,
    url: canonical,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": publisherId },
    author: node.author || { "@id": developerId }
  };

  if (hasType(node, "AboutPage")) updated.mainEntity = { "@id": developerId };
  return updated;
}

function normalizeItemList(node, fileName) {
  const hub = hubLists.get(fileName);
  if (!hub) return node;
  return {
    ...node,
    name: hub.name,
    numberOfItems: hub.items.length,
    itemListElement: hub.items.map(([name, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item
    }))
  };
}

function normalizeBreadcrumbList(node, canonical) {
  const items = Array.isArray(node.itemListElement) ? node.itemListElement : [];
  const terminalName = items.at(-1)?.name?.trim() || "Page";
  const { itemListElement, ...rest } = node;

  return {
    ...rest,
    "@id": `${canonical}#breadcrumb`,
    name: terminalName,
    numberOfItems: items.length,
    itemListElement: items
  };
}

function normalizeNode(value, fileName, canonical) {
  if (Array.isArray(value)) return value.map((item) => normalizeNode(item, fileName, canonical));
  if (!value || typeof value !== "object") return value;

  let node = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeNode(child, fileName, canonical)])
  );

  if (breadcrumbsOnly) {
    return hasType(node, "BreadcrumbList") ? normalizeBreadcrumbList(node, canonical) : node;
  }

  if (itemListsOnly) {
    return hasType(node, "ItemList") ? normalizeItemList(node, fileName) : node;
  }

  if (hasType(node, "Person") && (node["@id"] === developerId || ["CrazyAIAgent", "Summer Chen", "Bo Chen", "bo chen"].includes(node.name))) {
    node = developerEntity();
  }
  if ((hasType(node, "Organization") || hasType(node, "Brand")) && node["@id"] === publisherId) {
    node = publisherEntity();
  }
  if (hasType(node, "SoftwareApplication")) node = normalizeSoftwareApplication(node);
  if (hasType(node, "Article")) node = normalizeArticle(node, fileName, canonical);
  if (["AboutPage", "CollectionPage", "ContactPage", "WebPage"].some((type) => hasType(node, type))) {
    node = normalizePage(node, fileName, canonical);
  }
  if (hasType(node, "WebSite")) {
    node = {
      ...node,
      "@id": websiteId,
      name: "CrazyAIAgent",
      url: `${origin}/`,
      publisher: { "@id": publisherId },
      creator: { "@id": developerId }
    };
  }
  if (hasType(node, "ItemList")) node = normalizeItemList(node, fileName);
  if (hasType(node, "BreadcrumbList")) node = normalizeBreadcrumbList(node, canonical);

  return node;
}

function formatJsonLd(parsed, originalContent) {
  const leading = originalContent.match(/^\s*\n([ \t]+)/)?.[1] ?? "      ";
  return `\n${JSON.stringify(parsed, null, 2).split("\n").map((line) => `${leading}${line}`).join("\n")}\n    `;
}

function normalizeHtml(html, fileName) {
  const canonical = canonicalFromHtml(html, fileName);
  let updated = html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, content, close) => {
      const parsed = JSON.parse(content);
      const normalized = normalizeNode(parsed, fileName, canonical);
      if (JSON.stringify(parsed) === JSON.stringify(normalized)) return full;
      return `${open}${formatJsonLd(normalized, content)}${close}`;
    }
  );

  if (!breadcrumbsOnly && !itemListsOnly) {
    updated = updated.replace(
      /(<a\b[^>]*\brel=["'][^"']*\bauthor\b[^"']*["'][^>]*>)(?:CrazyAIAgent|Summer Chen)(<\/a>)/gi,
      "$1Bo Chen$2"
    );
  }

  return updated;
}

const files = (await readdir(siteDir)).filter((name) => name.endsWith(".html")).sort();
let changed = 0;

for (const fileName of files) {
  const filePath = path.join(siteDir, fileName);
  const html = await readFile(filePath, "utf8");
  const updated = normalizeHtml(html, fileName);
  if (updated === html) continue;
  await writeFile(filePath, updated);
  changed += 1;
}

console.log(`Schema entity normalization: ${changed}/${files.length} HTML files changed.`);
