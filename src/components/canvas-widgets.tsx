"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { applyColorModePreference, COLOR_MODE_STORAGE_KEY } from "@/lib/color-mode";
import { notifyThemeChange } from "@/lib/fun-themes";

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

/** "Night owl testing AI tools when the world gets quiet": on between 20:00 and 04:00 local, plus a light/dark switch. */
export function NightOwlWidget() {
  const time = useLocalTime();
  const hour = time ? Number(time.h) : null;
  const on = hour !== null && (hour >= 20 || hour < 4);
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const sync = () => setDark(document.documentElement.getAttribute("data-color-mode") === "dark");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-color-mode"] });
    return () => mo.disconnect();
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, next);
    } catch {
      // storage blocked: the switch still works for this visit
    }
    applyColorModePreference(next);
    notifyThemeChange();
  }

  return (
    <div className="pg-dark pg-owl">
      <p className="pg-owl__moon" aria-hidden="true">{on ? "☾" : "☼"}</p>
      <p>night owl mode: {hour === null ? "…" : on ? "on" : "off"}</p>
      <p className="pg-dark__muted">testing AI tools when the world gets quiet</p>
      <button type="button" className="pg-mini-btn pg-mini-btn--on-dark" aria-pressed={dark} onClick={toggle}>
        {dark ? "lights on ☼" : "lights off ☾"}
      </button>
    </div>
  );
}

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

/**
 * "My brain has limited RAM — hence the lists." A numbered list you edit in place:
 * click an item to rewrite it, × to drop it, type on the faint last line to add.
 * Five items max, then the RAM is full. Not saved.
 */
export function ListsWidget() {
  const MAX = 5;
  const [items, setItems] = useState(["make a list", "lose the list", "make a better list"]);
  const [draft, setDraft] = useState("");
  const full = items.length >= MAX;

  return (
    <Note title="Limited RAM List">
      <ol className="pg-ram">
        {items.map((item, i) => (
          <li key={i} className="pg-ram__item">
            <input
              className="pg-ram__text"
              aria-label={`Item ${i + 1}`}
              value={item}
              maxLength={40}
              onChange={(event) => setItems((prev) => prev.map((v, j) => (j === i ? event.target.value : v)))}
              onBlur={() => setItems((prev) => prev.filter((v) => v.trim() !== ""))}
            />
            <button
              type="button"
              className="pg-ram__remove"
              aria-label={`Remove item ${i + 1}: ${item}`}
              onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </li>
        ))}
        {full ? null : (
          <li className="pg-ram__item pg-ram__new">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const text = draft.trim();
                if (!text) return;
                setItems((prev) => [...prev, text.slice(0, 40)]);
                setDraft("");
              }}
            >
              <input
                className="pg-ram__text"
                aria-label="Add an item (press Enter)"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="add an item"
                maxLength={40}
              />
            </form>
          </li>
        )}
      </ol>
      <p className="pg-ram__count" aria-live="polite">
        {full ? "RAM full. Delete something first." : `${items.length}/${MAX}`}
      </p>
    </Note>
  );
}

/** Ballet, judo, philosophy, architecture → design and code, as a timeline. */
export function TimelineWidget() {
  const steps = ["ballet", "judo", "philosophy", "architecture", "design + code"];
  return (
    <Note title="Fields I bounced between">
      <ol className="pg-timeline">
        {steps.map((step, i) => (
          <li key={step} className={i === steps.length - 1 ? "is-now" : undefined}>
            <span>{step}</span>
            {i === steps.length - 1 ? <span className="pg-timeline__now">now</span> : null}
          </li>
        ))}
      </ol>
    </Note>
  );
}

/**
 * A tiny sketchbook: Julia's drawing on the page (public/sketchbook/julia.png,
 * optional), visitors draw on top. Nothing is saved; reload for a clean page.
 */
