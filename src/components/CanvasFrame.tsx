"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Point = { x: number; y: number };

export type CanvasWidget = {
  id: string;
  /** The widget's title, drawn inside its top row; it is also the drag handle. */
  label: string;
  node: ReactNode;
  /** Top-left as a % of the frame on desktop. */
  at: Point;
  /** Top-left on phones (canvas mode); omit to hide the widget there. */
  atMobile?: Point;
};

type CanvasFrameProps = {
  widgets: CanvasWidget[];
  /** Extra class for per-page sizing (e.g. "pg-frame--about"). */
  className?: string;
  /** Phones: keep the free canvas, or stack the widgets in a column. */
  mobile?: "canvas" | "stack";
  /** Centred content (headline, lead). */
  children: ReactNode;
};

const PHONE_MQ = "(max-width: 767px)";
const KEY_STEP = 2;

/**
 * Framed canvas after playground.nothing.tech: a dot-grid panel, content in the
 * middle, widgets around it. Each widget drags by its tab (or moves with the arrow
 * keys once the tab is focused). Desktop and phone positions are kept apart and
 * picked by CSS (--dx/--dy, --mx/--my), so server and client markup agree.
 */
export function CanvasFrame({ widgets, className, mobile = "canvas", children }: CanvasFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [layouts, setLayouts] = useState(() => ({
    desktop: Object.fromEntries(widgets.map((w) => [w.id, w.at])) as Record<string, Point>,
    mobile: Object.fromEntries(widgets.map((w) => [w.id, w.atMobile ?? w.at])) as Record<string, Point>,
  }));
  const [top, setTop] = useState<string | null>(null);

  const which = () => (window.matchMedia(PHONE_MQ).matches ? "mobile" : "desktop");
  const setPos = (id: string, next: Point) =>
    setLayouts((prev) => {
      const key = which();
      return { ...prev, [key]: { ...prev[key], [id]: next } };
    });

  /** Keep a widget fully inside the frame. */
  const clamp = useCallback((id: string, x: number, y: number) => {
    const frame = frameRef.current?.getBoundingClientRect();
    const el = nodeRefs.current.get(id)?.getBoundingClientRect();
    if (!frame || !el) return { x, y };
    const maxX = 100 - (el.width / frame.width) * 100;
    const maxY = 100 - (el.height / frame.height) * 100;
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }, []);

  const onPointerDown = (id: string) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const frame = frameRef.current?.getBoundingClientRect();
    if (!frame) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = layouts[which()][id];
    drag.current = {
      id,
      dx: ((event.clientX - frame.left) / frame.width) * 100 - p.x,
      dy: ((event.clientY - frame.top) / frame.height) * 100 - p.y,
    };
    setTop(id);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const frame = frameRef.current?.getBoundingClientRect();
    if (!d || !frame) return;
    const x = ((event.clientX - frame.left) / frame.width) * 100 - d.dx;
    const y = ((event.clientY - frame.top) / frame.height) * 100 - d.dy;
    setPos(d.id, clamp(d.id, x, y));
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (id: string) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const move: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = move[event.key];
    if (!delta) return;
    event.preventDefault();
    setTop(id);
    const p = layouts[which()][id];
    setPos(id, clamp(id, p.x + delta[0], p.y + delta[1]));
  };

  return (
    <div ref={frameRef} className={["pg-frame", `pg-frame--${mobile}`, className].filter(Boolean).join(" ")}>
      <div className="pg-frame__center">{children}</div>

      <p id="pg-frame-help" className="visually-hidden">
        Each widget can be moved: focus its tab and use the arrow keys, hold Shift for bigger steps.
      </p>

      {widgets.map((w) => (
        <section
          key={w.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(w.id, el);
            else nodeRefs.current.delete(w.id);
          }}
          className={`pg-widget pg-widget--${w.id}${w.atMobile || mobile === "stack" ? "" : " pg-widget--desktop-only"}`}
          style={
            {
              "--dx": `${layouts.desktop[w.id].x}%`,
              "--dy": `${layouts.desktop[w.id].y}%`,
              "--mx": `${layouts.mobile[w.id].x}%`,
              "--my": `${layouts.mobile[w.id].y}%`,
              zIndex: top === w.id ? 4 : 3,
            } as CSSProperties
          }
          aria-label={w.label}
        >
          <button
            type="button"
            className="pg-widget__handle"
            aria-describedby="pg-frame-help"
            aria-label={`Move ${w.label}`}
            onPointerDown={onPointerDown(w.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown(w.id)}
          >
            {w.label}
          </button>
          {w.node}
        </section>
      ))}
    </div>
  );
}
