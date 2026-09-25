// Bun macro: runs at bundle/transpile time (imported `with { type: "macro" }`) and inlines its result.
// Reads the JSDoc + signatures faker ships in its .d.ts (the same source fakerjs.dev's API docs are built from).
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

export interface MethodParamInfo {
  key: string;
  hint: string;
  desc: string;
}

export interface FakerDocs {
  params: Record<string, MethodParamInfo[]>;
  // Methods with no options-object overload: kwargs are passed as positional args in this order
  positional: Record<string, string[]>;
}

function hintFor(type: string | undefined, aliases: Record<string, string>): string {
  const t = (type && aliases[type.trim()]) || type || "";
  if (/\bDate\b/.test(t)) return "<date>";
  if (/\bnumber\b|NumberOrRange/.test(t)) return "<n>";
  if (/\bboolean\b/.test(t)) return "<bool>";
  const literals = [...t.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (literals.length && /^\s*'[^']*'(\s*\|\s*'[^']*')*\s*$/.test(t)) return `<${literals.join("|")}>`;
  if (/^\s*string\s*$/.test(t)) return "<string>";
  return "<value>"; // ponytail: complex/object types get a generic hint
}

// Overloads each declare part of a literal union ('age' in one, 'year' in another): union them
const TYPE_HINTS = new Set(["<n>", "<bool>", "<date>", "<string>", "<value>"]);
function setHint(p: MethodParamInfo, next: string) {
  const prev = p.hint.slice(p.key.length + 1);
  if (prev === "<value>") p.hint = `${p.key}:${next}`;
  else if (!TYPE_HINTS.has(prev) && !TYPE_HINTS.has(next)) {
    const literals = new Set([...prev.slice(1, -1).split("|"), ...next.slice(1, -1).split("|")]);
    p.hint = `${p.key}:<${[...literals].join("|")}>`;
  }
}

export function fakerDocs(): FakerDocs {
  const dist = join(import.meta.dir, "..", "node_modules", "@faker-js", "faker", "dist");
  const core = readdirSync(dist).find((f) => f.startsWith("core-") && f.endsWith(".d.ts"))!;
  const lines = readFileSync(join(dist, core), "utf8").split("\n");

  // Single-line type aliases and string enums, e.g. `type SexType = `${Sex}`` + `declare enum Sex { Female = "female", ... }`
  const aliases: Record<string, string> = {};
  let enumName: string | undefined;
  for (const l of lines) {
    const a = /^type (\w+) = ([^;{]+);$/.exec(l) ?? /^type (\w+) = `\$\{(\w+)\}`;$/.exec(l);
    if (a) aliases[a[1]] = a[2];
    const e = /^declare enum (\w+) \{/.exec(l);
    if (e) [enumName, aliases[e[1]]] = [e[1], ""];
    else if (enumName && l === "}") enumName = undefined;
    else if (enumName) {
      const v = /^  \w+ = "([^"]+)"/.exec(l);
      if (v) aliases[enumName] += `${aliases[enumName] ? " | " : ""}'${v[1]}'`;
    }
  }
  for (const [k, v] of Object.entries(aliases)) if (aliases[v]) aliases[k] = aliases[v];

  const params: Record<string, MethodParamInfo[]> = {};
  const positional: Record<string, string[]> = {};
  const hasOptionsOverload = new Set<string>();
  let mod: string | undefined;
  let jsdoc = "";
  let pending: string | undefined;
  let current: string | undefined; // method whose signature we're inside, for option property types

  for (const line of lines) {
    const cls = /^declare class (\w+?)Module extends /.exec(line);
    if (cls) mod = cls[1].replace(/^Simple/, "").replace(/^./, (c) => c.toLowerCase());
    else if (line === "}") mod = undefined;
    if (!mod) continue;

    // A JSDoc opened at class indent belongs to the next `  name(` line; deeper ones document option properties
    if (/^  \/\*\*/.test(line)) pending = "";
    if (pending !== undefined) {
      pending += line + "\n";
      if (line.includes("*/")) [jsdoc, pending] = [pending, undefined];
      continue;
    }

    const prop = /^    (\w+)\??: (.+?);?$/.exec(line);
    if (current && prop) {
      const p = params[current].find((x) => x.key === prop[1]);
      if (p) setHint(p, hintFor(prop[2], aliases));
      continue;
    }

    const m = /^  (\w+)(?:<[^(]*>)?\((.*)/.exec(line);
    if (!m) continue;
    if (!jsdoc) {
      current = undefined;
      continue;
    }
    const key = `${mod}.${m[1]}`;
    current = key;
    const list = (params[key] ??= []);
    const sig = m[2];
    if (/^options\??:/.test(sig.trim())) hasOptionsOverload.add(key);

    const tags = jsdoc.split(/\n\s*\*\s*(?=@)/).filter((t) => t.startsWith("@param "));
    for (const tag of tags) {
      const [, name, rest = ""] = /^@param (\S+)\s*([\s\S]*)/.exec(tag)!;
      const paramKey = name.includes(".") ? name.split(".").slice(1).join(".") : name;
      if (paramKey === "options") continue;
      if (!name.includes(".")) {
        const pos = (positional[key] ??= []);
        if (!pos.includes(name)) pos.push(name);
      }
      // Nested range keys (`wordCount.min`) take their parent's type (`wordCount?: NumberOrRange`)
      const typeKey = name.startsWith("options.") ? paramKey : name.split(".")[0];
      const sigType = new RegExp(`\\b${typeKey}\\??: ([^,)]+)`).exec(sig)?.[1];
      const existing = list.find((p) => p.key === paramKey);
      if (existing) {
        setHint(existing, hintFor(sigType, aliases));
        continue;
      }
      const desc = rest.split(/\n\s*\*\s*\n/)[0].replace(/\n\s*\*\s?/g, " ").replace(/\s*\*\/\s*$/, "").trim();
      list.push({ key: paramKey, hint: `${paramKey}:${hintFor(sigType, aliases)}`, desc });
    }
    jsdoc = "";
  }

  for (const key of hasOptionsOverload) delete positional[key];
  for (const key of Object.keys(positional)) if (!positional[key].length) delete positional[key];
  return { params, positional };
}
