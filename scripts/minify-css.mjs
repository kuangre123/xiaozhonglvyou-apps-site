import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const trimBefore = new Set(["{", "}", ",", ";", ")", "]", ">", "~"]);
const trimAfter = new Set(["{", "(", ",", ";", ">", "~", "}"]);

function isIdentifierCharacter(character) {
  return Boolean(character) && /[A-Za-z0-9_.-]/.test(character);
}

function blockKind(prelude) {
  if (!/^@/.test(prelude)) return "declarations";
  if (/^@(font-face|page|counter-style|property|viewport)\b/i.test(prelude)) {
    return "declarations";
  }
  return "container";
}

function propertyName(statement) {
  return /^[-\w]+$/.test(statement.trim());
}

function normalizeRgbaFunctions(source) {
  let output = "";
  let quote = "";

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      output += character;
      if (character === "\\" && index + 1 < source.length) output += source[++index];
      else if (character === quote) quote = "";
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      output += character;
      continue;
    }

    const functionMatch = source.slice(index).match(/^rgba\(/i);
    if (!functionMatch) {
      output += character;
      continue;
    }

    const close = source.indexOf(")", index + functionMatch[0].length);
    if (close === -1) {
      output += character;
      continue;
    }

    const argumentsText = source.slice(index + functionMatch[0].length, close);
    if (/[()]/.test(argumentsText)) {
      output += character;
      continue;
    }

    const normalizedArguments = argumentsText
      .trim()
      .replace(/\s*,\s*/g, ",")
      .replace(/(^|,)0\.(\d+)/g, "$1.$2");
    output += `${functionMatch[0]}${normalizedArguments})`;
    index = close;
  }

  return output;
}

export function minifyCss(source) {
  let output = "";
  let quote = "";
  let inComment = false;
  let pendingWhitespace = false;
  const frames = [{
    kind: "container",
    statement: "",
    customProperty: false,
    trimValueSpace: false,
    valueParenDepth: 0,
    valueFunctionNames: []
  }];

  const currentFrame = () => frames[frames.length - 1];

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (inComment) {
      if (character === "*" && nextCharacter === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (!quote && character === "/" && nextCharacter === "*") {
      inComment = true;
      index += 1;
      pendingWhitespace = true;
      continue;
    }

    if (quote) {
      output += character;
      if (character === "\\" && index + 1 < source.length) {
        output += source[index + 1];
        index += 1;
      } else if (character === quote) {
        quote = "";
      }
      continue;
    }

    if (character === '"' || character === "'") {
      const frame = currentFrame();
      if (
        pendingWhitespace
        && output
        && (
          frame.customProperty
          || (!trimAfter.has(output.at(-1)) && !(frame.trimValueSpace && output.endsWith(":")))
        )
      ) output += " ";
      pendingWhitespace = false;
      quote = character;
      output += character;
      continue;
    }

    if (/\s/.test(character)) {
      pendingWhitespace = true;
      continue;
    }

    const frameBeforeCharacter = currentFrame();
    const preserveCustomPropertySpace = frameBeforeCharacter.customProperty
      && character !== ";"
      && character !== "}";
    if (pendingWhitespace && output && (
      preserveCustomPropertySpace
      || (
        !trimBefore.has(character)
        && !(character === ":" && propertyName(frameBeforeCharacter.statement))
        && !(frameBeforeCharacter.trimValueSpace && output.endsWith(":"))
        && !trimAfter.has(output.at(-1))
      )
    )) {
      output += " ";
    }
    pendingWhitespace = false;

    if (character === "{") {
      const parent = currentFrame();
      frames.push({
        kind: blockKind(parent.statement.trim()),
        statement: "",
        customProperty: false,
        trimValueSpace: false,
        valueParenDepth: 0,
        valueFunctionNames: []
      });
      parent.statement = "";
    }
    if (character === "}") {
      if (frames.length === 1) throw new Error("styles.css contains an unexpected closing brace");
      if (output.endsWith(";")) output = output.slice(0, -1);
      frames.pop();
    }

    const frame = currentFrame();
    if (character === ":" && frame.kind === "declarations" && propertyName(frame.statement)) {
      frame.customProperty = frame.statement.trim().startsWith("--");
      frame.trimValueSpace = !frame.customProperty;
    } else if (frame.kind === "declarations" && character === "(") {
      frame.valueParenDepth += 1;
      frame.valueFunctionNames.push(output.match(/[-\w]+$/)?.[0]?.toLowerCase() ?? "");
    } else if (frame.kind === "declarations" && character === ")" && frame.valueParenDepth > 0) {
      frame.valueParenDepth -= 1;
      frame.valueFunctionNames.pop();
    } else if (character === ";") {
      frame.statement = "";
      frame.customProperty = false;
      frame.trimValueSpace = false;
      frame.valueParenDepth = 0;
      frame.valueFunctionNames = [];
    } else if (character !== "{" && character !== "}") {
      frame.statement += character;
    }

    const insideUrl = frame.valueFunctionNames.includes("url");
    if (
      frame.kind === "declarations"
      && !insideUrl
      && !isIdentifierCharacter(source[index - 1] ?? "")
    ) {
      const hexMatch = source.slice(index).match(/^#([0-9a-f]{6})(?![0-9a-f])/i);
      if (hexMatch && !isIdentifierCharacter(source[index + hexMatch[0].length] ?? "")) {
        const hex = hexMatch[1];
        if (hex[0].toLowerCase() === hex[1].toLowerCase()
          && hex[2].toLowerCase() === hex[3].toLowerCase()
          && hex[4].toLowerCase() === hex[5].toLowerCase()) {
          output += `#${hex[0]}${hex[2]}${hex[4]}`;
          index += hexMatch[0].length - 1;
          continue;
        }
      }
    }

    if (frame.trimValueSpace && !insideUrl && !isIdentifierCharacter(source[index - 1] ?? "")) {
      const next = source[index + 3] ?? "";
      if (frame.valueParenDepth === 0 && (
        (source.startsWith("0px", index) || source.startsWith("0vh", index) || source.startsWith("0vw", index))
        && !isIdentifierCharacter(next)
      )) {
        output += "0";
        index += 2;
        continue;
      }
      if (character === "0" && source[index + 1] === "." && /\d/.test(source[index + 2] ?? "")) {
        output += ".";
        index += 1;
        continue;
      }
    }

    output += character;
  }

  if (inComment) throw new Error("styles.css contains an unterminated comment");
  if (quote) throw new Error("styles.css contains an unterminated string");
  if (frames.length !== 1) throw new Error("styles.css contains an unterminated block");

  return `${normalizeRgbaFunctions(output.trim())}\n`;
}

async function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const siteDir = process.env.SITE_DIR
    ? path.resolve(process.cwd(), process.env.SITE_DIR)
    : path.resolve(scriptDir, "..");
  const cssPath = path.join(siteDir, "styles.css");
  const source = await readFile(cssPath, "utf8");
  const minified = minifyCss(source);

  if (source !== minified) await writeFile(cssPath, minified, "utf8");

  console.log(
    `Minified styles.css: ${source === minified ? "0 changed" : `${Buffer.byteLength(source) - Buffer.byteLength(minified)} bytes saved`}.`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
