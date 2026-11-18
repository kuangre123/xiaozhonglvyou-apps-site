#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { minifyHtml } from "./minify-html.mjs";

const origin = "https://www.xiaozhonglvyou.com";
const modifiedDate = "2026-11-18";
const modifiedLabel = "November 18, 2026";

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

export function updateHomepage(original) {
  if (!original.includes(`<link rel="canonical" href="${origin}/">`)) throw new Error("Unexpected index.html canonical");
  let html = original;
  html = html.replace(
    /<div class="nav-links">[\s\S]*?<\/div>/,
    '<div class="nav-links"><a href="tools.html" data-free-tools-nav lang="en" hreflang="en">Free tools</a> <a href="apps.html">Apps</a> <a href="guides.html">Guides</a> <a href="regions.html">Regions</a> <a href="about.html">About</a> <a href="#discovery">Find an app</a> <a href="#faq">FAQ</a></div>'
  );
  html = html.replace(
    /<div class="hero-actions" aria-label="Primary actions">[\s\S]*?<\/div>/,
    '<div class="hero-actions" aria-label="Primary actions"><a class="button button-primary" href="#apps">View apps</a> <a class="button button-secondary" href="ai-photo-classification.html">See 9 AI photo categories</a> <a class="button button-secondary" href="tools.html">Try free browser tools</a></div>'
  );
  return minifyHtml(html);
}

export function updateGifMakerProduct(original) {
  const file = "gif-maker.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "GIF Maker & Editor for iPhone: Video, Live Photo ($0.99)";
  const description = "Make and edit GIFs on iPhone from video, Live Photos, or pictures. Adjust per-frame timing, captions, reverse, and boomerang on-device. $0.99, no watermark.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replace(/<h1>[\s\S]*?<\/h1>/, "<h1>Make and edit GIFs on iPhone from video or Live Photos.</h1>");
  html = html.replace(
    /<p class="hero-summary">[\s\S]*?<\/p>/,
    '<p class="hero-summary">Turn videos, Live Photos, or pictures into GIFs — or edit frame timing, captions, canvas ratios, reverse, and boomerang on-device. US App Store price: $0.99 upfront, with no watermark.</p>'
  );

  const editQuestion = "How can I edit a GIF on iPhone without a watermark?";
  const editAnswer = "Open GIFmaker on iPhone, import your video, Live Photo, or images, then adjust per-frame delay, filmstrip order, text overlays, canvas ratio, reverse, or boomerang in the live preview before exporting. The US App Store listing states exports have no watermark at a $0.99 upfront price.";

  const faqItem = `<details><summary>${escape(editQuestion)}</summary><p>${escape(editAnswer)}</p></details>`;
  if (!html.includes(`<summary>${escape(editQuestion)}</summary>`)) {
    html = html.replace(/(<div class="faq-list">[\s\S]*?)(<\/div><\/div><\/section>)/, `$1${faqItem}$2`);
  }

  html = updateJsonLd(html, (node) => {
    if (node["@type"] === "WebPage") {
      node.name = title;
      node.description = description;
    }
    if (node["@type"] === "FAQPage" && Array.isArray(node.mainEntity)) {
      if (!node.mainEntity.some((q) => q.name === editQuestion)) {
        node.mainEntity.push({
          "@type": "Question",
          name: editQuestion,
          acceptedAnswer: { "@type": "Answer", text: editAnswer }
        });
      }
    }
  });
  return minifyHtml(html);
}

