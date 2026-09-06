import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { lastSuccessfulRef, parseArgs, runSubmission, selectUrls, verifyDeployment } from "./submit-indexnow.mjs";

const origin = "https://www.xiaozhonglvyou.com";
const url = file => `${origin}/${file === "index.html" ? "" : file}`;
async function fixture(t) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "indexnow-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-b", "main");
  git("config", "user.name", "IndexNow test");
  git("config", "user.email", "indexnow-test@example.invalid");
  const put = (file, content) => writeFile(path.join(dir, file), content);
  const sitemap = files => put("sitemap.xml", `<urlset>${files.map(file => `<url><loc>${url(file)}</loc></url>`).join("")}</urlset>`);
  const commit = () => { git("add", "-A"); git("commit", "-m", "Fixture"); return git("rev-parse", "HEAD"); };
  await put("a6013cad6cead8e0.txt", "a6013cad6cead8e0");
  await put("index.html", "home");
  await put("ja.html", "Japanese version 1");
  await put("old.html", "retired page");
  await put("unlisted.html", "existing unlisted page");
  await sitemap(["index.html", "ja.html", "old.html"]);
  const base = commit();
  const options = overrides => parseArgs([], { sitemapPath: path.join(dir, "sitemap.xml"), keyFilePath: path.join(dir, "a6013cad6cead8e0.txt"), skipLiveKeyCheck: true, sinceRef: base, ...overrides });
  return { dir, git, put, sitemap, commit, base, options };
}

test("IndexNow selects changed, renamed, removed, and newly listed pages across multiple commits", async t => {
  const f = await fixture(t);
  await f.put("ja.html", "Japanese version 2");
  f.commit();
  await rm(path.join(f.dir, "old.html"));
  await f.put("tr.html", "retired page");
  await f.put("404.html", "not indexable");
  await f.sitemap(["index.html", "ja.html", "tr.html", "unlisted.html"]);
  const head = f.commit();
  const expected = [url("ja.html"), url("old.html"), url("tr.html"), url("unlisted.html")].sort();
  assert.deepEqual((await selectUrls(path.join(f.dir, "sitemap.xml"), f.base)).sort(), expected);
  assert.deepEqual(await selectUrls(path.join(f.dir, "sitemap.xml"), head), []);
  const noNetwork = () => { throw new Error("Unchanged release must make no network request"); };
  const skipped = await runSubmission(f.options({ sinceRef: head, submit: true, verifyLive: true }), noNetwork);
  assert.equal(skipped.outcome, "skipped_no_changed_urls");
});

test("IndexNow uses a successful ancestor and can recover missing history with a full selection", async t => {
  const f = await fixture(t);
  await f.put("ja.html", "new content");
  f.commit();
  const env = { GITHUB_TOKEN: "test-token", GITHUB_REPOSITORY: "example/site", GITHUB_REF_NAME: "main", GITHUB_RUN_ID: "9" };
  const request = async () => Response.json({ workflow_runs: [{ id: 8, head_sha: "f".repeat(40) }, { id: 7, head_sha: f.base }] });
  assert.equal(await lastSuccessfulRef(f.dir, request, env), f.base);
  assert.equal(await lastSuccessfulRef(f.dir, async () => Response.json({ workflow_runs: [] }), env), "0".repeat(40));
  assert.equal((await selectUrls(path.join(f.dir, "sitemap.xml"), "0".repeat(40))).length, 3);
  await assert.rejects(lastSuccessfulRef(f.dir, async () => new Response("", { status: 403 }), env), /HTTP 403/);
});

test("IndexNow refuses stale live content and only treats removed URLs as deletions", async t => {
  const f = await fixture(t);
  await f.put("ja.html", "Japanese version 2");
  f.commit();
  const output = path.join(f.dir, "report.json");
  const calls = [];
  const stale = async (address, options) => { calls.push(options?.method ?? "GET"); return new Response("Japanese version 1"); };
  await assert.rejects(runSubmission(f.options({ submit: true, verifyLive: true, liveWaitMs: 0, outputJsonPath: output }), stale), /nothing was submitted/);
  assert.deepEqual(calls, ["GET"]);
  assert.equal(JSON.parse(await readFile(output, "utf8")).outcome, "deployment_not_ready");
  assert.equal((await verifyDeployment([url("ja.html")], f.dir, 0, async () => new Response("Japanese version 2"))).ok, true);
  await assert.rejects(verifyDeployment([url("missing.html")], f.dir, 0, stale), /no local file/);
  const removed = new Set([url("missing.html")]);
  assert.equal((await verifyDeployment([...removed], f.dir, 0, async () => new Response("gone", { status: 404 }), removed)).ok, true);
  assert.equal((await verifyDeployment([...removed], f.dir, 0, async () => new Response("soft 404"), removed)).ok, false);
});

test("IndexNow submits once, distinguishes 202, and preserves failure evidence", async t => {
  const f = await fixture(t);
  await f.put("ja.html", "Japanese version 2");
  f.commit();
  const posts = [];
  const request = async (address, options) => { posts.push({ address, body: JSON.parse(options.body) }); return new Response("", { status: 202 }); };
  const result = await runSubmission(f.options({ submit: true }), request);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].address, "https://api.indexnow.org/IndexNow");
  assert.deepEqual(posts[0].body.urlList, [url("ja.html")]);
  assert.equal(result.outcome, "received_key_validation_pending");
  const output = path.join(f.dir, "failure.json");
  await assert.rejects(runSubmission(f.options({ submit: true, outputJsonPath: output }), async () => new Response("rate limited", { status: 429 })), /All submissions failed/);
  assert.equal(JSON.parse(await readFile(output, "utf8")).outcome, "submission_failed");
  await assert.rejects(runSubmission(f.options({ submit: true, skipLiveKeyCheck: false, outputJsonPath: output }), async () => { throw new Error("timeout"); }), /Live key check failed/);
  assert.equal(JSON.parse(await readFile(output, "utf8")).outcome, "key_validation_failed");
  assert.throws(() => parseArgs(["--since-ref"]), /Missing value/);
  assert.throws(() => parseArgs(["--since-ref", "--invalid"]), /full commit SHA/);
});
