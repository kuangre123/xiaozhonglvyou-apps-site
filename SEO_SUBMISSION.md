# SEO Submission Checklist

Production domain: https://www.xiaozhonglvyou.com/

Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml

RSS feed: https://www.xiaozhonglvyou.com/feed.xml

Search index: https://www.xiaozhonglvyou.com/search-index.json

## Completed On Site

- `robots.txt` allows crawling, repeats the internal document exclusions for AI answer/search crawler user agents, and points to the sitemap, `llms.txt`, RSS feed, search index, web app manifest, and IndexNow key file.
- `llms.txt` includes the current app facts, answer-oriented intents, international market targets, machine-readable discovery signals, indexable page list, and a recommended citation for answer engines.
- `sitemap.xml` includes the home page, about page, apps hub, guides hub, regions hub, keyword pages, localized landing pages, privacy page, support page, sitemap-level hreflang alternates, and image discovery entries. Current sitemap, search index, RSS build date, llms.txt, and Article dateModified values reflect the 2026-06-29 discovery update.
- Pages include canonical URLs, indexable robots meta, Open Graph tags, visible breadcrumbs, and structured data where useful. Article structured data includes author URL and publisher identity; JSON-LD breadcrumbs include the current page URL.
- Homepage and About structured data define the CrazyAIAgent publisher/brand entity; Article nodes link back to the WebSite entity with `isPartOf`.
- SoftwareApplication structured data includes App Store `sameAs` URLs and Apple App Store ID identifiers for app entity matching.
- Hub pages expose `ItemList` JSON-LD for the apps, guides, and regional page directories so crawlers can read the internal URL groups directly.
- Visible FAQ sections are mirrored with matching `FAQPage` JSON-LD across the site, covering 19 FAQ pages and 67 question-answer pairs.
- Pages expose stable root favicon links for search-result appearance: `/favicon.ico`, `/favicon-96x96.png`, and `/apple-touch-icon.png`. Open Graph site names and WebSite alternate names identify the site as CrazyAIAgent.
- Root IndexNow key file is present: `https://www.xiaozhonglvyou.com/a6013cad6cead8e0.txt`.
- Privacy page includes advertising and cookie disclosure for future AdSense or sponsored placements.

## Monetization Readiness

- Recommended first network: Google AdSense, because it preserves user trust and usually performs best for English utility and software guide traffic.
- Do not add ad code before account/site approval tasks are started in AdSense.
- Do not create `ads.txt` with a guessed publisher ID. Add the exact `google.com, pub-..., DIRECT, f08c47fec0942fa0` line only after AdSense gives the publisher ID.
- Keep aggressive popunder, push, and interstitial networks off the main domain while Google indexing and AdSense review are still developing.

## Google Search Console

Google requires account access and site verification.

Before submitting URLs, confirm Aliyun DNS has the GitHub Pages apex records:

```text
@ A 185.199.108.153
@ A 185.199.109.153
@ A 185.199.110.153
@ A 185.199.111.153
www CNAME kuangre123.github.io
```

Then run:

```sh
node scripts/audit-search-console-robots.mjs
```

If Search Console shows `https://xiaozhonglvyou.com/robots.txt` as unavailable,
remove any stale `@` A record such as `28.0.0.7`, wait for DNS propagation, then
test HTTPS directly:

```sh
curl -I https://xiaozhonglvyou.com/robots.txt
```

If that command fails with a certificate name mismatch such as `CN=*.github.io`,
GitHub Pages has not finished issuing the HTTPS certificate for the apex domain.
Do not keep retrying Search Console until GitHub Pages shows the custom domain
DNS check as successful and HTTPS enforcement is available.

1. Open Google Search Console.
2. Add property: `https://www.xiaozhonglvyou.com/`.
3. Verify ownership using either DNS TXT or HTML meta tag.
4. Submit sitemap: `https://www.xiaozhonglvyou.com/sitemap.xml`.
5. Generate the local indexing request plan:

   ```sh
   node scripts/prepare-search-console-indexing-plan.mjs
   ```

