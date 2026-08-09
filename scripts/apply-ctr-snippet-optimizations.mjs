#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const pages = [
  {
    file: "index.html",
    title: "iPhone &amp; Mac Apps: Photo Cleaner, GIF Maker &amp; Privacy",
    h1: [
      "Focused tools for creating, moving, traveling, and staying private.",
      "iPhone and Mac apps for photos, travel, fitness, and privacy."
    ]
  },
  {
    file: "apps.html",
    title: "All CrazyAIAgent Apps | iPhone, Apple Watch &amp; Mac",
    h1: [
      "Utility apps for photo cleanup, travel, and Mac privacy.",
      "All CrazyAIAgent apps for iPhone, Apple Watch, and Mac."
    ]
  },
  {
    file: "guides.html",
    title: "iPhone &amp; Mac App Guides | Photos, Translation &amp; Privacy",
    description: "Practical guides for iPhone photo organization, duplicate cleanup, voice and camera translation, GIF creation, ride tracking, and Mac screen privacy.",
    h1: [
      "Understand the workflow before installing.",
      "Practical iPhone and Mac app guides."
    ]
  },
  {
    file: "ai-photo-classification.html",
    title: "AI Photo Classification for iPhone | On-Device Organizer",
    headline: [
      "AI Photo Classification for iPhone",
      "AI Photo Classification for iPhone"
    ]
  },
  {
    file: "ai-photo-organizer-guide.html",
    title: "How to Organize iPhone Photos with AI (2026 Guide)",
    headline: [
      "AI Photo Organizer Guide for iPhone",
      "How to Organize iPhone Photos with AI"
    ],
    h1: [
      "Classify an iPhone photo library before deciding what to clean.",
      "Organize iPhone photos with AI before deciding what to clean."
    ]
  },
  {
    file: "best-iphone-photo-cleaner-app.html",
    title: "Best Free iPhone Photo Cleaner App (2026 Guide)",
    headline: [
      "Best Photo Cleaner App for iPhone 2026",
      "Best Free iPhone Photo Cleaner App (2026 Guide)"
    ]
  },
  {
    file: "duplicate-photo-cleaner-guide.html",
    title: "Duplicate Photo Cleaner for iPhone | Safe Review Guide",
    headline: [
      "Duplicate Photo Cleaner Guide for iPhone",
      "Duplicate Photo Cleaner for iPhone: Safe Review Guide"
    ]
  },
  {
    file: "iphone-photo-cleaner-comparison.html",
    title: "Best iPhone Photo Cleaner Apps (2026 Comparison)",
    headline: [
      "iPhone Photo Cleaner Apps Compared 2026",
      "Best iPhone Photo Cleaner Apps: 2026 Comparison"
    ],
    h1: [
      "Best iPhone photo cleaner apps compared: AI Cleaning vs Google Photos vs Gemini Photos.",
      "Compare the best iPhone photo cleaner apps for 2026."
    ]
  },
  {
    file: "iphone-photo-cleaner.html",
    title: "AI Photo Cleaner for iPhone | Sort Before You Delete",
    headline: [
      "iPhone Photo Cleaner with AI Classification",
      "AI Photo Cleaner for iPhone"
    ]
  },
  {
    file: "private-ai-photo-cleaner.html",
    title: "Private AI Photo Cleaner for iPhone | On-Device Cleanup",
    headline: [
      "Private AI Photo Cleaner for iPhone",
      "Private AI Photo Cleaner for iPhone"
    ]
  },
  {
    file: "gif-maker.html",
    title: "GIF Maker for iPhone: Video &amp; Live Photos to GIF",
    h1: [
      "Turn photos, video, or Live Photos into a GIF.",
      "Make GIFs from video and Live Photos on iPhone."
    ]
  },
  {
    file: "happyride-auto-ride-tracker.html",
    title: "Automatic Cycling Workout Tracker | iPhone &amp; Apple Watch",
    h1: [
      "HappyRide records the ride you forgot to start.",
      "Automatic cycling workout tracking, even when you forget to start."
    ]
  },
  {
    file: "travel-translator.html",
    title: "Travel Translator for iPhone | Voice, Camera &amp; Offline",
    headline: [
      "Travel Translator App for Voice and Camera Translation",
      "Travel Translator for iPhone"
    ],
    h1: [
      "Voice and camera translation for international trips.",
      "An iPhone travel translator for voice, camera, and offline use."
    ]
  },
  {
    file: "voice-camera-translator-guide.html",
    title: "Voice &amp; Camera Translator for Travel (2026 Guide)",
    headline: [
      "Voice and Camera Translator Guide for Travel",
      "Voice and Camera Translator for Travel"
    ]
  },
  {
    file: "mac-screen-privacy.html",
    title: "Mac Screen Privacy App | Hide Sensitive Windows",
    headline: [
      "Mac Screen Privacy App",
      "Mac Screen Privacy App"
    ],
    h1: [
      "Protect sensitive Mac work in shared spaces.",
      "Hide sensitive Mac windows in shared spaces."
    ]
  },
  {
    file: "screen-sharing-privacy-guide.html",
    title: "How to Protect Mac Privacy During Screen Sharing",
    headline: [
      "Mac Screen Sharing Privacy Guide",
      "How to Protect Mac Privacy During Screen Sharing"
    ],
    h1: [
      "Protect sensitive Mac windows before a meeting or nearby glance exposes them.",
      "Protect Mac privacy before screen sharing."
    ]
  },
  {
    file: "es-es.html",
    title: "Apps iPhone y Mac | Fotos IA, Traductor y Privacidad"
  },
  {
    file: "it-it.html",
    title: "App iPhone e Mac | Foto IA, Traduzione e Privacy"
  },
  {
    file: "netherlands-nordics-apps.html",
    title: "Netherlands &amp; Nordic Apps | Photos, Translation, Privacy"
  },
  {
    file: "switzerland-apps.html",
    title: "Swiss Utility Apps | Photo Cleaner, Translator &amp; Privacy"
  },
  {
    file: "seedance-ai-tools.html",
    title: "Seedance 2.5 Creator Tools | AI Photo Management Guide",
    headline: [
      "Seedance 2.5 AI Video Creator Tools 2026",
      "Seedance 2.5 Creator Tools for AI Photo Management"
    ]
  }
];

