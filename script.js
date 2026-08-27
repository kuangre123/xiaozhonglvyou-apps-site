const header = document.querySelector("[data-elevate]");
const analyticsDebugMode = window.analyticsDebugEnabled === true
  || new URLSearchParams(window.location.search).get("ga_debug") === "1";

const aiSourceFromReferrer = (referrer) => {
  if (!referrer) return "";

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    if (hostname.includes("chat.openai") || hostname.includes("chatgpt")) return "chatgpt";
    if (hostname.includes("perplexity")) return "perplexity";
    if (hostname.includes("claude.ai")) return "claude";
    if (hostname.includes("gemini.google") || hostname.includes("bard")) return "gemini";
    if (hostname.includes("copilot.microsoft")) return "copilot";
  } catch {
    return "";
  }

  return "";
};

const trackAnalyticsEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", eventName, analyticsDebugMode
    ? { ...parameters, debug_mode: true }
    : parameters);
  return true;
};

window.trackAnalyticsEvent = trackAnalyticsEvent;
window.analyticsDebugEnabled = analyticsDebugMode;

const aiSource = aiSourceFromReferrer(document.referrer);
if (aiSource) {
  trackAnalyticsEvent("ai_referral_visit", {
    ai_source: aiSource,
    landing_path: window.location.pathname,
    referrer_host: (() => {
      try {
        return new URL(document.referrer).hostname;
      } catch {
        return "unknown";
      }
    })()
  });
}

const setHeaderState = () => {
  if (!header) return;
  header.toggleAttribute("data-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const getHashTarget = (hash) => {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = getHashTarget(targetId);
    if (!target) return;
    event.preventDefault();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
    history.pushState(null, "", targetId);
  });
});

document.querySelectorAll('[data-analytics-event="app_store_click"]').forEach((link) => {
  link.addEventListener("click", () => {
    trackAnalyticsEvent("app_store_click", {
      store_product: link.dataset.storeProduct || "unknown",
      storefront: link.dataset.storefront || "unknown",
      link_url: link.href,
      link_text: link.textContent.trim(),
      page_path: window.location.pathname
    });
  });
});
