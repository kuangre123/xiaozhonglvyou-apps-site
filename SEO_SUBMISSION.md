# SEO Submission Checklist

Production domain: https://www.xiaozhonglvyou.com/

Sitemap index: https://www.xiaozhonglvyou.com/sitemap-index.xml

Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml

Global-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-global.xml

Local-search-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-local.xml

Article sitemap: https://www.xiaozhonglvyou.com/sitemap-articles.xml

Text sitemap: https://www.xiaozhonglvyou.com/sitemap.txt

Global-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-global.txt

Local-search-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-local.txt

Article text sitemap: https://www.xiaozhonglvyou.com/sitemap-articles.txt

China-focused sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.xml

China-focused text sitemap: https://www.xiaozhonglvyou.com/sitemap-cn.txt

RSS feed: https://www.xiaozhonglvyou.com/feed.xml

Atom feed: https://www.xiaozhonglvyou.com/atom.xml

Search index: https://www.xiaozhonglvyou.com/search-index.json

## Completed On Site

- 61 indexable HTML pages, 146 JSON-LD blocks, 201 top-level structured-data nodes, 0 parse errors
- `robots.txt` allows 40 named search crawler UAs including Googlebot, Bingbot, MicrosoftPreview, DuckDuckBot, Slurp, Yahoo! JAPAN Y!J/YJ crawlers, Yandex, Mail.RU_Bot, Yeti, Daum, SeznamBot, Qwantbot/Qwantify, Coc Coc, Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, PetalBot, and AI crawlers (GPTBot, ClaudeBot, PerplexityBot)
- `robots.txt` advertises sitemap-index, sitemap.xml, sitemap-global.xml, sitemap-local.xml, sitemap-articles.xml, sitemap-cn.xml, sitemap.txt, sitemap-global.txt, sitemap-local.txt, sitemap-articles.txt, sitemap-cn.txt, feed.xml, atom.xml
- `sitemap.xml` includes 61 URLs with per-page lastmod values through 2026-09-01, changefreq, priority, 677 hreflang alternate links, and 96 image entries
- `sitemap-index.xml` points to sitemap.xml, sitemap-global.xml, sitemap-local.xml, sitemap-articles.xml, sitemap-cn.xml, feed.xml, and atom.xml
- `sitemap-global.xml` lists 42 global, English, and localized non-Chinese landing pages for Google, Bing, Yandex, DuckDuckGo, and other international search platform submissions
- `sitemap-local.xml` lists 39 regional, localized, market-hub, and core product URLs for Yahoo! JAPAN, Naver, Daum, Yandex, Seznam, Qwant, Coc Coc, and other local search platform submissions
- `sitemap-articles.xml` lists 27 Article/guide pages with per-page dateModified values from JSON-LD
- `sitemap-cn.xml` lists 11 Simplified and Traditional Chinese landing pages for Baidu, 360, Sogou, Shenma, and other Chinese search platform submissions
- `sitemap.txt` lists 61 URLs in plain text format
- `sitemap-global.txt` lists the same 42 global and international URLs in plain text format
- `sitemap-local.txt` lists the same 39 local-search-priority URLs in plain text format
- `sitemap-articles.txt` lists the same 27 Article/guide URLs in plain text format
- `sitemap-cn.txt` lists the same 11 Chinese-language URLs in plain text format
- `feed.xml` and `atom.xml` each expose 27 Article entries with updates through 2026-08-28
- `search-index.json` with 61 pages, includes title/description/h1/lang/category/headings
- `directory.html` human-readable page directory with grouped links
- `search.html` client-side site search with ?q= parameter support
- `llms.txt` with full page descriptions and discovery signals
- `security.txt` at root for responsible disclosure (E-E-A-T trust signal)

