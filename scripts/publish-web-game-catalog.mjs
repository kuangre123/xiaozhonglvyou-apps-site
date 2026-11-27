import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { minifyHtml } from './minify-html.mjs';

const site = 'https://www.xiaozhonglvyou.com';
const files = { en: 'web-games.html', zh: 'web-games-cn.html' };
const games = [
  {
    id: 'stardust',
    path: '/stardust/',
    image: 'assets/game-stardust.webp',
    type: 'CreativeWork',
    en: {
      name: 'A Brief History of Stardust',
      originalName: '星尘简史',
      category: 'Interactive 3D universe film',
      description: 'Travel through 13.8 billion years, from the early universe to Earth and human spaceflight.',
      how: 'Start the film, drag to rotate the view, or use the timeline to jump straight to a galaxy, the blue planet, or the Moon landing.',
      alt: 'The blue Earth against a star field, with the Stardust timeline on the right',
      play: 'Explore Stardust',
    },
    zh: {
      name: '星尘简史',
      category: '3D 互动宇宙短片',
      description: '从奇点、第一代恒星看到地球和人类登月，沿时间轴走过 138 亿年。',
      how: '点开始后，拖动可转动视角。想先看星系、蓝色行星或登月，可以直接点时间尺跳过去，也可以调整播放速度。',
      alt: '星尘简史里的蓝色地球，右侧是可跳转的宇宙时间尺',
      play: '进入星尘简史',
    },
  },
  {
    id: 'guomao',
    path: 'https://gta.xiaozhonglvyou.com/',
    image: 'assets/game-guomao.webp',
    type: 'VideoGame',
    en: {
      name: 'Guomao Never Sleeps',
      originalName: '国贸不打烊',
      category: 'Open-street motorcycle game',
      description: 'Ride through Beijing’s Guomao district, take ramps, fly through rings and check in at landmarks.',
      how: 'If you enjoy cruising around the city in GTA, take a motorcycle out around Guomao Bridge and the surrounding streets in this independent browser game. Use WASD to ride on desktop, or the on-screen controls on a touch device.',
      alt: 'A motorcycle rider facing glowing stunt rings on a street in Beijing’s Guomao district',
      play: 'Ride around Guomao',
    },
    zh: {
      name: '国贸不打烊',
      category: '3D 开放街区摩托游戏',
      description: '骑摩托逛北京国贸，飞跳台、过火圈，再去国贸桥等地标打卡。',
      how: '如果你喜欢 GTA 里开着车逛城市的感觉，可以在这款原创网页游戏里骑摩托探索北京国贸。电脑用 WASD 骑车，触屏设备用屏幕上的操作按钮。',
      alt: '国贸不打烊实机画面，摩托车骑手前方是街道和发光的特技火圈',
      play: '去国贸兜风',
    },
  },
];
const locales = {
  en: {
    lang: 'en', canonicalHome: '/', home: 'Home', section: 'Browser games',
    title: 'Guomao Never Sleeps & Stardust | Browser Games',
    description: 'Play Guomao Never Sleeps, a motorcycle game set in Beijing, or explore A Brief History of Stardust, an interactive 3D universe film.',
    intro: 'Ride through Beijing’s Guomao district or jump through 13.8 billion years of cosmic history. Open either experience in your browser.',
    more: 'See controls and game details', homeJump: 'Browser games', switchText: '中文', switchLang: 'zh-CN',
    faqKicker: 'Common questions', faqHeading: 'Controls, requirements, and browser playback.',
    faqs: [
      ['Are Stardust and Guomao Never Sleeps free to play?', 'Yes. Both browser experiences open directly in your web browser without an account, download, or payment.'],
      ['What controls work on desktop and mobile devices?', 'In A Brief History of Stardust, drag to rotate the 3D view and tap the timeline to jump to key cosmic eras. In Guomao Never Sleeps, use WASD keys on desktop or the on-screen touch controls on mobile and tablet browsers.'],
      ['What browser requirements do these 3D web experiences need?', 'Both experiences use interactive 3D rendering in the browser and require JavaScript with WebGL support in a current desktop or mobile browser.'],
      ['Do these browser games require installing an iPhone or Mac app?', 'No. They run independently in your browser and do not require installing any of the iOS, macOS, or Chrome extension tools on this site.'],
    ],
  },
  zh: {
    lang: 'zh-CN', canonicalHome: '/zh-cn.html', home: '中文首页', section: '网页游戏',
    title: '国贸不打烊与星尘简史｜狂热AI 网页游戏',
    description: '喜欢 GTA 的城市兜风？在线玩《国贸不打烊》，骑摩托探索北京国贸、飞跳台、过火圈和打卡。打开《星尘简史》，沿时间尺看 138 亿年宇宙演化，从奇点、星系到地球和登月。',
    intro: '想在北京国贸骑摩托兜风，还是沿时间轴看 138 亿年的宇宙演化？选一个作品，直接在浏览器打开。',
    more: '查看玩法与操作', homeJump: '网页游戏', switchText: 'English', switchLang: 'en',
    faqKicker: '常见问题', faqHeading: '玩法操作、浏览器要求与免费说明。',
    faqs: [
      ['《星尘简史》和《国贸不打烊》免费吗？需要登录吗？', '免费，打开网页即可直接体验，不需要注册账号、付费或下载安装包。'],
      ['电脑和手机分别怎么操作？', '《星尘简史》点击开始后可拖动旋转 3D 视角，点击右侧时间尺可跳转到不同宇宙阶段；《国贸不打烊》在电脑上用 WASD 骑车，在手机或平板触屏设备上使用屏幕上的方向与特技按钮。'],
      ['运行这些网页游戏需要什么浏览器环境？', '两款作品均为浏览器内运行的 3D 互动体验，需要使用支持 JavaScript 与 WebGL 的现代桌面或移动浏览器。'],
      ['玩网页游戏需要安装站内的 iPhone 应用或 Chrome 扩展吗？', '不需要。两款网页作品独立运行在浏览器中，与本站的 iOS、Mac 应用和 Chrome 扩展互不依赖。'],
    ],
  },
};
const escape = value => value.replace(/[&"<>]/g, char => ({
  '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;',
})[char]);

