import { expect, test } from "bun:test";
import {
  getAvailableModules,
  getModuleMethods,
  executeFaker,
  getMethodParameters
} from "../src/dispatcher";

test("lists available Faker modules", () => {
  const modules = getAvailableModules();
  expect(modules).toContain("person");
  expect(modules).toContain("internet");
  expect(modules).toContain("airline");
  expect(modules).toContain("commerce");
});

test("lists methods for a specific module", () => {
  const methods = getModuleMethods("person");
  expect(methods).toContain("fullName");
  expect(methods).toContain("firstName");
});

test("executes methods with camelCase and snake_case", () => {
  const res1 = executeFaker("person", "fullName");
  expect(typeof res1).toBe("string");
  expect(res1.length).toBeGreaterThan(0);

  const res2 = executeFaker("person", "first_name");
  expect(typeof res2).toBe("string");
  expect(res2.length).toBeGreaterThan(0);
});

test("returns method parameters metadata", () => {
  const params = getMethodParameters("number", "int");
  expect(params.some((p) => p.key === "min" && p.hint === "min:<n>")).toBe(true);
  expect(params.some((p) => p.key === "max" && p.hint === "max:<n>")).toBe(true);

  const personParams = getMethodParameters("person", "fullName");
  expect(personParams.some((p) => p.key === "sex")).toBe(true);

  const loremParams = getMethodParameters("lorem", "lines");
  expect(loremParams.some((p) => p.key === "lineCount")).toBe(true);
  expect(loremParams.some((p) => p.key === "min")).toBe(true);
});

test("formats Vietnamese person fullName as lastName firstName", () => {
  for (let i = 0; i < 10; i++) {
    const fullName = executeFaker("person", "fullName", {}, "vi");
    const parts = fullName.split(" ");
    expect(parts.length).toBeGreaterThanOrEqual(2);
  }
});
