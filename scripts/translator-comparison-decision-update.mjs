import { articleUpdateDate } from "./article-update-date.mjs";

// Public US App Store listings and Apple's Lookup API, checked 2026-10-28.
// Release timestamps are UTC; keep them distinct from this editorial check date.
export const translatorComparisonFacts = Object.freeze({
  checkedDate: "2026-10-28",
  title: "Best Translator Apps for Travel on iPhone: 3 Compared",
  description: "Compare Apple Translate, Google Translate and Translation Specialist for travel. Choose by menus, voice, offline languages, iPhone support and cost.",
  google: Object.freeze({ version: "10.44.368", releasedAt: "2026-10-26T18:20:30Z", minimumIos: "18.0", bytes: 255514624, interfaceLanguages: 77 }),
  specialist: Object.freeze({ version: "2.2.4", releasedAt: "2026-10-22T23:19:21Z", minimumIos: "17.4", bytes: 986662912, interfaceLanguages: 8 }),
  apple: Object.freeze({ version: "8.9", releasedAt: "2026-10-19T20:47:30Z", minimumIos: "14.0", bytes: 6971392, interfaceLanguages: 30 })
});

const sources = Object.freeze({
  appleStore: "https://apps.apple.com/us/app/translate/id1514844618",
  googleStore: "https://apps.apple.com/us/app/google-translate/id414706506",
  specialistStore: "https://apps.apple.com/us/app/translation-specialist-speak/id6755734543",
  appleSettings: "https://support.apple.com/guide/iphone/change-your-translate-settings-iphddb6e7264/ios",
  appleLive: "https://support.apple.com/en-us/123720",
  googleCamera: "https://support.google.com/translate/answer/6142483?co=GENIE.Platform%3DiOS&amp;hl=en",
  googleOffline: "https://support.google.com/translate/answer/6142473?co=GENIE.Platform%3DiOS&amp;hl=en"
});
const link = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const escape = text => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const decisionSection = `<section class="section content-section" id="choose-travel-translator"><div class="section-inner content-grid"><div><p class="section-kicker">Choose by travel task</p><h2>Match the app to the moment you need to translate.</h2><p>Start with your destination's language pair, your iPhone version and the exact input: menu photo, spoken exchange or typed text. A published language total cannot tell you whether that particular mode works offline.</p><p><a href="#offline-camera-test">Check offline camera support before the flight</a> · <a href="#comparison-table">Compare all three apps</a></p></div><div class="content-list"><div><h3>A menu or a short everyday exchange</h3><p>Try Apple Translate first for a supported pair. It can translate a live camera view or a saved photo without buying a separate translation app. Follow the <a href="voice-camera-translator-guide.html">printed-menu and saved-photo steps</a>. Its free app listing starts at iOS 14, but camera and newer live features have their own requirements.</p></div><div><h3>A language or input mode Apple does not cover</h3><p>Check Google Translate's exact language and mode. Its listing advertises up to 249 translated languages, while camera, speech and offline support differ. For a saved image, choose Camera, then Gallery; for text in front of you, use the live camera view. ${link(sources.googleCamera, "Google's iPhone camera instructions")}.</p></div><div><h3>A longer tour conversation or phrase practice</h3><p>Compare Google's Transcribe feature with Translation Specialist's continuous live interpretation using your own language pair. Translation Specialist also advertises travel flashcards and core offline pairs; its free download includes optional in-app purchases. We publish Translation Specialist, so this is an alternative to assess against the two free options, not an independently tested winner.</p></div><div id="offline-camera-test"><h3>No connection at the destination?</h3><ol><li>While on Wi-Fi, download both languages for the app and mode you intend to use. If Google shows no download icon for a language, it cannot be downloaded.</li><li>For Apple Translate, open Settings, Apps, Translate, then Languages. Current versions offer On-Device Translation set to Automatic or Always; Always uses downloaded languages on the device. Labels differ on older iOS versions.</li><li>For Google camera translation, open Camera and its language picker, then download the input and output languages.</li><li>Before leaving, enable Airplane Mode and turn off Wi-Fi. Test a menu image, typed text and speech separately; one successful test does not establish support for the other modes. Reconnect when finished.</li></ol><p>See ${link(sources.appleSettings, "Apple's current Translate settings")}, ${link(sources.googleOffline, "Google's language-download instructions")} and ${link(sources.googleCamera, "Google's offline camera steps")}. Translation Specialist's listing does not enumerate every offline pair and mode; test the pair you need instead of inferring it from the interface-language count.</p></div></div></div></section>`;

