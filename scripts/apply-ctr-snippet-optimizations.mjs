#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { photoCleanerComparisonUpdate } from "./photo-cleaner-comparison-content.mjs";

const legacyShortcutsGifSection = [
  '<section class="section content-section alt-section" id="make-gif-with-shortcuts"><div class="section-inner content-grid"><div>',
  '<p class="section-kicker">Built-in GIF file</p><h2>Make a GIF from photos with Shortcuts.</h2>',
  "<p>Open Shortcuts and build a workflow with Select Photos, Make GIF, then Save File. Choose several still photos, run the shortcut, and save the result to Files. Open the saved file to check its animation and .gif extension.</p>",
  '<p>Apple documents the <a href="https://support.apple.com/guide/shortcuts/intro-to-shortcuts-apdf22b0444c/ios" target="_blank" rel="noopener noreferrer">Make GIF action</a> and <a href="https://support.apple.com/guide/shortcuts/apdaf74d75a5/ios" target="_blank" rel="noopener noreferrer">Save File action</a> in Shortcuts.</p>',
  '</div><div class="content-list"><div><strong>1. Select photos</strong><p>Add Select Photos and enable multiple selection. Choose the still images when you run the shortcut.</p></div>',
  '<div><strong>2. Make GIF</strong><p>Add Make GIF after Select Photos and preview the animated result.</p></div>',
  '<div><strong>3. Save the file</strong><p>Add Save File after Make GIF, choose a location in Files, and confirm the saved file is a .gif.</p></div></div></div></section>'
].join("");
const shortcutsGifSection = [
  '<section class="section content-section alt-section" id="make-gif-with-shortcuts"><div class="section-inner content-grid"><div>',
  '<p class="section-kicker">Built-in GIF file</p><h2>Make a GIF from photos with Shortcuts.</h2>',
  '<p>No separate GIF editor is needed for this still-photo workflow. Create a shortcut with Select Photos, Make GIF, Quick Look, then Save File. Quick Look checks the generated animation before you save it; it is not an export action.</p>',
  '<p>Apple explains <a href="https://support.apple.com/en-euro/guide/shortcuts/apd84c576f8c/ios" target="_blank" rel="noopener noreferrer">creating a shortcut</a>, the <a href="https://support.apple.com/guide/shortcuts/intro-to-shortcuts-apdf22b0444c/ios" target="_blank" rel="noopener noreferrer">Make GIF action</a>, <a href="https://support.apple.com/en-euro/guide/shortcuts/apda75604f37/ios" target="_blank" rel="noopener noreferrer">testing with Quick Look</a>, and <a href="https://support.apple.com/guide/shortcuts/apdaf74d75a5/ios" target="_blank" rel="noopener noreferrer">saving files</a>. Action labels and expanded settings can differ by iOS version and language.</p>',
  '</div><div class="content-list"><div><strong>1. Select several photos</strong><p>In Shortcuts, tap the add button to create a shortcut. Add Select Photos and enable Select Multiple. When you run it, choose at least two different still images so there is a visible change between frames.</p></div>',
  '<div><strong>2. Build the animation</strong><p>Add Make GIF after Select Photos. Confirm its input is the selected Photos, not an unrelated file or text.</p></div>',
  '<div><strong>3. Preview with Quick Look</strong><p>Add Quick Look after Make GIF and pass it the GIF result. Run the shortcut, choose the photos, and watch the preview. Close the preview to continue; a thumbnail alone does not prove the animation plays.</p></div>',
  '<div><strong>4. Save the GIF result</strong><p>Add Save File and make sure its input is the GIF produced by Make GIF. Choose a location in Files when prompted, then open the saved .gif to check that it still animates. Renaming a JPG to .gif does not create an animated file.</p></div></div></div></section>'
].join("");
const gifSharingChecks = [
  '<section class="section content-section alt-section" id="gif-sharing-checks"><div class="section-inner content-grid"><div>',
  '<p class="section-kicker">Before sharing</p><h2>What if the animation becomes a still image?</h2>',
  '<p>Check the saved file separately from its thumbnail and the receiving app. A preview that shows only the first frame is not enough to identify where the animation was lost.</p>',
  '</div><div class="content-list"><div><strong>Only one image changes nothing</strong><p>Check Select Multiple and use distinct photos. Inspect the Make GIF result in Quick Look before changing later save or share actions.</p></div>',
  '<div><strong>The saved file is JPG or PNG</strong><p>Recheck the Save File input. Save the generated GIF, not one of the source photos or a screenshot of the preview. Keep the originals until you have checked the export.</p></div>',
  '<div><strong>It plays locally but not after sharing</strong><p>Try sending the saved GIF as a file and check it on the receiving device. Some destinations show a static thumbnail or convert media; use their supported format. Apple specifically notes that a <a href="https://support.apple.com/en-au/104966" target="_blank" rel="noopener noreferrer">Live Photo sent through Mail becomes a still image</a>; a Live Photo is not the same as an exported GIF.</p></div>',
  '</div></div></section>'
].join("");

const photoStorageSteps = [
  {
    name: "Check what uses space",
    text: "Open Settings, General, then iPhone Storage. Note the free space and the Photos usage before changing anything. Check Settings, your name, iCloud, then Photos to see whether iCloud Photos is syncing."
  },
  {
    name: "Merge built-in duplicates",
    text: "In Photos, open Collections, Utilities, then Duplicates. Review each set before tapping Merge. If Duplicates is missing, the library may still be indexing or no duplicates were found."
  },
  {
    name: "Review videos and screenshots",
    text: "In Photos, open Collections, then Media Types to inspect videos. Use the Screenshots collection or the library filter to review screenshots. Select only items you no longer need."
  },
  {
    name: "Back up and delete selectively",
    text: "Make an independent copy of irreplaceable originals before deleting. Select reviewed photos or videos in Photos and tap Delete. If iCloud Photos is on, deletion also affects your other synced devices."
  },
  {
    name: "Check Recently Deleted and storage again",
    text: "In Photos, open Collections, Utilities, then Recently Deleted to recover mistakes. Permanently delete only items you are sure about; otherwise Apple keeps them there for 30 days. Recheck Settings, General, then iPhone Storage."
  }
];

