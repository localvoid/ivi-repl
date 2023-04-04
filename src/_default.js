import { createRoot, update, component, useState } from "ivi";
import { htm } from "@ivi/htm";

const App = component((c) => {
  const [count, setCount] = useState(c, 0);

  const onClick = () => {
    setCount(count() + 1);
  };

  return () => {
    return htm`
      <div class="App">
        <button @click=${onClick}>Click Me</button>
        <div>${count()}</div>
      </div>
    `;
  };
});

update(createRoot(document.body), App());
