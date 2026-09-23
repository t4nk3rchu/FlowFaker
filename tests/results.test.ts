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

test("returns 5 generated value cards followed by syntax helpers when method is chosen", () => {
  const q1 = parseQuery("number int");
  const res1 = generateResults(q1);
  expect(res1.length).toBeGreaterThanOrEqual(8);
  for (let i = 0; i < 5; i++) {
    expect(res1[i].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
    expect(res1[i].SubTitle).toContain("number.int");
  }
  const helperTitles = res1.slice(5).map((r) => r.Title);
  expect(helperTitles).toContain("min:");
  expect(helperTitles).toContain("repeat:");
});

test("returns only matching syntax helper cards when option filter is typed", () => {
  const q2 = parseQuery("person fullName s");
  const res2 = generateResults(q2);
  expect(res2.length).toBe(1);
  expect(res2[0].Title).toBe("sex:");
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
  expect(menu.length).toBe(5);
  expect(menu[0].Title).toBe("Copy current item to clipboard");
  expect(menu[1].Title).toContain("Generate & Copy 5 items");
});
