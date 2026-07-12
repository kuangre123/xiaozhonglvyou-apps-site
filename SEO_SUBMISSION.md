# SEO Submission Checklist

Production domain: https://www.xiaozhonglvyou.com/

Sitemap index: https://www.xiaozhonglvyou.com/sitemap-index.xml

Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml

Global-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-global.xml

Text sitemap: https://www.xiaozhonglvyou.com/sitemap.txt

Global-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-global.txt

China-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.xml

China-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.txt

RSS feed: https://www.xiaozhonglvyou.com/feed.xml

Atom feed: https://www.xiaozhonglvyou.com/atom.xml

Search index: https://www.xiaozhonglvyou.com/search-index.json

## Completed On Site

- 46 indexable HTML pages, 109 JSON-LD blocks, 0 parse errors
- `robots.txt` allows 26+ crawler UAs including Googlebot, Bingbot, DuckDuckBot, Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, PetalBot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- `robots.txt` advertises sitemap-index, sitemap.xml, sitemap-global.xml, sitemap-cn.xml, sitemap.txt, sitemap-global.txt, sitemap-cn.txt, feed.xml, atom.xml
- `sitemap.xml` includes 46 URLs with lastmod 2026-07-13, changefreq, priority, 401 hreflang alternate links, and image entries
- `sitemap-index.xml` points to sitemap.xml, sitemap-global.xml, sitemap-cn.xml, feed.xml, and atom.xml
- `sitemap-global.xml` lists 37 global, English, and localized non-Chinese landing pages for Google, Bing, Yandex, DuckDuckGo, and other international search platform submissions
- `sitemap-cn.xml` lists 9 Simplified and Traditional Chinese landing pages for Baidu, 360, Sogou, Shenma, and other Chinese search platform submissions
- `sitemap.txt` lists 46 URLs in plain text format
- `sitemap-global.txt` lists the same 37 global and international URLs in plain text format
- `sitemap-cn.txt` lists the same 9 Chinese-language URLs in plain text format
- `feed.xml` (RSS 2.0, 23 items) and `atom.xml` (Atom, 11 entries) with 2026-07-13 dates
- `search-index.json` with 46 pages, includes title/description/h1/lang/category/headings
- `directory.html` human-readable page directory with grouped links
- `search.html` client-side site search with ?q= parameter support
- `llms.txt` with full page descriptions and discovery signals
- `security.txt` at root for responsible disclosure (E-E-A-T trust signal)

### Technical SEO
- All 46 indexable pages: unique title, unique meta description, single H1, canonical, viewport, robots=index,follow
- All 46 indexable pages: og:locale, og:image:secure_url, og:image:width/height/alt, og:site_name
- All 46 indexable pages: manifest.webmanifest link, preconnect for googletagmanager and apps.apple.com
- 23 Article pages: og:article:published_time and og:article:modified_time (synced with JSON-LD)
- Localized, regional, and paired content pages: hreflang alternates (15 regional pages + 16 paired content pages)
- No broken internal links, no orphan pages, all pages have >= 3 internal entry points
- No generic anchor text ("click here" etc.)
- No heading hierarchy skips
- No public-facing SEO terminology leaks

### Structured Data (109 blocks, 15 top-level types)
- BreadcrumbList: 45 pages (all indexable pages except index.html)
- FAQPage: 30 pages with 85+ Q&A pairs
- Article: 23 pages with datePublished/dateModified synced per page
- WebPage: 17 pages
- CollectionPage: 4 hub pages
- SoftwareApplication: 4 (with applicationCategory, operatingSystem, softwareVersion, offers)
- ItemList: 3 hub pages
- HowTo: 5 guide pages with 29 total steps
- Organization + Brand: 2 pages with sameAs (4 App Store links + GitHub repo)
- Person: 2 pages with knowsAbout
- WebSite: 1 with SearchAction (potentialAction for Sitelinks Search Box)
- SiteNavigationElement, AboutPage, ContactPage: 1 each

### Internationalization
- 15 regional/market pages with cross-links (Hub and Spoke)
- hreflang: en, en-US, en-GB, en-CA, en-AU, en-SG, en-CH, en-NL, en-SE, en-DK, en-FI, en-NO, zh-Hans, zh-Hant, ja-JP, ko-KR, de-DE, fr-FR, es-ES, it-IT + x-default
- Localized App Store links per market (24 unique external links)

### IndexNow
- Key file: https://www.xiaozhonglvyou.com/a6013cad6cead8e0.txt (verified HTTP 200)
- Submit command: `node scripts/submit-indexnow.mjs --submit`
- Last submission: 46 URLs on 2026-07-13; Bing 200, Yandex 200, Seznam 200, Naver 200
- Latest deployment validation: commit `7613956`; added reciprocal hreflang and visible cross-links for the English and Simplified Chinese iPad photo organizer guides.
- Latest sitemap validation: commit `e5f2264`; 401 hreflang alternate links, including paired English/Simplified Chinese guide and app pages, are present in sitemap.xml.
- Latest global-focused sitemap validation: commit `ea1dec9`; sitemap-global.xml and sitemap-global.txt are live with 37 non-Chinese global and localized URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest China-focused sitemap validation: commit `4f82978`; sitemap-cn.xml is live with 9 Chinese-language URLs and is advertised from robots.txt and sitemap-index.xml.
- Latest China-focused text sitemap validation: commit `014bda0`; sitemap-cn.txt is live with the same 9 Chinese-language URLs and is advertised from robots.txt.

## Requires External Platform Accounts

The following actions require user accounts on each search engine's webmaster platform:

### Google Search Console
- URL: https://search.google.com/search-console
- Add property: https://www.xiaozhonglvyou.com/
- Verification: add `<meta name="google-site-verification" content="TOKEN" />` to index.html head
- Submit sitemap: https://www.xiaozhonglvyou.com/sitemap-index.xml
- Monitor: Coverage, Performance, Core Web Vitals, Mobile Usability

### Bing Webmaster Tools
- URL: https://www.bing.com/webmasters
- Add site: https://www.xiaozhonglvyou.com/
- Submit sitemap: https://www.xiaozhonglvyou.com/sitemap-index.xml
- IndexNow already configured for automatic Bing submission

### Baidu Ziyuan Pingtai (Baidu Webmaster)
- URL: https://ziyuan.baidu.com
- Add site: https://www.xiaozhonglvyou.com/
- Verification: add `<meta name="baidu-site-verification" content="TOKEN" />` to index.html head
- Submit sitemap manually (Baidu does not fully respect robots.txt Sitemap directive)
- Note: Baidu may need 1-2 weeks for initial indexing

### 360 Webmaster
- URL: https://zhanzhang.so.com
- Add site and verify
- Submit sitemap

### Sogou Webmaster
- URL: https://zhanzhang.sogou.com
- Add site and verify
- Submit URLs

### Shenma (UC) Webmaster
- URL: https://zhanzhang.sm.cn
- Add site and verify
- Submit sitemap

### Yandex Webmaster
- URL: https://webmaster.yandex.com
- Add site and verify
- Submit sitemap
