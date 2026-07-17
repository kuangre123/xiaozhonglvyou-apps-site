import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteDir = path.join(root, "outputs", "github-pages-site");
const origin = "https://www.xiaozhonglvyou.com";
const keyFileName = "a6013cad6cead8e0.txt";
const key = "a6013cad6cead8e0";

const EXCLUDED = new Set(["404.html", "directory.html", "privacy.html", "search.html", "support.html"]);

function parseArgs(argv) {
  const args = { outputJsonPath: null, outputMarkdownPath: null };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--output-json-path") { args.outputJsonPath = argv[index + 1]; index += 1; continue; }
    if (arg === "--output-markdown-path") { args.outputMarkdownPath = argv[index + 1]; index += 1; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

async function exists(relativePath) {
  try { await access(path.join(root, relativePath)); return true; } catch { return false; }
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());
}

function metaContent(html, name) {
  const re = new RegExp(`<meta\\b(?=[^>]*name=["']${name}["'])[^>]*>`, "i");
  const tag = html.match(re)?.[0] ?? "";
  const content = tag.match(/content\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
  return content.trim();
}

function linkHref(html, rel) {
  const re = new RegExp(`<link\\b(?=[^>]*rel=["']${rel}["'])[^>]*>`, "i");
  const tag = html.match(re)?.[0] ?? "";
  return tag.match(/href\s*=\s*(["'])(.*?)\1/i)?.[2] ?? "";
}

function hasVerificationMeta(html, name) {
  const re = new RegExp(`<meta\\b(?=[^>]*name=["']${name}["'])`, "i");
  return re.test(html);
}

async function auditFiles() {
  const allFiles = (await readdir(siteDir)).filter((f) => f.endsWith(".html"));
  const indexable = allFiles.filter((f) => !EXCLUDED.has(f));
  const pages = [];

  for (const fileName of indexable) {
    const html = await readFile(path.join(siteDir, fileName), "utf8");
    const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<[^>]*>/g, " ").trim();
    const description = metaContent(html, "description");
    const keywords = metaContent(html, "keywords");
    const canonical = linkHref(html, "canonical");
    const robots = metaContent(html, "robots");
    const hasBingVerification = hasVerificationMeta(html, "msvalidate.01");
    const jsonLdCount = [...html.matchAll(/<script type="application\/ld\+json"/gi)].length;

    pages.push({
      file: fileName,
      title,
      titleLength: title.length,
      hasDescription: description.length > 0,
      descriptionLength: description.length,
      hasKeywords: keywords.length > 0,
      hasCanonical: canonical.length > 0,
      canonical,
      robots,
      hasBingVerification,
      jsonLdBlocks: jsonLdCount
    });
  }
  return { pages, total: indexable.length };
}

function summarize(results) {
  const failures = [];
  const { pages, total } = results.pages;
  const robotsTxt = results.robots.txt;
  const sitemapUrls = results.sitemap.urls;

  // Bingbot allowed in robots.txt
  if (!/User-agent:\s*Bingbot/i.test(robotsTxt)) {
    failures.push({ file: "robots.txt", failure: "Bingbot not explicitly allowed" });
  }
  if (!/User-agent:\s*BingPreview/i.test(robotsTxt)) {
    failures.push({ file: "robots.txt", failure: "BingPreview not explicitly allowed" });
  }

  // Sitemap advertised
  if (!robotsTxt.includes("Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml")) {
    failures.push({ file: "robots.txt", failure: "Sitemap not advertised for Bingbot discovery" });
  }

  // IndexNow key file
  if (results.indexNowKey.content !== key) {
    failures.push({ file: keyFileName, failure: "IndexNow key mismatch or missing" });
  }

  // Per-page checks
  const missingKeywords = pages.filter((p) => !p.hasKeywords).map((p) => p.file);
  if (missingKeywords.length > 0) {
    failures.push({ file: "multiple", failure: `Pages missing meta keywords (Bing values these): ${missingKeywords.join(", ")}` });
  }

  const missingDescription = pages.filter((p) => !p.hasDescription).map((p) => p.file);
  if (missingDescription.length > 0) {
    failures.push({ file: "multiple", failure: `Pages missing meta description: ${missingDescription.join(", ")}` });
  }

  const missingCanonical = pages.filter((p) => !p.hasCanonical).map((p) => p.file);
  if (missingCanonical.length > 0) {
    failures.push({ file: "multiple", failure: `Pages missing canonical: ${missingCanonical.join(", ")}` });
  }

  const noindexPages = pages.filter((p) => /noindex/i.test(p.robots)).map((p) => p.file);
  if (noindexPages.length > 0) {
    failures.push({ file: "multiple", failure: `Pages blocked from indexing: ${noindexPages.join(", ")}` });
  }

  // Bing verification (informational - not a hard failure since it requires user action)
  const bingVerified = pages.filter((p) => p.hasBingVerification).length;

  return {
    ok: failures.length === 0,
    summary: {
      indexablePages: total,
      pagesWithKeywords: pages.filter((p) => p.hasKeywords).length,
      pagesWithDescription: pages.filter((p) => p.hasDescription).length,
      pagesWithCanonical: pages.filter((p) => p.hasCanonical).length,
      pagesWithJsonLd: pages.filter((p) => p.jsonLdBlocks > 0).length,
      pagesWithBingVerification: bingVerified,
      bingbotAllowed: /User-agent:\s*Bingbot/i.test(robotsTxt),
      bingPreviewAllowed: /User-agent:\s*BingPreview/i.test(robotsTxt),
      sitemapAdvertised: robotsTxt.includes("Sitemap: https://www.xiaozhonglvyou.com/sitemap.xml"),
      indexNowKeyValid: results.indexNowKey.content === key,
      sitemapUrls: sitemapUrls.length,
      failures: failures.length
    },
    informational: {
      bingWebmasterVerification: bingVerified > 0 ? "msvalidate.01 meta tag present" : "msvalidate.01 meta tag absent; Bing may instead verify the active property through DNS or Google Search Console import",
      indexNowNote: "IndexNow notifies Bing of changes but does not guarantee indexing. An active Bing Webmaster Tools property is required for authoritative reporting.",
      bingbotNote: "Bingbot can fetch the site. Remaining authority recommendations require crawlable links from relevant external domains."
    },
    failures
  };
}

function renderMarkdown(report) {
  const lines = [
    "# Bing Readiness Audit",
    "",
    `Status: ${report.ok ? "PASS" : "FAIL"}`,
    "",
    "## Summary",
    "",
    `- Indexable pages: ${report.summary.indexablePages}`,
    `- Pages with meta keywords (Bing values these): ${report.summary.pagesWithKeywords}`,
    `- Pages with meta description: ${report.summary.pagesWithDescription}`,
    `- Pages with canonical: ${report.summary.pagesWithCanonical}`,
    `- Pages with JSON-LD: ${report.summary.pagesWithJsonLd}`,
    `- Pages with msvalidate.01 meta tag: ${report.summary.pagesWithBingVerification}`,
    `- Bingbot allowed in robots.txt: ${report.summary.bingbotAllowed}`,
    `- BingPreview allowed in robots.txt: ${report.summary.bingPreviewAllowed}`,
    `- Sitemap advertised in robots.txt: ${report.summary.sitemapAdvertised}`,
    `- IndexNow key valid: ${report.summary.indexNowKeyValid}`,
    `- Sitemap URLs: ${report.summary.sitemapUrls}`,
    `- Failures: ${report.summary.failures}`,
    "",
    "## Informational",
    "",
    `- Bing Webmaster verification signal: ${report.informational.bingWebmasterVerification}`,
    `- IndexNow: ${report.informational.indexNowNote}`,
    `- Bingbot: ${report.informational.bingbotNote}`
  ];

  if (report.failures.length > 0) {
    lines.push("", "## Failures", "");
    for (const failure of report.failures) {
      lines.push(`- ${failure.file}: ${failure.failure}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

async function writeOutput(filePath, content) {
  if (!filePath) return;
  const absolutePath = path.resolve(root, filePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, content);
}

const args = parseArgs(process.argv.slice(2));

const results = {
  pages: await auditFiles(),
  robots: {
    txt: await readFile(path.join(siteDir, "robots.txt"), "utf8")
  },
  sitemap: {
    urls: parseSitemap(await readFile(path.join(siteDir, "sitemap.xml"), "utf8"))
  },
  indexNowKey: {
    content: (await readFile(path.join(siteDir, keyFileName), "utf8")).trim()
  }
};

const report = summarize(results);

await writeOutput(args.outputJsonPath, `${JSON.stringify(report, null, 2)}\n`);
await writeOutput(args.outputMarkdownPath, renderMarkdown(report));

if (!report.ok) {
  console.error(renderMarkdown(report));
  process.exit(1);
}

console.log(renderMarkdown(report));
