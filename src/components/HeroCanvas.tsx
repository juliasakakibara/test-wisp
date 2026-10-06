"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { HeroVisual } from "@/components/HeroVisual";
import { ToppingSwitch } from "@/components/ToppingSwitch";

export type CanvasProject = {
  slug: string;
  title: string;
  label: string;
  image: string | null;
};

type NodeSpec = {
  id: string;
  /** Top-left position as a % of the canvas, so the layout scales with it. */
  x: number;
  y: number;
  label: string;
  meta?: string;
  kind: "figure" | "text" | "project" | "theme";
};

/** Starting layout after weave.figma.com: the figure in the middle, everything wired to it. */
const LAYOUT: Record<string, { x: number; y: number }> = {
  figure: { x: 39, y: 18 },
  whoami: { x: 72, y: 2 },
  theme: { x: 66, y: 74 },
  "project-0": { x: 6, y: 4 },
  "project-1": { x: 2, y: 58 },
  "project-2": { x: 78, y: 36 },
};

const HUB = "figure";
const KEY_STEP = 2;


/**
 * Hero as a node canvas: drag any card by its label bar (or focus it and use the
 * arrow keys). Wires redraw from the cards' real positions, so the layout is the
 * visitor's to play with — design and code, connected.
 */
export function HeroCanvas({ projects }: { projects: CanvasProject[] }) {
  const nodes: NodeSpec[] = [
    { id: "figure", kind: "figure", label: "3D", meta: "julia.glb", ...LAYOUT.figure },
    { id: "whoami", kind: "text", label: "Who am I", ...LAYOUT.whoami },
    { id: "theme", kind: "theme", label: "Theme", meta: "Pancake topping", ...LAYOUT.theme },
    ...projects.slice(0, 3).map((p, i) => ({
      id: `project-${i}`,
      kind: "project" as const,
      label: p.label,
      meta: p.title,
      ...LAYOUT[`project-${i}`],
    })),
  ];

  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [pos, setPos] = useState(() => Object.fromEntries(nodes.map((n) => [n.id, { x: n.x, y: n.y }])));
  const [top, setTop] = useState<string>(HUB);
  const wiresRef = useRef<SVGSVGElement>(null);

  /**
   * Wires leave the side of each card that faces the figure. They are drawn straight
   * into the SVG (not React state): they follow the DOM, so this is a DOM sync.
   */
  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    const hub = nodeRefs.current.get(HUB);
    const svg = wiresRef.current;
    if (!canvas || !hub || !svg) return;
    const c = canvas.getBoundingClientRect();
    const h = hub.getBoundingClientRect();
    const parts: string[] = [];
    for (const [id, el] of nodeRefs.current) {
      if (id === HUB) continue;
      const r = el.getBoundingClientRect();
      const left = r.left + r.width / 2 < h.left + h.width / 2;
      const from = { x: (left ? r.right : r.left) - c.left, y: r.top + Math.min(r.height / 2, 60) - c.top };
      const to = { x: (left ? h.left : h.right) - c.left, y: h.top + h.height / 2 - c.top };
      const bend = Math.max(40, Math.abs(to.x - from.x) / 2);
      const sx = left ? 1 : -1;
      const d = `M ${from.x} ${from.y} C ${from.x + bend * sx} ${from.y}, ${to.x - bend * sx} ${to.y}, ${to.x} ${to.y}`;
      parts.push(
        `<path d="${d}"/><circle cx="${from.x}" cy="${from.y}" r="3.5"/><circle cx="${to.x}" cy="${to.y}" r="3.5"/>`,
      );
    }
    svg.innerHTML = parts.join("");
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [pos, measure]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(measure);
    ro.observe(canvas);
    nodeRefs.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [measure]);

  /** Keep a card fully inside the canvas. */
  const clamp = useCallback((id: string, x: number, y: number) => {
    const canvas = canvasRef.current?.getBoundingClientRect();
    const el = nodeRefs.current.get(id)?.getBoundingClientRect();
    if (!canvas || !el) return { x, y };
    const maxX = 100 - (el.width / canvas.width) * 100;
    const maxY = 100 - (el.height / canvas.height) * 100;
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }, []);

  const onPointerDown = (id: string) => (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const canvas = canvasRef.current?.getBoundingClientRect();
    if (!canvas) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const p = pos[id];
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
    setPos((prev) => ({ ...prev, [d.id]: clamp(d.id, x, y) }));
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
    setPos((prev) => ({ ...prev, [id]: clamp(id, prev[id].x + delta[0], prev[id].y + delta[1]) }));
  };

  const body = (node: NodeSpec): ReactNode => {
    if (node.kind === "figure") return <HeroVisual />;
    if (node.kind === "theme") return <ToppingSwitch variant="node" />;
    if (node.kind === "text") {
      return (
        <div className="hero-node__text">
          <p>Freelance UX engineer. I design and build design systems, Figma tools and AI tooling.</p>
          <Link href="/about" className="link" data-text="More about me →">
            More about me →
          </Link>
        </div>
      );
    }
    const project = projects[Number(node.id.split("-")[1])];
    return (
      <Link href={`/projects/${project.slug}`} className="hero-node__project">
        <span className="hero-node__media">
          {project.image ? <Image src={project.image} alt="" fill sizes="240px" className="hero-node__image" /> : null}
        </span>
        <span className="hero-node__title">{project.title}</span>
      </Link>
    );
  };

  return (
    <div ref={canvasRef} className="hero-canvas">
      <svg ref={wiresRef} className="hero-canvas__wires" aria-hidden="true" />

      <p id="hero-canvas-help" className="visually-hidden">
        Each card can be moved: focus its label and use the arrow keys, hold Shift for bigger steps.
      </p>

      {nodes.map((node) => (
        <section
          key={node.id}
          ref={(el) => {
            if (el) nodeRefs.current.set(node.id, el);
            else nodeRefs.current.delete(node.id);
          }}
          className={`hero-node hero-node--${node.kind}`}
          style={{ left: `${pos[node.id].x}%`, top: `${pos[node.id].y}%`, zIndex: top === node.id ? 3 : 2 }}
          aria-label={node.label}
        >
          <button
            type="button"
            className="hero-node__handle"
            aria-describedby="hero-canvas-help"
            aria-label={`Move ${node.label} card`}
            onPointerDown={onPointerDown(node.id)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown(node.id)}
          >
            <span className="hero-node__label">{node.label}</span>
            {node.meta ? <span className="hero-node__meta">{node.meta}</span> : null}
          </button>
          <div className="hero-node__body">{body(node)}</div>
        </section>
      ))}
    </div>
  );
}
