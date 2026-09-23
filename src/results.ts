import type { FlowResult } from "./types";
import type { ParsedQuery } from "./parser";
import {
  executeFaker,
  getAvailableModules,
  getMethodParameters,
  getMethodDescription,
  getModuleMethods,
  resolveTarget
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

  // 3. User typed an uncompleted option filter (e.g. "fake person fullName s"):
  // Show ONLY matching syntax helper cards!
  if (q.optionFilter) {
    return buildSyntaxHelpers(target.module, resolvedMethod, q.raw, q.optionFilter);
  }

  // 4. Method chosen and no option filter -> Generate 5 distinct data instances followed by available parameter helpers
  try {
    const results: FlowResult[] = [];
    const INSTANCE_COUNT = 5;

    for (let inst = 0; inst < INSTANCE_COUNT; inst++) {
      const generatedValues: string[] = [];
      for (let i = 0; i < options.repeat; i++) {
        const val = executeFaker(target.module, resolvedMethod, options.kwargs, options.locale);
        const strVal = typeof val === "object" ? JSON.stringify(val) : String(val);
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
          value: outputText
        }
      });
    }

    // Append syntax helpers so the user sees all available options
    results.push(...buildSyntaxHelpers(target.module, resolvedMethod, q.raw));

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
      const rawStr = typeof v === "object" ? JSON.stringify(v) : String(v);
      const clean = rawStr.replace(/[\r\n]+/g, " ").trim();
      samplePreview = clean.length > 70 ? clean.slice(0, 67) + "..." : clean;
    } catch {
      samplePreview = "";
    }

    const description = getMethodDescription(moduleName, m);
    const subTitle = samplePreview
      ? `Sample: ${samplePreview} | Press Tab to select`
      : `${description} | Press Tab to select`;

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
      Title: keyWithColon,
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
  const globalOptions = [
    { key: "repeat:", hint: "repeat:<n>", desc: "Generate multiple items (e.g. repeat:5)" },
    { key: "newline:", hint: "newline:<true|false>", desc: "Separate repeated items with newlines" },
    { key: "locale:", hint: "locale:<code>", desc: "Locale override (e.g. locale:vi, locale:ja)" }
  ].filter((opt) => !rawLower.includes(opt.key) && (opt.key !== "locale:" || !rawLower.includes("lang:")));

  for (const opt of globalOptions) {
    if (filterLower && !opt.key.toLowerCase().startsWith(filterLower)) continue;
    helpers.push({
      Title: opt.key,
      SubTitle: `${opt.hint} - ${opt.desc} | Press Tab/Enter to add`,
      IcoPath: ICON_PATH,
      AutoCompleteText: `${baseQuery}${opt.key}`,
      JsonRPCAction: {
        method: "Flow.Launcher.ChangeQuery",
        parameters: [`${baseQuery}${opt.key}`, true],
        dontHideAfterAction: true
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