function replaceMeta(html, attribute, name, value) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}=["']${name}["'])[^>]*>`, "i");
  if (!pattern.test(html)) throw new Error(`Translator comparison is missing ${name}`);
  return html.replace(pattern, tag => tag.replace(/content=(["'])[\s\S]*?\1/i, `content="${escape(value)}"`));
}

export function updateTranslatorComparison(html) {
  if (!/<link\b[^>]*rel="canonical"[^>]*href="https:\/\/www\.xiaozhonglvyou\.com\/best-travel-translator-apps-iphone\.html"/.test(html)) throw new Error("Expected the established travel translator comparison canonical");
  const facts = translatorComparisonFacts;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(facts.title)}</title>`);
  for (const [attribute, name, value] of [["name", "description", facts.description], ["property", "og:title", facts.title], ["property", "og:description", facts.description], ["name", "twitter:title", facts.title], ["name", "twitter:description", facts.description]]) html = replaceMeta(html, attribute, name, value);
  html = html.replace(/<p class="hero-summary">[\s\S]*?<\/p>/, '<p class="hero-summary">Choose Apple Translate, Google Translate or Translation Specialist for the way you travel: reading menus, handling spoken conversations or preparing offline languages. Compare iPhone requirements, costs and the limits of each mode.</p>');
  html = html.replace(/<a\b[^>]*data-travel-task-link[^>]*>[\s\S]*?<\/a>\s*/g, "");
  html = html.replace(/(<div class="hero-actions" aria-label="Best translator apps for travel comparison actions">)/, '$1<a class="button button-primary" data-travel-task-link href="#choose-travel-translator">Choose by travel task</a> ');
  html = html.replace('class="button button-primary" href="#quick-answer"', 'class="button button-secondary" href="#quick-answer"');
  html = html.replace(/<section\b[^>]*id="choose-travel-translator"[^>]*>[\s\S]*?<\/section>/g, "");
  const quick = /<section\b[^>]*id="quick-answer"[^>]*>[\s\S]*?<\/section>/;
  if (!quick.test(html)) throw new Error("Translator comparison quick answer is missing");
  html = html.replace(quick, section => section + decisionSection);
  html = html.replace(/current US App Store listings on <time\b[^>]*>[^<]*<\/time>/, 'current US App Store listings on <time datetime="2026-10-28">October 28, 2026</time>');
  html = html.replace(/href="https:\/\/support\.apple\.com\/guide\/iphone\/translate-messages-calls-and-conversations-iph22b72984d\/ios"/g, `href="${sources.appleLive}"`);
  html = html.replace(/<div role="row"><span role="cell"><strong>US App Store size at check date<\/strong><\/span>[\s\S]*?<\/div>/, '<div role="row"><span role="cell"><strong>US App Store size at check date</strong></span><span role="cell">Built in on supported iPhones; the optional free re-download listing is about 7 MB</span><span role="cell">255.5 MB</span><span role="cell">986.7 MB; check available storage and download on Wi-Fi</span></div>');
  html = html.replace(/<div role="row"><span role="cell"><strong>Published language claims<\/strong><\/span>[\s\S]*?<\/div>/, '<div role="row"><span role="cell"><strong>Published language claims</strong></span><span role="cell">30 interface languages in store metadata; translation support varies by feature and iOS version</span><span role="cell">77 interface languages in store metadata; up to 249 translated languages, with feature limits</span><span role="cell">8 interface languages in store metadata; description advertises 20 app languages, and historical release notes separately describe 17 live-interpretation languages</span></div>');
  html = html.replace(/<div role="row"><span role="cell"><strong>Current iPhone requirement<\/strong><\/span>[\s\S]*?<\/div>/, '<div role="row"><span role="cell"><strong>Current iPhone requirement</strong></span><span role="cell">Translate app listing: iOS 14 or later; camera and Live Translation have separate feature and device requirements</span><span role="cell">Version 10.44.368 requires iOS 18 or later</span><span role="cell">Version 2.2.4 requires iOS 17.4 or later; released October 22, 2026 (UTC)</span></div>');
  const updated = articleUpdateDate(html, facts.checkedDate);
  html = updated.html;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const wordCount = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  return html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = node => {
      if (!node || typeof node !== "object") return;
      if (["Article", "WebPage"].includes(node["@type"])) {
        node.dateModified = updated.date; node.description = facts.description;
        if (node["@type"] === "Article") { node.headline = facts.title; node.wordCount = wordCount; node.citation = [...new Set([...(Array.isArray(node.citation) ? node.citation : node.citation ? [node.citation] : []), ...Object.values(sources).map(url => url.replace(/&amp;/g, "&"))])]; }
        else node.name = facts.title;
      }
      if (node["@type"] === "SoftwareApplication" && node.url?.includes("/id6755734543")) { node.softwareVersion = facts.specialist.version; node.softwareRequirements = "iOS 17.4 or later"; }
      Object.values(node).forEach(visit);
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
}
