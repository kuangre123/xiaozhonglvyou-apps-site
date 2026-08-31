#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const fileName = "zh-cn.html";
const updatedDate = "2026-08-30";

const stores = {
  cleaning: "https://apps.apple.com/cn/app/ai-cleaning-%E6%99%BA%E8%83%BD%E7%85%A7%E7%89%87%E6%B8%85%E7%90%86/id6768019606?uo=4",
  translator: "https://apps.apple.com/cn/app/%E5%87%BA%E5%9B%BD%E7%BF%BB%E8%AF%91%E9%80%9A/id6755734543?uo=4",
  antiSpy: "https://apps.apple.com/cn/app/anti-spy-screen/id6761301764?mt=12&uo=4",
  antiSpyLite: "https://apps.apple.com/cn/app/anti-spy-screen-lite/id6766485393?mt=12&uo=4",
  gifmaker: "https://apps.apple.com/cn/app/gifmaker-gif-studio/id6783559364?uo=4",
  happyRide: "https://apps.apple.com/cn/app/%E5%BF%AB%E4%B9%90%E8%BD%BB%E9%AA%91-%E8%87%AA%E5%8A%A8%E9%AA%91%E8%A1%8C%E8%BF%90%E5%8A%A8%E8%AE%B0%E5%BD%95/id6786365305?uo=4"
};

const faqItems = [
  {
    question: "iPhone 相册很乱，应该先用照片分类还是直接删除？",
    answer: "先分类再删除更稳妥。AI Cleaning 可以先把照片按内容类型整理，再把重复照片、相似照片、截图、模糊照片和大文件列为复查候选；最终删除哪些照片仍由用户确认。"
  },
  {
    question: "AI Cleaning 会自动删除照片或清理 iOS 系统垃圾吗？",
    answer: "不会。它不会替用户自动删除照片，也不把清理受保护的 iOS 系统数据或 RAM 当作功能。应用聚焦照片库整理，删除前需要用户检查和确认。"
  },
  {
    question: "照片分类和 GIF 制作会把素材上传到服务器吗？",
    answer: "AI Cleaning 的照片分析和 GIFmaker 的核心编辑流程均设计为在设备端完成。使用前仍应在当前中国区 App Store 页面核对最新隐私标签、系统要求和功能说明。"
  },
  {
    question: "出国翻译通适合翻译菜单、路牌和现场对话吗？",
    answer: "适合。语音输入和朗读可用于现场对话，拍照 OCR 可用于菜单、路牌和标签。姓名、日期、金额和地址应对照原文，医疗、法律、安全和入境信息还要通过官方渠道或人工翻译确认。"
  },
  {
    question: "快乐轻骑如何记录骑行，是否需要 Apple Watch？",
    answer: "快乐轻骑可在 iPhone 上自动识别骑行、步行和跑步，Apple Watch 心率属于可选增强信息，并非开始记录的必要条件。首次使用应完成权限设置并进行一次短距离测试。"
  },
  {
    question: "Mac 屏幕防窥工具能代替会议软件的共享检查吗？",
    answer: "不能。Anti-spy screen 可以帮助隐藏指定应用或遮挡屏幕区域，但会议软件中实际共享的窗口或显示器仍由用户选择。正式会议前应关闭敏感内容并检查共享预览。"
  }
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function storeLink({ href, product, storefront = "ios-app-store", label, text, className = "" }) {
  const classAttribute = className ? ` class="${className}"` : "";
  return `<a${classAttribute} href="${href}" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="${product}" data-storefront="${storefront}" aria-label="${label}（在新标签页打开）">${text}</a>`;
}

function faqJsonLd() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "zh-Hans",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  })}</script>`;
}

function faqSection() {
  const details = faqItems.map(({ question, answer }, index) =>
    `<details${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`
  ).join("");

  return `<section class="section faq" id="faq" data-localized-faq="zh-cn"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">常见问题</p><h2>安装和操作前需要确认的六件事。</h2></div><p>直接回答照片整理、旅行翻译、骑行记录、GIF 制作和 Mac 屏幕隐私的常见疑问。</p></div><div class="faq-list">${details}</div></div></section>`;
}

