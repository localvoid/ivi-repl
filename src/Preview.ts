import { component, useEffect } from "ivi";
import { htm } from "ivi/template";
import { shallowEqArray } from "ivi/equal";
import { findDOMNode } from "ivi/dom";
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
      "ivi": "https://cdn.jsdelivr.net/npm/ivi@2/dist/index.js",
      "ivi/template": "https://cdn.jsdelivr.net/npm/ivi@2/dist/template.js",
      "ivi/state": "https://cdn.jsdelivr.net/npm/ivi@2/dist/state.js",
      "ivi/dom": "https://cdn.jsdelivr.net/npm/ivi@2/dist/dom.js",
      "ivi/root": "https://cdn.jsdelivr.net/npm/ivi@2/dist/root.js",
      "ivi/equal": "https://cdn.jsdelivr.net/npm/ivi@2/dist/equal.js",
      "@ivi/template-compiler": "https://cdn.jsdelivr.net/npm/@ivi/template-compiler@2/dist/index.js",
      "@ivi/portal": "https://cdn.jsdelivr.net/npm/@ivi/portal@0.1/dist/index.js",
      "@ivi/identity": "https://cdn.jsdelivr.net/npm/@ivi/identity@0.1/dist/index.js"
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
