(async () => {
  const input = document.getElementById("site-search");
  const results = document.getElementById("search-results");
  const emptyState = document.getElementById("search-empty");
  if (!input || !results || !emptyState) return;

  let pages = [];
  let ready = false;
  let lastTrackedQuery = "";
  let framePending = false;
  let pendingQuery = "";

  const showEmptyState = (message, includeDirectoryLink = false) => {
    emptyState.replaceChildren();
    const messageNode = document.createElement("span");
    messageNode.textContent = message;
    emptyState.append(messageNode);

    if (includeDirectoryLink) {
      const directoryLink = document.createElement("a");
      directoryLink.href = "directory.html";
      directoryLink.textContent = " Browse the full directory.";
      emptyState.append(directoryLink);
    }
  };

  const safePath = (value) => {
    if (
      typeof value !== "string"
      || !value
      || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)
      || value === "/"
    ) return "./";
    return value.replace(/^\/+/, "");
  };

  const render = (value) => {
    if (!ready) return;
    const query = value.trim();

    if (query.length < 2) {
      results.replaceChildren();
      emptyState.hidden = false;
      showEmptyState(`Type to search across ${pages.length} pages.`);
      return;
    }

    emptyState.hidden = true;
    const normalizedQuery = query.toLowerCase();
    const matches = pages.filter((page) => page.searchText.includes(normalizedQuery));

    if (query !== lastTrackedQuery) {
      const eventParams = {
        search_term: query,
        search_result_count: matches.length,
        search_page: window.location.pathname
      };
      if (typeof window.trackAnalyticsEvent === "function") {
        window.trackAnalyticsEvent("view_search_results", eventParams);
      } else if (typeof window.gtag === "function") {
        if (window.analyticsDebugEnabled === true) eventParams.debug_mode = true;
        window.gtag("event", "view_search_results", eventParams);
      }
      lastTrackedQuery = query;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("q", query);
    window.history.replaceState(null, "", nextUrl);

    if (matches.length === 0) {
      results.replaceChildren();
      const noResults = document.createElement("p");
      noResults.className = "search-no-results";
      noResults.textContent = `No results found for "${value}".`;
      results.append(noResults);
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach((page) => {
      const title = page.title || page.h1 || page.path;
      const description = page.description || "";
      const result = document.createElement("div");
      result.className = "search-result";

      const link = document.createElement("a");
      link.href = safePath(page.path);
      link.className = "search-result-link";
      link.textContent = title;
      link.setAttribute("data-analytics-event", "search_result_click");
      link.setAttribute("data-search-result-path", page.path || "");
      link.setAttribute("data-search-result-title", title);
      link.setAttribute("data-search-result-category", page.category || "unknown");
      link.setAttribute("data-search-term", query);

      const descriptionNode = document.createElement("p");
      descriptionNode.className = "search-result-description";
      descriptionNode.textContent = description;
      result.append(link, descriptionNode);
      fragment.append(result);
    });
    results.replaceChildren(fragment);
  };

  const renderLatest = () => {
    framePending = false;
    render(pendingQuery);
  };

  const scheduleRender = (value) => {
    pendingQuery = value;
    if (framePending) return;
    framePending = true;
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(renderLatest);
    } else {
      renderLatest();
    }
  };

  input.addEventListener("input", (event) => scheduleRender(event.target.value));

  try {
    const response = await fetch("search-index.json", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Search index request failed: ${response.status}`);

    const index = await response.json();
    pages = Array.isArray(index.pages)
      ? index.pages.map((page) => ({
        ...page,
        searchText: [page.title, page.description, page.h1, page.category]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
      }))
      : [];
    if (pages.length === 0) throw new Error("Search index is empty");

    ready = true;
    results.setAttribute("aria-busy", "false");
    const queryFromUrl = new URLSearchParams(window.location.search).get("q") || "";
    const initialQuery = input.value || queryFromUrl;
    input.value = initialQuery;
    pendingQuery = initialQuery;
    render(initialQuery);
  } catch (error) {
    console.error("Unable to load the search index.", error);
    input.disabled = true;
    results.setAttribute("aria-busy", "false");
    emptyState.hidden = false;
    showEmptyState("The page index is temporarily unavailable.", true);
  }
})();