export function updateGifComparisonPage(original) {
  const file = "best-gif-maker-apps-iphone.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "Best iPhone GIF Maker Apps (2026): Free vs $0.99 No-Sub";
  const description = "Compare 3 iPhone GIF maker & editor apps: $0.99 one-time no-watermark GIFmaker vs free-to-try ImgPlay and GIF Maker subscriptions, formats, and privacy.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replace(/(<meta\b(?=[^>]*property="article:modified_time")[^>]*content=")[^"]*(")/, `$1${modifiedDate}$2`);
  html = html.replace(
    /(<section class="page-hero">[\s\S]*?Updated <time datetime=")[^"]*("[^>]*>)[\s\S]*?(<\/time>)/,
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

export function updateMacScreenPrivacy(original) {
  const file = "mac-screen-privacy.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "Mac Privacy Screen App: Hide Windows & Peek Alerts (Free)";
  const description = "Mac privacy screen software with local face-peek alerts, selected window hiding, and screen-share blocks. Try Lite free or get the $2.99 one-time Mac app.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replace(
    /<div class="hero-actions" aria-label="Mac privacy actions">[\s\S]*?<\/div>/,
    '<div class="hero-actions" aria-label="Mac privacy actions"><a class="button button-primary" href="https://apps.apple.com/us/app/anti-spy-screen-lite/id6766485393?mt=12&amp;uo=4" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="anti-spy-screen-lite" data-storefront="mac-app-store" aria-label="Download free Anti-spy screen Lite on the App Store (opens in a new tab)">Try Lite free</a> <a class="button button-secondary" href="https://apps.apple.com/us/app/anti-spy-screen/id6761301764?mt=12&amp;uo=4" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="anti-spy-screen" data-storefront="mac-app-store" aria-label="View the $2.99 Anti-spy screen app on the App Store (opens in a new tab)">Full app · $2.99</a> <a class="button button-secondary" href="screen-sharing-privacy-guide.html">Hide notifications when screen sharing</a></div>'
  );
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

export function updateAutoBikeGuide(original) {
  const file = "automatic-bike-ride-tracker-iphone.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "Auto Bike Ride Tracker for iPhone (With or Without Watch)";
  const description = "Track bike rides on iPhone automatically without tapping Start — with or without Apple Watch. Compare Workout reminders vs HappyRide free GPS tracking.";
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
    if (node["@type"] === "SoftwareApplication" && node.url?.includes("/id6786365305")) {
      node.softwareVersion = "1.4.2";
    }
  });
  return minifyHtml(html);
}

