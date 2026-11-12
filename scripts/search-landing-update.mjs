import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articleUpdateDate } from './article-update-date.mjs';

export const releaseDate = '2026-11-12';
export const landingPages = {
  'screen-sharing-privacy-guide.html': {
    title: 'Hide Notifications When Screen Sharing on Mac',
    description: 'Hide Mac notifications before screen sharing. Follow built-in settings for Zoom, Meet and Teams, choose one window, and check what others can see.',
    heading: 'Hide notifications when screen sharing on Mac.',
    summary: 'Start with the built-in macOS notification setting, then choose a window or tab in Zoom, Meet or Teams. Follow the six-step checklist and check the receiving screen before your meeting.'
  },
  'ai-photo-organizer-guide.html': {
    title: 'Organize iPhone Photos: Apple Photos & AI Options',
    description: 'Organize iPhone photos with Apple Photos search and albums, or compare nine Pro AI categories. See the steps, cleanup limits and what needs a subscription.',
    heading: 'How to organize iPhone photos with Apple Photos or AI.',
    summary: 'Use Apple Photos search and albums to organize your library, or compare AI Cleaning’s nine Pro categories. Start with the built-in steps, then check what an optional subscription adds before choosing.'
  },
  'image-compressor-cn.html': {
    title: '免费在线图片压缩：JPG、PNG、WebP 与尺寸调整 | CrazyAIAgent',
    description: '免费在线压缩 JPG、PNG、WebP 静态图片，支持调整宽高和输出格式。在浏览器本地处理，无需注册或上传图片；对比压缩前后的像素、实际文件大小和画面细节，预览后下载新文件。',
    heading: '免费在线图片压缩与尺寸调整。',
    summary: '选择 JPG、PNG 或 WebP 静态图片，设置宽高和输出格式，比较文件大小与画面细节后下载。处理在当前浏览器完成，无需注册或上传图片。'
  },
  'gif-maker-online-cn.html': {
    title: '免费在线 GIF 制作与压缩：图片、视频转动图 | CrazyAIAgent',
    description: '免费在线用图片或短视频制作 GIF，也可调整已有动图的尺寸和保留帧间隔以减小体积。媒体文件在浏览器本地处理；对比预览、播放效果和实际文件大小，再下载生成的动图并保留原文件。',
    heading: '图片、视频转 GIF，也能压缩已有动图。',
    summary: '选择图片、短视频或已有 GIF，调整尺寸、选段和播放选项。素材在当前浏览器处理，无需上传；生成后先预览，再对比文件体积并下载。'
  },
  'cycling-speed-calculator-cn.html': {
    title: '骑行时间、距离与平均速度计算器：公里与英里 | CrazyAIAgent',
    description: '输入距离、骑行时间和平均速度中的两项，在线计算第三项，支持公里与英里。休息分钟单独填写，比较骑行均速、全程均速和总时长；附公式与计算示例，结果按输入值计算，不代表实时路况或导航预计。',
    heading: '骑行时间、距离与平均速度，输入两项计算第三项。',
    summary: '想知道一段距离要骑多久？输入距离与假设均速即可估算；也能由距离和时间计算均速。公里与英里可切换，途中休息单独计入全程时长。'
  },
  'mac-screen-privacy-cn.html': {
    title: 'Mac 共享屏幕隐藏通知与防窥指南 | CrazyAIAgent',
    description: 'Mac 共享屏幕前先检查通知设置、共享窗口和接收端画面，再按场景选择应用隐藏、隐私遮挡或物理防窥膜。提供系统设置入口与操作边界，了解 Anti-spy screen 和 Lite 的用途及安装要求。',
    heading: 'Mac 共享屏幕如何隐藏通知、保护敏感窗口？'
  }
};
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function updateSearchLandingPage(html, file) {
  const config = landingPages[file];
  if (config) {
    if (!html.includes(`rel="canonical" href="https://www.xiaozhonglvyou.com/${file}"`)) throw new Error(`Unexpected canonical: ${file}`);
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(config.title)}</title>`);
    for (const [attribute, name, value] of [['name','description',config.description],['property','og:title',config.title],['property','og:description',config.description],['name','twitter:title',config.title],['name','twitter:description',config.description]]) {
      const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}="${name}")[^>]*>`, 'i');
      if (!pattern.test(html)) throw new Error(`Missing ${name}: ${file}`);
      html = html.replace(pattern, tag => tag.replace(/content="[^"]*"/, `content="${escape(value)}"`));
    }
    html = html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/, `<h1>${escape(config.heading)}</h1>`);
    if (config.summary) html = html.replace(/<p class="hero-summary">[\s\S]*?<\/p>/, `<p class="hero-summary">${escape(config.summary)}</p>`);
    const updated = articleUpdateDate(html, releaseDate);
    html = updated.html;
    html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
      const data = JSON.parse(json);
      const visit = node => {
        if (!node || typeof node !== 'object') return;
        const types = [].concat(node['@type'] || []);
        if (types.some(t => ['WebPage','Article','WebApplication'].includes(t))) {
          node.description = config.description;
          if (types.includes('WebPage')) node.name = config.heading;
          if (types.includes('Article')) {
            node.headline = config.heading;
            const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
            node.wordCount = main.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/).length;
          }
          if (types.some(t => ['WebPage','Article'].includes(t))) node.dateModified = updated.date;
        }
        Object.values(node).forEach(visit);
      };
      visit(data); return open + JSON.stringify(data) + close;
    });
  }
  if (file === 'zh-cn.html') {
    const section = '<section class="section content-section" id="browser-tools-cn"><div class="section-inner"><div class="section-heading"><div><p class="section-kicker">直接在网页使用</p><h2>免费图片压缩、GIF 制作与骑行计算。</h2><p>先选择要完成的任务，无需安装应用即可开始。媒体工具在当前浏览器处理所选文件。</p></div></div><div class="tool-card-grid"><article class="tool-card"><h3><a href="image-compressor-cn.html">在线图片压缩与尺寸调整</a></h3><p>处理 JPG、PNG、WebP 静态图片，比较像素和文件大小，预览后下载。</p></article><article class="tool-card"><h3><a href="gif-maker-online-cn.html">图片、视频转 GIF 与动图压缩</a></h3><p>按素材类型选择操作，调整尺寸和播放选项，生成后检查实际动图。</p></article><article class="tool-card"><h3><a href="cycling-speed-calculator-cn.html">骑行时间、距离与速度计算器</a></h3><p>输入两项计算第三项，支持公里与英里，休息时间单独计入。</p></article></div><p><a href="tools-cn.html">查看全部免费工具与中文教程</a></p></div></section>';
    html = html.replace(/<section\b[^>]*id="browser-tools-cn"[^>]*>[\s\S]*?<\/section>/g, '');
    const hero = /<section\b[^>]*class="page-hero"[^>]*>[\s\S]*?<\/section>/;
    if (!hero.test(html)) throw new Error('Chinese homepage hero is missing');
    html = html.replace(hero, match => match + section);
  }
  if (file === 'index.html') html = html.replace('Six focused apps for iPhone, Apple Watch, and Mac:', 'Nine focused apps for iPhone, Apple Watch, and Mac:');
  return html;
}

