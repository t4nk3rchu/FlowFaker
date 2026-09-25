export interface ParsedOptions {
  repeat: number;
  newline: boolean;
  locale?: string;
  kwargs: Record<string, any>;
}

export interface ParsedQuery {
  moduleName?: string;
  methodName?: string;
  optionFilter?: string;
  options: ParsedOptions;
  hasTrailingSpace: boolean;
  raw: string;
}

// Splits on whitespace, keeping quoted values together (string:"hello world")
function tokenize(input: string): { tokens: string[]; openQuote: boolean } {
  const tokens: string[] = [];
  let current = "";
  let quote: string | null = null;
  for (const char of input) {
    if ((char === '"' || char === "'") && (quote === null || quote === char)) {
      quote = quote === null ? char : null;
      current += char;
    } else if (/\s/.test(char) && quote === null) {
      if (current) tokens.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current) tokens.push(current);
  return { tokens, openQuote: quote !== null };
}

export function parseQuery(rawQuery: string): ParsedQuery {
  const raw = rawQuery || "";
  const { tokens, openQuote } = tokenize(raw);
  // A space typed inside an unfinished quoted value is part of the value, not a request for helpers
  const hasTrailingSpace = raw.endsWith(" ") && !openQuote;
  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      options: { repeat: 1, newline: false, kwargs: {} },
      hasTrailingSpace,
      raw
    };
  }

  let moduleName: string | undefined;
  let methodName: string | undefined;
  let optionFilter: string | undefined;
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
      } else {
        optionFilter = token;
      }
    }
  }

  return {
    moduleName,
    methodName,
    optionFilter,
    options: { repeat, newline, locale, kwargs },
    hasTrailingSpace,
    raw
  };
}

function parseOptionValue(val: string): any {
  // Quoted values stay strings, even "123"
  const quoted = /^(["'])([\s\S]*)\1$/.exec(val);
  if (quoted) return quoted[2];
  if (/^[[{]/.test(val)) {
    try {
      return JSON.parse(val);
    } catch {
      // not JSON: falls through to a plain string
    }
  }
  if (val.toLowerCase() === "true") return true;
  if (val.toLowerCase() === "false") return false;
  const num = Number(val);
  if (!isNaN(num) && val.trim() !== "") return num;
  return val;
}
