import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { applyCtrConversion20261127, ensureHeroImagePreload } from "./ctr-conversion-20261127.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");

const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

const plain = (html) => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

const graph = (html) =>
  [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((m) => {
      const parsed = JSON.parse(m[1]);
      return Array.isArray(parsed) ? parsed : parsed["@graph"] ?? [parsed];
    });

test("CTR & conversion 2026-11-27 updater is idempotent across targeted and preloaded pages", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "ctr-conversion-20261127-"));
  try {
    const files = [
      "index.html",
      "zh-cn.html",
      "travel-translator.html",
      "happyride-auto-ride-tracker.html",
      "twopic-dual-camera.html",
      "make-gif-on-iphone-guide.html",
      "iphone-photo-cleaner-comparison.html"
    ];
    for (const file of files) {
      await writeFile(path.join(temp, file), await readFile(path.join(siteDir, file), "utf8"));
    }
    const result = await applyCtrConversion20261127(temp);
    assert.deepEqual(result.updatedFiles, []);
    assert.equal(result.preloadsAdded, 0);
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("Round 2 SERP-optimized product, tool, and guide pages keep compliant metadata and FAQs", async () => {
  const expectedTitles = new Map([
    ["gif-maker-online.html", "Free GIF Maker Online: Video, Photos & Resize (No Upload)"],
    ["image-compressor.html", "Free Image Compressor & Resizer: JPG, PNG, WebP (Local)"],
    ["tools.html", "Free Browser Tools: Image Compressor, GIF Maker & Cycling"],
    ["gif-reduce-file-size-guide.html", "How to Make a GIF Smaller: Reduce Size by Frames & Width"],
    ["gif-frame-rate-size-guide.html", "Video to GIF Settings: Best Frame Rate (4–12 fps) & Size"],
    ["travel-translator.html", "iPhone Travel Translator: Voice, Menu OCR & Offline (Free)"],
    ["happyride-auto-ride-tracker.html", "Free Auto Bike Ride Tracker for iPhone: No Start Button"],
    ["twopic-dual-camera.html", "TwoPic Dual Camera App for iPhone: Front & Back ($0.99)"]
  ]);

  for (const [file, expectedTitle] of expectedTitles) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    const actualTitle = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    assert.equal(actualTitle, expectedTitle, file);
    assert.ok(actualTitle.length >= 20 && actualTitle.length <= 60, `${file} title length: ${actualTitle.length}`);
    const desc = decode(html.match(/<meta\b(?=[^>]*name="description")[^>]*content="([^"]*)"/i)?.[1] ?? "");
    assert.ok(desc.length >= 70 && desc.length <= 160, `${file} description length: ${desc.length}`);
  }

  for (const guide of ["gif-reduce-file-size-guide.html", "gif-frame-rate-size-guide.html", "web-games.html", "web-games-cn.html"]) {
    const html = await readFile(path.join(siteDir, guide), "utf8");
    const faq = graph(html).find((node) => node["@type"] === "FAQPage");
    assert.ok(faq && faq.mainEntity.length === 4, `${guide}: expected 4 structured FAQs`);
    const visible = [...html.matchAll(/<details\b[^>]*>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)]
      .map((m) => [plain(m[1]), plain(m[2])]);
    assert.deepEqual(
      visible,
      faq.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
      `${guide}: visible and JSON-LD FAQs must match exactly`
    );
  }

  const twopic = await readFile(path.join(siteDir, "twopic-dual-camera.html"), "utf8");
  assert.match(twopic, /Get TwoPic · \$0\.99/);
});

