import { component, useEffect, shallowEqArray, findDOMNode } from "ivi";
import { htm } from "@ivi/tpl";
import jsPrelude from "./_prelude.js?raw";

const previewHtml = (js: string, css: string, html: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview Window</title>
  <style>${css}</style>
  <script type="importmap">
  {
    "imports": {
      "ivi": "https://cdn.jsdelivr.net/npm/ivi@3.0.0-beta.2/dist/index.js",
      "ivi/template/client": "https://cdn.jsdelivr.net/npm/ivi@3.0.0-beta.2/dist/template/client.js",
      "ivi/template/parser": "https://cdn.jsdelivr.net/npm/ivi@3.0.0-beta.2/dist/template/parser.js",
      "@ivi/tpl": "https://cdn.jsdelivr.net/npm/@ivi/tpl@3.0.0-beta.2/dist/index.js",
      "@ivi/htm": "https://cdn.jsdelivr.net/npm/@ivi/htm@3.0.0-beta.2/dist/index.js",
      "@ivi/portal": "https://cdn.jsdelivr.net/npm/@ivi/portal@0.2/dist/index.js",
      "@ivi/identity": "https://cdn.jsdelivr.net/npm/@ivi/identity@0.2/dist/index.js"
    }
  }
  </script>
  <script type="module">${jsPrelude + js}</script>
</head>
<body>${html}</body>
</html>`;

const PREVIEW_ROOT = htm`
  div.Preview
    div.PreviewHead 'Preview'
    iframe.PreviewOutput
`;

export const Preview = component<[string, string, string]>((c) => {
  const update = useEffect<[string, string, string]>(c, ([js, css, html]) => {
    const iframe = findDOMNode(c)!.lastChild! as HTMLIFrameElement;
    iframe.srcdoc = previewHtml(js, css, html);
  });

  return (props) => (update(props), PREVIEW_ROOT);
}, shallowEqArray);
