import { isMainSiteHtmlFile } from "./standalone-privacy-pages.mjs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { freeToolArticles, freeToolFile, freeToolsRoutes } from "./free-tools-content.mjs";
import { articleUpdateDate } from "./article-update-date.mjs";
import { updateDuplicateGuide } from "./duplicate-guide-native-update.mjs";

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.xiaozhonglvyou.com";
const date = "2026-10-24";
const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const section = (id, kicker, heading, body) => `<section class="section" id="${id}"><div class="section-inner"><div class="section-heading"><p class="section-kicker">${kicker}</p><h2>${heading}</h2></div>${body}</div></section>`;
function putSection(html, id, block) {
  const pattern = new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/section>`, "g");
  return html.replace(pattern, "").replace("</main>", `${block}</main>`);
}
const toolCards = (zh, includeRide = false) => `<div class="region-grid"><a class="region-card" href="image-compressor${zh ? "-cn" : ""}.html"><strong>${zh ? "图片压缩与缩放" : "Image compressor and resizer"}</strong><span>${zh ? "调整 JPEG、PNG、WebP 的像素和格式，比较实际体积后下载。" : "Change JPEG, PNG or WebP dimensions and format, compare actual bytes, then download."}</span></a><a class="region-card" href="gif-maker-online${zh ? "-cn" : ""}.html"><strong>${zh ? "GIF 制作与缩小" : "GIF maker and resizer"}</strong><span>${zh ? "用照片或短视频制作动图，也能缩小已有 GIF。" : "Make a GIF from photos or a short video, or resize an existing animation."}</span></a>${includeRide ? `<a class="region-card" href="cycling-speed-calculator${zh ? "-cn" : ""}.html"><strong>${zh ? "骑行速度、时间与距离计算器" : "Cycling speed, time and distance calculator"}</strong><span>${zh ? "公里或英里互算，分别查看骑行时间与含休息的总时间。" : "Calculate in kilometers or miles, with moving time and total time including breaks."}</span></a>` : ""}<a class="region-card" href="tools${zh ? "-cn" : ""}.html"><strong>${zh ? "全部免费工具与教程" : "All free tools and guides"}</strong><span>${zh ? "文件与数值在当前浏览器处理，无需注册；统计不含文件内容或计算输入。" : "Files and calculations stay in this browser without an account; analytics exclude file contents and calculation inputs."}</span></a></div>`;
const guideCards = `<div class="region-grid">${freeToolArticles.map((article) => `<a class="region-card" href="${freeToolFile(article)}" hreflang="${article.locale === "zh" ? "zh-CN" : "en"}" lang="${article.locale === "zh" ? "zh-CN" : "en"}"><strong>${escape(article.title)}</strong><span>${escape(article.summary)}</span></a>`).join("")}</div>`;
const compression = (zh) => section("compression-vs-duplicates", zh ? "按任务选择" : "Choose the right task", zh ? "压缩照片与清理重复照片，解决的是两件事。" : "Compression and duplicate cleanup solve different problems.", zh
  ? `<div class="content-list"><div><strong>需要发送一张更小的图片</strong><p>打开<a href="image-compressor-cn.html">图片压缩与缩放工具</a>，导入单张 JPEG、PNG 或 WebP，调整尺寸、格式和有损质量。下载的是另一个副本；网页不会遍历图库，也不会删除原图。</p></div><div><strong>需要整理图库中的重复项目</strong><p>先复查系统检测到的重复照片，再检查相似照片的日期、构图和用途。批量删除之前保留需要的原件，并检查云端同步的影响。图片压缩不会判断两张照片是否重复。</p></div><div><strong>两项任务都需要时</strong><p>先确定要保留哪张原图，再对分享副本做压缩。比较处理前后的像素与实际文件大小，在正常显示尺寸检查文字、人脸和细节；新文件并不保证更小。阅读<a href="image-resize-vs-compress-guide-cn.html">缩放与压缩的区别</a>和<a href="jpeg-png-webp-guide-cn.html">格式选择方法</a>。</p></div></div>`
  : `<div class="content-list"><div><strong>You need one smaller file to send</strong><p>Use the <a href="image-compressor.html">image compressor and resizer</a> for a single JPEG, PNG or WebP. Adjust dimensions, format and supported lossy quality, then save a separate copy. The browser tool does not scan a photo library or delete originals.</p></div><div><strong>You need fewer repeated items in a library</strong><p>Review detected duplicates, then compare similar pictures by date, framing and purpose. Keep the original you need and consider cloud synchronization before deleting. Compression cannot decide whether two pictures are duplicates.</p></div><div><strong>You need both</strong><p>Decide which original to keep first, then compress a sharing copy. Compare dimensions and actual bytes, and inspect text, faces and detail at normal display size. A new export is not guaranteed to be smaller. See <a href="image-resize-vs-compress-guide.html">resize versus compression</a> and the <a href="jpeg-png-webp-guide.html">image format guide</a>.</p></div></div>`);
const menu = (zh) => section("menu-photo-quality-check", zh ? "拍照与核对" : "Capture and verify", zh ? "先拍清文字，再核对 OCR 和译文。" : "Capture readable text, then verify OCR and translation.", zh
  ? `<div class="content-list"><div><strong>先改善拍摄条件</strong><p>让菜单平整、镜头与文字尽量平行，避开反光和阴影。长菜单分区域拍摄，保留菜名、配料和价格的上下文。查看原图放大后是否仍能分辨字符；模糊照片不能靠压缩变清晰。</p></div><div><strong>传输需要时再缩小副本</strong><p>原图过大时，可用<a href="image-compressor-cn.html">图片工具</a>另存一份。先裁剪到有用区域（需要使用照片编辑器），再谨慎缩放；本工具只调整尺寸和格式。对比小字与标点，不要为了更小而损失可读性。</p></div><div><strong>把识别与翻译分开检查</strong><p>先对照照片检查 OCR 的行序、数字和菜名，再查看译文。对不确定的配料或食物限制，向店员确认，不依赖自动译文作保证。这里的网页图片工具不执行 OCR；具体翻译请使用实际支持拍照或文字输入的翻译应用。<a href="voice-camera-translator-guide.html" hreflang="en" lang="en">Read the iPhone menu translation guide in English</a>。</p></div></div>`
  : `<div class="content-list"><div><strong>Improve the capture first</strong><p>Keep the menu flat and the camera nearly parallel to its text. Avoid glare and shadows. Photograph long menus in sections while keeping dish names, ingredients and prices together. Enlarge the original and check individual characters; compression cannot restore blurred writing.</p></div><div><strong>Resize a copy only when transfer requires it</strong><p>If a large file needs a smaller sharing copy, try the <a href="image-compressor.html">image tool</a>. Crop irrelevant surroundings in your photo editor first; this browser tool changes size and format rather than cropping. Compare small letters and punctuation after export. Keep the original when the reduced copy loses readable detail.</p></div><div><strong>Check recognition separately from translation</strong><p>Compare OCR line order, numbers and dish names against the photograph before reading the translation. Ask staff about uncertain ingredients or dietary requirements. The web image tool does not perform OCR or translation; choose the camera, saved-photo or typed-text route described above in an app that supports it.</p></div></div>`);
function refreshArticle(html, updateDate = true, modifiedDate = date) {
  if (updateDate) {
    ({ html, date: modifiedDate } = articleUpdateDate(html, modifiedDate));
  }
  const text = (html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const parsed = JSON.parse(json);
    const visit = (value) => { if (!value || typeof value !== "object") return; if (updateDate && ["Article", "WebPage", "CollectionPage"].includes(value["@type"])) value.dateModified = modifiedDate; if ([value["@type"]].flat().includes("Article")) { if (typeof value.wordCount === "number") value.wordCount = text.split(/\s+/).length; } for (const child of Object.values(value)) if (child && typeof child === "object") Array.isArray(child) ? child.forEach(visit) : visit(child); };
    visit(parsed);
    return open + JSON.stringify(parsed) + close;
  });
}
let updated = 0;
for (const file of (await readdir(siteDir)).filter((f) => isMainSiteHtmlFile(f) && f !== "404.html")) {
  const filePath = path.join(siteDir, file);
  const before = await readFile(filePath, "utf8");
  let html = before;
  const zh = /<html\b[^>]*lang="zh/i.test(html);
  const label = zh ? "免费工具" : "Free tools";
  const nav = `<a href="tools${zh ? "-cn" : ""}.html" data-free-tools-nav${zh ? "" : ' lang="en" hreflang="en"'}>${label}</a>`;
  html = html.replace(/<a\b[^>]*data-free-tools-nav[^>]*>[\s\S]*?<\/a>\s*/g, "");
  if (!freeToolsRoutes.includes(file)) html = html.replace(/(<div class="nav-links">)/, `$1${nav} `);
  if (["index.html", "apps.html", "guides.html"].includes(file)) html = putSection(html, "browser-tools", section("browser-tools", "Try a task now", "Free tools for files and ride planning.", toolCards(false, true)));
  if (file === "guides.html") html = putSection(html, "file-task-guides", section("file-task-guides", "Practical workflows", "Prepare files, check results, and plan a ride with clear examples.", guideCards));
  if (file === "privacy.html") html = putSection(html, "free-tools", section("free-tools", "Browser tools", "Your selected files and calculation inputs stay on this device.", `<div class="content-list"><div><strong>Local media processing</strong><p>The image compressor and GIF maker decode and process files in the current browser. They do not upload selected pictures, videos, GIFs, file names or file contents. Downloads create separate copies and do not overwrite originals. Temporary object URLs are released when you clear files or leave the page.</p></div><div><strong>Local ride calculations</strong><p>The cycling calculator uses the distance, speed, moving time and break time entered in this browser. It does not save these inputs to local storage, send them to a server, or request location access. Changing an input clears the previous result.</p></div><div><strong>Website analytics</strong><p>The page still loads website resources and uses the analytics described above. Tool events may record the tool, action, format, frame count and output dimensions, but exclude file names and media contents. Cycling events include only the tool, calculation mode and unit system, excluding entered and calculated distances, speeds and times. The tools require no account, camera, microphone or location access.</p></div><div><strong>Limits</strong><p>Browser memory and codec support affect which files can be processed. File and pixel limits appear beside each tool. This web workflow is separate from any native app’s access to an Apple photo library.</p></div></div>`));
  if (["duplicate-photo-cleaner-guide.html", "duplicate-photo-cleaner-cn.html"].includes(file)) html = refreshArticle(putSection(html, "compression-vs-duplicates", compression(zh)));
  if (["voice-camera-translator-guide.html", "travel-translator-cn.html"].includes(file)) html = refreshArticle(putSection(html, "menu-photo-quality-check", menu(zh)));
  if (["iphone-photo-cleaner.html", "iphone-photo-cleaner-cn.html", "gif-maker.html", "gif-maker-cn.html"].includes(file)) html = putSection(html, "browser-tools", section("browser-tools", zh ? "浏览器里直接试用" : "Try it in your browser", zh ? "先完成一个具体的文件处理任务。" : "Complete a file task before choosing an app.", toolCards(zh)));
  if (["happyride-auto-ride-tracker.html", "happyride-auto-ride-tracker-cn.html", "automatic-bike-ride-tracker-iphone.html"].includes(file)) {
    const rideBody = zh
      ? `<div class="content-list"><div><strong>先估算这次要骑多久</strong><p>用<a href="cycling-speed-calculator-cn.html">骑行速度、时间与距离计算器</a>输入任意两个已知量，查看第三个结果。支持公里与英里；休息时间单独输入，不会混入移动均速。比如 20 公里骑 1 小时，移动均速为 20 公里/小时；休息 15 分钟后，总耗时 1 小时 15 分钟，全程均速为 16 公里/小时。</p></div><div><strong>再核对实际行程</strong><p>计算器只按输入数值估算，不读取 GPS 或预测路况。实际距离、移动时间和停留时间会改变结果；骑行后请以活动记录为准。阅读<a href="cycling-time-distance-guide-cn.html">骑行时间与距离估算教程</a>，了解多段行程怎样汇总。</p></div></div>`
      : `<div class="content-list"><div><strong>Estimate the ride before you start</strong><p>Enter two known values in the <a href="cycling-speed-calculator.html">cycling speed, time and distance calculator</a> to find the third. Choose kilometers or miles, and keep breaks separate from moving time. A 20 km ride taking 1 hour has a moving average of 20 km/h; adding a 15-minute break makes total time 1 hour 15 minutes and the overall average 16 km/h.</p></div><div><strong>Compare the estimate with a recorded activity</strong><p>The calculator uses your inputs without GPS or road-condition prediction. Actual distance, moving time and stops can change the result. Check the recorded activity after riding, and read the <a href="cycling-time-distance-guide.html">cycling time and distance guide</a> for examples of combining ride segments.</p></div></div>`;
    html = refreshArticle(putSection(html, "ride-planning-tool", section("ride-planning-tool", zh ? "骑行前的估算" : "Plan a ride", zh ? "算出大约时间，再记录实际行程。" : "Estimate the time, then record the actual ride.", rideBody)), true, "2026-10-28");
  }
  if (file === "make-gif-on-iphone-guide.html") html = html.replace(/<section\b[^>]*id="browser-tools"[^>]*>[\s\S]*?<\/section>/g, "");
  if (file === "index.html") html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const parsed = JSON.parse(json); const nodes = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
    for (const node of nodes) if (node["@type"] === "SiteNavigationElement" && !node.itemListElement.some((item) => item.url === `${origin}/tools.html`)) node.itemListElement.push({ "@type": "SiteNavigationElement", name: "Free tools", url: `${origin}/tools.html` });
    return open + JSON.stringify(parsed) + close;
  });
  if (["duplicate-photo-cleaner-guide.html", "duplicate-photo-cleaner-cn.html"].includes(file)) html = updateDuplicateGuide(html, file);
  html = refreshArticle(html, false);
  if (html !== before) { await writeFile(filePath, html); updated += 1; }
}
console.log(`Integrated free tools into ${updated} existing pages.`);
