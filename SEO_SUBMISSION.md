# SEO Submission Checklist

Production domain: https://www.xiaozhonglvyou.com/

Sitemap index: https://www.xiaozhonglvyou.com/sitemap-index.xml

Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml

Text sitemap: https://www.xiaozhonglvyou.com/sitemap.txt

RSS feed: https://www.xiaozhonglvyou.com/feed.xml

Atom feed: https://www.xiaozhonglvyou.com/atom.xml

Search index: https://www.xiaozhonglvyou.com/search-index.json

## Completed On Site

- 44 indexable HTML pages, 107 JSON-LD blocks, 0 parse errors
- `robots.txt` allows 26+ crawler UAs including Googlebot, Bingbot, DuckDuckBot, Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, PetalBot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- `robots.txt` advertises sitemap-index, sitemap.xml, sitemap.txt, feed.xml, atom.xml
- `sitemap.xml` includes 44 URLs with lastmod 2026-07-08, changefreq, priority, hreflang alternates, and image entries
- `sitemap-index.xml` points to sitemap.xml, feed.xml, and atom.xml
- `sitemap.txt` lists 44 URLs in plain text format
- `feed.xml` (RSS 2.0, 21 items) and `atom.xml` (Atom, 9 entries) with 2026-07-08 dates
- `search-index.json` with 44 pages, includes title/description/h1/lang/category/headings
- `directory.html` human-readable page directory with grouped links
- `search.html` client-side site search with ?q= parameter support
- `llms.txt` with full page descriptions and discovery signals
- `security.txt` at root for responsible disclosure (E-E-A-T trust signal)

### Technical SEO
- All 44 pages: unique title (50-70 chars), unique meta description, single H1, canonical, viewport, robots=index,follow
- All 44 pages: og:locale (13 language regions mapped), og:image:secure_url, og:image:width/height/alt, og:site_name
- All 44 pages: manifest.webmanifest link, preconnect for googletagmanager and apps.apple.com
- 21 Article pages: og:article:published_time and og:article:modified_time (synced with JSON-LD)
- 44 pages: hreflang alternates (23 entries per localized page)
- No broken internal links, no orphan pages, all pages have >= 3 internal entry points
- No generic anchor text ("click here" etc.)
- No heading hierarchy skips
- No public-facing SEO terminology leaks

### Structured Data (107 blocks, 16 types)
- BreadcrumbList: 43 pages (all except index.html)
- FAQPage: 28 pages with 77+ Q&A pairs
- Article: 21 pages with datePublished/dateModified 2026-07-08
- WebPage: 16 pages
- CollectionPage: 4 hub pages
- SoftwareApplication: 4 (with applicationCategory, operatingSystem, softwareVersion, offers)
- ItemList: 3 hub pages
- HowTo: 3 guide pages with 19 total steps
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
- Last submission: 44 URLs, HTTP 200 response from Bing IndexNow endpoint

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
