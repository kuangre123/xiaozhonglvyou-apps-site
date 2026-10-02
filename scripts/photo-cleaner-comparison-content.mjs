const appleDeletionSource = "https://support.apple.com/en-us/104967";
const appleDuplicateSource = "https://support.apple.com/en-us/102260";
const photoAccessSource = "https://developer.apple.com/documentation/PhotoKit/delivering-an-enhanced-privacy-experience-in-your-photos-app";
const description = "Compare AI Cleaning, Cleanup, and Cleaner Kit with Apple Photos as a free baseline: duplicates, similar photos, free limits, privacy, and iCloud deletion.";

const previousFaqs = [
  ["Which iPhone photo cleaner is best for AI photo classification?", "AI Cleaning is the strongest fit of these three when the priority is classifying a library into practical categories before cleanup. It groups documents, receipts, invoices, ID cards, food, plants, animals, restaurants, and group photos using on-device analysis, then keeps deletion under user review."],
  ["How do the pricing models differ?", "All three are free to download and offer in-app purchases. AI Cleaning offers optional subscriptions. Cleanup's listing describes a seven-day trial and paid plans, while Cleaner Kit describes weekly or annual subscriptions and a free trial with some limited use. Check the App Store purchase sheet before confirming because offers can change."],
  ["Which apps include email cleanup and video compression?", "Cleanup and Cleaner Kit advertise both email cleanup and video compression. AI Cleaning is narrower: it focuses on photo classification, duplicate and similar-photo review, screenshots, blurry media, large media, and duplicate contacts."],
  ["Do these photo cleaner apps delete photos automatically?", "AI Cleaning presents candidates for review and asks for confirmation; its Daily Cleanup shows 30 swipe-style review cards at a time. Cleanup's listing promises a final review screen. Cleaner Kit's developer response says deletion requires explicit consent. Always inspect selections and Recently Deleted before permanently removing media."],
  ["Which iPhone photo cleaner has the clearest privacy position?", "All three developers describe local or on-device photo analysis. Privacy labels are a separate signal: Apple's current pages disclose data used to track users for Cleanup and Cleaner Kit. Those labels are developer-reported and can vary by feature, so compare the live App Store privacy section before installing."]
];

export const photoCleanerComparisonFaqs = [
  ["Which iPhone photo cleaner is best for AI photo classification?", "AI Cleaning lists nine Pro content categories, including documents, receipts, invoices, and ID cards. This is a fit-based recommendation from its publisher, not a measured claim that its detection is more accurate than Cleanup or Cleaner Kit."],
  ["How do the pricing models differ?", "All three are free to download. AI Cleaning allows one successful in-app cleanup action across eligible tools; further gated actions and its nine AI categories require Pro. Cleanup advertises a seven-day trial, while Cleaner Kit describes limited free use and weekly or annual plans. Confirm the purchase sheet for your account and country."],
  ["Which apps include email cleanup and video compression?", "Cleanup and Cleaner Kit list both tools. AI Cleaning's published focus is photo organization, review, and duplicate contacts rather than email cleanup or video compression. Choose by the work you need, not the number of advertised tools."],
  ["Do these photo cleaner apps delete photos automatically?", "AI Cleaning asks for confirmation, Cleanup describes a final review, and Cleaner Kit describes review choices. AI Cleaning's 30 Daily Cleanup review cards are not a daily free-deletion allowance. Inspect every selection before approving a library change."],
  ["How do photo processing and privacy labels differ?", "On-device photo processing does not mean an app collects no other data. AI Cleaning's label says Data Not Collected; Cleanup and Cleaner Kit disclose data that may be used for tracking. Apple says these disclosures are developer-reported and not verified by Apple."],
  ["Do I need a separate app to remove duplicate iPhone photos?", "No. Apple Photos includes Duplicates from iOS 16. If the collection is missing, let the phone index while locked and charging; Apple says detection can take a few days. Check built-in duplicates before paying for another tool."],
  ["Will a cleaner delete photos from iCloud too?", "With iCloud Photos enabled, library deletions also affect other devices using the same Apple Account. This is not just clearing a local cache. Recently Deleted normally gives 30 days to recover items; do not permanently empty it before checking what remains."]
];

function faqMarkup(questions) {
  return '<div class="faq-list">' + questions.map(([name, answer], index) =>
    `<details${index === 0 ? " open" : ""}><summary>${name}</summary><p>${answer}</p></details>`
  ).join("") + "</div>";
}

