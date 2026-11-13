import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { rideTimeExamples } from './cycling-planning-content.mjs';

test('distance table agrees with all three assumed speeds and keeps breaks separate', async () => {
  const context = vm.createContext({});
  vm.runInContext(await readFile(new URL('../ride-tool.js', import.meta.url), 'utf8'), context);
  for (const row of rideTimeExamples) for (const [i, speed] of [15,20,25].entries()) {
    const value = context.RideCalculator.calculate({ mode:'time', unit:'km', distance:row.distance, speed, breakMinutes:15 });
    assert.equal(value.movingSeconds / 60, row.minutes[i]);
    assert.equal(value.elapsedSeconds / 60, row.minutes[i] + 15);
  }
  assert.deepEqual(rideTimeExamples.find(row => row.distance === 20).minutes, [80,60,48]);
});

test('published guides expose readable tables, correct dates and direct time-mode links in both languages', async () => {
  for (const suffix of ['', '-cn']) {
    const html = await readFile(new URL(`../cycling-time-distance-guide${suffix}.html`, import.meta.url), 'utf8');
    assert.match(html, /<table\b[^>]*><caption>/);
    assert.equal([...html.matchAll(/<th scope="row">/g)].length, 5);
    assert.equal([...html.matchAll(/\?mode=time#ride-tool/g)].length, 2);
    assert.match(html, /"datePublished":"2026-10-28"/);
    assert.match(html, /"dateModified":"2026-11-13"/);
    assert.match(html, /id="ride-time-examples"/);
  }
});
