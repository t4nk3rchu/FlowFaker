import { expect, test } from "bun:test";
import { getFaker, LOCALE_CODES } from "../src/locales";
import { parseQuery } from "../src/parser";
import { executeFaker } from "../src/dispatcher";
import { generateContextMenu } from "../src/results";

// Features FlowFaker v1 users already had; these must survive the engine swap

test("all Faker locales, case- and separator-insensitive", () => {
  expect(LOCALE_CODES.length).toBeGreaterThan(70);
  expect(LOCALE_CODES).toContain("sk");
  expect(LOCALE_CODES).not.toContain("base");
  expect(getFaker("de_AT")).not.toBe(getFaker("de"));
  expect(getFaker("pt-br")).toBe(getFaker("pt_BR"));
  expect(getFaker("vi_VN")).toBe(getFaker("vi")); // region Faker lacks -> language
  expect(getFaker("nope")).toBe(getFaker());
});

test("quoted and JSON parameter values", () => {
  expect(parseQuery('string fromCharacters characters:"a b" length:3').options.kwargs).toEqual({ characters: "a b", length: 3 });
  expect(parseQuery("string x id:'123'").options.kwargs.id).toBe("123");
  expect(parseQuery('helpers x data:{"a":1,"b":[2]}').options.kwargs.data).toEqual({ a: 1, b: [2] });
  expect(parseQuery("helpers x list:[1,2]").options.kwargs.list).toEqual([1, 2]);
  expect(parseQuery("x y bad:{nope").options.kwargs.bad).toBe("{nope");
  // A space inside an unfinished quote is part of the value, not a request for helpers
  expect(parseQuery('string fromCharacters characters:"a ').hasTrailingSpace).toBe(false);
});

test("nameOrder puts the family name first or last", () => {
  const names = { firstName: "Ann", lastName: "Lee" };
  expect(executeFaker("person", "fullName", { ...names, nameOrder: "last-first" })).toBe("Lee Ann");
  expect(executeFaker("person", "fullName", { ...names, order: "lf" })).toBe("Lee Ann");
  expect(executeFaker("person", "fullName", names, "vi")).toBe("Lee Ann");
  const western = executeFaker("person", "fullName", { ...names, nameOrder: "first-last" }, "vi");
  expect(western.indexOf("Ann")).toBeLessThan(western.indexOf("Lee"));
});

test("context menu copies repeated values space/newline/comma separated or as JSON", () => {
  const menu = generateContextMenu({ module: "string", method: "uuid", kwargs: {}, value: "a, b", values: ["a", "b"] });
  const text = (title: string) => menu.find((r) => r.Title === title)?.JsonRPCAction?.parameters[0];
  expect(text("Copy space separated")).toBe("a b");
  expect(text("Copy newline separated")).toBe("a\nb");
  expect(text("Copy comma separated")).toBe("a, b");
  expect(text("Copy as JSON")).toBe('["a","b"]');
});