6. Use URL Inspection for:
   - `https://www.xiaozhonglvyou.com/`
   - `https://www.xiaozhonglvyou.com/about.html`
   - `https://www.xiaozhonglvyou.com/best-iphone-photo-cleaner-app.html`
   - `https://www.xiaozhonglvyou.com/apps.html`
   - `https://www.xiaozhonglvyou.com/guides.html`
   - `https://www.xiaozhonglvyou.com/regions.html`
   - `https://www.xiaozhonglvyou.com/ai-photo-classification.html`
   - `https://www.xiaozhonglvyou.com/iphone-photo-cleaner.html`
   - `https://www.xiaozhonglvyou.com/private-ai-photo-cleaner.html`
   - `https://www.xiaozhonglvyou.com/iphone-storage-cleanup-guide.html`
   - `https://www.xiaozhonglvyou.com/travel-translator.html`
   - `https://www.xiaozhonglvyou.com/mac-screen-privacy.html`
   - `https://www.xiaozhonglvyou.com/zh-cn.html`
   - `https://www.xiaozhonglvyou.com/zh-hant.html`
   - `https://www.xiaozhonglvyou.com/us-apps.html`
   - `https://www.xiaozhonglvyou.com/uk-apps.html`
   - `https://www.xiaozhonglvyou.com/canada-australia-apps.html`
   - `https://www.xiaozhonglvyou.com/singapore-apps.html`
   - `https://www.xiaozhonglvyou.com/switzerland-apps.html`
   - `https://www.xiaozhonglvyou.com/netherlands-nordics-apps.html`
   - `https://www.xiaozhonglvyou.com/de-de.html`
   - `https://www.xiaozhonglvyou.com/fr-fr.html`
   - `https://www.xiaozhonglvyou.com/es-es.html`
   - `https://www.xiaozhonglvyou.com/it-it.html`
   - `https://www.xiaozhonglvyou.com/ko-kr.html`
   - `https://www.xiaozhonglvyou.com/ja-jp.html`
   - `https://www.xiaozhonglvyou.com/ai-photo-organizer-guide.html`
   - `https://www.xiaozhonglvyou.com/ai-photo-classification-cn.html`
   - `https://www.xiaozhonglvyou.com/iphone-photo-cleaner-cn.html`
   - `https://www.xiaozhonglvyou.com/duplicate-photo-cleaner-cn.html`
   - `https://www.xiaozhonglvyou.com/travel-translator-cn.html`
   - `https://www.xiaozhonglvyou.com/mac-screen-privacy-cn.html`
   - `https://www.xiaozhonglvyou.com/iphone-foto-cleaner-de.html`
   - `https://www.xiaozhonglvyou.com/nettoyeur-photo-iphone-fr.html`
   - `https://www.xiaozhonglvyou.com/duplicate-photo-cleaner-guide.html`
   - `https://www.xiaozhonglvyou.com/voice-camera-translator-guide.html`
   - `https://www.xiaozhonglvyou.com/screen-sharing-privacy-guide.html`
   - `https://www.xiaozhonglvyou.com/privacy.html`
   - `https://www.xiaozhonglvyou.com/support.html`

For each priority URL, first click `TEST LIVE URL`. Only click
`REQUEST INDEXING` after the live test says the page is available to Google.

If Search Console says `Crawled - currently not indexed`, treat it as an
indexing decision or processing delay, not a crawl block, when these are true:

- Live test passes.
- `robots.txt` is fetched.
- Sitemap is submitted.
- The page has `index,follow` robots meta.
- The canonical URL matches the inspected `https://www.xiaozhonglvyou.com/...`
  URL.

For that status, keep the URL in the manual request queue, add real external
links from published articles and product profiles, then wait for Google to
reprocess it. Do not repeatedly change DNS, robots, or canonicals unless a live
test reports a specific technical failure.

## Bing Webmaster Tools

1. Add site: `https://www.xiaozhonglvyou.com/`.
2. Submit sitemap: `https://www.xiaozhonglvyou.com/sitemap.xml`.
3. Use URL Submission if needed.
4. IndexNow can notify Bing-compatible engines after deployment.
5. After the deployed sitemap is live, submit it from a checkout of this site:

   ```sh
   node /Users/sirchen/pc-app-app-app-app/scripts/submit-indexnow.mjs --sitemap-path sitemap.xml --key-file-path a6013cad6cead8e0.txt --submit
   ```

## Baidu Search Resource Platform

Baidu requires account access and site verification.

1. Add site: `https://www.xiaozhonglvyou.com/`.
2. Verify ownership using DNS or file verification.
3. Submit sitemap: `https://www.xiaozhonglvyou.com/sitemap.xml`.

## Ongoing SEO

- Keep `lastmod` current after major content changes.
- Add focused content pages for specific app search intents, then connect them through normal user-facing hubs such as `apps.html`, `guides.html`, and related product pages.
- For Chinese traffic, keep the sequence clear: `zh-cn.html` -> `ai-photo-classification-cn.html` -> `iphone-photo-cleaner-cn.html` -> `duplicate-photo-cleaner-cn.html`; translation and Mac privacy searches route to `travel-translator-cn.html` and `mac-screen-privacy-cn.html`.
- Use `hreflang` for true localized variants. The home, US, UK, Canada/Australia, Singapore, Switzerland, Netherlands/Nordics, Germany, France, Japan, Simplified Chinese, and Traditional Chinese pages are linked as a regional cluster.
- For high-purchase European traffic, route German photo-cleaner searches to `iphone-foto-cleaner-de.html` and French photo-cleaner searches to `nettoyeur-photo-iphone-fr.html`.
- Keep privacy and support pages reachable from the footer.
- Build real backlinks from App Store support URLs, developer profiles, product pages, and trusted app directories.
