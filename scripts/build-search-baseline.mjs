#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const TARGETS = [
  {
    market: "Japan",
    country: "JPN",
    language: "ja",
    url: "https://www.xiaozhonglvyou.com/ja-jp.html",
    intent: "Japanese app portfolio discovery"
  },
  {
    market: "Japan",
    country: "JPN",
    language: "ja",
    url: "https://www.xiaozhonglvyou.com/ja-jp-photo-cleaner.html",
    intent: "Japanese photo-cleaner workflow"
  },
  {
    market: "Japan",
    country: "JPN",
    language: "ja",
    url: "https://www.xiaozhonglvyou.com/ja-jp-best-iphone-photo-cleaner.html",
    intent: "Japanese decision-stage photo-cleaner comparison"
  },
  {
    market: "Germany",
    country: "DEU",
    language: "de",
    url: "https://www.xiaozhonglvyou.com/de-de.html",
    intent: "German app portfolio discovery"
  },
  {
    market: "Germany",
    country: "DEU",
    language: "de",
    url: "https://www.xiaozhonglvyou.com/iphone-foto-cleaner-de.html",
    intent: "German photo-cleaner workflow"
  },
  {
    market: "Germany",
    country: "DEU",
    language: "de",
    url: "https://www.xiaozhonglvyou.com/de-de-beste-iphone-foto-cleaner.html",
    intent: "German decision-stage photo-cleaner comparison"
  },
  {
    market: "Turkiye",
    country: "TUR",
    language: "tr",
    url: "https://www.xiaozhonglvyou.com/tr-tr.html",
    intent: "Turkish app portfolio discovery"
  },
  {
    market: "Turkiye",
    country: "TUR",
    language: "tr",
    url: "https://www.xiaozhonglvyou.com/tr-tr-photo-cleaner.html",
    intent: "Turkish photo-cleaner workflow"
  },
  {
    market: "Turkiye",
    country: "TUR",
    language: "tr",
    url: "https://www.xiaozhonglvyou.com/tr-tr-en-iyi-iphone-fotograf-temizleme.html",
    intent: "Turkish decision-stage photo-cleaner comparison"
  },
  ...[
    ["English", "inkstone-markdown-notes.html", "Inkstone Markdown writing and export"],
    ["English", "twopic-dual-camera.html", "TwoPic dual-camera capture"],
    ["English", "lailemma-period-tracker.html", "Laleme cycles and Body Readiness"],
    ["Chinese", "lailemma-period-tracker-cn.html", "Laleme cycles and Body Readiness"],
    ["Japan", "lailemma-period-tracker-ja.html", "Japanese Laleme and Body Readiness"],
    ["Germany", "lailemma-period-tracker-de.html", "German Laleme and Body Readiness"],
    ["Turkiye", "lailemma-period-tr.html", "Turkish Laleme and Body Readiness"]
  ].map(([market, file, intent]) => ({ market, url: `https://www.xiaozhonglvyou.com/${file}`, intent }))
];

const DEFAULT_OUTPUT = "outputs/seo-search-baseline.md";
const MIN_IMPRESSIONS = 100;
const STALE_AFTER_DAYS = 7;

