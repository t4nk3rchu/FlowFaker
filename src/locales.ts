import { allFakers, fakerEN, type Faker } from "@faker-js/faker";

// Every Faker locale except the data-less `base`
export const LOCALE_CODES = Object.keys(allFakers).filter((k) => k !== "base");

const BY_KEY = new Map(LOCALE_CODES.map((k) => [k.toLowerCase(), (allFakers as Record<string, Faker>)[k]]));

// Case-insensitive, accepts "-" or "_" ("pt-BR", "pt_br"); a region Faker lacks falls back to the language ("vi_VN" -> "vi")
export function getFaker(localeCode?: string): Faker {
  if (!localeCode) return fakerEN;
  const key = localeCode.toLowerCase().replace(/-/g, "_");
  return BY_KEY.get(key) ?? BY_KEY.get(key.split("_")[0]) ?? fakerEN;
}
