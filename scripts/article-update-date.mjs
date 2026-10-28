// Read the document language, never a descendant's lang or hreflang attribute.
export function articleUpdateDate(html, requestedDate) {
  const chinese = /^zh(?:-|$)/i.test(html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] || "en");
  const dates = [...html.matchAll(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})"/g)].map((match) => match[1]);
  const date = [requestedDate, ...dates].sort().at(-1);
  const parsed = new Date(`${date}T00:00:00Z`);
  const label = chinese ? `${parsed.getUTCFullYear()}年${parsed.getUTCMonth() + 1}月${parsed.getUTCDate()}日更新` : new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(parsed);
  html = html.replace(/(<meta\b[^>]*property="article:modified_time"[^>]*content=")[^"]+("[^>]*>)/g, `$1${date}$2`);
  html = html.replace(/<p class="article-meta">[\s\S]*?<\/p>/g, (meta) => meta.replace(/<time\b[^>]*>[\s\S]*?<\/time>/, `<time datetime="${date}">${label}</time>`));
  return { html, date };
}
