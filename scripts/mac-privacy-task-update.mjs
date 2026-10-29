import { articleUpdateDate } from "./article-update-date.mjs";

const files = new Set(["screen-sharing-privacy-guide.html", "mac-screen-privacy-cn.html"]);
const origin = "https://www.xiaozhonglvyou.com";
const notificationSource = "https://support.apple.com/en-hk/guide/mac-help/mchl205da693/mac";
const chineseSection = `<section class="section content-section" id="mac-privacy-task-choice"><div class="section-inner content-grid"><div><p class="section-kicker">先按场景选择</p><h2>会议通知、邻座视线和共享画面，分别检查。</h2><p>先确定谁可能看到内容，再选择系统设置、软件隐藏或物理防窥膜。自己屏幕上出现遮挡，并不能证明远端收到的画面也被遮挡。</p></div><div class="content-list"><div><h3>会议时不想弹出通知</h3><p>先在“系统设置 → 通知”中检查镜像或共享显示器时的通知选项，并在会议应用里选择实际需要共享的窗口或标签页。系统选项名称会随 macOS 版本和语言变化。可参考 <a href="${notificationSource}" target="_blank" rel="noopener noreferrer">Apple 通知设置说明（英文）</a>，或按<a href="screen-sharing-privacy-guide.html#guided-workflow" lang="en" hreflang="en">共享屏幕前的免费系统步骤（英文）</a>逐项核对。</p></div><div><h3>担心邻座从侧面看屏幕</h3><p>软件可根据检测结果隐藏选定应用，或用遮挡块覆盖指定区域；它不会改变显示器的物理观看角度。需要收窄侧视角时，应考虑适配显示器的物理防窥膜，并在实际位置检查可见范围。软件隐藏和物理防窥解决的是不同问题。</p></div><div><h3>需要遮挡块或选定应用隐藏</h3><p>先用无敏感信息的样例，按实际共享源和采集模式进行测试。遮挡块、应用隐藏及演示模式是否进入共享画面，要以另一台设备的接收结果为准，不能保证对所有会议应用或录屏模式都生效。参考<a href="screen-sharing-privacy-guide.html#receiver-test" lang="en" hreflang="en">接收端检查方法（英文）</a>；出现意外暴露时先停止共享，调整后再测试。</p></div></div></div></section>`;

function replaceHeroActions(html, chinese) {
  const label = chinese ? "Mac防窥操作" : "Screen privacy guide actions";
  const pattern = new RegExp(`<div class="hero-actions" aria-label="${label}">[\\s\\S]*?<\\/div>`);
  if (!pattern.test(html)) throw new Error("Mac privacy hero actions are missing");
  return html.replace(pattern, (actions) => {
    actions = actions.replace(/<a\b[^>]*data-mac-task-action[^>]*>[\s\S]*?<\/a>\s*/g, "");
    actions = actions.replace(/class="button button-primary"(?=[^>]*href="https:\/\/apps\.apple\.com)/g, 'class="button button-secondary"');
    const target = chinese ? "#mac-privacy-task-choice" : "#guided-workflow";
    const text = chinese ? "先按场景选择" : "Show built-in steps";
    return actions.replace(/(<div\b[^>]*>)/, `$1<a class="button button-primary" data-mac-task-action href="${target}">${text}</a> `);
  });
}

export function updateMacPrivacyTask(html, file) {
  if (!files.has(file) || !html.includes(`rel="canonical" href="${origin}/${file}"`)) throw new Error("Expected a supported Mac privacy page canonical");
  const chinese = file === "mac-screen-privacy-cn.html";
  html = replaceHeroActions(html, chinese);
  if (chinese) {
    const hero = /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/;
    if (!hero.test(html)) throw new Error("Chinese Mac privacy hero is missing");
    html = html.replace(/<section\b[^>]*id="mac-privacy-task-choice"[^>]*>[\s\S]*?<\/section>/g, "");
    html = html.replace(hero, (section) => section + chineseSection);
  }
  const updated = articleUpdateDate(html, "2026-10-29");
  html = updated.html;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || "";
  const wordCount = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if (["Article", "WebPage"].includes(node["@type"])) {
        node.dateModified = updated.date;
        if (node["@type"] === "Article") {
          node.wordCount = wordCount;
          if (chinese) {
            const citations = Array.isArray(node.citation) ? node.citation : node.citation ? [node.citation] : [];
            node.citation = [...new Set([...citations, notificationSource])];
          }
        }
      }
      Object.values(node).forEach(visit);
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
}
