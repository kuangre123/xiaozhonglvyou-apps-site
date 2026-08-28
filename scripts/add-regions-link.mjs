import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(import.meta.dirname, "..");
const filePath = path.join(siteDir, "apps.html");
const existingLink = '<a class="button button-secondary" href="best-iphone-photo-cleaner-app.html">Free photo cleaner app</a>';
const marketLink = '<a class="button button-secondary" href="regions.html">Browse market pages</a>';

const original = await readFile(filePath, "utf8");

if (original.includes(marketLink)) {
  console.log("apps.html already links to regions.html.");
  process.exit(0);
}

if (!original.includes(existingLink)) {
  throw new Error("Could not find the App portfolio action anchor in apps.html");
}

const updated = original.replace(existingLink, `${existingLink} ${marketLink}`);
await writeFile(filePath, updated, "utf8");
console.log("Added the market-pages link to the App portfolio actions.");
