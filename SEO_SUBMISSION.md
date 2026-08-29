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

- 55 indexable HTML pages, 128 JSON-LD blocks, 183 top-level structured-data nodes, 0 parse errors
- `robots.txt` allows 39 named search crawler UAs including Googlebot, Bingbot, MicrosoftPreview, DuckDuckBot, Slurp, Yahoo! JAPAN Y!J/YJ crawlers, Yandex, Mail.RU_Bot, Yeti, Daum, SeznamBot, Qwantbot/Qwantify, Coc Coc, Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, PetalBot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- `robots.txt` advertises sitemap-index, sitemap.xml, sitemap-global.xml, sitemap-articles.xml, sitemap-cn.xml, sitemap.txt, sitemap-global.txt, sitemap-articles.txt, sitemap-cn.txt, feed.xml, atom.xml
- `sitemap.xml` includes 55 URLs with per-page lastmod values through 2026-08-29, changefreq, priority, 413 hreflang alternate links, and 90 image entries
- `sitemap-index.xml` points to sitemap.xml, sitemap-global.xml, sitemap-articles.xml, sitemap-cn.xml, feed.xml, and atom.xml
- `sitemap-global.xml` lists 42 global, English, and localized non-Chinese landing pages for Google, Bing, Yandex, DuckDuckGo, and other international search platform submissions
- `sitemap-articles.xml` lists 27 Article/guide pages with per-page dateModified values from JSON-LD
- `sitemap-cn.xml` lists 11 Simplified and Traditional Chinese landing pages for Baidu, 360, Sogou, Shenma, and other Chinese search platform submissions
- `sitemap.txt` lists 55 URLs in plain text format
- `sitemap-global.txt` lists the same 42 global and international URLs in plain text format
- `sitemap-articles.txt` lists the same 27 Article/guide URLs in plain text format
- `sitemap-cn.txt` lists the same 11 Chinese-language URLs in plain text format
- `feed.xml` and `atom.xml` each expose 27 Article entries with updates through 2026-08-29
- `search-index.json` with 55 pages, includes title/description/h1/lang/category/headings
- `directory.html` human-readable page directory with grouped links
- `search.html` client-side site search with ?q= parameter support
- `llms.txt` with full page descriptions and discovery signals
- `security.txt` at root for responsible disclosure (E-E-A-T trust signal)

### Technical SEO
- All 55 indexable pages: unique title, unique meta description, single H1, canonical, viewport, robots=index,follow
- All 55 indexable pages: og:locale, og:image:secure_url, og:image:width/height/alt, og:site_name
- 36 single-product iOS pages expose validated Smart App Banner metadata with the correct app ID and canonical app argument
- All 55 indexable pages: manifest.webmanifest link, preconnect for googletagmanager and apps.apple.com
- `manifest.webmanifest`: 3 validated icons, 2 screenshots, 4 app shortcuts, explicit language, and standalone display metadata
- All 147 visible App Store links: GA4 `app_store_click` event metadata, product/storefront identifiers, accessible labels, and safe new-tab attributes
- 27 Article pages: og:article:published_time and og:article:modified_time (synced with JSON-LD)
- 55 indexable pages: Atom alternate links point to the canonical 27-entry Atom feed, with titles, summaries, links, and dates checked against Article JSON-LD
- 27 Article nodes: page-specific topic keyword sets are aligned with each article's title, description, language, and search intent; legacy generic brand keywords are rejected by the readiness audit
- Localized, regional, and paired content pages: hreflang alternates (15 regional pages + 20 paired content pages)
- No broken internal links; all 55 indexable pages have at least 3 unique inbound HTML source pages. The coverage audit excludes the noindex 404 page and counts each distinct linking HTML page once, so the market directory is reachable from the homepage, directory hub, and apps hub.
- No generic anchor text ("click here" etc.)
- No heading hierarchy skips
- No public-facing SEO terminology leaks

### Structured Data (128 blocks, 15 top-level types, 183 nodes)
- BreadcrumbList: 54 pages (all indexable pages except index.html)
- FAQPage: 43 pages with 225 visible and structured Q&A pairs
- Article: 27 pages with datePublished/dateModified synced per page
- WebPage: 21 pages
- CollectionPage: 5 pages
- SoftwareApplication: 10 entities covering six products (with applicationCategory, operatingSystem, softwareVersion, software requirements, feature lists, and offers)
- ItemList: 4 pages
- HowTo: 11 pages with matched English and Simplified Chinese GIF creation and automatic cycling setup instructions
- Organization + Brand: 2 pages with sameAs (App Store developer page, 6 product pages, and GitHub repo)
- Person: 2 pages identifying Bo Chen with the current public App Store developer page and knowsAbout topics
- WebSite: 1 with SearchAction (potentialAction for Sitelinks Search Box)
- SiteNavigationElement, AboutPage, ContactPage: 1 each

