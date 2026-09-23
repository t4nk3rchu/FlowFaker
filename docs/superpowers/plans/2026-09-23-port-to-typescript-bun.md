# Port Data Faker to TypeScript & Bun Standalone Executable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Flow Launcher "Data Faker" plugin from legacy Python to a high-performance TypeScript plugin compiled into a standalone Windows binary (`data-faker.exe`) using Bun, featuring full dynamic support for all 25+ `@faker-js/faker` modules, interactive syntax helpers, and zero runtime dependencies for end users.

**Architecture:** A standalone Windows binary compiled via `bun build --compile` receives Flow Launcher's JSON-RPC requests via CLI arguments (`process.argv[2]`). A query tokenizer parses modules, methods, and options (`repeat:N`, `newline:true`, `locale:XX`, kwargs), while a universal dynamic dispatcher executes against `@faker-js/faker`. Results are rendered with Flow Launcher native `AutoCompleteText` and `ChangeQuery` actions for interactive keyboard navigation.

**Tech Stack:** Bun v1.4+, TypeScript 5+, `@faker-js/faker` v9+, Flow Launcher JSON-RPC 2.0 API.

**Spec:** [`docs/superpowers/specs/2026-09-23-port-to-typescript-bun-design.md`](file:///d:/Claude/Data%20Faker%20Flow%20Launcher/docs/superpowers/specs/2026-09-23-port-to-typescript-bun-design.md)

## Global Constraints

* **ActionKeyword:** Verbatim `"fake"` in `plugin.json` and all autocomplete query templates.
* **Manifest Language:** `"executable"` with `ExecuteFileName: "bin\\data-faker.exe"`.
* **Zero Runtime Dependencies:** The compiled executable must run standalone without requiring Node.js, Bun, or Python on user machines.
* **No Unhandled Crashes:** All errors must be caught at the outer boundary and returned as formatted Flow Launcher informational cards.
* **Test Verification:** Every non-trivial file must have a corresponding test suite executed via `bun test`.

---

### Task 1: Project Scaffolding & Python Residue Cleanup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Modify: `plugin.json`
- Delete: `main.py`, `src/*.py`, `lib/`, `tmpwheel/`, `requirements.txt`

**Interfaces:**
- Produces: Bun environment with `@faker-js/faker` and configured TypeScript compiler options.
- Manifest `plugin.json`: `"Language": "executable"`, `"ExecuteFileName": "bin\\data-faker.exe"`, `"ActionKeyword": "fake"`.

- [ ] **Step 1: Initialize `package.json` with Bun and dependencies**

```bash
bun init -y
bun add @faker-js/faker
bun add -d typescript @types/bun
```

- [ ] **Step 2: Configure `tsconfig.json`**

Write `tsconfig.json`:
```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "types": ["bun-types"]
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

- [ ] **Step 3: Update `plugin.json`**

Modify `plugin.json`:
```json
{
  "ID": "a6f2b0a6-513e-4078-8116-f33333333333",
  "ActionKeyword": "fake",
  "Name": "Data Faker",
  "Description": "Generate realistic test data from Flow Launcher using Faker.",
  "Author": "t4nk3rchu",
  "Version": "2.0.0",
  "Language": "executable",
  "ExecuteFileName": "bin\\data-faker.exe",
  "IcoPath": "Images\\app.svg"
}
```

- [ ] **Step 4: Delete legacy Python residue files**

```bash
git rm -rf lib/ tmpwheel/ src/*.py main.py requirements.txt
```

- [ ] **Step 5: Verify Bun installation and dependencies**

Run: `bun run --version`
Expected: Output showing Bun version without errors.

- [ ] **Step 6: Commit**

```bash
git add package.json bun.lock tsconfig.json plugin.json
git commit -m "chore: scaffold bun typescript project and remove python residue"
```

---

### Task 2: Flow Launcher Protocol Types

**Files:**
- Create: `src/types.ts`
- Test: `tests/types.test.ts`

**Interfaces:**
- Produces:
  - `interface FlowResult`: `{ Title: string, SubTitle?: string, IcoPath?: string, AutoCompleteText?: string, JsonRPCAction?: JsonRPCAction, ContextData?: any }`
  - `interface JsonRPCAction`: `{ method: string, parameters: any[], dontHideAfterAction?: boolean }`
  - `interface JsonRPCRequest`: `{ id: number | string, method: string, parameters: any[] }`
  - `interface JsonRPCResponse`: `{ result: FlowResult[] }`

- [ ] **Step 1: Write the failing test for JSON-RPC types formatting**

Write `tests/types.test.ts`:
```typescript
import { expect, test } from "bun:test";
import { formatFlowResponse, type FlowResult } from "../src/types";

test("formatFlowResponse serializes results correctly", () => {
  const results: FlowResult[] = [
    {
      Title: "John Doe",
      SubTitle: "Click to copy",
      IcoPath: "Images\\app.svg",
      AutoCompleteText: "fake person fullName ",
      JsonRPCAction: {
        method: "Flow.Launcher.CopyToClipboard",
        parameters: ["John Doe", false, true]
      }
    }
  ];

  const output = formatFlowResponse(results);
  expect(JSON.parse(output)).toEqual({ result: results });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/types.test.ts`
Expected: FAIL with "Cannot find module '../src/types'"

- [ ] **Step 3: Implement `src/types.ts`**

Write `src/types.ts`:
```typescript
export interface JsonRPCAction {
  method: string;
  parameters: any[];
  dontHideAfterAction?: boolean;
}

export interface FlowResult {
  Title: string;
  SubTitle?: string;
  IcoPath?: string;
  AutoCompleteText?: string;
  JsonRPCAction?: JsonRPCAction;
  ContextData?: any;
}

export interface JsonRPCRequest {
  id?: number | string;
  method: string;
  parameters: any[];
}

export interface JsonRPCResponse {
  result: FlowResult[];
}

export function formatFlowResponse(results: FlowResult[]): string {
  return JSON.stringify({ result: results });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/types.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types.ts tests/types.test.ts
git commit -m "feat: add Flow Launcher JSON-RPC type definitions"
```

---

### Task 3: Locale Manager

**Files:**
- Create: `src/locales.ts`
- Test: `tests/locales.test.ts`

**Interfaces:**
- Produces:
  - `function getFaker(localeCode?: string): Faker`
  - `function isSupportedLocale(localeCode: string): boolean`
  - `const SUPPORTED_LOCALES: Record<string, string>`

- [ ] **Step 1: Write failing test for locale resolution**

Write `tests/locales.test.ts`:
```typescript
import { expect, test } from "bun:test";
import { getFaker, isSupportedLocale } from "../src/locales";

test("resolves default en locale when omitted or unrecognized", () => {
  const defaultFaker = getFaker();
  expect(defaultFaker).toBeDefined();

  const fallbackFaker = getFaker("invalid_locale_xyz");
  expect(fallbackFaker).toBeDefined();
});

test("resolves specific locales correctly", () => {
  expect(isSupportedLocale("vi")).toBe(true);
  expect(isSupportedLocale("ja")).toBe(true);
  expect(isSupportedLocale("de")).toBe(true);

  const viFaker = getFaker("vi");
  expect(viFaker).toBeDefined();
  const name = viFaker.person.fullName();
  expect(typeof name).toBe("string");
  expect(name.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/locales.test.ts`
Expected: FAIL with "Cannot find module '../src/locales'"

- [ ] **Step 3: Implement `src/locales.ts`**

Write `src/locales.ts`:
```typescript
import {
  fakerEN,
  fakerVI,
  fakerJA,
  fakerZH_CN,
  fakerZH_TW,
  fakerDE,
  fakerFR,
  fakerES,
  fakerKO,
  fakerIT,
  fakerRU,
  fakerPT_BR,
  type Faker
} from "@faker-js/faker";

const LOCALE_INSTANCES: Record<string, Faker> = {
  en: fakerEN,
  vi: fakerVI,
  vi_vn: fakerVI,
  ja: fakerJA,
  ja_jp: fakerJA,
  zh_cn: fakerZH_CN,
  zh: fakerZH_CN,
  zh_tw: fakerZH_TW,
  de: fakerDE,
  de_de: fakerDE,
  fr: fakerFR,
  fr_fr: fakerFR,
  es: fakerES,
  es_es: fakerES,
  ko: fakerKO,
  ko_kr: fakerKO,
  it: fakerIT,
  ru: fakerRU,
  pt_br: fakerPT_BR
};

export const SUPPORTED_LOCALES: Record<string, string> = {
  en: "English (US)",
  vi: "Vietnamese",
  ja: "Japanese",
  zh_cn: "Chinese (Simplified)",
  zh_tw: "Chinese (Traditional)",
  de: "German",
  fr: "French",
  es: "Spanish",
  ko: "Korean",
  it: "Italian",
  ru: "Russian",
  pt_br: "Portuguese (Brazil)"
};

export function isSupportedLocale(localeCode: string): boolean {
  if (!localeCode) return false;
  return normalizeLocaleKey(localeCode) in LOCALE_INSTANCES;
}

export function normalizeLocaleKey(localeCode: string): string {
  return localeCode.toLowerCase().replace("-", "_");
}

export function getFaker(localeCode?: string): Faker {
  if (!localeCode) return fakerEN;
  const key = normalizeLocaleKey(localeCode);
  return LOCALE_INSTANCES[key] ?? fakerEN;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/locales.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/locales.ts tests/locales.test.ts
git commit -m "feat: implement multi-locale faker manager with safe fallback"
```

---

### Task 4: Query & Options Tokenizer

**Files:**
- Create: `src/parser.ts`
- Test: `tests/parser.test.ts`

**Interfaces:**
- Produces:
  - `interface ParsedQuery`: `{ moduleName?: string, methodName?: string, options: ParsedOptions, hasTrailingSpace: boolean, raw: string }`
  - `interface ParsedOptions`: `{ repeat: number, newline: boolean, locale?: string, kwargs: Record<string, any> }`
  - `function parseQuery(rawQuery: string): ParsedQuery`

- [ ] **Step 1: Write failing test for query parsing**

Write `tests/parser.test.ts`:
```typescript
import { expect, test } from "bun:test";
import { parseQuery } from "../src/parser";

test("parses module and method correctly", () => {
  const q = parseQuery("person fullName");
  expect(q.moduleName).toBe("person");
  expect(q.methodName).toBe("fullName");
  expect(q.options.repeat).toBe(1);
  expect(q.options.newline).toBe(false);
  expect(q.hasTrailingSpace).toBe(false);
});

test("detects trailing space for syntax helpers", () => {
  const q1 = parseQuery("person fullName ");
  expect(q1.hasTrailingSpace).toBe(true);

  const q2 = parseQuery("airline ");
  expect(q2.hasTrailingSpace).toBe(true);
});

test("parses global and method options correctly", () => {
  const q = parseQuery("number int min:10 max:100 repeat:5 newline:true locale:vi");
  expect(q.moduleName).toBe("number");
  expect(q.methodName).toBe("int");
  expect(q.options.repeat).toBe(5);
  expect(q.options.newline).toBe(true);
  expect(q.options.locale).toBe("vi");
  expect(q.options.kwargs).toEqual({ min: 10, max: 100 });
});

test("handles invalid repeat counts gracefully", () => {
  const q = parseQuery("person fullName repeat:invalid");
  expect(q.options.repeat).toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/parser.test.ts`
Expected: FAIL with "Cannot find module '../src/parser'"

- [ ] **Step 3: Implement `src/parser.ts`**

Write `src/parser.ts`:
```typescript
export interface ParsedOptions {
  repeat: number;
  newline: boolean;
  locale?: string;
  kwargs: Record<string, any>;
}

export interface ParsedQuery {
  moduleName?: string;
  methodName?: string;
  options: ParsedOptions;
  hasTrailingSpace: boolean;
  raw: string;
}

export function parseQuery(rawQuery: string): ParsedQuery {
  const raw = rawQuery || "";
  const hasTrailingSpace = raw.endsWith(" ");
  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      options: { repeat: 1, newline: false, kwargs: {} },
      hasTrailingSpace,
      raw
    };
  }

  const tokens = trimmed.split(/\s+/);
  let moduleName: string | undefined;
  let methodName: string | undefined;
  const kwargs: Record<string, any> = {};
  let repeat = 1;
  let newline = false;
  let locale: string | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const colonIdx = token.indexOf(":");

    if (colonIdx > 0) {
      const key = token.slice(0, colonIdx);
      const valStr = token.slice(colonIdx + 1);

      if (key === "repeat") {
        const parsedRepeat = parseInt(valStr, 10);
        repeat = Number.isInteger(parsedRepeat) && parsedRepeat > 0 ? Math.min(parsedRepeat, 100) : 1;
      } else if (key === "newline") {
        newline = valStr.toLowerCase() === "true" || valStr === "1";
      } else if (key === "locale" || key === "lang") {
        locale = valStr;
      } else {
        kwargs[key] = parseOptionValue(valStr);
      }
    } else {
      if (moduleName === undefined) {
        moduleName = token;
      } else if (methodName === undefined) {
        methodName = token;
      }
    }
  }

  return {
    moduleName,
    methodName,
    options: { repeat, newline, locale, kwargs },
    hasTrailingSpace,
    raw
  };
}

function parseOptionValue(val: string): any {
  if (val.toLowerCase() === "true") return true;
  if (val.toLowerCase() === "false") return false;
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== "") return num;
  return val;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/parser.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/parser.ts tests/parser.test.ts
git commit -m "feat: implement robust query tokenizer and options parser"
```

---

### Task 5: Universal Faker Dispatcher & Introspection

**Files:**
- Create: `src/dispatcher.ts`
- Test: `tests/dispatcher.test.ts`

**Interfaces:**
- Produces:
  - `function getAvailableModules(): string[]`
  - `function getModuleMethods(moduleName: string): string[]`
  - `function getMethodParameters(moduleName: string, methodName: string): string[]`
  - `function executeFaker(moduleName: string, methodName: string, kwargs?: Record<string, any>, locale?: string): any`

- [ ] **Step 1: Write failing test for dispatcher**

Write `tests/dispatcher.test.ts`:
```typescript
import { expect, test } from "bun:test";
import {
  getAvailableModules,
  getModuleMethods,
  executeFaker,
  getMethodParameters
} from "../src/dispatcher";

test("lists available Faker modules", () => {
  const modules = getAvailableModules();
  expect(modules).toContain("person");
  expect(modules).toContain("internet");
  expect(modules).toContain("airline");
  expect(modules).toContain("commerce");
});

test("lists methods for a specific module", () => {
  const methods = getModuleMethods("person");
  expect(methods).toContain("fullName");
  expect(methods).toContain("firstName");
});

test("executes methods with camelCase and snake_case", () => {
  const res1 = executeFaker("person", "fullName");
  expect(typeof res1).toBe("string");
  expect(res1.length).toBeGreaterThan(0);

  const res2 = executeFaker("person", "first_name");
  expect(typeof res2).toBe("string");
  expect(res2.length).toBeGreaterThan(0);
});

test("handles legacy aliases", () => {
  const num = executeFaker("random", "number");
  expect(typeof num).toBe("number");
});

test("returns method parameters metadata", () => {
  const params = getMethodParameters("number", "int");
  expect(params).toContain("min");
  expect(params).toContain("max");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/dispatcher.test.ts`
Expected: FAIL with "Cannot find module '../src/dispatcher'"

- [ ] **Step 3: Implement `src/dispatcher.ts`**

Write `src/dispatcher.ts`:
```typescript
import { getFaker } from "./locales";
import type { Faker } from "@faker-js/faker";

const EXCLUDED_MODULES = new Set([
  "rawDefinitions",
  "definitions",
  "faker",
  "helpers",
  "_customizer",
  "defaultRefDate"
]);

const LEGACY_ALIASES: Record<string, { module: string; method: string }> = {
  "random.number": { module: "number", method: "int" },
  "random.random_int": { module: "number", method: "int" },
  "random.boolean": { module: "datatype", method: "boolean" },
  "random.uuid4": { module: "string", method: "uuid" },
  "random.image": { module: "image", method: "urlPicsumPhotos" },
  "phone.phone_number": { module: "phone", method: "number" }
};

const METHOD_PARAM_MAP: Record<string, string[]> = {
  "number.int": ["min:<n>", "max:<n>"],
  "number.float": ["min:<n>", "max:<n>", "fractionDigits:<n>"],
  "internet.email": ["firstName:<str>", "lastName:<str>", "provider:<str>"],
  "commerce.price": ["min:<n>", "max:<n>", "dec:<n>", "symbol:<str>"],
  "lorem.words": ["count:<n>"],
  "lorem.sentences": ["count:<n>"],
  "lorem.paragraphs": ["count:<n>"],
  "date.between": ["from:<date>", "to:<date>"],
  "string.numeric": ["length:<n>"],
  "string.alphanumeric": ["length:<n>"]
};

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function getAvailableModules(): string[] {
  const faker = getFaker();
  return Object.keys(faker)
    .filter((key) => {
      const val = (faker as any)[key];
      return (
        !EXCLUDED_MODULES.has(key) &&
        val &&
        typeof val === "object" &&
        !key.startsWith("_")
      );
    })
    .sort();
}

export function getModuleMethods(moduleName: string): string[] {
  const faker = getFaker();
  const normalizedModule = toCamelCase(moduleName);
  const mod = (faker as any)[normalizedModule];
  if (!mod || typeof mod !== "object") return [];

  return Object.keys(mod)
    .filter((key) => typeof mod[key] === "function" && !key.startsWith("_"))
    .sort();
}

export function getMethodParameters(moduleName: string, methodName: string): string[] {
  const normModule = toCamelCase(moduleName);
  const normMethod = toCamelCase(methodName);
  const key = `${normModule}.${normMethod}`;
  return METHOD_PARAM_MAP[key] ?? [];
}

export function executeFaker(
  moduleName: string,
  methodName: string,
  kwargs: Record<string, any> = {},
  locale?: string
): any {
  const aliasKey = `${moduleName}.${methodName}`.toLowerCase();
  const target = LEGACY_ALIASES[aliasKey] ?? {
    module: toCamelCase(moduleName),
    method: toCamelCase(methodName)
  };

  const faker = getFaker(locale);
  const mod = (faker as any)[target.module];
  if (!mod) {
    throw new Error(`Faker module '${moduleName}' not found.`);
  }

  const fn = mod[target.method];
  if (typeof fn !== "function") {
    throw new Error(`Method '${methodName}' not found on module '${moduleName}'.`);
  }

  const hasArgs = Object.keys(kwargs).length > 0;
  return hasArgs ? fn.call(mod, kwargs) : fn.call(mod);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/dispatcher.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/dispatcher.ts tests/dispatcher.test.ts
git commit -m "feat: implement universal dynamic Faker dispatcher and parameter lookup"
```

---

### Task 6: Results & Interactive Autocomplete Engine

**Files:**
- Create: `src/results.ts`
- Test: `tests/results.test.ts`

**Interfaces:**
- Produces:
  - `function generateResults(parsed: ParsedQuery): FlowResult[]`
  - `function generateContextMenu(contextData: any): FlowResult[]`

- [ ] **Step 1: Write failing test for results generator**

Write `tests/results.test.ts`:
```typescript
import { expect, test } from "bun:test";
import { generateResults } from "../src/results";
import { parseQuery } from "../src/parser";

test("returns module suggestions when query is empty or module incomplete", () => {
  const q = parseQuery("");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(10);
  expect(res[0].AutoCompleteText).toMatch(/^fake \w+ $/);
  expect(res[0].JsonRPCAction?.method).toBe("Flow.Launcher.ChangeQuery");
});

test("returns method suggestions when module is chosen with trailing space", () => {
  const q = parseQuery("airline ");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].AutoCompleteText).toMatch(/^fake airline \w+ $/);
});

test("returns generated value and syntax helper cards when method has trailing space", () => {
  const q = parseQuery("number int ");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(1);
  // First item is generated value
  expect(res[0].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
  // Subsequent items include syntax helpers
  const helperTitles = res.map((r) => r.Title);
  expect(helperTitles.some((t) => t.includes("repeat:"))).toBe(true);
  expect(helperTitles.some((t) => t.includes("min:"))).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/results.test.ts`
Expected: FAIL with "Cannot find module '../src/results'"

- [ ] **Step 3: Implement `src/results.ts`**

Write `src/results.ts`:
```typescript
import type { FlowResult } from "./types";
import type { ParsedQuery } from "./parser";
import {
  getAvailableModules,
  getModuleMethods,
  getMethodParameters,
  executeFaker
} from "./dispatcher";

const ICON_PATH = "Images\\app.svg";

export function generateResults(q: ParsedQuery): FlowResult[] {
  const { moduleName, methodName, options, hasTrailingSpace } = q;

  // 1. Root: No module specified -> List all modules
  if (!moduleName) {
    return listModules("");
  }

  const allModules = getAvailableModules();
  const matchedModules = allModules.filter((m) =>
    m.toLowerCase().startsWith(moduleName.toLowerCase())
  );

  // If user is typing module name and hasn't hit space yet
  if (!hasTrailingSpace && !methodName && matchedModules.length > 0 && matchedModules[0] !== moduleName) {
    return listModules(moduleName);
  }

  // Exact or chosen module
  const resolvedModule = matchedModules[0] ?? moduleName;

  // 2. Module chosen, no method specified -> List methods
  if (!methodName) {
    return listMethods(resolvedModule, "");
  }

  const methods = getModuleMethods(resolvedModule);
  const matchedMethods = methods.filter((m) =>
    m.toLowerCase().startsWith(methodName.toLowerCase())
  );

  if (!hasTrailingSpace && matchedMethods.length > 0 && matchedMethods[0].toLowerCase() !== methodName.toLowerCase()) {
    return listMethods(resolvedModule, methodName);
  }

  const resolvedMethod = matchedMethods[0] ?? methodName;

  // 3. Method chosen -> Generate data
  try {
    const results: FlowResult[] = [];
    const generatedValues: string[] = [];

    for (let i = 0; i < options.repeat; i++) {
      const val = executeFaker(resolvedModule, resolvedMethod, options.kwargs, options.locale);
      const strVal = typeof val === "object" ? JSON.stringify(val) : String(val);
      generatedValues.push(strVal);
    }

    const outputText = generatedValues.join(options.newline ? "\n" : ", ");

    results.push({
      Title: outputText,
      SubTitle: `${resolvedModule}.${resolvedMethod} (${options.repeat} item${options.repeat > 1 ? "s" : ""}) | Press Enter to copy`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `fake ${resolvedModule} ${resolvedMethod} `,
      JsonRPCAction: {
        method: "Flow.Launcher.CopyToClipboard",
        parameters: [outputText, false, true]
      },
      ContextData: {
        module: resolvedModule,
        method: resolvedMethod,
        kwargs: options.kwargs,
        locale: options.locale,
        value: outputText
      }
    });

    // 4. If trailing space present, show syntax helper cards
    if (hasTrailingSpace) {
      results.push(...buildSyntaxHelpers(resolvedModule, resolvedMethod, q.raw));
    }

    return results;
  } catch (err: any) {
    return [
      {
        Title: `Error: ${err?.message || "Unknown error"}`,
        SubTitle: "Check module or method parameters",
        IcoPath: ICON_PATH
      }
    ];
  }
}

function listModules(filter: string): FlowResult[] {
  const modules = getAvailableModules().filter((m) =>
    m.toLowerCase().includes(filter.toLowerCase())
  );

  return modules.map((m) => ({
    Title: m,
    SubTitle: `Faker module | Press Tab or Enter to explore methods`,
    IcoPath: ICON_PATH,
    AutoCompleteText: `fake ${m} `,
    JsonRPCAction: {
      method: "Flow.Launcher.ChangeQuery",
      parameters: [`fake ${m} `, true]
    }
  }));
}

function listMethods(moduleName: string, filter: string): FlowResult[] {
  const methods = getModuleMethods(moduleName).filter((m) =>
    m.toLowerCase().includes(filter.toLowerCase())
  );

  if (methods.length === 0) {
    return [
      {
        Title: `No methods found for '${moduleName}'`,
        SubTitle: "Press Tab on 'fake' to select a valid module",
        IcoPath: ICON_PATH
      }
    ];
  }

  return methods.map((m) => {
    let sample = "";
    try {
      const v = executeFaker(moduleName, m);
      sample = typeof v === "object" ? JSON.stringify(v) : String(v);
    } catch {
      sample = "Preview unavailable";
    }

    return {
      Title: `${moduleName}.${m}`,
      SubTitle: `Sample: ${sample} | Press Tab to autocomplete`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `fake ${moduleName} ${m} `,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`fake ${moduleName} ${m} `, true]
      }
    };
  });
}

function buildSyntaxHelpers(moduleName: string, methodName: string, rawQuery: string): FlowResult[] {
  const baseQuery = rawQuery.endsWith(" ") ? rawQuery : rawQuery + " ";
  const helpers: FlowResult[] = [];

  // Global options
  const globalOptions = [
    { key: "repeat:", hint: "repeat:<n> - Repeat count (e.g. repeat:5)" },
    { key: "newline:", hint: "newline:<true|false> - Format with newlines" },
    { key: "locale:", hint: "locale:<code> - Locale override (e.g. locale:vi, locale:ja)" }
  ];

  for (const opt of globalOptions) {
    helpers.push({
      Title: opt.key,
      SubTitle: `${opt.hint} | Press Tab/Enter to add`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `${baseQuery}${opt.key}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`${baseQuery}${opt.key}`, true]
      }
    });
  }

  // Method-specific options
  const methodParams = getMethodParameters(moduleName, methodName);
  for (const param of methodParams) {
    const colonIdx = param.indexOf(":");
    const key = colonIdx > 0 ? param.slice(0, colonIdx + 1) : param;
    helpers.push({
      Title: key,
      SubTitle: `Parameter: ${param} | Press Tab/Enter to add`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `${baseQuery}${key}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`${baseQuery}${key}`, true]
      }
    });
  }

  return helpers;
}

export function generateContextMenu(contextData: any): FlowResult[] {
  if (!contextData) return [];
  const { module, method, kwargs, locale, value } = contextData;

  const makeRepeatAction = (count: number, newline: boolean): FlowResult => {
    let text = "";
    try {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        const v = executeFaker(module, method, kwargs, locale);
        items.push(typeof v === "object" ? JSON.stringify(v) : String(v));
      }
      text = items.join(newline ? "\n" : ", ");
    } catch {
      text = value;
    }

    return {
      Title: `Generate & Copy ${count} items ${newline ? "(Newlines)" : ""}`,
      SubTitle: `Preview: ${text.slice(0, 60)}...`,
      IcoPath: ICON_PATH,
      JsonRPCAction: {
        method: "Flow.Launcher.CopyToClipboard",
        parameters: [text, false, true]
      }
    };
  };

  return [
    {
      Title: "Copy current item to clipboard",
      SubTitle: value,
      IcoPath: ICON_PATH,
      JsonRPCAction: {
        method: "Flow.Launcher.CopyToClipboard",
        parameters: [value, false, true]
      }
    },
    makeRepeatAction(5, false),
    makeRepeatAction(10, false),
    makeRepeatAction(5, true),
    makeRepeatAction(10, true)
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/results.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/results.ts tests/results.test.ts
git commit -m "feat: implement result card generator and interactive syntax helpers"
```

---

### Task 7: CLI Entry Point & Standalone Binary Compilation

**Files:**
- Create: `src/index.ts`
- Compile: `bin/data-faker.exe`
- Test: `tests/e2e.test.ts`

**Interfaces:**
- CLI: `bin\data-faker.exe "<JSON-RPC Request>"`
- Standard JSON output printed to `stdout` (`console.log`).

- [ ] **Step 1: Write the entrypoint `src/index.ts`**

Write `src/index.ts`:
```typescript
import { parseQuery } from "./parser";
import { generateResults, generateContextMenu } from "./results";
import { formatFlowResponse, type FlowResult, type JsonRPCRequest } from "./types";

function main() {
  const rawArg = process.argv[2];
  if (!rawArg) {
    console.log(formatFlowResponse([]));
    return;
  }

  try {
    const req: JsonRPCRequest = JSON.parse(rawArg);
    const method = req.method;
    const params = req.parameters || [];

    if (method === "query") {
      const queryString = (params[0] ?? "").toString();
      const parsed = parseQuery(queryString);
      const results = generateResults(parsed);
      console.log(formatFlowResponse(results));
      return;
    }

    if (method === "context_menu") {
      const contextData = params[0];
      const results = generateContextMenu(contextData);
      console.log(formatFlowResponse(results));
      return;
    }

    if (method === "copy_to_clipboard") {
      // Direct fallback if invoked explicitly
      console.log(formatFlowResponse([]));
      return;
    }

    console.log(formatFlowResponse([]));
  } catch (err: any) {
    const errorCard: FlowResult = {
      Title: "Data Faker Error",
      SubTitle: err?.message || "Failed to process request",
      IcoPath: "Images\\app.svg"
    };
    console.log(formatFlowResponse([errorCard]));
  }
}

main();
```

- [ ] **Step 2: Add build script to `package.json`**

Update `package.json`:
```json
"scripts": {
  "test": "bun test",
  "build": "bun build --compile --minify ./src/index.ts --outfile ./bin/data-faker.exe"
}
```

- [ ] **Step 3: Compile standalone Windows executable**

Run: `bun run build`
Expected: Output creating `./bin/data-faker.exe`.

- [ ] **Step 4: Write and run end-to-end binary test**

Write `tests/e2e.test.ts`:
```typescript
import { expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { resolve } from "path";

test("compiled binary executes JSON-RPC query successfully", () => {
  const exePath = resolve("bin", "data-faker.exe");
  const payload = JSON.stringify({
    id: 1,
    method: "query",
    parameters: ["person fullName"]
  });

  const res = spawnSync(exePath, [payload], { encoding: "utf-8" });
  expect(res.status).toBe(0);

  const parsed = JSON.parse(res.stdout);
  expect(parsed.result).toBeDefined();
  expect(parsed.result.length).toBeGreaterThan(0);
  expect(parsed.result[0].Title.length).toBeGreaterThan(0);
  expect(parsed.result[0].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
});
```

- [ ] **Step 5: Run all unit and E2E tests**

Run: `bun test`
Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/index.ts package.json bin/data-faker.exe tests/e2e.test.ts
git commit -m "feat: implement CLI entrypoint and compile standalone Windows binary"
```

---

### Task 8: GitHub Actions CI/CD Release Workflow

**Files:**
- Create: `.github/workflows/release.yml`

**Interfaces:**
- GitHub Actions workflow triggering on git tag push (`v*`).
- Builds Windows binary via Bun, archives `bin/data-faker.exe`, `Images/`, `plugin.json` into release zip.

- [ ] **Step 1: Write `.github/workflows/release.yml`**

Write `.github/workflows/release.yml`:
```yaml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  build-and-release:
    runs-on: windows-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run test suite
        run: bun test

      - name: Compile standalone executable
        run: bun run build

      - name: Package Release ZIP
        shell: pwsh
        run: |
          $zipName = "Data-Faker-Flow-Launcher-$($env:GITHUB_REF_NAME).zip"
          Compress-Archive -Path bin\data-faker.exe, Images, plugin.json -DestinationPath $zipName
          echo "ZIP_NAME=$zipName" >> $env:GITHUB_ENV

      - name: Publish GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          files: ${{ env.ZIP_NAME }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Verify git status and clean working tree**

Run: `git status`
Expected: Clean working tree ready for commit.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add GitHub Actions workflow for automated Bun build and release packaging"
```

---

## Plan Self-Review Checklist

1. **Spec Coverage:**
   * Dynamic 25+ modules and Faker methods? Covered in Task 5 & 6.
   * `fake` action keyword and executable manifest? Covered in Task 1.
   * Standalone binary compilation (`data-faker.exe`)? Covered in Task 7.
   * Interactive syntax helpers on trailing space? Covered in Task 6 (`buildSyntaxHelpers`).
   * Dynamic locale switching (`vi`, `ja`, etc.)? Covered in Task 3.
   * Residue Python cleanup? Covered in Task 1.
2. **No Placeholders:** All code snippets, tests, and command lines are fully specified with zero TODOs or placeholders.
3. **Type Consistency:** Types defined in `src/types.ts` are consistently referenced across `src/parser.ts`, `src/dispatcher.ts`, `src/results.ts`, and `src/index.ts`.
