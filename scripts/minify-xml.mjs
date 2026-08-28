import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function markupEnd(source, start) {
  let quote = "";
  let internalSubsetDepth = 0;

  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (character === quote) quote = "";
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "[" && source.slice(start, index).match(/^<!DOCTYPE\b/i)) {
      internalSubsetDepth += 1;
    } else if (character === "]" && internalSubsetDepth > 0) {
      internalSubsetDepth -= 1;
    } else if (character === ">" && internalSubsetDepth === 0) {
      return index + 1;
    }
  }

  return -1;
}

function xmlToken(source, start) {
  if (source.startsWith("<!--", start)) {
    const end = source.indexOf("-->", start + 4);
    if (end === -1) throw new Error("XML contains an unterminated comment");
    return { end: end + 3, kind: "markup", text: source.slice(start, end + 3) };
  }

  if (source.startsWith("<![CDATA[", start)) {
    const end = source.indexOf("]]>", start + 9);
    if (end === -1) throw new Error("XML contains an unterminated CDATA section");
    return { end: end + 3, kind: "markup", text: source.slice(start, end + 3) };
  }

  const end = markupEnd(source, start);
  if (end === -1) throw new Error("XML contains an unterminated markup declaration");
  const text = source.slice(start, end);
  const match = text.match(/^<\s*(\/?)\s*([A-Za-z_][A-Za-z0-9_.:-]*)/);
  if (!match) return { end, kind: "markup", text };

  return {
    end,
    kind: match[1] ? "close" : "open",
    name: match[2],
    selfClosing: /\/\s*>$/.test(text),
    text
  };
}

function tokenizeXml(source) {
  const tokens = [];
  const elements = [];
  let index = 0;
  let textStart = 0;

  while (index < source.length) {
    if (source[index] !== "<") {
      index += 1;
      continue;
    }

    if (textStart < index) {
      const textToken = {
        kind: "text",
        text: source.slice(textStart, index),
        parent: elements.at(-1)
      };
      tokens.push(textToken);
      if (textToken.parent) {
        textToken.parent.textTokens.push(textToken);
        if (/\S/.test(textToken.text)) textToken.parent.hasText = true;
      }
    }

    const token = xmlToken(source, index);
    tokens.push(token);
    if (token.kind === "open") {
      if (elements.length > 0) elements.at(-1).hasChildElement = true;
      if (!token.selfClosing) {
        elements.push({ name: token.name, hasChildElement: false, hasText: false, textTokens: [] });
      }
    } else if (token.kind === "markup" && token.text.startsWith("<![CDATA[")) {
      if (elements.length > 0) elements.at(-1).hasText = true;
    } else if (token.kind === "close") {
      const element = elements.pop();
      if (element) {
        const mixed = element.hasChildElement && element.hasText;
        for (const textToken of element.textTokens) textToken.preserveWhitespace = mixed;
      }
    }
    index = token.end;
    textStart = index;
  }

  if (textStart < source.length) {
    const textToken = {
      kind: "text",
      text: source.slice(textStart),
      parent: elements.at(-1)
    };
    tokens.push(textToken);
    if (textToken.parent) {
      textToken.parent.textTokens.push(textToken);
      if (/\S/.test(textToken.text)) textToken.parent.hasText = true;
    }
  }

  return tokens;
}

export function minifyXml(source) {
  const output = tokenizeXml(source)
    .filter((token) => token.kind !== "text" || token.preserveWhitespace || /\S/.test(token.text))
    .map((token) => token.text)
    .join("");

  return `${output}\n`;
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const siteDir = process.env.SITE_DIR
    ? path.resolve(process.cwd(), process.env.SITE_DIR)
    : path.resolve(scriptDir, "..");
  const files = (await readdir(siteDir)).filter((file) => file.endsWith(".xml")).sort();
  const sources = await Promise.all(
    files.map(async (file) => ({ file, xml: await readFile(path.join(siteDir, file), "utf8") }))
  );
  const transformed = sources.map(({ file, xml }) => ({ file, xml, minified: minifyXml(xml) }));

  await Promise.all(
    transformed
      .filter(({ xml, minified }) => xml !== minified)
      .map(({ file, minified }) => writeFile(path.join(siteDir, file), minified, "utf8"))
  );

  const originalBytes = sources.reduce((sum, { xml }) => sum + Buffer.byteLength(xml), 0);
  const minifiedBytes = transformed.reduce((sum, { minified }) => sum + Buffer.byteLength(minified), 0);
  console.log(
    `Minified XML in ${transformed.filter(({ xml, minified }) => xml !== minified).length} of ${files.length} files `
    + `(${originalBytes - minifiedBytes} bytes saved).`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
