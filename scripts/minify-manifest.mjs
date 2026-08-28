import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(scriptDir, "..");
const manifestPath = path.join(siteDir, "manifest.webmanifest");

const source = await readFile(manifestPath, "utf8");
let parsed;

try {
  parsed = JSON.parse(source);
} catch (error) {
  throw new Error(`manifest.webmanifest: invalid JSON: ${error.message}`);
}

const compact = `${JSON.stringify(parsed)}\n`;
if (source !== compact) await writeFile(manifestPath, compact, "utf8");

console.log(
  `Minified manifest.webmanifest: ${source === compact ? "0 changed" : `${Buffer.byteLength(source) - Buffer.byteLength(compact)} bytes saved`}.`
);
