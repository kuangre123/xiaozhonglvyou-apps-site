import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "search-baseline-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return {
    dir,
    input: path.join(dir, "gsc-export.csv"),
    output: path.join(dir, "baseline.md")
  };
}

function runBaseline(input, output, extra = [], cwd = path.resolve(import.meta.dirname, "..")) {
  return execFileSync(
    process.execPath,
    [path.join(import.meta.dirname, "build-search-baseline.mjs"), "--input", input,
      ...(output ? ["--output", output] : []), "--date-range", "2026-08-24 to 2026-09-20", "--as-of", "2026-10-09", ...extra],
    { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
}

test("search baseline summarizes target URLs without inventing missing traffic", async t => {
  const f = await fixture(t);
  await writeFile(
    f.input,
    [
      "Page,Clicks,Impressions,CTR,Position",
      "https://www.xiaozhonglvyou.com/ja-jp-photo-cleaner.html,0,120,0%,18.4",
      "https://www.xiaozhonglvyou.com/iphone-foto-cleaner-de.html,3,260,1.15%,9.8",
      "https://www.xiaozhonglvyou.com/tr-tr-photo-cleaner.html,0,0,0%,0"
    ].join("\n")
  );

  assert.match(runBaseline(f.input, f.output), /Wrote /);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Observed target clicks: 3/);
  assert.match(report, /Observed target impressions: 380/);
  assert.match(report, /Target URLs present in export: 3/);
  assert.match(report, /Missing target URLs \(unknown\): 13/);
  assert.match(report, /ja-jp-photo-cleaner\.html \| Japanese photo-cleaner workflow \| 0 \| 120 \| 0\.00% \| 18\.4 \| Visibility review/);
  assert.match(report, /iphone-foto-cleaner-de\.html \| German photo-cleaner workflow \| 3 \| 260 \| 1\.15% \| 9\.8 \| Keep monitoring/);
  assert.match(report, /ja-jp\.html \| Japanese app portfolio discovery \| N\/A \| N\/A \| N\/A \| N\/A \| Missing from export/);
  assert.match(report, /tr-tr-photo-cleaner\.html \| Turkish photo-cleaner workflow \| 0 \| 0 \| N\/A \| N\/A \| Exported zero impressions/);
  assert.match(report, /Reporting cutoff age: 19 days - HISTORICAL/);
  assert.match(report, /country\/device\/query scope is unknown/);
});

test("search baseline accepts TSV exports and common Search Console header variants", async t => {
  const f = await fixture(t);
  await writeFile(
    f.input,
    [
      "Top pages\tClicks\tImpressions\tCTR\tAverage position",
      "https://www.xiaozhonglvyou.com/tr-tr-en-iyi-iphone-fotograf-temizleme.html\t1\t50\t2%\t7.2"
    ].join("\n")
  );

  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /tr-tr-en-iyi-iphone-fotograf-temizleme\.html \| Turkish decision-stage photo-cleaner comparison \| 1 \| 50 \| 2\.00% \| 7\.2/);
  assert.match(report, /Observed target CTR: 2\.00%/);
  assert.match(report, /Small sample:/);
});

test("search baseline includes all newer app pages without inventing country attribution", async t => {
  const f = await fixture(t);
  const pages = ["inkstone-markdown-notes.html", "twopic-dual-camera.html", "lailemma-period-tracker.html",
    "lailemma-period-tracker-cn.html", "lailemma-period-tracker-ja.html", "lailemma-period-tracker-de.html", "lailemma-period-tr.html"];
  await writeFile(f.input, ["Page,Clicks,Impressions,Position", ...pages.map(page => `https://www.xiaozhonglvyou.com/${page},1,200,8`)].join("\n"));
  runBaseline(f.input, f.output, ["--filters", "Search type=Web; Country=Japan"]);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Target URLs: 16/);
  assert.match(report, /Target URLs present in export: 7/);
  assert.match(report, /Export filters: Search type=Web; Country=Japan/);
  assert.match(report, /not the visitor's country/);
  for (const page of pages) assert.ok(report.includes(`${page} |`), page);
});

test("search baseline prioritizes all pages by sample and position, not zero clicks alone", async t => {
  const f = await fixture(t);
  await writeFile(f.input, ["Page,Clicks,Impressions,CTR,Position",
    "https://www.xiaozhonglvyou.com/make-gif-on-iphone-guide.html,0,148,0%,53.63",
    "https://www.xiaozhonglvyou.com/screen-sharing-privacy-guide.html,0,204,0%,7.76",
    "https://www.xiaozhonglvyou.com/iphone-storage-cleanup-guide.html,0,64,0%,40.73",
    "https://www.xiaozhonglvyou.com/best-iphone-photo-cleaner-app.html,0,280,0%,15.38"
  ].join("\n"));
  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /make-gif-on-iphone-guide\.html \| 0 \| 148 \| 0\.00% \| 53\.6 \| Ranking\/intent review first/);
  assert.match(report, /screen-sharing-privacy-guide\.html \| 0 \| 204 \| 0\.00% \| 7\.8 \| Possible CTR review/);
  assert.match(report, /iphone-storage-cleanup-guide\.html \| 0 \| 64 \| 0\.00% \| 40\.7 \| Small sample/);
  assert.match(report, /best-iphone-photo-cleaner-app\.html \| 0 \| 280 \| 0\.00% \| 15\.4 \| Visibility review/);
  assert.ok(report.indexOf("best-iphone-photo-cleaner-app.html") < report.indexOf("screen-sharing-privacy-guide.html"));
  assert.match(report, /heuristics, not Google rules or proven causes/);
  assert.match(report, /Observed target clicks: N\/A/);
});