function parseArgs(argv) {
  const args = {
    input: "", output: DEFAULT_OUTPUT, dateRange: "", source: "Google Search Console",
    filters: "Not supplied; country/device/query scope is unknown", asOf: new Date().toISOString().slice(0, 10)
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") args.input = argv[++i] || "";
    else if (arg === "--output") args.output = argv[++i] || "";
    else if (arg === "--date-range") args.dateRange = argv[++i] || "";
    else if (arg === "--source") args.source = argv[++i] || args.source;
    else if (arg === "--filters") args.filters = argv[++i] || "";
    else if (arg === "--as-of") args.asOf = argv[++i] || "";
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/build-search-baseline.mjs --input gsc-pages.csv --date-range "2026-08-22 to 2026-09-21" [--output outputs/seo-search-baseline.md] [--filters "Search type=Web; no page/query/country/device filters"] [--as-of YYYY-MM-DD]

Input should be a Google Search Console pages export, or a CSV/TSV with columns like:
Page, Clicks, Impressions, CTR, Position

Enable clicks and impressions before exporting. Average position is optional.
Use explicit dates from the chart, not "Last 28 days" or the download date.
The private report covers 16 target URLs and prioritizes every supplied page row.
Missing rows are unknown, not zero; page-language labels are not visitor countries.
The script does not infer clicks, indexing or query-to-page attribution.`);
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  return (firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length ? "\t" : ",";
}

function parseDelimited(text) {
  const delimiter = detectDelimiter(text);
  const rows = [];
  let current = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === delimiter) {
      current.push(value);
      value = "";
    } else if (char === "\n") {
      current.push(value.replace(/\r$/, ""));
      rows.push(current);
      current = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (quoted) throw new Error("Unclosed quoted CSV field.");
  if (value.length > 0 || current.length > 0) {
    current.push(value.replace(/\r$/, ""));
    rows.push(current);
  }
  return rows.filter((row) => row.some((cell) => cell.trim()));
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[\uFEFF"]/g, "");
}

function normalizeUrl(value) {
  if (!value) return "";
  try {
    const parsed = new URL(value.trim());
    if (!["https:", "http:"].includes(parsed.protocol)) throw new Error("Not an HTTP URL");
    return parsed.toString();
  } catch {
    throw new Error(`Invalid page URL: ${value}`);
  }
}

function parseNumber(value, label, { optional = false, integer = false } = {}) {
  const raw = String(value ?? "").trim();
  if (optional && ["", "-", "~"].includes(raw)) return null;
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(raw)) {
    throw new Error(`Invalid or missing ${label}: ${raw || "(blank)"}`);
  }
  const normalized = raw.replace(/,/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || (integer && !Number.isSafeInteger(parsed))) throw new Error(`Invalid ${label}: ${raw}`);
  return parsed;
}

function rowsToObjects(rows) {
  if (rows.length === 0) throw new Error("Empty export.");
  const headers = rows[0].map(normalizeHeader);
  for (const names of [["page", "pages", "top pages", "url", "landing page"], ["clicks", "click"], ["impressions", "impression"]]) {
    if (!headers.some(header => names.includes(header))) throw new Error(`Missing required page-export column: ${names[0]}`);
  }
  if (new Set(headers).size !== headers.length) throw new Error("Duplicate export column.");
  return rows.slice(1).map((row, index) => {
    if (row.length !== headers.length) throw new Error(`CSV row ${index + 2} has ${row.length} fields; expected ${headers.length}.`);
    return Object.fromEntries(headers.map((header, column) => [header, row[column]]));
  });
}

function getField(row, names) {
  for (const name of names) {
    if (row[name] !== undefined) return row[name];
  }
  return "";
}

function summarize(rows) {
  const byPage = new Map();
  for (const row of rows) {
    const page = normalizeUrl(getField(row, ["page", "pages", "top pages", "url", "landing page"]));
    if (!page) throw new Error("Missing page URL in export row.");
    const existing = byPage.get(page) || { clicks: 0, impressions: 0, weightedPosition: 0, positionImpressions: 0 };
    const clicks = parseNumber(getField(row, ["clicks", "click"]), `clicks for ${page}`, { integer: true });
    const impressions = parseNumber(getField(row, ["impressions", "impression"]), `impressions for ${page}`, { integer: true });
    if (clicks > impressions) throw new Error(`Clicks exceed impressions for ${page}.`);
    const position = parseNumber(getField(row, ["position", "average position", "avg position"]), `position for ${page}`, { optional: true });
    existing.clicks += clicks;
    existing.impressions += impressions;
    // Zero positions can represent unavailable exported values, not a rank ahead of 1.
    if (position >= 1 && impressions > 0) {
      existing.weightedPosition += position * impressions;
      existing.positionImpressions += impressions;
    }
    byPage.set(page, existing);
  }
  return byPage;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function averagePosition(metric) {
  return metric.impressions > 0 && metric.positionImpressions === metric.impressions
    ? metric.weightedPosition / metric.positionImpressions : null;
}

function recommendedAction(metric) {
  if (!metric) return "Missing from export: traffic and indexing are unknown; check scope, cutoff and URL Inspection.";
  if (metric.impressions === 0) return "Exported zero impressions: check scope and indexing separately; zero alone is not an exclusion reason.";
  if (metric.impressions < MIN_IMPRESSIONS) return "Small sample: collect matching query/page/country/device data before judging CTR or changing snippets.";
  const position = averagePosition(metric);
  if (position === null) return "Position unavailable: acquire matching query/page positions before diagnosing low clicks.";
  if (position > 20) return "Ranking/intent review first: map actual queries and landing URLs; low clicks do not prove a snippet problem.";
  if (position > 10) return "Visibility review: inspect query/page intent and internal links before testing snippets.";
  if (metric.clicks / metric.impressions < 0.01) return "Possible CTR review: verify query, country, device and search appearance before a snippet experiment; not a proven cause.";
  return "Keep monitoring; use query-level export before changing this page.";
}

function metricCells(metric) {
  if (!metric) return "N/A | N/A | N/A | N/A";
  const position = averagePosition(metric);
  return `${metric.clicks} | ${metric.impressions} | ${metric.impressions > 0 ? formatPercent(metric.clicks / metric.impressions) : "N/A"} | ${position === null ? "N/A" : position.toFixed(1)}`;
}

function cell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/[\r\n]/g, " ");
}

function dateValue(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid date: ${value}`);
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error(`Invalid date: ${value}`);
  return time;
}

