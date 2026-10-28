import { articleUpdateDate } from "./article-update-date.mjs";

const canonical = "https://www.xiaozhonglvyou.com/iphone-storage-cleanup-guide.html";
const photoStorageSource = "https://support.apple.com/en-us/105061";
const iCloudSource = "https://support.apple.com/en-us/108782";
const description = "Free up iPhone photo storage: keep originals with Optimize Storage, merge duplicates, or shrink a sharing copy. Follow the right steps for your task.";

const taskSection = `<section class="section content-section" id="storage-task-choice"><div class="section-inner"><div class="section-heading"><p class="section-kicker">Choose your task</p><h2>Keep your photos, remove duplicates, or send a smaller file?</h2><p>These tasks change different things. Start with the one that matches the result you need.</p></div><div class="region-grid"><a class="region-card" href="#optimize-without-deleting"><strong>Keep every photo, use less iPhone space</strong><p>Use iCloud Photos and Optimize Storage when enough iCloud space is available. This changes local storage rather than deleting library items.</p></a><a class="region-card" href="duplicate-photo-cleaner-guide.html#native-duplicates"><strong>Merge duplicate photos</strong><p>Follow the built-in Photos steps and check each group before confirming a merge.</p></a><a class="region-card" href="image-compressor.html"><strong>Make one image smaller to send</strong><p>Resize or compress a JPEG, PNG or WebP in the free browser tool. Download a separate copy; it does not scan or clear your Photos library.</p></a></div><p>Missing the Duplicates collection? Read the <a href="duplicate-photo-cleaner-guide.html#duplicates-not-showing">locked-and-charging detection checklist</a>. To review videos and screenshots yourself, continue with the <a href="#free-steps">five free cleanup steps</a>.</p></div></section>`;

export const storageOptimizeCard = `<div id="optimize-without-deleting"><strong>Keep every photo, use less device space</strong><ol><li>Open Settings, tap your name, then iCloud, then Photos. Turn on Sync this iPhone if you want to use iCloud Photos.</li><li>In iOS 27 or later, tap iPhone Storage within these Photos settings, then choose Optimize iPhone Storage. In iOS 26 or earlier, choose Optimize Storage directly in Photos settings.</li><li>Check that your iCloud plan has room for the library and let uploads finish. iCloud storage is separate from the device capacity and may require a paid plan.</li></ol><p>Full-resolution originals stay in iCloud; iPhone keeps space-saving versions and downloads originals when needed. Optimization happens as device space is needed, so this is not an instant fixed-size cleanup. Access to an original that is not stored locally needs a connection.</p><p>Review <a href="${photoStorageSource}" target="_blank" rel="noopener noreferrer">Apple's photo-storage setup</a> and <a href="${iCloudSource}" target="_blank" rel="noopener noreferrer">iCloud Photos and Optimize Storage</a>. Keep an independent backup of important originals; iCloud Photos synchronization is not a separate backup copy.</p></div>`;

export function updateStorageGuide(html) {
  if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error("Expected the established iPhone storage guide canonical URL");
  const hero = /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/;
  if (!hero.test(html)) throw new Error("Storage guide hero is missing");
  const card = /<div(?: id="optimize-without-deleting")?><strong>Keep every photo, use less device space<\/strong>[\s\S]*?<\/div>/;
  if (!card.test(html)) throw new Error("Storage guide Optimize Storage card is missing");
  html = html.replace(card, storageOptimizeCard);
  html = html.replace(/<section\b[^>]*id="storage-task-choice"[^>]*>[\s\S]*?<\/section>/g, "");
  html = html.replace(hero, (section) => section + taskSection);
  for (const [attribute, name] of [["name", "description"], ["property", "og:description"], ["name", "twitter:description"]]) {
    const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}="${name}")[^>]*>`, "i");
    if (!pattern.test(html)) throw new Error(`Storage guide is missing ${name}`);
    html = html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/, `content="${description}"`));
  }
  const update = articleUpdateDate(html, "2026-10-28");
  html = update.html;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  const wordCount = main.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (["Article", "WebPage"].includes(node["@type"])) {
        node.description = description; node.dateModified = update.date;
        if (node["@type"] === "Article") {
          node.wordCount = wordCount;
          const prior = Array.isArray(node.citation) ? node.citation : node.citation ? [node.citation] : [];
          node.citation = [...new Set([...prior, photoStorageSource, iCloudSource])];
        }
      }
      Object.values(node).forEach(visit);
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
}
