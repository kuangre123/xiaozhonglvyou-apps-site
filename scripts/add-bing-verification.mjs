// Injects <meta name="msvalidate.01" content="TOKEN" /> into all indexable
// HTML pages in the github-pages-site and syncs to all mirrors.
//
// Usage:
//   node scripts/add-bing-verification.mjs --token YOUR_TOKEN --dry-run
//   node scripts/add-bing-verification.mjs --token YOUR_TOKEN --write
//
// After verification in Bing Webmaster Tools, the tag can stay or be removed.

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const origin = "https://www.xiaozhonglvyou.com";
const EXCLUDED = new Set(["404.html"]);

const siteDirs = [
  "outputs/github-pages-site",
  "outputs/personal-apps-site",
  "outputs/cloudflare-pages-upload",
  "supabase/functions/site/public"
];

function parseArgs(argv) {
  const args = { token: null, dryRun: false, write: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--token") { args.token = argv[index + 1]; index += 1; continue; }
    if (arg === "--dry-run") { args.dryRun = true; continue; }
    if (arg === "--write") { args.write = true; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.token) throw new Error("--token is required (get it from Bing Webmaster Tools)");
  if (!args.dryRun && !args.write) throw new Error("Pass --dry-run or --write");
  return args;
}

const META_TAG = (token) =>
  `    <meta name="msvalidate.01" content="${token}" />`;

async function processDir(siteDir, token, mode) {
  const dirPath = path.join(root, siteDir);
  let files;
  try {
    files = (await readdir(dirPath)).filter((f) => f.endsWith(".html") && !EXCLUDED.has(f));
  } catch {
    return { dir: siteDir, processed: 0, skipped: 0 };
  }

  let processed = 0;
  let skipped = 0;

  for (const fileName of files) {
    const filePath = path.join(dirPath, fileName);
    let html = await readFile(filePath, "utf8");

    // Check if already has the tag
    if (/name=["']msvalidate\.01["']/i.test(html)) {
      skipped += 1;
      continue;
    }

    // Insert right after <meta name="robots" ...> tag
    const robotsRe = /(<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>)/i;
    if (robotsRe.test(html)) {
      html = html.replace(robotsRe, `$1\n${META_TAG(token)}`);
    } else {
      // Fallback: insert after <title>
      const titleRe = /(<\/title>)/i;
      html = html.replace(titleRe, `$1\n${META_TAG(token)}`);
    }

    if (mode === "write") {
      await writeFile(filePath, html, "utf8");
    }
    processed += 1;
  }

  return { dir: siteDir, processed, skipped };
}

const args = parseArgs(process.argv.slice(2));
const mode = args.write ? "write" : "dry-run";

console.log(`Mode: ${mode}`);
console.log(`Token: ${args.token}`);
console.log("");

for (const siteDir of siteDirs) {
  const result = await processDir(siteDir, args.token, mode);
  console.log(`${result.dir}: ${result.processed} processed, ${result.skipped} already had tag`);
}
