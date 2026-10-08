import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { checkSearchCrawlerPolicy } from "./search-crawler-policy.mjs";

const crawlers = ["Googlebot", "Bingbot", "Y!J-BRW", "YandexBot", "Qwantbot"];
const base = "User-agent: *\nAllow: /\nDisallow: /README.md\n";

test("published crawler groups preserve the open-crawl policy", async () => {
  const text = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
  const result = checkSearchCrawlerPolicy(text, crawlers);
  assert.equal(result.groupsChecked, 2);
  assert.deepEqual(result.failures, []);
});

test("comments, mixed-case fields, CRLF and empty disallows are accepted", () => {
  const text = base + "uSeR-aGeNt: QwantBot # web crawler\r\nAlLoW: / # public pages\r\nDisallow:\r\n";
  assert.deepEqual(checkSearchCrawlerPolicy(text, crawlers).failures, []);
});

test("asset and market-path exclusions cannot pass merely by naming a crawler", () => {
  for (const value of ["/assets/", "/ja-jp.html", "/de-*", "/*.webp$", "/"]) {
    const text = base + `User-agent: Bingbot\nAllow: /\nDisallow: ${value}\n`;
    const result = checkSearchCrawlerPolicy(text, crawlers);
    assert.equal(result.failures.length, 1);
    assert.ok(result.failures[0].includes(`Disallow: ${value}`));
  }
});

test("duplicate named groups cannot hide a blocking rule", () => {
  const text = base + "User-agent: YandexBot\nAllow: /\nUser-agent: YandexBot\nAllow: /\nDisallow: /tr-tr.html\n";
  assert.match(checkSearchCrawlerPolicy(text, crawlers).failures.join("\n"), /Disallow: \/tr-tr\.html/);
});

test("each applicable group needs an explicit root allow", () => {
  const text = base + "User-agent: Googlebot\nDisallow: /README.md\n";
  assert.match(checkSearchCrawlerPolicy(text, crawlers).failures.join("\n"), /must explicitly Allow: \//);
});

test("unknown engines remain covered by the wildcard group", () => {
  const text = "User-agent: Googlebot\nAllow: /\n";
  assert.match(checkSearchCrawlerPolicy(text, crawlers).failures.join("\n"), /Missing wildcard crawler group/);
  assert.match(checkSearchCrawlerPolicy(base + "Disallow: /assets/\n", crawlers).failures.join("\n"), /Disallow: \/assets\//);
});
