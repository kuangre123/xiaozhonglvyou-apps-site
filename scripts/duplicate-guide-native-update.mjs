import { articleUpdateDate } from "./article-update-date.mjs";

const files = ["duplicate-photo-cleaner-guide.html", "duplicate-photo-cleaner-cn.html"];
const mergeSource = "https://support.apple.com/guide/iphone/merge-duplicate-photos-and-videos-iph1978d9c23/ios";
const missingSource = "https://support.apple.com/en-hk/102260";
const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;

export function updateDuplicateGuide(html, file) {
  if (!files.includes(file)) throw new Error("Expected a duplicate photo guide");
  const zh = file.endsWith("-cn.html");
  const title = zh ? "iPhone 重复照片怎么删除：系统合并与重复项目不显示" : "Remove Duplicate Photos on iPhone: Merge & Missing Album";
  const description = zh ? "用 iPhone 自带照片 App 免费合并重复照片，按系统版本找到入口并核对要保留的原件；了解重复项目不显示的原因、充电锁屏检测、等待时间，以及相似照片如何分组复查和云端同步的注意事项。" : "Use Apple Photos to merge duplicate pictures for free. Find Duplicates, learn why the album may be missing, and review similar photos separately.";
  const escape = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`);
  for (const [attribute, name, value] of [["name", "description", description], ["property", "og:title", title], ["property", "og:description", description], ["name", "twitter:title", title], ["name", "twitter:description", description]]) {
    const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}="${name}")[^>]*>`, "i");
    html = html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/, `content="${escape(value)}"`));
  }
  const hero = /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/;
  html = html.replace(hero, (section) => {
    if (zh) section = section.replace(/<h1>[\s\S]*?<\/h1>/, "<h1>先用 iPhone 自带照片合并重复项目。</h1>").replace(/(<\/h1>)<p>[\s\S]*?<\/p>/, '$1<p>打开“照片”，在“实用工具”中找到“重复项目”，复查后点击“合并”。当前系统可从“精选集”进入，旧版本入口可能在“相簿”。找不到这个集合时，先检查系统是否已完成重复项检测。</p>');
    section = section.replace(/<a\b[^>]*data-native-duplicates-cta[^>]*>[\s\S]*?<\/a>\s*/g, "");
    section = section.replace(/(<div class="hero-actions"[^>]*>)/, `$1<a class="button button-primary" data-native-duplicates-cta href="#native-duplicates">${zh ? "查看系统合并步骤" : "Use the free Photos method"}</a> `);
    // The tutorial's first action should reach the instructions on this page.
    section = section.replace(/class="button button-primary"(?=[^>]*href="https:\/\/apps.apple.com)/g, 'class="button button-secondary"');
    return section;
  });
  const body = zh
    ? `<div><h3>系统合并步骤</h3><ol><li>打开“照片”，进入“精选集”，向下找到“实用工具”中的“重复项目”。旧版照片布局可能从“相簿”进入“实用工具”。</li><li>打开一组重复照片或视频，核对内容，再点击“合并”并确认。</li><li>系统保留质量最高的版本并合并相关数据，其余副本移入“最近删除”。相似但不同的构图仍需单独复查。</li></ol><p>${link(mergeSource, "Apple 官方合并说明")}。合并前检查 iCloud 照片同步及要保留的原件；这一步不需要安装清理应用。</p></div><div id="duplicates-not-showing"><h3>找不到“重复项目”？</h3><p>该功能从 iOS 16 开始提供。“照片”需要先索引图库，再识别重复项；检测时让 iPhone 锁屏并连接电源。图库大小和后台任务会影响耗时，可能需要几天。没有识别到重复项目时，这个集合不会出现。</p><p>等待不代表系统一定会把连拍或相似构图识别为重复项。先给系统时间，再按组复查仍需整理的照片。${link(missingSource, "Apple：无法找到重复项目时怎么办")}</p></div>`
    : `<div><h3>Merge in Apple Photos first</h3><ol><li>Open Photos, then Collections. Under Utilities, open Duplicates. Older Photos layouts may place Utilities under Albums.</li><li>Review a group, select Merge, then confirm. Photos combines the highest-quality version and relevant data; other copies move to Recently Deleted.</li><li>Review similar shots separately: a different expression or crop can be worth keeping.</li></ol><p>${link(mergeSource, "Apple's current merge instructions")}. No cleaner installation is required. Check your originals and iCloud Photos synchronization before confirming changes.</p></div><div id="duplicates-not-showing"><h3>Duplicates not showing on iPhone?</h3><p>Detection is available starting with iOS 16. Photos first indexes the library, then identifies duplicates while the iPhone is locked and connected to power. Library size and background work affect the wait; it may take a few days. The collection does not appear until duplicates have been identified.</p><p>Waiting does not guarantee that similar shots will be classified as duplicates. See ${link(missingSource, "Apple's missing Duplicates help")} before installing another cleaner just to find this collection.</p></div>`;
  html = html.replace(/<section\b[^>]*id="native-duplicates"[^>]*>[\s\S]*?<\/section>/g, "");
  const block = `<section class="section content-section" id="native-duplicates"><div class="section-inner content-grid"><div><p class="section-kicker">${zh ? "免费系统方法" : "Free built-in method"}</p><h2>${zh ? "合并重复照片，或排查为什么没有重复项目。" : "Merge duplicates, or find out why the collection is missing."}</h2><p><a href="#duplicates-not-showing">${zh ? "直接查看“不显示”排查" : "Jump to Duplicates not showing"}</a></p></div><div class="content-list">${body}</div></div></section>`;
  html = html.replace(hero, (section) => section + block);
  const updated = articleUpdateDate(html, "2026-10-28");
  html = updated.html;
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (["Article", "WebPage"].includes(node["@type"])) {
        node.dateModified = updated.date; node.description = description;
        if (node["@type"] === "Article") { node.headline = title; node.citation = [...new Set([...(node.citation || []), mergeSource, missingSource])]; }
        else node.name = title;
      }
      Object.values(node).forEach(visit);
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
}