### Technical SEO
- All 61 indexable pages: unique title, unique meta description, single H1, canonical, viewport, robots=index,follow
- All 61 indexable pages: og:locale, og:image:secure_url, og:image:width/height/alt, og:site_name
- 35 single-product iOS pages expose validated Smart App Banner metadata with the correct app ID and canonical app argument
- All 61 indexable pages: manifest.webmanifest link, preconnect for googletagmanager and apps.apple.com
- `manifest.webmanifest`: 3 validated icons, 2 screenshots, 4 app shortcuts, explicit language, and standalone display metadata
- All 215 visible App Store links: GA4 `app_store_click` event metadata, product/storefront identifiers, accessible labels, and safe new-tab attributes
- 27 Article pages: og:article:published_time and og:article:modified_time (synced with JSON-LD)
- 61 indexable pages: Atom alternate links point to the canonical 27-entry Atom feed, with titles, summaries, links, and dates checked against Article JSON-LD
- 27 Article nodes: page-specific topic keyword sets are aligned with each article's title, description, language, and search intent; legacy generic brand keywords are rejected by the readiness audit
- Localized, regional, and paired content pages: hreflang alternates (21 regional pages + 20 paired content pages)
- No broken internal links; all 61 indexable pages have at least 3 unique inbound HTML source pages. The coverage audit excludes the noindex 404 page and counts each distinct linking HTML page once, so the market directory is reachable from the homepage, directory hub, and apps hub.
- No generic anchor text ("click here" etc.)
- No heading hierarchy skips
- No public-facing SEO terminology leaks

### Structured Data (146 blocks, 15 top-level types, 201 nodes)
- BreadcrumbList: 60 pages (all indexable pages except index.html)
- FAQPage: 49 pages with 266 visible and structured Q&A pairs
- Article: 27 pages with datePublished/dateModified synced per page
- WebPage: 27 pages
- CollectionPage: 5 pages
- SoftwareApplication: 10 entities covering six products (with applicationCategory, operatingSystem, softwareVersion, software requirements, feature lists, and offers)
- ItemList: 4 pages
- HowTo: 11 pages with matched English and Simplified Chinese GIF creation and automatic cycling setup instructions
- Organization + Brand: 2 pages with sameAs (App Store developer page, 6 product pages, and GitHub repo)
- Person: 2 pages identifying Bo Chen with the current public App Store developer page and knowsAbout topics
- WebSite: 1 with SearchAction (potentialAction for Sitelinks Search Box)
- SiteNavigationElement, AboutPage, ContactPage: 1 each

### Internationalization
- 21 regional/market pages with cross-links (Hub and Spoke)
- hreflang: en, en-US, en-GB, en-CA, en-AU, en-SG, en-CH, en-NL, en-SE, en-DK, en-FI, en-NO, de-DE, fr-FR, es-ES, it-IT, ja-JP, ko-KR, ru-RU, cs-CZ, vi-VN, tr-TR, pt-BR, es-MX, zh-CN, zh-Hant, zh-TW, zh-HK + x-default
- Localized App Store links cover Japan, Germany, Türkiye, Brazil, Mexico, China, Korea, Russia, Czechia, Vietnam, and the existing English and European market pages

### Local Search Engine Matrix

Research date: 2026-09-01. Treat market-share figures as directional snapshots because national search panels and domestic query-share panels can diverge materially.