const modifiedDate = "2026-08-10";
const modifiedDateLabel = "August 10, 2026";

function parseArgs(argv) {
  const args = { siteDir: process.cwd() };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--site-dir" || !argv[index + 1]) {
      throw new Error(`Unknown or incomplete argument: ${argv[index]}`);
    }

    args.siteDir = path.resolve(argv[index + 1]);
    index += 1;
  }

  return args;
}

function replaceExactlyOnce(html, search, replacement, label) {
  const first = html.indexOf(search);

  if (first === -1) {
    if (html.includes(replacement)) return html;
    throw new Error(`Missing ${label}`);
  }

  if (html.indexOf(search, first + search.length) !== -1) {
    throw new Error(`Expected one ${label}`);
  }

  return html.replace(search, replacement);
}

function replaceMeta(html, attribute, name, value, label) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}=["']${name}["'])[^>]*>`, "i");
  const match = html.match(pattern)?.[0];

  if (!match) throw new Error(`Missing ${label}`);

  const updated = match.replace(/content=(["'])[\s\S]*?\1/i, `content="${value}"`);
  return html.replace(match, updated);
}

async function updatePage(siteDir, page) {
  const filePath = path.join(siteDir, page.file);
  let html = await readFile(filePath, "utf8");
  const original = html;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`);
  html = replaceMeta(html, "property", "og:title", page.title, `${page.file} og:title`);
  html = replaceMeta(html, "name", "twitter:title", page.title, `${page.file} twitter:title`);

  if (page.description) {
    html = replaceMeta(html, "name", "description", page.description, `${page.file} description`);
    html = replaceMeta(html, "property", "og:description", page.description, `${page.file} og:description`);
    html = replaceMeta(html, "name", "twitter:description", page.description, `${page.file} twitter:description`);
  }

  if (page.headline && page.headline[0] !== page.headline[1]) {
    html = replaceExactlyOnce(
      html,
      `"headline": "${page.headline[0]}"`,
      `"headline": "${page.headline[1]}"`,
      `${page.file} Article headline`
    );
  }

  if (page.headline) {
    html = replaceMeta(
      html,
      "property",
      "article:modified_time",
      modifiedDate,
      `${page.file} article:modified_time`
    );
    html = html.replace(
      /"dateModified": "\d{4}-\d{2}-\d{2}"/,
      `"dateModified": "${modifiedDate}"`
    );
    html = html.replace(
      /Updated <time datetime="\d{4}-\d{2}-\d{2}">[^<]+<\/time>/,
      `Updated <time datetime="${modifiedDate}">${modifiedDateLabel}</time>`
    );
  }

  if (page.h1) {
    html = replaceExactlyOnce(
      html,
      `>${page.h1[0]}</h1>`,
      `>${page.h1[1]}</h1>`,
      `${page.file} H1`
    );
  }

  if (html !== original) await writeFile(filePath, html, "utf8");
  return html !== original;
}

const { siteDir } = parseArgs(process.argv.slice(2));
const changed = [];

for (const page of pages) {
  if (await updatePage(siteDir, page)) changed.push(page.file);
}

console.log(`Updated ${changed.length} CTR-focused pages in ${siteDir}.`);
