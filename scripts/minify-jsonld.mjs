import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = process.env.SITE_DIR
  ? path.resolve(process.cwd(), process.env.SITE_DIR)
  : path.resolve(scriptDir, "..");

function compactJsonLd(html, fileName) {
  let blockCount = 0;
  let changedBlocks = 0;
  const updated = html.replace(
    /<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi,
    (block) => {
      blockCount += 1;
      const openEnd = block.indexOf(">");
      const openTag = block.slice(0, openEnd + 1);
      const body = block.slice(openEnd + 1, -"</script>".length).trim();
      let parsed;

      try {
        parsed = JSON.parse(body);
      } catch (error) {
        throw new Error(`${fileName}: invalid JSON-LD: ${error.message}`);
      }

      const compact = JSON.stringify(parsed).replace(/</g, "\\u003c");
      if (body !== compact) changedBlocks += 1;
      return `${openTag}${compact}</script>`;
    }
  );

  return { updated, blockCount, changedBlocks };
}

const files = (await readdir(siteDir)).filter((file) => file.endsWith(".html")).sort();
const sources = await Promise.all(
  files.map(async (file) => ({ file, html: await readFile(path.join(siteDir, file), "utf8") }))
);
const transformed = sources.map(({ file, html }) => ({
  file,
  html,
  ...compactJsonLd(html, file)
}));

await Promise.all(
  transformed
    .filter(({ updated, html }) => updated !== html)
    .map(({ file, updated }) => writeFile(path.join(siteDir, file), updated, "utf8"))
);

console.log(
  `Minified JSON-LD in ${transformed.filter(({ updated, html }) => updated !== html).length} of ${files.length} HTML files `
  + `(${transformed.reduce((sum, result) => sum + result.blockCount, 0)} blocks, `
  + `${transformed.reduce((sum, result) => sum + result.changedBlocks, 0)} changed).`
);
