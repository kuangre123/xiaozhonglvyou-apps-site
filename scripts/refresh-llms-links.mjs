#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const label = text => text.replaceAll('[', '\\[').replaceAll(']', '\\]');
export function refreshLlmsLinks(text, index) {
  const pages = new Map(index.pages.map(page => [page.url, page]));
  const lines = text.replace(/\n## (?:Chrome extensions|Browser games)\n[\s\S]*?(?=\n## |$)/g, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const old = lines[i].match(/^- (.+): (https:\/\/\S+)$/);
    const markdown = lines[i].match(/^- \[(.+)\]\((https:\/\/\S+)\)(?::.*)?$/);
    const bare = lines[i].match(/^- (https:\/\/\S+)$/);
    const url = old?.[2] ?? markdown?.[2] ?? bare?.[1];
    if (!url) continue;
    const page = pages.get(url);
    const title = old?.[1] ?? markdown?.[1] ?? page?.title ?? url;
    lines[i] = `- [${label(title)}](${url})`;
    if (/\/seedance-ai-tools(?:-cn)?\.html$/.test(url) && /^  \S/.test(lines[i + 1] ?? '')) {
      lines[++i] = url.endsWith('-cn.html') ? '  为创作项目整理参考图、素材和剪辑版本。' : '  Organize reference images, source clips and edit versions for a creative project.';
    }
  }
  const section = '\n## Chrome extensions\n\n' + index.pages.filter(page => /^\/chrome-extensions(?:-cn)?\.html$/.test(page.path)).map(page => `- [${label(page.title)}](${page.url}): ${page.description}`).join('\n') + '\n';
  const games = index.pages.filter(page => /^\/web-games(?:-cn)?\.html$/.test(page.path));
  const gameSection = games.length ? '\n## Browser games\n\n' + games.map(page => `- [${label(page.title)}](${page.url}): ${page.description}`).join('\n') + '\n' : '';
  return lines.join('\n').trimEnd() + '\n' + section + gameSection;
}
export async function refreshLlms(siteDir) {
  const file = path.join(siteDir, 'llms.txt');
  await writeFile(file, refreshLlmsLinks(await readFile(file, 'utf8'), JSON.parse(await readFile(path.join(siteDir, 'search-index.json'), 'utf8'))));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const flag = process.argv.indexOf('--site-dir');
  await refreshLlms(path.resolve(flag >= 0 ? process.argv[flag + 1] : process.env.SITE_DIR ?? path.join(import.meta.dirname, '..')));
  console.log('Refreshed Markdown links and page summaries from current search metadata.');
}
