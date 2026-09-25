import { expect, test } from "bun:test";
import { spawnSync } from "child_process";
import { resolve } from "path";

// Drives the built bundle like Flow Launcher JavaScript_V2: `node dist/index.js`, Content-Length framed JSON-RPC 2.0
function rpc(requests: object[]): any[] {
  const input = requests
    .map((r) => {
      const body = JSON.stringify({ jsonrpc: "2.0", ...r });
      return `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`;
    })
    .join("");
  const res = spawnSync("node", [resolve("dist", "index.js")], { input, encoding: "utf-8" });
  expect(res.status).toBe(0);
  expect(res.stderr).toBe("");

  const out: any[] = [];
  let rest = Buffer.from(res.stdout, "utf8");
  while (rest.length) {
    const headerEnd = rest.indexOf("\r\n\r\n");
    const length = Number(/Content-Length: (\d+)/.exec(rest.subarray(0, headerEnd).toString())![1]);
    out.push(JSON.parse(rest.subarray(headerEnd + 4, headerEnd + 4 + length).toString("utf8")));
    rest = rest.subarray(headerEnd + 4 + length);
  }
  return out;
}

const flowQuery = (originalQuery: string) => ({
  originalQuery,
  trimmedQuery: originalQuery.trim(),
  search: originalQuery.trim().replace(/^fake\s*/, ""),
  actionKeyword: "fake"
});

test("query without trailing space returns 5 generated values", () => {
  const [init, res] = rpc([
    { id: 1, method: "initialize", params: [{}] },
    { id: 2, method: "query", params: [flowQuery("fake person fullName"), {}] }
  ]);
  expect(init.id).toBe(1);
  expect(res.id).toBe(2);
  expect(res.result.result.length).toBe(5);
  expect(res.result.result[0].JsonRPCAction.method).toBe("Flow.Launcher.CopyToClipboard");
}, 20000);

test("query with trailing space returns only syntax helpers", () => {
  const [res] = rpc([{ id: 1, method: "query", params: [flowQuery("fake number int "), {}] }]);
  const titles = res.result.result.map((r: any) => r.Title);
  expect(titles).toContain("min:  [method]");
  expect(titles).toContain("repeat:  [global]");
  expect(res.result.result.every((r: any) => r.JsonRPCAction.method === "Flow.Launcher.ChangeQuery")).toBe(true);
}, 20000);

test("context_menu returns copy options", () => {
  const [res] = rpc([{ id: 1, method: "context_menu", params: [{ value: "John Doe" }] }]);
  expect(res.result.result.length).toBe(6);
  expect(res.result.result[0].Title).toContain("Copy current item to clipboard");
}, 20000);

test("result actions are forwarded to Flow's public API", () => {
  const out = rpc([
    { id: 1, method: "Flow.Launcher.CopyToClipboard", params: [["John Doe", false, true]] },
    { id: 2, method: "Flow.Launcher.ChangeQuery", params: ["fake person ", true] }
  ]);
  expect(out[0]).toEqual({ jsonrpc: "2.0", method: "CopyToClipboard", params: ["John Doe", false, true] });
  expect(out[1]).toEqual({ jsonrpc: "2.0", id: 1, result: { hide: true } });
  expect(out[2]).toEqual({ jsonrpc: "2.0", method: "ChangeQuery", params: ["fake person ", true] });
  expect(out[3]).toEqual({ jsonrpc: "2.0", id: 2, result: { hide: false } });
}, 20000);

test("unknown method returns a JSON-RPC error", () => {
  const [res] = rpc([{ id: 1, method: "nope", params: [] }]);
  expect(res.error.code).toBe(-32601);
}, 20000);
