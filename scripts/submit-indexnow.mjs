import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const origin = "https://www.xiaozhonglvyou.com";
const defaultEndpoints = [
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://search.seznam.cz/indexnow",
  "https://searchadvisor.naver.com/indexnow"
];
const userAgent = "CrazyAIAgent-IndexNow/1.0";

function parseArgs(argv) {
  const args = {
    submit: false,
    skipLiveKeyCheck: false,
    endpoints: defaultEndpoints,
    sitemapPath: "sitemap.xml",
    keyFilePath: "a6013cad6cead8e0.txt",
    outputJsonPath: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

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
  if (urls.length === 0 || urls.length > 10000) {
    throw new Error(`Expected 1-10000 sitemap URLs, found ${urls.length}`);
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

async function liveKeyMatches(key, keyLocation) {
  const response = await fetch(keyLocation, {
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const key = (await readFile(path.resolve(root, args.keyFilePath), "utf8")).trim();
  const keyFileName = path.basename(args.keyFilePath);
  const keyLocation = `${origin}/${keyFileName}`;
  const urls = parseSitemap(await readFile(path.resolve(root, args.sitemapPath), "utf8"));
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
    liveKeyCheck: null,
    submissions: []
  };

  if (!args.skipLiveKeyCheck) {
    report.liveKeyCheck = await liveKeyMatches(key, keyLocation);
    if (!report.liveKeyCheck.ok) {
      await writeOutput(args.outputJsonPath, report);
      throw new Error(`Live key check failed at ${keyLocation}`);
    }
  }

  if (args.submit) {
    for (const endpoint of args.endpoints) {
      try {
        const response = await fetch(endpoint, {
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
          ok: response.ok || response.status === 202,
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
      await writeOutput(args.outputJsonPath, report);
      throw new Error("All submissions failed");
    }
  }

  await writeOutput(args.outputJsonPath, report);
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
