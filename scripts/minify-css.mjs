import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const trimBefore = new Set(["{", "}", ",", ";", ")", "]", ">", "~"]);
const trimAfter = new Set(["{", "(", ",", ";", ">", "~", "}"]);

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

export function minifyCss(source) {
  let output = "";
  let quote = "";
  let inComment = false;
  let pendingWhitespace = false;
  const frames = [{ kind: "container", statement: "", customProperty: false, trimValueSpace: false }];

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
        trimValueSpace: false
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
    } else if (character === ";") {
      frame.statement = "";
      frame.customProperty = false;
      frame.trimValueSpace = false;
    } else if (character !== "{" && character !== "}") {
      frame.statement += character;
    }

    output += character;
  }

  if (inComment) throw new Error("styles.css contains an unterminated comment");
  if (quote) throw new Error("styles.css contains an unterminated string");
  if (frames.length !== 1) throw new Error("styles.css contains an unterminated block");

  return `${output.trim()}\n`;
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
