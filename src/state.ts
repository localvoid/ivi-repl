export const enum FileType {
  JS,
  CSS,
  HTML,
}

export interface ConsoleMessage {
  text: string;
}

export interface AppState {
  type: FileType;
  js: string;
  css: string;
  html: string;
  console: ConsoleMessage[];
}

export const enum ActionType {
  SwitchTo,
  UpdateCode,
  AddConsoleMsg,
}

export interface SwitchTo {
  type: ActionType.SwitchTo;
  value: FileType;
}

export interface UpdateCode {
  type: ActionType.UpdateCode;
  code: string;
}

export interface AddConsoleMsg {
  type: ActionType.AddConsoleMsg;
  text: string;
}

export type Action = SwitchTo | UpdateCode | AddConsoleMsg;
