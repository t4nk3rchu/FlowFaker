import { expect, test } from "bun:test";
import { parseQuery } from "../src/parser";

test("parses module and method correctly", () => {
  const q = parseQuery("person fullName");
  expect(q.moduleName).toBe("person");
  expect(q.methodName).toBe("fullName");
  expect(q.options.repeat).toBe(1);
  expect(q.options.newline).toBe(false);
  expect(q.hasTrailingSpace).toBe(false);
});

test("detects trailing space for syntax helpers", () => {
  const q1 = parseQuery("person fullName ");
  expect(q1.hasTrailingSpace).toBe(true);

  const q2 = parseQuery("airline ");
  expect(q2.hasTrailingSpace).toBe(true);
});

test("parses global and method options correctly", () => {
  const q = parseQuery("number int min:10 max:100 repeat:5 newline:true locale:vi");
  expect(q.moduleName).toBe("number");
  expect(q.methodName).toBe("int");
  expect(q.options.repeat).toBe(5);
  expect(q.options.newline).toBe(true);
  expect(q.options.locale).toBe("vi");
  expect(q.options.kwargs).toEqual({ min: 10, max: 100 });
});

test("handles invalid repeat counts gracefully", () => {
  const q = parseQuery("person fullName repeat:invalid");
  expect(q.options.repeat).toBe(1);
});
