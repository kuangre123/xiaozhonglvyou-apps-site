import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { setTimeout as pause } from "node:timers/promises";
import path from "node:path";

const root = process.cwd();
const origin = "https://www.xiaozhonglvyou.com";
const defaultEndpoints = ["https://api.indexnow.org/IndexNow"];
const userAgent = "CrazyAIAgent-IndexNow/1.0";
const git = promisify(execFile);

export function parseArgs(argv, defaults = {}) {
  const args = {
    submit: false,
    skipLiveKeyCheck: false,
    endpoints: defaultEndpoints,
    sitemapPath: "sitemap.xml",
    keyFilePath: "a6013cad6cead8e0.txt",
    outputJsonPath: null,
    sinceRef: null,
    sinceLastSuccess: false,
    verifyLive: false,
    liveWaitMs: 120000,
    ...defaults
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--since-last-success") {
      args.sinceLastSuccess = true;
      continue;
    }

    if (arg === "--since-ref") {
      args.sinceRef = argv[++index];
      if (args.sinceRef === undefined) throw new Error("Missing value for --since-ref");
      if (args.sinceRef && !/^[a-f0-9]{40}$/i.test(args.sinceRef)) throw new Error("--since-ref must be a full commit SHA");
      continue;
    }

    if (arg === "--verify-live") {
      args.verifyLive = true;
      continue;
    }

    if (arg === "--live-wait-ms") {
      args.liveWaitMs = Number(argv[++index]);
      if (!Number.isInteger(args.liveWaitMs) || args.liveWaitMs < 0 || args.liveWaitMs > 240000) throw new Error("--live-wait-ms must be between 0 and 240000");
      continue;
    }

    if (arg === "--submit") {
      args.submit = true;
      continue;
    }

    if (arg === "--skip-live-key-check") {
      args.skipLiveKeyCheck = true;
      continue;
    }

    if (arg === "--endpoint") {
      args.endpoints = [argv[index + 1]];
      index += 1;
      continue;
    }

    if (arg === "--sitemap-path") {
      args.sitemapPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--key-file-path") {
      args.keyFilePath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--output-json-path") {
      args.outputJsonPath = argv[index + 1];
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((match) => match[1].trim());
}

function validateUrls(urls) {
  if (urls.length > 10000) {
    throw new Error(`Expected at most 10000 URLs, found ${urls.length}`);
  }

  if (new Set(urls).size !== urls.length) {
    throw new Error("Sitemap contains duplicate URLs");
  }

  for (const url of urls) {
    const parsed = new URL(url);
    if (parsed.origin !== origin) {
      throw new Error(`URL is outside ${origin}: ${url}`);
    }
  }
}

export async function selectUrls(sitemapPath, sinceRef) {
  const absolutePath = path.resolve(root, sitemapPath);
  const siteDir = path.dirname(absolutePath);
  const currentUrls = parseSitemap(await readFile(absolutePath, "utf8"));
  if (!currentUrls.length) throw new Error("Sitemap has no URLs");
  validateUrls(currentUrls);
  if (!sinceRef || /^0{40}$/.test(sinceRef)) return currentUrls;

  const options = { cwd: siteDir, encoding: "utf8", maxBuffer: 5 * 1024 * 1024 };
  const sitemapFile = path.basename(absolutePath);
  const previousTree = await git("git", ["ls-tree", "--name-only", sinceRef, "--", sitemapFile], options);
  const previousUrls = previousTree.stdout.trim()
    ? parseSitemap((await git("git", ["show", `${sinceRef}:${sitemapFile}`], options)).stdout)
    : [];
  validateUrls(previousUrls);
  const allowed = new Set([...currentUrls, ...previousUrls]);
  // Disabling rename detection keeps both the old and new URL in the notification.
  const diff = await git("git", ["diff", "--name-only", "--no-renames", "-z", sinceRef, "HEAD", "--", "*.html"], options);
  const urls = diff.stdout.split("\0").filter(Boolean).map(file => {
    const pathname = file === "index.html" ? "" : file;
    return new URL(pathname.split("/").map(encodeURIComponent).join("/"), `${origin}/`).href;
  }).filter(url => allowed.has(url));
  const current = new Set(currentUrls);
  const previous = new Set(previousUrls);
  return [...new Set([...urls, ...currentUrls.filter(url => !previous.has(url)), ...previousUrls.filter(url => !current.has(url))])];
}

export async function lastSuccessfulRef(siteDir, request = fetch, env = process.env) {
  if (!env.GITHUB_TOKEN || !/^[\w.-]+\/[\w.-]+$/.test(env.GITHUB_REPOSITORY ?? "") || !env.GITHUB_REF_NAME) {
    throw new Error("--since-last-success requires the GitHub Actions repository, branch, and token");
  }
  const query = new URLSearchParams({ branch: env.GITHUB_REF_NAME, status: "success", per_page: "100" });
  const response = await request(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/actions/workflows/indexnow.yml/runs?${query}`, {
    headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`Could not read successful IndexNow runs: HTTP ${response.status}`);
  const runs = (await response.json()).workflow_runs;
  if (!Array.isArray(runs)) throw new Error("GitHub did not return workflow runs");
  for (const run of runs) {
    if (String(run.id) === env.GITHUB_RUN_ID || !/^[a-f0-9]{40}$/i.test(run.head_sha ?? "")) continue;
    try {
      await git("git", ["merge-base", "--is-ancestor", run.head_sha, "HEAD"], { cwd: siteDir });
      return run.head_sha;
    } catch (error) {
      if (error.code !== 1 && error.code !== 128) throw error;
    }
  }
  return "0".repeat(40);
}

const digest = text => createHash("sha256").update(text.trim()).digest("hex");

export async function verifyDeployment(urls, siteDir, waitMs, request = fetch, removedUrls = new Set()) {
  const expected = await Promise.all(urls.map(async url => {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const file = path.resolve(siteDir, `.${pathname === "/" ? "/index.html" : pathname}`);
    if (!file.startsWith(`${path.resolve(siteDir)}${path.sep}`)) throw new Error("URL escapes site directory");
    try {
      return { url, sha256: digest(await readFile(file, "utf8")) };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      if (!removedUrls.has(url)) throw new Error(`Current sitemap URL has no local file: ${url}`);
      return { url, deleted: true };
    }
  }));
  const deadline = Date.now() + waitMs;
  let pending = expected;
  const verified = [];
  let attempts = 0;
  while (pending.length) {
    attempts += 1;
    const checks = [];
    // Bound live requests so a manual full-site run does not burst at the origin.
    for (let start = 0; start < pending.length; start += 6) {
      checks.push(...await Promise.all(pending.slice(start, start + 6).map(async expectedPage => {
        try {
          const response = await request(expectedPage.url, {
            headers: { "user-agent": userAgent, "cache-control": "no-cache" },
            redirect: "manual",
            signal: AbortSignal.timeout(10000)
          });
          const body = await response.text();
          const ok = expectedPage.deleted
            ? [404, 410].includes(response.status)
            : response.status === 200 && digest(body) === expectedPage.sha256;
          return { ...expectedPage, status: response.status, ok };
        } catch (error) {
          return { ...expectedPage, status: 0, ok: false, error: error.message };
        }
      })));
    }
    verified.push(...checks.filter(check => check.ok));
    pending = checks.filter(check => !check.ok);
    if (!pending.length || Date.now() >= deadline) break;
    console.error(`Waiting for deployment: ${pending.length} URL(s) do not match the checkout yet`);
    await pause(Math.min(5000, deadline - Date.now()));
  }
  return { ok: pending.length === 0, attempts, pages: [...verified, ...pending] };
}

async function liveKeyMatches(key, keyLocation, request) {
  const response = await request(keyLocation, {
    signal: AbortSignal.timeout(10000),
    headers: {
      "user-agent": userAgent
    }
  });
  const body = (await response.text()).trim();

  return {
    ok: response.ok && body === key,
    status: response.status,
    body
  };
}

async function writeOutput(filePath, value) {
  if (!filePath) return;
  const absolutePath = path.resolve(root, filePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(value, null, 2)}\n`);
}

export async function runSubmission(args, request = fetch) {
  const key = (await readFile(path.resolve(root, args.keyFilePath), "utf8")).trim();
  const keyFileName = path.basename(args.keyFilePath);
  const keyLocation = `${origin}/${keyFileName}`;
  const siteDir = path.dirname(path.resolve(root, args.sitemapPath));
  const sinceRef = args.sinceLastSuccess ? await lastSuccessfulRef(siteDir, request) : args.sinceRef;
  const urls = await selectUrls(args.sitemapPath, sinceRef);
  validateUrls(urls);

  const payload = {
    host: new URL(origin).host,
    key,
    keyLocation,
    urlList: urls
  };
  const report = {
    mode: args.submit ? "submit" : "dry-run",
    endpoints: args.endpoints,
    host: payload.host,
    keyLocation,
    urlCount: urls.length,
    firstUrls: urls.slice(0, 5),
    urls,
    sinceRef: sinceRef || null,
    outcome: urls.length ? "dry_run" : "skipped_no_changed_urls",
    deploymentCheck: null,
    liveKeyCheck: null,
    submissions: []
  };

  if (!urls.length) {
    await writeOutput(args.outputJsonPath, report);
    return report;
  }

  if (args.verifyLive) {
    const listed = new Set(parseSitemap(await readFile(path.resolve(root, args.sitemapPath), "utf8")));
    report.deploymentCheck = await verifyDeployment(urls, siteDir, args.liveWaitMs, request, new Set(urls.filter(url => !listed.has(url))));
    if (!report.deploymentCheck.ok) {
      report.outcome = "deployment_not_ready";
      await writeOutput(args.outputJsonPath, report);
      throw new Error("Live URLs do not match this checkout; nothing was submitted");
    }
  }

  if (!args.skipLiveKeyCheck) {
    try {
      report.liveKeyCheck = await liveKeyMatches(key, keyLocation, request);
    } catch (error) {
      report.liveKeyCheck = { ok: false, status: 0, error: error.message };
    }
    if (!report.liveKeyCheck.ok) {
      report.outcome = "key_validation_failed";
      await writeOutput(args.outputJsonPath, report);
      throw new Error(`Live key check failed at ${keyLocation}`);
    }
  }

  if (args.submit) {
    for (const endpoint of args.endpoints) {
      try {
        const response = await request(endpoint, {
          signal: AbortSignal.timeout(15000),
          method: "POST",
          headers: {
            "content-type": "application/json; charset=utf-8",
            "user-agent": userAgent
          },
          body: JSON.stringify(payload)
        });
        report.submissions.push({
          endpoint,
          status: response.status,
          ok: response.status === 200 || response.status === 202,
          body: await response.text()
        });
      } catch (error) {
        report.submissions.push({
          endpoint,
          status: 0,
          ok: false,
          body: error.message
        });
      }
    }

    if (report.submissions.every((submission) => !submission.ok)) {
      report.outcome = "submission_failed";
      await writeOutput(args.outputJsonPath, report);
      throw new Error("All submissions failed");
    }
    report.outcome = report.submissions.some(submission => submission.status === 200)
      ? "received"
      : "received_key_validation_pending";
  }

  await writeOutput(args.outputJsonPath, report);
  return report;
}

export async function runCli(argv = process.argv.slice(2), defaults = {}) {
  const report = await runSubmission(parseArgs(argv, defaults));
  console.log(JSON.stringify(report, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runCli().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
