import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { priorityMarkets } from "./japan-germany-turkey-markets.mjs";

const expectations = {
  jp: [/同期が有効で利用可能/, /端末内だけのノートは自動的には他の端末に現れません/, /日本語UIではありません/],
  de: [/Synchronisierung aktiviert und verfügbar/, /Nur lokal gespeicherte Notizen erscheinen nicht automatisch/, /nicht Deutsch/],
  tr: [/eşzamanlaması etkin ve kullanılabilir/, /Yalnızca cihazda tutulan notlar diğer cihazlara otomatik aktarılmaz/, /Türkçe değildir/]
};

test("Inkstone country cards distinguish sync-enabled folders from local-only notes", async () => {
  for (const market of priorityMarkets) {
    const copy = market.products.inkstone[1];
    const html = await readFile(new URL(`../${market.file}`, import.meta.url), "utf8");
    for (const phrase of expectations[market.store]) {
      assert.match(copy, phrase, `${market.store} source copy`);
      assert.match(html, phrase, `${market.file} rendered copy`);
    }
    assert.match(copy, /iOS 18/);
    assert.match(copy, /\.md/);
    assert.match(copy, /PDF-?\/HTML/);
    assert.ok(html.includes(`https://apps.apple.com/${market.store}/app/id6810287923`));
  }
});

test("German hub identifies the language of linked Inkstone and TwoPic product pages", async () => {
  const german = priorityMarkets.find(m => m.store === "de");
  const copy = german.languageItems.find(([name]) => name === "Inkstone und TwoPic")[1];
  assert.match(copy, /Diese Seite erklärt die Funktionen auf Deutsch/);
  assert.match(copy, /verlinkten Produktseiten sind auf Englisch/);
  assert.doesNotMatch(copy, /Die deutschen Produktseiten/);
  const html = await readFile(new URL("../de-de.html", import.meta.url), "utf8");
  assert.match(html, /verlinkten Produktseiten sind auf Englisch/);
});
