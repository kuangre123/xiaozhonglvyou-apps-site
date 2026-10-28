// Published Chrome extension policies are standalone documents, not marketing pages.
// Keep their URLs and bytes intact; additions require an explicit manifest entry.
export const standalonePrivacyPages = Object.freeze([
  {
    "file": "gifmaker-chrome-privacy.html",
    "sha256": "76eb7e5100ecd3aacc0aedfd95f21dd390b1ed8765759238204264b387ae9814",
    "title": "GIFmaker extension privacy",
    "robots": "noindex"
  },
  {
    "file": "inkstone-chrome-privacy.html",
    "sha256": "86ff5af27056a3d9b44e9920baf96044b1c61dd1db08b7371d5789c1cd9cf8ee",
    "title": "Inkstone — Web Clipper Privacy Policy",
    "robots": null
  },
  {
    "file": "privacyguard-chrome-privacy.html",
    "sha256": "4c90ee425a3275454712c589a225a8f82b64bbd532bb7857c25ac2e11027b893",
    "title": "PrivacyGuard — Web Redactor Privacy Policy",
    "robots": null
  },
  {
    "file": "translation-specialist-chrome-privacy.html",
    "sha256": "1f375bb92047bfb16b69f4eba1223842a3f07b2570a59b30b47259df8e0e78bb",
    "title": "Translation Specialist — Web Text Privacy Policy",
    "robots": null
  }
].map((page) => Object.freeze(page)));
const standaloneFiles = new Set(standalonePrivacyPages.map((page) => page.file));
export const isStandalonePrivacyPage = (fileName) => standaloneFiles.has(fileName);
export const isMainSiteHtmlFile = (fileName) => fileName.endsWith(".html") && !isStandalonePrivacyPage(fileName);
