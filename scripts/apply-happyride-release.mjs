import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { happyrideRelease as release, happyrideCheckedDateLabel } from "./happyride-release-facts.mjs";

export const happyrideReleaseFiles = ["index.html", "apps.html", "happyride-auto-ride-tracker.html", "happyride-auto-ride-tracker-cn.html", "automatic-bike-ride-tracker-iphone.html"];

const englishLanguages = release.languages.join(", ");
const chineseLanguages = release.chineseLanguages.join("、");
const freeAnswer = "Automatic activity recording is free. An optional auto-renewing HappyRide Pro subscription unlocks the live cycling computer after the first free ride, advanced statistics, Quiet and Scenic route planning, and turn-by-turn voice navigation. Route planning requires internet access; current subscription prices and terms appear before purchase.";
const chineseFreeAnswer = "自动运动记录免费。可选的 HappyRide Pro 自动续订订阅解锁首次免费骑行之后的实时码表、高级统计、安静与风景路线规划及逐向语音导航。路线规划需要联网，订阅价格与条款在购买前显示。";

function replaceIfPresent(html, from, to) {
  return html.replaceAll(from, to);
}

function textContent(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&(?:amp|gt|lt|quot|apos|#39|nbsp);/g, (entity) => ({ "&amp;": "&", "&gt;": ">", "&lt;": "<", "&quot;": '"', "&apos;": "'", "&#39;": "'", "&nbsp;": " " }[entity])).replace(/\s+/g, " ").trim();
}

function visibleQuestions(html) {
  return [...html.matchAll(/<details\b[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)]
    .map(([, question, answer]) => ({ "@type": "Question", name: textContent(question), acceptedAnswer: { "@type": "Answer", text: textContent(answer) } }));
}

function upsertMetadata(html, chinese) {
  const metadata = chinese
    ? `版本 ${release.version} · 需要 iOS ${release.minimumIOS} 或更高版本 · 支持 12 种界面语言 · 更新于 <time datetime="${release.checkedDate}">${happyrideCheckedDateLabel("zh-CN")}</time>`
    : `Version ${release.version} · Requires iOS ${release.minimumIOS} or later · 12 interface languages · Updated <time datetime="${release.checkedDate}">${happyrideCheckedDateLabel()}</time>`;
  const metadataPattern = /<p class="article-meta">(?:Version|版本) [\s\S]*?<\/p>/;
  if (!metadataPattern.test(html)) throw new Error("Missing HappyRide release metadata");
  html = html.replace(metadataPattern, `<p class="article-meta">${metadata}</p>`);
  const language = `<p class="article-meta" data-happyride-languages="${release.version}">${chinese ? `界面语言：${chineseLanguages}。应用会跟随你的 App 语言偏好；下方截图展示简体中文界面。` : `Interface languages: ${englishLanguages}. The app follows your app language preference; the screenshots below show the Simplified Chinese interface.`}</p>`;
  const languagePattern = /<p class="article-meta" data-happyride-languages="[^"]+">[\s\S]*?<\/p>/;
  return languagePattern.test(html) ? html.replace(languagePattern, language) : html.replace(metadataPattern, (match) => match + language);
}

function updateProduct(html, chinese) {
  html = upsertMetadata(html, chinese);
  const replacements = chinese ? [
    ["HappyRide 1.4.1 需要 iOS 17.0 或更高版本。", `HappyRide ${release.version} 需要 iOS ${release.minimumIOS} 或更高版本。`],
    ["页面信息已于 2026 年 9 月 23 日对照公开 App Store 页面核验。", `页面信息已于 ${happyrideCheckedDateLabel("zh-CN")}对照公开 App Store 页面核验。`],
    ["核心记录默认支持离线。单独的可选订阅可解锁联网路线规划与转弯提醒。", "自动运动记录免费，可离线记录；实际识别取决于权限和可用传感器数据。可选的 HappyRide Pro 订阅包含首次免费骑行之后的实时码表、高级统计、联网路线规划与逐向语音导航。"],
    ["查看每次活动和每周汇总，不用只靠记忆回顾运动量。", "查看活动历史与运动记录；高级统计属于可选的 HappyRide Pro 订阅。"],
    ["自动记录需要运动与健身、后台定位权限；与 Apple 健康同步则需要你单独授权健康数据读写。", "自动记录需要运动与健身和定位权限；后台路线记录需要“始终”定位权限。与 Apple 健康同步需要单独授权健康数据读写。"]
  ] : [
    ["The on-screen interface is currently Simplified Chinese only. Automatic tracking also depends on Motion &amp; Fitness, background location, and Apple Health permissions that you can review in system settings.", "HappyRide 1.4.2 supports 12 interface languages and follows your app language preference. Automatic tracking depends on Motion &amp; Fitness and location access; saving workouts to Apple Health requires separate permission."],
    ["Simplified Chinese is the only current interface language. A full English interface is planned but not yet available.", `Apple lists ${englishLanguages}. The existing screenshots show Simplified Chinese; they are not translated previews.`],
    ["The current on-screen interface is Simplified Chinese only. An English interface is on the product roadmap, so English-only users should wait for that update.", `Yes. HappyRide ${release.version} supports English among 12 interface languages: ${englishLanguages}. It follows your app language preference.`],
    ["HappyRide version 1.4.1 requires iOS 17.0 or later.", `HappyRide version ${release.version} requires iOS ${release.minimumIOS} or later.`],
    ["Current product facts were checked against the public App Store listing on September 23, 2026.", `Current product facts were checked against the public App Store listing on ${happyrideCheckedDateLabel()}.`],
    ["Yes. HappyRide's core bike ride tracking, activity history, weekly statistics, Apple Health sync, and Apple Watch support are free. Quiet and Scenic route planning and turn-by-turn navigation are optional subscription features.", freeAnswer],
    ["The core tracker works offline by default. A separate optional subscription unlocks network-based route planning and turn alerts.", "Automatic activity recording is free and can work offline, depending on permissions and available sensor data. Optional HappyRide Pro adds the live cycling computer after the first free ride, advanced statistics, internet-based route planning, and turn-by-turn voice navigation."],
    ["Review individual activities and a weekly view instead of relying on memory.", "Review activity history and recorded workouts. Advanced statistics are part of optional HappyRide Pro."],
    ["Used to record routes when a qualifying activity is detected.", "Always location access is required to record routes in the background when a qualifying activity is detected."]
  ];
  for (const [from, to] of replacements) html = replaceIfPresent(html, from, to);
  if (chinese && !html.includes("<summary>HappyRide 支持哪些界面语言？</summary>")) {
    const questions = `<details><summary>HappyRide 支持哪些界面语言？</summary><p>HappyRide ${release.version} 支持 12 种界面语言：${chineseLanguages}。应用会跟随你的 App 语言偏好；本页截图展示简体中文界面。</p></details><details><summary>HappyRide 免费吗？</summary><p>${chineseFreeAnswer}</p></details>`;
    html = html.replace(/(<div class="faq-list">)/, "$1" + questions);
  }
  return html;
}

function updateGuide(html) {
  const replacements = [
    ["<strong>Current language boundary</strong>", "<strong>Version and languages</strong>"],
    ["HappyRide version 1.4.1 requires iOS 17 or later, and its current in-app interface is Simplified Chinese.", `HappyRide ${release.version} requires iOS 17 or later and supports 12 interface languages, including English, French, German, Japanese, Malay, Swedish, Arabic, Italian, and Polish.`],
    ["Use an iPhone running iOS 17 or later. Expect the current in-app interface to be Simplified Chinese.", `Use an iPhone running iOS 17 or later. HappyRide ${release.version} follows your app language preference and supports 12 interface languages. The screenshots on this page show Simplified Chinese.`],
    ["Install HappyRide on an iPhone running iOS 17 or later. The current in-app interface is Simplified Chinese.", `Install HappyRide on an iPhone running iOS 17 or later. HappyRide ${release.version} supports 12 interface languages and follows your app language preference.`],
    ["These conclusions use the current public documentation and listing checked on September 23, 2026.", "The Apple documentation was reviewed on September 23, 2026; HappyRide's version, languages, and Pro terms were checked against Apple's listing on October 23, 2026."],
    ["The App Store listing says automatic activity tracking, Apple Health sync, Apple Watch support, ride history, and stats are free. Quiet and Scenic route planning and turn-by-turn navigation are optional subscription features.", freeAnswer],
    ['<time datetime="2026-09-23">September 23, 2026</time>', `<time datetime="${release.checkedDate}">${happyrideCheckedDateLabel()}</time>`]
  ];
  for (const [from, to] of replacements) html = replaceIfPresent(html, from, to);
  return html;
}

export function updateHappyrideRelease(file, html) {
  if (!happyrideReleaseFiles.includes(file)) throw new Error(`Unsupported HappyRide release file: ${file}`);
  const productPage = file.startsWith("happyride-auto-ride-tracker");
  const guide = file === "automatic-bike-ride-tracker-iphone.html";
  const chinese = file.endsWith("-cn.html");
  if (productPage) html = updateProduct(html, chinese);
  if (guide) html = updateGuide(html);
  if (productPage || guide) {
    html = html.replace(/<meta\b[^>]*>/gi, (tag) => /\bproperty\s*=\s*(["'])article:modified_time\1/i.test(tag)
      ? tag.replace(/(\bcontent\s*=\s*["'])[^"']*(["'])/i, `$1${release.checkedDate}$2`)
      : tag);
    // Migrate pages already refreshed before the subscription wording was clarified.
    html = html.replaceAll("Optional HappyRide Pro unlocks the live cycling computer after the first free ride, advanced statistics, Quiet and Scenic route planning, and turn-by-turn voice navigation.", "An optional auto-renewing HappyRide Pro subscription unlocks the live cycling computer after the first free ride, advanced statistics, Quiet and Scenic route planning, and turn-by-turn voice navigation.")
      .replaceAll("可选的 HappyRide Pro 订阅解锁首次免费骑行之后的实时码表、高级统计、安静与风景路线规划及逐向语音导航。", "可选的 HappyRide Pro 自动续订订阅解锁首次免费骑行之后的实时码表、高级统计、安静与风景路线规划及逐向语音导航。");
  }
  if (file === "index.html") html = html.replace(/iOS \+ Apple Watch \d+\.\d+\.\d+(?=<\/p><h3>HappyRide: Auto Ride Tracker)/g, `iOS + Apple Watch ${release.version}`);
  if (file === "apps.html") {
    html = html.replace("<strong>Simplified Chinese interface.</strong><p>The English interface is planned but is not available in version 1.4.1.</p>", `<strong>12 interface languages in ${release.version}.</strong><p>Includes English, French, German, Japanese, Malay, Swedish, Arabic, Italian and Polish; the app follows your language preference.</p>`);
  }

  const questions = productPage || guide ? visibleQuestions(html) : null;
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (_match, open, json, close) => {
    const parsed = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (node["@type"] === "SoftwareApplication" && (node.url?.includes(`/id${release.appId}`) || node.identifier?.value === release.appId)) {
        node.softwareVersion = release.version;
        node.softwareRequirements = chinese ? `iOS ${release.minimumIOS} 或更高版本` : `iOS ${release.minimumIOS} or later`;
        node.availableLanguage = release.languages;
        if (node.offers) node.offers.description = chinese ? chineseFreeAnswer : freeAnswer;
      }
      if ((productPage || guide) && ["WebPage", "Article", "TechArticle"].includes(node["@type"])) node.dateModified = release.checkedDate;
      if (questions && node["@type"] === "FAQPage") node.mainEntity = questions;
      Object.values(node).forEach(visit);
    };
    visit(parsed);
    return open + JSON.stringify(parsed).replaceAll("<", "\\u003c") + close;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const directoryIndex = args.indexOf("--site-dir");
  if (directoryIndex !== -1 && !args[directoryIndex + 1]) throw new Error("--site-dir requires a directory");
  const site = path.resolve(directoryIndex !== -1 ? args[directoryIndex + 1] : process.env.SITE_DIR || path.resolve(import.meta.dirname, ".."));
  for (const file of happyrideReleaseFiles) {
    const destination = path.join(site, file);
    const original = await readFile(destination, "utf8");
    const updated = updateHappyrideRelease(file, original);
    if (updated !== original) await writeFile(destination, updated, "utf8");
    console.log(`${updated === original ? "Verified" : "Updated"} ${file} HappyRide release facts`);
  }
}
