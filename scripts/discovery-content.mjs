export function htmlWithoutResourceCacheVersions(html) {
  return html.replace(
    /(<script\b[^>]*\ssrc=(["'])(?:\.\/|\/)?(?:analytics|script|search)\.js\?v=)[a-f0-9]{12}(\2[^>]*>)/gi,
    "$1CACHE_VERSION$3"
  ).replace(
    /(<link\b(?=[^>]*\srel=(["'])stylesheet\2)[^>]*\shref=(["'])(?:\.\/|\/)?styles\.css\?v=)[a-f0-9]{12}(\3[^>]*>)/gi,
    "$1CACHE_VERSION$4"
  );
}
