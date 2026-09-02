# SEO/GEO 60-Day Roadmap

This roadmap turns the practical lessons from the supplied SEO book into an execution sequence for CrazyAIAgent. The book is used as strategy reference only; it is not a source of code or deployment instructions.

## Operating Rules

- A published page is not proof of indexing.
- An indexed page is not proof of impressions.
- Impressions are not clicks, and clicks are not App Store installs.
- Confirm search performance with Google Search Console, Bing Webmaster Tools, Yandex Webmaster, and GA4. Confirm store outcomes with App Store Connect.
- Map one primary search intent to one canonical URL. Do not create near-duplicate doorway pages.
- Use AI for research, clustering, translation review, and analysis. Every localized page needs human fact checking, local wording, and an explicit product limitation section.
- Do not buy clicks, simulate clicks, stuff keywords, hide text, or submit duplicate URLs repeatedly.

## Market Priorities

Research snapshot: 2026-09-02, using StatCounter August 2026 country-level search share as a directional input.

### Japan

Primary path: Google and Bing. Local discovery path: Yahoo! JAPAN, which remains a meaningful Japanese portal and search surface. StatCounter reported August 2026 all-platform share in Japan as Google 63.02%, Bing 28.29%, Yahoo! 6.96%, DuckDuckGo 0.74%, Yandex 0.4%, and Coc Coc 0.35%. Keep Japanese content on `ja-jp.html` and `ja-jp-photo-cleaner.html`, with Japanese App Store links and `ja` hreflang.

### Germany

Primary path: Google and Bing. Secondary discovery: Yahoo Search, Yandex, DuckDuckGo, and Ecosia. StatCounter reported August 2026 all-platform share in Germany as Google 88.49%, Bing 5.84%, Yahoo 1.57%, Yandex 1.56%, DuckDuckGo 1.2%, and Ecosia 1.02%. Ecosia results may come through its partner indexes, so technical optimization remains centered on Google and Bing while German content and the German App Store destination stay explicit.

### Türkiye

Primary path: Google. Secondary path: Yandex Türkiye. StatCounter reported August 2026 all-platform share in Türkiye as Google 82.32%, Yandex 15.98%, Bing 0.88%, Yahoo 0.44%, and DuckDuckGo 0.3%. Keep Turkish content on `tr-tr.html` and `tr-tr-photo-cleaner.html`, use the Turkish App Store destination, and send changed URLs through IndexNow where supported.

## Days 1-7: Measurement and Crawl Baseline

1. Verify ownership and sitemap submission in Google Search Console and Bing Webmaster Tools.
2. Add `sitemap.xml`, `sitemap-local.xml`, and `sitemap-articles.xml` to the relevant properties. Add `sitemap-local.xml` to Yandex Webmaster for Türkiye and other Yandex-relevant markets.
3. Inspect representative URLs individually: the home page, each market hub, each localized photo-cleaner page, and one article per product cluster.
4. Record baseline values for indexed URLs, impressions, clicks, CTR, average position, organic landing pages, and `app_store_click` events.
5. Keep GA4 search and referral attribution separate from App Store Connect installs. A website click cannot be treated as an install.
6. Use the existing robots, canonical, hreflang, RSS, Atom, search index, and IndexNow audits as release gates.

**Exit condition:** every target URL returns `200`, is linked internally, appears in the appropriate sitemap, has one canonical, and has a measurement path.

## Days 8-14: Intent and Keyword Map

1. Build a table with market, language, search phrase, intent, canonical URL, App Store country, and evidence source.
2. Prioritize bottom-of-funnel topics: `iPhone photo cleaner`, duplicate-photo cleanup, photo organizer, privacy, pricing, comparison, and alternatives.
3. Add mid-funnel guides for safe review workflows, on-device processing, screenshots, blurry photos, and large media.
4. Use local wording rather than literal translation:
   - Japanese: 写真整理, 重複写真, 類似写真, ストレージ整理
   - German: Fotos aufräumen, doppelte Fotos, ähnliche Bilder, Speicher bereinigen
   - Turkish: fotoğraf temizleme, yinelenen fotoğraflar, benzer fotoğraflar, depolama alanı
5. Keep one primary intent per URL and record secondary terms in the page keyword map.

**Exit condition:** no target keyword is assigned to multiple competing canonical pages without a deliberate hub-and-spoke reason.

## Days 15-24: Localized Pages and Internal Discovery

