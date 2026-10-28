const cameraSource = "https://support.apple.com/guide/iphone/translate-with-the-camera-iphea8b95631/ios";
const liveTextSource = "https://support.apple.com/en-us/120004";

const previousMenuSection = [
  '<section class="section content-section" id="translate-menu-iphone"><div class="section-inner content-grid"><div>',
  '<p class="section-kicker">Menu translation first</p><h2>How to translate a restaurant menu on iPhone.</h2>',
  "<p>If you only need a quick menu translation, start with Apple's built-in Translate app before installing another app. Apple documents camera translation for menus, signs, and labels, but supported languages and features can vary by iOS version and region.</p>",
  '</div><div class="content-list"><div><strong>Use Apple Translate camera</strong>',
  '<p>Open Translate, choose the source and target languages, tap Camera, frame the menu in good light, then freeze the view or use an existing photo. Review dish names, prices, allergens, and numbers against the original text before ordering.</p></div>',
  '<div><strong>Use Live Text when you start from Camera or Photos</strong><p>When iPhone detects text in Camera or Photos, select the text and choose Translate. This is useful when someone sends a menu photo or when the printed menu is easier to capture first.</p></div>',
  '<div><strong>When Translation Specialist adds value</strong><p>Use a travel translator app when the menu is only one part of the situation: asking staff follow-up questions, playing translated speech aloud, switching into live interpretation, or testing a core language pair offline before leaving Wi-Fi.</p></div>',
  `<div><strong>Official Apple reference</strong><p>For the built-in workflow, see Apple's current <a href="${cameraSource}" target="_blank" rel="noopener noreferrer">Translate with the camera on iPhone</a> guide.</p></div>`,
  '</div></div></section>'
].join("");

const menuSection = [
  '<section class="section content-section" id="translate-menu-iphone"><div class="section-inner content-grid"><div>',
  '<p class="section-kicker">Menu translation first</p><h2>How to translate a restaurant menu on iPhone.</h2>',
  "<p>Start with Apple's built-in Translate app. Choose the printed-menu or saved-photo route below; a separate travel app is optional.</p>",
  '<p>Supported languages and features vary by iOS version and region. Test the language pair you need before traveling.</p>',
  '</div><div class="content-list"><div id="menu-live-camera"><h3>Printed menu: use the live camera</h3>',
  '<ol><li>Open Translate and tap Camera.</li>',
  '<li>Choose the languages and point the camera at the printed menu. Translated text appears over the live view.</li>',
  '<li>Tap Take Picture to freeze the view. Tap overlaid text to copy it, save a favorite, or play it aloud.</li></ol>',
  `<p>See <a href="${cameraSource}" target="_blank" rel="noopener noreferrer">Apple's camera translation steps</a>.</p></div>`,
  '<div id="menu-saved-photo"><h3>Saved menu photo: choose it from your library</h3>',
  '<ol><li>Open Translate, tap Camera, then tap Photo Library.</li>',
  '<li>Select the menu photo and review the translation against the original.</li></ol>',
  `<p>Apple documents this route in its <a href="${cameraSource}" target="_blank" rel="noopener noreferrer">Photo Library instructions</a>.</p>`,
  '<p>Already in Photos? Open the image, tap Live Text, select text, then tap Translate. If needed, enable Live Text in Settings, General, Language &amp; Region. Live Text requires iPhone XS/XR or later with iOS 15 or later; translation availability varies by language and region.</p>',
  `<p>See <a href="${liveTextSource}" target="_blank" rel="noopener noreferrer">Apple's Live Text requirements and translation steps</a>.</p></div>`,
  '<div><strong>Check the result before ordering</strong><p>Compare dish names and prices with the original. Ask staff to confirm ingredients and allergens; a machine translation alone is not enough to establish that a dish is safe for you.</p></div>',
  '<div><strong>When an optional travel app helps</strong><p>For follow-up voice questions, spoken replies, or longer conversations, review <a href="travel-translator.html">Translation Specialist features and requirements</a>, or <a href="best-travel-translator-apps-iphone.html">compare Apple Translate, Google Translate, and Translation Specialist</a>.</p>',
  '<p>Translation Specialist requires iOS 17.4 or later and is free to download with optional in-app purchases. Its offline support covers core language pairs only; test your exact pair and mode before relying on it without a connection.</p></div>',
  '</div></div></section>'
].join("");