### Internationalization
- 15 regional/market pages with cross-links (Hub and Spoke)
- hreflang: en, en-US, en-GB, en-CA, en-AU, en-SG, en-CH, en-NL, en-SE, en-DK, en-FI, en-NO, zh-Hans, zh-Hant, ja-JP, ko-KR, de-DE, fr-FR, es-ES, it-IT + x-default
- Localized App Store links per market (24 unique external links)

### Local Search Engine Matrix

Research date: 2026-08-29. Treat market-share figures as directional snapshots because national search panels and domestic query-share panels can diverge materially.

| Market | Search engines that need explicit attention | Current site-side coverage | Manual platform action |
| --- | --- | --- | --- |
| Japan | Google remains the main mobile index; Bing is material on desktop; Yahoo! JAPAN is a major local search and portal surface. StatCounter reported Japan July 2026 all-platform share as Google 59.73%, Bing 32.07%, Yahoo! 6.55%. Yahoo! JAPAN also documents its own Y!J crawler family. | `ja-jp.html` is in the hreflang cluster; `robots.txt` now explicitly allows Googlebot, Bingbot, Slurp, and Yahoo! JAPAN Y!J/YJ crawler spellings including `Y!J-BRW`. | Submit `sitemap-global.xml`, `sitemap-articles.xml`, and `ja-jp.html` in Google Search Console and Bing Webmaster Tools; monitor Yahoo! JAPAN referrals separately from Google/Bing because the portal and crawler signals can differ. |
| South Korea | Naver is a required local surface, and Korean market-share sources conflict because Naver answers many queries inside its own properties. Daum remains a smaller Korean search surface. | `ko-kr.html` is in the hreflang cluster; `robots.txt` now explicitly allows Naver `Yeti` and Daum. | Verify the canonical domain in Naver Search Advisor, submit `sitemap-global.xml`, request recrawl for `ko-kr.html`, and track Naver/Daum separately from Google organic. |
| Mainland China | Baidu is the primary domestic engine; 360, Sogou, Shenma/Yisou, ByteDance search, Huawei Petal, and Bing are useful secondary surfaces for Chinese-language discovery. | `sitemap-cn.xml` and `sitemap-cn.txt` contain the Chinese-language pages; `robots.txt` explicitly allows Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, and PetalBot. | Verify in Baidu Search Resource Platform, submit `sitemap-cn.xml`, use Baidu quick inclusion for newly changed Chinese pages, then repeat ownership/submission in 360, Sogou, and Shenma webmaster tools. |
| Russia and CIS | Yandex is the local leader in Russia; Mail.ru is a secondary Russian surface. This site does not currently have Russian-language landing pages. | `robots.txt` now explicitly allows `Yandex`, `YandexBot`, and `Mail.RU_Bot`; IndexNow includes the Yandex endpoint. | Keep Yandex Webmaster configured with `sitemap-global.xml`; do not create Russian pages until the app store copy, support path, and privacy wording can be localized accurately. |
| Czechia | Seznam remains a meaningful local Czech engine. StatCounter reported Czech Republic July 2026 share as Google 81.07%, Seznam 14.05%, Bing 3.72%. | `robots.txt` now explicitly allows `SeznamBot`; IndexNow includes the Seznam endpoint. | If Czech localization becomes a priority, create a Czech market page and submit `sitemap-global.xml` in Seznam Webmaster. Until then, keep global pages crawlable and monitor referrals. |
| France and EU privacy segment | Google and Bing remain primary in France, but Qwant is a French search engine with its own crawler/user-agent guidance. | `fr-fr.html` and `nettoyeur-photo-iphone-fr.html` are in hreflang clusters; `robots.txt` now allows `Qwantbot` and `Qwantify`. | Track Qwant referrals as a small but relevant privacy-aligned segment; keep French page claims concrete and tied to App Store/privacy evidence. |
| Vietnam | Google dominates all-platform share, but Coc Coc is the clearest surviving national challenger engine in Vietnam. | No Vietnamese landing page yet; `robots.txt` now allows Coc Coc crawler spellings so existing English/global pages remain discoverable. | Treat Vietnamese localization as a later expansion candidate; do not submit translated pages until real localized copy exists. |
| US, UK, Canada, Australia, Germany, Switzerland, Netherlands, and Nordics | Google leads; Bing/Yahoo/DuckDuckGo are the practical secondary engines. Germany also has above-average privacy/mission search use through DuckDuckGo and Ecosia. | Regional pages, `sitemap-global.xml`, `sitemap-articles.xml`, Bing meta-keyword coverage, IndexNow, RSS, Atom, and `llms.txt` are already in place. | Continue Google Search Console and Bing Webmaster monitoring; use Bing data as the operational proxy for Yahoo Search and Copilot grounding. |

Research sources used for this matrix:

