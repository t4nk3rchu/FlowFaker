import { getFaker } from "./locales";
import { fakerDocs } from "./faker-docs" with { type: "macro" };
import type { MethodParamInfo } from "./faker-docs";

// Inlined at bundle time from faker's shipped docs, so it always matches the installed faker version
const DOCS = fakerDocs();

const EXCLUDED_MODULES = new Set([
  "rawDefinitions",
  "definitions",
  "faker",
  "helpers",
  "_customizer",
  "defaultRefDate"
]);

const DEPRECATED_METHODS = new Set([
  "urlLoremFlickr"
]);

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function resolveTarget(moduleName: string, methodName: string): { module: string; method: string } {
  return { module: toCamelCase(moduleName), method: toCamelCase(methodName) };
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
    .filter((key) => typeof mod[key] === "function" && !key.startsWith("_") && !DEPRECATED_METHODS.has(key))
    .sort();
}

export function getMethodParameters(moduleName: string, methodName: string): MethodParamInfo[] {
  const t = resolveTarget(moduleName, methodName);
  return DOCS.params[`${t.module}.${t.method}`] ?? [];
}

export function executeFaker(
  moduleName: string,
  methodName: string,
  kwargs: Record<string, any> = {},
  locale?: string
): any {
  const target = resolveTarget(moduleName, methodName);

  const faker = getFaker(locale);
  const mod = (faker as any)[target.module];
  if (!mod) {
    throw new Error(`Faker module '${moduleName}' not found.`);
  }

  // Handle Vietnamese name ordering (lastName + firstName)
  if (target.module === "person" && target.method === "fullName") {
    const isVi = locale && (locale.toLowerCase().startsWith("vi") || locale.toLowerCase() === "vn");
    if (isVi) {
      const sex = kwargs?.sex;
      const firstName = sex ? faker.person.firstName(sex) : faker.person.firstName();
      const lastName = sex ? faker.person.lastName(sex) : faker.person.lastName();
      return `${lastName} ${firstName}`;
    }
  }

  const fn = mod[target.method];
  if (typeof fn !== "function") {
    throw new Error(`Method '${methodName}' not found on module '${moduleName}'.`);
  }

  if (Object.keys(kwargs).length === 0) return fn.call(mod);

  // Positional-signature methods (e.g. lorem.words(wordCount), person.firstName(sex)): pass kwargs in order.
  // `min:`/`max:` fill a range for the first argument (e.g. lorem.words({ min, max })).
  const positional = DOCS.positional[`${target.module}.${target.method}`];
  if (positional) {
    const range = kwargs.min !== undefined || kwargs.max !== undefined
      ? { min: kwargs.min ?? kwargs.max, max: kwargs.max ?? kwargs.min }
      : undefined;
    return fn.apply(mod, positional.map((k, i) => kwargs[k] ?? (i === 0 ? range : undefined)));
  }
  return fn.call(mod, kwargs);
}
