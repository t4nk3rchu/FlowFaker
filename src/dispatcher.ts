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
  "phone.phone_number": { module: "phone", method: "number" },
  "person.name": { module: "person", method: "fullName" },
  "person.fullname": { module: "person", method: "fullName" }
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
  "string.alphanumeric": ["length:<n>"],
  "person.fullName": ["sex:<female|male>"],
  "person.firstName": ["sex:<female|male>"],
  "person.lastName": ["sex:<female|male>"],
  "person.middleName": ["sex:<female|male>"]
};

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function resolveTarget(moduleName: string, methodName: string): { module: string; method: string } {
  const aliasKey = `${moduleName}.${methodName}`.toLowerCase();
  return LEGACY_ALIASES[aliasKey] ?? {
    module: toCamelCase(moduleName),
    method: toCamelCase(methodName)
  };
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

  const hasArgs = Object.keys(kwargs).length > 0;
  return hasArgs ? fn.call(mod, kwargs) : fn.call(mod);
}
