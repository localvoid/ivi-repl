import { component } from "ivi";
import { createRoot, updateRoot } from "ivi/root";
import { useState } from "ivi/state";
import { htm } from "ivi/template";

const App = component((c) => {
  const [count, setCount] = useState(c, 0);

  const onClick = () => {
    setCount(count() + 1);
  };

  return () => {
    return htm`
      div.App
        button @click=${onClick} 'Click Me'
        div ${count()}
    `;
  };
});

updateRoot(createRoot(document.body), App());