| Market | Search engines that need explicit attention | Current site-side coverage | Manual platform action |
| --- | --- | --- | --- |
| Japan | Google remains the main mobile index; Bing is material on desktop; Yahoo! JAPAN is a major local search and portal surface. StatCounter reported Japan July 2026 all-platform share as Google 59.73%, Bing 32.07%, Yahoo! 6.55%. Yahoo! JAPAN also documents its own Y!J crawler family. | `ja-jp.html` now covers all six apps in Japanese with eight tracked Japan storefront links, six task paths, six matching FAQ items, and explicit Japanese-interface disclosures. It is in the `ja-JP` hreflang cluster and `sitemap-local.xml`; `robots.txt` allows Googlebot, Bingbot, Slurp, and the Yahoo! JAPAN Y!J/YJ crawler family including `Y!J-BRW`. | Submit `sitemap-local.xml` and `sitemap-articles.xml` in Google Search Console and Bing Webmaster Tools; monitor Yahoo! JAPAN referrals separately because its portal and crawler signals can differ. |
| Germany | Google leads and Bing is the main secondary index. StatCounter reported Germany July 2026 all-platform share as Google 85.59%, Bing 7.12%, Yandex 2.14%, Yahoo 2.05%, DuckDuckGo 1.46%, and Ecosia 1.25%. Ecosia says its German results can come from Bing or Google, while EUSP availability is evolving. | `de-de.html` now covers all six apps in German, links the dedicated German photo-cleaner guide, exposes eight tracked Germany storefront links, six task paths, six matching FAQ items, and precise German-interface disclosures. Bing and Google discovery also serves Ecosia's documented partner-result paths. | Keep Google Search Console and Bing Webmaster Tools current. Track Ecosia and DuckDuckGo referrals separately, but optimize through the underlying Google/Bing paths unless their official provider guidance changes. |
| Türkiye | Google and Yandex need explicit attention. StatCounter reported Türkiye July 2026 all-platform share as Google 80.5%, Yandex 17.5%, Bing 0.97%, Yahoo 0.6%, and DuckDuckGo 0.33%. Yandex provides Turkish Webmaster and IndexNow documentation. | `tr-tr.html` covers all six apps in Turkish with eight tracked Türkiye storefront links, six task paths, six matching FAQ items, current Turkish-interface disclosures, `tr-TR` hreflang, and inclusion in `sitemap-local.xml`. The automatic IndexNow workflow already submits to Yandex and Bing. | Add `sitemap-local.xml` in Yandex Webmaster and request reindexing for `tr-tr.html`; retain the existing automatic IndexNow submission. Submit the main sitemap in Google Search Console. |
| Brazil | Google is the dominant general web search entry point; Bing and Yahoo Search are the practical secondary paths for broad discovery. Brazil does not require a separate independent general index in this release, so the local strategy stays on Google/Bing crawlability plus the Brazilian App Store destination. | `pt-br.html` is a Brazilian Portuguese `pt-BR` market page with all six apps, eight tracked Brazil storefront links, six task paths, six matching FAQ items, language-support boundaries, and inclusion in `sitemap-local.xml`. The six public app IDs were checked through the Apple Search API with `country=br`. | Submit `sitemap.xml`, `sitemap-local.xml`, and `sitemap-articles.xml` in Google Search Console and Bing Webmaster Tools. Use Bing data as the operational proxy for Yahoo Search, and monitor Brazil traffic with `country=br` storefront links in GA4. |
| Mexico | Google is the dominant general web search entry point; Bing and Yahoo Search remain the practical secondary paths. Mexico does not require a separate independent general index in this release, so the local strategy stays on Google/Bing crawlability plus the Mexican App Store destination. | `es-mx.html` is a Mexican Spanish `es-MX` market page with all six apps, eight tracked Mexico storefront links, six task paths, six matching FAQ items, language-support boundaries, and inclusion in `sitemap-local.xml`. The six public app IDs were checked through the Apple Search API with `country=mx`. | Submit `sitemap.xml`, `sitemap-local.xml`, and `sitemap-articles.xml` in Google Search Console and Bing Webmaster Tools. Use Bing data as the operational proxy for Yahoo Search, and monitor Mexico traffic with `country=mx` storefront links in GA4. |
| South Korea | Naver is a required local surface, and Korean market-share sources conflict because Naver answers many queries inside its own properties. Daum remains a smaller Korean search surface. | `ko-kr.html` is in the hreflang cluster and `sitemap-local.xml`; `robots.txt` explicitly allows Naver `Yeti` and Daum. | Verify the canonical domain in Naver Search Advisor, submit `sitemap-local.xml`, request recrawl for `ko-kr.html`, and track Naver/Daum separately from Google organic. |
| Mainland China | Baidu is the primary domestic engine; 360, Sogou, Shenma/Yisou, ByteDance search, Huawei Petal, and Bing are useful secondary surfaces for Chinese-language discovery. | `zh-cn.html` now provides 3,550 visible characters, seven task-specific Chinese guide paths, six matching FAQ items, and direct China storefront links for all six apps. `sitemap-cn.xml` and `sitemap-cn.txt` contain the Chinese-language pages; `robots.txt` explicitly allows Baiduspider, Sogou, 360Spider, YisouSpider, Bytespider, and PetalBot. | Verify in Baidu Search Resource Platform and submit `sitemap-cn.xml` or the available ordinary-inclusion channel. Reserve Baidu quick inclusion for eligible time-sensitive content; Baidu states that submission shortens discovery time but does not guarantee inclusion. Repeat ownership and resource submission in 360, Sogou, and Shenma webmaster tools. |
| Russia and CIS | Yandex is the local leader in Russia; Mail.ru is a secondary Russian surface. | `ru-ru.html` provides substantial Russian content for all six apps, local App Store links, six matching FAQ items, language-support disclosures, and `ru-RU` hreflang. `robots.txt` explicitly allows `Yandex`, `YandexBot`, and `Mail.RU_Bot`; IndexNow includes the Yandex endpoint. | Add `sitemap-local.xml` in Yandex Webmaster, request reindexing for `ru-ru.html`, and keep IndexNow enabled. Yandex recommends combining sitemap, manual reindexing, and IndexNow where applicable. |
| Czechia | Seznam remains a meaningful local Czech engine. StatCounter reported Czech Republic July 2026 share as Google 81.07%, Seznam 14.05%, Bing 3.72%. | `cs-cz.html` provides substantial Czech content for all six apps, local App Store links, six matching FAQ items, an explicit Czech-interface limitation, and `cs-CZ` hreflang. `robots.txt` allows `SeznamBot`, and IndexNow includes the Seznam endpoint. | Submit `cs-cz.html` through Seznam Webmaster's add-page path and keep IndexNow enabled. Seznam documents both methods and states that internal crawlable links remain essential. |
| France and EU privacy segment | Google and Bing remain primary in France, but Qwant is a French search engine with its own crawler/user-agent guidance. | `fr-fr.html` and `nettoyeur-photo-iphone-fr.html` are in hreflang clusters; `robots.txt` now allows `Qwantbot` and `Qwantify`. | Track Qwant referrals as a small but relevant privacy-aligned segment; keep French page claims concrete and tied to App Store/privacy evidence. |
| Vietnam | Google dominates all-platform share, but Cốc Cốc is the clearest national challenger and describes itself as Vietnam's second-largest search engine. | `vi-vn.html` provides substantial Vietnamese content for all six apps, local App Store links, six matching FAQ items, language-support disclosures, and `vi-VN` hreflang. `robots.txt` allows the official `coccocbot`, web, image, and fast crawler names. | Submit `sitemap-local.xml` and `vi-vn.html` in Cốc Cốc Search Console. Cốc Cốc says its crawler prioritizes Vietnamese content and accepts sitemap or individual URL submissions. |
| US, UK, Canada, Australia, Switzerland, Netherlands, and Nordics | Google leads; Bing/Yahoo/DuckDuckGo are the practical secondary engines. | Regional pages, `sitemap-global.xml`, `sitemap-articles.xml`, Bing meta-keyword coverage, IndexNow, RSS, Atom, and `llms.txt` are already in place. | Continue Google Search Console and Bing Webmaster monitoring; use Bing data as the operational proxy for Yahoo Search and Copilot grounding. |

