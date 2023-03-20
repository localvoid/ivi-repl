import { component } from "ivi";
import { strictEq } from "ivi/equal";
import { htm } from "ivi/template";
import { ConsoleMessage } from "./state.js";

export const Console = component<ConsoleMessage[]>(() => {
  return (msgs) => htm`
    div.Console
      div.ConsoleHead 'Console'
      div.ConsoleOutput
        ${msgs.map((m) => htm`div ${m.text}`)}
  `;
}, strictEq);
