export const privateDocumentationPaths = ["/DEPLOYMENT.md", "/README.md", "/SEO_SUBMISSION.md"];

// Enforce this site's open-crawl policy, not a general-purpose REP evaluator.
export function checkSearchCrawlerPolicy(text, crawlerNames) {
  const names = new Set(["*", ...crawlerNames].map((name) => name.toLowerCase()));
  const groups = [];
  let group;
  for (const rawLine of text.split(/\r\n|\r|\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (field === "user-agent") {
      if (!group || group.rules.length) {
        group = { agents: [], rules: [] };
        groups.push(group);
      }
      group.agents.push(value.toLowerCase());
    } else if (group && (field === "allow" || field === "disallow")) {
      group.rules.push({ field, value });
    }
  }

  const failures = [];
  const searchGroups = groups.filter((item) => item.agents.some((name) => names.has(name)));
  if (!searchGroups.some((item) => item.agents.includes("*"))) {
    failures.push("Missing wildcard crawler group for unnamed search engines");
  }
  for (const item of searchGroups) {
    const label = item.agents.filter((name) => names.has(name)).join(", ");
    if (!item.rules.some((rule) => rule.field === "allow" && rule.value === "/")) {
      failures.push(`Search crawler group (${label}) must explicitly Allow: /`);
    }
    for (const rule of item.rules) {
      if (rule.field === "disallow" && rule.value && !privateDocumentationPaths.includes(rule.value)) {
        failures.push(`Search crawler group (${label}) has unapproved Disallow: ${rule.value}`);
      }
    }
  }
  return { groupsChecked: searchGroups.length, failures };
}
