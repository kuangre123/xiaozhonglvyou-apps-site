#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { minifyHtml } from './minify-html.mjs';

export const extensionPages = ['chrome-extensions.html', 'chrome-extensions-cn.html'];
export const extensions = [
  { id: 'privacyguard', name: 'PrivacyGuard — Web Redactor', storeId: 'pcjkepmfbkfhkpcihebbboocnjinnadi', category: 'UtilitiesApplication', policy: 'privacyguard-chrome-privacy.html' },
  { id: 'gifmaker', name: 'GIFmaker — Private GIF Studio', storeId: 'opihemepgelanpffiecpodnceboehfcl', category: 'MultimediaApplication', policy: 'gifmaker-chrome-privacy.html' }
];
const origin = 'https://www.xiaozhonglvyou.com';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = app => `https://chromewebstore.google.com/detail/${app.storeId}`;
const copy = {
  en: {
    title: 'Chrome Extensions: Web Masking & GIF Maker | CrazyAIAgent',
    description: 'Hide webpage text before screen sharing or make GIFs from still images. Get the two free Chrome extensions, check their limits and follow the setup steps.',
    h1: 'Mask webpage details. Make a GIF from pictures.',
    intro: 'Two free Chrome extensions for different tasks: PrivacyGuard masks details on an ordinary webpage; GIFmaker turns still images into an animated GIF. Neither requires an account or a native app purchase.',
    label: 'Chrome extensions', home: 'Home', other: '中文', install: 'View in Chrome Web Store', privacy: 'Extension privacy policy', steps: 'How to use it', limits: 'Check before you start',
    privacySummary: 'Hide email addresses, currency amounts or a manually chosen page element before a presentation or screen share.',
    privacySteps: ['Open an ordinary webpage and click the PrivacyGuard toolbar icon.', 'Choose Mask matching text for emails and amounts, or Pick element for a name or form field. Press Escape to leave picking mode.', 'Inspect the whole screen before sharing. Use Undo for the last picked element or Restore page to remove the masks.'],
    privacyLimits: 'This is reversible visual masking, not irreversible redaction or access control. Original data remains in page memory and a changing website can reveal new content. Images, PDFs, frames, browser UI, other tabs and other applications are not covered. Reloading removes masks.',
    gifSummary: 'Create an animated GIF from still PNG, JPG or WebP pictures. Reorder frames, adjust timing, add a caption, preview and download without a watermark.',
    gifSteps: ['Click the GIFmaker toolbar icon and add local still images, or start with Try a sample.', 'Arrange frames, set individual delays or apply timing to all frames, then choose the canvas size and caption.', 'Play the preview, choose Create GIF, and download the finished file. To collect a web image, right-click it and grant access to that image origin only when requested.'],
    gifLimits: 'This extension accepts up to 60 still images, at most 20 MB each. It does not record the screen, import video or split animated GIFs into frames. Some protected web images need to be saved and added as local files. The editor displays size and memory limits.',
    localTitle: 'Local processing, with separate privacy boundaries.',
    localText: 'The extensions do not send page contents or selected media to the developer and have no developer analytics. GIFmaker contacts an image host only when you choose a web-image import; that host can see the request. Store installation uses Google. These website pages use website analytics and can count clicks on the store buttons, without reading extension activity or files.',
    choicesTitle: 'Choose the browser tool or native app for your task.',
    choices: [
      ['Prefer to skip installation?', 'Use the free website GIF tool for supported images, video or an existing GIF. Its input support and limits differ from the extension.', 'gif-maker-online.html', 'Open the website GIF tool'],
      ['Need video or Live Photo workflows on iPhone?', 'Compare the separate GIFmaker native app and its current App Store price. Extension projects do not sync to the app.', 'gif-maker.html', 'Compare the native GIF app'],
      ['Need to hide applications on a Mac?', 'The separate Anti-spy screen Mac app offers camera-based detection and app hiding. Those features do not run in PrivacyGuard.', 'mac-screen-privacy.html', 'Explore the Mac privacy app']
    ],
    faqs: [
      ['Are these Chrome extensions free?', 'Yes. The two extensions work without an account or payment. Each can show a dismissible recommendation for a separate native app; purchasing that app is optional and does not unlock extension features.'],
      ['Does PrivacyGuard permanently remove sensitive data?', 'No. It changes the visual presentation of the active webpage and supports restoration. Original content remains in memory. Do not use it as a way to securely redact a document or restrict access.'],
      ['Can the GIFmaker extension turn video into GIF?', 'No. Version 0.1.0 accepts still PNG, JPG and WebP images. The website GIF tool and native app are separate products with different input support.'],
      ['How do I install an extension?', 'Open its official Chrome Web Store listing in desktop Chrome, review the permissions and choose Add to Chrome. Installing the extension is optional; these instructions and privacy policies can be read without installation.']
    ], faq: 'Common questions', checked: 'Official public listings checked on November 22, 2026 · extension version 0.1.0', support: 'Get help'
  },
  zh: {
    title: 'Chrome 扩展：网页信息遮挡与图片制作 GIF | CrazyAIAgent',
    description: '在共享屏幕前遮挡网页中的邮箱、金额或选定元素，或把静态图片做成 GIF。这里提供两款免费 Chrome 扩展的官方安装入口、具体步骤、权限说明与功能限制；无需账号，也不必购买原生应用。',
    h1: '共享前遮挡网页信息，用图片制作 GIF。',
    intro: '两款免费 Chrome 扩展，分别处理两件事：PrivacyGuard 遮挡普通网页上的信息；GIFmaker 将静态图片做成 GIF 动图。都无需账号，也不必购买原生应用。',
    label: 'Chrome 扩展', home: '首页', other: 'English', install: '前往 Chrome 官方商店', privacy: '扩展隐私政策（英文）', steps: '使用步骤', limits: '开始前先确认',
    privacySummary: '演示或共享屏幕前，遮挡普通网页中的邮箱、金额，或手动选定的姓名、表单等元素。',
    privacySteps: ['打开普通网页，点击 PrivacyGuard 扩展图标。', '用 Mask matching text 遮挡邮箱和金额；用 Pick element 手动选择姓名或表单等元素。按 Escape 退出选取。', '共享前检查整个屏幕。Undo 可撤销最后一次元素选取，Restore page 可恢复页面。界面支持简体中文和英文。'],
    privacyLimits: '这是可恢复的视觉遮挡，不是不可逆脱敏或访问控制。原始内容仍在页面内存中，动态网页也可能重新显示信息。不覆盖图片、PDF、框架、浏览器界面、其他标签页或其他应用。刷新页面会清除遮挡。',
    gifSummary: '把 PNG、JPG 或 WebP 静态图片做成 GIF，调整帧顺序、停留时间、字幕和画布，预览后下载无水印文件。',
    gifSteps: ['点击 GIFmaker 扩展图标，添加本地静态图片，也可以先用 Try a sample 体验示例。', '调整帧顺序，单独或批量设置停留时间，再选择画布尺寸和字幕。', '播放预览，点击 Create GIF 后下载。需要收集网页图片时，右键该图片，按提示仅授权访问图片来源；界面支持简体中文和英文。'],
    gifLimits: '最多添加 60 张静态图片，每张不超过 20 MB。不支持录屏、视频导入，也不会把已有 GIF 拆帧。有访问保护的网页图片可能需要先保存到本地再添加。请留意编辑器显示的尺寸和内存限制。',
    localTitle: '本地处理，也要分清网络请求。',
    localText: '扩展不会把网页内容或所选媒体发给开发者，也没有开发者行为统计。GIFmaker 仅在你主动导入网页图片时请求图片来源，对方服务器可以看到该次请求；安装由 Google 商店完成。本网站使用网站统计，可记录商店按钮点击，但不能读取扩展内的操作或文件。',
    choicesTitle: '按任务选择扩展、网页工具或原生应用。',
    choices: [
      ['暂时不想安装扩展？', '直接使用免费网页 GIF 工具，支持符合要求的图片、视频或已有 GIF。它与扩展的输入类型和限制不同。', 'gif-maker-online-cn.html', '打开网页 GIF 工具'],
      ['需要 iPhone 视频或实况照片流程？', '查看独立的 GIFmaker 原生应用和 App Store 当前价格。扩展项目不会自动同步到原生应用。', 'gif-maker-cn.html', '比较原生 GIF 应用'],
      ['需要隐藏 Mac 上的应用？', '独立的 Mac 防窥屏应用支持基于摄像头的检测和应用隐藏。这些功能不在 PrivacyGuard 扩展中运行。', 'mac-screen-privacy-cn.html', '了解 Mac 防窥屏应用']
    ],
    faqs: [
      ['这两款 Chrome 扩展免费吗？', '免费，无需账号或付款即可使用。扩展可能展示可关闭的独立原生应用推荐；购买完全自愿，也不会解锁扩展功能。'],
      ['PrivacyGuard 会永久删除敏感信息吗？', '不会。它只改变当前网页的视觉呈现，并支持恢复。原始内容仍保留在内存中，不能用来安全脱敏文档或限制他人访问。'],
      ['GIFmaker 扩展可以把视频转成 GIF 吗？', '不可以。0.1.0 版本只接受 PNG、JPG 和 WebP 静态图片。网页 GIF 工具和原生应用是独立产品，输入支持不同。'],
      ['如何安装？', '在桌面版 Chrome 中打开对应的官方商店页面，查看权限后选择添加至 Chrome。安装由你决定；不安装也可以阅读这里的步骤和隐私政策。']
    ], faq: '常见问题', checked: '2026 年 11 月 22 日核对官方公开商店页面 · 扩展版本 0.1.0', support: '获取帮助'
  }
};
function installLink(app, t) {
  return `<a class="button button-primary" href="${store(app)}" target="_blank" rel="noopener noreferrer" data-extension-id="${app.storeId}" aria-label="${esc(app.name)} — ${esc(t.install)}">${esc(t.install)}</a>`;
}
export function renderExtensionPage(template, locale, runtimeHash) {
  const t = copy[locale], zh = locale === 'zh', file = extensionPages[zh ? 1 : 0], url = `${origin}/${file}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(t.title)}</title>`);
  html = html.replace(/<meta\b[^>]*(?:name="(?:description|twitter:description)"|property="og:description")[^>]*>/g, tag => tag.replace(/content="[^"]*"/, `content="${esc(t.description)}"`));
  html = html.replace(/<meta\b[^>]*(?:name="twitter:title"|property="og:title")[^>]*>/g, tag => tag.replace(/content="[^"]*"/, `content="${esc(t.title)}"`));
  html = html.replaceAll(zh ? 'tools-cn.html' : 'tools.html', file).replaceAll(zh ? 'tools.html' : 'tools-cn.html', extensionPages[zh ? 0 : 1]);
  html = html.replace(/<a\b([^>]*href="chrome-extensions(?:-cn)?\.html"[^>]*)>(?:Free tools|免费工具)<\/a>/g, `<a$1>${esc(t.label)}</a>`);
  const breadcrumb = [{ '@type': 'ListItem', position: 1, name: t.home, item: `${origin}/${zh ? 'zh-cn.html' : ''}` }, { '@type': 'ListItem', position: 2, name: t.label, item: url }];
  const graph = [
    { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: t.title, description: t.description, inLanguage: zh ? 'zh-CN' : 'en', datePublished: '2026-11-22', dateModified: '2026-11-22', isPartOf: { '@id': `${origin}/#website` }, publisher: { '@id': `${origin}/#publisher` }, author: { '@id': `${origin}/#developer` }, mainEntity: { '@id': `${url}#extensions` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, name: t.label, numberOfItems: 2, itemListElement: breadcrumb },
    { '@type': 'ItemList', '@id': `${url}#extensions`, name: t.label, numberOfItems: 2, itemListElement: extensions.map((app, index) => ({ '@type': 'ListItem', position: index + 1, name: app.name, item: `${url}#${app.id}` })) },
    ...extensions.map(app => ({ '@type': 'SoftwareApplication', '@id': `${origin}/chrome-extensions.html#${app.id}-software`, name: app.name, url: `${url}#${app.id}`, downloadUrl: store(app), softwareVersion: '0.1.0', operatingSystem: 'Desktop Chrome 116 or later', applicationCategory: app.category, availableLanguage: ['en', 'zh-CN'], offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', url: store(app) }, author: { '@id': `${origin}/#developer` } })),
    { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: zh ? 'zh-CN' : 'en', mainEntity: t.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) }
  ];
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>`);
  const apps = extensions.map((app, index) => {
    const summary = index ? t.gifSummary : t.privacySummary, steps = index ? t.gifSteps : t.privacySteps, limits = index ? t.gifLimits : t.privacyLimits;
    return `<section class="section content-section${index ? ' alt-section' : ''}" id="${app.id}"><div class="section-inner content-grid"><div><p class="section-kicker">${index ? (zh ? '图片转 GIF' : 'Images to GIF') : (zh ? '屏幕共享' : 'Screen sharing')}</p><h2>${esc(app.name)}</h2><p>${esc(summary)}</p><div class="hero-actions">${installLink(app, t)}</div><p><a href="${app.policy}" lang="en">${esc(t.privacy)}</a></p></div><div class="content-list"><div><h3>${esc(t.steps)}</h3><ol>${steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol></div><div><h3>${esc(t.limits)}</h3><p>${esc(limits)}</p></div></div></div></section>`;
  }).join('');
  const main = `<main class="page-main"><section class="page-hero tool-intro"><div class="page-hero-copy"><nav class="breadcrumb" aria-label="${zh ? '面包屑导航' : 'Breadcrumb'}"><ol><li><a href="${zh ? 'zh-cn.html' : '/'}">${t.home}</a></li><li aria-current="page">${t.label}</li></ol></nav><p class="eyebrow">${t.label}</p><h1>${esc(t.h1)}</h1><p class="hero-summary">${esc(t.intro)}</p><div class="hero-actions"><a class="button button-primary" href="#privacyguard">PrivacyGuard</a><a class="button button-secondary" href="#gifmaker">GIFmaker</a></div><p class="hero-note">${esc(t.checked)}</p></div></section>${apps}<section class="section content-section"><div class="section-inner content-grid"><h2>${esc(t.localTitle)}</h2><p>${esc(t.localText)}</p></div></section><section class="section content-section alt-section"><div class="section-inner"><h2>${esc(t.choicesTitle)}</h2><div class="tool-card-grid">${t.choices.map(([title, text, href, label]) => `<article class="tool-card"><h3>${esc(title)}</h3><p>${esc(text)}</p><a href="${href}">${esc(label)}</a></article>`).join('')}</div></div></section><section class="section content-section" id="faq"><div class="section-inner content-grid"><h2>${t.faq}</h2><div class="faq-list">${t.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<p><a href="support.html">${t.support}</a></p></div></div></section></main>`;
  html = html.replace(/<main\b[\s\S]*?<\/main>/, main);
  html = html.replace('</body>', `<script src="extension-links.js?v=${runtimeHash}" defer></script></body>`);
  return minifyHtml(html);
}
export function addExtensionDiscoveryLink(html, zh) {
  const block = `<section class="section content-section" id="chrome-extension-discovery"><div class="section-inner content-grid"><div><p class="section-kicker">Chrome</p><h2>${zh ? '需要浏览器扩展？' : 'Prefer a Chrome extension?'}</h2></div><div><p>${zh ? '共享前遮挡网页上的邮箱或金额，或收集静态图片制作 GIF。查看免费扩展的具体步骤和限制。' : 'Mask webpage emails and amounts before sharing, or collect still images to make a GIF. Read the steps and limits for our free extensions.'}</p><a href="${extensionPages[zh ? 1 : 0]}">${zh ? '查看 Chrome 扩展与官方安装入口' : 'Explore Chrome extensions and official install links'}</a></div></div></section>`;
  return minifyHtml(html.replace(/<section\b[^>]*id="chrome-extension-discovery"[^>]*>[\s\S]*?<\/section>/g, '').replace('</main>', `${block}</main>`));
}
export async function buildExtensionDiscovery(siteDir) {
  const runtimeHash = createHash('sha256').update(await readFile(path.join(siteDir, 'extension-links.js'))).digest('hex').slice(0, 12);
  for (const [index, locale] of ['en', 'zh'].entries()) {
    const template = await readFile(path.join(siteDir, locale === 'zh' ? 'tools-cn.html' : 'tools.html'), 'utf8');
    await writeFile(path.join(siteDir, extensionPages[index]), renderExtensionPage(template, locale, runtimeHash));
  }
  for (const file of ['apps.html', 'tools.html', 'tools-cn.html', 'gif-maker-online.html', 'gif-maker-online-cn.html', 'screen-sharing-privacy-guide.html', 'mac-screen-privacy-cn.html']) {
    const filePath = path.join(siteDir, file);
    await writeFile(filePath, addExtensionDiscoveryLink(await readFile(filePath, 'utf8'), file.endsWith('-cn.html')));
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = process.argv.indexOf('--site-dir');
  await buildExtensionDiscovery(path.resolve(flag >= 0 ? process.argv[flag + 1] : process.env.SITE_DIR ?? path.join(import.meta.dirname, '..')));
  console.log('Built two Chrome extension pages and seven discovery links.');
}
