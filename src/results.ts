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