export function SketchbookWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [challenge, setChallenge] = useState(false);
  const [hasMine, setHasMine] = useState(true);
  const mineRef = useRef<HTMLImageElement>(null);

  // The drawing is optional: if the file isn't there (or failed before hydration), hide its slot
  useEffect(() => {
    const img = mineRef.current;
    if (!img) return;
    const check = () => {
      if (img.complete && img.naturalWidth === 0) setHasMine(false);
    };
    check();
    img.addEventListener("error", check);
    return () => img.removeEventListener("error", check);
  }, []);

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: ((event.clientX - r.left) / r.width) * canvas.width, y: ((event.clientY - r.top) / r.height) * canvas.height };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // capture is a nicety (keeps the stroke when leaving the canvas); draw anyway
    }
    drawing.current = true;
    const p = point(event);
    ctx.strokeStyle = getComputedStyle(canvas).color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };

  const stop = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Note title="I like drawing. You too?">
      <div className="pg-sketch">
        {hasMine ? (
          // eslint-disable-next-line @next/next/no-img-element -- optional local drawing, hidden if missing
          <img ref={mineRef} src="/sketchbook/julia.png" alt="A drawing by Julia" className="pg-sketch__mine" />
        ) : null}
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="pg-sketch__canvas"
          role="img"
          aria-label="Sketchbook: draw with a mouse, finger or pen"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={stop}
          onPointerCancel={stop}
        />
      </div>
      {challenge ? <p aria-live="polite">Challenge: draw with your other hand. I broke my right arm three times; it works.</p> : null}
      <div className="pg-sketch__actions">
        <button type="button" className="pg-mini-btn" aria-pressed={challenge} onClick={() => setChallenge((v) => !v)}>
          other-hand challenge
        </button>
        <button type="button" className="pg-mini-btn" onClick={clear}>
          clear
        </button>
      </div>
    </Note>
  );
}

/** Riddles from riddles-api.vercel.app for now (to be swapped for a curated local list). */
type Riddle = { riddle: string; answer: string };

/** Skip riddles with dark themes until the list is curated. */
const UNSUITABLE = /\b(dead|death|die[sd]?|dying|kill\w*|murder\w*|blood\w*|coffin|corpse|grave|gun|knife|stab\w*|shot|suicide|poison\w*|drown\w*|hang\w*|bomb|war|weapon|prison|police)\b/i;