function mainContent() {
  const cleaningHero = storeLink({
    href: stores.cleaning,
    product: "ai-cleaning-photo-cleaner",
    label: "在中国区 App Store 查看 AI Cleaning 智能照片清理",
    text: "查看照片清理",
    className: "button button-primary"
  });
  const translatorHero = storeLink({
    href: stores.translator,
    product: "translation-specialist",
    label: "在中国区 App Store 查看出国翻译通",
    text: "查看出国翻译",
    className: "button button-secondary"
  });
  const productLinks = [
    storeLink({ href: stores.cleaning, product: "ai-cleaning-photo-cleaner", label: "在中国区 App Store 查看 AI Cleaning 智能照片清理", text: "中国区 App Store" }),
    storeLink({ href: stores.translator, product: "translation-specialist", label: "在中国区 App Store 查看出国翻译通", text: "中国区 App Store" }),
    storeLink({ href: stores.gifmaker, product: "gifmaker-gif-studio", label: "在中国区 App Store 查看 GIFmaker-Gif Studio", text: "中国区 App Store" }),
    storeLink({ href: stores.happyRide, product: "happyride-auto-ride-tracker", label: "在中国区 App Store 查看快乐轻骑自动骑行运动记录", text: "中国区 App Store" }),
    storeLink({ href: stores.antiSpy, product: "anti-spy-screen", storefront: "mac-app-store", label: "在中国区 Mac App Store 查看 Anti-spy screen", text: "中国区 Mac App Store" }),
    storeLink({ href: stores.antiSpyLite, product: "anti-spy-screen-lite", storefront: "mac-app-store", label: "在中国区 Mac App Store 查看 Anti-spy screen Lite", text: "中国区 Mac App Store" })
  ];

  return `<main class="page-main" id="main-content"><section class="page-hero"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="路径"><ol><li><a href="/">首页</a></li><li><a href="regions.html">国家与语言</a></li><li aria-current="page">中国大陆</li></ol></nav><p class="eyebrow">中国大陆用户应用入口</p><h1>照片整理、出国翻译、GIF 制作、骑行记录与 Mac 屏幕隐私。</h1><p>按实际任务选择 iPhone、Apple Watch 和 Mac 工具：先看中文功能边界和操作注意事项，再进入中国区 App Store 核对当前版本、系统要求、价格与隐私标签。</p><div class="hero-actions" aria-label="中国大陆应用操作">${cleaningHero} ${translatorHero}</div><p class="article-meta">内容与中国区商店可用性核对于 <time datetime="${updatedDate}">2026年8月30日</time></p></div><div class="page-hero-media"><picture><source srcset="assets/ai-cleaning-screen.webp" type="image/webp"><img src="assets/ai-cleaning-screen.png" width="331" height="720" decoding="async" fetchpriority="high" alt="AI Cleaning 在 iPhone 上进行照片分类和复查的真实界面"></picture></div></section><section class="section content-section" id="apps" data-chinese-market="apps"><div class="section-inner content-grid"><div><p class="section-kicker">六款应用</p><h2>先按任务选工具，再核对中国区商店信息。</h2><p>每款应用解决的核心问题不同。下列入口均指向 Apple 中国区公开目录，便于安装前确认当前名称、支持系统、应用内购买和隐私说明。</p></div><div class="content-list"><div id="photo-cleaning"><strong>AI Cleaning - 智能照片清理</strong><p>在 iPhone 端分类食物、植物、动物、票据、证件、文档和合照，并集中复查重复、相似、截图、模糊照片及大文件。${productLinks[0]}</p></div><div id="translation"><strong>出国翻译通</strong><p>将双向语音、朗读、连续传译、拍照 OCR 和文字翻译放进同一旅行流程。${productLinks[1]}</p></div><div id="gif-making"><strong>GIFmaker-Gif Studio</strong><p>把照片、视频和 Live Photo 制作成 GIF，并提供逐帧调速、文字、倒放、循环与画布设置。${productLinks[2]}</p></div><div id="ride-tracking"><strong>快乐轻骑 - 自动骑行运动记录</strong><p>在 iPhone 上自动识别骑行、步行和跑步，可结合 Apple Watch 心率并写入 Apple 健康。${productLinks[3]}</p></div><div id="mac-privacy"><strong>Anti-spy screen</strong><p>用于 Mac 共享空间、远程会议和演示中的应用隐藏、屏幕区域遮挡与隐私辅助。${productLinks[4]}</p></div><div><strong>Anti-spy screen Lite</strong><p>提供较轻量的 Mac 屏幕隐私入口，安装前应对照完整版确认功能差异。${productLinks[5]}</p></div></div></div></section><section class="section content-section alt-section" id="decision-guide" data-chinese-market="decision"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">按任务选择</p><h2>从要完成的事情进入对应中文指南。</h2></div><p>每个搜索需求只指向一个主要说明页，减少功能混淆，也便于继续查看更具体的操作和边界。</p></div><div class="intent-table" role="table" aria-label="中国大陆用户应用选择表"><div class="intent-head" role="row"><span role="columnheader">要完成的任务</span><span role="columnheader">先看哪个页面</span><span role="columnheader">重点确认</span></div><div role="row"><span role="cell">整理很大的 iPhone 相册</span><span role="cell"><a href="ai-photo-classification-cn.html">AI 照片分类指南</a></span><span role="cell">内容分类、设备端处理、先复查再删除。</span></div><div role="row"><span role="cell">复查重复、相似和截图</span><span role="cell"><a href="duplicate-photo-cleaner-cn.html">重复照片清理指南</a></span><span role="cell">比较清晰度、表情、编辑状态和文字可读性。</span></div><div role="row"><span role="cell">整理 iPad 文档、截图和大视频</span><span role="cell"><a href="ipad-photo-organizer-cn.html">iPad 照片整理指南</a></span><span role="cell">iCloud 同步、导入来源和大文件占用。</span></div><div role="row"><span role="cell">旅行对话、菜单和路牌翻译</span><span role="cell"><a href="travel-translator-cn.html">出国翻译通指南</a></span><span role="cell">语音、朗读、拍照 OCR 与离线语言范围。</span></div><div role="row"><span role="cell">用照片或视频制作 GIF</span><span role="cell"><a href="gif-maker-cn.html">iPhone GIF 制作指南</a></span><span role="cell">素材类型、逐帧编辑、循环方式和导出质量。</span></div><div role="row"><span role="cell">自动记录骑行、步行和跑步</span><span role="cell"><a href="happyride-auto-ride-tracker-cn.html">快乐轻骑使用指南</a></span><span role="cell">运动与定位权限、Apple 健康和首次测试。</span></div><div role="row"><span role="cell">减少 Mac 共享屏幕的信息暴露</span><span role="cell"><a href="mac-screen-privacy-cn.html">Mac 屏幕隐私指南</a></span><span role="cell">保护区域、敏感窗口和会议共享预览。</span></div></div></div></section><section class="section content-section" id="safeguards" data-chinese-market="safeguards"><div class="section-inner content-grid"><div><p class="section-kicker">操作前检查</p><h2>删除、翻译、运动记录和屏幕共享都需要用户确认。</h2><p>工具可以减少重复操作，但不能替代对照片意义、重要翻译、权限设置和共享范围的判断。先做一次小范围测试，再用于完整相册、正式行程或会议。</p></div><div class="content-list"><div><strong>删除照片前</strong><p>确认 iCloud 照片同步状态，逐组比较重复与相似照片，并单独查看证件、票据、文档、编辑照片和家庭照片。删除后还要了解“最近删除”相簿的保留机制。</p></div><div><strong>出国前</strong><p>用实际需要的语言测试语音和拍照翻译。姓名、日期、金额、地址要对照原文；医疗、法律、安全和入境内容还需官方信息或合格人工翻译确认。</p></div><div><strong>记录运动前</strong><p>检查运动与健身、定位和 Apple 健康权限，完成一次短距离测试。自动识别能减少忘记开始的情况，但环境和权限仍可能影响结果。</p></div><div><strong>共享 Mac 屏幕前</strong><p>关闭通知和敏感窗口，确认会议软件实际共享的是哪个窗口或显示器，并在正式会议前检查共享预览。</p></div><div><strong>先用少量真实资料试跑</strong><p>照片工具先选择一个小相册，GIF 工具先用一段短视频，翻译工具先测试旅途中实际会用的语言，骑行工具先走一段熟悉路线。小范围试跑能确认权限、处理速度、导出结果和设备兼容性，避免第一次就在完整照片库、正式行程或重要会议中承担不必要的风险。</p></div><div><strong>保留原始资料和替代方案</strong><p>制作 GIF 前保留原视频，批量清理前确认云端同步，出国时准备官方地址与关键短语截图，重要运动可同时确认系统记录。应用是完成任务的辅助工具，原始素材、官方信息和人工判断仍是出错时最可靠的回退路径。</p></div><div><strong>权限按任务最小化开启</strong><p>照片访问、麦克风、相机、定位、运动与健身以及屏幕录制权限分别服务不同功能。只在需要时开启相应权限，任务结束后可以在系统设置中复查；某项功能不可用时，先确认权限和系统版本，不要反复删除数据或更改无关设置。</p></div></div></div></section><section class="section content-section alt-section" id="boundaries" data-chinese-market="boundaries"><div class="section-inner content-grid"><div><p class="section-kicker">功能边界</p><h2>页面只描述能够核对的产品能力。</h2><p>安装前看清边界比夸大“自动”和“智能”更重要。下面这些限制适用于实际选择，也能帮助判断一款工具是否适合当前任务。</p></div><div class="content-list"><div><strong>照片分类不是自动删除</strong><p>分类和候选分组用于缩短复查时间，保留哪张、删除哪张仍由用户决定。</p></div><div><strong>照片清理不是系统清理</strong><p>应用处理照片库内容，不承诺删除受保护的 iOS 系统数据、RAM 或无法验证的“系统垃圾”。</p></div><div><strong>机器翻译不是重要决定的最终依据</strong><p>日常旅行沟通可以借助机器翻译，涉及安全、法律、医疗和入境时必须增加可靠的人工或官方确认。</p></div><div><strong>自动记录不是百分之百识别</strong><p>权限、携带方式和运动环境都可能影响自动检测，重要训练应在结束后检查记录是否完整。</p></div><div><strong>屏幕遮挡不会替你选择共享对象</strong><p>Mac 隐私工具提供辅助保护，会议软件中的窗口或显示器选择仍需用户亲自确认。</p></div></div></div></section><section class="section content-section" id="store-check" data-chinese-market="store"><div class="section-inner content-grid"><div><p class="section-kicker">中国区商店核对</p><h2>六款应用当前都能从 Apple 中国区公开目录找到。</h2><p>本页于 2026年8月30日按应用 ID 核对六款应用的中国区公开记录。商店可用性、版本、价格和隐私标签会变化，因此页面提供直接入口，但不把一次核对结果当作永久承诺。</p></div><div class="content-list"><div><strong>安装前看四项</strong><p>核对应用名称、最低系统版本、应用内购买和隐私标签，确认设备与需求匹配后再安装。</p></div><div><strong>Mac 与 iPhone 商店入口不同</strong><p>AI Cleaning、出国翻译通、GIFmaker 和快乐轻骑是 iPhone/iOS 入口；Anti-spy screen 两个版本使用 Mac App Store 入口。</p></div><div><strong>中文说明和商店记录各有用途</strong><p>本站中文指南解释任务流程和风险边界；Apple 商店页面用于确认当前发布状态与官方产品信息，两者应一起查看。</p></div></div></div></section>${faqSection()}<section class="section content-section" data-chinese-market="markets"><div class="section-inner"><p class="section-kicker">其他 App Store 市场</p><p><a href="us-apps.html">美国</a> · <a href="uk-apps.html">英国</a> · <a href="canada-australia-apps.html">加拿大与澳大利亚</a> · <a href="singapore-apps.html">新加坡</a> · <a href="switzerland-apps.html">瑞士</a> · <a href="netherlands-nordics-apps.html">荷兰与北欧</a> · <a href="de-de.html">德国</a> · <a href="fr-fr.html">法国</a> · <a href="es-es.html">西班牙</a> · <a href="it-it.html">意大利</a> · <a href="ko-kr.html">韩国</a> · <a href="ja-jp.html">日本</a> · <a href="zh-hant.html">繁體中文</a></p></div></section></main>`;
}

