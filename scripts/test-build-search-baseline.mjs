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

function runBaseline(input, output) {
  return execFileSync(
    process.execPath,
    ["scripts/build-search-baseline.mjs", "--input", input, "--output", output, "--date-range", "sample"],
    { cwd: path.resolve(import.meta.dirname, ".."), encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
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
  assert.match(report, /Total clicks: 3/);
  assert.match(report, /Total impressions: 380/);
  assert.match(report, /ja-jp-photo-cleaner\.html \| Japanese photo-cleaner workflow \| 0 \| 120 \| 0\.00% \| 18\.4 \| Has impressions but no clicks/);
  assert.match(report, /iphone-foto-cleaner-de\.html \| German photo-cleaner workflow \| 3 \| 260 \| 1\.15% \| 9\.8 \| Keep monitoring/);
  assert.match(report, /ja-jp\.html \| Japanese app portfolio discovery \| 0 \| 0 \| 0\.00% \|  \| Missing from export/);
  assert.match(report, /tr-tr-photo-cleaner\.html \| Turkish photo-cleaner workflow \| 0 \| 0 \| 0\.00% \|  \| No impressions in export/);
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
  assert.match(report, /Aggregate CTR: 2\.00%/);
});
