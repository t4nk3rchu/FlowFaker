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
  // Ghost text Flow draws after the cursor when this result is selected (action keyword is prepended by Flow)
  QuerySuggestionText?: string;
  JsonRPCAction?: JsonRPCAction;
  ContextData?: any;
}