const screenSharingFocusAnswer = "Focus can still allow selected people, apps, and time-sensitive notifications. Teams calls, requests to join, and meeting-start notifications are not controlled by macOS Focus. Review the meeting app's own notification settings and test from a receiving device.";
const screenSharingBuiltinAnswer = "No extra app is needed to change macOS notification settings or to choose a window or tab in the meeting app. Anti-spy screen Lite is an optional tool for protected apps and presentation controls; test its effect in the receiving view before relying on it.";
const screenSharingSteps = [
  ["Silence notifications and check recording permission", "In System Settings, open Notifications and set Show Notifications: when mirroring or sharing the display to Notifications Off. Turn on Focus, then confirm which meeting apps may record the screen and system audio."],
  ["Choose the narrowest shared source", "Share one application window or browser tab when the meeting app allows it, instead of an entire display with unrelated private windows. Check the audio-sharing option too."],
  ["Close private windows and choose protected apps", "Close unrelated chat, email, finance, client, and internal-tool windows. If using Anti-spy screen Lite, select the sensitive apps to protect."],
  ["Test optional presentation controls", "If using Presenting Mode or a Privacy Color Block, enable it before the test call. Do not assume that an overlay visible on your Mac will appear in the meeting's captured output."],
  ["Run a private test share", "Join a private test call from a second device with its microphone and speakers muted. Inspect the receiving view, trigger a harmless notification, and confirm the intended window, any protected content, and shared audio. Stop if private content appears."],
  ["Stop sharing and restore the workspace", "End screen sharing before reopening private apps, then confirm the meeting app is no longer recording and restore hidden windows deliberately."]
];
const screenSharingRiskSection = '<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">Risk checklist</p>';
const screenSharingMeetingSections = [
  '<section class="section content-section" id="meeting-apps"><div class="section-inner content-grid"><div><p class="section-kicker">Choose the shared source</p><h2>Share a window or tab in Zoom, Meet, or Teams.</h2><p>Start with the smallest source that contains your presentation. A narrow source reduces unrelated desktop exposure, but anything sensitive inside that source can still be visible. Leave system audio sharing off unless the meeting needs it.</p></div><div class="content-list">',
  '<div><strong>Zoom on Mac</strong><p>In Share, open Screens and select the intended application window rather than the entire display. Check Share sound separately. Zoom also offers a cropped Portion of screen; keep private content outside that boundary. See <a href="https://support.zoom.com/hc/en/article?id=zm_kb&amp;sysparm_article=KB0060596" target="_blank" rel="noopener noreferrer">Zoom sharing options</a>.</p></div>',
  '<div><strong>Google Meet in Chrome</strong><p>Choose Present now, then A tab for a web presentation or A window for one app. Check the tab-audio or system-audio option before confirming. Do not present the meeting window itself. See <a href="https://support.google.com/meet/answer/9308856?hl=en" target="_blank" rel="noopener noreferrer">Meet presentation settings</a>.</p></div>',
  '<div><strong>Microsoft Teams on Mac</strong><p>Select Share and choose the presentation window. Teams needs macOS screen-recording permission; for Teams in a browser, permission belongs to that browser. The optional native macOS sharing experience does not support giving or taking control. See <a href="https://support.microsoft.com/en-us/teams/meetings/present-content-in-microsoft-teams-meetings" target="_blank" rel="noopener noreferrer">Teams Mac sharing instructions</a>.</p></div>',
  '<div><strong>If alerts still appear</strong><p>Check allowed people, apps, and time-sensitive notifications in <a href="https://support.apple.com/en-lb/guide/mac-help/mchl613dc43f/mac" target="_blank" rel="noopener noreferrer">Focus settings</a>. Teams calls, requests to join, and meeting-start alerts do not depend on macOS Focus; review <a href="https://support.microsoft.com/en-us/teams/notifications-settings/manage-notifications-in-microsoft-teams" target="_blank" rel="noopener noreferrer">Teams notification settings</a> too.</p></div>',
  '</div></div></section>',
  '<section class="section content-section alt-section" id="receiver-test"><div class="section-inner content-grid"><div><p class="section-kicker">Receiving-side check</p><h2>Check what another participant actually sees.</h2><p>A local screen preview is not proof that private content is absent from the transmitted view. Capture modes can differ: <a href="https://support.zoom.com/hc/en/article?id=zm_kb&amp;sysparm_article=KB0063824" target="_blank" rel="noopener noreferrer">Zoom documents window-filtering and capture options</a>. Do not assume that a color block visible on your own display also covers a separately captured window.</p></div><div class="content-list">',
  '<div><strong>Use harmless sample content</strong><p>Join a private test call from a second device, mute its microphone and speakers, and inspect the receiving view. Keep real client records, passwords, and personal messages closed during the test.</p></div>',
  '<div><strong>Exercise the exact workflow</strong><p>Share the intended source, switch slides, open a harmless alert, and test any optional protected-app or color-block behavior. Repeat for an external display or a different sharing mode; a successful window-share test does not prove an entire-display share is safe.</p></div>',
  '<div><strong>Stop on unexpected exposure</strong><p>If any private area appears, stop sharing and remove that content from the source. Re-test before inviting others. Choosing a narrower window or preparing a separate presentation document is preferable to relying on an unverified mask.</p></div>',
  '<div><strong>macOS settings do not require another app</strong><p>Use the built-in notification control and the meeting app first. On older macOS versions, the notification control may be an Allow notifications when mirroring or sharing the display switch; turn it off. Anti-spy screen Lite is optional, not a requirement for these settings.</p></div>',
  '</div></div></section>'
].join("");

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
    title: "Free iPhone Photo Cleaner App: One Free Cleanup (2026)",
    description: "AI Cleaning is free to download. Its one free cleanup action can include multiple selected items; more cleanup actions and nine AI categories require Pro.",
    keywords: "free photo cleaner app for iPhone, free iPhone photo cleaner app, photo cleaner free limit, iPhone photo cleaner free vs paid, Live Photo cleanup iPhone, burst photo cleanup",
    modifiedDate: "2026-10-03",
    modifiedDateLabel: "October 3, 2026",
    article: {
      headline: "Free iPhone Photo Cleaner App: One Free Cleanup (2026)",
      description: "AI Cleaning is free to download. Its one free cleanup action can include multiple selected items; more cleanup actions and nine AI categories require Pro.",
      dateModified: "2026-10-03"
    },
    autoArticleWordCount: true,
    headline: [
      "How to Choose an iPhone Photo Cleaner (2026 Guide)",
      "Best iPhone Photo Cleaner App? 9 AI Categories (2026)",
      "iPhone Photo Cleaner: Free Download and Optional AI (2026)",
      "Free Photo Cleaner App for iPhone: Free vs Pro (2026)",
      "Free Photo Cleaner App for iPhone | Free vs Pro (2026)",
      "Free iPhone Photo Cleaner App: One Free Cleanup (2026)"
    ],
    h1: [
      "Free photo cleaner app for iPhone. Review first.",
      "Free iPhone photo cleaner app: know the limit first."
    ],
    questions: [
      {
        names: ["Is there a free photo cleaner app for iPhone?", "What does the free version of AI Cleaning include?"],
        answer: "AI Cleaning is free to download. Free users get one successful in-app cleanup action across eligible tools, not one per screen; the action may include multiple selected items. Further gated cleanup actions and the nine Auto-Categorize AI categories require Pro. Review selections before confirming, and check your local App Store for current prices."
      },
      {
        names: ["Does AI Cleaning upload my library for AI classification?"],
        answer: "The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label reports Data Not Collected; Apple says this developer-provided disclosure has not been verified by Apple. See the private AI cleaner evidence guide."
      },
      {
        names: ["Does AI Cleaning collect or upload photo data?"],
        answer: "The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label reports Data Not Collected; Apple says this developer-provided disclosure has not been verified by Apple."
      }
    ],
    replacements: [
      {
        label: "free cleaner hero summary",
        from: ["<p class=\"hero-summary\">AI Cleaning is free to download for iPhone. Review duplicate and similar photos before deleting; optional Pro adds 9 on-device AI categories.</p>"],
        to: "<p class=\"hero-summary\">Free to download, with one successful in-app cleanup action. More gated cleanup actions and 9 AI photo categories require Pro.</p>"
      },
      {
        label: "free cleaner product facts intro",
        from: ["<p>These product facts come from the current US App Store listing, including its pricing and privacy disclosures.</p>"],
        to: "<p>AI Cleaning is free to install. The app's free cleanup allowance is limited; Pro unlocks additional gated actions and nine AI categories. Subscription prices vary by App Store storefront.</p>"
      },
      {
        label: "free cleaner cost row",
        from: ["<div role=\"row\"><span role=\"cell\">Cost</span> <span role=\"cell\">Free download; optional monthly and yearly subscriptions</span> <span role=\"cell\">You can install before deciding whether Pro classification fits your library.</span></div>"],
        to: "<div role=\"row\"><span role=\"cell\">Free allowance</span> <span role=\"cell\">One successful in-app cleanup action; more gated actions require Pro</span> <span role=\"cell\">One action can cover multiple selected items; it is not one free photo per tap.</span></div>"
      },
      {
        label: "free cleaner standout row",
        from: ["<div role=\"row\"><span role=\"cell\">Standout feature</span> <span role=\"cell\">9 Pro AI categories plus review-first cleanup groups</span> <span role=\"cell\">Documents and memories can be separated from likely cleanup candidates.</span></div>"],
        to: "<div role=\"row\"><span role=\"cell\">New cleanup tools</span> <span role=\"cell\">Private Vault, Live Photo Slimming, and Burst Cleanup</span> <span role=\"cell\">Keep private items separate, remove a Live Photo's motion clip, or review burst shots.</span></div>"
      },
      {
        label: "free cleaner privacy row",
        from: ["<div role=\"row\"><span role=\"cell\">Privacy</span> <span role=\"cell\">On-device AI; App Store label says Data Not Collected</span> <span role=\"cell\">Photo analysis is described as local, with no account or upload required for core features.</span></div>"],
        to: "<div role=\"row\"><span role=\"cell\">Privacy</span> <span role=\"cell\">On-device AI; developer-reported App Store label says Data Not Collected</span> <span role=\"cell\">Apple states that this privacy disclosure is developer-provided and has not been verified by Apple.</span></div>"
      },
      {
        label: "free cleaner intent answer",
        from: ["<div role=\"row\"><span role=\"cell\">\"free photo cleaner app\"</span> <span role=\"cell\">This decision guide</span> <span role=\"cell\">Choose an app that classifies first, then helps review cleanup groups.</span></div>"],
        to: "<div role=\"row\"><span role=\"cell\">\"free photo cleaner app\"</span> <span role=\"cell\">This decision guide</span> <span role=\"cell\">Compare the free cleanup allowance with Pro limits before installing.</span></div>"
      },
      {
        label: "free cleaner FAQ allowance",
        from: ["<details open><summary>Is there a free photo cleaner app for iPhone?</summary><p>Yes. AI Cleaning is free to download from the App Store for iPhone. It includes optional monthly and yearly subscriptions for Pro features, so free download does not mean every feature is free.</p></details>"],
        to: "<details open><summary>What does the free version of AI Cleaning include?</summary><p>AI Cleaning is free to download. Free users get one successful in-app cleanup action across eligible tools, not one per screen; the action may include multiple selected items. Further gated cleanup actions and the nine Auto-Categorize AI categories require Pro. Review selections before confirming, and check your local App Store for current prices.</p></details>"
      },
      {
        label: "free cleaner privacy FAQ evidence",
        from: [
          "<p>The current App Store listing says AI computation runs on the iPhone, nothing is uploaded, and the privacy label is Data Not Collected. See the <a href=\"private-ai-photo-cleaner.html\">private AI cleaner evidence guide.</a></p>",
          "<p>The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label says Data Not Collected, but Apple notes that this developer-provided disclosure has not been verified by Apple. See the <a href=\"private-ai-photo-cleaner.html\">private AI cleaner evidence guide.</a></p>"
        ],
        to: "<p>The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label reports Data Not Collected; Apple says this developer-provided disclosure has not been verified by Apple. See the <a href=\"private-ai-photo-cleaner.html\">private AI cleaner evidence guide.</a></p>"
      },
      {
        label: "free cleaner privacy FAQ duplicate",
        from: [
          "<p>The App Store listing says every AI computation runs on the iPhone, nothing is uploaded, and the app privacy label is Data Not Collected.</p>",
          "<p>The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label says Data Not Collected; Apple notes this developer-provided disclosure has not been verified by Apple.</p>"
        ],
        to: "<p>The developer says photo analysis runs on the iPhone and nothing is uploaded. Apple's App Store privacy label reports Data Not Collected; Apple says this developer-provided disclosure has not been verified by Apple.</p>"
      }
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
    description: "Clean up iPhone photo storage for free: check storage, merge duplicates, review videos and screenshots, and avoid iCloud deletion mistakes.",
    modifiedDate: "2026-09-25",
    modifiedDateLabel: "September 25, 2026",
    article: {
      headline: "How to Clean Up iPhone Photo Storage for Free | 2026 Guide",
      description: "Clean up iPhone photo storage for free: check storage, merge duplicates, review videos and screenshots, and avoid iCloud deletion mistakes.",
      dateModified: "2026-09-25"
    },
    autoArticleWordCount: true,
    howTo: {
      name: "How to clean up iPhone photo storage for free",
      description: "Check photo storage, merge duplicates, review videos and screenshots, then delete selectively with iCloud and Recently Deleted in mind.",
      step: photoStorageSteps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text
      }))
    },
    headline: [
      "How to Clean Up iPhone Photo Storage for Free",
      "How to Clean Up iPhone Photo Storage for Free | 2026 Guide"
    ],
    h1: [
      "Free up iPhone photo storage. Review first.",
      "How to clean up iPhone photo storage for free."
    ],
    questions: [
      {
        names: ["What fills iPhone storage fastest in the photo library?", "What is the fastest free way to clean up iPhone photos?"],
        answer: "Start in Settings, General, iPhone Storage. Then use Photos' built-in Duplicates tool and review videos and screenshots before deleting anything."
      },
      {
        names: ["Can an app safely clean iPhone system storage?", "Can a photo cleaner app clear iOS System Data?"],
        answer: "No photo cleaner app can directly clear protected iOS System Data. Use iPhone Storage recommendations and focus on photos and videos you can review."
      },
      {
        names: ["Why use AI classification before storage cleanup?", "Does deleting iPhone photos also delete them from iCloud?"],
        answer: "Yes, when iCloud Photos is on, deleting a photo also removes it from other synced devices. You can usually recover it from Recently Deleted for 30 days."
      }
    ],
    replacements: [
      {
        label: "storage guide hero summary",
        from: ["<p class=\"hero-summary\">Review the photos that usually take the most space: large media, screenshots, duplicates, and blurry shots.</p>"],
        to: "<p class=\"hero-summary\">Start with iPhone's free storage and duplicate tools. Review videos and screenshots before deleting, and check what iCloud Photos will sync.</p>"
      },
      {
        label: "storage guide primary action",
        from: ["<a class=\"button button-primary\" href=\"https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4\" target=\"_blank\" rel=\"noopener noreferrer\" data-analytics-event=\"app_store_click\" data-store-product=\"ai-cleaning-photo-cleaner\" data-storefront=\"ios-app-store\" aria-label=\"Get AI Cleaning - Photo Cleaner free on the App Store (opens in a new tab)\">Get AI Cleaning free</a>"],
        to: "<a class=\"button button-primary\" href=\"#free-steps\">Start free cleanup</a><a class=\"button button-secondary\" href=\"https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4\" target=\"_blank\" rel=\"noopener noreferrer\" data-analytics-event=\"app_store_click\" data-store-product=\"ai-cleaning-photo-cleaner\" data-storefront=\"ios-app-store\" aria-label=\"AI Cleaning - Photo Cleaner on the App Store (opens in a new tab)\">Explore AI Cleaning</a>"
      },
      {
        label: "storage guide workflow anchor",
        from: ["<section class=\"section content-section\">"],
        to: "<section class=\"section content-section\" id=\"free-steps\">"
      },
      {
        label: "storage guide workflow introduction",
        from: ["<p class=\"section-kicker\">Storage pressure</p><h2>Start with content you can actually review.</h2><p>iOS apps should not promise impossible system junk cleanup. A more honest iPhone storage workflow focuses on user-visible items: photos, videos, screenshots, duplicates, blurry shots, low-quality media, and contacts that the user can inspect before changing.</p>"],
        to: "<p class=\"section-kicker\">Free iPhone tools</p><h2>Clean up your photo library in five steps.</h2><p>You do not need to install an app to check iPhone storage or merge exact duplicates. First compare the Photos category with available device space; then work through the library in small, reviewable groups. Storage saved will depend on what you actually remove.</p><p>Apple documents <a href=\"https://support.apple.com/en-au/108429\" target=\"_blank\" rel=\"noopener noreferrer\">iPhone Storage</a>, <a href=\"https://support.apple.com/en-gb/guide/iphone/iph1978d9c23/27/ios/27\" target=\"_blank\" rel=\"noopener noreferrer\">merging duplicates</a>, and <a href=\"https://support.apple.com/en-mide/guide/iphone/iph8530ff6a2/ios\" target=\"_blank\" rel=\"noopener noreferrer\">Media Types</a>.</p>"
      },
      {
        label: "storage guide first step",
        from: ["<div><strong>Large media</strong><p>Videos and high-resolution media can take meaningful space and should be reviewed with real size context.</p></div>"],
        to: `<div><strong>1. ${photoStorageSteps[0].name}</strong><p>${photoStorageSteps[0].text}</p></div>`
      },
      {
        label: "storage guide second step",
        from: ["<div><strong>Screenshots</strong><p>Repeated screenshots accumulate quickly and are often easier to delete after grouping.</p></div>"],
        to: `<div><strong>2. ${photoStorageSteps[1].name}</strong><p>${photoStorageSteps[1].text}</p></div>`
      },
      {
        label: "storage guide remaining steps",
        from: ["<div><strong>Duplicate and similar photos</strong><p>Find likely cleanup candidates, then keep the best copy instead of bulk deleting blindly.</p></div>"],
        to: photoStorageSteps.slice(2).map((step, index) => `<div><strong>${index + 3}. ${step.name}</strong><p>${step.text}</p></div>`).join("")
      },
      {
        label: "storage guide options introduction",
        from: ["<p class=\"section-kicker\">AI review path</p><h2>Classification makes cleanup safer.</h2><p>AI Cleaning separates everyday categories and document categories from cleanup categories. That gives users a better path than starting with a delete button.</p>"],
        to: "<p class=\"section-kicker\">Keep or delete</p><h2>Choose what happens to your originals.</h2><p>Deleting is not the only way to reduce on-device storage. If you use iCloud Photos and have enough iCloud space, Optimize iPhone Storage can keep full-resolution originals in iCloud and smaller versions on your iPhone. It does not erase photos from your library.</p>"
      },
      {
        label: "storage guide iCloud option",
        from: ["<div><strong>Understand the library</strong><p>Review animals, plants, food, restaurants, group photos, documents, receipts, invoices, and ID cards.</p></div>"],
        to: "<div><strong>Keep every photo, use less device space</strong><p>Check Settings, your name, iCloud, then Photos for Optimize Storage. This uses iCloud storage, which is separate from iPhone storage and may require a paid plan for a large library. See <a href=\"https://support.apple.com/en-gb/108782\" target=\"_blank\" rel=\"noopener noreferrer\">Apple's iCloud Photos guide</a>.</p></div>"
      },
      {
        label: "storage guide optional app",
        from: ["<div><strong>Review cleanup candidates</strong><p>Move through duplicates, screenshots, blurry shots, low-quality photos, and large media.</p></div>"],
        to: "<div><strong>Need help with similar photos?</strong><p>After using Apple's Duplicates tool, <a href=\"iphone-photo-cleaner.html\">AI Cleaning</a> can group visually similar photos, screenshots, and large media for manual review. It is free to download; check the current App Store listing for any optional Pro features before relying on them.</p></div>"
      },
      {
        label: "storage guide deletion warning",
        from: ["<div><strong>Confirm before deleting</strong><p>Storage cleanup is more useful when users understand what they are removing and why.</p></div>"],
        to: "<div><strong>Know the deletion boundary</strong><p>With iCloud Photos on, deletion syncs across devices. Recently Deleted normally holds items for 30 days; permanent deletion cannot be undone. Check <a href=\"https://support.apple.com/en-euro/guide/iphone/iphb4defbde9/27/ios/27\" target=\"_blank\" rel=\"noopener noreferrer\">Apple's delete and recovery instructions</a> before clearing it.</p></div>"
      },
      {
        label: "storage guide FAQ one",
        from: ["<details open><summary>What fills iPhone storage fastest in the photo library?</summary><p>Large videos, repeated screenshots, duplicate photos, visually similar shots, blurry photos, and old media can all contribute to storage pressure.</p></details>"],
        to: "<details open><summary>What is the fastest free way to clean up iPhone photos?</summary><p>Start in Settings, General, iPhone Storage. Then use Photos' built-in Duplicates tool and review videos and screenshots before deleting anything.</p></details>"
      },
      {
        label: "storage guide FAQ two",
        from: ["<details><summary>Can an app safely clean iPhone system storage?</summary><p>Apps should not make fake iOS system-cleaning promises. A safer approach is to focus on reviewable content such as photos, screenshots, duplicates, large media, and contacts.</p></details>"],
        to: "<details><summary>Can a photo cleaner app clear iOS System Data?</summary><p>No photo cleaner app can directly clear protected iOS System Data. Use iPhone Storage recommendations and focus on photos and videos you can review.</p></details>"
      },
      {
        label: "storage guide FAQ three",
        from: ["<details><summary>Why use AI classification before storage cleanup?</summary><p>AI classification helps users understand what is in the library before deletion, which is especially useful for documents, receipts, ID cards, and personal memories.</p></details>"],
        to: "<details><summary>Does deleting iPhone photos also delete them from iCloud?</summary><p>Yes, when iCloud Photos is on, deleting a photo also removes it from other synced devices. You can usually recover it from Recently Deleted for 30 days.</p></details>"
      }
    ]
  },
  {
    file: "iphone-photo-cleaner-comparison.html",
    title: "Best Photo Cleaner App for iPhone: 3 Compared (2026)",
    ...photoCleanerComparisonUpdate,
    headline: [
      "Best iPhone Photo Cleaner Apps: 2026 Comparison",
      "Best iPhone Photo Cleaner Apps: 3 Compared (2026)",
      "Best Photo Cleaner App for iPhone: 3 Compared (2026)"
    ],
    h1: [
      "Compare the best iPhone photo cleaner apps for 2026.",
      "AI Cleaning vs Cleanup vs Cleaner Kit.",
      "Compare 3 iPhone photo cleaner apps.",
      "Compare AI Cleaning, Cleanup, and Cleaner Kit.",
      "3 iPhone photo cleaner apps compared.",
      "The best photo cleaner app for iPhone depends on your cleanup job."
    ],
    replacements: [
      {
        label: "route free-use intent to decision guide",
        from: [
          "The better fit depends on whether you value a focused photo workflow or an all-in-one storage utility.</p></div>"
        ],
        to: "The better fit depends on whether you value a focused photo workflow or an all-in-one storage utility.</p><p>Looking for a free-use allowance before choosing? Read our <a href=\"best-iphone-photo-cleaner-app.html\">free iPhone photo cleaner guide</a>; this page compares three apps side by side.</p></div>"
      },
      ...photoCleanerComparisonUpdate.replacements
    ]
  },
  {
    file: "iphone-photo-cleaner.html",
    title: "Photo Cleaner for iPhone | Find Duplicates &amp; Free Space",
    description: "Photo cleaner for iPhone that finds duplicate and similar photos, screenshots, blurry shots, and large files. Review first, then free up space safely.",
    modifiedDate: "2026-09-29",
    modifiedDateLabel: "September 29, 2026",
    article: {
      headline: "Photo Cleaner for iPhone | Find Duplicates & Free Space",
      description: "Photo cleaner for iPhone that finds duplicate and similar photos, screenshots, blurry shots, and large files. Review first, then free up space safely.",
      dateModified: "2026-09-29"
    },
    autoArticleWordCount: true,
    headline: [
      "iPhone Photo Cleaner with AI Classification",
      "AI Photo Cleaner for iPhone",
      "Photo Cleaner for iPhone: Find Duplicates and Free Space",
      "Photo Cleaner for iPhone | Find Duplicates & Free Space"
    ],
    questions: [
      {
        names: ["Does AI Cleaning delete photos automatically?"],
        answer: "No. AI Cleaning asks you to review and confirm before a cleanup action. Free users get one successful in-app cleanup action across eligible tools; additional gated actions require Pro. Daily Cleanup offers 30 review cards per day, but reviewing cards does not itself delete them."
      }
    ],
    replacements: [
      {
        label: "photo cleaner current facts date",
        from: ["These details reflect version 1.1.6 and were checked on September 23, 2026 against the"],
        to: "The feature details reflect app version 1.1.6 and were rechecked on September 29, 2026; App Store version notes can vary by storefront. See the"
      },
      {
        label: "photo cleaner review and free limit",
        from: ["<div><strong>Review before deletion</strong><p>Exact and similar photos, screenshots, blurry media, and large files remain review candidates. Daily Cleanup presents 30 swipe-style cards rather than deleting automatically.</p></div>"],
        to: "<div><strong>Review and free allowance</strong><p>Review photos before confirming. Free users get one successful in-app cleanup action across eligible tools; additional gated actions require Pro. Daily Cleanup's 30 daily review cards do not delete photos by themselves.</p></div>"
      },
      {
        label: "photo cleaner version and new tools",
        from: ["<div><strong>Version and compatibility</strong><p>The current release is version 1.1.6 and requires iOS 16.0 or later.</p></div>"],
        to: "<div><strong>Version 1.1.6 tools</strong><p>Private Vault keeps selected photos in an app-private, Face ID-locked store; Live Photo Slimming keeps the still image without its motion clip; Burst Cleanup helps review shots from a burst. Requires iOS 16.0 or later.</p></div>"
      },
      {
        label: "photo cleaner FAQ review and free limit",
        from: ["<details><summary>Does AI Cleaning delete photos automatically?</summary><p>No. It presents cleanup candidates for review and asks for confirmation before deletion. Daily Cleanup provides 30 swipe-style review cards at a time.</p></details>"],
        to: "<details><summary>Does AI Cleaning delete photos automatically?</summary><p>No. AI Cleaning asks you to review and confirm before a cleanup action. Free users get one successful in-app cleanup action across eligible tools; additional gated actions require Pro. Daily Cleanup offers 30 review cards per day, but reviewing cards does not itself delete them.</p></details>"
      }
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
    title: "GIF Maker App for iPhone | Video &amp; Live Photo",
    description: "GIFmaker turns videos, Live Photos, and pictures into GIFs on iPhone. Edit timing, captions, canvas, reverse, and boomerang on-device. US price: $0.99.",
    keywords: "GIF maker app, GIF maker app for iPhone, iPhone GIF maker, video GIF maker for iPhone, GIF maker from photos, animated GIF maker, on-device GIF editor",
    modifiedDate: "2026-10-08",
    modifiedDateLabel: "October 8, 2026",
    webPage: {
      "@id": "https://www.xiaozhonglvyou.com/gif-maker.html#page",
      name: "GIF Maker App for iPhone | Video & Live Photo",
      description: "GIFmaker turns videos, Live Photos, and pictures into GIFs on iPhone. Edit timing, captions, canvas, reverse, and boomerang on-device. US price: $0.99.",
      dateModified: "2026-10-08"
    },
    softwareApplication: {
      "@id": "https://www.xiaozhonglvyou.com/gif-maker.html#app",
      alternateName: [
        "GIFmaker",
        "GIF Maker: Photos & Video",
        "GIF Maker App for iPhone",
        "Video to GIF Maker"
      ],
      description: "A GIF maker app for iPhone that creates animated GIFs from photos, videos, and Live Photos with timing, captions, frame order, canvas, and playback controls. The US storefront lists a $0.99 upfront price."
    },
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/gif-maker.html#breadcrumb",
        values: {
          name: "GIF Maker App for iPhone",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.xiaozhonglvyou.com/" },
            { "@type": "ListItem", position: 2, name: "Apps", item: "https://www.xiaozhonglvyou.com/apps.html" },
            { "@type": "ListItem", position: 3, name: "GIF Maker App for iPhone", item: "https://www.xiaozhonglvyou.com/gif-maker.html" }
          ]
        }
      }
    ],
    questions: [
      {
        names: ["Can GIFmaker turn a video or Live Photo into a GIF?", "Is there a free GIF maker app for iPhone?", "How much does GIFmaker cost?"],
        answer: "The US App Store lists GIFmaker at an upfront price of $0.99 when checked on October 8, 2026. It turns photos, videos, and Live Photos into GIFs with frame timing, captions, canvas ratios, reverse, and boomerang playback. Check the local purchase sheet for current pricing."
      }
    ],
    removeJsonLdIds: ["https://www.xiaozhonglvyou.com/gif-maker.html#howto"],
    h1: [
      "Turn photos, video, or Live Photos into a GIF.",
      "Make GIFs from video and Live Photos on iPhone.",
      "Turn videos and Live Photos into GIFs on iPhone.",
      "Free GIF maker app for iPhone.",
      "Turn videos and Live Photos into GIFs on iPhone."
    ],
    replacements: [
      {
        label: "product breadcrumb label",
        from: ["<li aria-current=\"page\">GIFmaker</li>", "<li aria-current=\"page\">Free GIF Maker App</li>"],
        to: "<li aria-current=\"page\">GIF Maker App</li>"
      },
      {
        label: "product eyebrow",
        from: ["<p class=\"eyebrow\">GIF maker for iPhone</p>", "<p class=\"eyebrow\">Free GIF maker app for iPhone</p>"],
        to: "<p class=\"eyebrow\">GIF maker app for iPhone</p>"
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
        to: "<div><p class=\"section-kicker\">What the app includes</p><h2>One iPhone GIF maker for photos, video, and Live Photos.</h2><p>Choose the source, refine the loop with live preview, and export from the same app. For the complete video workflow, read <a href=\"make-gif-on-iphone-guide.html\">how to make a GIF on iPhone from video</a>. To compare formats, AI tools, subscriptions, and iOS support, see the <a href=\"best-gif-maker-apps-iphone.html\">best GIF maker apps for iPhone</a>.</p></div>"
      },
      {
        label: "product visible FAQ",
        from: ["<details open><summary>Can GIFmaker turn a video or Live Photo into a GIF?</summary><p>Yes. GIFmaker can import photos, videos, or Live Photos and turn them into animated GIFs on iPhone.</p></details>", "<details open><summary>Is there a free GIF maker app for iPhone?</summary><p>Yes. GIFmaker-Gif Studio is free to download and turns photos, videos, and Live Photos into GIFs on iPhone. It includes per-frame timing, captions, canvas ratios, reverse, and boomerang playback.</p></details>", "<details open><summary>How much does GIFmaker cost?</summary><p>The US App Store lists GIFmaker-Gif Studio at an upfront price of $0.99 when checked on October 2, 2026. It turns photos, videos, and Live Photos into GIFs with frame timing, captions, canvas ratios, reverse, and boomerang playback. Check the local purchase sheet for current pricing.</p></details>", "<details open><summary>How much does GIFmaker cost?</summary><p>The US App Store lists GIFmaker at an upfront price of $0.99 when checked on October 2, 2026. It turns photos, videos, and Live Photos into GIFs with frame timing, captions, canvas ratios, reverse, and boomerang playback. Check the local purchase sheet for current pricing.</p></details>"],
        to: "<details open><summary>How much does GIFmaker cost?</summary><p>The US App Store lists GIFmaker at an upfront price of $0.99 when checked on October 8, 2026. It turns photos, videos, and Live Photos into GIFs with frame timing, captions, canvas ratios, reverse, and boomerang playback. Check the local purchase sheet for current pricing.</p></details>"
      }
    ]
  },
  {
    file: "make-gif-on-iphone-guide.html",
    title: "How to Create an Animated GIF on iPhone (2026)",
    description: "Create an animated GIF on iPhone from photos with Shortcuts or from video and Live Photos with GIFmaker. Compare Photos Loop with a real .gif export.",
    keywords: "how to create animated GIF on iPhone, how to make a GIF on iPhone, iPhone Shortcuts Make GIF, video to GIF iPhone, Live Photo to GIF iPhone",
    modifiedDate: "2026-10-09",
    modifiedDateLabel: "October 9, 2026",
    headline: [
      "How to Make a GIF on iPhone from Video or Live Photos",
      "How to Make a Real GIF on iPhone in 5 Steps (2026)",
      "How to Make a GIF on iPhone From Video or Live Photo (2026)",
      "How to Make a GIF on iPhone From Video: 5 Steps (2026)",
      "How to Create an Animated GIF on iPhone (2026)"
    ],
    article: {
      "@id": "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html#article",
      headline: "How to Create an Animated GIF on iPhone (2026)",
      description: "Create an animated GIF on iPhone from photos with Shortcuts or from video and Live Photos with GIFmaker. Compare Photos Loop with a real .gif export.",
      dateModified: "2026-10-09",
      keywords: [
        "how to create animated GIF on iPhone",
        "how to make a GIF on iPhone",
        "iPhone Shortcuts Make GIF",
        "video to GIF iPhone",
        "Live Photo to GIF iPhone"
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
          name: "Make an Animated GIF on iPhone",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.xiaozhonglvyou.com/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.xiaozhonglvyou.com/guides.html" },
            { "@type": "ListItem", position: 3, name: "Make an Animated GIF on iPhone", item: "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html" }
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
      "Make a GIF on iPhone from video in 5 steps.",
      "Create an animated GIF on iPhone from photos or video."
    ],
    replacements: [
      {
        label: "guide breadcrumb label",
        from: ["<li aria-current=\"page\">Make a GIF on iPhone</li>", "<li aria-current=\"page\">Make a GIF From Video</li>"],
        to: "<li aria-current=\"page\">Make an Animated GIF</li>"
      },
      {
        label: "guide eyebrow",
        from: ["<p class=\"eyebrow\">Video and Live Photo guide</p>", "<p class=\"eyebrow\">Video to GIF on iPhone</p>"],
        to: "<p class=\"eyebrow\">Make a GIF on iPhone</p>"
      },
      {
        label: "guide hero summary",
        from: [
          "<p class=\"hero-summary\">Make a real .gif in five steps: tune timing and playback, then export up to 1080px with free on-device editing and no uploads.</p>",
          "<p class=\"hero-summary\">Trim the useful frames, tune timing and playback, then export up to 1080px. The same workflow also turns a Live Photo into a GIF.</p>"
        ],
        to: "<p class=\"hero-summary\">Use Shortcuts to make a GIF from photos, or turn a video or Live Photo into a GIF with frame controls. Photos Loop is a quick effect, not a .gif export.</p>"
      },
      {
        label: "guide publication date",
        from: ["<p class=\"article-meta\">Published and updated <time datetime=\"2026-08-13\">August 13, 2026</time> by <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"],
        to: "<p class=\"article-meta\">Published August 10, 2026 · Updated <time datetime=\"2026-10-09\">October 9, 2026</time> by <a href=\"about.html\" rel=\"author\">Bo Chen</a></p>"
      },
      {
        label: "guide product call to action",
        from: ["<a class=\"button button-secondary\" href=\"gif-maker.html\">See GIFmaker details</a>"],
        to: "<a class=\"button button-secondary\" href=\"gif-maker.html\">GIF maker app</a>"
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
        to: "<a class=\"region-card\" href=\"gif-maker.html\"><span>GIF maker app</span><strong>GIFmaker features, privacy, requirements, and App Store link</strong></a>"
      },
      {
        label: "animated GIF quick answer",
        from: ["<p>If you only want a Live Photo to move repeatedly inside Apple-compatible apps, Photos may be enough. If the destination expects a .gif file, or you need editing controls, export a real GIF.</p>"],
        to: "<p>For a looping Live Photo, use Photos Loop or Bounce. For a .gif file from still photos, use Apple's Shortcuts Make GIF action. For video, Live Photos, or detailed frame editing, export a GIF with GIFmaker.</p>"
      },
      {
        label: "GIF workflow section navigation",
        from: ['<p>For a looping Live Photo, use Photos Loop or Bounce. For a .gif file from still photos, use Apple\'s Shortcuts Make GIF action. For video, Live Photos, or detailed frame editing, export a GIF with GIFmaker.</p>'],
        to: '<p>For a looping Live Photo, use Photos Loop or Bounce. For a .gif file from still photos, use Apple\'s Shortcuts Make GIF action. For video, Live Photos, or detailed frame editing, export a GIF with GIFmaker.</p><p><a href="#make-gif-with-shortcuts">Shortcuts photo steps</a> | <a href="#make-gif-steps">Video and Live Photo steps</a> | <a href="#gif-sharing-checks">Check a static export</a></p>'
      },
      {
        label: "correct Live Photos effects reference",
        from: ['<p>Apple\'s <a href="https://support.apple.com/en-us/105029" target="_blank" rel="noopener noreferrer">Live Photos guide</a> explains the built-in Loop and Bounce effects.</p>'],
        to: '<p>Apple\'s <a href="https://support.apple.com/en-au/104966" target="_blank" rel="noopener noreferrer">Live Photos guide</a> explains the built-in Loop and Bounce effects.</p>'
      },
      {
        label: "animated GIF method summary",
        from: ["<div><strong>Real GIF export</strong><p>Use this for a portable GIF file, custom frame timing, captions, canvas ratios, reverse playback, or a refined boomerang loop.</p></div>"],
        to: "<div><strong>Shortcuts GIF</strong><p>Turn selected still photos into a shareable .gif file without a separate editor.</p></div><div><strong>GIFmaker export</strong><p>Use this for a video or Live Photo, custom frame timing, captions, canvas ratios, or reverse playback.</p></div>"
      },
      {
        label: "animated GIF method heading",
        from: ["<h2>Photos effect or GIF export?</h2>"],
        to: "<h2>Photos effect, Shortcuts, or a GIF editor?</h2>"
      },
      {
        label: "animated GIF method table",
        from: ["<div role=\"row\"><span role=\"cell\">Send a .gif file</span><span role=\"cell\">GIFmaker</span><span role=\"cell\">Exports the animation in GIF format for wider sharing.</span></div>"],
        to: "<div role=\"row\"><span role=\"cell\">Create a .gif from still photos</span><span role=\"cell\">Shortcuts Make GIF</span><span role=\"cell\">Builds a GIF file with Apple's built-in actions.</span></div><div role=\"row\"><span role=\"cell\">Convert video to a .gif file</span><span role=\"cell\">GIFmaker</span><span role=\"cell\">Exports a video clip as a GIF for sharing.</span></div>"
      },
      {
        label: "Shortcuts GIF workflow",
        from: [
          legacyShortcutsGifSection + '<section class="section content-section" id="make-gif-steps">',
          '<section class="section content-section" id="make-gif-steps">'
        ],
        to: shortcutsGifSection + '<section class="section content-section" id="make-gif-steps">'
      },
      {
        label: "GIF output and sharing checks",
        from: ['<section class="section faq" aria-labelledby="gif-guide-faq-title">'],
        to: gifSharingChecks + '<section class="section faq" aria-labelledby="gif-guide-faq-title">'
      }
    ]
  },
  {
    file: "happyride-auto-ride-tracker.html",
    title: "Free Bike Ride Tracker App for iPhone | HappyRide",
    description: "Free bike ride tracker app for iPhone that records qualifying rides automatically without tapping Start. Save GPS routes and Apple Health workouts.",
    keywords: "free bike ride tracker app, free bike ride tracker app for iPhone, bike ride tracker app, bike tracker app free, bike ride tracker iPhone, GPS bike ride tracker, Apple Health cycling app",
    modifiedDate: "2026-09-23",
    modifiedDateLabel: "September 23, 2026",
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
    description: "Track bike rides on iPhone without tapping Start. Enable Motion &amp; Fitness and background location; Apple Health and Apple Watch heart rate are optional.",
    keywords: "how to track a bike ride on iPhone, how can I track my bike ride on iPhone, bike ride tracker iPhone, bike ride tracker app, track cycling on iPhone, automatic bike ride tracker",
    modifiedDate: "2026-09-23",
    modifiedDateLabel: "September 23, 2026",
    article: {
      description: "Track bike rides on iPhone without tapping Start. Enable Motion & Fitness and background location; Apple Health and Apple Watch heart rate are optional.",
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
    title: "Best Translator App for iPhone: 3 Compared (2026)",
    description: "Compare the best translator apps for iPhone: Apple Translate, Google Translate, and Translation Specialist for voice, camera, offline, and travel use.",
    keywords: "translator app for iPhone, best translator app for iPhone, best translation app for iPhone, translation app for iPhone, Apple Translate vs Google Translate, offline translator app, camera translator app",
    article: {
      description: "Compare the best translator apps for iPhone: Apple Translate, Google Translate, and Translation Specialist for voice, camera, offline, and travel use.",
      dateModified: "2026-10-03",
      keywords: [
        "translator app for iPhone",
        "best translator app for iPhone",
        "best translation app for iPhone",
        "translation app for iPhone",
        "best translator apps for travel",
        "Apple Translate vs Google Translate",
        "offline translator app",
        "camera translator app",
        "voice translator app"
      ],
      wordCount: 1478
    },
    autoArticleWordCount: true,
    structuredData: [
      {
        type: "BreadcrumbList",
        id: "https://www.xiaozhonglvyou.com/best-travel-translator-apps-iphone.html#breadcrumb",
        values: {
          name: "Best Translator Apps for iPhone",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.xiaozhonglvyou.com/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://www.xiaozhonglvyou.com/guides.html" },
            { "@type": "ListItem", position: 3, name: "Best Translator Apps for iPhone", item: "https://www.xiaozhonglvyou.com/best-travel-translator-apps-iphone.html" }
          ]
        }
      }
    ],
    questions: [
      {
        names: ["What is the best translator app for travel?", "What is the best translator app for iPhone?"],
        answer: "There is no universal winner. Apple Translate is the simplest built-in choice, Google Translate is strongest for broad language and input coverage, and Translation Specialist is a focused option for travelers who want two-way voice conversation, continuous live interpretation, camera translation, and phrase flashcards in one app."
      }
    ],
    modifiedDate: "2026-10-03",
    modifiedDateLabel: "October 3, 2026",
    headline: [
      "Best Travel Translator Apps for iPhone: 3 Compared (2026)",
      "Best Translator Apps for Travel: 3 Compared (2026)",
      "Best Translator App for iPhone: 3 Compared (2026)"
    ],
    h1: [
      "The best travel translator depends on how you communicate.",
      "3 travel translator apps compared.",
      "3 best travel translator apps for iPhone, compared.",
      "3 best translator apps for travel, compared.",
      "Best translator apps for iPhone, compared."
    ],
    replacements: [
      {
        label: "translator comparison breadcrumb",
        from: ["<li aria-current=\"page\">Translator Apps for Travel</li>"],
        to: "<li aria-current=\"page\">Translator Apps for iPhone</li>"
      },
      {
        label: "translator comparison eyebrow",
        from: ["<p class=\"eyebrow\">Translator apps for travel</p>"],
        to: "<p class=\"eyebrow\">iPhone translator app comparison</p>"
      },
      {
        label: "translator comparison hero summary",
        from: ["<p class=\"hero-summary\">Apple Translate, Google Translate, and Translation Specialist compared for voice, camera, offline use, privacy, and cost.</p>"],
        to: "<p class=\"hero-summary\">Apple Translate, Google Translate, and Translation Specialist compared for iPhone voice translation, camera menus, offline packs, privacy, and cost.</p>"
      },
      {
        label: "translator comparison lead question",
        from: ["<summary>What is the best translator app for travel?</summary>"],
        to: "<summary>What is the best translator app for iPhone?</summary>"
      },
      {
        label: "translator comparison first-party research date and app name",
        from: [
          '<p>We checked Apple Support, Google Translate Help, and the current US App Store listings on <time datetime="2026-08-10">August 10, 2026</time>. We did not invent universal accuracy scores: translation quality changes by language pair, accent, background noise, text clarity, and context.</p>'
        ],
        to: '<p>Apple currently lists our app as Translation Specialist: Speak; this comparison uses Translation Specialist for brevity. We checked Apple Support, Google Translate Help, and the current US App Store listings on <time datetime="2026-10-03">October 3, 2026</time>. We did not invent universal accuracy scores: translation quality changes by language pair, accent, background noise, text clarity, and context.</p>'
      },
      {
        label: "translator comparison published breadth and size rows",
        from: [
          '<div role="row"><span role="cell"><strong>Published breadth</strong></span><span role="cell">Supported languages vary by feature and Apple platform availability</span><span role="cell">Up to 249 text languages; not every input mode works with every language</span><span role="cell">20 app interface languages; current release notes describe live interpretation across 17 languages</span></div>',
          '<div role="row"><span role="cell"><strong>Published language claims</strong></span><span role="cell">Supported languages vary by feature and Apple platform availability</span><span role="cell">Up to 249 text languages; feature support varies by language</span><span role="cell">Store copy advertises 20 app languages; App Store language metadata lists English plus 7 more; live interpretation is separately described as supporting 17 languages</span></div><div role="row"><span role="cell"><strong>US App Store size at check date</strong></span><span role="cell">Built in on supported iPhones; no separate install size in this comparison</span><span role="cell">308.3 MB</span><span role="cell">986.8 MB; download on Wi-Fi and leave storage for language resources</span></div>'
        ],
        to: '<div role="row"><span role="cell"><strong>Published language claims</strong></span><span role="cell">Supported languages vary by feature and Apple platform availability</span><span role="cell">Up to 249 text languages; feature support varies by language</span><span role="cell">Store copy advertises 20 app languages; App Store language metadata lists English plus 7 more; live interpretation is separately described as supporting 17 languages</span></div><div role="row"><span role="cell"><strong>US App Store size at check date</strong></span><span role="cell">Built in on supported iPhones; no separate install size in this comparison</span><span role="cell">308.3 MB</span><span role="cell">986.8 MB; check available storage and download on Wi-Fi</span></div>'
      },
      {
        label: "translator comparison current system requirements",
        from: [
          '<div role="row"><span role="cell"><strong>Current iPhone requirement</strong></span><span role="cell">Depends on iOS feature and device; some Live Translation features require Apple Intelligence</span><span role="cell">Current US listing requires iOS 18 or later</span><span role="cell">Version 2.2.3 requires iOS 17.4 or later</span></div>'
        ],
        to: '<div role="row"><span role="cell"><strong>Current iPhone requirement</strong></span><span role="cell">Depends on iOS feature and device; some Live Translation features require Apple Intelligence</span><span role="cell">US App Store listing requires iOS 18 or later</span><span role="cell">Version 2.2.3, released September 7, 2026, requires iOS 17.4 or later</span></div>'
      }
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
      description: "GIFmaker 可在 iPhone 本机把照片、视频和 Live Photo 制作成 GIF，支持逐帧调速、文字、倒放、回旋循环和多种画布比例。",
      dateModified: "2026-10-08"
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
    title: "How to Translate Menus on iPhone: Camera &amp; Voice (2026)",
    description: "Translate menus on iPhone with Apple Translate camera; check dishes and prices, then use voice for questions. Six steps cover language and offline limits.",
    keywords: "how to translate menus on iPhone, translate a menu on iPhone, Apple Translate camera, translate conversations on iPhone, translate signs with camera, iPhone translation guide",
    modifiedDate: "2026-09-23",
    modifiedDateLabel: "September 23, 2026",
    article: {
      description: "Translate menus on iPhone with Apple Translate camera; check dishes and prices, then use voice for questions. Six steps cover language and offline limits."
    },
    autoArticleWordCount: true,
    headline: [
      "Voice and Camera Translator Guide for Travel",
      "Voice and Camera Translator for Travel",
      "Voice and Camera Translator for Travel: 6 Steps (2026)",
      "How to Translate Menus on iPhone: Camera & Voice (2026)"
    ],
    h1: [
      "Translate menus, signs, and conversations in 6 steps.",
      "How to translate menus on iPhone, then handle conversations."
    ]
  },
  {
    file: "mac-screen-privacy.html",
    title: "Mac Privacy Screen App | Free vs $2.99 (2026)",
    description: "Mac privacy screen app for hiding selected windows, covering sensitive areas, and safer presentations. Compare free Lite with the $2.99 full Mac app.",
    keywords: "mac privacy screen app, Mac privacy app, screen privacy app for Mac, privacy screen app MacBook, hide sensitive windows Mac, anti spy screen, presentation privacy app",
    modifiedDate: "2026-09-30",
    modifiedDateLabel: "September 30, 2026",
    article: {
      description: "Mac privacy screen app for hiding selected windows, covering sensitive areas, and safer presentations. Compare free Lite with the $2.99 full Mac app.",
      dateModified: "2026-09-30",
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
      "Mac Privacy Screen App: Free vs $3.99 (2026)",
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
    title: "Hide Notifications While Screen Sharing on Mac: 6 Steps",
    description: "Turn off macOS alerts while mirroring or sharing, enable Focus, share one window, and test before your meeting. A practical 6-step Mac checklist.",
    keywords: "how to hide notifications when screen sharing on Mac, Mac hide notifications when sharing screen, Mac screen sharing privacy, share screen privacy settings Mac, hide private windows Mac",
    modifiedDate: "2026-09-30",
    modifiedDateLabel: "September 30, 2026",
    article: {
      description: "Turn off macOS alerts while mirroring or sharing, enable Focus, share one window, and test before your meeting. A practical 6-step Mac checklist.",
      dateModified: "2026-09-30",
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
      description: "A six-step checklist using macOS notification settings, a narrow shared source, optional privacy controls, and a receiving-device test.",
      step: screenSharingSteps.map(([name, text], index) => ({
        "@type": "HowToStep",
        position: index + 1,
        url: `https://www.xiaozhonglvyou.com/screen-sharing-privacy-guide.html#step-${index + 1}`,
        name,
        text
      }))
    },
    headline: [
      "Mac Screen Sharing Privacy Guide",
      "How to Protect Mac Privacy During Screen Sharing",
      "Mac Screen Sharing Privacy Checklist: 6 Steps (2026)",
      "Hide Notifications While Screen Sharing on Mac: 6 Steps"
    ],
    h1: [
      "Protect sensitive Mac windows before a meeting or nearby glance exposes them.",
      "Protect Mac privacy before screen sharing.",
      "Protect Mac screen sharing privacy in 6 steps.",
      "Hide notifications and private windows before screen sharing.",
      "Hide notifications when screen sharing on Mac in 6 steps."
    ],
    questions: [
      { names: ["What is the main risk during screen sharing?", "Why do some alerts still appear with Do Not Disturb on?"], answer: screenSharingFocusAnswer },
      { names: ["Does this replace careful meeting setup?", "Do I need another app to hide notifications or share one window?"], answer: screenSharingBuiltinAnswer }
    ],
    replacements: [
      {
        label: "built-in-first screen sharing summary",
        from: ['<p class="hero-summary">Use Focus, share one window, protect sensitive apps, enable Presenting Mode, and run a test before the meeting or recording starts.</p>'],
        to: '<p class="hero-summary">Use built-in macOS notification settings, share one window or tab, and check the receiving view before your meeting. Privacy utilities are optional, and any protected-app or color-block behavior needs its own test.</p>'
      },
      {
        label: "notification-first contents link",
        from: ['<a href="#step-1">Check screen recording permission</a>'],
        to: '<a href="#step-1">Silence notifications and check permission</a>'
      },
      {
        label: "meeting and receiving-test contents links",
        from: ['<li><a href="#step-6">Stop sharing and restore the workspace</a></li></ol>'],
        to: '<li><a href="#step-6">Stop sharing and restore the workspace</a></li><li><a href="#meeting-apps">Zoom, Meet, and Teams settings</a></li><li><a href="#receiver-test">Check the receiving view</a></li></ol>'
      },
      {
        label: "optional privacy controls boundary",
        from: ['<p>The first two steps use macOS and the meeting app. The privacy utility adds protected apps and presentation controls, but it cannot choose the correct shared source for you.</p>'],
        to: '<p>macOS notification settings and a window or tab share do not require another app. If you add a privacy utility, verify its protected-app and presentation behavior in the captured output; it cannot choose the correct shared source for you.</p>'
      },
      {
        label: "window and audio selection step",
        from: ['<p>Share one application window when the meeting app allows it. Sharing an entire display makes unrelated windows, menu-bar activity, and desktop content easier to expose.</p>'],
        to: `<p>${screenSharingSteps[1][1]}</p>`
      },
      {
        label: "optional protected-app step",
        from: ['<p>Close unrelated chat, email, finance, client, and internal-tool windows. In Anti-spy screen Lite, mark the apps that should be hidden when privacy protection triggers.</p>'],
        to: `<p>${screenSharingSteps[2][1]}</p>`
      },
      {
        label: "capture-aware presentation controls step",
        from: ['<strong>4. Enable Presenting Mode</strong><p>Before the meeting, use Presenting Mode and a Privacy Color Block where needed to reduce exposure from sensitive windows or private screen regions.</p>'],
        to: `<strong>4. ${screenSharingSteps[3][0]}</strong><p>${screenSharingSteps[3][1]}</p>`
      },
      {
        label: "optional controls contents link",
        from: ['<a href="#step-4">Enable Presenting Mode</a>'],
        to: '<a href="#step-4">Test optional presentation controls</a>'
      },
      {
        label: "receiving-device test step",
        from: ['<p>Start a test call, confirm the exact source being shared, open a harmless notification, and verify that private apps and screen regions remain hidden.</p>'],
        to: `<p>${screenSharingSteps[4][1]}</p>`
      },
      {
        label: "meeting-specific guidance and receiving checklist",
        from: [screenSharingRiskSection],
        to: screenSharingMeetingSections + screenSharingRiskSection
      },
      {
        label: "Focus exception FAQ",
        from: ['<summary>What is the main risk during screen sharing?</summary><p>Private windows, notifications, documents, or protected work can be exposed when the wrong app or desktop area is shared.</p>'],
        to: `<summary>Why do some alerts still appear with Do Not Disturb on?</summary><p>${screenSharingFocusAnswer}</p>`
      },
      {
        label: "built-in settings FAQ",
        from: ['<summary>Does this replace careful meeting setup?</summary><p>No. It supports a privacy workflow. Users should still check the meeting app, shared screen source, and protected apps before presenting.</p>'],
        to: `<summary>Do I need another app to hide notifications or share one window?</summary><p>${screenSharingBuiltinAnswer}</p>`
      }
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