Research sources used for this matrix:

- StatCounter Japan search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all/japan
- StatCounter Germany search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all/germany
- StatCounter Türkiye search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all/turkey
- Ecosia official search-result provider guidance: https://support.ecosia.org/article/579-search-results-providers and https://support.ecosia.org/article/108-how-to-advertise-on-ecosia
- Yandex Türkiye IndexNow and changed-page guidance: https://yandex.com.tr/support/webmaster/tr/indexing-options/index-now and https://yandex.com.tr/support/webmaster/tr/robot-workings/new-changed
- SearchEngines.Net country search share synthesis, updated 2026-08-19: https://www.searchengines.net/guides/search-engine-market-share-by-country/
- StatCounter Czech Republic search share, July 2026: https://gs.statcounter.com/search-engine-market-share/all-worldwide/czech-republic
- Yahoo! JAPAN crawler guidance: https://info-search.yahoo.co.jp/crawl/ and https://support.yahoo-net.jp/SccSearch/s/article/H000007955
- Naver robots.txt guidance for `Yeti`: https://help.naver.com/service/30010/contents/17638?osType=PC
- Naver crawl request API guidance: https://searchadvisor.naver.com/guide/crawl-request-api
- Baidu Search Resource Platform quick inclusion and resources: https://ziyuan.baidu.com/dailysubmit/index
- Baiduspider robots.txt guidance: https://www.baidu.com/search/robots_english.html
- 360 Webmaster Platform: https://zhanzhang.so.com/
- Sogou Resource Platform: https://zhanzhang.sogou.com/
- Apple Search API China storefront lookup for the six public app IDs: https://itunes.apple.com/lookup?id=6768019606,6755734543,6761301764,6766485393,6783559364,6786365305&country=cn
- Apple Search API Brazil storefront lookup for the six public app IDs: https://itunes.apple.com/lookup?id=6768019606,6755734543,6761301764,6766485393,6783559364,6786365305&country=br
- Apple Search API Mexico storefront lookup for the six public app IDs: https://itunes.apple.com/lookup?id=6768019606,6755734543,6761301764,6766485393,6783559364,6786365305&country=mx
- Yandex Webmaster sitemap guidance: https://www.yandex.com/support/webmaster/en/indexing-options/sitemap
- Yandex new and changed page guidance: https://www.yandex.com/support/webmaster/en/robot-workings/new-changed
- Seznam IndexNow guidance: https://o-seznam.cz/napoveda/vyhledavani/seznambot/protokol-indexnow/
- Seznam search submission FAQ: https://o-seznam.cz/napoveda/vyhledavani/nejcastejsi-dotazy/
- Cốc Cốc Search Console and sitemap guidance: https://coccoc.com/search/console/vn/introduction and https://coccoc.com/search/console/submit-sitemap-to-coc-coc-search
- Cốc Cốc crawler user agents: https://coccoc.com/search/console/coc-coc-robots
- Apple storefront checks for the six public app IDs: https://apps.apple.com/jp/app/id6768019606, https://apps.apple.com/de/app/id6768019606, and https://apps.apple.com/tr/app/id6768019606; the same storefront checks were completed for 6755734543, 6761301764, 6766485393, 6783559364, and 6786365305
- Apple storefront checks for the six public app IDs were also completed for Brazil (`/br/`) and Mexico (`/mx/`); the page links retain the correct iOS or Mac App Store query parameters and GA4 storefront metadata.
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
- Latest verified automated run: the IndexNow readiness audit now validates the 61-URL sitemap; each workflow run preserves endpoint-level evidence in `indexnow-report.json`.

