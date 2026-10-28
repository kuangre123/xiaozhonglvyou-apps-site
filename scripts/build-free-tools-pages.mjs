import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { freeToolPages, freeToolArticles, freeToolFile, freeToolsPairs, freeToolsDate, freeToolsOrigin } from "./free-tools-content.mjs";
import { renderImageToolWidget } from "./image-tool-widget.mjs";
import { renderGifToolWidget } from "./gif-tool-widget.mjs";
import { renderRideToolWidget } from "./ride-tool-widget.mjs";

const moduleFile = fileURLToPath(import.meta.url);
const defaultSiteDir = path.dirname(path.dirname(moduleFile));
const origin = freeToolsOrigin;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const publisher = { "@type": "Organization", "@id": `${origin}/#publisher`, name: "CrazyAIAgent", url: `${origin}/`, logo: { "@type": "ImageObject", url: `${origin}/assets/og-default.png` } };
const author = { "@type": "Person", "@id": `${origin}/#developer`, name: "Bo Chen", url: `${origin}/about.html`, jobTitle: "Independent iOS and macOS Developer", sameAs: ["https://apps.apple.com/us/developer/bo-chen/id1321915789?uo=4"] };
const labels = {
  en: { home: "Home", apps: "Apps", tools: "Free tools", guides: "Guides", support: "Support", language: "中文", primary: "Primary", breadcrumb: "Breadcrumb", updated: "Published and updated", date: "October 24, 2026", privacy: "Privacy", about: "About", toolAction: "Open the tool", faq: "Common questions", image: "Image compressor and resizer", gif: "GIF maker and resizer", taskGuides: "Practical guides", source: "Technical reference", related: "Continue with a related task", app: "When you need an app", openApp: "Explore the app", toolsNotice: "Selected media stays in this browser. Website and tool events can be measured; file names and media contents are excluded.", author: "Written by", noScript: "The tool needs JavaScript. The instructions and guides remain readable without it." },
  zh: { home: "首页", apps: "应用", tools: "免费工具", guides: "使用教程", support: "支持", language: "English", primary: "主导航", breadcrumb: "面包屑导航", updated: "发布与更新", date: "2026 年 10 月 24 日", privacy: "隐私", about: "关于", toolAction: "打开工具", faq: "常见问题", image: "图片压缩与尺寸调整", gif: "GIF 制作与缩小", taskGuides: "实用操作教程", source: "技术参考", related: "继续完成相关任务", app: "需要应用时", openApp: "了解应用", toolsNotice: "所选媒体只在当前浏览器处理。网站可能统计页面和工具操作，不包含文件名或媒体内容。", author: "作者", noScript: "工具需要启用 JavaScript；操作说明和教程仍可直接阅读。" }
};
labels.en.ride = "Cycling speed, time and distance calculator";
labels.zh.ride = "骑行速度、时间与距离计算器";
function dates(config) {
  const published = config.datePublished || freeToolsDate;
  const modified = config.dateModified || published;
  const [year, month, day] = modified.split("-").map(Number);
  return { published, modified, label: config.locale === "zh" ? `${year} 年 ${month} 月 ${day} 日` : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(new Date(`${modified}T12:00:00Z`)) };
}