1. Improve the three market hubs before adding more country pages. Each hub should explain all six apps, local App Store links, language limitations, six task paths, FAQs, and a clear next action.
2. Keep the dedicated localized photo-cleaner pages genuinely localized in title, description, H1, body copy, FAQ, schema language, breadcrumb, and CTA.
3. Link each localized guide from its market hub, `guides.html`, `directory.html`, the English and Chinese photo-cleaner pages, and at least one related article.
4. Keep every localized photo-cleaner page in the same seven-language hreflang cluster: `en`, `zh-CN`, `de`, `fr`, `ja`, `tr`, and `x-default`.
5. Add new country pages only when there is a real local destination, local copy, unique search intent, and at least three internal discovery sources.

**Exit condition:** no localized page is orphaned, and each page passes metadata, schema, image, hreflang, and local App Store attribution checks.

## Days 25-34: Answer Quality and GEO Signals

1. Put a direct answer near the start of every high-intent guide.
2. Use descriptive H2/H3 sections, short procedures, comparison tables where a choice is involved, and visible FAQs that exactly match FAQ schema.
3. State what the app does not do, especially around automatic deletion, iOS system data, RAM, privacy, supported OS versions, and language availability.
4. Keep Article, FAQPage, BreadcrumbList, SoftwareApplication, WebSite, Brand, and Person entities connected with stable IDs.
5. Use first-party screenshots and accurate alt text. Keep Open Graph images, social metadata, RSS, Atom, `llms.txt`, and IndexNow synchronized.

**Exit condition:** visible claims, structured data, App Store evidence, and localized wording agree on every target page.

## Days 35-44: Legitimate Distribution

1. Submit the relevant sitemaps and changed URLs through official webmaster tools:
   - Japan: Google Search Console, Bing Webmaster Tools, and Yahoo! JAPAN's documented crawl/discovery paths.
   - Germany: Google Search Console and Bing Webmaster Tools; monitor Ecosia and DuckDuckGo as secondary referrals.
   - Türkiye: Google Search Console, Bing Webmaster Tools, and Yandex Webmaster.
2. Publish genuinely useful references where the audience already exists: developer profiles, app directories, product documentation, privacy pages, and editorial comparisons that allow links.
3. Offer the media kit and first-party screenshots to reviewers. Do not mass-submit low-quality directories or exchange irrelevant links.
4. Keep IndexNow enabled for changed canonical URLs. It is a notification mechanism, not an indexing guarantee.

**Exit condition:** each distribution action has a source URL, date, target market, and measurable referral or crawl signal.

## Days 45-52: CTR and Content Iteration

1. Export GSC queries and pages by country and language.
2. Find pages with impressions but low CTR. Rewrite title and description around the actual query and the page's strongest verified benefit.
3. Find pages with clicks but weak App Store engagement. Improve above-the-fold clarity, evidence, CTA text, and the distance between answer and action.
4. Find pages with impressions but no clicks after enough data has accumulated. Improve intent match before creating another page.
5. Do not change canonical, hreflang, or page intent only to chase short-term query variation.

**Exit condition:** every title/description change has a before-and-after date, query group, market, and CTR comparison.

## Days 53-60: Conversion and Portfolio Review

1. Compare organic landing pages, `app_store_click` events, storefront country, and App Store Connect results by market.
2. Keep the best-performing pages and expand adjacent long-tail questions only when they represent a distinct need.
3. Merge or redirect thin overlapping pages after checking backlinks, impressions, and internal links.
4. Review Japanese, German, and Turkish copy with native-level quality checks and current App Store facts.
5. Refresh `SEO_SUBMISSION.md` with verified platform actions and remove claims that are not supported by current data.
6. Start the next 60-day cycle from the pages with the strongest impressions-to-click opportunity, not from page count.

**Exit condition:** a market scorecard shows impressions, clicks, CTR, average position, tracked store clicks, and installs separately, with a next action for every underperforming page.

## Current Release Checklist

- [x] Japanese, German, and Turkish market hubs exist.
- [x] Japanese and Turkish dedicated photo-cleaner guides exist; German guide is present.
- [x] Localized guides have local App Store links and tracked conversion events.
- [x] Localized guides have seven-language hreflang clusters.
- [x] Localized guides are represented in sitemap, search index, RSS/Atom, and internal discovery.
- [x] Robots policy covers the documented local search crawler families.
- [ ] Submit or re-submit the sitemaps in each verified webmaster account.
- [ ] Record a real GSC/GA4/App Store Connect baseline before judging clicks.
- [ ] Reassess titles and descriptions after enough country-specific query data exists.
