const header = document.querySelector("[data-elevate]");

const setHeaderState = () => {
  if (!header) return;
  header.toggleAttribute("data-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const localeHomes = {
  "zh-cn": {
    path: "zh-cn.html",
    label: "中文首页",
    aria: "Summer Chen Apps 中文首页",
    pages: new Set([
      "zh-cn.html",
      "ai-photo-classification-cn.html",
      "iphone-photo-cleaner-cn.html",
      "duplicate-photo-cleaner-cn.html",
      "travel-translator-cn.html",
      "mac-screen-privacy-cn.html"
    ])
  },
  "zh-hant": {
    path: "zh-hant.html",
    label: "繁體中文首頁",
    aria: "Summer Chen Apps 繁體中文首頁",
    pages: new Set(["zh-hant.html"])
  }
};

const currentPage = window.location.pathname.split("/").pop() || "index.html";
const currentLocale = Object.entries(localeHomes).find(([, locale]) => locale.pages.has(currentPage))?.[0] || "";

try {
  if (currentLocale) {
    localStorage.setItem("scPreferredHome", currentLocale);
  } else if (document.referrer.includes("/zh-cn.html")) {
    localStorage.setItem("scPreferredHome", "zh-cn");
  } else if (document.referrer.includes("/zh-hant.html")) {
    localStorage.setItem("scPreferredHome", "zh-hant");
  }

  const preferredLocale = localStorage.getItem("scPreferredHome");
  const preferredHome = localeHomes[preferredLocale];
  const isGlobalHome = currentPage === "index.html" || currentPage === "";
  const isLocaleHome = Object.values(localeHomes).some((locale) => locale.path === currentPage);

  if (preferredHome && !isGlobalHome && !isLocaleHome) {
    const homeHrefs = new Set([
      "/",
      "./",
      "index.html",
      "https://www.xiaozhonglvyou.com/",
      "https://www.xiaozhonglvyou.com/index.html"
    ]);

    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!homeHrefs.has(href)) return;

      link.setAttribute("href", preferredHome.path);
      if (link.classList.contains("brand")) {
        link.setAttribute("aria-label", preferredHome.aria);
        return;
      }

      const text = link.textContent.trim();
      if (["Home", "Go home", "Back to portfolio", "View portfolio"].includes(text)) {
        link.textContent = preferredHome.label;
      }
    });
  }
} catch {
  // Keep navigation usable if localStorage is unavailable.
}

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
