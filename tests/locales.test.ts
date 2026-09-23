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
