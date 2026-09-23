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

import { METHOD_PARAM_MAP, METHOD_DESCRIPTIONS, type MethodParamInfo } from "./param-metadata";

const DEPRECATED_METHODS = new Set([
  "urlLoremFlickr"
]);

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
    .filter((key) => typeof mod[key] === "function" && !key.startsWith("_") && !DEPRECATED_METHODS.has(key))
    .sort();
}

export function getMethodParameters(moduleName: string, methodName: string): MethodParamInfo[] {
  const normModule = toCamelCase(moduleName);
  const normMethod = toCamelCase(methodName);
  const key = `${normModule}.${normMethod}`;
  return METHOD_PARAM_MAP[key] ?? [];
}

export function getMethodDescription(moduleName: string, methodName: string): string {
  const normModule = toCamelCase(moduleName);
  const normMethod = toCamelCase(methodName);
  const key = `${normModule}.${normMethod}`;
  return METHOD_DESCRIPTIONS[key] ?? `Generate ${moduleName} ${methodName} data`;
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

  // Positional and shape adapters for specialized Faker methods
  if (target.module === "lorem") {
    if (target.method === "lines") {
      if (kwargs.min !== undefined || kwargs.max !== undefined) {
        return mod.lines({ min: kwargs.min ?? 1, max: kwargs.max ?? 5 });
      }
      if (kwargs.lineCount !== undefined || kwargs.count !== undefined) {
        return mod.lines(Number(kwargs.lineCount ?? kwargs.count));
      }
    } else if (target.method === "words") {
      if (kwargs.min !== undefined || kwargs.max !== undefined) {
        return mod.words({ min: kwargs.min ?? 1, max: kwargs.max ?? 5 });
      }
      if (kwargs.wordCount !== undefined || kwargs.count !== undefined || kwargs.num !== undefined) {
        return mod.words(Number(kwargs.wordCount ?? kwargs.count ?? kwargs.num));
      }
    } else if (target.method === "sentence") {
      if (kwargs.wordCount !== undefined || kwargs.count !== undefined) {
        return mod.sentence(Number(kwargs.wordCount ?? kwargs.count));
      }
    } else if (target.method === "sentences") {
      const count = kwargs.sentenceCount ?? kwargs.count;
      return mod.sentences(count !== undefined ? Number(count) : undefined, kwargs.separator);
    } else if (target.method === "paragraph") {
      if (kwargs.sentenceCount !== undefined || kwargs.count !== undefined) {
        return mod.paragraph(Number(kwargs.sentenceCount ?? kwargs.count));
      }
    } else if (target.method === "paragraphs") {
      const count = kwargs.paragraphCount ?? kwargs.count;
      return mod.paragraphs(count !== undefined ? Number(count) : undefined, kwargs.separator);
    } else if (target.method === "slug") {
      if (kwargs.wordCount !== undefined || kwargs.count !== undefined) {
        return mod.slug(Number(kwargs.wordCount ?? kwargs.count));
      }
    }
  }

  if (target.module === "phone" && target.method === "number") {
    if (kwargs.format) {
      return mod.number(kwargs.format);
    }
  }

  const hasArgs = Object.keys(kwargs).length > 0;
  return hasArgs ? fn.call(mod, kwargs) : fn.call(mod);
}
