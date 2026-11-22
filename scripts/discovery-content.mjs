export function htmlWithoutResourceCacheVersions(html) {
  // A format-only change to the same brand artwork does not change a page's search content.
  return html.replace(/(<img\b[^>]*class="brand-mark"[^>]*src="\/assets\/kuangre-ai-logo)\.(?:png|webp)"/g, '$1.png"').replace(
    /(<script\b[^>]*\ssrc=(["'])(?:\.\/|\/)?(?:analytics|script|search)\.js\?v=)[a-f0-9]{12}(\2[^>]*>)/gi,
    "$1CACHE_VERSION$3"
  ).replace(
    /(<link\b(?=[^>]*\srel=(["'])stylesheet\2)[^>]*\shref=(["'])(?:\.\/|\/)?styles\.css\?v=)[a-f0-9]{12}(\3[^>]*>)/gi,
    "$1CACHE_VERSION$4"
  );
}
