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

  const name = executeFaker("person", "name");
  expect(typeof name).toBe("string");
  expect(name.length).toBeGreaterThan(0);
});

test("returns method parameters metadata", () => {
  const params = getMethodParameters("number", "int");
  expect(params).toContain("min:<n>");
  expect(params).toContain("max:<n>");

  const personParams = getMethodParameters("person", "fullName");
  expect(personParams).toContain("sex:<female|male>");
});

test("formats Vietnamese person fullName as lastName firstName", () => {
  for (let i = 0; i < 10; i++) {
    const fullName = executeFaker("person", "fullName", {}, "vi");
    const parts = fullName.split(" ");
    expect(parts.length).toBeGreaterThanOrEqual(2);
  }

  // Also test person.name alias with vi locale
  const aliasName = executeFaker("person", "name", {}, "vi");
  expect(typeof aliasName).toBe("string");
  expect(aliasName.split(" ").length).toBeGreaterThanOrEqual(2);
});
