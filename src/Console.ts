import { component, strictEq } from "ivi";
import { htm } from "@ivi/tpl";
import { ConsoleMessage } from "./state.js";

export const Console = component<ConsoleMessage[]>(() => {
  return (msgs) => htm`
    div.Console
      div.ConsoleHead 'Console'
      div.ConsoleOutput
        ${msgs.map((m) => htm`div ${m.text}`)}
  `;
}, strictEq);