async function fetchRiddle(): Promise<Riddle> {
  for (let tries = 0; tries < 8; tries++) {
    const res = await fetch("https://riddles-api.vercel.app/random", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const r = (await res.json()) as Riddle;
    if (r?.riddle && r?.answer && !UNSUITABLE.test(`${r.riddle} ${r.answer}`)) return r;
  }
  throw new Error("no suitable riddle");
}

/** One riddle, three answers (the other two come from other riddles). Result announced to screen readers. */
export function QuizWidget() {
  const [round, setRound] = useState<{ riddle: string; answer: string; options: string[] } | "loading" | "error">("loading");
  const [picked, setPicked] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchRiddle(), fetchRiddle(), fetchRiddle()])
      .then(([main, a, b]) => {
        if (cancelled) return;
        const options = [main.answer, a.answer, b.answer].sort(() => Math.random() - 0.5);
        setRound({ riddle: main.riddle, answer: main.answer, options });
        setPicked(null);
      })
      .catch(() => {
        if (!cancelled) setRound("error");
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const next = () => {
    setRound("loading");
    setNonce((n) => n + 1);
  };

  return (
    <Note title="Riddle me this" wide>
      {round === "loading" ? <p>Thinking of one…</p> : null}
      {round === "error" ? (
        <>
          <p>The riddles are napping.</p>
          <button type="button" className="pg-mini-btn" onClick={next}>
            try again
          </button>
        </>
      ) : null}
      {typeof round === "object" ? (
        <>
          <p className="pg-quiz__q">{round.riddle}</p>
          <div className="pg-quiz__options" role="group" aria-label="Answers">
            {round.options.map((option) => (
              <button
                key={option}
                type="button"
                className={`pg-quiz__option${picked && option === round.answer ? " is-right" : ""}${picked === option && option !== round.answer ? " is-wrong" : ""}`}
                disabled={picked !== null}
                onClick={() => setPicked(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="pg-quiz__result" aria-live="polite">
            {picked === null ? "" : picked === round.answer ? "Correct ✓" : `Not quite. It's “${round.answer}”.`}
          </p>
          {picked !== null ? (
            <button type="button" className="pg-mini-btn" onClick={next}>
              next riddle →
            </button>
          ) : null}
        </>
      ) : null}
    </Note>
  );
}

/** Pomodoro (25 / 5) with seconds. Ends with a visual signal; a soft beep only if sound is switched on (muted by default). */
export function PomodoroWidget() {
  const LENGTH = { focus: 25 * 60, break: 5 * 60 } as const;
  const [mode, setMode] = useState<keyof typeof LENGTH>("focus");
  const [left, setLeft] = useState<number>(LENGTH.focus);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(false);
  const [done, setDone] = useState(false);
  const endAt = useRef(0);
  const soundRef = useRef(sound);
  useEffect(() => {
    soundRef.current = sound;
  }, [sound]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        setRunning(false);
        setDone(true);
        buzz();
        if (soundRef.current) beep();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = () => {
    endAt.current = Date.now() + left * 1000;
    setDone(false);
    setRunning(true);
  };

  const reset = (next = mode) => {
    setRunning(false);
    setDone(false);
    setMode(next);
    setLeft(LENGTH[next]);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className={`pg-dark pg-pomo${done ? " is-done" : ""}`}>
      <div className="pg-pomo__row">
        <div className="pg-pomo__modes" role="group" aria-label="Timer">
          {(["focus", "break"] as const).map((m) => (
            <button key={m} type="button" className="pg-pomo__mode" aria-pressed={mode === m} onClick={() => reset(m)}>
              {m} {LENGTH[m] / 60}
            </button>
          ))}
        </div>
        <button type="button" className="pg-pomo__mode" aria-pressed={sound} onClick={() => setSound((v) => !v)}>
          sound {sound ? "on" : "off"}
        </button>
      </div>
      <p className="pg-pomo__time" role="timer" aria-label={`${mode} timer, ${mm} minutes ${ss} seconds left`}>
        {mm}:{ss}
      </p>
      <div className="pg-pomo__controls">
        <button
          type="button"
          className="pg-mini-btn pg-mini-btn--on-dark"
          onClick={() => {
            tap();
            if (running) setRunning(false);
            else start();
          }}
        >
          {running ? "pause" : left === 0 ? "again" : "start"}
        </button>
        <button
          type="button"
          className="pg-mini-btn pg-mini-btn--on-dark"
          onClick={() => {
            tap();
            reset();
          }}
        >
          reset
        </button>
      </div>
      <p className="pg-dark__muted" aria-live="assertive">
        {done ? (mode === "focus" ? "Time for a break." : "Back to it.") : "\u00a0"}
      </p>
    </div>
  );
}

/** Haptics where the browser offers them (Android Chrome; iOS Safari has no Vibration API). */
function tap() {
  navigator.vibrate?.(10);
}

function buzz() {
  navigator.vibrate?.([200, 100, 200]);
}

/** A short, soft two-note beep (Web Audio); only ever called after the visitor switched sound on. */
function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.25].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = i ? 880 : 660;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.22);
    });
  } catch {
    // no audio available: the visual signal still shows
  }
}

/* ── whoami terminal (About) ───────────────────────────────────────────── */

type Line = { kind: "in" | "out"; text: string };

const COMMANDS: Record<string, string[]> = {
  whoami: ["julia sakakibara — freelance ux engineer"],
  pwd: ["/porto-alegre/brazil"],
  "cat focus.txt": ["design systems · ai tooling"],
  ls: ["pancake/  syrup/  cloche/  playground/"],
  contact: ["talk.to@juliasakakibara.com.br"],
  help: ["whoami · pwd · cat focus.txt · ls · contact · clear"],
};

const BOOT: Line[] = [
  { kind: "in", text: "whoami" },
  { kind: "out", text: COMMANDS.whoami[0] },
  { kind: "in", text: "cat focus.txt" },
  { kind: "out", text: COMMANDS["cat focus.txt"][0] },
];

/** About ≈ `whoami`: a tiny terminal that answers a few commands (type "help"). */
export function TerminalWidget() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Fixed-height log: keep the newest line in view
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [lines]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const out = COMMANDS[cmd] ?? [`command not found: ${cmd} — try "help"`];
    // keep the last few lines so the widget stays small
    setLines((prev) => [...prev, { kind: "in" as const, text: raw.trim() }, ...out.map((text) => ({ kind: "out" as const, text }))].slice(-8));
  }

  return (
    <div className="pg-dark pg-term">
      <div ref={logRef} className="pg-term__log" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={l.kind === "out" ? "pg-dark__muted" : undefined}>
            {l.kind === "in" ? `$ ${l.text}` : l.text}
          </p>
        ))}
      </div>
      <form
        className="pg-term__prompt"
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <label htmlFor="pg-term-input" aria-hidden="true">$</label>
        <input
          id="pg-term-input"
          aria-label="Terminal command (try whoami or help)"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="help"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