test("top landing pages preload their displayed hero WebP image and homepages link Chrome extensions", async () => {
  const expectedPreloads = [
    ["travel-translator.html", "assets/translator-live-screen.webp"],
    ["happyride-auto-ride-tracker.html", "assets/happyride-home-screen.webp"],
    ["inkstone-markdown-notes.html", "assets/inkstone-editor-screen.webp"],
    ["twopic-dual-camera.html", "assets/twopic-icon.webp"],
    ["iphone-photo-cleaner-comparison.html", "assets/ai-cleaning-home-en.webp"],
    ["make-gif-on-iphone-guide.html", "assets/gifmaker-editor-screen.webp"],
    ["voice-camera-translator-guide.html", "assets/translator-live-screen.webp"],
    ["mac-screen-privacy.html", "assets/anti-spy-screen.webp"],
    ["gif-maker.html", "assets/gifmaker-editor-screen.webp"],
    ["automatic-bike-ride-tracker-iphone.html", "assets/happyride-home-screen.webp"],
    ["seedance-ai-tools.html", "assets/ai-cleaning-screen.webp"],
    ["zh-cn.html", "assets/ai-cleaning-screen.webp"]
  ];
  for (const [file, href] of expectedPreloads) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    assert.ok(
      html.includes(`<link rel="preload" href="${href}" as="image" type="image/webp" fetchpriority="high">`),
      `${file}: missing hero WebP preload for ${href}`
    );
    assert.equal(ensureHeroImagePreload(html), html, `${file}: preload injection must be idempotent`);
  }

  const enHome = await readFile(path.join(siteDir, "index.html"), "utf8");
  const zhHome = await readFile(path.join(siteDir, "zh-cn.html"), "utf8");
  const enToolsSection = enHome.match(/<section\b[^>]*id="browser-tools"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
  const zhToolsSection = zhHome.match(/<section\b[^>]*id="browser-tools-cn"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
  const zhGamesSection = zhHome.match(/<section\b[^>]*id="web-games"[^>]*>[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(enToolsSection.includes('href="chrome-extensions.html"'), "index.html #browser-tools must link chrome-extensions.html");
  assert.ok(zhToolsSection.includes('href="chrome-extensions-cn.html"'), "zh-cn.html #browser-tools-cn must link chrome-extensions-cn.html");
  assert.ok(!zhGamesSection.includes('href="chrome-extensions-cn.html"'), "zh-cn.html #web-games must not contain Chrome extension card");
});

test("browser game launch CTAs emit web_game_click analytics with beacon transport", async () => {
  for (const file of ["index.html", "zh-cn.html", "web-games.html", "web-games-cn.html"]) {
    const html = await readFile(path.join(siteDir, file), "utf8");
    assert.ok(html.includes('data-analytics-event="web_game_click" data-game-id="stardust"'), `${file}: missing stardust telemetry`);
    assert.ok(html.includes('data-analytics-event="web_game_click" data-game-id="guomao"'), `${file}: missing guomao telemetry`);
  }

  const analyticsSource = await readFile(path.join(siteDir, "analytics.js"), "utf8");
  const scriptSource = await readFile(path.join(siteDir, "script.js"), "utf8");
  const listeners = {};
  const context = {
    URL,
    URLSearchParams,
    window: {
      location: { pathname: "/web-games.html", search: "" },
      addEventListener() {}
    },
    document: {
      referrer: "",
      querySelector() { return null; },
      addEventListener(type, listener) { listeners[type] = listener; }
    }
  };
  vm.runInNewContext(analyticsSource, context);
  vm.runInNewContext(scriptSource, context);

  const link = {
    dataset: { analyticsEvent: "web_game_click", gameId: "guomao" },
    href: "https://gta.xiaozhonglvyou.com/",
    textContent: "  Ride around Guomao  ",
    getAttribute(name) { return name === "href" ? this.href : null; },
    closest(selector) { return selector === "a" ? this : null; }
  };
  listeners.click({ type: "click", button: 0, target: link });
  const events = Array.from(context.window.dataLayer)
    .filter(([cmd, name]) => cmd === "event" && name === "web_game_click");
  assert.equal(events.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(events[0][2])), {
    game_id: "guomao",
    link_url: "https://gta.xiaozhonglvyou.com/",
    link_text: "Ride around Guomao",
    page_path: "/web-games.html",
    transport_type: "beacon"
  });
});
