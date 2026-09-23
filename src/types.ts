export interface JsonRPCAction {
  method: string;
  parameters: any[];
  dontHideAfterAction?: boolean;
}

export interface FlowResult {
  Title: string;
  SubTitle?: string;
  IcoPath?: string;
  AutoCompleteText?: string;
  JsonRPCAction?: JsonRPCAction;
  ContextData?: any;
}

export interface JsonRPCRequest {
  id?: number | string;
  method: string;
  parameters: any[];
}

export interface JsonRPCResponse {
  result: FlowResult[];
}

export function formatFlowResponse(results: FlowResult[]): string {
  return JSON.stringify({ result: results });
}
