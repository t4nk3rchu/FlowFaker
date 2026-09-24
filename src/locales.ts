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

export const LOCALE_CODES = Object.keys(LOCALE_INSTANCES);

export function getFaker(localeCode?: string): Faker {
  if (!localeCode) return fakerEN;
  return LOCALE_INSTANCES[localeCode.toLowerCase().replace("-", "_")] ?? fakerEN;
}
