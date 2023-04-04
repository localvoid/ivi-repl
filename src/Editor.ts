import { component, useEffect, type Dispatch, findDOMNode } from "ivi";
import { htm } from "@ivi/tpl";
import { EditorView, basicSetup } from "codemirror";
import { ViewUpdate } from "@codemirror/view";
import { javascript as jsExt } from "@codemirror/lang-javascript";
import { html as htmlExt } from "@codemirror/lang-html";
import { css as cssExt } from "@codemirror/lang-css";
import { Action, ActionType, FileType } from "./state.js";

interface CodeEditorProps {
  dispatch(action: Action): void;
  type: FileType;
  code: string;
}

const codeEditorExtension = (type: FileType) => {
  switch (type) {
    case FileType.JS:
      return jsExt();
    case FileType.CSS:
      return cssExt();
    case FileType.HTML:
      return htmlExt();
  }
};

const CODE_EDITOR_ROOT = htm`div.CodeEditor`;
export const CodeEditor = component<CodeEditorProps>((c) => {
  let _dispatch: Dispatch<Action>;
  let _editor: EditorView;
  const editor = useEffect<[FileType, string]>(
    c,
    ([type, doc]) => {
      _editor = new EditorView({
        doc,
        extensions: [
          basicSetup,
          codeEditorExtension(type),
          EditorView.updateListener.of((viewUpdate: ViewUpdate) => {
            if (viewUpdate.docChanged) {
              _dispatch({
                type: ActionType.UpdateCode,
                code: viewUpdate.state.doc.toString(),
              });
            }
          }),
        ],
        parent: findDOMNode<HTMLDivElement>(c)!,
      });

      return () => {
        _editor.destroy();
      };
    },
    (a, b) => a[0] === b[0]
  );

  return (props) => (
    (_dispatch = props.dispatch),
    editor([props.type, props.code]),
    CODE_EDITOR_ROOT
  );
});

const navBtnName = (type: FileType) => {
  switch (type) {
    case FileType.JS:
      return "JS";
    case FileType.CSS:
      return "CSS";
    case FileType.HTML:
      return "HTML";
  }
};

const navBtnCls = (selected: boolean) => (selected ? "selected" : "");

interface NavButtonProps {
  type: FileType;
  selected: boolean;
  dispatch: Dispatch<Action>;
}

const NavButton = component<NavButtonProps>(() => {
  let _props: NavButtonProps;
  const onClick = (ev: MouseEvent) => {
    ev.preventDefault();
    _props.dispatch({
      type: ActionType.SwitchTo,
      value: _props.type,
    });
  };
  return (props) => (
    (_props = props),
    htm`
      a${navBtnCls(props.selected)}
        :href='#'
        @click=${onClick}
        =${navBtnName(props.type)}
    `
  );
});

const FILE_BUTTONS = [FileType.JS, FileType.CSS, FileType.HTML];

export const Editor = (
  dispatch: Dispatch<Action>,
  type: FileType,
  code: string
) => {
  const buttons = FILE_BUTTONS.map((t) =>
    NavButton({
      type: t,
      selected: t === type,
      dispatch,
    })
  );
  return htm`
    div.Editor
      nav.EditorHead ${buttons}
      ${CodeEditor({ dispatch, type, code })}`;
};
