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
    title: "Free Photo Cleaner App for iPhone | Free vs Pro (2026)",
    description: "Free photo cleaner app for iPhone: review duplicate and similar photos before deleting. AI Cleaning is free to download; optional Pro adds 9 AI categories.",
    keywords: "free photo cleaner app, free photo cleaner app for iPhone, iPhone photo cleaner app, duplicate photo cleaner, similar photo cleaner, free up iPhone storage",
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    headline: [
      "How to Choose an iPhone Photo Cleaner (2026 Guide)",
      "Best iPhone Photo Cleaner App? 9 AI Categories (2026)",
      "iPhone Photo Cleaner: Free Download and Optional AI (2026)",
      "Free Photo Cleaner App for iPhone: Free vs Pro (2026)"
    ],
    h1: [
      "The best iPhone photo cleaner should classify before it deletes.",
      "Is AI Cleaning the best iPhone photo cleaner for you?",
      "Best iPhone photo cleaner for you?",
      "Start free. Review duplicates before upgrading.",
      "Free photo cleaner app for iPhone. Review first."
    ]
  },
  {
    file: "duplicate-photo-cleaner-guide.html",
    title: "Duplicate Photo Cleaner for iPhone | Free &amp; Similar Photos",
    description: "Start with iPhone's free Duplicates tool, then use a duplicate photo cleaner for similar photos. Compare the best copy and review before deleting.",
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    headline: [
      "Duplicate Photo Cleaner Guide for iPhone",
      "Duplicate Photo Cleaner for iPhone: Safe Review Guide",
      "Duplicate Photo Cleaner for iPhone: Find and Delete Safely",
      "Duplicate Photo Cleaner for iPhone: Free and Similar Photo Options"
    ],
    h1: [
      "Clean duplicate iPhone photos without deleting the wrong memory.",
      "Find duplicate iPhone photos. Review before deleting.",
      "Find duplicate iPhone photos. Review first.",
      "Duplicate photo cleaner for iPhone. Find and delete safely.",
      "Duplicate photo cleaner for iPhone. Start free, then find similar shots.",
      "Duplicate photo cleaner for iPhone: start free, then find similar shots."
    ]
  },
  {
    file: "iphone-storage-cleanup-guide.html",
    title: "How to Clean Up iPhone Photo Storage for Free | 2026 Guide",
    description: "Practical iPhone storage cleanup guide for photos: classify the library, then review large media, screenshots, blurry shots, duplicates, and similar photos.",
    h1: [
      "Clean iPhone storage by reviewing the photo library first.",
      "Free up iPhone photo storage. Review first."
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
    title: "Photo Cleaner for iPhone | Find Duplicates &amp; Free Space",
    description: "Photo cleaner for iPhone that finds duplicate and similar photos, screenshots, blurry shots, and large files. Review first, then free up space safely.",
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    headline: [
      "iPhone Photo Cleaner with AI Classification",
      "AI Photo Cleaner for iPhone",
      "Photo Cleaner for iPhone: Find Duplicates and Free Space"
    ],
    h1: [
      "Sort and clean iPhone photos with on-device AI.",
      "Sort iPhone photos before you delete.",
      "Photo cleaner for iPhone. Find clutter, review, free space."
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
      "Clean iPhone photos with on-device AI and no uploads.",
      "Private iPhone photo cleaning. No uploads."
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
    title: "Free Bike Ride Tracker App for iPhone | HappyRide",
    description: "Free bike ride tracker app for iPhone that records qualifying rides automatically without tapping Start. Save GPS routes and Apple Health workouts.",
    keywords: "free bike ride tracker app, free bike ride tracker app for iPhone, bike ride tracker app, bike tracker app free, bike ride tracker iPhone, GPS bike ride tracker, Apple Health cycling app",
    modifiedDate: "2026-08-16",
    modifiedDateLabel: "August 16, 2026",
    webPage: {
      "@id": "https://www.xiaozhonglvyou.com/happyride-auto-ride-tracker.html#page",
      name: "Free Bike Ride Tracker App for iPhone | HappyRide",
      description: "Free bike ride tracker app for iPhone that records qualifying rides automatically without tapping Start. Save GPS routes and Apple Health workouts.",
      dateModified: "2026-08-16"
    },
    softwareApplication: {
      "@id": "https://www.xiaozhonglvyou.com/happyride-auto-ride-tracker.html#app",
      alternateName: [
        "HappyRide",
        "Free Bike Ride Tracker App",
        "Bike Ride Tracker App"
      ],
      description: "Free bike ride tracker app for iPhone that records qualifying rides automatically without tapping Start. Save GPS routes and Apple Health workouts."
    },
    h1: [
      "Automatic cycling workout tracking, even when you forget to start.",
      "HappyRide records the rides you forget to start.",
      "Free bike ride tracker app for iPhone. No Start button."
    ]
  },
  {
    file: "automatic-bike-ride-tracker-iphone.html",
    title: "How to Track a Bike Ride on iPhone Automatically (2026)",
    description: "Track a bike ride on iPhone automatically without tapping Start. Set up Motion &amp; Fitness, background location, Apple Health, Apple Watch, and a test ride.",
    keywords: "how to track a bike ride on iPhone, how can I track my bike ride on iPhone, bike ride tracker iPhone, bike ride tracker app, track cycling on iPhone, automatic bike ride tracker",
    modifiedDate: "2026-08-16",
    modifiedDateLabel: "August 16, 2026",
    article: {
      description: "Track a bike ride on iPhone automatically without tapping Start. Set up Motion & Fitness, background location, Apple Health, Apple Watch, and a test ride.",
      keywords: [
        "how to track a bike ride on iPhone",
        "how can I track my bike ride on iPhone",
        "bike ride tracker iPhone",
        "bike ride tracker app",
        "automatic bike ride tracker",
        "Apple Health workout",
        "background GPS ride recording"
      ]
    },
    autoArticleWordCount: true,
    howTo: {
      "@id": "https://www.xiaozhonglvyou.com/automatic-bike-ride-tracker-iphone.html#howto",
      name: "How to track a bike ride on iPhone automatically",
      description: "Set up HappyRide to detect qualifying bike rides, record GPS routes, and save Apple Health workouts without tapping Start."
    },
    headline: [
      "Automatic Bike Ride Tracker for iPhone (2026 Guide)",
      "Automatic Bike Ride Tracking on iPhone: 4 Steps (2026)",
      "Automatic iPhone Bike Tracker: No Start Button (2026)",
      "How to Track a Bike Ride on iPhone Automatically (2026)"
    ],
    h1: [
      "Track a bike ride without pressing Start.",
      "Set up automatic bike ride tracking in 4 steps.",
      "Automatic bike ride tracking. No Start button.",
      "Track a bike ride on iPhone automatically in 4 steps."
    ]
  },
  {
    file: "best-travel-translator-apps-iphone.html",
    title: "Best Translator Apps for Travel: 3 Compared (2026)",
    description: "Compare the best translator apps for travel on iPhone: Apple Translate, Google Translate, and Translation Specialist for voice, camera, and offline use.",
    keywords: "best translator apps for travel, best translator app for travel, translation apps for travelers, offline translator app, voice translator app, camera translator app",
    article: {
      description: "Compare the best translator apps for travel on iPhone: Apple Translate, Google Translate, and Translation Specialist for voice, camera, and offline use.",
      keywords: [
        "best translator apps for travel",
        "best translator app for travel",
        "translation apps for travelers",
        "Apple Translate vs Google Translate",
        "offline translator app",
        "camera translator app",
        "voice translator app"
      ],
      wordCount: 1478
    },
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    headline: [
      "Best Travel Translator Apps for iPhone: 3 Compared (2026)",
      "Best Translator Apps for Travel: 3 Compared (2026)"
    ],
    h1: [
      "The best travel translator depends on how you communicate.",
      "3 travel translator apps compared.",
      "3 best travel translator apps for iPhone, compared.",
      "3 best translator apps for travel, compared."
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
  const args = { siteDir: process.cwd(), files: new Set() };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--site-dir" && argv[index + 1]) {
      args.siteDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    if (argv[index] === "--file" && argv[index + 1]) {
      args.files.add(argv[index + 1]);
      index += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${argv[index]}`);
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

function countVisibleMainWords(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  const visibleText = main
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return visibleText ? visibleText.split(/\s+/).length : 0;
}

function updateJsonLd(html, page) {
  const updates = [
    page.article && { type: "Article", values: page.article, label: "Article" },
    page.webPage && { type: "WebPage", id: page.webPage["@id"], values: page.webPage, label: "WebPage" },
    page.softwareApplication && {
      type: "SoftwareApplication",
      id: page.softwareApplication["@id"],
      values: page.softwareApplication,
      label: "SoftwareApplication"
    },
    page.howTo && { type: "HowTo", id: page.howTo["@id"], values: page.howTo, label: "HowTo" }
  ].filter(Boolean);

  if (updates.length === 0) return html;

  const counts = new Map(updates.map((update) => [update, 0]));

  const updatedHtml = html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, content, close) => {
      const parsed = JSON.parse(content);
      let changed = false;

      const visit = (value) => {
        if (Array.isArray(value)) {
          value.forEach(visit);
          return;
        }

        if (!value || typeof value !== "object") return;

        const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];

        for (const update of updates) {
          if (!types.includes(update.type)) continue;
          if (update.id && value["@id"] !== update.id) continue;

          counts.set(update, counts.get(update) + 1);

          for (const [key, expected] of Object.entries(update.values)) {
            if (JSON.stringify(value[key]) !== JSON.stringify(expected)) {
              value[key] = expected;
              changed = true;
            }
          }
        }

        Object.values(value).forEach(visit);
      };

      visit(parsed);
      if (!changed) return full;

      const indent = content.match(/^\s*\n([ \t]+)/)?.[1] ?? "      ";
      const formatted = JSON.stringify(parsed, null, 2)
        .split("\n")
        .map((line) => `${indent}${line}`)
        .join("\n");

      return `${open}\n${formatted}\n    ${close}`;
    }
  );

  for (const update of updates) {
    const count = counts.get(update);
    if (count !== 1) {
      throw new Error(`Expected one ${page.file} ${update.label} node, found ${count}`);
    }
  }

  return updatedHtml;
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

  if (page.keywords) {
    html = replaceMeta(html, "name", "keywords", page.keywords, `${page.file} keywords`);
  }

  if (page.headline) {
    html = replaceFromCandidates(
      html,
      page.headline,
      (value) => `"headline": "${value}"`,
      `${page.file} Article headline`
    );
  }

  if (page.headline || page.modifiedDate) {
    const pageModifiedDate = page.modifiedDate ?? modifiedDate;
    const pageModifiedDateLabel = page.modifiedDateLabel ?? modifiedDateLabel;
    if (page.headline) {
      html = replaceMeta(
        html,
        "property",
        "article:modified_time",
        pageModifiedDate,
        `${page.file} article:modified_time`
      );
    }
    html = html.replace(
      /"dateModified": "\d{4}-\d{2}-\d{2}"/,
      `"dateModified": "${pageModifiedDate}"`
    );
    html = html.replace(
      /Updated <time datetime="\d{4}-\d{2}-\d{2}">[^<]+<\/time>/,
      `Updated <time datetime="${pageModifiedDate}">${pageModifiedDateLabel}</time>`
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

  const pageWithResolvedArticle = page.autoArticleWordCount
    ? {
        ...page,
        article: {
          ...page.article,
          wordCount: countVisibleMainWords(html)
        }
      }
    : page;

  html = updateJsonLd(html, pageWithResolvedArticle);

  if (html !== original) await writeFile(filePath, html, "utf8");
  return html !== original;
}

const { siteDir, files } = parseArgs(process.argv.slice(2));
const selectedPages = files.size > 0 ? pages.filter((page) => files.has(page.file)) : pages;

if (selectedPages.length !== (files.size || pages.length)) {
  const knownFiles = new Set(selectedPages.map((page) => page.file));
  const unknownFiles = [...files].filter((file) => !knownFiles.has(file));
  throw new Error(`Unknown page file: ${unknownFiles.join(", ")}`);
}

const changed = [];

for (const page of selectedPages) {
  if (await updatePage(siteDir, page)) changed.push(page.file);
}

console.log(`Updated ${changed.length} CTR-focused pages in ${siteDir}.`);