### Bing Readiness Audit
- Script: `node scripts/audit-bing-readiness.mjs`
- Checks: Bingbot/BingPreview allowed in robots.txt, sitemap advertised, IndexNow key valid, all indexable pages have meta keywords (Bing values these), meta description, canonical, and JSON-LD structured data
- Status: PASS (61 Bing-audited pages, all with keywords/description/canonical/JSON-LD; the only excluded HTML file is the noindex 404 page)
- Bing Webmaster Tools property is active: the 2026-07-17 account screenshot shows Recommendations for `xiaozhonglvyou.com`. No `msvalidate.01` tag is present, which is expected when the property is verified through another supported method such as DNS or Google Search Console import.
- Latest deployment validation: 2026-09-01; full site verification passed with local search engine crawler coverage, market-specific content checks for China, Japan, Germany, Türkiye, South Korea, Russia, Czechia, Vietnam, Brazil, and Mexico, a submission matrix, and dedicated local-search and China-focused sitemaps.
- Latest sitemap validation: 2026-09-01; 61 URLs, 677 hreflang alternate links, and 96 image entries are present in sitemap.xml.
- Latest global-focused sitemap validation: sitemap-global.xml and sitemap-global.txt contain 42 non-Chinese global and localized URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest local-search-focused sitemap validation: 2026-09-01; sitemap-local.xml and sitemap-local.txt contain 39 regional, localized, market-hub, and core product URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest article sitemap validation: 2026-08-30; sitemap-articles.xml and sitemap-articles.txt contain all 27 Article/guide URLs and are advertised from robots.txt and sitemap-index.xml.
- Latest China-focused sitemap validation: sitemap-cn.xml contains 11 Chinese-language URLs and is advertised from robots.txt and sitemap-index.xml.
- Latest China-focused text sitemap validation: sitemap-cn.txt contains the same 11 Chinese-language URLs and is advertised from robots.txt.
- Latest Mainland China market pass: `zh-cn.html` grew from 1,984 to 3,550 visible characters, maps seven user tasks to focused Chinese guides, exposes six visible and structured FAQ answers, and links all six products to their verified China App Store or Mac App Store listings. Baidu ordinary/quick inclusion, 360, and Sogou submission guidance was rechecked against the public platform pages on 2026-08-30.
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
- Submit `https://www.xiaozhonglvyou.com/sitemap-cn.xml` through the ordinary-inclusion or sitemap channel available to the verified property
- Use quick inclusion only for eligible time-sensitive resources; Baidu states that submission accelerates discovery but does not guarantee inclusion
- Monitor authoritative inclusion and crawl feedback inside the verified property rather than relying on public `site:` result estimates

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
