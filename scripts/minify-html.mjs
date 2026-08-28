import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const inlineElements = new Set([
  "a", "abbr", "b", "bdi", "bdo", "br", "button", "cite", "code", "data", "del",
  "dfn", "em", "i", "img", "input", "ins", "kbd", "label", "mark", "q", "s",
  "samp", "select", "small", "span", "strong", "sub", "sup", "textarea", "time", "u", "var"
]);
const rawTextElements = new Set(["script", "style", "textarea"]);
const preserveWhitespaceElements = new Set(["pre"]);
const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr"
]);

function tagEnd(source, start) {
  let quote = "";

  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (character === quote) {
        quote = "";
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      return index + 1;
    }
  }

  return -1;
}

function markupToken(source, start) {
  if (source.startsWith("<!--", start)) {
    const end = source.indexOf("-->", start + 4);
    if (end === -1) throw new Error("HTML contains an unterminated comment");
    return { end: end + 3, kind: "comment", name: "", text: source.slice(start, end + 3) };
  }

  if (source[start] !== "<") return null;
  if (!/[A-Za-z!/?\[]/.test(source[start + 1] ?? "")) return null;

  const end = tagEnd(source, start);
  if (end === -1) throw new Error("HTML contains an unterminated tag");
  const text = source.slice(start, end);
  const match = text.match(/^<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)/);

  if (!match) return { end, kind: "markup", name: "", text };

  return {
    end,
    kind: match[1] ? "close" : "open",
    name: match[2].toLowerCase(),
    selfClosing: /\/\s*>$/.test(text),
    text
  };
}

function rawTextEnd(source, bodyStart, name) {
  const closePattern = new RegExp(`</${name}\\s*>`, "i");
  const match = closePattern.exec(source.slice(bodyStart));
  if (!match) throw new Error(`HTML contains an unterminated ${name} element`);
  return {
    closeStart: bodyStart + match.index,
    end: bodyStart + match.index + match[0].length
  };
}

function beforeBoundary(node) {
  return node?.kind === "raw" ? node.before : node;
}

function afterBoundary(node) {
  return node?.kind === "raw" ? node.after : node;
}

function whitespaceBetween(previous, next) {
  if (!previous || !next) return "";

  const left = afterBoundary(previous);
  const right = beforeBoundary(next);
  if (left.kind === "comment" || right.kind === "comment") return "";
  if (left.kind === "text" || right.kind === "text") return " ";
  if (inlineElements.has(left.name) && inlineElements.has(right.name)) return " ";
  return "";
}

function tokenizeHtml(source) {
  const nodes = [];
  const openElements = [];
  let index = 0;
  let textStart = 0;

  while (index < source.length) {
    const token = markupToken(source, index);
    if (!token) {
      index += 1;
      continue;
    }

    if (textStart < index) {
      nodes.push({
        kind: "text",
        text: source.slice(textStart, index),
        preserveWhitespace: openElements.some((name) => preserveWhitespaceElements.has(name))
      });
    }

    if (token.kind === "open" && rawTextElements.has(token.name) && !token.selfClosing) {
      const raw = rawTextEnd(source, token.end, token.name);
      const close = markupToken(source, raw.closeStart);
      nodes.push({
        kind: "raw",
        text: source.slice(index, raw.end),
        before: token,
        after: close
      });
      index = raw.end;
      textStart = index;
      continue;
    }

    nodes.push(token);
    if (token.kind === "close") {
      const matchingIndex = openElements.lastIndexOf(token.name);
      if (matchingIndex !== -1) openElements.length = matchingIndex;
    } else if (token.kind === "open" && !token.selfClosing && !voidElements.has(token.name)) {
      openElements.push(token.name);
    }
    index = token.end;
    textStart = index;
  }

  if (textStart < source.length) {
    nodes.push({
      kind: "text",
      text: source.slice(textStart),
      preserveWhitespace: openElements.some((name) => preserveWhitespaceElements.has(name))
    });
  }

  return nodes;
}

function normalizeText(text, previous, next, preserveWhitespace) {
  if (preserveWhitespace) return text;
  if (!/\S/.test(text)) return whitespaceBetween(previous, next);
  return text.replace(/\s+/g, " ");
}

export function minifyHtml(source) {
  const nodes = tokenizeHtml(source);
  let output = "";

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    output += node.kind === "text"
      ? normalizeText(node.text, nodes[index - 1], nodes[index + 1], node.preserveWhitespace)
      : node.text;
  }

  return `${output}\n`;
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const siteDir = process.env.SITE_DIR
    ? path.resolve(process.cwd(), process.env.SITE_DIR)
    : path.resolve(scriptDir, "..");
  const files = (await readdir(siteDir)).filter((file) => file.endsWith(".html")).sort();
  const sources = await Promise.all(
    files.map(async (file) => ({ file, html: await readFile(path.join(siteDir, file), "utf8") }))
  );
  const transformed = sources.map(({ file, html }) => ({ file, html, minified: minifyHtml(html) }));

  await Promise.all(
    transformed
      .filter(({ html, minified }) => html !== minified)
      .map(({ file, minified }) => writeFile(path.join(siteDir, file), minified, "utf8"))
  );

  const originalBytes = sources.reduce((sum, { html }) => sum + Buffer.byteLength(html), 0);
  const minifiedBytes = transformed.reduce((sum, { minified }) => sum + Buffer.byteLength(minified), 0);
  console.log(
    `Minified HTML in ${transformed.filter(({ html, minified }) => html !== minified).length} of ${files.length} files `
    + `(${originalBytes - minifiedBytes} bytes saved).`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
