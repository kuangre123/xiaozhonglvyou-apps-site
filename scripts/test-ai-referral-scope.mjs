import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const analyticsSource = await readFile(new URL("../analytics.js", import.meta.url), "utf8");
const scriptSource = await readFile(new URL("../script.js", import.meta.url), "utf8");

function visit(referrer, userProperties = {}) {
  const calls = [];
  const listeners = {};
  const context = {
    URL,
    URLSearchParams,
    window: {
      location: { pathname: "/inkstone-markdown-notes.html", search: "" },
      addEventListener() {},
      gtag(...args) {
        calls.push(args);
        if (args[0] === "set" && args[1] === "user_properties") {
          Object.assign(userProperties, args[2]);
        }
      }
    },
    document: {
      referrer,
      querySelector() { return null; },
      addEventListener(type, listener) { listeners[type] = listener; }
    }
  };
  vm.runInNewContext(analyticsSource, context);
  vm.runInNewContext(scriptSource, context);
  const link = {
    dataset: {
      analyticsEvent: "app_store_click",
      storeProduct: "inkstone-notes-markdown",
      storefront: "ios-app-store",
      storeCountry: "us"
    },
    href: "https://apps.apple.com/us/app/id6810287923?uo=4",
    textContent: "View on App Store",
    getAttribute(name) { return name === "href" ? this.href : null; },
    closest(selector) { return selector === "a" ? this : null; }
  };
  listeners.click({ type: "click", button: 0, target: link });
  return { calls, userProperties, events: calls.filter(([command]) => command === "event") };
}

test("AI referrers are event context, not persistent user properties", () => {
  const { calls } = visit("https://chatgpt.com/share/example");
  assert.equal(calls.some(([command, name]) => command === "set" && name === "user_properties"), false);
});

test("AI landing-page store events carry the same source as the referral event", () => {
  for (const [host, source] of [
    ["chatgpt.com", "chatgpt"],
    ["chat.openai.com", "chatgpt"],
    ["www.perplexity.ai", "perplexity"],
    ["claude.ai", "claude"],
    ["gemini.google.com", "gemini"],
    ["copilot.microsoft.com", "copilot"]
  ]) {
    const { events } = visit(`https://${host}/example`);
    assert.equal(events.length, 2, host);
    for (const event of events) assert.equal(event[2].ai_source, source, host);
  }
});

test("later Google, direct, and internal visits do not inherit an AI visitor label", () => {
  const userProperties = {};
  visit("https://chatgpt.com/share/example", userProperties);
  for (const referrer of ["https://www.google.com/", "", "https://www.xiaozhonglvyou.com/apps.html"]) {
    const { events } = visit(referrer, userProperties);
    assert.deepEqual(userProperties, {});
    assert.equal(events.length, 1);
    assert.equal(events[0][1], "app_store_click");
    assert.equal("ai_source" in events[0][2], false);
  }
});

test("lookalike and malformed referrers never label a store event as AI", () => {
  for (const referrer of ["https://chatgpt.com.example.org/", "https://not-perplexity.ai/", "not a URL"]) {
    const { events } = visit(referrer);
    assert.equal(events.length, 1);
    assert.equal("ai_source" in events[0][2], false);
  }
});
