import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { updateChineseSitemap } from './search-landing-update.mjs';

test('Chinese discovery includes new Chinese tools and excludes noindex, aliases and English documents', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'chinese-discovery-'));
  const origin = 'https://www.xiaozhonglvyou.com/';
  const files = [
    ['tool-cn.html', 'zh-CN', 'tool-cn.html', 'index,follow'],
    ['guide-cn.html', 'zh-Hans', 'guide-cn.html', 'index,follow'],
    ['traditional.html', 'zh-Hant', 'traditional.html', 'index,follow'],
    ['tool.html', 'en', 'tool.html', 'index,follow'],
    ['private.html', 'zh-CN', 'private.html', 'noindex,follow'],
    ['alias-cn.html', 'zh-CN', 'tool-cn.html', 'index,follow']
  ];
  try {
    await writeFile(path.join(dir, 'sitemap.xml'), `<urlset>${files.map(([file]) => `<url><loc>${origin}${file}</loc><lastmod>2026-10-24</lastmod></url>`).join('')}</urlset>`);
    for (const [file, lang, canonical, robots] of files) await writeFile(path.join(dir, file), `<html lang="${lang}"><head><meta name="robots" content="${robots}"><link rel="canonical" href="${origin}${canonical}"></head></html>`);
    assert.deepEqual(await updateChineseSitemap(dir), ['guide-cn.html','tool-cn.html','traditional.html'].map(file => origin + file));
    const first = await readFile(path.join(dir, 'sitemap-cn.xml'), 'utf8');
    assert.equal((await readFile(path.join(dir, 'sitemap-cn.txt'), 'utf8')).trim().split('\n').length, 3);
    await updateChineseSitemap(dir);
    assert.equal(await readFile(path.join(dir, 'sitemap-cn.xml'), 'utf8'), first);
    assert.match(first, /<lastmod>2026-10-24<\/lastmod>/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
