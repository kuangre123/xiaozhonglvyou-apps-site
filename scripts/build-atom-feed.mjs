#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://www.xiaozhonglvyou.com";

function parseArgs(argv) {
  const args = { siteDir: process.cwd() };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--site-dir" && argv[index + 1]) {
      args.siteDir = path.resolve(argv[index + 1]);
      index += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${argv[index]}`);
  }

  return args;
}

const { siteDir } = parseArgs(process.argv.slice(2));

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.["@graph"])) return value["@graph"];
  return [value];
}

function articleNodes(html) {
  const nodes = [];

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    nodes.push(...flattenJsonLd(JSON.parse(match[1])));
  }

  return nodes.filter((node) => {
    const types = Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]];
    return types.includes("Article");
  });
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function atomDate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return `${value}T00:00:00Z`;
  return new Date(value).toISOString();
}

const htmlFiles = (await readdir(siteDir))
  .filter((fileName) => fileName.endsWith(".html") && fileName !== "404.html")
  .sort();
const entries = [];

for (const fileName of htmlFiles) {
  const html = await readFile(path.join(siteDir, fileName), "utf8");

  for (const article of articleNodes(html)) {
    const link = article.mainEntityOfPage || `${origin}/${fileName}`;
    entries.push({
      title: article.headline || fileName,
      link,
      published: atomDate(article.datePublished || article.dateModified),
      updated: atomDate(article.dateModified || article.datePublished),
      summary: article.description || ""
    });
  }
}

entries.sort((a, b) => b.updated.localeCompare(a.updated) || a.link.localeCompare(b.link));
const feedUpdated = entries[0]?.updated || new Date().toISOString();
const entryXml = entries.map((entry) => `  <entry>
    <title>${escapeXml(entry.title)}</title>
    <link href="${escapeXml(entry.link)}" />
    <id>${escapeXml(entry.link)}</id>
    <published>${escapeXml(entry.published)}</published>
    <updated>${escapeXml(entry.updated)}</updated>
    <summary>${escapeXml(entry.summary)}</summary>
  </entry>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>CrazyAIAgent Updates</title>
  <id>${origin}/atom.xml</id>
  <link href="${origin}/" rel="alternate" />
  <link href="${origin}/atom.xml" rel="self" />
  <updated>${feedUpdated}</updated>
  <author>
    <name>CrazyAIAgent</name>
    <uri>${origin}/</uri>
  </author>
${entryXml}
</feed>
`;

await writeFile(path.join(siteDir, "atom.xml"), xml, "utf8");
console.log(`Wrote ${entries.length} article entries to ${path.join(siteDir, "atom.xml")}.`);