test("search baseline weights only real impressions and never invents missing positions", async t => {
  const f = await fixture(t);
  await writeFile(f.input, ["Page,Clicks,Impressions,CTR,Position",
    "https://www.xiaozhonglvyou.com/inkstone-markdown-notes.html,1,100,99%,10",
    "https://www.xiaozhonglvyou.com/inkstone-markdown-notes.html,0,300,99%,20",
    "https://www.xiaozhonglvyou.com/inkstone-markdown-notes.html,0,0,99%,90",
    "https://www.xiaozhonglvyou.com/twopic-dual-camera.html,0,100,0%,0",
    "https://www.xiaozhonglvyou.com/lailemma-period-tracker.html,0,100,0%,8",
    "https://www.xiaozhonglvyou.com/lailemma-period-tracker.html,0,100,0%,"
  ].join("\n"));
  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Inkstone Markdown writing and export \| 1 \| 400 \| 0\.25% \| 17\.5/);
  assert.match(report, /TwoPic dual-camera capture \| 0 \| 100 \| 0\.00% \| N\/A \| Position unavailable/);
  assert.match(report, /Laleme cycles and Body Readiness \| 0 \| 200 \| 0\.00% \| N\/A \| Position unavailable/);
  assert.doesNotMatch(report, /99\.00%/);
});

test("search baseline accepts quoted CSV, BOM, CRLF, grouped counts and absent optional position", async t => {
  const f = await fixture(t);
  await writeFile(f.input, '\uFEFF"Top pages","Clicks","Impressions","Label"\r\n"https://www.xiaozhonglvyou.com/inkstone-markdown-notes.html","12","1,200","a, b\nquoted ""label"""\r\n');
  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Inkstone Markdown writing and export \| 12 \| 1200 \| 1\.00% \| N\/A/);
});

test("search baseline does not merge query-string URLs into canonical targets", async t => {
  const f = await fixture(t);
  await writeFile(f.input, "Page,Clicks,Impressions,Position\nhttps://www.xiaozhonglvyou.com/inkstone-markdown-notes.html?variant=a,1,100,8");
  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Inkstone Markdown writing and export \| N\/A \| N\/A \| N\/A \| N\/A/);
  assert.match(report, /inkstone-markdown-notes\.html\?variant=a \| 1 \| 100/);
});

test("search baseline allows header-only export as unknown, not zero target totals", async t => {
  const f = await fixture(t);
  await writeFile(f.input, "Page,Clicks,Impressions,Position\n");
  runBaseline(f.input, f.output);
  const report = await readFile(f.output, "utf8");
  assert.match(report, /Missing target URLs \(unknown\): 16/);
  assert.match(report, /Observed target impressions: N\/A/);
  assert.match(report, /Observed target CTR: N\/A/);
});

test("search baseline rejects wrong dimensions, malformed rows and invalid metrics before writing", async t => {
  const f = await fixture(t);
  const prefix = "https://www.xiaozhonglvyou.com/inkstone-markdown-notes.html";
  const inputs = [
    ["Query,Clicks,Impressions\ninkstone,0,10", /Missing required page-export column: page/],
    ["Page,Impressions\n" + prefix + ",10", /Missing required page-export column: clicks/],
    ["Page,Clicks,Impressions\n" + prefix + ",,10", /Invalid or missing clicks/],
    ["Page,Clicks,Impressions\n" + prefix + ",-1,10", /Invalid or missing clicks/],
    ["Page,Clicks,Impressions\n" + prefix + ",0,NaN", /Invalid or missing impressions/],
    ["Page,Clicks,Impressions\n" + prefix + ",0,1.5", /Invalid impressions/],
    ["Page,Clicks,Impressions\n" + prefix + ",2,1", /Clicks exceed impressions/],
    ["Page,Clicks,Impressions\n" + prefix + ",0", /has 2 fields; expected 3/],
    ['Page,Clicks,Impressions\n"' + prefix + ",0,10", /Unclosed quoted CSV field/],
    ["Page,Clicks,Impressions\njavascript:alert(1),0,10", /Invalid page URL/],
    ["Page,Clicks,Clicks,Impressions\n" + prefix + ",0,0,10", /Duplicate export column/]
  ];
  for (const [input, error] of inputs) {
    await writeFile(f.input, input);
    assert.throws(() => runBaseline(f.input, f.output), error);
    await assert.rejects(readFile(f.output), { code: "ENOENT" });
  }
});

test("search baseline requires explicit valid dates and preserves the input file", async t => {
  const f = await fixture(t);
  const input = "Page,Clicks,Impressions\nhttps://www.xiaozhonglvyou.com/ja-jp.html,0,10";
  await writeFile(f.input, input);
  for (const range of ["Last 28 days", "2026-02-30 to 2026-09-20", "2026-10-01 to 2026-09-20", "2026-10-01 to 2026-10-10"]) {
    assert.throws(() => runBaseline(f.input, f.output, ["--date-range", range]), /Invalid date|Provide --date-range|reversed or ends after/);
  }
  assert.throws(() => runBaseline(f.input, f.input), /must not overwrite/);
  assert.equal(await readFile(f.input, "utf8"), input);
});

test("search baseline defaults to an excluded private output directory", async t => {
  const f = await fixture(t);
  await writeFile(f.input, "Page,Clicks,Impressions\n");
  runBaseline(f.input, null, [], f.dir);
  const report = await readFile(path.join(f.dir, "outputs/seo-search-baseline.md"), "utf8");
  assert.match(report, /Observed target clicks: N\/A/);
  const config = await readFile(path.join(import.meta.dirname, "../_config.yml"), "utf8");
  assert.match(config, /^  - outputs\/\s*$/m);
});
