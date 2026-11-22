import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import { extensionPages, extensions, renderExtensionPage, addExtensionDiscoveryLink } from './chrome-extension-discovery.mjs';
const site = path.resolve(import.meta.dirname, '..');
const read = file => readFile(path.join(site, file), 'utf8');

test('both language pages link only the two verified public extensions and keep independent canonicals', async () => {
  for (const [index, file] of extensionPages.entries()) {
    const html = await read(file);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://www.xiaozhonglvyou.com/${file}">`));
    for (const alternate of extensionPages) assert.ok(html.includes(`hreflang="${alternate.includes('-cn') ? 'zh-CN' : 'en'}" href="https://www.xiaozhonglvyou.com/${alternate}"`));
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const apps = schema.filter(node => node['@type'] === 'SoftwareApplication');
    assert.equal(apps.length, 2);
    for (const app of extensions) {
      const entity = apps.find(node => node.name === app.name);
      assert.equal(entity.downloadUrl, `https://chromewebstore.google.com/detail/${app.storeId}`);
      assert.equal(entity.offers.price, '0');
      assert.equal(entity.aggregateRating, undefined);
      assert.ok(html.includes(`data-extension-id="${app.storeId}"`));
    }
    const faq = schema.find(node => node['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 4);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    for (const q of faq.mainEntity) {
      assert.ok(html.includes(q.name));
      assert.ok(html.includes(q.acceptedAnswer.text));
    }
    assert.match(html, /index,follow/);
    assert.ok(!html.includes('tool-card-grid"><article class="tool-card"><p class="section-kicker">Free image'));
    assert.ok(html.includes(index ? '不是不可逆脱敏' : 'not irreversible redaction'));
    assert.ok(html.includes(index ? '不支持录屏、视频导入' : 'does not record the screen, import video'));
  }
});

test('regeneration preserves unrelated templates and adds one related section', async () => {
  const html = await read('gif-maker-online.html');
  assert.equal(addExtensionDiscoveryLink(html, false), html);
  assert.equal((html.match(/id="chrome-extension-discovery"/g) || []).length, 1);
  const template = await read('tools.html');
  const generated = renderExtensionPage(template, 'en', 'abc123');
  assert.match(generated, /extension-links.js\?v=abc123/);
  assert.equal((generated.match(/chrome-extension-discovery/g) || []).length, 0);
  assert.match(template, /gif-maker-online.html/);
});

test('store click measurement records only valid first-party product identifiers and pathname', async () => {
  const handlers = {}, calls = [];
  vm.runInNewContext(await read('extension-links.js'), {
    document: { addEventListener: (name, handler) => handlers[name] = handler },
    window: { location: { pathname: '/chrome-extensions.html', search: '?secret=excluded' }, gtag: (...args) => calls.push(args) }
  });
  const event = (type, button, id, href) => ({ type, button, target: { closest: () => ({ dataset: { extensionId: id }, getAttribute: () => href }) } });
  const id = extensions[0].storeId, href = `https://chromewebstore.google.com/detail/${id}`;
  handlers.click(event('click', 0, id, href));
  handlers.auxclick(event('auxclick', 1, id, href));
  handlers.auxclick(event('auxclick', 2, id, href));
  handlers.click(event('click', 0, id, 'https://example.com/'));
  handlers.click(event('click', 0, 'unknown', href));
  assert.equal(calls.length, 2);
  assert.equal(calls[0][1], 'extension_store_click');
  assert.equal(JSON.stringify(calls[0][2]), JSON.stringify({ extension_product: 'privacyguard', page_path: '/chrome-extensions.html', transport_type: 'beacon' }));
});
