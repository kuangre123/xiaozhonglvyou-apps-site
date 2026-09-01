const header = document.querySelector("[data-elevate]");
const analyticsDebugMode = window.analyticsDebugEnabled === true
  || new URLSearchParams(window.location.search).get("ga_debug") === "1";

const trackAnalyticsEvent = (eventName, params = {}) => {
  if (typeof window.gtag !== "function") return false;
  const eventParams = analyticsDebugMode ? { ...params, debug_mode: true } : params;
  window.gtag("event", eventName, eventParams);
  return true;
};

window.trackAnalyticsEvent = trackAnalyticsEvent;
window.analyticsDebugEnabled = analyticsDebugMode;

const aiSource = window.analyticsAiSource || "";
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

const storeCountryFor = (anchor) => {
  if (anchor.dataset?.storeCountry) return anchor.dataset.storeCountry;
  try {
    return new URL(anchor.href).pathname.split("/")[1] || "unknown";
  } catch {
    return "unknown";
  }
};

let headerFramePending = false;
const setHeaderState = () => {
  if (!header) return;
  const scrolled = window.scrollY > 8;
  header.hasAttribute("data-scrolled") !== scrolled
    && header.toggleAttribute("data-scrolled", scrolled);
};
const scheduleHeaderState = () => {
  if (headerFramePending) return;
  headerFramePending = true;
  const requestFrame = window.requestAnimationFrame;
  if (typeof requestFrame === "function") {
    window.requestAnimationFrame(() => {
      headerFramePending = false;
      setHeaderState();
    });
  } else {
    headerFramePending = false;
    setHeaderState();
  }
};

setHeaderState();
window.addEventListener("scroll", scheduleHeaderState, { passive: true });

const getHashTarget = (hash) => {
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
};

document.addEventListener("click", (event) => {
  const anchor = event.target?.closest?.("a");
  if (!anchor) return;

  const href = anchor.getAttribute("href") || "";
  if (href[0] === "#" && href !== "#") {
    const target = getHashTarget(href);
    if (!target) return;
    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", href);
    return;
  }

  if (anchor.dataset?.analyticsEvent === "app_store_click") {
    trackAnalyticsEvent("app_store_click", {
      store_product: anchor.dataset.storeProduct || "unknown",
      storefront: anchor.dataset.storefront || "unknown",
      store_country: storeCountryFor(anchor),
      link_url: anchor.href,
      link_text: anchor.textContent.trim(),
      page_path: window.location.pathname,
      transport_type: "beacon"
    });
    return;
  }

  if (anchor.dataset?.analyticsEvent === "search_result_click") {
    trackAnalyticsEvent("search_result_click", {
      search_result_path: anchor.dataset.searchResultPath || href,
      search_result_title: anchor.dataset.searchResultTitle || anchor.textContent.trim(),
      search_result_category: anchor.dataset.searchResultCategory || "unknown",
      search_term: anchor.dataset.searchTerm || "",
      page_path: window.location.pathname,
      transport_type: "beacon"
    });
  }
});
