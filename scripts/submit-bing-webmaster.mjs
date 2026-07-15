// Submits URLs to Bing via the Bing Webmaster URL Submission API.
// Requires a Bing Webmaster API key (different from IndexNow key).
//
// Get your API key:
//   1. Register at https://www.bing.com/webmasters
//   2. Add and verify your site
//   3. Go to Settings > API access to get your API key
//
// Usage:
//   node scripts/submit-bing-webmaster.mjs --api-key YOUR_KEY --dry-run
//   node scripts/submit-bing-webmaster.mjs --api-key YOUR_KEY --submit
//
// Without --api-key, prints instructions on how to get one.

import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const origin = "https://www.xiaozhonglvyou.com";
const siteUrl = origin + "/";
const sitemapPath = "outputs/github-pages-site/sitemap.xml";
const apiBase = "https://ssl.bing.com/webmaster/api.svc/json";

function parseArgs(argv) {
  const args = { apiKey: null, dryRun: false, submit: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--api-key") { args.apiKey = argv[index + 1]; index += 1; continue; }
    if (arg === "--dry-run") { args.dryRun = true; continue; }
    if (arg === "--submit") { args.submit = true; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.dryRun && !args.submit) throw new Error("Pass --dry-run or --submit");
  return args;
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());
}

async function checkUrlIndexStatus(apiKey, url) {
  const endpoint = `${apiBase}/GetUrlIndexStatus?siteUrl=${encodeURIComponent(siteUrl)}&url=${encodeURIComponent(url)}&apikey=${apiKey}`;
  const response = await fetch(endpoint, { headers: { "accept": "application/json" } });
  const body = await response.text();
  return { status: response.status, body: JSON.parse(body) };
}

async function submitUrl(apiKey, url) {
  const endpoint = `${apiBase}/SubmitUrl?siteUrl=${encodeURIComponent(siteUrl)}&url=${encodeURIComponent(url)}&apikey=${apiKey}`;
  const response = await fetch(endpoint, { method: "POST", headers: { "accept": "application/json" } });
  const body = await response.text();
  return { status: response.status, body: JSON.parse(body) };
}

const args = parseArgs(process.argv.slice(2));

if (!args.apiKey) {
  console.log(`Bing Webmaster URL Submission API

To use this script you need a Bing Webmaster API key:

1. Register at https://www.bing.com/webmasters
2. Add site: ${siteUrl}
3. Verify ownership (use add-bing-verification.mjs with your msvalidate.01 token)
4. Go to Settings > API access > copy your API key
5. Run: node scripts/submit-bing-webmaster.mjs --api-key YOUR_KEY --dry-run
6. Submit: node scripts/submit-bing-webmaster.mjs --api-key YOUR_KEY --submit

This API actively pushes URLs into Bing's crawl queue (stronger than IndexNow).
IndexNow only notifies; this API directly requests indexing.`);
  process.exit(0);
}

const urls = parseSitemap(await readFile(path.join(root, sitemapPath), "utf8"));
console.log(`Mode: ${args.submit ? "submit" : "dry-run"}`);
console.log(`API Key: ${args.apiKey.slice(0, 8)}...`);
console.log(`URLs to process: ${urls.length}`);
console.log("");

if (args.dryRun) {
  console.log("Dry run - checking index status of first 5 URLs:");
  for (const url of urls.slice(0, 5)) {
    try {
      const result = await checkUrlIndexStatus(args.apiKey, url);
      console.log(`  ${url}`);
      console.log(`    HTTP ${result.status}: ${JSON.stringify(result.body)}`);
    } catch (error) {
      console.log(`  ${url}: ERROR - ${error.message}`);
    }
  }
  console.log(`\nRun with --submit to submit all ${urls.length} URLs.`);
} else {
  let success = 0;
  let failed = 0;
  for (const url of urls) {
    try {
      const result = await submitUrl(args.apiKey, url);
      if (result.status === 200) {
        success += 1;
        console.log(`  OK: ${url}`);
      } else {
        failed += 1;
        console.log(`  FAIL (${result.status}): ${url} - ${JSON.stringify(result.body)}`);
      }
    } catch (error) {
      failed += 1;
      console.log(`  ERROR: ${url} - ${error.message}`);
    }
    // Rate limit: Bing allows max 10 URLs per day per site on free tier
    // and 10,000 per month
  }
  console.log(`\nSubmitted: ${success}, Failed: ${failed}`);
  console.log("Note: Bing allows max 10 URL submissions per day per site.");
}