function footer() {
  return `<footer class="footer"><div class="footer-inner"><p>© 2026 CrazyAIAgent.</p><div><a href="zh-cn.html">中文首页</a> <a href="iphone-photo-cleaner-cn.html">iPhone照片清理</a> <a href="ai-photo-classification-cn.html">AI照片分类</a> <a href="duplicate-photo-cleaner-cn.html">重复照片清理</a> <a href="travel-translator-cn.html">出国翻译通</a> <a href="gif-maker-cn.html">GIF制作</a> <a href="happyride-auto-ride-tracker-cn.html">骑行记录</a> <a href="mac-screen-privacy-cn.html">Mac屏幕隐私</a> <a href="directory.html">全部页面</a> <a href="search.html">站内搜索</a> <a href="mailto:cb123428316@gmail.com">联系</a></div></div></footer>`;
}

function updateMetadata(html) {
  return html
    .replace(/<meta\b[^>]*name=["']apple-itunes-app["'][^>]*>/gi, "")
    .replace(/<title>[\s\S]*?<\/title>/i, "<title>中国大陆 iPhone 与 Mac 应用 | 照片清理、翻译与骑行</title>")
    .replace(/<meta name="description" content="[^"]*">/i, '<meta name="description" content="中国大陆用户的 iPhone 与 Mac 应用入口：AI 照片分类、重复照片复查、出国语音与拍照翻译、GIF 制作、自动骑行记录和屏幕隐私。提供中文任务指南、操作边界及中国区 App Store 直达链接。">')
    .replace(/<meta name="keywords" content="[^"]*">/i, '<meta name="keywords" content="iPhone照片清理, AI照片分类, 重复照片清理, 出国翻译, 拍照翻译, GIF制作, 自动骑行记录, Apple Watch骑行, Mac屏幕隐私">')
    .replace(/<meta property="og:title" content="[^"]*">/i, '<meta property="og:title" content="中国大陆 iPhone 与 Mac 应用">')
    .replace(/<meta property="og:description" content="[^"]*">/i, '<meta property="og:description" content="照片整理、旅行翻译、GIF 制作、骑行记录与 Mac 屏幕隐私的中文任务入口和中国区商店链接。">')
    .replace(/<meta property="og:image:alt" content="[^"]*">/i, '<meta property="og:image:alt" content="CrazyAIAgent 中国大陆 iPhone 与 Mac 应用入口">')
    .replace(/<meta name="twitter:title" content="[^"]*">/i, '<meta name="twitter:title" content="中国大陆 iPhone 与 Mac 应用">')
    .replace(/<meta name="twitter:description" content="[^"]*">/i, '<meta name="twitter:description" content="照片整理、旅行翻译、GIF 制作、骑行记录与 Mac 屏幕隐私的中文任务入口和中国区商店链接。">');
}

function updateJsonLd(html) {
  const replacementFaq = faqJsonLd();
  const scriptPattern = /<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi;
  let foundFaq = false;
  const updated = html.replace(scriptPattern, (block, body) => {
    try {
      const parsed = JSON.parse(body);

      if (parsed?.["@type"] === "WebPage") {
        parsed.name = "中国大陆 iPhone 与 Mac 应用";
        parsed.about = [
          "iPhone照片清理",
          "AI照片分类",
          "重复照片清理",
          "出国翻译",
          "拍照翻译",
          "GIF制作",
          "自动骑行记录",
          "Apple Watch骑行",
          "Mac屏幕隐私"
        ];
        parsed.dateModified = updatedDate;
        return `<script type="application/ld+json">${JSON.stringify(parsed)}</script>`;
      }

      if (parsed?.["@type"] === "BreadcrumbList") {
        parsed.name = "中国大陆";
        parsed.itemListElement = [
          { "@type": "ListItem", position: 1, name: "首页", item: "https://www.xiaozhonglvyou.com/" },
          { "@type": "ListItem", position: 2, name: "国家与语言", item: "https://www.xiaozhonglvyou.com/regions.html" },
          { "@type": "ListItem", position: 3, name: "中国大陆", item: "https://www.xiaozhonglvyou.com/zh-cn.html" }
        ];
        return `<script type="application/ld+json">${JSON.stringify(parsed)}</script>`;
      }

      if (parsed?.["@type"] === "FAQPage") {
        foundFaq = true;
        return replacementFaq;
      }
    } catch {
      return block;
    }

    return block;
  });

  if (foundFaq) return updated;
  if (!updated.includes("</head>")) throw new Error("Missing </head> in zh-cn.html");
  return updated.replace("</head>", `${replacementFaq}</head>`);
}

function updateBody(html) {
  let updated = html;

  if (!/<body[^>]*>\s*<a class="skip-link"/i.test(updated)) {
    updated = updated.replace(/(<body\b[^>]*>)/i, '$1<a class="skip-link" href="#main-content">跳到主要内容</a>');
  }

  updated = updated.replace(
    /<div class="nav-links">[\s\S]*?<\/div><a class="nav-cta"[^>]*>[\s\S]*?<\/a>/i,
    '<div class="nav-links"><a href="#photo-cleaning">照片整理</a> <a href="#translation">出国翻译</a> <a href="#ride-tracking">骑行记录</a> <a href="#mac-privacy">Mac隐私</a></div><a class="nav-cta" href="#apps">选择应用</a>'
  );
  updated = updated.replace(/<main\b[\s\S]*?<\/main>/i, mainContent());
  updated = updated.replace(/<footer class="footer">[\s\S]*?<\/footer>/i, footer());
  return updated;
}

const filePath = path.join(siteDir, fileName);
const original = await readFile(filePath, "utf8");
const updated = updateBody(updateJsonLd(updateMetadata(original)));

if (updated !== original) await writeFile(filePath, updated, "utf8");
console.log(`Applied Chinese market content to ${fileName}; changed ${updated === original ? 0 : 1}.`);
