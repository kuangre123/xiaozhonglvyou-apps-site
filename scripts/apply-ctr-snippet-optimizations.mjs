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
    title: "AI Photo Classification App for iPhone | 9 Smart Categories",
    description: "Classify iPhone photos privately on-device into 9 useful categories, then review duplicates, screenshots, blurry shots, and large media before deleting.",
    headline: [
      "AI Photo Classification for iPhone",
      "AI Photo Classification App for iPhone: 9 Smart Categories"
    ],
    h1: [
      "AI photo classification for iPhone photo libraries.",
      "Classify iPhone photos into 9 useful categories."
    ]
  },
  {
    file: "ai-photo-organizer-guide.html",
    title: "AI Photo Organizer for iPhone: 5 Steps, 9 Categories (2026)",
    description: "Organize iPhone photos in 5 steps with 9 on-device AI categories. Review duplicates and screenshots. Free download; optional Pro subscription.",
    headline: [
      "How to Organize iPhone Photos with AI",
      "AI Photo Organizer for iPhone: 5 Steps, 9 Categories (2026)"
    ],
    h1: [
      "Organize iPhone photos with AI before deciding what to clean.",
      "Organize iPhone photos in 5 steps with 9 AI categories."
    ]
  },
  {
    file: "best-iphone-photo-cleaner-app.html",
    title: "Best iPhone Photo Cleaner App? 9 AI Categories (2026)",
    description: "Try AI Cleaning free: review duplicates or sort iPhone photos into 9 on-device AI categories. Optional subscriptions; App Store says no data collected.",
    headline: [
      "How to Choose an iPhone Photo Cleaner (2026 Guide)",
      "Best iPhone Photo Cleaner App? 9 AI Categories (2026)"
    ],
    h1: [
      "The best iPhone photo cleaner should classify before it deletes.",
      "Is AI Cleaning the best iPhone photo cleaner for you?",
      "Best iPhone photo cleaner for you?"
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
    title: "Best iPhone Photo Cleaner Apps: 3 Compared (2026)",
    headline: [
      "Best iPhone Photo Cleaner Apps: 2026 Comparison",
      "Best iPhone Photo Cleaner Apps: 3 Compared (2026)"
    ],
    h1: [
      "Compare the best iPhone photo cleaner apps for 2026.",
      "AI Cleaning vs Cleanup vs Cleaner Kit.",
      "Compare 3 iPhone photo cleaner apps.",
      "Compare AI Cleaning, Cleanup, and Cleaner Kit.",
      "3 iPhone photo cleaner apps compared."
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
    title: "Private AI Photo Cleaner for iPhone | No Uploads (2026)",
    description: "On-device AI finds duplicates and 9 photo categories with no photo uploads. App Store says Data Not Collected. Free download; optional Pro subscription.",
    headline: [
      "Private AI Photo Cleaner for iPhone",
      "Private AI Photo Cleaner for iPhone | No Uploads (2026)"
    ],
    h1: [
      "Private AI photo cleanup should start on the iPhone.",
      "Clean iPhone photos with on-device AI and no uploads."
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
    file: "make-gif-on-iphone-guide.html",
    title: "How to Make a Real GIF on iPhone in 5 Steps (2026)",
    description: "Turn video or a Live Photo into a real GIF on iPhone in 5 steps. Edit timing and playback, then export up to 1080px on-device. Free app; no uploads.",
    headline: [
      "How to Make a GIF on iPhone from Video or Live Photos",
      "How to Make a Real GIF on iPhone in 5 Steps (2026)"
    ],
    h1: [
      "Make a GIF on iPhone from video or Live Photos.",
      "Make a real GIF on iPhone in 5 steps."
    ]
  },
  {
    file: "happyride-auto-ride-tracker.html",
    title: "HappyRide Auto Ride Tracker | iPhone &amp; Apple Watch",
    h1: [
      "Automatic cycling workout tracking, even when you forget to start.",
      "HappyRide records the rides you forget to start."
    ]
  },
  {
    file: "automatic-bike-ride-tracker-iphone.html",
    title: "Automatic Bike Ride Tracking on iPhone: 4 Steps (2026)",
    description: "Set up automatic bike ride tracking on iPhone in 4 steps. Compare no-Start detection, Apple Watch, permissions, Apple Health, and short-ride limits.",
    headline: [
      "Automatic Bike Ride Tracker for iPhone (2026 Guide)",
      "Automatic Bike Ride Tracking on iPhone: 4 Steps (2026)"
    ],
    h1: [
      "Track a bike ride without pressing Start.",
      "Set up automatic bike ride tracking in 4 steps."
    ]
  },
  {
    file: "best-travel-translator-apps-iphone.html",
    title: "Best Travel Translator Apps for iPhone: 3 Compared (2026)"
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
    title: "Voice &amp; Camera Translator for Travel: 6 Steps (2026)",
    description: "Translate travel conversations, menus, and signs on iPhone in 6 steps. Use voice, camera OCR, live interpretation, and offline core language pairs.",
    headline: [
      "Voice and Camera Translator Guide for Travel",
      "Voice and Camera Translator for Travel",
      "Voice and Camera Translator for Travel: 6 Steps (2026)"
    ],
    h1: [
      "Use voice translation for conversations and camera OCR for the world around you.",
      "Use a voice and camera translator for travel in 6 steps."
    ]
  },
  {
    file: "mac-screen-privacy.html",
    title: "Best Mac Screen Privacy App? Free vs Full (2026)",
    description: "Compare free Anti-spy screen Lite vs the $2.99 full Mac app for local face detection, sensitive-window hiding, presentation mode, and screen-share privacy.",
    headline: [
      "Mac Screen Privacy App",
      "Best Mac Screen Privacy App? Free vs Full (2026)"
    ],
    h1: [
      "Hide sensitive Mac windows in shared spaces.",
      "Choose the right Mac screen privacy app."
    ]
  },
  {
    file: "screen-sharing-privacy-guide.html",
    title: "Mac Screen Sharing Privacy Checklist: 6 Steps (2026)",
    description: "Protect private windows and notifications before sharing your Mac screen. Follow 6 steps for permissions, protected apps, Presenting Mode, and a test.",
    headline: [
      "Mac Screen Sharing Privacy Guide",
      "How to Protect Mac Privacy During Screen Sharing",
      "Mac Screen Sharing Privacy Checklist: 6 Steps (2026)"
    ],
    h1: [
      "Protect sensitive Mac windows before a meeting or nearby glance exposes them.",
      "Protect Mac privacy before screen sharing.",
      "Protect Mac screen sharing privacy in 6 steps."
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

function replaceFromCandidates(html, candidates, wrap, label) {
  const target = wrap(candidates.at(-1));

  if (html.includes(target)) return html;

  for (const candidate of candidates.slice(0, -1)) {
    const search = wrap(candidate);
    if (html.includes(search)) {
      return replaceExactlyOnce(html, search, target, label);
    }
  }

  throw new Error(`Missing ${label}`);
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

  if (page.headline) {
    html = replaceFromCandidates(
      html,
      page.headline,
      (value) => `"headline": "${value}"`,
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
    html = replaceFromCandidates(
      html,
      page.h1,
      (value) => `>${value}</h1>`,
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
