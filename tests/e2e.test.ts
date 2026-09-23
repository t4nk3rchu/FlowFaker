import { expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { resolve } from "path";

test("compiled binary executes JSON-RPC query successfully", () => {
  const exePath = resolve("bin", "data-faker.exe");
  const payload = JSON.stringify({
    id: 1,
    method: "query",
    parameters: ["person fullName"]
  });

  const res = spawnSync(exePath, [payload], { encoding: "utf-8" });
  expect(res.status).toBe(0);

  const parsed = JSON.parse(res.stdout);
  expect(parsed.result).toBeDefined();
  expect(parsed.result.length).toBeGreaterThan(0);
  expect(parsed.result[0].Title.length).toBeGreaterThan(0);
  expect(parsed.result[0].JsonRPCAction?.method).toBe("Flow.Launcher.CopyToClipboard");
}, 20000);

test("compiled binary handles context_menu method", () => {
  const exePath = resolve("bin", "data-faker.exe");
  const payload = JSON.stringify({
    id: 2,
    method: "context_menu",
    parameters: [{ value: "John Doe", rawQuery: "person fullName" }]
  });

  const res = spawnSync(exePath, [payload], { encoding: "utf-8" });
  expect(res.status).toBe(0);

  const parsed = JSON.parse(res.stdout);
  expect(parsed.result).toBeDefined();
  expect(parsed.result.length).toBe(5);
  expect(parsed.result[0].Title).toContain("Copy current item to clipboard");
}, 20000);

test("compiled binary handles empty arguments safely", () => {
  const exePath = resolve("bin", "data-faker.exe");
  const res = spawnSync(exePath, [], { encoding: "utf-8" });
  expect(res.status).toBe(0);

  const parsed = JSON.parse(res.stdout);
  expect(parsed.result).toEqual([]);
}, 20000);

