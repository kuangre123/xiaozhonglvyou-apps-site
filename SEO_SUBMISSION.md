# SEO Submission Checklist

Production domain: https://www.xiaozhonglvyou.com/

Sitemap index: https://www.xiaozhonglvyou.com/sitemap-index.xml

Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml

Global-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-global.xml

Article sitemap: https://www.xiaozhonglvyou.com/sitemap-articles.xml

Text sitemap: https://www.xiaozhonglvyou.com/sitemap.txt

Global-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-global.txt

Article text sitemap: https://www.xiaozhonglvyou.com/sitemap-articles.txt

China-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.xml

China-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.txt

RSS feed: https://www.xiaozhonglvyou.com/feed.xml

Atom feed: https://www.xiaozhonglvyou.com/atom.xml

Search index: https://www.xiaozhonglvyou.com/search-index.json

## Completed On Site

- 51 indexable HTML pages, 118 JSON-LD blocks, 0 parse errors
- `robots.txt` allows 26+ crawler UAs including Googlebot, Bingbot, DuckDuckBot, Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, PetalBot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- `robots.txt` advertises sitemap-index, sitemap.xml, sitemap-global.xml, sitemap-articles.xml, sitemap-cn.xml, sitemap.txt, sitemap-global.txt, sitemap-articles.txt, sitemap-cn.txt, feed.xml, atom.xml
- `sitemap.xml` includes 51 URLs with per-page lastmod values through 2026-07-17, changefreq, priority, 413 hreflang alternate links, and 36 image entries
- `sitemap-index.xml` points to sitemap.xml, sitemap-global.xml, sitemap-articles.xml, sitemap-cn.xml, feed.xml, and atom.xml
- `sitemap-global.xml` lists 40 global, English, and localized non-Chinese landing pages for Google, Bing, Yandex, DuckDuckGo, and other international search platform submissions
- `sitemap-articles.xml` lists 23 Article/guide pages with per-page dateModified values from JSON-LD
- `sitemap-cn.xml` lists 11 Simplified and Traditional Chinese landing pages for Baidu, 360, Sogou, Shenma, and other Chinese search platform submissions
- `sitemap.txt` lists 51 URLs in plain text format
- `sitemap-global.txt` lists the same 40 global and international URLs in plain text format
- `sitemap-articles.txt` lists the same 23 Article/guide URLs in plain text format
- `sitemap-cn.txt` lists the same 11 Chinese-language URLs in plain text format
- `feed.xml` (RSS 2.0, 23 items) reflects Article updates through 2026-07-17; `atom.xml` remains a curated Atom feed with 11 entries
- `search-index.json` with 51 pages, includes title/description/h1/lang/category/headings
- `directory.html` human-readable page directory with grouped links
- `search.html` client-side site search with ?q= parameter support
- `llms.txt` with full page descriptions and discovery signals
- `security.txt` at root for responsible disclosure (E-E-A-T trust signal)

### Technical SEO
- All 51 indexable pages: unique title, unique meta description, single H1, canonical, viewport, robots=index,follow
- All 51 indexable pages: og:locale, og:image:secure_url, og:image:width/height/alt, og:site_name
- 32 single-product iOS pages expose validated Smart App Banner metadata with the correct app ID and canonical app argument
- All 47 indexable pages: manifest.webmanifest link, preconnect for googletagmanager and apps.apple.com
- 23 Article pages: og:article:published_time and og:article:modified_time (synced with JSON-LD)
- Localized, regional, and paired content pages: hreflang alternates (15 regional pages + 20 paired content pages)
- No broken internal links, no orphan pages, all pages have >= 3 internal entry points
- No generic anchor text ("click here" etc.)
- No heading hierarchy skips
- No public-facing SEO terminology leaks

### Structured Data (118 blocks, 15 top-level types)
- BreadcrumbList: 50 pages (all indexable pages except index.html)
- FAQPage: 38 pages with 172 visible and structured Q&A pairs
- Article: 23 pages with datePublished/dateModified synced per page
- WebPage: 21 pages
- CollectionPage: 5 pages
- SoftwareApplication: 10 entities covering six products (with applicationCategory, operatingSystem, softwareVersion, software requirements, feature lists, and offers)
- ItemList: 4 pages
- HowTo: 5 guide pages with 29 total steps
- Organization + Brand: 2 pages with sameAs (6 App Store links + GitHub repo)
- Person: 2 pages with knowsAbout
- WebSite: 1 with SearchAction (potentialAction for Sitelinks Search Box)
- SiteNavigationElement, AboutPage, ContactPage: 1 each

### Internationalization
- 15 regional/market pages with cross-links (Hub and Spoke)
- hreflang: en, en-US, en-GB, en-CA, en-AU, en-SG, en-CH, en-NL, en-SE, en-DK, en-FI, en-NO, zh-Hans, zh-Hant, ja-JP, ko-KR, de-DE, fr-FR, es-ES, it-IT + x-default
- Localized App Store links per market (24 unique external links)

### IndexNow
- Key file: https://www.xiaozhonglvyou.com/a6013cad6cead8e0.txt (verified HTTP 200)
- Automatic workflow: `.github/workflows/indexnow.yml`
- Trigger: every `main` push that changes public HTML or discovery files, plus manual `workflow_dispatch`
- Submit command: `node scripts/submit-indexnow.mjs --submit --output-json-path indexnow-report.json`
- Endpoints: `www.bing.com/indexnow`, `api.indexnow.org/IndexNow`, `yandex.com/indexnow`, `search.seznam.cz/indexnow`, `searchadvisor.naver.com/indexnow`
- Validation: rejects empty, duplicate, over-limit, and off-domain sitemap URL lists before submission
- Evidence: each workflow run saves `indexnow-report.json` as a 30-day GitHub Actions artifact
- Last submission: 46 URLs on 2026-07-15; Bing 200, api.indexnow.org 200, Yandex 202, Seznam 200, Naver 200

