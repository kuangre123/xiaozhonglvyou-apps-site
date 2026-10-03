import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const analyticsSource = await readFile(new URL("../analytics.js", import.meta.url), "utf8");
const scriptSource = await readFile(new URL("../script.js", import.meta.url), "utf8");

function setup({ page = "/inkstone-markdown-notes.html", debug = false } = {}) {
  const listeners = {};
  const context = {
    URL,
    URLSearchParams,
    window: {
      location: { pathname: page, search: debug ? "?ga_debug=1" : "" },
      addEventListener() {}
    },
    document: {
      referrer: "",
      querySelector() { return null; },
      addEventListener(type, listener) { listeners[type] = listener; }
    }
  };
  vm.runInNewContext(analyticsSource, context);
  vm.runInNewContext(scriptSource, context);
  const events = () => Array.from(context.window.dataLayer)
    .filter(([command, name]) => command === "event" && name === "app_store_click");
  return { context, listeners, events };
}

function storeLink(product, appId, country = "us", explicitCountry = true) {
  return {
    dataset: {
      analyticsEvent: "app_store_click",
      storeProduct: product,
      storefront: "ios-app-store",
      ...(explicitCountry ? { storeCountry: country } : {})
    },
    href: `https://apps.apple.com/${country}/app/id${appId}?uo=4`,
    textContent: "  View on App Store  ",
    getAttribute(name) { return name === "href" ? this.href : null; },
    closest(selector) { return selector === "a" ? this : null; }
  };
}

const products = [
  ["/inkstone-markdown-notes.html", "inkstone-notes-markdown", "6810287923", "us"],
  ["/twopic-dual-camera.html", "twopic-dual-camera", "6800405096", "us"],
  ["/lailemma-period-tracker.html", "lailemma-period-fertility", "6775935474", "us"],
  ["/lailemma-period-tracker-cn.html", "lailemma-period-fertility", "6775935474", "us"],
  ["/lailemma-period-tracker-ja.html", "lailemma-period-fertility", "6775935474", "jp"],
  ["/lailemma-period-tracker-de.html", "lailemma-period-fertility", "6775935474", "de"],
  ["/lailemma-period-tr.html", "lailemma-period-fertility", "6775935474", "tr"]
];

for (const [page, product, appId, country] of products) {
  test(`${page} queues the correct product and store country before GA4 loads`, async () => {
    const html = await readFile(new URL(`..${page}`, import.meta.url), "utf8");
    assert.ok(html.includes(`data-store-product="${product}"`));
    assert.ok(html.includes(`data-store-country="${country}"`));
    const { context, listeners, events } = setup({ page });
    const link = storeLink(product, appId, country);
    listeners.click({ type: "click", button: 0, target: link });
    assert.equal(events().length, 1);
    const [, , params] = events()[0];
    assert.equal(params.store_product, product);
    assert.equal(params.storefront, "ios-app-store");
    assert.equal(params.store_country, country);
    assert.equal(params.page_path, page);
    assert.equal(params.link_url, link.href);
    assert.equal(params.link_text, "View on App Store");
    assert.equal(params.transport_type, "beacon");
    assert.equal("debug_mode" in params, false);
    assert.equal(typeof context.window.gtag, "function");
  });
}

test("middle-clicking a nested CTA queues one event without preventing browser navigation", () => {
  const { listeners, events } = setup({ debug: true });
  const link = storeLink("inkstone-notes-markdown", "6810287923", "jp", false);
  let prevented = false;
  listeners.auxclick({
    type: "auxclick",
    button: 1,
    target: { closest: link.closest.bind(link) },
    preventDefault() { prevented = true; }
  });
  assert.equal(events().length, 1);
  assert.equal(events()[0][2].store_country, "jp");
  assert.equal(events()[0][2].debug_mode, true);
  assert.equal(prevented, false);
});

test("right-click and unrelated auxiliary targets do not record store clicks", () => {
  const { listeners, events } = setup();
  const link = storeLink("inkstone-notes-markdown", "6810287923");
  listeners.auxclick({ type: "auxclick", button: 2, target: link });
  listeners.auxclick({ type: "auxclick", button: 1, target: { closest() { return null; } } });
  assert.equal(events().length, 0);
});

test("keyboard activation is recorded once and a left-button auxclick adds no duplicate", () => {
  const { listeners, events } = setup();
  const link = storeLink("inkstone-notes-markdown", "6810287923");
  listeners.click({ type: "click", button: 0, detail: 0, target: link });
  listeners.auxclick({ type: "auxclick", button: 0, target: link });
  assert.equal(events().length, 1);
});

test("middle-clicking a page anchor leaves hash navigation to the browser", () => {
  const { listeners, events } = setup();
  let prevented = false;
  const link = {
    dataset: {},
    getAttribute() { return "#inkstone-export-options"; },
    closest() { return this; }
  };
  listeners.auxclick({
    type: "auxclick",
    button: 1,
    target: link,
    preventDefault() { prevented = true; }
  });
  assert.equal(prevented, false);
  assert.equal(events().length, 0);
});
