import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(scriptDir, "..");
const indexPath = path.join(siteDir, "search-index.json");

const source = await readFile(indexPath, "utf8");
let parsed;

try {
  parsed = JSON.parse(source);
} catch (error) {
  throw new Error(`search-index.json: invalid JSON: ${error.message}`);
}

const compact = `${JSON.stringify(parsed)}\n`;
if (source !== compact) await writeFile(indexPath, compact, "utf8");

console.log(
  `Minified search-index.json: ${source === compact ? "0 changed" : `${Buffer.byteLength(source) - Buffer.byteLength(compact)} bytes saved`}.`
);