export async function updateLandingPages(siteDir) {
  const changed = [];
  for (const file of [...Object.keys(landingPages), 'zh-cn.html', 'index.html']) {
    const target = path.join(siteDir, file);
    const before = await readFile(target, 'utf8');
    const after = updateSearchLandingPage(before, file);
    if (before !== after) { await writeFile(target, after); changed.push(file); }
  }
  return changed;
}

// Derive the China submission list from the actual indexable Chinese documents.
export async function updateChineseSitemap(siteDir) {
  const origin = 'https://www.xiaozhonglvyou.com/';
  const main = await readFile(path.join(siteDir, 'sitemap.xml'), 'utf8');
  const entries = new Map([...main.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => [m[1].match(/<loc>([^<]+)<\/loc>/)?.[1], m[0]]));
  const urls = [];
  for (const file of (await readdir(siteDir)).filter(f => f.endsWith('.html')).sort()) {
    const html = await readFile(path.join(siteDir, file), 'utf8');
    if (!/<html\b[^>]*lang="zh(?:-|\")/i.test(html) || /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html)) continue;
    const url = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    if (url === origin + file && entries.has(url)) urls.push(url);
  }
  if (!urls.length) throw new Error('No canonical Chinese sitemap URLs');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.map(url => entries.get(url)).join('\n') + '\n</urlset>\n';
  await writeFile(path.join(siteDir, 'sitemap-cn.xml'), xml);
  await writeFile(path.join(siteDir, 'sitemap-cn.txt'), urls.join('\n') + '\n');
  return urls;
}

export async function refreshLandingSitemapDates(siteDir) {
  const changedUrls = new Set([...Object.keys(landingPages), 'zh-cn.html', 'index.html'].map(file => 'https://www.xiaozhonglvyou.com/' + (file === 'index.html' ? '' : file)));
  for (const file of ['sitemap.xml','sitemap-global.xml','sitemap-local.xml','sitemap-articles.xml']) {
    const target = path.join(siteDir, file);
    const before = await readFile(target, 'utf8');
    const after = before.replace(/<url>([\s\S]*?)<\/url>/g, block => {
      const url = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      const date = [releaseDate, block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || ''].sort().at(-1);
      return changedUrls.has(url) ? block.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${date}</lastmod>`) : block;
    });
    if (after !== before) await writeFile(target, after);
  }
}

export async function refreshSitemapIndexDates(siteDir) {
  const dates = new Map();
  for (const file of ['sitemap.xml','sitemap-global.xml','sitemap-local.xml','sitemap-articles.xml','sitemap-cn.xml']) {
    const xml = await readFile(path.join(siteDir, file), 'utf8');
    dates.set('https://www.xiaozhonglvyou.com/' + file, [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]).sort().at(-1));
  }
  const atom = await readFile(path.join(siteDir, 'atom.xml'), 'utf8');
  const rss = await readFile(path.join(siteDir, 'feed.xml'), 'utf8');
  dates.set('https://www.xiaozhonglvyou.com/atom.xml', [...atom.matchAll(/<updated>(\d{4}-\d{2}-\d{2})[^<]*<\/updated>/g)].map(m => m[1]).sort().at(-1));
  const buildDate = rss.match(/<lastBuildDate>([^<]+)<\/lastBuildDate>/)?.[1];
  if (buildDate) dates.set('https://www.xiaozhonglvyou.com/feed.xml', new Date(buildDate).toISOString().slice(0, 10));
  const target = path.join(siteDir, 'sitemap-index.xml');
  const before = await readFile(target, 'utf8');
  const after = before.replace(/<sitemap>([\s\S]*?)<\/sitemap>/g, block => {
    const date = dates.get(block.match(/<loc>([^<]+)<\/loc>/)?.[1]);
    return date ? block.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${date}</lastmod>`) : block;
  });
  if (after !== before) await writeFile(target, after);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const siteDir = process.env.SITE_DIR ? path.resolve(process.env.SITE_DIR) : path.resolve(import.meta.dirname, '..');
  console.log('Updated landing pages:', await updateLandingPages(siteDir));
  if (process.argv.includes('--chinese-sitemap')) {
    await refreshLandingSitemapDates(siteDir);
    console.log('Chinese sitemap URLs:', (await updateChineseSitemap(siteDir)).length);
    await refreshSitemapIndexDates(siteDir);
  }
}
