import { expect, test } from "bun:test";
import { generateResults, generateContextMenu } from "../src/results";
import { parseQuery } from "../src/parser";

test("returns module suggestions when query is empty or module incomplete", () => {
  const q = parseQuery("");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(10);
  expect(res[0].AutoCompleteText).toMatch(/^fake \w+ $/);
  expect(res[0].JsonRPCAction?.method).toBe("Flow.Launcher.ChangeQuery");
});

test("returns method suggestions when module is chosen with trailing space", () => {
  const q = parseQuery("airline ");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(0);
  expect(res[0].AutoCompleteText).toMatch(/^fake airline \w+$/);
});

test("returns only 5 generated value cards when method is chosen", () => {
  const res1 = generateResults(parseQuery("number int"));
  expect(res1.length).toBe(5);
  for (const r of res1) {
    expect(r.JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
    expect(r.SubTitle).toContain("number.int");
  }
});

test("returns only syntax helpers (method + global) on trailing space after method", () => {
  const res = generateResults(parseQuery("number int "));
  expect(res.every((r) => r.JsonRPCAction?.method === "Flow.Launcher.ChangeQuery")).toBe(true);
  const titles = res.map((r) => r.Title);
  expect(titles).toContain("min:  [method]");
  expect(titles).toContain("repeat:  [global]");
  expect(titles).toContain("locale:  [global]");
});

test("returns only matching syntax helper cards when option filter is typed", () => {
  const q2 = parseQuery("person fullName s");
  const res2 = generateResults(q2);
  expect(res2.length).toBe(1);
  expect(res2[0].Title).toBe("sex:  [method]");
  expect(res2[0].JsonRPCAction?.method).toBe("Flow.Launcher.ChangeQuery");
  expect(res2[0].JsonRPCAction?.dontHideAfterAction).toBe(true);
});

test("sanitizes multiline output in Title while preserving raw in clipboard action", () => {
  const q = parseQuery("lorem lines");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThanOrEqual(5);
  expect(res[0].Title).not.toContain("\n");
  const clipboardText = res[0].JsonRPCAction?.parameters?.[0] as string;
  expect(typeof clipboardText).toBe("string");
});

test("supports Vietnamese person fullName with lang:vi in lastName firstName order", () => {
  const q = parseQuery("person fullName lang:vi");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThanOrEqual(5);
  for (let i = 0; i < 5; i++) {
    expect(res[i].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
    expect(res[i].Title.split(" ").length).toBeGreaterThanOrEqual(2);
  }
});

test("generateContextMenu returns copy and repeat actions", () => {
  const contextData = {
    module: "number",
    method: "int",
    kwargs: {},
    locale: undefined,
    value: "42"
  };
  const menu = generateContextMenu(contextData);
  expect(menu.length).toBe(6);
  expect(menu[0].Title).toBe("Copy current item to clipboard");
  expect(menu[1].Title).toBe("Copy as JSON");
  expect(menu[2].Title).toContain("Generate & Copy 5 items");
});

test("typing a parameter value lists accepted values with ghost text", () => {
  const res = generateResults(parseQuery("date birthdate mode:"));
  expect(res.map((r) => r.Title)).toEqual(["mode:age", "mode:year"]);
  expect(res[0].QuerySuggestionText).toBe("date birthdate mode:age|year");
  expect(res[1].QuerySuggestionText).toBe("date birthdate mode:year");
  expect(res[0].AutoCompleteText).toBe("fake date birthdate mode:age");

  expect(generateResults(parseQuery("date birthdate mode:y")).map((r) => r.QuerySuggestionText)).toEqual([
    "date birthdate mode:year"
  ]);
  expect(generateResults(parseQuery("number int newline:"))[0].QuerySuggestionText).toBe("number int newline:true|false");
  expect(generateResults(parseQuery("number int min:"))[0].QuerySuggestionText).toBe("number int min:<n>");
});

test("a complete parameter value generates data again", () => {
  for (const q of ["date birthdate mode:year", "number int min:5"]) {
    const res = generateResults(parseQuery(q));
    expect(res).toHaveLength(5);
    expect(res[0].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
  }
});

test("dates are rendered without JSON quotes", () => {
  const res = generateResults(parseQuery("date between from:2002-01-01 to:2002-02-01"));
  expect(res[0].Title).toMatch(/^2002-0[12]-\d\dT[\d:.]+Z$/);
});

test("method cards show the bare method name and ghost 'module method' (no dot)", () => {
  const res = generateResults(parseQuery("string "));
  expect(res[0].Title).toBe("alpha");
  expect(res[0].QuerySuggestionText).toBe("string alpha");
  expect(res.every((r) => !r.Title.includes("."))).toBe(true);
  expect(generateResults(parseQuery("string alph"))[1].QuerySuggestionText).toBe("string alphanumeric");
});