function renderCards(locale, detailed) {
  return games.map(game => {
    const c = game[locale];
    const name = c.originalName
      ? `${escape(c.name)} <span lang="zh-CN">· ${escape(c.originalName)}</span>`
      : escape(c.name);
    const tag = detailed ? 'h2' : 'h3';
    return `<article class="tool-card" id="game-${game.id}">
      <img src="${game.image}" width="960" height="540" loading="lazy" decoding="async" alt="${escape(c.alt)}">
      <p class="section-kicker">${escape(c.category)}</p>
      <${tag}>${name}</${tag}>
      <p>${escape(c.description)}</p>
      ${detailed ? `<p>${escape(c.how)}</p>` : ''}
      <a class="button button-primary" href="${game.path}" data-analytics-event="web_game_click" data-game-id="${game.id}">${escape(c.play)}</a>
    </article>`;
  }).join('');
}

function homeSection(locale) {
  const c = locales[locale];
  return `<section class="section content-section tool-page" id="web-games" aria-labelledby="web-games-title">
    <div class="section-inner">
      <div class="section-heading"><h2 id="web-games-title">${c.section}</h2>
        <p><a href="${files[locale]}">${c.more} →</a></p>
      </div>
      <div class="tool-card-grid">${renderCards(locale, false)}</div>
    </div>
  </section>`;
}

