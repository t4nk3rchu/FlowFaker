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

test("handles legacy aliases", () => {
  const num = executeFaker("random", "number");
  expect(typeof num).toBe("number");
});

test("returns method parameters metadata", () => {
  const params = getMethodParameters("number", "int");
  expect(params).toContain("min:<n>");
  expect(params).toContain("max:<n>");
});
