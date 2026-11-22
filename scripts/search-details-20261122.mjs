#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { isMainSiteHtmlFile } from './standalone-privacy-pages.mjs';

export async function applySearchDetails(siteDir) {
  const cssPath = path.join(siteDir, 'styles.css');
  let css = await readFile(cssPath, 'utf8');
  // Darker green preserves the palette and gives small labels / white button text sufficient contrast.
  css = css.replace('--blue: #10b981', '--blue: #047857').replace('--blue-deep: #059669', '--blue-deep: #065f46');
  await writeFile(cssPath, css);
  const hash = createHash('sha256').update(css).digest('hex').slice(0, 12);
  for (const name of (await readdir(siteDir)).filter(isMainSiteHtmlFile)) {
    const file = path.join(siteDir, name), html = await readFile(file, 'utf8');
    let next = html.replace(/(<img\b[^>]*class="brand-mark"[^>]*src=")\/assets\/kuangre-ai-logo\.png"/g, '$1/assets/kuangre-ai-logo.webp"')
      .replace(/styles\.css\?v=[a-f0-9]+/g, `styles.css?v=${hash}`);
    if (name === 'index.html') {
      // The mobile PageSpeed trace identifies the privacy icon as the LCP image.
      next = next.replace(/(<link rel="preload" href="assets\/)ai-cleaning-icon(\.webp" as="image")/, '$1anti-spy-icon$2')
        .replace(/(<img class="hero-icon hero-icon-clean"[^>]*?) fetchpriority="high"/, '$1')
        .replace(/(<img class="hero-icon hero-icon-privacy")(?! fetchpriority="high")/, '$1 fetchpriority="high"');
    }
    if (next !== html) await writeFile(file, next);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = process.argv.indexOf('--site-dir');
  await applySearchDetails(path.resolve(flag >= 0 ? process.argv[flag + 1] : process.env.SITE_DIR ?? path.join(import.meta.dirname, '..')));
  console.log('Updated small-text contrast, lossless WebP brand logo and stylesheet hashes.');
}
