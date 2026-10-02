import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../screen-sharing-privacy-guide.html", import.meta.url), "utf8");
const nodes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .flatMap((match) => {
    const value = JSON.parse(match[1]);
    return value["@graph"] ?? [value];
  });
const howTo = nodes.find((node) => node["@type"] === "HowTo");
const faq = nodes.find((node) => node["@type"] === "FAQPage");

test("sharing guide keeps six visible, linked steps and current Article dates", () => {
  assert.equal(howTo.step.length, 6);
  for (const [index, step] of howTo.step.entries()) {
    const id = `step-${index + 1}`;
    assert.equal(step.position, index + 1);
    assert.equal(step.url, `https://www.xiaozhonglvyou.com/screen-sharing-privacy-guide.html#${id}`);
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`href="#${id}"`));
    assert.ok(html.includes(`<strong>${index + 1}. ${step.name}</strong>`));
  }
  assert.equal(nodes.find((node) => node["@type"] === "Article").dateModified, "2026-09-30");
  assert.match(html, /article:modified_time" content="2026-09-30"/);
  assert.match(html, /Updated <time datetime="2026-09-30">September 30, 2026<\/time>/);
});

test("meeting-specific sections cite official sources and remain discoverable", () => {
  for (const id of ["meeting-apps", "receiver-test"]) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1);
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  for (const text of ["Zoom on Mac", "Google Meet in Chrome", "Microsoft Teams on Mac", "Check what another participant actually sees."]) {
    assert.ok(html.includes(text));
  }
  for (const source of [
    "https://support.zoom.com/hc/en/article?id=zm_kb&amp;sysparm_article=KB0060596",
    "https://support.zoom.com/hc/en/article?id=zm_kb&amp;sysparm_article=KB0063824",
    "https://support.google.com/meet/answer/9308856?hl=en",
    "https://support.microsoft.com/en-us/teams/meetings/present-content-in-microsoft-teams-meetings",
    "https://support.microsoft.com/en-us/teams/notifications-settings/manage-notifications-in-microsoft-teams"
  ]) {
    assert.ok(html.includes(`href="${source}"`));
  }
});

test("visible FAQs and structured answers preserve notification and capture limits", () => {
  assert.equal(faq.mainEntity.length, 6);
  for (const question of faq.mainEntity) {
    assert.ok(html.includes(`<summary>${question.name}</summary><p>${question.acceptedAnswer.text}</p>`));
  }
  const focus = faq.mainEntity.find((question) => question.name.includes("Do Not Disturb"));
  assert.match(focus.acceptedAnswer.text, /requests to join/);
  assert.match(focus.acceptedAnswer.text, /not controlled by macOS Focus/);
  const builtin = faq.mainEntity.find((question) => question.name.includes("another app"));
  assert.match(builtin.acceptedAnswer.text, /No extra app is needed/);
  assert.match(builtin.acceptedAnswer.text, /optional tool/);
  assert.match(howTo.step[3].text, /Do not assume that an overlay/);
  assert.match(howTo.step[4].text, /receiving view/);
  assert.match(howTo.step[4].text, /microphone and speakers muted/);
});

test("current Mac privacy price agrees across visible copy and software offers", async () => {
  for (const file of ["index.html", "mac-screen-privacy.html", "mac-screen-privacy-cn.html", "screen-sharing-privacy-guide.html", "media-kit.html", "llms.txt"]) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.ok(source.includes("2.99"), `Missing current US price in ${file}`);
    assert.ok(!source.includes("3.99"), `Stale US price in ${file}`);
    const scripts = [...source.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      if (value.name === "Anti-spy screen" && value.offers) {
        assert.equal(value.offers.price, "2.99", `Incorrect SoftwareApplication price in ${file}`);
        assert.equal(value.offers.priceCurrency, "USD");
      }
      if (value.name === "Anti-spy screen Lite" && value.offers) {
        assert.equal(Number(value.offers.price), 0, `Lite is not free in ${file}`);
      }
      Object.values(value).forEach(visit);
    };
    scripts.forEach((match) => visit(JSON.parse(match[1])));
    if (file === "mac-screen-privacy.html" || file === "mac-screen-privacy-cn.html") {
      assert.ok(source.includes("og-mac-screen-privacy-v2.jpg"));
      assert.ok(!source.includes("og-mac-screen-privacy.jpg"));
    }
  }
});

test("paid GIFmaker has no free-download claims and keeps visible pricing consistent", async () => {
  const site = new URL("../", import.meta.url);
  for (const file of (await readdir(site)).filter((name) => name.endsWith(".html"))) {
    const source = await readFile(new URL(file, site), "utf8");
    for (const [anchor] of source.matchAll(/<a\b[^>]*href="(?:gif-maker\.html|https:\/\/apps\.apple\.com\/[^"<>]*\/id6783559364[^"<>]*)"[^>]*>[\s\S]*?<\/a>/g)) {
      assert.doesNotMatch(anchor, /\bfree\b|免费/i, `Misleading paid-product link in ${file}`);
    }
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      if (value["@type"] === "SoftwareApplication" && value.url?.includes("/id6783559364") && value.offers?.priceCurrency === "USD") {
        assert.equal(Number(value.offers.price), 0.99, `Incorrect GIFmaker offer in ${file}`);
        assert.ok(value.alternateName.includes("GIFmaker: GIF Maker & Editor"));
      }
      Object.values(value).forEach(visit);
    };
    for (const [, json] of source.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) visit(JSON.parse(json));
    if (["gif-maker.html", "gif-maker-cn.html", "best-gif-maker-apps-iphone.html"].includes(file)) {
      assert.ok(source.includes("0.99"));
      assert.ok(source.includes("og-gif-maker-app-v2.jpg"));
      assert.ok(!source.includes("og-gif-maker-app.jpg"));
    }
    if (file === "best-gif-maker-apps-iphone.html") {
      assert.ok(source.includes('<strong>Current download</strong></span><span role="cell">US $0.99 upfront</span>'));
      assert.ok(!source.includes("All three are currently free to download"));
      assert.ok(!source.includes("All three listings currently show a free download"));
    }
  }
  const guide = await readFile(new URL("make-gif-on-iphone-guide.html", site), "utf8");
  assert.ok(guide.includes("Shortcuts Make GIF"), "Do not remove the built-in GIF workflow");
});
