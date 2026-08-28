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
    modifiedDate: "2026-08-12",
    modifiedDateLabel: "August 12, 2026",
    article: {
      headline: "AI Photo Classification App for iPhone | 9 Smart Categories",
      description: "Classify iPhone photos privately on-device into 9 useful categories, then review duplicates, screenshots, blurry shots, and large media before deleting."
    },
    headline: [
      "AI Photo Classification for iPhone",
      "AI Photo Classification App for iPhone: 9 Smart Categories",
      "AI Photo Classification App for iPhone | 9 Smart Categories"
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
    article: {
      headline: "Free Photo Cleaner App for iPhone | Free vs Pro (2026)",
      description: "Free photo cleaner app for iPhone: review duplicate and similar photos before deleting. AI Cleaning is free to download; optional Pro adds 9 AI categories."
    },
    headline: [
      "How to Choose an iPhone Photo Cleaner (2026 Guide)",
      "Best iPhone Photo Cleaner App? 9 AI Categories (2026)",
      "iPhone Photo Cleaner: Free Download and Optional AI (2026)",
      "Free Photo Cleaner App for iPhone: Free vs Pro (2026)",
      "Free Photo Cleaner App for iPhone | Free vs Pro (2026)"
    ]
  },
  {
    file: "duplicate-photo-cleaner-guide.html",
    title: "Duplicate Photo Cleaner for iPhone | Free &amp; Similar Photos",
    description: "Start with iPhone's free Duplicates tool, then use a duplicate photo cleaner for similar photos. Compare the best copy and review before deleting.",
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    article: {
      headline: "Duplicate Photo Cleaner for iPhone | Free & Similar Photos",
      description: "Start with iPhone's free Duplicates tool, then use a duplicate photo cleaner for similar photos. Compare the best copy and review before deleting."
    },
    headline: [
      "Duplicate Photo Cleaner Guide for iPhone",
      "Duplicate Photo Cleaner for iPhone: Safe Review Guide",
      "Duplicate Photo Cleaner for iPhone: Find and Delete Safely",
      "Duplicate Photo Cleaner for iPhone: Free and Similar Photo Options",
      "Duplicate Photo Cleaner for iPhone | Free & Similar Photos"
    ]
  },
  {
    file: "iphone-storage-cleanup-guide.html",
    title: "How to Clean Up iPhone Photo Storage for Free | 2026 Guide",
    description: "Practical iPhone storage cleanup guide for photos: classify the library, then review large media, screenshots, blurry shots, duplicates, and similar photos.",
    modifiedDate: "2026-08-11",
    modifiedDateLabel: "August 11, 2026",
    article: {
      headline: "How to Clean Up iPhone Photo Storage for Free | 2026 Guide",
      description: "Practical iPhone storage cleanup guide for photos: classify the library, then review large media, screenshots, blurry shots, duplicates, and similar photos."
    },
    headline: [
      "How to Clean Up iPhone Photo Storage for Free",
      "How to Clean Up iPhone Photo Storage for Free | 2026 Guide"
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
    article: {
      headline: "Photo Cleaner for iPhone | Find Duplicates & Free Space",
      description: "Photo cleaner for iPhone that finds duplicate and similar photos, screenshots, blurry shots, and large files. Review first, then free up space safely."
    },
    headline: [
      "iPhone Photo Cleaner with AI Classification",
      "AI Photo Cleaner for iPhone",
      "Photo Cleaner for iPhone: Find Duplicates and Free Space",
      "Photo Cleaner for iPhone | Find Duplicates & Free Space"
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
    title: "Free GIF Maker App for iPhone | Video &amp; Live Photo",
    description: "Free GIF maker app for iPhone that turns videos, Live Photos, and pictures into GIFs. Edit timing, captions, canvas, reverse, and boomerang on-device.",
    keywords: "free GIF maker app, free GIF maker app for iPhone, iPhone GIF maker, video GIF maker free for iPhone, GIF maker from photos, animated GIF maker, on-device GIF editor",
    modifiedDate: "2026-08-21",
    modifiedDateLabel: "August 21, 2026",
    webPage: {
      "@id": "https://www.xiaozhonglvyou.com/gif-maker.html#page",
      name: "Free GIF Maker App for iPhone | Video & Live Photo",
      description: "Free GIF maker app for iPhone that turns videos, Live Photos, and pictures into GIFs. Edit timing, captions, canvas, reverse, and boomerang on-device.",
      dateModified: "2026-08-21"
    },
    softwareApplication: {
      "@id": "https://www.xiaozhonglvyou.com/gif-maker.html#app",
      alternateName: [
        "GIFmaker",
        "GIF Maker: Photos & Video",
        "Free GIF Maker App for iPhone",
        "Video to GIF Maker"
      ],
      description: "A free GIF maker app for iPhone that creates animated GIFs from photos, videos, and Live Photos with timing, captions, frame order, canvas, and playback controls."
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/gif-maker.html#breadcrumb",
        values: {
          name: "Free GIF Maker App for iPhone",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.xiaozhonglvyou.com/" },
            { "@type": "ListItem", position: 2, name: "Apps", item: "https://www.xiaozhonglvyou.com/apps.html" },
            { "@type": "ListItem", position: 3, name: "Free GIF Maker App for iPhone", item: "https://www.xiaozhonglvyou.com/gif-maker.html" }
          ]
        }
      }
    ],
    questions: [
      {
        names: ["Can GIFmaker turn a video or Live Photo into a GIF?", "Is there a free GIF maker app for iPhone?"],
        answer: "Yes. GIFmaker-Gif Studio is free to download and turns photos, videos, and Live Photos into GIFs on iPhone. It includes per-frame timing, captions, canvas ratios, reverse, and boomerang playback."
      }
    ],
    removeJsonLdIds: ["https://www.xiaozhonglvyou.com/gif-maker.html#howto"],
    h1: [
      "Turn photos, video, or Live Photos into a GIF.",
      "Make GIFs from video and Live Photos on iPhone.",
      "Turn videos and Live Photos into GIFs on iPhone.",
      "Free GIF maker app for iPhone."
    ],
    replacements: [
      {
        label: "product breadcrumb label",
        from: ["<li aria-current=\"page\">GIFmaker</li>"],
        to: "<li aria-current=\"page\">Free GIF Maker App</li>"
      },
      {
        label: "product eyebrow",
        from: ["<p class=\"eyebrow\">GIF maker for iPhone</p>"],
        to: "<p class=\"eyebrow\">Free GIF maker app for iPhone</p>"
      },
      {
        label: "product hero summary",
        from: ["<p class=\"hero-summary\">Edit frame timing, captions, canvas, reverse, and boomerang with live preview. Everything stays on-device.</p>"],
        to: "<p class=\"hero-summary\">Turn videos, Live Photos, or pictures into GIFs. Edit timing, captions, canvas, reverse, and boomerang with on-device processing.</p>"
      },
      {
        label: "product guide call to action",
        from: ["<a class=\"button button-secondary\" href=\"privacy.html#gifmaker\">Privacy details</a>"],
        to: "<a class=\"button button-secondary\" href=\"make-gif-on-iphone-guide.html\">Make a GIF from video</a>"
      },
      {
        label: "product workflow section id",
        from: ["id=\"make-a-gif-on-iphone\""],
        to: "id=\"gif-maker-workflow\""
      },
      {
        label: "product workflow introduction",
        from: ["<div><p class=\"section-kicker\">Four-step workflow</p><h2>How to make a GIF on iPhone.</h2><p>Choose the source first, then use the live preview to refine the loop before you export. For the full workflow and the difference between Photos effects and a portable .gif file, read the <a href=\"make-gif-on-iphone-guide.html\">five-step real GIF guide</a>.</p></div>"],
        to: "<div><p class=\"section-kicker\">What the app includes</p><h2>One iPhone GIF maker for photos, video, and Live Photos.</h2><p>Choose the source, refine the loop with live preview, and export from the same app. For the complete video workflow and the difference between Photos effects and a portable .gif file, read <a href=\"make-gif-on-iphone-guide.html\">how to make a GIF on iPhone from video</a>.</p></div>"
      },
      {
        label: "product visible FAQ",
        from: ["<details open><summary>Can GIFmaker turn a video or Live Photo into a GIF?</summary><p>Yes. GIFmaker can import photos, videos, or Live Photos and turn them into animated GIFs on iPhone.</p></details>"],
        to: "<details open><summary>Is there a free GIF maker app for iPhone?</summary><p>Yes. GIFmaker-Gif Studio is free to download and turns photos, videos, and Live Photos into GIFs on iPhone. It includes per-frame timing, captions, canvas ratios, reverse, and boomerang playback.</p></details>"
      }
    ]
  },
  {
    file: "make-gif-on-iphone-guide.html",
    title: "How to Make a GIF on iPhone From Video: 5 Steps (2026)",
    description: "Make a GIF on iPhone from video in 5 steps. Trim frames, tune timing, and export up to 1080px. Also learn how to turn a Live Photo into a GIF.",
    keywords: "how to make a GIF on iPhone from video, convert video to GIF iPhone, turn video into GIF iPhone, how to turn a Live Photo into a GIF, convert Live Photo to GIF",
    modifiedDate: "2026-08-21",
    modifiedDateLabel: "August 21, 2026",
    headline: [
      "How to Make a GIF on iPhone from Video or Live Photos",
      "How to Make a Real GIF on iPhone in 5 Steps (2026)",
      "How to Make a GIF on iPhone From Video or Live Photo (2026)",
      "How to Make a GIF on iPhone From Video: 5 Steps (2026)"
    ],
    article: {
      "@id": "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html#article",
      headline: "How to Make a GIF on iPhone From Video: 5 Steps (2026)",
      description: "Make a GIF on iPhone from video in five steps, with trimming, frame timing, canvas, captions, playback controls, and export up to 1080px. The guide also covers turning a Live Photo into a GIF.",
      dateModified: "2026-08-21",
      keywords: [
        "how to make a GIF on iPhone from video",
        "convert video to GIF iPhone",
        "turn video into GIF iPhone",
        "how to turn a Live Photo into a GIF",
        "convert Live Photo to GIF"
      ]
    },
    autoArticleWordCount: true,
    howTo: {
      "@id": "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html#howto",
      name: "How to make a GIF on iPhone from video",
      description: "Choose a video, trim the useful frames, tune timing and playback, set the canvas, and export a GIF up to 1080px on iPhone. The same workflow can turn a Live Photo into a GIF."
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html#breadcrumb",
        values: {
          name: "Make a GIF on iPhone From Video",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.xiaozhonglvyou.com/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.xiaozhonglvyou.com/guides.html" },
            { "@type": "ListItem", position: 3, name: "Make a GIF on iPhone From Video", item: "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html" }
          ]
        }
      }
    ],
    questions: [
      {
        names: ["Can the iPhone Photos app turn a Live Photo into a GIF?", "How do I turn a Live Photo into a GIF on iPhone?"],
        answer: "Open the Live Photo in GIFmaker, keep the useful frames, adjust timing and playback, preview the loop, then export a real GIF. Apple's Photos app can apply Loop or Bounce, but those effects do not provide the same frame and export controls."
      }
    ],
    h1: [
      "Make a GIF on iPhone from video or Live Photos.",
      "Make a real GIF on iPhone in 5 steps.",
      "Make a GIF from video or a Live Photo on iPhone.",
      "Make a GIF on iPhone from video in 5 steps."
    ],
    replacements: [
      {
        label: "guide breadcrumb label",
        from: ["<li aria-current=\"page\">Make a GIF on iPhone</li>"],
        to: "<li aria-current=\"page\">Make a GIF From Video</li>"
      },
      {
        label: "guide eyebrow",
        from: ["<p class=\"eyebrow\">Video and Live Photo guide</p>"],
        to: "<p class=\"eyebrow\">Video to GIF on iPhone</p>"
      },
      {
        label: "guide hero summary",
        from: ["<p class=\"hero-summary\">Make a real .gif in five steps: tune timing and playback, then export up to 1080px with free on-device editing and no uploads.</p>"],
        to: "<p class=\"hero-summary\">Trim the useful frames, tune timing and playback, then export up to 1080px. The same workflow also turns a Live Photo into a GIF.</p>"
      },
      {
        label: "guide publication date",
        from: ["<p class=\"article-meta\">Published and updated <time datetime=\"2026-08-13\">August 13, 2026</time> by <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\">Published August 10, 2026 · Updated <time datetime=\"2026-08-21\">August 21, 2026</time> by <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      },
      {
        label: "guide product call to action",
        from: ["<a class=\"button button-secondary\" href=\"gif-maker.html\">See GIFmaker details</a>"],
        to: "<a class=\"button button-secondary\" href=\"gif-maker.html\">Free GIF maker app</a>"
      },
      {
        label: "guide workflow heading",
        from: ["<h2>How to make a real GIF on iPhone.</h2>"],
        to: "<h2>How to turn a video into a GIF on iPhone.</h2>"
      },
      {
        label: "guide visible FAQ",
        from: ["<details open><summary>Can the iPhone Photos app turn a Live Photo into a GIF?</summary><p>Photos can apply Loop or Bounce to a Live Photo, which is useful for quick animation. Use a GIF maker when you need a real GIF file, frame timing, captions, canvas control, or predictable sharing outside Apple apps.</p></details>"],
        to: "<details open><summary>How do I turn a Live Photo into a GIF on iPhone?</summary><p>Open the Live Photo in GIFmaker, keep the useful frames, adjust timing and playback, preview the loop, then export a real GIF. Apple's Photos app can apply Loop or Bounce, but those effects do not provide the same frame and export controls.</p></details>"
      },
      {
        label: "guide related product label",
        from: ["<a class=\"region-card\" href=\"gif-maker.html\"><span>Product details</span><strong>GIFmaker features, privacy, requirements, and App Store link</strong></a>"],
        to: "<a class=\"region-card\" href=\"gif-maker.html\"><span>Free GIF maker app</span><strong>GIFmaker features, privacy, requirements, and App Store link</strong></a>"
      }
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
    file: "ai-photo-classification-cn.html",
    title: "AI照片分类指南 | iPhone相册整理和安全清理",
    description: "中文 AI 照片分类指南：先用智能分类整理 iPhone 相册，再逐组复查重复照片、相似照片、截图、模糊照片、票据、证件、文档和大文件，看清真实存储空间后决定安全清理，降低误删风险。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "AI照片分类指南 | iPhone相册整理和安全清理",
      description: "中文 AI 照片分类指南：先用智能分类整理 iPhone 相册，再逐组复查重复照片、相似照片、截图、模糊照片、票据、证件、文档和大文件，看清真实存储空间后决定安全清理，降低误删风险。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/ai-photo-classification-cn.html#breadcrumb",
        values: {
          name: "AI照片分类指南 | iPhone相册整理和安全清理",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "中文应用", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 3, name: "AI照片分类指南 | iPhone相册整理和安全清理", item: "https://www.xiaozhonglvyou.com/ai-photo-classification-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "AI classification guide breadcrumb label",
        from: ["<li aria-current=\"page\">AI照片分类指南</li>"],
        to: "<li aria-current=\"page\">AI照片分类指南 | iPhone相册整理和安全清理</li>"
      },
      {
        label: "AI classification guide modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-07-13\">"] ,
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "AI classification guide publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-07-13\">2026年7月13日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "duplicate-photo-cleaner-cn.html",
    title: "重复照片清理指南 | 相似照片和 iPhone 相册复查",
    description: "中文重复照片清理指南：讲解 iPhone 相册里重复照片、相似照片、连拍、截图和模糊照片如何成组复查、对比场景和内容后再决定保留或清理，避免一键误删珍贵回忆和重要记录。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "重复照片清理指南 | 相似照片和 iPhone 相册复查",
      description: "中文重复照片清理指南：讲解 iPhone 相册里重复照片、相似照片、连拍、截图和模糊照片如何成组复查、对比场景和内容后再决定保留或清理，避免一键误删珍贵回忆和重要记录。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/duplicate-photo-cleaner-cn.html#breadcrumb",
        values: {
          name: "重复照片清理指南 | 相似照片和 iPhone 相册复查",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "重复照片清理指南 | 相似照片和 iPhone 相册复查", item: "https://www.xiaozhonglvyou.com/duplicate-photo-cleaner-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "duplicate photo guide breadcrumb label",
        from: ["<li aria-current=\"page\">重复照片清理指南</li>"],
        to: "<li aria-current=\"page\">重复照片清理指南 | 相似照片和 iPhone 相册复查</li>"
      },
      {
        label: "duplicate photo guide modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-07-13\">"] ,
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "duplicate photo guide publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-07-13\">2026年7月13日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "iphone-photo-cleaner-cn.html",
    title: "iPhone照片清理 App | AI Cleaning 重复照片复查",
    description: "AI Cleaning 在 iPhone 本机查找重复和相似照片，集中复查截图、模糊照片和大文件；先确认再删除，核心功能免费，无需登录，照片不上传。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "iPhone照片清理 App | AI Cleaning 重复照片复查",
      description: "AI Cleaning 在 iPhone 本机查找重复和相似照片，集中复查截图、模糊照片和大文件；先确认再删除，核心功能免费，无需登录，照片不上传。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/iphone-photo-cleaner-cn.html#breadcrumb",
        values: {
          name: "iPhone照片清理 App | AI Cleaning 重复照片复查",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "iPhone照片清理 App | AI Cleaning 重复照片复查", item: "https://www.xiaozhonglvyou.com/iphone-photo-cleaner-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "iPhone photo cleaner breadcrumb label",
        from: ["<li aria-current=\"page\">iPhone照片清理指南</li>"],
        to: "<li aria-current=\"page\">iPhone照片清理 App | AI Cleaning 重复照片复查</li>"
      },
      {
        label: "iPhone photo cleaner modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-08-15\">"] ,
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "iPhone photo cleaner publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-08-15\">2026年8月15日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "gif-maker-cn.html",
    title: "iPhone GIF制作器 | 照片、视频和 Live Photo 转 GIF",
    description: "GIFmaker 可在 iPhone 本机把照片、视频和 Live Photo 制作成 GIF，支持逐帧调速、文字、倒放、回旋循环和多种画布比例。",
    webPage: {
      "@id": "https://www.xiaozhonglvyou.com/gif-maker-cn.html#page",
      name: "iPhone GIF制作器 | 照片、视频和 Live Photo 转 GIF",
      description: "GIFmaker 可在 iPhone 本机把照片、视频和 Live Photo 制作成 GIF，支持逐帧调速、文字、倒放、回旋循环和多种画布比例。"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/gif-maker-cn.html#breadcrumb",
        values: {
          name: "iPhone GIF制作器 | 照片、视频和 Live Photo 转 GIF",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "应用", item: "https://www.xiaozhonglvyou.com/apps.html" },
            { "@type": "ListItem", position: 3, name: "iPhone GIF制作器 | 照片、视频和 Live Photo 转 GIF", item: "https://www.xiaozhonglvyou.com/gif-maker-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "GIF maker product breadcrumb label",
        from: ["<li aria-current=\"page\">GIFmaker</li>"],
        to: "<li aria-current=\"page\">iPhone GIF制作器 | 照片、视频和 Live Photo 转 GIF</li>"
      }
    ]
  },
  {
    file: "ipad-photo-organizer-cn.html",
    title: "iPad照片整理指南 | 相册清理、AI分类和 iCloud 同步",
    description: "iPad照片整理指南：先确认 iCloud 同步，再用 AI 分类整理平板相册中的截图、文档、票据、重复照片和大视频，复查重要资料后再安全清理并释放空间。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "iPad照片整理指南 | 相册清理、AI分类和 iCloud 同步",
      description: "iPad照片整理指南：先确认 iCloud 同步，再用 AI 分类整理平板相册中的截图、文档、票据、重复照片和大视频，复查重要资料后再安全清理并释放空间。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/ipad-photo-organizer-cn.html#breadcrumb",
        values: {
          name: "iPad照片整理指南 | 相册清理、AI分类和 iCloud 同步",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "iPad照片整理指南 | 相册清理、AI分类和 iCloud 同步", item: "https://www.xiaozhonglvyou.com/ipad-photo-organizer-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "iPad guide breadcrumb label",
        from: ["<li aria-current=\"page\">iPad照片整理指南</li>"],
        to: "<li aria-current=\"page\">iPad照片整理指南 | 相册清理、AI分类和 iCloud 同步</li>"
      },
      {
        label: "iPad guide modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-07-13\">"],
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "iPad guide publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-07-13\">2026年7月13日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "mac-screen-privacy-cn.html",
    title: "Mac防窥和屏幕隐私指南 | 共享屏幕、演示和窗口保护",
    description: "Mac防窥和屏幕隐私指南：面向共享屏幕、远程会议、演示模式和开放办公区，了解本地人脸检测、敏感窗口隐藏、隐私遮挡块和 Lite 版本信息及系统要求。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "Mac防窥和屏幕隐私指南 | 共享屏幕、演示和窗口保护",
      description: "Mac防窥和屏幕隐私指南：面向共享屏幕、远程会议、演示模式和开放办公区，了解本地人脸检测、敏感窗口隐藏、隐私遮挡块和 Lite 版本信息及系统要求。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/mac-screen-privacy-cn.html#breadcrumb",
        values: {
          name: "Mac防窥和屏幕隐私指南 | 共享屏幕、演示和窗口保护",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "Mac防窥和屏幕隐私指南 | 共享屏幕、演示和窗口保护", item: "https://www.xiaozhonglvyou.com/mac-screen-privacy-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "Mac privacy guide breadcrumb label",
        from: ["<li aria-current=\"page\">Mac防窥和屏幕隐私</li>"],
        to: "<li aria-current=\"page\">Mac防窥和屏幕隐私指南 | 共享屏幕、演示和窗口保护</li>"
      },
      {
        label: "Mac privacy guide modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-08-03\">"],
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "Mac privacy guide publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-08-03\">2026年8月3日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "travel-translator-cn.html",
    title: "出国翻译通 | iPhone旅行语音、拍照 OCR 和离线翻译",
    description: "出国翻译通旅行指南：用双向语音、连续传译、拍照 OCR 和文字翻译应对机场、酒店、餐厅、菜单和路牌，核心语言对支持离线使用，适用于 iPhone。",
    modifiedDate: "2026-08-28",
    modifiedDateLabel: "2026年8月28日",
    article: {
      headline: "出国翻译通 | iPhone旅行语音、拍照 OCR 和离线翻译",
      description: "出国翻译通旅行指南：用双向语音、连续传译、拍照 OCR 和文字翻译应对机场、酒店、餐厅、菜单和路牌，核心语言对支持离线使用，适用于 iPhone。",
      dateModified: "2026-08-28"
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/travel-translator-cn.html#breadcrumb",
        values: {
          name: "出国翻译通 | iPhone旅行语音、拍照 OCR 和离线翻译",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "中文首页", item: "https://www.xiaozhonglvyou.com/zh-cn.html" },
            { "@type": "ListItem", position: 2, name: "出国翻译通 | iPhone旅行语音、拍照 OCR 和离线翻译", item: "https://www.xiaozhonglvyou.com/travel-translator-cn.html" }
          ]
        }
      }
    ],
    replacements: [
      {
        label: "travel translator guide breadcrumb label",
        from: ["<li aria-current=\"page\">出国翻译通</li>"],
        to: "<li aria-current=\"page\">出国翻译通 | iPhone旅行语音、拍照 OCR 和离线翻译</li>"
      },
      {
        label: "travel translator guide modified time",
        from: ["<meta property=\"article:modified_time\" content=\"2026-07-14\">"],
        to: "<meta property=\"article:modified_time\" content=\"2026-08-28\">"
      },
      {
        label: "travel translator guide publication date",
        from: ["<p class=\"article-meta\"><time datetime=\"2026-07-14\">2026年7月14日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\"><time datetime=\"2026-08-28\">2026年8月28日更新</time> · 作者 <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      }
    ]
  },
  {
    file: "voice-camera-translator-guide.html",
    title: "Voice &amp; Camera Translator for Travel: 6 Steps (2026)",
    description: "Translate travel conversations, menus, and signs on iPhone in 6 steps. Use voice, camera OCR, live interpretation, and offline core language pairs.",
    modifiedDate: "2026-08-15",
    modifiedDateLabel: "August 15, 2026",
    article: {
      headline: "Voice & Camera Translator for Travel: 6 Steps (2026)",
      description: "Translate travel conversations, menus, and signs on iPhone in 6 steps. Use voice, camera OCR, live interpretation, and offline core language pairs."
    },
    headline: [
      "Voice and Camera Translator Guide for Travel",
      "Voice and Camera Translator for Travel",
      "Voice and Camera Translator for Travel: 6 Steps (2026)",
      "Voice & Camera Translator for Travel: 6 Steps (2026)"
    ]
  },
  {
    file: "mac-screen-privacy.html",
    title: "Mac Privacy Screen App | Free vs $2.99 (2026)",
    description: "Mac privacy screen app for hiding selected windows, covering sensitive areas, and safer presentations. Compare free Lite with the $2.99 full Mac app.",
    keywords: "mac privacy screen app, Mac privacy app, screen privacy app for Mac, privacy screen app MacBook, hide sensitive windows Mac, anti spy screen, presentation privacy app",
    modifiedDate: "2026-08-16",
    modifiedDateLabel: "August 16, 2026",
    article: {
      description: "Mac privacy screen app for hiding selected windows, covering sensitive areas, and safer presentations. Compare free Lite with the $2.99 full Mac app.",
      keywords: [
        "mac privacy screen app",
        "Mac privacy app",
        "screen privacy app for Mac",
        "privacy screen app MacBook",
        "hide sensitive windows Mac",
        "anti spy screen",
        "presentation privacy app"
      ]
    },
    autoArticleWordCount: true,
    headline: [
      "Mac Screen Privacy App",
      "Best Mac Screen Privacy App? Free vs Full (2026)",
      "Mac Privacy Screen App: Free vs $2.99 (2026)"
    ],
    h1: [
      "Hide sensitive Mac windows in shared spaces.",
      "Choose the right Mac screen privacy app.",
      "Mac privacy screen app. Hide sensitive windows."
    ]
  },
  {
    file: "screen-sharing-privacy-guide.html",
    title: "How to Hide Notifications When Screen Sharing on Mac (2026)",
    description: "Hide notifications when screen sharing on Mac in 6 steps. Use Focus, share one window, protect private apps, enable Presenting Mode, and test first.",
    keywords: "how to hide notifications when screen sharing on Mac, Mac hide notifications when sharing screen, Mac screen sharing privacy, share screen privacy settings Mac, hide private windows Mac",
    modifiedDate: "2026-08-16",
    modifiedDateLabel: "August 16, 2026",
    article: {
      description: "Hide notifications when screen sharing on Mac in 6 steps. Use Focus, share one window, protect private apps, enable Presenting Mode, and test first.",
      keywords: [
        "how to hide notifications when screen sharing on Mac",
        "Mac hide notifications when sharing screen",
        "Mac screen sharing privacy",
        "share screen privacy settings Mac",
        "hide private windows Mac"
      ]
    },
    autoArticleWordCount: true,
    howTo: {
      "@id": "https://www.xiaozhonglvyou.com/screen-sharing-privacy-guide.html#howto",
      name: "How to hide notifications when screen sharing on Mac",
      description: "A six-step checklist using Focus, notification settings, a narrow shared source, protected apps, Presenting Mode, and a test share."
    },
    headline: [
      "Mac Screen Sharing Privacy Guide",
      "How to Protect Mac Privacy During Screen Sharing",
      "Mac Screen Sharing Privacy Checklist: 6 Steps (2026)",
      "How to Hide Notifications When Screen Sharing on Mac (2026)"
    ],
    h1: [
      "Protect sensitive Mac windows before a meeting or nearby glance exposes them.",
      "Protect Mac privacy before screen sharing.",
      "Protect Mac screen sharing privacy in 6 steps.",
      "Hide notifications and private windows before screen sharing.",
      "Hide notifications when screen sharing on Mac in 6 steps."
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

function removeJsonLdNodesById(html, ids = []) {
  if (ids.length === 0) return html;

  const remainingIds = new Set(ids);
  const updatedHtml = html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, content, close) => {
      const parsed = JSON.parse(content);
      let changed = false;

      const filterValue = (value) => {
        if (Array.isArray(value)) {
          const filtered = value
            .filter((item) => {
              if (!item || typeof item !== "object" || !remainingIds.has(item["@id"])) return true;
              remainingIds.delete(item["@id"]);
              changed = true;
              return false;
            })
            .map(filterValue);
          return filtered;
        }

        if (!value || typeof value !== "object") return value;

        for (const [key, child] of Object.entries(value)) {
          value[key] = filterValue(child);
        }

        return value;
      };

      const filtered = filterValue(parsed);
      if (!changed) return full;

      const indent = content.match(/^\s*\n([ \t]+)/)?.[1] ?? "      ";
      const formatted = JSON.stringify(filtered, null, 2)
        .split("\n")
        .map((line) => `${indent}${line}`)
        .join("\n");

      return `${open}\n${formatted}\n    ${close}`;
    }
  );

  if (remainingIds.size > 0) {
    const unresolved = [...remainingIds].filter((id) => html.includes(`"@id": "${id}"`));
    if (unresolved.length > 0) throw new Error(`Failed to remove JSON-LD nodes: ${unresolved.join(", ")}`);
  }

  return updatedHtml;
}

function updateJsonLd(html, page) {
  const articleValues = page.article || page.headline
    ? {
        ...(page.article || {}),
        ...(page.headline ? { headline: page.headline.at(-1) } : {})
      }
    : null;
  const updates = [
    articleValues && { type: "Article", values: articleValues, label: "Article" },
    page.webPage && { type: "WebPage", id: page.webPage["@id"], values: page.webPage, label: "WebPage" },
    page.softwareApplication && {
      type: "SoftwareApplication",
      id: page.softwareApplication["@id"],
      values: page.softwareApplication,
      label: "SoftwareApplication"
    },
    page.howTo && { type: "HowTo", id: page.howTo["@id"], values: page.howTo, label: "HowTo" },
    ...(page.structuredData || []).map((update) => ({
      type: update.type,
      id: update.id,
      values: update.values,
      label: update.label || update.type
    }))
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

function updateQuestions(html, page) {
  if (!page.questions?.length) return html;

  const remaining = new Set(page.questions);
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
        if (types.includes("Question")) {
          for (const question of page.questions) {
            if (!question.names.includes(value.name)) continue;
            const nextName = question.names.at(-1);
            if (value.name !== nextName) {
              value.name = nextName;
              changed = true;
            }
            if (value.acceptedAnswer?.text !== question.answer) {
              value.acceptedAnswer = { "@type": "Answer", text: question.answer };
              changed = true;
            }
            remaining.delete(question);
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

  if (remaining.size > 0) {
    throw new Error(`Missing ${page.file} FAQ questions: ${[...remaining].map((question) => question.names.at(-1)).join(", ")}`);
  }

  return updatedHtml;
}

async function updatePage(siteDir, page) {
  const filePath = path.join(siteDir, page.file);
  let html = await readFile(filePath, "utf8");
  const original = html;

  html = removeJsonLdNodesById(html, page.removeJsonLdIds);

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

  for (const replacement of page.replacements || []) {
    html = replaceFromCandidates(
      html,
      [...replacement.from, replacement.to],
      (value) => value,
      `${page.file} ${replacement.label}`
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
  html = updateQuestions(html, pageWithResolvedArticle);

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
