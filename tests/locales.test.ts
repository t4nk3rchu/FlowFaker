import { expect, test } from "bun:test";
import { getFaker } from "../src/locales";

test("resolves default en locale when omitted or unrecognized", () => {
  const defaultFaker = getFaker();
  expect(defaultFaker).toBeDefined();

  const fallbackFaker = getFaker("invalid_locale_xyz");
  expect(fallbackFaker).toBeDefined();
});

test("resolves specific locales correctly", () => {
  for (const code of ["vi", "ja", "de", "pt-BR"]) {
    expect(getFaker(code)).not.toBe(getFaker());
  }

  const viFaker = getFaker("vi");
  expect(viFaker).toBeDefined();
  const name = viFaker.person.fullName();
  expect(typeof name).toBe("string");
  expect(name.length).toBeGreaterThan(0);
});
