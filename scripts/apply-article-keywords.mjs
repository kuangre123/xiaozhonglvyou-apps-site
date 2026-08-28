#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { articleKeywordsByFile } from "./article-keyword-map.mjs";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");

function typeList(node) {
  return Array.isArray(node?.["@type"]) ? node["@type"] : [node?.["@type"]].filter(Boolean);
}

function hasType(node, type) {
  return typeList(node).includes(type);
}

function flattenJsonLd(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.["@graph"])) return value["@graph"];
  return [value];
}

function updateArticleNodes(value, fileName) {
  if (Array.isArray(value)) return value.map((item) => updateArticleNodes(item, fileName));
  if (!value || typeof value !== "object") return value;

  const updated = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, updateArticleNodes(child, fileName)])
  );

  if (hasType(updated, "Article")) {
    const keywords = articleKeywordsByFile.get(fileName);
    if (!keywords) throw new Error(`Missing article keyword mapping for ${fileName}`);
    updated.keywords = keywords;
  }

  return updated;
}

async function updateFile(fileName) {
  const filePath = path.join(siteDir, fileName);
  const original = await readFile(filePath, "utf8");
  let articleCount = 0;
  const updated = original.replace(
    /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi,
    (block) => {
      const openEnd = block.indexOf(">");
      const openTag = block.slice(0, openEnd + 1);
      const body = block.slice(openEnd + 1, -"</script>".length).trim();
      const parsed = JSON.parse(body);
      const nodes = flattenJsonLd(parsed);
      articleCount += nodes.filter((node) => hasType(node, "Article")).length;
      return `${openTag}${JSON.stringify(updateArticleNodes(parsed, fileName))}</script>`;
    }
  );

  if (articleCount === 0) return { fileName, changed: false, articleCount };
  if (updated !== original) await writeFile(filePath, updated, "utf8");
  return { fileName, changed: updated !== original, articleCount };
}

const files = (await readdir(siteDir))
  .filter((fileName) => fileName.endsWith(".html"))
  .filter((fileName) => fileName !== "404.html")
  .sort();
const results = await Promise.all(files.map(updateFile));
const articleResults = results.filter((result) => result.articleCount > 0);
const changed = articleResults.filter((result) => result.changed);

console.log(`Article pages: ${articleResults.length}`);
console.log(`Article nodes: ${articleResults.reduce((sum, result) => sum + result.articleCount, 0)}`);
console.log(`Changed files: ${changed.length}`);
for (const result of changed) console.log(result.fileName);
