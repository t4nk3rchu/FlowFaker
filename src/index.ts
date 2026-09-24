import { parseQuery } from "./parser";
import { generateResults, generateContextMenu } from "./results";
import type { FlowResult } from "./types";

// Flow Launcher JavaScript_V2: one long-lived Node process speaking JSON-RPC 2.0 over stdio,
// framed LSP-style ("Content-Length: N\r\n\r\n{json}").
// Any stderr output makes Flow Launcher throw, so silence it completely.
process.stderr.write = (() => true) as any;
console.warn = () => {};
console.error = () => {};

function send(msg: object) {
  const body = JSON.stringify({ jsonrpc: "2.0", ...msg });
  process.stdout.write(`Content-Length: ${Buffer.byteLength(body, "utf8")}\r\n\r\n${body}`);
}

// Flow's `search` is built from the trimmed query; `originalQuery` still has the trailing space
function queryText(q: { search?: string; originalQuery?: string } | undefined): string {
  const search = q?.search ?? "";
  return /\s$/.test(q?.originalQuery ?? "") ? `${search} ` : search;
}

function safeResults(build: () => FlowResult[]) {
  try {
    return { result: build() };
  } catch (err: any) {
    return {
      result: [
        { Title: "Data Faker Error", SubTitle: err?.message || "Failed to process request", IcoPath: "Images\\app.svg" }
      ]
    };
  }
}

function handle(method: string, params: any[]): any {
  switch (method) {
    case "query":
      return safeResults(() => generateResults(parseQuery(queryText(params[0]))));
    case "context_menu":
      return safeResults(() => generateContextMenu(params[0]));
  }

  // v2 sends a result's JsonRPCAction back to us; forward it to Flow's public API as a notification.
  // ponytail: Flow may wrap the action's parameter array in another array, unwrap it either way
  const args = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
  if (method === "Flow.Launcher.CopyToClipboard") {
    send({ method: "CopyToClipboard", params: args });
    return { hide: true };
  }
  if (method === "Flow.Launcher.ChangeQuery") {
    send({ method: "ChangeQuery", params: args });
    return { hide: false };
  }
  if (method === "initialize" || method === "reload_data" || method === "close") return {};
  return undefined;
}

function onMessage(msg: any) {
  // Notifications (e.g. $/cancelRequest) and responses need no reply
  if (msg?.id === undefined || !msg.method) return;
  const params = Array.isArray(msg.params) ? msg.params : msg.params === undefined ? [] : [msg.params];
  const result = handle(msg.method, params);
  if (result === undefined) {
    send({ id: msg.id, error: { code: -32601, message: `Method not found: ${msg.method}` } });
  } else {
    send({ id: msg.id, result });
  }
}

let buf = Buffer.alloc(0);
process.stdin.on("data", (chunk: Buffer) => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headerEnd = buf.indexOf("\r\n\r\n");
    if (headerEnd < 0) return;
    const length = Number(/content-length:\s*(\d+)/i.exec(buf.subarray(0, headerEnd).toString("ascii"))?.[1]);
    const bodyStart = headerEnd + 4;
    if (!Number.isFinite(length)) {
      buf = buf.subarray(bodyStart); // malformed header block, skip it
      continue;
    }
    if (buf.length < bodyStart + length) return;
    const body = buf.subarray(bodyStart, bodyStart + length).toString("utf8");
    buf = buf.subarray(bodyStart + length);
    try {
      onMessage(JSON.parse(body));
    } catch {
      // ignore unparseable messages
    }
  }
});