export function updateSeedanceTools(original) {
  const file = "seedance-ai-tools.html";
  if (!original.includes(`<link rel="canonical" href="${origin}/${file}">`)) throw new Error(`Unexpected ${file} canonical`);
  const title = "Seedance 2.5 Workflow Tools: Organize & Version AI Assets";
  const description = "Organize Seedance 2.5 4K clips, reference frames, and edit versions across iPhone, Mac, and CapCut/Dreamina with on-device AI sorting and Markdown notes.";
  let html = setMetaAndTitle(original, { title, description });
  html = html.replaceAll("https://www.xiaozhonglvyou.com/assets/og-default.png", "https://www.xiaozhonglvyou.com/assets/og-ai-photo-classification.jpg");
  html = html.replace('<a class="nav-cta" href="mailto:cb123428316@gmail.com">Contact</a>', '<a class="nav-cta" href="apps.html">Apps</a>');
  html = html.replace(
    /<h1>[\s\S]*?<\/h1><p>[\s\S]*?<\/p>/,
    "<h1>Organize, version, and clean up Seedance 2.5 creator assets.</h1><p>Generating 30-second 4K AI clips in Dreamina, Doubao, or CapCut quickly multiplies reference photos, exported takes, and edit versions. Use a clear local folder and shot-log workflow alongside on-device iPhone cleanup tools.</p>"
  );
  html = html.replace(/(<meta\b(?=[^>]*property="article:modified_time")[^>]*content=")[^"]*(")/, `$1${modifiedDate}$2`);
  html = html.replace(
    /(<p class="article-meta">Updated <time datetime=")[^"]*("[^>]*>)[\s\S]*?(<\/time>)/,
    `$1${modifiedDate}$2${modifiedLabel}$3`
  );
  html = html.replace(
    "Built by ByteDance's Volcano Engine. Will be integrated into Dreamina, Doubao, and CapCut. Currently in enterprise beta, public launch expected early July 2026.",
    "Built by ByteDance's Volcano Engine (announced June 2026) for Volcano Engine ModelArk, Dreamina, Doubao, and CapCut workflows. Check ByteDance's official product pages for current regional access and plan terms."
  );

  const faqs = [
    [
      "Where is Seedance 2.5 accessed in ByteDance's ecosystem?",
      "ByteDance introduced Seedance 2.5 via Volcano Engine ModelArk and positioned it for Dreamina, Doubao, and CapCut creator workflows. Check the official Volcano Engine, Dreamina, or CapCut sites for current availability and pricing in your region."
    ],
    [
      "Which tools can save earlier edits or search previously generated Seedance footage?",
      "Use non-linear editors such as CapCut, Final Cut Pro, or DaVinci Resolve to duplicate timelines and retain earlier edit versions, pair them with plain Markdown shot logs in Inkstone Notes for prompt and filename search, and use Apple Photos or AI Cleaning on iPhone to group reference images and duplicate takes."
    ],
    [
      "Does AI Cleaning process photos in the cloud?",
      "The developer describes photo classification and duplicate analysis as running locally on the iPhone without uploading your photo library. Automatic 9-category sorting requires Pro; review selections before deleting."
    ],
    [
      "Are these tools integrated directly with Seedance 2.5?",
      "No direct integration. Seedance 2.5 generates video clips, while CapCut or desktop NLEs manage edit history, Inkstone tracks Markdown notes, AI Cleaning organizes iPhone reference media, and Travel Translator assists on-location shoots."
    ]
  ];

  const faqSection = `<section class="section faq"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">FAQ</p><h2>Seedance 2.5 and creator workflow FAQ.</h2></div></div><div class="faq-list">${faqs
    .map(([q, a], idx) => `<details${idx === 0 ? " open" : ""}><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`)
    .join("")}</div></div></section>`;

  html = html.replace(/<section\b[^>]*id="seedance-version-search"[^>]*>[\s\S]*?<\/section>/g, "");
  html = html.replace(/<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">FAQ<\/p>[\s\S]*?<\/section>/, faqSection);
  html = html.replace(/<section class="section faq">[\s\S]*?<\/section>/, faqSection);

  const versionSection =
    '<section class="section content-section" id="seedance-version-search"><div class="section-inner content-grid"><div><p class="section-kicker">Versioning and search</p><h2>How to save earlier edits and search generated Seedance footage.</h2><p>AI video generators rarely replace non-linear edit history or structured local asset logs. Combine timeline versioning in your editor with plain-text shot notes and on-device photo sorting.</p></div><div class="content-list"><div><strong>Save earlier video edit versions</strong><p>Duplicate your timeline or project before major trims in <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a>, Apple Final Cut Pro, or DaVinci Resolve, and export dated milestone renders into a project folder so earlier cuts stay recoverable.</p></div><div><strong>Log prompts, seeds, and take filenames</strong><p>Keep a plain-text <code>.md</code> shot sheet in iCloud Drive with <a href="inkstone-markdown-notes.html">Inkstone Notes Markdown</a> so you can search prompt variants, reference frames, and selected takes across projects.</p></div><div><strong>Sort iPhone reference photos and duplicates</strong><p>Use Apple Photos albums and search for clip dates, then review burst shots, screenshots, and 9 Pro on-device categories in <a href="ai-photo-classification.html">AI Cleaning</a> before deleting unused takes.</p></div></div></div></section>';

  html = html.replace(/(<section class="section faq">)/, `${versionSection}$1`);

  const words = countVisibleWords(html);
  html = updateJsonLd(html, (node) => {
    if (node["@type"] === "Article") {
      node.headline = title;
      node.description = description;
      node.dateModified = modifiedDate;
      node.wordCount = words;
    }
    if (node["@type"] === "FAQPage") {
      node.mainEntity = faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text }
      }));
    }
  });
  return minifyHtml(html);
}

const pageUpdaters = [
  ["index.html", updateHomepage],
  ["gif-maker.html", updateGifMakerProduct],
  ["best-gif-maker-apps-iphone.html", updateGifComparisonPage],
  ["mac-screen-privacy.html", updateMacScreenPrivacy],
  ["automatic-bike-ride-tracker-iphone.html", updateAutoBikeGuide],
  ["seedance-ai-tools.html", updateSeedanceTools]
];

export async function applyCtrConversionUpdates(siteDir) {
  const updatedFiles = [];
  for (const [file, fn] of pageUpdaters) {
    const target = path.join(siteDir, file);
    const before = await readFile(target, "utf8");
    const after = fn(before);
    if (after !== before) {
      await writeFile(target, after, "utf8");
      updatedFiles.push(file);
    }
  }
  console.log(`CTR & conversion 2026-11-18: updated ${updatedFiles.length} of ${pageUpdaters.length} pages (${updatedFiles.join(", ") || "already current"}).`);
  return updatedFiles;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const index = process.argv.indexOf("--site-dir");
  const siteDir = path.resolve(index < 0 ? process.env.SITE_DIR ?? path.join(import.meta.dirname, "..") : process.argv[index + 1]);
  await applyCtrConversionUpdates(siteDir);
}