- StatCounter Japan search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all/japan
- SearchEngines.Net country search share synthesis, updated 2026-08-19: https://www.searchengines.net/guides/search-engine-market-share-by-country/
- StatCounter Czech Republic search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all-worldwide/czech-republic
- Yahoo! JAPAN crawler guidance: https://info-search.yahoo.co.jp/crawl/ and https://support.yahoo-net.jp/SccSearch/s/article/H000007955
- Naver robots.txt guidance for `Yeti`: https://help.naver.com/service/30010/contents/17638?osType=PC
- Naver crawl request API guidance: https://searchadvisor.naver.com/guide/crawl-request-api
- Baidu Search Resource Platform quick inclusion and resources: https://ziyuan.baidu.com/dailysubmit/index
- Baiduspider robots.txt guidance: https://www.baidu.com/search/robots_english.html
- Yandex Webmaster sitemap guidance: https://www.yandex.com/support/webmaster/en/indexing-options/sitemap
- Qwant crawler guidance: https://help.qwant.com/bot/
- Daum robots guidance: https://cs.daum.net/faq/service/15/category/4118/detail/36354

### IndexNow
- Key file: https://www.xiaozhonglvyou.com/a6013cad6cead8e0.txt (verified HTTP 200)
- Automatic workflow: `.github/workflows/indexnow.yml`
- Trigger: every `main` push that changes public HTML or discovery files, plus manual `workflow_dispatch`
- Submit command: `node scripts/submit-indexnow.mjs --submit --output-json-path indexnow-report.json`
- Endpoints: `www.bing.com/indexnow`, `api.indexnow.org/IndexNow`, `yandex.com/indexnow`, `search.seznam.cz/indexnow`, `searchadvisor.naver.com/indexnow`
- Validation: rejects empty, duplicate, over-limit, and off-domain sitemap URL lists before submission
- Evidence: each workflow run saves `indexnow-report.json` as a 30-day GitHub Actions artifact
- Latest verified automated run: the IndexNow readiness audit now validates the 55-URL sitemap; each workflow run preserves endpoint-level evidence in `indexnow-report.json`.

### Bing Readiness Audit
- Script: `node scripts/audit-bing-readiness.mjs`
- Checks: Bingbot/BingPreview allowed in robots.txt, sitemap advertised, IndexNow key valid, all indexable pages have meta keywords (Bing values these), meta description, canonical, and JSON-LD structured data
- Status: PASS (55 Bing-audited pages, all with keywords/description/canonical/JSON-LD; the only excluded HTML file is the noindex 404 page)
- Bing Webmaster Tools property is active: the 2026-07-17 account screenshot shows Recommendations for `xiaozhonglvyou.com`. No `msvalidate.01` tag is present, which is expected when the property is verified through another supported method such as DNS or Google Search Console import.
- Latest deployment validation: 2026-08-29; full site verification passed all 101 tests after adding local search engine crawler coverage and a market-specific submission matrix for Yahoo! JAPAN, Naver, Baidu, Yandex, Seznam, Qwant, Daum, and Coc Coc.
- Latest sitemap validation: 2026-08-29; 55 URLs, 413 hreflang alternate links, and 90 image entries are present in sitemap.xml.
- Latest global-focused sitemap validation: sitemap-global.xml and sitemap-global.txt contain 42 non-Chinese global and localized URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest article sitemap validation: 2026-08-29; sitemap-articles.xml and sitemap-articles.txt contain all 27 Article/guide URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest China-focused sitemap validation: sitemap-cn.xml contains 11 Chinese-language URLs and is advertised from robots.txt and sitemap-index.xml.
- Latest China-focused text sitemap validation: sitemap-cn.txt contains the same 11 Chinese-language URLs and is advertised from robots.txt.
- Latest people-first content pass: the English and Simplified Chinese iPhone photo-cleaner pages now use the real product screen and document version 1.1.3, iOS 16 compatibility, nine explicit categories, on-device processing, and review-before-delete behavior checked against the current App Store listing on 2026-07-13. Regional and guide copy that addressed search traffic instead of readers was rewritten around practical user tasks.
- Latest product evidence pass: Anti-spy screen was refreshed to version 1.5.1 and Anti-spy screen Lite remains version 1.4.1; English and Simplified Chinese Mac privacy facts were rechecked against Apple's public records on 2026-08-03.
- Latest app portfolio pass: GIFmaker 1.1.2 and HappyRide 1.2 now have English and Simplified Chinese product pages, App Store IDs, official icons, verified compatibility, SoftwareApplication entities, FAQs, hreflang pairs, Smart App Banners, support/privacy anchors, and sitemap/search discovery.
- Latest entity pass: the site now separates the verified developer entity (`Bo Chen`) from the `CrazyAIAgent` publisher brand; page ownership, Article authorship, all six SoftwareApplication entities, and hub ItemLists use stable linked IDs.
- Latest ASO pass: `ASO_ACTIONS.md` contains length-checked names, subtitles, 100-byte keyword fields, promotional text, screenshot order, product-specific App Store Connect URLs, and GA4 outbound-click measurement for GIFmaker and HappyRide. `scripts/audit-aso-readiness.mjs` reports PASS.

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