const methodSection = '<section class="section content-section alt-section" id="method">';
const baselineSections = [
  '<section class="section content-section alt-section" id="apple-photos"><div class="section-inner content-grid"><div><p class="section-kicker">Free built-in baseline</p><h2>Check Apple Photos before installing another cleaner.</h2>',
  `<p>On iOS 16 or later, Photos provides a Duplicates collection. In the current layout, open Collections, then Utilities, then Duplicates. Review a group and confirm Merge; Photos keeps the highest-quality image and relevant data, moving the extras to Recently Deleted. See <a href="${appleDeletionSource}" target="_blank" rel="noopener noreferrer">Apple's duplicate and deletion instructions</a>.</p></div><div class="content-list">`,
  '<div><strong>When it is enough</strong><p>Use the built-in groups when the job is removing the duplicates Photos has identified, without another app or subscription.</p></div>',
  `<div><strong>If Duplicates is missing</strong><p>Detection needs indexing, a locked phone, and power. It may take a few days; a missing collection is not proof that another app will recover more space. See <a href="${appleDuplicateSource}" target="_blank" rel="noopener noreferrer">Apple's indexing guidance</a>.</p></div>`,
  '<div><strong>When to compare an app</strong><p>Look at the three apps below when you also need broader review groups, content categories, or video and email tools. More tools do not guarantee better duplicate decisions.</p></div>',
  '</div></div></section>',
  '<section class="section content-section" id="duplicates-vs-similar"><div class="section-inner content-grid"><div><p class="section-kicker">Different review decisions</p><h2>Duplicates and similar photos are not the same task.</h2><p>Copies of the same image are different from nearby shots with a new expression, focus point, crop, or document page. A cleaner can suggest a preferred photo, but its suggestion is not proof that the other versions are disposable.</p></div><div class="content-list">',
  '<div><strong>Review context, not just sharpness</strong><p>Keep useful edits and intentional variants. Compare bursts, document sequences, and family photos before confirming a removal.</p></div>',
  `<div><strong>Check the permission scope</strong><p>With limited Photos access, an app can inspect only the items you share, not the entire camera roll. Grant only the access you intend to use. See <a href="${photoAccessSource}" target="_blank" rel="noopener noreferrer">Apple's limited-library explanation</a>.</p></div>`,
  `<div><strong>Check sync before deletion</strong><p>iCloud Photos propagates library deletions to synced devices. Keep the recovery window until you verify important items. See <a href="${appleDeletionSource}" target="_blank" rel="noopener noreferrer">Apple's recovery guidance</a>.</p></div>`,
  '<div><strong>Use the local decision guide</strong><p>Read the guide in <a href="ja-jp-best-iphone-photo-cleaner.html" lang="ja">Japanese</a>, <a href="de-de-beste-iphone-foto-cleaner.html" lang="de">German</a>, or <a href="tr-tr-en-iyi-iphone-fotograf-temizleme.html" lang="tr">Turkish</a>. A translated guide does not establish an app interface language; the listing-language row below records that separately.</p></div>',
  '</div></div></section>'
].join("");

const iosRow = '<div role="row"><span role="cell"><strong>Minimum iOS</strong></span>';
const listingRows = [
  '<div role="row"><span role="cell"><strong>US version checked October 2, 2026</strong></span><span role="cell">1.1.6</span><span role="cell">6.22.0</span><span role="cell">5.32</span></div>',
  '<div role="row"><span role="cell"><strong>Japanese, German, Turkish interface</strong></span><span role="cell">All three listed</span><span role="cell">All three listed</span><span role="cell">Japanese and German listed; Turkish not listed</span></div>',
  '<div role="row"><span role="cell"><strong>Vault and Live Photo tools</strong></span><span role="cell">Face ID Private Vault, Live Photo Slimming, burst review</span><span role="cell">PIN vault listed</span><span role="cell">Face ID or passcode secret folder; Live Photo still conversion</span></div>'
].join("");

