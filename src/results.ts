import type { FlowResult } from "./types";
import type { ParsedQuery } from "./parser";
import { LOCALE_CODES } from "./locales";
import {
  executeFaker,
  getAvailableModules,
  getMethodParameters,
  getModuleMethods,
  resolveTarget
} from "./dispatcher";

const ICON_PATH = "Images\\app.svg";

const GLOBAL_OPTIONS = [
  { key: "repeat", hint: "repeat:<n>", desc: "Generate multiple items (e.g. repeat:5)" },
  { key: "newline", hint: "newline:<true|false>", desc: "Separate repeated items with newlines" },
  // `values` feeds the value cards; the 76 codes are too many for the helper subtitle
  { key: "locale", hint: "locale:<code>", desc: "Locale override (e.g. locale:vi, locale:ja)", values: LOCALE_CODES }
];

// Hints that name a type rather than listing the accepted values
const TYPE_PLACEHOLDERS = new Set(["<n>", "<date>", "<string>", "<value>"]);

// Dates render as ISO strings; JSON.stringify would wrap them in quotes
function formatValue(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return typeof v === "object" ? JSON.stringify(v) : String(v);
}

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

  const target = resolveTarget(resolvedModule, methodName);
  const methods = getModuleMethods(target.module);
  const matchedMethods = methods.filter((m) =>
    m.toLowerCase().startsWith(target.method.toLowerCase())
  );

  // Partial method name (e.g. "fake person full"): show matching method suggestions
  if (!hasTrailingSpace && matchedMethods.length > 0 && matchedMethods[0].toLowerCase() !== target.method.toLowerCase()) {
    return listMethods(target.module, target.method);
  }

  const resolvedMethod = matchedMethods[0] ?? target.method;

  // 3. Trailing space after the method, or a partial option (e.g. "fake person fullName s"):
  // Show ONLY syntax helper cards, no generated data
  if (q.optionFilter || hasTrailingSpace) {
    return buildSyntaxHelpers(target.module, resolvedMethod, q.raw, q.optionFilter);
  }

  // 4. Typing a parameter value (e.g. "fake date birthdate mode:"): show the accepted values instead
  const valueHelpers = buildValueHelpers(target.module, resolvedMethod, q.raw);
  if (valueHelpers) {
    return valueHelpers;
  }

  // 5. Method chosen, no trailing space -> Generate 5 distinct data instances
  try {
    const results: FlowResult[] = [];
    const INSTANCE_COUNT = 5;

    for (let inst = 0; inst < INSTANCE_COUNT; inst++) {
      const generatedValues: string[] = [];
      for (let i = 0; i < options.repeat; i++) {
        const val = executeFaker(target.module, resolvedMethod, options.kwargs, options.locale);
        const strVal = formatValue(val);
        generatedValues.push(strVal);
      }

      const outputText = generatedValues.join(options.newline ? "\n" : ", ");
      const displayTitle = outputText.includes("\n")
        ? outputText.replace(/\r?\n/g, " ↵ ")
        : outputText;

      results.push({
        Title: displayTitle,
        SubTitle: `${target.module}.${resolvedMethod}${options.repeat > 1 ? ` (${options.repeat} items)` : ""} | Press Enter to copy`,
        IcoPath: ICON_PATH,
        AutoCompleteText: `fake ${target.module} ${resolvedMethod}`,
        JsonRPCAction: {
          method: "Flow.Launcher.CopyToClipboard",
          parameters: [outputText, false, true]
        },
        ContextData: {
          module: target.module,
          method: resolvedMethod,
          kwargs: options.kwargs,
          locale: options.locale,
          value: outputText,
          values: generatedValues
        }
      });
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
      parameters: [`fake ${m} `, true],
      dontHideAfterAction: true
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
    let samplePreview = "";
    try {
      const v = executeFaker(moduleName, m);
      const rawStr = formatValue(v);
      const clean = rawStr.replace(/[\r\n]+/g, " ").trim();
      samplePreview = clean.length > 70 ? clean.slice(0, 67) + "..." : clean;
    } catch {
      samplePreview = "";
    }

    const subTitle = samplePreview
      ? `Sample: ${samplePreview} | Press Tab to select`
      : `Generate ${moduleName} ${m} data | Press Tab to select`;

    return {
      Title: `${moduleName}.${m}`,
      SubTitle: subTitle,
      IcoPath: ICON_PATH,
      AutoCompleteText: `fake ${moduleName} ${m}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`fake ${moduleName} ${m}`, true],
        dontHideAfterAction: true
      }
    };
  });
}

function buildSyntaxHelpers(
  moduleName: string,
  methodName: string,
  rawQuery: string,
  filter?: string
): FlowResult[] {
  const tokens = rawQuery.replace(/^fake\s+/i, "").trim().split(/\s+/);
  if (filter && tokens.length > 0 && tokens[tokens.length - 1] === filter) {
    tokens.pop();
  }
  const baseQuery = `fake ${tokens.join(" ")} `;
  const rawLower = rawQuery.toLowerCase();
  const filterLower = (filter ?? "").toLowerCase();
  const helpers: FlowResult[] = [];

  // Method-specific options first
  const methodParams = getMethodParameters(moduleName, methodName);
  for (const param of methodParams) {
    const keyWithColon = `${param.key}:`;
    if (rawLower.includes(keyWithColon.toLowerCase())) continue;
    if (filterLower && !param.key.toLowerCase().startsWith(filterLower) && !keyWithColon.toLowerCase().startsWith(filterLower)) {
      continue;
    }
    helpers.push({
      Title: `${keyWithColon}  [method]`,
      SubTitle: `${param.hint}${param.desc ? ` - ${param.desc}` : ""} | Press Tab/Enter to add`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `${baseQuery}${keyWithColon}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`${baseQuery}${keyWithColon}`, true],
        dontHideAfterAction: true
      }
    });
  }

  // Global options
  const globalOptions = GLOBAL_OPTIONS.filter(
    (opt) => !rawLower.includes(`${opt.key}:`) && (opt.key !== "locale" || !rawLower.includes("lang:"))
  );

  for (const opt of globalOptions) {
    const keyWithColon = `${opt.key}:`;
    if (filterLower && !keyWithColon.startsWith(filterLower)) continue;
    helpers.push({
      Title: `${keyWithColon}  [global]`,
      SubTitle: `${opt.hint} - ${opt.desc} | Press Tab/Enter to add`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `${baseQuery}${keyWithColon}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`${baseQuery}${keyWithColon}`, true],
        dontHideAfterAction: true
      }
    });
  }

  return helpers;
}

// Last token is `key:` or `key:partial`: list the values that key accepts. The selected card's
// QuerySuggestionText is drawn by Flow as ghost text after the cursor, e.g. "fake date birthdate mode:age|year".
function buildValueHelpers(moduleName: string, methodName: string, rawQuery: string): FlowResult[] | undefined {
  const m = /(?:^|\s)(\w+):(\S*)$/.exec(rawQuery);
  if (!m) return undefined;
  const [, key, typed] = m;

  const optKey = key === "lang" ? "locale" : key;
  const param =
    GLOBAL_OPTIONS.find((o) => o.key === optKey) ??
    getMethodParameters(moduleName, methodName).find((p) => p.key === key);
  if (!param) return undefined;

  const accepts = "values" in param && param.values
    ? `<${param.values.join("|")}>`
    : param.hint.slice(param.key.length + 1).replace("<bool>", "<true|false>");
  const desc = param.desc ? ` - ${param.desc}` : "";
  const prefix = rawQuery.slice(0, rawQuery.length - typed.length); // "date birthdate mode:"
  const changeQuery = (query: string) => ({
    method: "Flow.Launcher.ChangeQuery",
    parameters: [query, true],
    dontHideAfterAction: true
  });

  // Free-form value (<n>, <date>, ...): hint until the user starts typing, then generate
  if (TYPE_PLACEHOLDERS.has(accepts)) {
    if (typed) return undefined;
    return [
      {
        Title: `${key}:${accepts}`,
        SubTitle: `Type a value${desc}`,
        IcoPath: ICON_PATH,
        AutoCompleteText: `fake ${prefix}`,
        QuerySuggestionText: `${prefix}${accepts}`,
        JsonRPCAction: changeQuery(`fake ${prefix}`)
      }
    ];
  }

  const options = accepts.slice(1, -1).split("|");
  const typedLower = typed.toLowerCase();
  if (options.some((o) => o.toLowerCase() === typedLower)) return undefined; // complete value: generate
  const matching = options.filter((o) => o.toLowerCase().startsWith(typedLower));
  if (matching.length === 0) return undefined;

  return matching.map((o, i) => ({
    Title: `${key}:${o}`,
    SubTitle: `Accepts ${options.join(" | ")}${desc} | Press Tab/Enter to use`,
    IcoPath: ICON_PATH,
    AutoCompleteText: `fake ${prefix}${o}`,
    // The first card is selected by default, so it ghosts every match; the rest ghost their own value
    QuerySuggestionText: `${prefix}${i === 0 ? matching.join("|") : o}`,
    // Enter adds a trailing space so the next parameter helpers show up
    JsonRPCAction: changeQuery(`fake ${prefix}${o} `)
  }));
}

export function generateContextMenu(contextData: any): FlowResult[] {
  if (!contextData) return [];
  const { module, method, kwargs, locale, value } = contextData;
  const values: string[] = contextData.values ?? [value];

  const copyCard = (title: string, text: string): FlowResult => ({
    Title: title,
    SubTitle: (text.length > 80 ? `${text.slice(0, 77)}...` : text).replace(/\r?\n/g, " ↵ "),
    IcoPath: ICON_PATH,
    JsonRPCAction: {
      method: "Flow.Launcher.CopyToClipboard",
      parameters: [text, false, true]
    }
  });

  const makeRepeatAction = (count: number, newline: boolean): FlowResult => {
    let text = "";
    try {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        items.push(formatValue(executeFaker(module, method, kwargs, locale)));
      }
      text = items.join(newline ? "\n" : ", ");
    } catch {
      text = value;
    }
    return copyCard(`Generate & Copy ${count} items${newline ? " (Newlines)" : ""}`, text);
  };

  // With repeat:N the current result holds several values: offer each separator
  const separators: FlowResult[] = values.length > 1
    ? [
        copyCard("Copy space separated", values.join(" ")),
        copyCard("Copy newline separated", values.join("\n")),
        copyCard("Copy comma separated", values.join(", "))
      ]
    : [];

  return [
    copyCard("Copy current item to clipboard", value),
    ...separators,
    copyCard("Copy as JSON", JSON.stringify(values)),
    makeRepeatAction(5, false),
    makeRepeatAction(10, false),
    makeRepeatAction(5, true),
    makeRepeatAction(10, true)
  ];
}
