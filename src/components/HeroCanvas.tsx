"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import { HeroVisual } from "@/components/HeroVisual";
import { ThemeShuffle } from "@/components/ColorSystem";

export type CanvasProject = {
  slug: string;
  title: string;
  label: string;
  image: string | null;
};

type WidgetKind = "figure" | "clock" | "syrup" | "cloche" | "covers" | "color";

type Widget = { id: WidgetKind; label: string };

/** Live widgets around the frame (layout after playground.nothing.tech); the centre stays for the headline. */
const WIDGETS: Widget[] = [
  { id: "figure", label: "3D" },
  { id: "syrup", label: "Syrup" },
  { id: "clock", label: "Porto Alegre" },
  { id: "covers", label: "Projects" },
  { id: "cloche", label: "Cloche" },
  { id: "color", label: "Theme" },
];

type Layout = Record<WidgetKind, { x: number; y: number }>;

/** Top-left position of each widget as a % of the frame, so the layout scales. */
const LAYOUT: Layout = {
  figure: { x: 5, y: 4 },
  syrup: { x: 27, y: 10 },
  clock: { x: 82, y: 6 },
  covers: { x: 5, y: 64 },
  cloche: { x: 50, y: 70 },
  color: { x: 72, y: 74 },
};

/** Phones: same idea as the reference's mobile frame — smaller widgets above, headline in the lower half. */
const MOBILE_LAYOUT: Layout = {
  figure: { x: 3, y: 2 },
  clock: { x: 64, y: 3 },
  syrup: { x: 3, y: 20 },
  covers: { x: 52, y: 18 },
  cloche: { x: 30, y: 33 },
  color: { x: 6, y: 45 },
};

const PHONE_MQ = "(max-width: 767px)";
const KEY_STEP = 2;

/** Porto Alegre time (IANA zone America/Sao_Paulo: same clock), ticking; empty until mounted so server and client agree. */
function ClockWidget() {
  const [time, setTime] = useState<{ h: string; m: string } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => {
      const [h, m] = fmt.format(new Date()).split(":");
      setTime({ h, m });
    };
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="pg-clock" role="img" aria-label={time ? `Porto Alegre, ${time.h}:${time.m}` : "Porto Alegre time"}>
      <span>{time?.h ?? "--"}</span>
      <span>{time?.m ?? "--"}</span>
    </div>
  );
}

function SyrupWidget() {
  return (
    <div className="pg-dark pg-syrup">
      <p className="pg-dark__row"><span>FIGMA</span><span>color/ink</span><span>#1C1C1C</span></p>
      <p className="pg-dark__row"><span>CODE</span><span>--lb-fg</span><span>#1C1C1C</span></p>
      <p className="pg-dark__status"><span className="pg-dark__dot" aria-hidden="true" /> in sync</p>
    </div>
  );
}

function ClocheWidget() {
  return (
    <div className="pg-dark pg-cloche">
      <p>$ git commit -m &quot;new case&quot;</p>
      <p className="pg-dark__muted">cloche: 0 client names ✓</p>
      <p>
        [main 4f2c1a] new case<span className="pg-dark__caret" aria-hidden="true" />
      </p>
    </div>
  );
}

function CoversWidget({ projects }: { projects: CanvasProject[] }) {
  return (
    <Link href="/projects" className="pg-covers" aria-label="All projects">
      {projects.slice(0, 3).map((p, i) => (
        <span key={p.slug} className={`pg-covers__card pg-covers__card--${i}`}>
          {p.image ? <Image src={p.image} alt="" fill sizes="140px" className="pg-covers__image" /> : null}
        </span>
      ))}
    </Link>
  );
}

/**
 * Hero frame (after playground.nothing.tech): a bordered panel with a dot grid,
 * the headline in the middle and live widgets around it. Each widget can be
 * dragged by its corner tab, or moved with the arrow keys once that tab is focused.
 */
export function HeroCanvas({ projects, children }: { projects: CanvasProject[]; children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const drag = useRef<{ id: WidgetKind; dx: number; dy: number } | null>(null);
  // Both layouts live in state; CSS picks one per breakpoint, so server and client markup agree.
  const [layouts, setLayouts] = useState({ desktop: LAYOUT, mobile: MOBILE_LAYOUT });
  const which = () => (window.matchMedia(PHONE_MQ).matches ? "mobile" : "desktop");
  const setPos = (id: WidgetKind, next: { x: number; y: number }) =>
    setLayouts((prev) => {
      const key = which();
      return { ...prev, [key]: { ...prev[key], [id]: next } };
    });
  const [top, setTop] = useState<WidgetKind | null>(null);

  /** Keep a widget fully inside the frame. */
  const clamp = useCallback((id: WidgetKind, x: number, y: number) => {
    const canvas = canvasRef.current?.getBoundingClientRect();
    const el = nodeRefs.current.get(id)?.getBoundingClientRect();
    if (!canvas || !el) return { x, y };
    const maxX = 100 - (el.width / canvas.width) * 100;
    const maxY = 100 - (el.height / canvas.height) * 100;
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }, []);

  const onPointerDown = (id: WidgetKind) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const canvas = canvasRef.current?.getBoundingClientRect();
    if (!canvas) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = layouts[which()][id];
    drag.current = {
      id,
      dx: ((event.clientX - canvas.left) / canvas.width) * 100 - p.x,
      dy: ((event.clientY - canvas.top) / canvas.height) * 100 - p.y,
    };
    setTop(id);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const canvas = canvasRef.current?.getBoundingClientRect();
    if (!d || !canvas) return;
    const x = ((event.clientX - canvas.left) / canvas.width) * 100 - d.dx;
    const y = ((event.clientY - canvas.top) / canvas.height) * 100 - d.dy;
    setPos(d.id, clamp(d.id, x, y));
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  const onKeyDown = (id: WidgetKind) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
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

  const body = (id: WidgetKind): ReactNode => {
    switch (id) {
      case "figure":
        return <HeroVisual />;
      case "clock":
        return <ClockWidget />;
      case "syrup":
        return <SyrupWidget />;
      case "cloche":
        return <ClocheWidget />;
      case "covers":
        return <CoversWidget projects={projects} />;
      case "color":
        return <ThemeShuffle />;
    }
  };

  return (
    <div ref={canvasRef} className="pg-frame">
      <div className="pg-frame__center">{children}</div>

      <p id="pg-frame-help" className="visually-hidden">
        Each widget can be moved: focus its tab and use the arrow keys, hold Shift for bigger steps.
      </p>

      {WIDGETS.map((w) => (
        <section
          key={w.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(w.id, el);
            else nodeRefs.current.delete(w.id);
          }}
          className={`pg-widget pg-widget--${w.id}`}
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
          {body(w.id)}
        </section>
      ))}
    </div>
  );
}