### Bing Readiness Audit
- Script: `node scripts/audit-bing-readiness.mjs`
- Checks: Bingbot/BingPreview allowed in robots.txt, sitemap advertised, IndexNow key valid, all indexable pages have meta keywords (Bing values these), meta description, canonical, and JSON-LD structured data
- Status: PASS (47 Bing-audited pages, all with keywords/description/canonical/JSON-LD)
- Bing Webmaster Tools property is active: the 2026-07-17 account screenshot shows Recommendations for `xiaozhonglvyou.com`. No `msvalidate.01` tag is present, which is expected when the property is verified through another supported method such as DNS or Google Search Console import.
- Latest deployment validation: commit `7613956`; added reciprocal hreflang and visible cross-links for the English and Simplified Chinese iPad photo organizer guides.
- Latest sitemap validation: commit `e5f2264`; 401 hreflang alternate links, including paired English/Simplified Chinese guide and app pages, are present in sitemap.xml.
- Latest global-focused sitemap validation: sitemap-global.xml and sitemap-global.txt contain 40 non-Chinese global and localized URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest article sitemap validation: commit `9c7afab`; sitemap-articles.xml and sitemap-articles.txt are live with 23 Article/guide URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest China-focused sitemap validation: sitemap-cn.xml contains 11 Chinese-language URLs and is advertised from robots.txt and sitemap-index.xml.
- Latest China-focused text sitemap validation: sitemap-cn.txt contains the same 11 Chinese-language URLs and is advertised from robots.txt.
- Latest people-first content pass: the English and Simplified Chinese iPhone photo-cleaner pages now use the real product screen and document version 1.1.3, iOS 16 compatibility, nine explicit categories, on-device processing, and review-before-delete behavior checked against the current App Store listing on 2026-07-13. Regional and guide copy that addressed search traffic instead of readers was rewritten around practical user tasks.
- Latest product evidence pass: Anti-spy screen Lite was refreshed to version 1.4.1, including hidden-app reminders, and the English and Simplified Chinese Mac privacy facts were rechecked against Apple's public records on 2026-07-17.
- Latest app portfolio pass: GIFmaker 1.1.1 and HappyRide 1.2 now have English and Simplified Chinese product pages, App Store IDs, official icons, verified compatibility, SoftwareApplication entities, FAQs, hreflang pairs, Smart App Banners, support/privacy anchors, and sitemap/search discovery.
- Latest ASO pass: `ASO_ACTIONS.md` contains length-checked names, subtitles, 100-byte keyword fields, promotional text, screenshot order, and product-specific App Store Connect URLs for GIFmaker and HappyRide. `scripts/audit-aso-readiness.mjs` reports PASS.

### High-quality inbound link readiness
- `media-kit.html` provides review-ready product facts, clean canonical links, first-party images, an editorial disclosure, and a correction contact.
- `BACKLINK_ACTIONS.md` maps Marketing, Support, and Privacy URLs for all six apps in App Store Connect.
- `scripts/audit-backlink-readiness.mjs` verifies the site-side media destination, URL map, support/privacy anchors, and GitHub README links without falsely claiming that an external backlink already exists.
- The public GitHub repository links the homepage and product pages. HappyRide currently links the generic domain homepage from Apple, GIFmaker links an older GitHub Pages site, and earlier product pages did not expose the canonical domain; product-specific App Store Connect URLs remain the P0 external action.

## Public Indexing Baseline (2026-07-13)

Public `site:` and exact-domain searches provide a directional baseline, not the authoritative index coverage available inside webmaster accounts.

- Google displayed 30 unique site pages across three result pages. It included the homepage, core app pages, Simplified Chinese product pages, and several regional pages.
- Bing displayed the homepage in an exact-domain query; its result-count estimate was not consistent with the visible result page.
- Baidu reported approximately 1 indexed page and displayed the homepage.
- 360 Search reported approximately 1 indexed page and displayed the homepage.
- Sogou reported 0 matching pages.
- High-value pages not visible in the Google public result set included the best photo cleaner guide, both iPad organizer guides, the voice/camera translator guide, and the German and French photo-cleaner guides. The first content-strengthening pass expanded those six guides to five user questions each.
- The second pass added five localized questions to the German, French, and Spanish market pages, expanded the Japanese and Traditional Chinese pages to five questions, and corrected visible localized wording that exposed internal search-planning language.
- Recheck the same public queries after crawler processing, then use Google Search Console, Bing Webmaster Tools, Baidu, 360, and Sogou webmaster accounts for authoritative coverage and exclusion reasons.

## External Platform Actions

The following actions require user accounts on each search engine's webmaster platform:

### Google Search Console
- URL: https://search.google.com/search-console
- Add property: https://www.xiaozhonglvyou.com/
- Verification: add `<meta name="google-site-verification" content="TOKEN" />` to index.html head
- Submit sitemap: https://www.xiaozhonglvyou.com/sitemap-index.xml
- Monitor: Coverage, Performance, Core Web Vitals, Mobile Usability

### Bing Webmaster Tools
- URL: https://www.bing.com/webmasters
- Property: active for https://www.xiaozhonglvyou.com/
- Confirm submitted sitemap: https://www.xiaozhonglvyou.com/sitemap-index.xml
- IndexNow already configured for automatic Bing submission
- Monitor Backlinks after App Store and editorial links are public and recrawled

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
