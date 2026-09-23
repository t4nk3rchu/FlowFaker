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
  expect(res[0].AutoCompleteText).toMatch(/^fake airline \w+ $/);
});

test("returns generated value and syntax helper cards when method has trailing space", () => {
  const q = parseQuery("number int ");
  const res = generateResults(q);
  expect(res.length).toBeGreaterThan(1);
  // First item is generated value
  expect(res[0].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
  // Subsequent items include syntax helpers
  const helperTitles = res.map((r) => r.Title);
  expect(helperTitles.some((t) => t.includes("repeat:"))).toBe(true);
  expect(helperTitles.some((t) => t.includes("min:"))).toBe(true);
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
  expect(menu.length).toBe(5);
  expect(menu[0].Title).toBe("Copy current item to clipboard");
  expect(menu[1].Title).toContain("Generate & Copy 5 items");
});
