import { component, invalidate, useUnmount, VAny, findDOMNode } from "ivi";
import { htm } from "@ivi/tpl";

const OVERLAY = htm`div.SplitterOverlay`;

const renderHSplitter = (
  onPointerDown: (ev: PointerEvent) => void,
  pos: number,
  dragging: boolean,
  a: VAny,
  b: VAny
) => htm`
  div.HSplitter
    div.SplitterPane ~flex-basis=${pos + "%"}       ${a}
    div.SplitterPane ~flex-basis=${100 - pos + "%"} ${b}
    div.SplitterDivider
      ~left=${`calc(${pos}% - 8px)`}
      @pointerdown=${onPointerDown}
    ${dragging ? OVERLAY : null}
`;

const renderVSplitter = (
  onPointerDown: (ev: PointerEvent) => void,
  pos: number,
  dragging: boolean,
  a: VAny,
  b: VAny
) => htm`
  div.VSplitter
    div.SplitterPane ~flex-basis=${pos + "%"}       ${a}
    div.SplitterPane ~flex-basis=${100 - pos + "%"} ${b}
    div.SplitterDivider
      ~top=${`calc(${pos}% - 8px)`}
      @pointerdown=${onPointerDown}
    ${dragging ? OVERLAY : null}
`;

const calcHPos = (rect: DOMRect, ev: PointerEvent) =>
  (100 * (ev.clientX - rect.left)) / rect.width;
const calcVPos = (rect: DOMRect, ev: PointerEvent) =>
  (100 * (ev.clientY - rect.top)) / rect.height;

const _addEventListener = addEventListener;
const _removeEventListener = removeEventListener;

const splitter = (
  calcPos: (rect: DOMRect, ev: PointerEvent) => number,
  render: (
    onPointerDown: (ev: PointerEvent) => void,
    pos: number,
    dragging: boolean,
    a: VAny,
    b: VAny
  ) => VAny
) =>
  component<[VAny, VAny]>((c) => {
    let _dragging = false;
    let _pos = 50;
    let _unmounHook = false;

    // Reuse event handler for multiple events.
    const onPointerEvent = (ev: PointerEvent) => {
      const type = ev.type;
      if (type === "pointermove") {
        const root = findDOMNode<HTMLDivElement>(c)!;
        _pos = calcPos(root.getBoundingClientRect(), ev);
      } else if (type === "pointerdown") {
        if (ev.button !== 0) {
          return;
        }
        ev.preventDefault();
        _addEventListener("pointermove", onPointerEvent);
        _addEventListener("pointerup", onPointerEvent);
        _dragging = true;

        // Lazily attach unmount hook.
        if (!_unmounHook) {
          _unmounHook = true;
          useUnmount(c, () => {
            if (_dragging) {
              _removeEventListener("pointermove", onPointerEvent);
              _removeEventListener("pointerup", onPointerEvent);
            }
          });
        }
      } else {
        // "pointerup"
        _removeEventListener("pointermove", onPointerEvent);
        _removeEventListener("pointerup", onPointerEvent);
        _dragging = false;
      }
      invalidate(c);
    };

    return ([a, b]) => render(onPointerEvent, _pos, _dragging, a, b);
  });

export const HSplitter = /*@__PURE__*/ splitter(calcHPos, renderHSplitter);
export const VSplitter = /*@__PURE__*/ splitter(calcVPos, renderVSplitter);
