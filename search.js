(async () => {
  const input = document.getElementById("site-search");
  const resultsDiv = document.getElementById("search-results");
  const emptyDiv = document.getElementById("search-empty");
  if (!input || !resultsDiv || !emptyDiv) return;

  let pages = [];
  let indexReady = false;
  let lastTrackedQuery = "";

  function setStatus(message, showDirectoryLink = false) {
    emptyDiv.replaceChildren();
    const text = document.createElement("span");
    text.textContent = message;
    emptyDiv.append(text);
    if (showDirectoryLink) {
      const link = document.createElement("a");
      link.href = "directory.html";
      link.textContent = " Browse the full directory.";
      emptyDiv.append(link);
    }
  }

  function localPath(value) {
    if (typeof value !== "string" || !value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return "./";
    if (value === "/") return "./";
    return value.replace(/^\/+/, "");
  }

  function renderResults(query) {
    if (!indexReady) return;
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      resultsDiv.replaceChildren();
      emptyDiv.hidden = false;
      setStatus("Type to search across " + pages.length + " pages.");
      return;
    }

    emptyDiv.hidden = true;
    const q = normalizedQuery.toLowerCase();
    const matched = pages.filter((page) => {
      return (page.title && page.title.toLowerCase().includes(q))
        || (page.description && page.description.toLowerCase().includes(q))
        || (page.h1 && page.h1.toLowerCase().includes(q))
        || (page.category && page.category.toLowerCase().includes(q));
    });

    if (normalizedQuery !== lastTrackedQuery) {
      const parameters = {
        search_term: normalizedQuery,
        search_result_count: matched.length,
        search_page: window.location.pathname
      };
      if (typeof window.trackAnalyticsEvent === "function") {
        window.trackAnalyticsEvent("view_search_results", parameters);
      } else if (typeof window.gtag === "function") {
        if (window.analyticsDebugEnabled === true) parameters.debug_mode = true;
        window.gtag("event", "view_search_results", parameters);
      }
      lastTrackedQuery = normalizedQuery;
    }

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("q", normalizedQuery);
    window.history.replaceState(null, "", nextUrl);

    if (matched.length === 0) {
      resultsDiv.replaceChildren();
      const noResults = document.createElement("p");
      noResults.className = "search-no-results";
      noResults.textContent = 'No results found for "' + query + '".';
      resultsDiv.append(noResults);
      return;
    }

    const fragment = document.createDocumentFragment();
    matched.forEach((page) => {
      const title = page.title || page.h1 || page.path;
      const description = page.description || "";
      const item = document.createElement("div");
      item.className = "search-result";
      const link = document.createElement("a");
      link.href = localPath(page.path);
      link.className = "search-result-link";
      link.textContent = title;
      const descriptionElement = document.createElement("p");
      descriptionElement.className = "search-result-description";
      descriptionElement.textContent = description;
      item.append(link, descriptionElement);
      fragment.append(item);
    });
    resultsDiv.replaceChildren(fragment);
  }

  input.addEventListener("input", (event) => renderResults(event.target.value));

  try {
    const response = await fetch("search-index.json", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Search index request failed: " + response.status);
    const data = await response.json();
    pages = Array.isArray(data.pages) ? data.pages : [];
    if (pages.length === 0) throw new Error("Search index is empty");
    indexReady = true;
    resultsDiv.setAttribute("aria-busy", "false");
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    input.value = query;
    renderResults(query);
  } catch (error) {
    console.error("Unable to load the search index.", error);
    input.disabled = true;
    resultsDiv.setAttribute("aria-busy", "false");
    emptyDiv.hidden = false;
    setStatus("The page index is temporarily unavailable.", true);
  }
})();
