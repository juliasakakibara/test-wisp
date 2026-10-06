"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

/**
 * Night owl: a day/night switch that only re-colours this widget, and what Julia
 * is into at that hour. Starts from Porto Alegre time (night 20:00–04:00).
 */
const OWL = {
  day: { line: "By day I'm into", topics: ["design systems", "tokens", "UI", "interactions"] },
  night: { line: "After dark I'm making", topics: ["IoT", "3D prints", "AR/VR", "AI tools"] },
} as const;

export function NightOwlWidget() {
  const time = useLocalTime();
  const hour = time ? Number(time.h) : null;
  const nightNow = hour !== null && (hour >= 20 || hour < 4);
  const [choice, setChoice] = useState<boolean | null>(null);
  const night = choice ?? nightNow;
  const view = night ? OWL.night : OWL.day;
  const last = view.topics.length - 1;

  return (
    <div className={`pg-owl ${night ? "pg-dark pg-owl--night" : "pg-note pg-owl--day"}`}>
      <button
        type="button"
        role="switch"
        aria-checked={night}
        aria-label="Night mode"
        className="pg-switch"
        onClick={() => setChoice(!night)}
      >
        <span className="pg-switch__thumb" aria-hidden="true">{night ? "☾" : "☼"}</span>
      </button>
      <p className="pg-owl__line" aria-live="polite">
        {view.line}{" "}
        {view.topics.map((t, i) => (
          <span key={t}>
            <span className="pg-owl__tag">{t}</span>
            {i < last - 1 ? ", " : i === last - 1 ? " and " : "."}
          </span>
        ))}
      </p>
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

/** Riddles from riddles-api.vercel.app for now (to be swapped for a curated local list). */
type Riddle = { riddle: string; answer: string };

/** Skip riddles with dark themes until the list is curated. */
const UNSUITABLE = /\b(dead|death|die[sd]?|dying|kill\w*|murder\w*|blood\w*|coffin|corpse|grave|gun|knife|stab\w*|shot|suicide|poison\w*|drown\w*|hang\w*|bomb|war|weapon|prison|police)\b/i;

/** About three lines in the widget (≈45 characters a line). */
const MAX_RIDDLE_CHARS = 130;

async function fetchRiddle(): Promise<Riddle> {
  for (let tries = 0; tries < 12; tries++) {
    const res = await fetch("https://riddles-api.vercel.app/random", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const r = (await res.json()) as Riddle;
    if (r?.riddle && r?.answer && r.riddle.length <= MAX_RIDDLE_CHARS && !UNSUITABLE.test(`${r.riddle} ${r.answer}`)) return r;
  }
  throw new Error("no suitable riddle");
}

/** Lower-case, no punctuation, no leading article. */
const normalise = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/^\s*(it s|it is|its|they re|they are|i am|i m)\b/, " ")
    .replace(/\b(a|an|the|your|my)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** "A mirror, or a pool of water" → ["mirror", "pool of water"]. */
const acceptedAnswers = (answer: string) =>
  answer
    .split(/,|\bor\b|\//i)
    .map(normalise)
    .filter(Boolean);

function isRight(guess: string, answer: string) {
  const g = normalise(guess);
  if (!g) return false;
  return acceptedAnswers(answer).some((a) => a === g || (g.length >= 3 && (a.includes(g) || g.includes(a))));
}

/** One hint: first letter and length of the shortest accepted answer (API answers can be wordy). */
function hintFor(answer: string) {
  const main = [...acceptedAnswers(answer)].sort((a, b) => a.length - b.length)[0] ?? normalise(answer);
  const words = main.split(" ").length;
  return `Starts with “${main[0]?.toUpperCase()}”, ${main.replace(/ /g, "").length} letters${words > 1 ? ` in ${words} words` : ""}.`;
}

/** A riddle with an open answer and one hint. Results are announced to screen readers. */
export function QuizWidget() {
  const [riddle, setRiddle] = useState<Riddle | "loading" | "error">("loading");
  const [guess, setGuess] = useState("");
  const [state, setState] = useState<"open" | "right" | "wrong" | "shown">("open");
  const [hint, setHint] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchRiddle()
      .then((r) => {
        if (cancelled) return;
        setRiddle(r);
        setGuess("");
        setState("open");
        setHint(false);
      })
      .catch(() => {
        if (!cancelled) setRiddle("error");
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const next = () => {
    setRiddle("loading");
    setNonce((n) => n + 1);
  };

  const finished = state === "right" || state === "shown";

  return (
    <Note title="Riddle me this" wide>
      {riddle === "loading" ? <p>Thinking of one…</p> : null}
      {riddle === "error" ? (
        <>
          <p>The riddles are napping.</p>
          <button type="button" className="pg-mini-btn" onClick={next}>
            try again
          </button>
        </>
      ) : null}
      {typeof riddle === "object" ? (
        <>
          <p className="pg-quiz__q">{riddle.riddle}</p>
          {hint && !finished ? <p className="pg-quiz__hint">{hintFor(riddle.answer)}</p> : null}
          {finished ? null : (
            <form
              className="pg-quiz__form"
              onSubmit={(event) => {
                event.preventDefault();
                if (guess.trim()) setState(isRight(guess, riddle.answer) ? "right" : "wrong");
              }}
            >
              <input
                aria-label="Your answer"
                value={guess}
                onChange={(event) => {
                  setGuess(event.target.value);
                  if (state === "wrong") setState("open");
                }}
                placeholder="your answer"
                autoComplete="off"
              />
              <button type="submit" className="pg-mini-btn" disabled={!guess.trim()}>
                guess
              </button>
            </form>
          )}
          <p className="pg-quiz__result" aria-live="polite">
            {state === "right" ? `Correct ✓ ${riddle.answer}.` : null}
            {state === "wrong" ? "Not quite. Try again?" : null}
            {state === "shown" ? `It's “${riddle.answer}”.` : null}
          </p>
          <div className="pg-quiz__actions">
            {finished ? null : (
              <>
                <button type="button" className="pg-mini-btn" disabled={hint} onClick={() => setHint(true)}>
                  hint
                </button>
                <button type="button" className="pg-mini-btn" onClick={() => setState("shown")}>
                  show answer
                </button>
              </>
            )}
            <button type="button" className="pg-mini-btn" onClick={next}>
              next riddle →
            </button>
          </div>
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
