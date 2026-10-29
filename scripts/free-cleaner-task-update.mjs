import { articleUpdateDate } from "./article-update-date.mjs";

const canonical = "https://www.xiaozhonglvyou.com/best-iphone-photo-cleaner-app.html";
const nativeAction = '<a class="button button-primary" data-free-cleaner-native-action href="iphone-storage-cleanup-guide.html#free-steps">Use free iPhone tools</a> ';
const taskSection = `<section class="section content-section" id="free-cleaner-task-choice"><div class="section-inner"><div class="section-heading"><p class="section-kicker">Choose a free path</p><h2>Use built-in cleanup, try a limited app action, or make a smaller sharing copy.</h2><p>Start with the result you need. A free download, a free cleanup allowance and a smaller exported file are different choices.</p></div><div class="region-grid"><div class="region-card"><strong>Use iPhone's built-in tools</strong><p>Check photo storage, merge detected duplicates, and review videos and screenshots with <a href="iphone-storage-cleanup-guide.html#free-steps">the free iPhone cleanup steps</a>. No cleaner subscription is required. For duplicate groups, follow the <a href="duplicate-photo-cleaner-guide.html#native-duplicates">Apple Photos merge workflow</a> and review what you keep before confirming.</p></div><div class="region-card"><strong>Try AI Cleaning with a limited allowance</strong><p>AI Cleaning is free to download. Free users get one successful in-app cleanup action across eligible tools, not one per screen; that action may include multiple selected items. This is not a daily free-deletion allowance. Further gated cleanup actions and the nine Auto-Categorize AI categories require Pro. Review <a href="iphone-photo-cleaner.html">the app's features and allowance</a> before choosing it.</p></div><div class="region-card"><strong>Make one image smaller to send</strong><p>Use the <a href="image-compressor.html">free browser image compressor</a> for a JPEG, PNG or WebP. It downloads a separate sharing copy and does not scan or clear your Photos library. Compressing a copy does not merge duplicates or remove the original from the library.</p></div></div><p>If Photos does not show Duplicates, check the <a href="duplicate-photo-cleaner-guide.html#duplicates-not-showing">system detection requirements</a>. Compare <a href="iphone-photo-cleaner-comparison.html">three photo cleaner apps</a> when you need another review workflow.</p></div></section>`;

export function updateFreeCleanerTask(html) {
  if (!html.includes(`rel="canonical" href="${canonical}"`)) throw new Error("Expected the established free photo-cleaner guide canonical URL");
  const heroPattern = /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/;
  if (!heroPattern.test(html)) throw new Error("Free photo-cleaner guide hero is missing");
  html = html.replace(heroPattern, (hero) => {
    const actions = '<div class="hero-actions" aria-label="Free photo cleaner app for iPhone actions">';
    if (!hero.includes(actions)) throw new Error("Free photo-cleaner guide actions are missing");
    hero = hero.replace(/<a\b[^>]*data-free-cleaner-native-action[^>]*>[\s\S]*?<\/a>\s*/g, "");
    hero = hero.replace(/class="button button-primary"(?=[^>]*href="https:\/\/apps\.apple\.com\/)/g, 'class="button button-secondary"');
    hero = hero.replace(/(<a\b[^>]*data-store-product="ai-cleaning-photo-cleaner"[^>]*>)[\s\S]*?(<\/a>)/, (_, open, close) => open + "AI Cleaning: one free action" + close);
    return hero.replace(actions, actions + nativeAction);
  });
  html = html.replace(/<section\b[^>]*id="free-cleaner-task-choice"[^>]*>[\s\S]*?<\/section>/g, "");
  html = html.replace(heroPattern, (hero) => hero + taskSection);
  const update = articleUpdateDate(html, "2026-10-29");
  html = update.html;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  const wordCount = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (["Article", "WebPage"].includes(node["@type"])) {
        node.dateModified = update.date;
        if (node["@type"] === "Article") node.wordCount = wordCount;
      }
      Object.values(node).forEach(visit);
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
}
