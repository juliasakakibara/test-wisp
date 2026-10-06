"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Live widgets for the canvas frames (home hero and About). Words come from the
   site's own copy (lib/about.ts); playful lines are marked as placeholders. */

export type CanvasProject = {
  slug: string;
  title: string;
  label: string;
  image: string | null;
};

const ZONE = "America/Sao_Paulo"; // Porto Alegre keeps the same clock

/** Porto Alegre hour and minute, ticking; null until mounted so server and client agree. */
function useLocalTime() {
  const [time, setTime] = useState<{ h: string; m: string } | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => {
      const [h, m] = fmt.format(new Date()).split(":");
      setTime({ h, m });
    };
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function ClockWidget() {
  const time = useLocalTime();
  return (
    <div className="pg-clock" role="img" aria-label={time ? `Porto Alegre, ${time.h}:${time.m}` : "Porto Alegre time"}>
      <span>{time?.h ?? "--"}</span>
      <span>{time?.m ?? "--"}</span>
    </div>
  );
}

export function SyrupWidget() {
  return (
    <div className="pg-dark pg-syrup">
      <p className="pg-dark__row"><span>FIGMA</span><span>color/ink</span><span>#1C1C1C</span></p>
      <p className="pg-dark__row"><span>CODE</span><span>--lb-fg</span><span>#1C1C1C</span></p>
      <p className="pg-dark__status"><span className="pg-dark__dot" aria-hidden="true" /> in sync</p>
    </div>
  );
}

export function ClocheWidget() {
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

export function CoversWidget({ projects }: { projects: CanvasProject[] }) {
  return (
    <Link href="/#projects" className="pg-covers" aria-label="All projects">
      {projects.slice(0, 3).map((p, i) => (
        <span key={p.slug} className={`pg-covers__card pg-covers__card--${i}`}>
          {p.image ? <Image src={p.image} alt="" fill sizes="140px" className="pg-covers__image" /> : null}
        </span>
      ))}
    </Link>
  );
}

/* ── About ─────────────────────────────────────────────────────────────── */

/** A light card with a small heading: the base for most About widgets. */
function Note({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`pg-note${wide ? " pg-note--wide" : ""}`}>
      <p className="pg-note__title">{title}</p>
      {children}
    </div>
  );
}

/** "Night owl testing AI tools when the world gets quiet": on between 20:00 and 04:00 local. */
export function NightOwlWidget() {
  const time = useLocalTime();
  const hour = time ? Number(time.h) : null;
  const on = hour !== null && (hour >= 20 || hour < 4);
  return (
    <div className="pg-dark pg-owl">
      <p className="pg-owl__moon" aria-hidden="true">{on ? "☾" : "☼"}</p>
      <p>night owl mode: {hour === null ? "…" : on ? "on" : "off"}</p>
      <p className="pg-dark__muted">testing AI tools when the world gets quiet</p>
    </div>
  );
}

export function CatWidget() {
  return (
    <Note title="Cat person">
      <svg className="pg-cat" viewBox="0 0 64 48" aria-hidden="true">
        <path d="M10 44 V16 L18 4 L26 14 H38 L46 4 L54 16 V44 Z" />
        <circle cx="24" cy="26" r="2.5" />
        <circle cx="40" cy="26" r="2.5" />
        <path d="M29 34 Q32 37 35 34" />
      </svg>
      <p>Devoted. Non-negotiable.</p>
    </Note>
  );
}

/** "3D printer enthusiast": a looping print bar. */
export function PrinterWidget() {
  return (
    <div className="pg-dark pg-printer">
      <p>3D printer</p>
      <span className="pg-printer__bar" aria-hidden="true">
        <span />
      </span>
      <p className="pg-dark__muted">printing something nobody asked for</p>
    </div>
  );
}

/** "My brain has limited RAM — hence the lists." A list you can tick. Placeholder items. */
export function ListsWidget() {
  const items = ["make a list", "lose the list", "make a better list"];
  const [done, setDone] = useState<boolean[]>(items.map(() => false));
  return (
    <Note title="Limited RAM">
      <ul className="pg-checklist">
        {items.map((item, i) => (
          <li key={item}>
            <label>
              <input
                type="checkbox"
                checked={done[i]}
                onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </Note>
  );
}

/** "Ballet, judo, philosophy, architecture" → design and code. */
export function FieldsWidget() {
  const fields = ["ballet", "judo", "philosophy", "architecture", "design + code"];
  return (
    <Note title="Fields I bounced between" wide>
      <ol className="pg-path">
        {fields.map((f, i) => (
          <li key={f} className={i === fields.length - 1 ? "is-now" : undefined}>
            {f}
          </li>
        ))}
      </ol>
    </Note>
  );
}

/** "Ambidextrous by accident: broke my right arm three times." Swap hands. */
export function HandsWidget() {
  const [left, setLeft] = useState(false);
  return (
    <Note title="Ambidextrous by accident">
      <p>Broke my right arm three times; adaptation was mandatory.</p>
      <button type="button" className="pg-mini-btn" aria-pressed={left} onClick={() => setLeft((v) => !v)}>
        writing with: {left ? "left" : "right"}
      </button>
    </Note>
  );
}

/** "I see patterns in places that probably don't need patterns." A mirrored dot pattern, reshuffled on press. */
export function PatternsWidget() {
  const size = 7;
  // Seeded first pattern (same on server and client); random ones after a press.
  const make = (rand: () => number) => {
    const half = Array.from({ length: size }, () => Array.from({ length: Math.ceil(size / 2) }, () => rand() > 0.55));
    return half.map((row) => [...row, ...row.slice(0, Math.floor(size / 2)).reverse()]);
  };
  const [grid, setGrid] = useState<boolean[][]>(() => {
    let seed = 7;
    return make(() => ((seed = (seed * 16807) % 2147483647) / 2147483647));
  });
  return (
    <Note title="Patterns everywhere">
      <span className="pg-pattern" aria-hidden="true">
        {grid.flat().map((on, i) => (
          <span key={i} className={on ? "is-on" : undefined} />
        ))}
      </span>
      <button type="button" className="pg-mini-btn" onClick={() => setGrid(make(Math.random))}>
        find another ↻
      </button>
    </Note>
  );
}

export function AcademyWidget() {
  return (
    <Note title="Apple Developer Academy">
      <ul className="pg-chips">
        {["Auway", "Hairy", "Byte Verse"].map((app) => (
          <li key={app}>{app}</li>
        ))}
      </ul>
    </Note>
  );
}

export function ResearchWidget() {
  return (
    <Note title="Undergrad research">
      <p>Agentic accessibility.</p>
    </Note>
  );
}

export function ToolsWidget({ columns }: { columns: { title: string; text: string }[] }) {
  return (
    <Note title="What I'm building with" wide>
      <dl className="pg-tools">
        {columns.map((c) => (
          <div key={c.title}>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>
    </Note>
  );
}

export function BreakfastWidget() {
  return (
    <Note title="Lately, it looks like breakfast">
      <ul className="pg-chips">
        <li><Link href="/#projects">Pancake</Link></li>
        <li><Link href="/#projects">Syrup</Link></li>
        <li><Link href="/#projects">Cloche</Link></li>
      </ul>
    </Note>
  );
}
