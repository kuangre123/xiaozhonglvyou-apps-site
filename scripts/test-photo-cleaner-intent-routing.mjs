import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { articleKeywordsByFile } from "./article-keyword-map.mjs";

const siteDir = path.resolve(import.meta.dirname, "..");

test("photo cleaner comparison owns comparison intent and routes free-use intent", async () => {
  const decisionKeywords = articleKeywordsByFile.get("best-iphone-photo-cleaner-app.html");
  const comparisonKeywords = articleKeywordsByFile.get("iphone-photo-cleaner-comparison.html");

  assert.ok(decisionKeywords.includes("free photo cleaner app for iPhone"));
  assert.ok(comparisonKeywords.includes("photo cleaner app pricing comparison"));
  assert.ok(!comparisonKeywords.includes("free photo cleaner app"));

  const html = await readFile(path.join(siteDir, "iphone-photo-cleaner-comparison.html"), "utf8");
  const quickAnswer = html.match(/<section[^>]*id="key-answer"[^>]*>[\s\S]*?<\/section>/)?.[0];

  assert.ok(quickAnswer, "comparison page is missing its quick-answer section");
  assert.match(
    quickAnswer,
    /href="best-iphone-photo-cleaner-app\.html">free iPhone photo cleaner guide<\/a>/
  );
});
