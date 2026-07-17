import { access, readFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.cwd();

const expectedFiles = [
  "media-kit.html",
  "BACKLINK_ACTIONS.md",
  "README.md",
  "support.html",
  "privacy.html"
];

const mediaKitSignals = [
  '<link rel="canonical" href="https://www.xiaozhonglvyou.com/media-kit.html"',
  "https://www.xiaozhonglvyou.com/iphone-photo-cleaner.html",
  "https://www.xiaozhonglvyou.com/travel-translator.html",
  "https://www.xiaozhonglvyou.com/mac-screen-privacy.html",
  "https://www.xiaozhonglvyou.com/gif-maker.html",
  "https://www.xiaozhonglvyou.com/happyride-auto-ride-tracker.html",
  "id6768019606",
  "id6755734543",
  "id6761301764",
  "id6766485393",
  "id6783559364",
  "id6786365305",
  "Editorial disclosure",
  "cb123428316@gmail.com"
];

const actionMapSignals = [
  "https://www.xiaozhonglvyou.com/support.html#ai-cleaning",
  "https://www.xiaozhonglvyou.com/support.html#travel-translator",
  "https://www.xiaozhonglvyou.com/support.html#anti-spy-screen",
  "https://www.xiaozhonglvyou.com/support.html#anti-spy-screen-lite",
  "https://www.xiaozhonglvyou.com/support.html#gifmaker",
  "https://www.xiaozhonglvyou.com/support.html#happyride",
  "https://www.xiaozhonglvyou.com/privacy.html#ai-cleaning",
  "https://www.xiaozhonglvyou.com/privacy.html#travel-translator",
  "https://www.xiaozhonglvyou.com/privacy.html#anti-spy-screen",
  "https://www.xiaozhonglvyou.com/privacy.html#gifmaker",
  "https://www.xiaozhonglvyou.com/privacy.html#happyride"
];

const supportAnchors = [
  'id="ai-cleaning"',
  'id="travel-translator"',
  'id="anti-spy-screen"',
  'id="anti-spy-screen-lite"',
  'id="gifmaker"',
  'id="happyride"'
];

const privacyAnchors = [
  'id="ai-cleaning"',
  'id="travel-translator"',
  'id="anti-spy-screen"',
  'id="gifmaker"',
  'id="happyride"'
];

async function exists(fileName) {
  try {
    await access(path.join(siteDir, fileName));
    return true;
  } catch {
    return false;
  }
}

function missingSignals(text, signals) {
  return signals.filter((signal) => !text.includes(signal));
}

const missingFiles = [];
for (const fileName of expectedFiles) {
  if (!await exists(fileName)) missingFiles.push(fileName);
}

const failures = missingFiles.map((fileName) => `Missing file: ${fileName}`);

if (missingFiles.length === 0) {
  const [mediaKit, actions, readme, support, privacy] = await Promise.all([
    readFile(path.join(siteDir, "media-kit.html"), "utf8"),
    readFile(path.join(siteDir, "BACKLINK_ACTIONS.md"), "utf8"),
    readFile(path.join(siteDir, "README.md"), "utf8"),
    readFile(path.join(siteDir, "support.html"), "utf8"),
    readFile(path.join(siteDir, "privacy.html"), "utf8")
  ]);

  failures.push(...missingSignals(mediaKit, mediaKitSignals).map((signal) => `Media kit missing signal: ${signal}`));
  failures.push(...missingSignals(actions, actionMapSignals).map((signal) => `Action map missing URL: ${signal}`));
  failures.push(...missingSignals(support, supportAnchors).map((signal) => `Support page missing anchor: ${signal}`));
  failures.push(...missingSignals(privacy, privacyAnchors).map((signal) => `Privacy page missing anchor: ${signal}`));

  if (!readme.includes("https://www.xiaozhonglvyou.com/media-kit.html")) {
    failures.push("README does not link to the media kit");
  }

  if (!readme.includes("https://www.xiaozhonglvyou.com/")) {
    failures.push("README does not link to the official homepage");
  }
}

const ok = failures.length === 0;
const lines = [
  "# Backlink Readiness Audit",
  "",
  `Status: ${ok ? "PASS" : "FAIL"}`,
  "",
  "## Site-side readiness",
  "",
  `- Media and reviewer destination: ${ok ? "ready" : "incomplete"}`,
  `- App Store Connect URL map: ${ok ? "ready" : "incomplete"}`,
  `- Product-specific support anchors: ${ok ? "ready" : "incomplete"}`,
  `- Product-specific privacy anchors: ${ok ? "ready" : "incomplete"}`,
  `- GitHub README links: ${ok ? "ready" : "incomplete"}`,
  "",
  "## External status",
  "",
  "- This audit does not claim that an external backlink exists.",
  "- Next controlled action: add the mapped Marketing, Support, and Privacy URLs in App Store Connect.",
  "- Verify live referring pages in Bing Webmaster Tools after they are published and recrawled."
];

if (!ok) {
  lines.push("", "## Failures", "", ...failures.map((failure) => `- ${failure}`));
}

lines.push("");
console.log(lines.join("\n"));

if (!ok) process.exit(1);