function nav(config) {
  const t = labels[config.locale];
  const home = config.locale === "zh" ? "zh-cn.html" : "/";
  const other = freeToolsPairs[config.key][config.locale === "en" ? "zh" : "en"];
  const language = config.locale === "en" ? "zh-CN" : "en";
  return `<header class="site-header" data-elevate><nav class="nav" aria-label="${t.primary}"><a class="brand" href="${home}" aria-label="CrazyAIAgent ${t.home}"><span class="brand-mark" aria-hidden="true">CA</span><span>CrazyAIAgent</span></a><div class="nav-links"><a href="${home}">${t.home}</a><a href="apps.html">${t.apps}</a><a href="${freeToolsPairs.hub[config.locale]}"${config.key === "hub" ? ' aria-current="page"' : ""}>${t.tools}</a><a href="guides.html">${t.guides}</a><a href="support.html">${t.support}</a><a href="${other}" lang="${language}">${t.language}</a></div><a class="nav-cta" href="${config.key === "hub" ? "#choose-tool" : freeToolsPairs.hub[config.locale]}">${t.tools}</a></nav></header>`;
}
function footer(config) {
  const t = labels[config.locale];
  return `<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="${config.locale === "zh" ? "zh-cn.html" : "/"}">${t.home}</a><a href="${freeToolsPairs.hub[config.locale]}">${t.tools}</a><a href="apps.html">${t.apps}</a><a href="guides.html">${t.guides}</a><a href="about.html">${t.about}</a><a href="privacy.html#free-tools">${t.privacy}</a><a href="support.html">${t.support}</a><a href="${freeToolsPairs[config.key][config.locale === "en" ? "zh" : "en"]}" lang="${config.locale === "en" ? "zh-CN" : "en"}">${t.language}</a></div></div></footer>`;
}
function breadcrumb(config) {
  const t = labels[config.locale];
  const items = [{ name: t.home, item: config.locale === "zh" ? `${origin}/zh-cn.html` : `${origin}/` }];
  if (config.key !== "hub") items.push({ name: t.tools, item: `${origin}/${freeToolsPairs.hub[config.locale]}` });
  items.push({ name: config.title.replace(/ \| CrazyAIAgent$/, ""), item: `${origin}/${freeToolFile(config)}` });
  return items;
}
function hero(config, isArticle = false) {
  const t = labels[config.locale];
  const date = dates(config);
  const crumbs = breadcrumb(config);
  return `<section class="page-hero tool-intro"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="${t.breadcrumb}"><ol>${crumbs.map((item, i) => `<li${i === crumbs.length - 1 ? ' aria-current="page"' : ""}>${i === crumbs.length - 1 ? escape(item.name) : `<a href="${item.item === `${origin}/` ? "/" : item.item.slice(origin.length + 1)}">${escape(item.name)}</a>`}</li>`).join("")}</ol></nav><p class="eyebrow">${escape(config.eyebrow ?? (config.locale === "en" ? "A practical file workflow" : "实用文件处理教程"))}</p><h1>${escape(config.heading)}</h1><p class="hero-summary">${escape(config.summary)}</p>${isArticle ? `<p class="article-meta">${t.author} <a href="about.html" rel="author">Bo Chen</a> · ${t.updated} <time datetime="${date.modified}">${date.label}</time></p><div class="hero-actions"><a class="button button-primary" href="${freeToolsPairs[config.kind][config.locale]}">${t.toolAction}</a></div>` : ""}</div></section>`;
}
function guideCards(locale, kind = null, exclude = "") {
  return freeToolArticles.filter((item) => item.locale === locale && (!kind || item.kind === kind) && item.key !== exclude).map((item) => `<article class="tool-card"><h3><a href="${freeToolFile(item)}">${escape(item.heading)}</a></h3><p>${escape(item.description)}</p></article>`).join("");
}
function relatedGuides(config, kind = null, exclude = "") {
  const t = labels[config.locale];
  if (!freeToolArticles.some((item) => item.locale === config.locale && (!kind || item.kind === kind) && item.key !== exclude)) return "";
  return `<section class="section content-section alt-section"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${t.taskGuides}</p><h2>${t.related}</h2></div></div><div class="tool-card-grid">${guideCards(config.locale, kind, exclude)}</div></div></section>`;
}
function appSection(config, kind) {
  const zh = config.locale === "zh";
  if (kind === "ride") return `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${labels[config.locale].app}</p><h2>${zh ? "计算之后，用实际骑行记录核对。" : "Compare your estimate with a recorded ride."}</h2><p>${zh ? "计算器使用你填写的距离、时间和速度。需要在 iPhone 上记录实际骑行时，可了解 HappyRide 的自动记录流程，再按同样的时间口径比较。应用功能、价格和设备要求请查看当前介绍与商店页面。" : "The calculator uses the distance, time and speed you enter. For actual iPhone ride recording, explore HappyRide’s automatic tracking workflow, then compare values using the same time definition. Check the current product and App Store pages for features, price and device requirements."}</p></div><div class="content-list"><div><strong>HappyRide</strong><p><a href="${zh ? "happyride-auto-ride-tracker-cn.html" : "happyride-auto-ride-tracker.html"}">${zh ? "查看快乐轻骑应用介绍" : "Explore the HappyRide app"}</a></p></div><div><strong>${zh ? "了解记录方式" : "Understand the recording workflow"}</strong><p><a href="automatic-bike-ride-tracker-iphone.html"${zh ? ' lang="en" hreflang="en"' : ""}>${zh ? "阅读 iPhone 自动骑行记录教程（英文）" : "Read the iPhone automatic ride-tracking guide"}</a></p></div></div></div></section>`;
  if (kind === "gif") return `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${labels[config.locale].app}</p><h2>${zh ? "在 iPhone 上继续编辑素材。" : "Continue editing on iPhone."}</h2><p>${zh ? "网页适合快速处理本地文件。需要实况照片、逐帧时长、文字与画布编辑时，可查看 GIFmaker 的应用介绍；商店价格和设备要求请以当前购买页面为准。" : "The browser tool handles quick local file tasks. For Live Photos, per-frame timing, captions, and canvas editing, explore the GIFmaker app. Check its current App Store listing for price and device requirements."}</p></div><div class="content-list"><div><strong>GIFmaker</strong><p><a href="${zh ? "gif-maker-cn.html" : "gif-maker.html"}">${zh ? "查看 iPhone GIF 应用" : "Explore the iPhone GIF app"}</a></p></div><div><strong>${zh ? "保留原始素材" : "Keep your source media"}</strong><p>${zh ? "网页导出是独立副本，不替换原图、视频或现有动图。" : "A browser export is a separate copy, leaving your original images, video, or animation intact."}</p></div></div></div></section>`;
  return `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${labels[config.locale].app}</p><h2>${zh ? "处理一张图片，或整理整个相册。" : "Prepare one picture, or organize a photo library."}</h2><p>${zh ? "图片工具解决文件尺寸与格式问题。需要复查重复照片、相似画面或分类时，可了解 AI Cleaning；需要双摄拍摄与创作时，可查看 TwoPic。网页不会扫描你的相册。" : "This tool prepares a selected file. For duplicate review, similar pictures, and photo categories, explore AI Cleaning. For dual-camera capture and creation, explore TwoPic. The webpage does not scan your photo library."}</p></div><div class="content-list"><div><strong>AI Cleaning</strong><p><a href="${zh ? "iphone-photo-cleaner-cn.html" : "iphone-photo-cleaner.html"}">${zh ? "查看照片整理应用" : "Explore photo library organization"}</a></p></div><div><strong>TwoPic</strong><p><a href="twopic-dual-camera.html">${zh ? "查看双摄应用（英文介绍）" : "Explore dual-camera creation"}</a></p></div></div></div></section>`;
}
function faqSection(config) {
  const t = labels[config.locale];
  return `<section class="section faq"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">${t.faq}</p><h2>${config.locale === "zh" ? "使用之前，先了解这些边界。" : "Know what the tool can and cannot do."}</h2></div></div><div class="faq-list">${config.faqs.map(([question, answer], index) => `<details${index === 0 ? " open" : ""}><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join("")}</div></div></section>`;
}
function toolExplanation(config) {
  const zh = config.locale === "zh";
  if (config.key === "ride") return `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${zh ? "怎样使用" : "How to use it"}</p><h2>${zh ? "骑行时间与休息分开填，单位保持一致。" : "Keep moving time and breaks separate, with matching units."}</h2><p>${zh ? "均速 = 距离 ÷ 时间，骑行时间 = 距离 ÷ 骑行均速，距离 = 骑行均速 × 骑行时间。计算单位为小时，表单可用时、分、秒输入；休息只计入全程时长与全程均速。" : "Average speed = distance ÷ time; moving time = distance ÷ moving average speed; distance = moving average speed × moving time. The formulas use hours; the form accepts hours, minutes and seconds. Breaks affect total duration and overall average only."}</p><p>${zh ? "结果取决于所填假设，不包含道路、坡度或交通预测。输入与结果只在当前浏览器计算，不保存或上传具体数值。网站统计可记录工具、模式与单位。" : "The estimate depends on your assumptions; it does not model roads, gradients or traffic. Inputs and results are calculated in this browser, without saving or uploading the numerical values. Website analytics can record the tool, mode and unit."}</p></div><ol class="content-list">${(zh ? ["选择计算速度、时间或距离，再选择公里或英里。", "填写另外两个已知量；时间栏填写移动时间，分和秒为 0 到 59。", "按需加入休息分钟，点击计算，核对骑行与全程结果。", "修改假设后重新计算，也可用示例复核公式；更换单位会换算同一行程。"] : ["Choose speed, time or distance, then choose kilometres or miles.", "Enter the other two known quantities. Time fields are moving time; minutes and seconds run from 0 to 59.", "Add optional break minutes, calculate, and compare moving and total results.", "Recalculate after editing an assumption, or use the example to check the formulas. Changing units converts the same trip."]).map((step) => `<li><p>${escape(step)}</p></li>`).join("")}</ol></div></section>`;
  const image = config.key === "image";
  const heading = image ? (zh ? "先选尺寸与格式，再判断处理结果。" : "Choose dimensions and format, then judge the result.") : (zh ? "按素材类型开始，生成后检查原文件。" : "Start with the right input type, then check the saved file.");
  const steps = image ? (zh ? ["选择一张 JPEG、PNG 或 WebP 静态图片。", "设置宽度或高度，保持原始比例；选择输出格式和适用的质量设置。", "生成后对比原图与结果的像素、字节数和预览。", "下载满意的版本，保留原图。"] : ["Choose one still JPEG, PNG, or WebP picture.", "Set the width or height while keeping its aspect ratio. Choose an output format and applicable quality setting.", "Create the image and compare dimensions, actual bytes, and the visual preview.", "Download an acceptable version and keep the original."]) : (zh ? ["选择照片、视频或已有 GIF 模式，再导入本地素材。", "照片可调整顺序与统一间隔；视频选择片段和采样帧率；已有 GIF 选择保留帧的间隔。", "设置输出最长边，生成后检查预览与文件大小。", "下载 GIF，并在目标平台确认播放效果。"] : ["Choose photos, video, or existing-GIF mode before selecting local media.", "Arrange photos and choose a uniform delay; set a video interval and sample rate; or choose a frame-retention interval for an existing GIF.", "Choose the output maximum side, generate the animation, and inspect its preview and actual file size.", "Download the GIF and confirm playback in its destination."]);
  const note = image ? (zh ? "每次处理一张不超过 20 MiB、2000 万像素的图片。输出最长边不超过 4096 像素，不放大原图。元数据不复制，JPEG 透明部分铺白底。" : "One input at a time, up to 20 MiB and 20 megapixels. Output is limited to 4096 pixels per side without enlarging the original. Source metadata is not copied, and JPEG uses white behind transparent areas.") : (zh ? "最多 20 张照片、80 帧输出，最长边不超过 640 像素；视频选段不超过 15 秒。源 GIF 有额外解码限制，过大文件会拒绝处理。输出持续循环，铺白底，不含音频；不保证重新编码后更小。" : "Up to 20 photos, 80 output frames, and a 640-pixel maximum side; video selections are limited to 15 seconds. Source GIFs have additional decode limits and large files are rejected. Output loops continuously, uses a white background, and has no audio. Re-encoding may increase size.");
  return `<section class="section content-section"><div class="section-inner content-grid"><div><p class="section-kicker">${zh ? "怎样使用" : "How to use it"}</p><h2>${heading}</h2><p>${note}</p></div><ol class="content-list">${steps.map((step) => `<li><p>${escape(step)}</p></li>`).join("")}</ol></div></section>`;
}
function hubBody(config) {
  const zh = config.locale === "zh";
  const toolItems = freeToolPages.filter((item) => item.locale === config.locale && item.key !== "hub");
  return `${hero(config)}<section class="section content-section" id="choose-tool"><div class="section-inner"><div class="tool-card-grid">${toolItems.map((item) => `<article class="tool-card"><p class="section-kicker">${escape(item.eyebrow)}</p><h2><a href="${freeToolFile(item)}">${escape(labels[config.locale][item.key])}</a></h2><p>${escape(item.summary)}</p><a class="button button-primary" href="${freeToolFile(item)}">${labels[config.locale].toolAction}</a></article>`).join("")}</div></div></section><section class="section content-section alt-section"><div class="section-inner content-grid"><div><p class="section-kicker">${zh ? "选择适合任务的工具" : "Choose by task"}</p><h2>${zh ? "处理文件或计算行程，核对后再使用。" : "Prepare a file or calculate a trip, then check the result."}</h2><p>${zh ? "图片、视频与动图在当前浏览器处理；骑行数字也在本地计算，不保存或上传具体输入与结果。网页仍使用网站统计，工具事件不包含文件内容、文件名或骑行数值。" : "Images, video and GIFs are processed in this browser. Cycling numbers are calculated locally without saving or uploading numerical inputs or results. Website analytics remain active; tool events exclude file contents, file names and cycling values."}</p><p>${zh ? "无需账号或支付。网页本身需要网络加载；媒体处理能力取决于浏览器、设备内存和文件编码。骑行工具根据所填假设计算，不能预测实际路况或到达时间，请检查各工具显示的范围。" : "No account or payment is needed. Loading the page uses the network; media processing depends on your browser, memory and file encoding. Cycling results depend on entered assumptions rather than predicted road conditions or arrival times. Check the limits shown in each tool."}</p></div><div class="content-list"><div><strong>${zh ? "缩小单张图片" : "Prepare one smaller image"}</strong><p>${zh ? "调整尺寸与输出格式，比较像素、字节和预览。下载独立副本，保留原图。" : "Adjust dimensions and output format, then compare pixels, bytes and the preview. Download a separate copy and keep the original."}</p></div><div><strong>${zh ? "制作或缩小 GIF" : "Make or resize an animation"}</strong><p>${zh ? "用图片、受支持的视频或现有 GIF 生成动图，检查帧数、播放效果和实际文件大小。" : "Use pictures, a supported video or an existing GIF. Check frames, playback and the actual saved file size."}</p></div><div><strong>${zh ? "互算骑行距离、时间与速度" : "Calculate cycling distance, time and speed"}</strong><p>${zh ? "填写两个已知量，选择公里或英里，再单独加入休息，比较骑行与全程结果。" : "Enter two known quantities, choose kilometres or miles, and add breaks separately to compare moving and overall results."}</p></div></div></div></section>${relatedGuides(config)}`;
}
function articleBody(config) {
  const t = labels[config.locale];
  return `${hero(config, true)}<article class="tool-article-body">${config.sections.map((section, i) => `<section class="section content-section${i % 2 ? " alt-section" : ""}"><div class="section-inner"><h2>${escape(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}${section.steps ? `<ol>${section.steps.map((step) => `<li>${escape(step)}</li>`).join("")}</ol>` : ""}</div></section>`).join("")}<section class="section content-section"><div class="section-inner"><h2>${t.source}</h2><ul>${config.sources.map((source) => `<li><a href="${source.href}">${escape(source[config.locale])}</a></li>`).join("")}</ul><p><a class="button button-primary" href="${freeToolsPairs[config.kind][config.locale]}">${t.toolAction}</a></p></div></section></article>${appSection(config, config.kind)}${relatedGuides(config, config.kind, config.key)}`;
}
function schemas(config, isArticle) {
  const url = `${origin}/${freeToolFile(config)}`;
  const language = config.locale === "zh" ? "zh-CN" : "en";
  const date = dates(config);
  const page = { "@type": config.key === "hub" ? "CollectionPage" : "WebPage", "@id": `${url}#page`, url, name: config.title, description: config.description, inLanguage: language, datePublished: date.published, dateModified: date.modified, isPartOf: { "@id": `${origin}/#website` }, publisher: { "@id": publisher["@id"] }, author: { "@id": author["@id"] }, primaryImageOfPage: { "@type": "ImageObject", url: `${origin}/assets/og-default.png`, width: 1200, height: 630 } };
  const crumbs = breadcrumb(config);
  const nodes = [page, { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, name: crumbs.at(-1).name, numberOfItems: crumbs.length, itemListElement: crumbs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.item })) }];
  if (isArticle) {
    page.mainEntity = { "@id": `${url}#article` };
    nodes.push({ "@type": "Article", "@id": `${url}#article`, headline: config.heading, description: config.description, image: `${origin}/assets/og-default.png`, inLanguage: language, datePublished: date.published, dateModified: date.modified, mainEntityOfPage: url, isPartOf: { "@id": `${origin}/#website` }, author, publisher, keywords: config.keywords, about: [{ "@type": "SoftwareApplication", name: config.kind === "ride" ? "HappyRide: Auto Ride Tracker" : config.kind === "gif" ? "GIFmaker-Gif Studio" : "AI Cleaning - Photo Cleaner", url: config.kind === "ride" ? "https://apps.apple.com/us/app/happyride-auto-ride-tracker/id6786365305?uo=4" : config.kind === "gif" ? "https://apps.apple.com/us/app/gifmaker-gif-studio/id6783559364?uo=4" : "https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606?uo=4" }] });
  } else if (config.key === "hub") {
    const keys = freeToolPages.filter((item) => item.locale === config.locale && item.key !== "hub").map((item) => item.key);
    nodes.push({ "@type": "ItemList", "@id": `${url}#tools`, name: labels[config.locale].tools, numberOfItems: keys.length, itemListElement: keys.map((key, index) => ({ "@type": "ListItem", position: index + 1, name: labels[config.locale][key], item: `${origin}/${freeToolsPairs[key][config.locale]}` })) });
    page.mainEntity = { "@id": `${url}#tools` };
  } else {
    page.mainEntity = { "@id": `${url}#tool` };
    nodes.push({ "@type": "WebApplication", "@id": `${url}#tool`, name: labels[config.locale][config.key], url, description: config.description, applicationCategory: config.key === "ride" ? "UtilitiesApplication" : "MultimediaApplication", operatingSystem: "Web browser", browserRequirements: config.key === "ride" ? "Requires JavaScript" : "Requires JavaScript and compatible browser media APIs", inLanguage: language, isAccessibleForFree: true, creator: { "@id": author["@id"] }, provider: { "@id": publisher["@id"] } });
    nodes.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: config.faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) });
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}
async function renderPage(config, assets) {
  const isArticle = Array.isArray(config.sections);
  const date = dates(config);
  const zh = config.locale === "zh";
  const language = zh ? "zh-CN" : "en";
  const locale = zh ? "zh_CN" : "en_US";
  const url = `${origin}/${freeToolFile(config)}`;
  const script = (file, attrs = " defer") => `<script src="${file}?v=${assets[file]}"${attrs}></script>`;
  const body = isArticle ? articleBody(config) : config.key === "hub" ? hubBody(config) : `${hero(config)}<div class="section-inner tool-stage">${config.key === "ride" ? renderRideToolWidget(language) : config.key === "image" ? renderImageToolWidget(language) : renderGifToolWidget(language)}</div>${toolExplanation(config)}${faqSection(config)}${appSection(config, config.key)}${relatedGuides(config, config.key)}`;
  const csp = "default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' https: data: blob:; media-src 'self' blob:; script-src 'self' https://www.googletagmanager.com; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com; form-action 'none'; upgrade-insecure-requests";
  return `<!doctype html><html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${csp}"><link rel="preconnect" href="https://www.googletagmanager.com">${script("analytics.js", "")}<script async fetchpriority="low" src="https://www.googletagmanager.com/gtag/js?id=G-JY8T5JJGNH"></script><title>${escape(config.title)}</title><meta name="description" content="${escape(config.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#6d28d9"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="en" href="${origin}/${freeToolsPairs[config.key].en}"><link rel="alternate" hreflang="zh-CN" href="${origin}/${freeToolsPairs[config.key].zh}"><link rel="alternate" hreflang="x-default" href="${origin}/${freeToolsPairs[config.key].en}"><link rel="alternate" type="application/rss+xml" title="CrazyAIAgent RSS" href="${origin}/feed.xml"><link rel="alternate" type="application/atom+xml" title="CrazyAIAgent Atom" href="${origin}/atom.xml"><meta property="og:type" content="${isArticle ? "article" : "website"}"><meta property="og:locale" content="${locale}"><meta property="og:locale:alternate" content="${zh ? "en_US" : "zh_CN"}"><meta property="og:url" content="${url}"><meta property="og:title" content="${escape(config.title)}"><meta property="og:site_name" content="CrazyAIAgent"><meta property="og:description" content="${escape(config.description)}"><meta property="og:image" content="${origin}/assets/og-default.png"><meta property="og:image:secure_url" content="${origin}/assets/og-default.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${zh ? "CrazyAIAgent 免费浏览器工具与操作教程" : "CrazyAIAgent free browser tools and practical guides"}">${isArticle ? `<meta property="article:published_time" content="${date.published}"><meta property="article:modified_time" content="${date.modified}"><meta property="article:author" content="${origin}/about.html">` : ""}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(config.title)}"><meta name="twitter:description" content="${escape(config.description)}"><meta name="twitter:image" content="${origin}/assets/og-default.png"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="manifest.webmanifest"><link rel="stylesheet" href="styles.css?v=${assets["styles.css"]}"><script type="application/ld+json">${json(schemas(config, isArticle))}</script></head><body class="tool-page${isArticle ? " tool-guide-page" : ""}">${nav(config)}<main class="page-main">${body}</main>${footer(config)}${!isArticle && config.key === "image" ? script("image-tool.js") : ""}${!isArticle && config.key === "gif" ? script("gif-codec.js") + script("gif-tool.js") : ""}${!isArticle && config.key === "ride" ? script("ride-tool.js") : ""}${script("script.js")}</body></html>\n`;
}

export async function buildFreeToolsPages({ siteDir = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : defaultSiteDir } = {}) {
  const files = ["styles.css", "analytics.js", "script.js", "image-tool.js", "gif-codec.js", "gif-tool.js", "ride-tool.js"];
  const assets = {};
  for (const file of files) assets[file] = createHash("sha256").update(await readFile(path.join(siteDir, file))).digest("hex").slice(0, 12);
  const written = [];
  for (const config of [...freeToolPages, ...freeToolArticles]) {
    const file = freeToolFile(config);
    await writeFile(path.join(siteDir, file), await renderPage(config, assets));
    written.push(file);
  }
  return written;
}

if (process.argv[1] && path.resolve(process.argv[1]) === moduleFile) {
  const files = await buildFreeToolsPages();
  process.stdout.write(`Built ${files.length} free tool and guide pages.\n`);
}