function gameHub(template, locale) {
  const c = locales[locale];
  const other = locale === 'en' ? 'zh' : 'en';
  const url = `${site}/${files[locale]}`;
  const firstGamePreview = `${site}/assets/og-web-games.jpg`;
  const meta = {
    description: c.description,
    'og:title': c.title,
    'og:description': c.description,
    'og:url': url,
    'og:image': firstGamePreview,
    'og:image:secure_url': firstGamePreview,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': games[0][locale].alt,
    'twitter:title': c.title,
    'twitter:description': c.description,
    'twitter:image': firstGamePreview,
  };
  const items = games.map((game, index) => ({
    '@type': 'ListItem', position: index + 1,
    item: {
      '@type': game.type, name: game[locale].name, alternateName: game[other].name,
      description: game[locale].description, url: new URL(game.path, site).href,
      image: `${site}/${game.image}`,
    },
  }));
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': `${url}#page`, url, name: c.title, description: c.description,
      inLanguage: c.lang, isPartOf: { '@id': `${site}/#website` }, publisher: { '@id': `${site}/#publisher` }, author: { '@id': `${site}/#developer` }, mainEntity: { '@id': `${url}#games` } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, name: c.section, numberOfItems: 2, itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.home, item: new URL(c.canonicalHome, site).href },
      { '@type': 'ListItem', position: 2, name: c.section, item: url },
    ] },
    { '@type': 'ItemList', '@id': `${url}#games`, name: c.section, numberOfItems: items.length, itemListElement: items },
    { '@type': 'FAQPage', '@id': `${url}#faq`, inLanguage: c.lang, mainEntity: c.faqs.map(([name, text]) => ({
      '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text },
    })) },
  ] };
  const faqHtml = `<section class="section faq" id="faq"><div class="section-inner">
      <div class="section-heading"><div><p class="section-kicker">${escape(c.faqKicker)}</p><h2>${escape(c.faqHeading)}</h2></div></div>
      <div class="faq-list">${c.faqs.map(([q, a], idx) => `<details${idx === 0 ? ' open' : ''}><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</div>
    </div></section>`;
  const body = `<main class="page-main" id="main-content">
    <section class="page-hero tool-intro">
      <div class="page-hero-copy">
        <nav class="breadcrumb" aria-label="${locale === 'zh' ? '面包屑导航' : 'Breadcrumb'}"><ol>
          <li><a href="${c.canonicalHome}">${c.home}</a></li><li aria-current="page">${c.section}</li>
        </ol></nav>
        <h1>${c.section} · ${locale === 'zh' ? '星尘简史与国贸不打烊' : 'Stardust and Guomao Never Sleeps'}</h1>
        <p class="hero-summary">${escape(c.intro)}</p>
        <p><a href="${files[other]}" lang="${c.switchLang}">${c.switchText}</a></p>
      </div>
    </section>
    <section class="section content-section" aria-label="${c.section}">
      <div class="section-inner"><div class="tool-card-grid">${renderCards(locale, true)}</div></div>
    </section>
    ${faqHtml}
  </main>`;
  const toolFile = locale === 'en' ? 'tools.html' : 'tools-cn.html';
  return minifyHtml(template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(c.title)}</title>`)
    .replace(/<meta (name|property)="([^"]+)" content="[^"]*"\s*\/?\s*>/g, (tag, attr, key) =>
      Object.hasOwn(meta, key) ? `<meta ${attr}="${key}" content="${escape(meta[key])}">` : tag)
    .replace(/(<link rel="canonical" href=")[^"]+/, `$1${url}`)
    .replace(/(<link rel="alternate" hreflang="(en|zh-CN|x-default)" href=")[^"]+/g,
      (_tag, start, lang) => `${start}${site}/${files[lang === 'zh-CN' ? 'zh' : 'en']}`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`)
    .replace(`<a href="${toolFile}" aria-current="page">`, `<a href="${toolFile}">`)
    .replace(new RegExp(`(<a href=")tools(?:-cn)?\\.html(" lang="${c.switchLang}">)`, 'g'), `$1${files[other]}$2`)
    .replace(/<main\b[\s\S]*?<\/main>/, body));
}

function replaceSection(html, section, before) {
  const existing = /<section\b[^>]* id="web-games"[\s\S]*?<\/section>/;
  if (existing.test(html)) return html.replace(existing, section);
  if (!before.test(html)) throw new Error('Missing games section insertion point');
  return html.replace(before, match => section + match);
}

export async function publishGameCatalog(siteDir = new URL('../', import.meta.url)) {
  const root = siteDir instanceof URL ? siteDir : pathToFileURL(siteDir.replace(/\/$/, '') + '/');
  const get = name => readFile(new URL(name, root), 'utf8');
  const put = (name, html) => writeFile(new URL(name, root), html);
  for (const [locale, home, template] of [['en', 'index.html', 'tools.html'], ['zh', 'zh-cn.html', 'tools-cn.html']]) {
    const html = await get(home);
    await put(files[locale], gameHub(await get(template), locale));
    const section = minifyHtml(homeSection(locale)).trim();
    const c = locales[locale];
    const footerLink = `<a href="#web-games">${c.homeJump}</a>`;
    const updated = replaceSection(html, section, locale === 'en'
      ? /<section class="section intro-band"/
      : /<section class="section content-section" id="browser-tools-cn"/);
    await put(home, updated.includes(footerLink) ? updated
      : updated.replace(/(<footer class="footer">[\s\S]*?<div>)(?=<a )/, `$1${footerLink} `));
  }
  const directory = await get('directory.html');
  await put('directory.html', replaceSection(directory, minifyHtml(`
    <section class="section content-section" id="web-games"><div class="section-inner">
      <h2>Browser games</h2><ul>
        <li><a href="web-games.html">Stardust and Guomao Never Sleeps</a></li>
        <li><a href="web-games-cn.html" lang="zh-CN">星尘简史与国贸不打烊</a></li>
      </ul>
    </div></section>`).trim(), /<\/main>/));
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await publishGameCatalog(process.env.SITE_DIR);
}