export const photoCleanerComparisonUpdate = {
  description,
  modifiedDate: "2026-10-03",
  modifiedDateLabel: "October 3, 2026",
  article: {
    description,
    dateModified: "2026-10-03",
    citation: [
      "https://apps.apple.com/us/app/ai-cleaning-photo-cleaner/id6768019606",
      "https://apps.apple.com/us/app/cleanup-phone-storage-cleaner/id1510944943",
      "https://apps.apple.com/us/app/cleaner-kit-clean-up-storage/id1194582243",
      appleDeletionSource,
      appleDuplicateSource,
      photoAccessSource
    ]
  },
  structuredData: [{
    type: "FAQPage",
    values: {
      mainEntity: photoCleanerComparisonFaqs.map(([name, text]) => ({
        "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text }
      }))
    }
  }],
  replacements: [
    {
      label: "current source check label",
      from: ['<p class="eyebrow">Listing-based comparison - verified August 2026</p>'],
      to: '<p class="eyebrow">Official listing comparison - checked October 2, 2026</p>'
    },
    {
      label: "built-in Photos jump link",
      from: ['<a class="button button-secondary" href="#comparison-table">Compare features</a>'],
      to: '<a class="button button-secondary" href="#comparison-table">Compare features</a><a href="#apple-photos">Start with Apple Photos</a>'
    },
    {
      label: "Apple baseline and review boundaries",
      from: [methodSection],
      to: baselineSections + methodSection
    },
    {
      label: "current comparison method date",
      from: ['<p>We checked the US App Store pages on <time datetime="2026-08-10">August 10, 2026</time>. The table records features and terms each developer currently publishes. We did not run a timed, hands-on accuracy test across all three apps, so this page does not invent speed scores, duplicate-detection percentages, or a universal rank.</p>'],
      to: '<p>US listings were rechecked on <time datetime="2026-10-02">October 2, 2026</time>: AI Cleaning 1.1.6, Cleanup 6.22.0, and Cleaner Kit 5.32. Features, interface languages, and minimum iOS come from official listings; AI Cleaning\'s free-action boundary was also checked in its code. Competitor tools were not benchmarked, so this is not an accuracy or speed ranking.</p>'
    },
    {
      label: "current Cleaner Kit summary",
      from: ['<p>Best fit for a broad cleaner with email tools, Siri shortcuts, Larger Text, and Dark Interface support.</p>'],
      to: '<p>Compare it for email tools, video compression, Larger Text, and Dark Interface support. Its current listing also describes a secret folder and Live Photo conversion.</p>'
    },
    {
      label: "current Cleaner Kit primary focus",
      from: ['<span role="cell">All-in-one photos, video, email, contacts, storage insights, and shortcuts</span>'],
      to: '<span role="cell">Photos, video, email, contacts, and private storage</span>'
    },
    {
      label: "AI free limit in comparison table",
      from: ['<span role="cell">Free download with optional subscriptions</span>'],
      to: '<span role="cell">One successful in-app cleanup action; more gated actions and nine AI categories require Pro</span>'
    },
    {
      label: "daily review is not free deletion quota",
      from: ['<span role="cell">Review and confirmation; Daily Cleanup offers 30 swipe cards</span>'],
      to: '<span role="cell">Review and confirmation; 30 Daily Cleanup review cards are not a daily free-deletion allowance</span>'
    },
    {
      label: "listing-based Cleaner Kit review boundary",
      from: ['<span role="cell">Developer says deletion requires explicit consent</span>'],
      to: '<span role="cell">Review choices described in listing; verify selections</span>'
    },
    {
      label: "versions and local interface languages",
      from: [iosRow],
      to: listingRows + iosRow
    },
    {
      label: "current broader-tool recommendation",
      from: ['<p>Choose <strong>Cleanup</strong> or <strong>Cleaner Kit</strong> when you want a broader utility that also compresses video and works on email clutter. Cleaner Kit additionally publishes Siri shortcuts and accessibility support for Larger Text and Dark Interface. Those extra tools add scope, but they are not automatically useful if your only problem is photo review.</p>'],
      to: '<p>Compare <strong>Cleanup</strong> and <strong>Cleaner Kit</strong> for video compression or email cleanup. Cleaner Kit also declares Larger Text and Dark Interface support. AI Cleaning has a narrower published scope and adds content categories, burst review, Live Photo Slimming, and a private vault. Check the tools you actually need before choosing a subscription.</p>'
    },
    {
      label: "specific free-use and purchase-sheet boundaries",
      from: ['<p>All three listings show in-app purchases. Before starting a trial, open Apple\'s purchase sheet and verify the billing period, renewal price, and cancellation date. Cleanup\'s description refers to a seven-day trial and paid access. Cleaner Kit describes weekly or annual billing and says its free trial includes all features with some limited use. AI Cleaning offers optional subscriptions.</p>'],
      to: '<p>All three downloads have paid upgrades. AI Cleaning allows one successful in-app cleanup action across eligible tools; further gated actions and Auto-Categorize require Pro. Cleanup advertises a seven-day trial, but its description uses inconsistent billing-period wording. Do not infer renewal terms from that paragraph. Cleaner Kit describes limited free use and weekly or annual full-access plans. The purchase sheet for your account and country is the final check.</p>'
    },
    {
      label: "consistent current FAQs",
      from: [faqMarkup(previousFaqs)],
      to: faqMarkup(photoCleanerComparisonFaqs)
    }
  ]
};
