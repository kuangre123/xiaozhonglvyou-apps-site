import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gifmakerRelease as release } from "./gifmaker-release-facts.mjs";

const files = ["index.html", "gif-maker.html", "gif-maker-cn.html", "media-kit.html"];

export function updateGifmakerRelease(file, html) {
  const productPage = file === "gif-maker.html" || file === "gif-maker-cn.html";
  const chinese = file === "gif-maker-cn.html";
  if (productPage) {
    html = html
      .replaceAll("GIFmaker version 1.1.4", `GIFmaker version ${release.version}`)
      .replaceAll("GIFmaker 1.1.4", `GIFmaker ${release.version}`)
      .replaceAll("checked on October 2, 2026", "checked on October 8, 2026")
      .replaceAll("2026年10月2日核对", "2026年10月8日核对");
    const meta = chinese
      ? `版本 ${release.version} · 需要 iOS 17.0 或更高版本 · 更新于 <time datetime="${release.checkedDate}">2026 年 10 月 8 日</time>`
      : `Version ${release.version} · Requires iOS 17.0 or later · Updated <time datetime="${release.checkedDate}">October 8, 2026</time>`;
    const language = `<p class="article-meta" data-gifmaker-languages="${release.version}">${chinese
      ? "界面语言：英语、中文、日语、韩语、德语和西班牙语；当前未列出土耳其语。"
      : "Interface languages: English, Chinese, Japanese, Korean, German and Spanish. Turkish is not listed."}</p>`;
    const metaPattern = /<p class="article-meta">(?:Version|版本) [\s\S]*?<\/p>/;
    if (!metaPattern.test(html)) throw new Error(`${file}: missing GIFmaker release metadata`);
    html = html.replace(metaPattern, `<p class="article-meta">${meta}</p>`);
    const languagePattern = /<p class="article-meta" data-gifmaker-languages="[^"]+">[\s\S]*?<\/p>/;
    html = languagePattern.test(html)
      ? html.replace(languagePattern, language)
      : html.replace(metaPattern, (match) => match + language);
  } else if (file === "index.html") {
    const pattern = /(<p class="platform">)iOS 1\.1\.\d+(<\/p><h3>GIFmaker-Gif Studio<\/h3>)/;
    if (!pattern.test(html)) throw new Error("Homepage GIFmaker version label not found");
    html = html.replace(pattern, `$1iOS ${release.version}$2`);
  } else if (file === "media-kit.html") {
    const pattern = /(<div role="row"><span role="cell">\s*<a href="gif-maker\.html">[\s\S]*?<\/a>\s*<\/span>\s*<span role="cell">)[\s\S]*?(<\/span>)/;
    if (!pattern.test(html)) throw new Error("Media kit GIFmaker facts row not found");
    const facts = `Version ${release.version} · iOS 17.0+ · $0.99 upfront in the US · English, Chinese, Japanese, Korean, German and Spanish · checked October 8, 2026`;
    html = html.replace(pattern, (_match, open, close) => open + facts + close);
  }

  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (_match, open, json, close) => {
      const parsed = JSON.parse(json);
      const visit = (node) => {
        if (!node || typeof node !== "object") return;
        if (node["@type"] === "SoftwareApplication" && node.url?.includes(`/id${release.appId}`)) {
          node.softwareVersion = release.version;
          node.availableLanguage = release.languages;
        }
        if ((productPage && node["@type"] === "WebPage") || (file === "media-kit.html" && node["@type"] === "CollectionPage")) {
          node.dateModified = release.checkedDate;
        }
        Object.values(node).forEach(visit);
      };
      visit(parsed);
      return open + JSON.stringify(parsed).replaceAll("<", "\\u003c") + close;
    });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const site = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : path.resolve(import.meta.dirname, "..");
  for (const file of files) {
    const destination = path.join(site, file);
    const original = await readFile(destination, "utf8");
    const updated = updateGifmakerRelease(file, original);
    if (updated !== original) await writeFile(destination, updated, "utf8");
    console.log(`${updated === original ? "Verified" : "Updated"} ${file} GIFmaker release facts`);
  }
}
