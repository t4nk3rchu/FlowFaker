import { expect, test } from "bun:test";
import { formatFlowResponse, type FlowResult } from "../src/types";

test("formatFlowResponse serializes results correctly", () => {
  const results: FlowResult[] = [
    {
      Title: "John Doe",
      SubTitle: "Click to copy",
      IcoPath: "Images\\app.svg",
      AutoCompleteText: "fake person fullName ",
      JsonRPCAction: {
        method: "Flow.Launcher.CopyToClipboard",
        parameters: ["John Doe", false, true]
      }
    }
  ];

  const output = formatFlowResponse(results);
  expect(JSON.parse(output)).toEqual({ result: results });
});
