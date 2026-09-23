import { parseQuery } from "./parser";
import { generateResults, generateContextMenu } from "./results";
import { formatFlowResponse, type FlowResult, type JsonRPCRequest } from "./types";

function main() {
  const rawArg = process.argv[2];
  if (!rawArg) {
    console.log(formatFlowResponse([]));
    return;
  }

  try {
    const req: JsonRPCRequest = JSON.parse(rawArg);
    const method = req.method;
    const params = req.parameters || [];

    if (method === "query") {
      const queryString = (params[0] ?? "").toString();
      const parsed = parseQuery(queryString);
      const results = generateResults(parsed);
      console.log(formatFlowResponse(results));
      return;
    }

    if (method === "context_menu") {
      const contextData = params[0];
      const results = generateContextMenu(contextData);
      console.log(formatFlowResponse(results));
      return;
    }

    if (method === "copy_to_clipboard") {
      // Direct fallback if invoked explicitly
      console.log(formatFlowResponse([]));
      return;
    }

    console.log(formatFlowResponse([]));
  } catch (err: any) {
    const errorCard: FlowResult = {
      Title: "Data Faker Error",
      SubTitle: err?.message || "Failed to process request",
      IcoPath: "Images\\app.svg"
    };
    console.log(formatFlowResponse([errorCard]));
  }
}

main();
