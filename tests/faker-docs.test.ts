import { expect, test } from "bun:test";
import { fakerDocs } from "../src/faker-docs";
import { executeFaker, getAvailableModules, getModuleMethods, getMethodParameters } from "../src/dispatcher";
import { generateResults } from "../src/results";
import { parseQuery } from "../src/parser";

// Guards the .d.ts reader against faker upgrades changing the file layout
test("every exposed method is found in faker's docs", () => {
  const { params } = fakerDocs();
  const missing = getAvailableModules().flatMap((m) => getModuleMethods(m).map((fn) => `${m}.${fn}`)).filter((k) => !params[k]);
  expect(missing).toEqual([]);
});

test("reads option names, types and descriptions", () => {
  const int = getMethodParameters("number", "int");
  expect(int.map((p) => p.key)).toEqual(["min", "max", "multipleOf", "distributor"]);
  expect(int[0].hint).toBe("min:<n>");
  expect(int[0].desc).toContain("Lower bound");
  expect(getMethodParameters("date", "birthdate").find((p) => p.key === "mode")?.hint).toBe("mode:<age|year>");
  expect(getMethodParameters("person", "firstName")[0].hint).toBe("sex:<female|generic|male>");
});

test("detects positional-signature methods", () => {
  const { positional } = fakerDocs();
  expect(positional["person.firstName"]).toEqual(["sex"]);
  expect(positional["lorem.sentences"]).toEqual(["sentenceCount", "separator"]);
  expect(positional["number.int"]).toBeUndefined(); // takes an options object
});

test("positional-signature methods receive their key:value options", () => {
  for (let i = 0; i < 20; i++) {
    expect(executeFaker("string", "nanoid", { length: 7 })).toHaveLength(7);
    expect(executeFaker("string", "fromCharacters", { characters: "ab", length: 5 })).toMatch(/^[ab]{5}$/);
    expect(executeFaker("lorem", "words", { wordCount: 3 }).split(" ")).toHaveLength(3);
    const n = executeFaker("lorem", "words", { min: 2, max: 4 }).split(" ").length;
    expect(n).toBeGreaterThanOrEqual(2);
    expect(n).toBeLessThanOrEqual(4);
  }
  expect(executeFaker("system", "commonFileName", { extension: "txt" })).toEndWith(".txt");
});

test("syntax helpers are tagged as method or global parameters", () => {
  const titles = generateResults(parseQuery("number int ")).map((r) => r.Title);
  expect(titles).toContain("min:  [method]");
  expect(titles).toContain("repeat:  [global]");
});
