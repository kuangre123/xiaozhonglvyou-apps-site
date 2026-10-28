// Keep the established guide URL and native workflows; add a directly usable browser route.
export const gifGuideBrowserUpdate = Object.freeze({
  title: "How to Make a GIF on iPhone: 3 Ways (Photos & Video)",
  description: "Make a GIF on iPhone with a free browser tool or Shortcuts. Compare photo, video and Live Photo workflows, then save and check the animated .gif file.",
  heading: "Make a GIF on iPhone from photos or video.",
  date: "2026-10-28"
});

const escape = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const browserSection = `<section class="section content-section" id="make-gif-in-browser"><div class="section-inner content-grid"><div><p class="section-kicker">Free browser method</p><h2>Make a GIF now, without an account or media uploads.</h2><p>Use the <a href="gif-maker-online.html">free browser GIF maker</a> for still photos, a short supported video, or an existing GIF. The page loads online; decoding and GIF creation happen on your device. No account or payment is required.</p><p>Direct Live Photo and HEIC import are not supported. For still photos, choose JPEG, PNG or WebP files; for a Live Photo, use the <a href="#make-gif-steps">native editor workflow</a> below. The screenshots in this guide show the optional paid GIFmaker app.</p></div><div class="content-list"><div><strong>1. Choose your source</strong><p>Open the tool, choose Photos to GIF, Video to GIF or Resize an existing GIF, then select the matching local files. Use at least two different photos for visible motion.</p></div><div><strong>2. Set the size and timing</strong><p>For photos, arrange the order and set the frame delay. For video, choose the start and end of the useful action. For an existing GIF, choose the size and how many frames to retain.</p></div><div><strong>3. Create, download and check</strong><p>Select Create GIF, preview the animation, then download the generated file. Open that .gif file in a browser and check it in the receiving app; a thumbnail may show only one frame.</p></div><div><strong>Know the browser limits</strong><p>Up to 20 photos, 20 MiB per file, a 15-second video selection, 80 output frames and a 640-pixel maximum side. Video support depends on the browser and codec. GIF uses a 256-color palette; this tool flattens transparency onto white and exports without audio. Resizing may produce a larger file, so compare the actual result.</p></div></div></div></section>`;

const methodActions = '<div class="hero-actions" aria-label="Choose a GIF creation method"><a class="button button-primary" href="gif-maker-online.html">Make a GIF free in your browser</a> <a class="button button-secondary" href="#make-gif-with-shortcuts">Use Shortcuts for photos</a> <a class="button button-secondary" href="#make-gif-steps">Video or Live Photo steps</a></div>';
const shortAnswer = '<p>For still photos or a short supported video, use the <a href="#make-gif-in-browser">free browser method</a>. For a .gif file from still photos using Apple\'s actions, use <a href="#make-gif-with-shortcuts">Shortcuts Make GIF</a>. For direct Live Photo import or detailed frame editing, use the <a href="#make-gif-steps">optional paid GIFmaker workflow</a>. Photos Loop and Bounce are quick effects, rather than the same GIF export workflow.</p>';
const videoAnswer = "For a short supported video, use the free browser GIF maker: choose Video to GIF, select a local video, trim a clip of up to 15 seconds, create the GIF and download it. Video support depends on the browser and codec. For detailed native editing, import the video into the optional paid GIFmaker app, adjust frames and timing, preview, then export.";

function replaceMeta(html, attribute, name, value) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*${attribute}=["']${name}["'])[^>]*>`, "i");
  if (!pattern.test(html)) throw new Error(`GIF guide is missing ${name}`);
  return html.replace(pattern, (tag) => tag.replace(/content=(["'])[\s\S]*?\1/i, `content="${escape(value)}"`));
}

export function updateGifGuide(html) {
  if (!/<link\b[^>]*rel="canonical"[^>]*href="https:\/\/www\.xiaozhonglvyou\.com\/make-gif-on-iphone-guide\.html"/.test(html)) {
    throw new Error("Expected the established iPhone GIF guide canonical URL");
  }
  const copy = gifGuideBrowserUpdate;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(copy.title)}</title>`);
  for (const [attribute, name, value] of [
    ["name", "description", copy.description], ["property", "og:title", copy.title],
    ["property", "og:description", copy.description], ["name", "twitter:title", copy.title],
    ["name", "twitter:description", copy.description], ["property", "article:modified_time", copy.date]
  ]) html = replaceMeta(html, attribute, name, value);
  const heroPattern = /<section\b[^>]*class="page-hero gif-guide-hero"[^>]*>[\s\S]*?<\/section>/;
  if (!heroPattern.test(html)) throw new Error("GIF guide hero is missing");
  html = html.replace(heroPattern, (hero) => hero
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${copy.heading}</h1>`)
    .replace(/<p class="hero-summary">[\s\S]*?<\/p>/, '<p class="hero-summary">Create a .gif file from photos or a short video with the free browser tool, use Shortcuts for still photos, or choose the native editor for Live Photos and detailed frame controls.</p>')
    .replace(/<div class="hero-actions" aria-label="Choose a GIF creation method">[\s\S]*?<\/div>/, methodActions)
    .replace(/<time\b[^>]*>[\s\S]*?<\/time>/, `<time datetime="${copy.date}">October 28, 2026</time>`));
  // Run after legacy content updates, which may restore the original short answer.
  html = html.replace(/<p>For a looping Live Photo, use Photos Loop or Bounce\.[\s\S]*?<\/p>/, shortAnswer);
  html = html.replace(/<section\b[^>]*id="make-gif-in-browser"[^>]*>[\s\S]*?<\/section>/g, "");
  html = html.replace(heroPattern, (hero) => hero + browserSection);
  html = html.replace(/<div role="row" data-browser-gif-comparison>[\s\S]*?<\/div>/g, "");
  const nativeVideoRow = '<div role="row"><span role="cell">Convert video to a .gif file</span><span role="cell">GIFmaker</span><span role="cell">Exports a video clip as a GIF for sharing.</span></div>';
  const browserRow = '<div role="row" data-browser-gif-comparison><span role="cell">Make a GIF from photos or a short video without installing an editor</span><span role="cell"><a href="#make-gif-in-browser">Free browser tool</a></span><span role="cell">Creates the file locally, with size and frame limits; no direct Live Photo import.</span></div>';
  html = html.replace(nativeVideoRow, browserRow + nativeVideoRow);
  html = html.replace(/(<summary>How do I turn an iPhone video into a GIF\?<\/summary><p>)[\s\S]*?(<\/p>)/, (_, open, close) => open + videoAnswer + close);
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  const wordCount = main.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(/\s+/).length;
  html = html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (_, open, json, close) => {
    const value = JSON.parse(json);
    const visit = (node) => {
      if (!node || typeof node !== "object") return;
      if ([node["@type"]].flat().includes("Article")) {
        node.headline = copy.title; node.description = copy.description; node.dateModified = copy.date; node.wordCount = wordCount;
      }
      if ([node["@type"]].flat().includes("WebPage")) { node.name = copy.title; node.description = copy.description; node.dateModified = copy.date; }
      if (node["@type"] === "Question" && node.name === "How do I turn an iPhone video into a GIF?") node.acceptedAnswer.text = videoAnswer;
      Object.values(node).forEach((child) => { if (child && typeof child === "object") Array.isArray(child) ? child.forEach(visit) : visit(child); });
    };
    visit(value);
    return open + JSON.stringify(value) + close;
  });
  return html;
}
