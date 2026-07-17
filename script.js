const header = document.querySelector("[data-elevate]");

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
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "app_store_click", {
      store_product: link.dataset.storeProduct || "unknown",
      storefront: link.dataset.storefront || "unknown",
      link_url: link.href,
      link_text: link.textContent.trim()
    });
  });
});
