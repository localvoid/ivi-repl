import { createRoot, update, component, useEffect, useReducer } from "ivi";
import { htm } from "@ivi/tpl";
import { Action, ActionType, AppState, FileType } from "./state.js";
import { Editor } from "./Editor.js";
import { Preview } from "./Preview.js";
import { HSplitter, VSplitter } from "./Splitter.js";
import { Console } from "./Console.js";
import defaultJs from "./_default.js?raw";
import defaultCss from "./_default.css?raw";

const appStateReducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionType.SwitchTo:
      return {
        ...state,
        type: action.value,
      };
    case ActionType.UpdateCode:
      switch (state.type) {
        case FileType.JS:
          return {
            ...state,
            js: action.code,
            console: [],
          };
        case FileType.CSS:
          return {
            ...state,
            css: action.code,
            console: [],
          };
        case FileType.HTML:
          return {
            ...state,
            html: action.code,
            console: [],
          };
      }
    case ActionType.AddConsoleMsg:
      return {
        ...state,
        console: [...state.console, { text: action.text }],
      };
  }
};

const App = component((c) => {
  const [_state, dispatch] = useReducer<AppState, Action>(
    c,
    {
      type: FileType.JS,
      js: defaultJs,
      css: defaultCss,
      html: "",
      console: [],
    },
    appStateReducer
  );

  const onMessage = (ev: MessageEvent) => {
    const data = ev.data;
    switch (data.action) {
      case "error":
        dispatch({
          type: ActionType.AddConsoleMsg,
          text: data.value.toString(),
        });
        break;
      case "console":
        if (!data.duplicate) {
          dispatch({
            type: ActionType.AddConsoleMsg,
            text: data.args.join(" "),
          });
        }
    }
  };
  useEffect(c, () => {
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  })();

  return () => {
    const { type, js, css, html, console } = _state();
    const code = type === FileType.JS ? js : type === FileType.CSS ? css : html;

    return htm`
      div.App
        ${HSplitter([
          Editor(dispatch, type, code),
          VSplitter([Preview([js, css, html]), Console(console)]),
        ])}
    `;
  };
});

update(createRoot(document.body), App());