const previousHeroActions = '<div class="hero-actions" aria-label="Translator guide actions"><a class="button button-primary" href="#translate-menu-iphone">Translate a menu</a> <a class="button button-secondary" href="https://apps.apple.com/us/app/translation-specialist/id6755734543?uo=4" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="translation-specialist" data-storefront="ios-app-store" aria-label="Download Translation Specialist free on the App Store (opens in a new tab)">Download free</a></div>';
const methodActions = '<div class="hero-actions" aria-label="Choose a menu translation method"><a class="button button-primary" href="#menu-live-camera">Translate a printed menu</a> <a class="button button-secondary" href="#menu-saved-photo">Translate a menu photo</a></div>';
const previousWorkflowAction = '<div class="hero-actions" aria-label="Download Translation Specialist after the six-step guide"><a class="button button-primary" href="https://apps.apple.com/us/app/translation-specialist/id6755734543?uo=4" target="_blank" rel="noopener noreferrer" data-analytics-event="app_store_click" data-store-product="translation-specialist" data-storefront="ios-app-store" aria-label="Download Translation Specialist after reviewing the six-step workflow (opens in a new tab)">Try the travel workflow</a></div>';
const workflowAction = '<div class="hero-actions" aria-label="Optional travel app details"><a class="button button-primary" href="travel-translator.html">Check Translation Specialist features</a></div>';

export const menuTranslationGuideUpdate = {
  modifiedDate: "2026-10-28",
  modifiedDateLabel: "October 28, 2026",
  article: {
    dateModified: "2026-10-28",
    headline: "How to Translate a Menu on iPhone: Camera & Photos",
    description: "Translate a printed menu or saved photo with Apple Translate on iPhone. Follow Camera and Photo Library steps, plus text and offline language checks.",
    citation: [cameraSource, liveTextSource]
  },
  replacements: [
    {
      label: "separate printed-menu and saved-photo direct answer",
      from: ['<p class="hero-summary">Start with the built-in iPhone camera translation flow for menus, then use voice, camera OCR, live interpretation, and core offline language pairs for the rest of the trip.</p>'],
      to: '<p class="hero-summary">For a printed menu, open Apple Translate and tap Camera. For a saved photo, use Camera, then Photo Library. Start with these built-in tools before choosing an optional travel app.</p>'
    },
    {
      label: "menu translation method hero actions",
      from: [previousHeroActions],
      to: methodActions + '<p class="hero-preview-note">The app previews show optional Translation Specialist. Its camera image is an entry screen, not a translated menu or an Apple Translate screenshot.</p>'
    },
    {
      label: "menu method table of contents",
      from: ['<ol class="toc-list">'],
      to: '<ol class="toc-list"><li><a href="#translate-menu-iphone">Built-in menu translation</a></li><li><a href="#menu-live-camera">Printed menu: live camera</a></li><li><a href="#menu-saved-photo">Saved menu photo</a></li>'
    },
    {
      label: "two complete built-in menu translation routes",
      from: [previousMenuSection],
      to: menuSection
    },
    {
      label: "optional travel app details instead of generic download",
      from: [previousWorkflowAction],
      to: workflowAction
    },
    {
      label: "accurate optional camera app preview description",
      from: ['alt="Translation Specialist camera OCR screen for menus, signs, and labels"'],
      to: 'alt="Translation Specialist Camera Translation entry screen with an Open Camera Translation button"'
    }
  ]
};