function validateDateRange(args) {
  const range = args.dateRange.match(/^(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})$/);
  if (!range) throw new Error('Provide --date-range "YYYY-MM-DD to YYYY-MM-DD" from the chart.');
  const start = dateValue(range[1]);
  const end = dateValue(range[2]);
  const asOf = dateValue(args.asOf);
  if (start > end || end > asOf) throw new Error("Date range is reversed or ends after --as-of.");
  return Math.round((asOf - end) / 86400000);
}

function buildReport(byPage, args) {
  const age = validateDateRange(args);
  const lines = [];
  lines.push("# Search Measurement Baseline");
  lines.push("");
  lines.push(`Generated/as of: ${args.asOf}`);
  lines.push(`Source: ${args.source}`);
  lines.push(`Input: ${args.input}`);
  lines.push(`Date range: ${args.dateRange}`);
  lines.push(`Export filters: ${args.filters}`);
  lines.push(`Reporting cutoff age: ${age} days${age > STALE_AFTER_DAYS ? " - HISTORICAL: do not use as current performance or post-release evidence" : " - check preliminary-data status before comparison"}`);
  lines.push("");
  lines.push("Missing rows are N/A, not zero traffic or non-indexed pages. Exported zeros are only reported values for this scope; Google may export unavailable values as zero. This is not an indexing report.");
  lines.push("Market/language labels describe the target page, not the visitor's country. Do not infer Japan/Germany/Turkiye traffic without matching country filters. URLs with query strings remain distinct.");
  lines.push("Priorities are conservative internal triage heuristics, not Google rules or proven causes: fewer than 100 impressions is a small sample; average-position bands 10/20 and CTR below 1% only guide which data to inspect. Page averages are not individual keyword ranks.");
  lines.push("Repeated URL rows are summed only on the assumption that they represent disjoint observations in the stated window. Never combine overlapping exports; supplied page-row totals are not property chart totals.");
  lines.push("");
  lines.push("| Target market/language | URL | Intent | Clicks | Impressions | CTR | Avg position | Next action |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | --- |");

  for (const target of TARGETS) {
    const metric = byPage.get(target.url);
    lines.push(`| ${target.market} | ${target.url} | ${target.intent} | ${metricCells(metric)} | ${recommendedAction(metric)} |`);
  }

  const totals = TARGETS.reduce((acc, target) => {
    const metric = byPage.get(target.url);
    acc.clicks += metric?.clicks || 0;
    acc.impressions += metric?.impressions || 0;
    return acc;
  }, { clicks: 0, impressions: 0 });

  lines.push("");
  const matched = TARGETS.filter(target => byPage.has(target.url)).length;
  lines.push("## Observed Target Subset (Not Property Totals)");
  lines.push("");
  lines.push(`- Target URLs: ${TARGETS.length}`);
  lines.push(`- Target URLs present in export: ${matched}`);
  lines.push(`- Missing target URLs (unknown): ${TARGETS.length - matched}`);
  lines.push(`- Observed target clicks: ${matched ? totals.clicks : "N/A"}`);
  lines.push(`- Observed target impressions: ${matched ? totals.impressions : "N/A"}`);
  lines.push(`- Observed target CTR: ${totals.impressions > 0 ? formatPercent(totals.clicks / totals.impressions) : "N/A"}`);
  lines.push("");
  lines.push("## All Supplied Pages, Sorted by Impressions");
  lines.push("");
  lines.push("| URL | Clicks | Impressions | CTR | Avg position | Data-first next action |");
  lines.push("| --- | ---: | ---: | ---: | ---: | --- |");
  for (const [url, metric] of [...byPage].sort((a, b) => b[1].impressions - a[1].impressions || a[0].localeCompare(b[0]))) {
    lines.push(`| ${cell(url)} | ${metricCells(metric)} | ${recommendedAction(metric)} |`);
  }
  lines.push("");
  lines.push("## Required Follow-Up");
  lines.push("");
  lines.push("- If page-level impressions are present, export the matching query-level rows before changing snippets.");
  lines.push("- If the page is missing from the export, inspect the URL in Search Console before creating another near-duplicate page.");
  lines.push("- Compare GA4 `app_store_click` events and App Store Connect product-page views separately from organic clicks.");
  lines.push("- Acquire the non-indexed URL/reason export separately; performance row absence cannot identify an exclusion.");
  lines.push("- [Google: metrics, aggregation and unavailable export values](https://support.google.com/webmasters/answer/7576553?hl=en)");
  lines.push("- [Google: performance data filtering and limits](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive)");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.input) throw new Error("Missing --input path for a Search Console export.");
  validateDateRange(args);

  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output || DEFAULT_OUTPUT);
  if (inputPath === outputPath) throw new Error("Output must not overwrite the measurement input.");
  const rows = rowsToObjects(parseDelimited(await readFile(inputPath, "utf8")));
  const report = buildReport(summarize(rows), args);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, report);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
