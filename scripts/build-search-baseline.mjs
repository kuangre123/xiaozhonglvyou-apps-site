#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
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
  }
];

const DEFAULT_OUTPUT = "seo-search-baseline.md";

function parseArgs(argv) {
  const args = { input: "", output: DEFAULT_OUTPUT, dateRange: "", source: "Google Search Console" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--input") args.input = argv[++i] || "";
    else if (arg === "--output") args.output = argv[++i] || "";
    else if (arg === "--date-range") args.dateRange = argv[++i] || "";
    else if (arg === "--source") args.source = argv[++i] || args.source;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/build-search-baseline.mjs --input gsc-pages.csv [--output seo-search-baseline.md] [--date-range "2026-08-22 to 2026-09-21"]

Input should be a Google Search Console pages export, or a CSV/TSV with columns like:
Page, Clicks, Impressions, CTR, Position

The script only summarizes supplied measurement data. It does not infer clicks or indexing.`);
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
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString();
  } catch {
    return value.trim();
  }
}

function parseNumber(value) {
  if (!value) return 0;
  const normalized = String(value).replace(/[%,"\s]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parsePercent(value) {
  if (!value) return 0;
  const raw = String(value).trim();
  const parsed = parseNumber(raw);
  return raw.includes("%") ? parsed / 100 : parsed;
}

function rowsToObjects(rows) {
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
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
    if (!page) continue;
    const existing = byPage.get(page) || { clicks: 0, impressions: 0, weightedPosition: 0, ctrValues: [] };
    const clicks = parseNumber(getField(row, ["clicks", "click"]));
    const impressions = parseNumber(getField(row, ["impressions", "impression"]));
    const ctr = parsePercent(getField(row, ["ctr", "click-through rate"]));
    const position = parseNumber(getField(row, ["position", "average position", "avg position"]));
    existing.clicks += clicks;
    existing.impressions += impressions;
    existing.weightedPosition += position * Math.max(impressions, 1);
    if (ctr > 0) existing.ctrValues.push(ctr);
    byPage.set(page, existing);
  }
  return byPage;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function recommendedAction(metric) {
  if (!metric) return "Missing from export: inspect indexing and sitemap discovery first.";
  if (metric.impressions === 0) return "No impressions in export: inspect indexing, country targeting, and internal links.";
  if (metric.clicks === 0) return "Has impressions but no clicks: review title, description, and query intent after confirming enough data.";
  if (metric.ctr < 0.01) return "Low CTR: test a clearer title/description tied to the highest-impression query group.";
  return "Keep monitoring; use query-level export before changing this page.";
}

function buildReport(byPage, args) {
  const lines = [];
  lines.push("# Search Measurement Baseline");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`Source: ${args.source}`);
  if (args.dateRange) lines.push(`Date range: ${args.dateRange}`);
  lines.push("");
  lines.push("This report summarizes supplied measurement exports only. A zero here means the export had zero for that URL, not that every search engine has zero traffic.");
  lines.push("");
  lines.push("| Market | URL | Intent | Clicks | Impressions | CTR | Avg position | Next action |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | --- |");

  for (const target of TARGETS) {
    const metric = byPage.get(target.url);
    const clicks = metric?.clicks || 0;
    const impressions = metric?.impressions || 0;
    const ctr = impressions > 0 ? clicks / impressions : (metric?.ctrValues?.[0] || 0);
    const avgPosition = metric && metric.impressions > 0 ? metric.weightedPosition / metric.impressions : 0;
    lines.push(`| ${target.market} | ${target.url} | ${target.intent} | ${clicks} | ${impressions} | ${formatPercent(ctr)} | ${avgPosition ? avgPosition.toFixed(1) : ""} | ${recommendedAction(metric ? { ...metric, ctr } : null)} |`);
  }

  const totals = TARGETS.reduce((acc, target) => {
    const metric = byPage.get(target.url);
    acc.clicks += metric?.clicks || 0;
    acc.impressions += metric?.impressions || 0;
    return acc;
  }, { clicks: 0, impressions: 0 });

  lines.push("");
  lines.push("## Totals");
  lines.push("");
  lines.push(`- Target URLs: ${TARGETS.length}`);
  lines.push(`- Total clicks: ${totals.clicks}`);
  lines.push(`- Total impressions: ${totals.impressions}`);
  lines.push(`- Aggregate CTR: ${totals.impressions > 0 ? formatPercent(totals.clicks / totals.impressions) : "0.00%"}`);
  lines.push("");
  lines.push("## Required Follow-Up");
  lines.push("");
  lines.push("- If page-level impressions are present, export the matching query-level rows before changing snippets.");
  lines.push("- If the page is missing from the export, inspect the URL in Search Console before creating another near-duplicate page.");
  lines.push("- Compare GA4 `app_store_click` events and App Store Connect product-page views separately from organic clicks.");
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

  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output || DEFAULT_OUTPUT);
  const rows = rowsToObjects(parseDelimited(await readFile(inputPath, "utf8")));
  if (rows.length === 0) throw new Error(`No data rows found in ${inputPath}.`);
  const report = buildReport(summarize(rows), args);
  await writeFile(outputPath, report);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
