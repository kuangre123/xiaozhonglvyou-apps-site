const analyticsMeasurementId = "G-JY8T5JJGNH";
const analyticsDebugEnabled = new URLSearchParams(window.location.search).get("ga_debug") === "1";

window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag() {
  window.dataLayer.push(arguments);
};

window.gtag("js", new Date());

const referrer = document.referrer || "";
let analyticsAiSource = "";
try {
  const hostname = new URL(referrer).hostname.toLowerCase();
  if (hostname === "chat.openai.com" || hostname.endsWith(".chat.openai.com") || hostname === "chatgpt.com" || hostname.endsWith(".chatgpt.com")) analyticsAiSource = "chatgpt";
  else if (hostname === "perplexity.ai" || hostname.endsWith(".perplexity.ai")) analyticsAiSource = "perplexity";
  else if (hostname === "claude.ai" || hostname.endsWith(".claude.ai")) analyticsAiSource = "claude";
  else if (hostname === "gemini.google.com" || hostname.endsWith(".gemini.google.com") || hostname === "bard.google.com") analyticsAiSource = "gemini";
  else if (hostname === "copilot.microsoft.com" || hostname.endsWith(".copilot.microsoft.com")) analyticsAiSource = "copilot";
} catch {
  analyticsAiSource = "";
}

if (analyticsAiSource) {
  window.gtag("set", "user_properties", { ai_source: analyticsAiSource });
}

window.gtag(
  "config",
  analyticsMeasurementId,
  analyticsDebugEnabled ? { debug_mode: true } : {}
);

window.analyticsDebugEnabled = analyticsDebugEnabled;
