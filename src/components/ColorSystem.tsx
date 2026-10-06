"use client";

import { useEffect, useState } from "react";
import { randomPalette, wcagLevel, type Palette } from "@/lib/random-palette";

const CHANGE_EVENT = "colorsystemchange";

/** Site tokens a palette drives; set inline on <html>, so they beat the base topping and survive navigation. */
const VARS = (p: Palette): Record<string, string> => ({
  "--background": p.bg,
  "--foreground": p.fg,
  "--muted-foreground": p.muted,
  "--primary": p.fg,
  "--link": p.fg,
  "--link-strong": p.fg,
  "--link-underline": p.fg,
  "--primary-foreground": p.bg,
  "--border": p.line,
  "--muted": p.card,
  "--lb-bg-default": p.bg,
  "--lb-fg-default": p.fg,
  "--lb-fg-muted": p.muted,
  "--lb-border-muted": p.line,
  "--lb-neutral-50": p.bg,
  "--lb-neutral-100": p.bg,
  "--lb-neutral-200": p.card,
  "--lb-neutral-300": p.cardHover,
  "--lb-neutral-400": p.invertedMuted,
  "--lb-neutral-900": p.fg,
  "--lb-yellow-400": p.fg,
  "--pg-signal-ink": p.bg,
});

let current: Palette | null = null;

export function applyPalette(next: Palette) {
  const root = document.documentElement;
  root.setAttribute("data-topping-swapping", "");
  for (const [name, value] of Object.entries(VARS(next))) root.style.setProperty(name, value);
  root.style.colorScheme = next.scheme;
  current = next;
  window.setTimeout(() => root.removeAttribute("data-topping-swapping"), 450);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function resetPalette() {
  const root = document.documentElement;
  root.setAttribute("data-topping-swapping", "");
  if (current) for (const name of Object.keys(VARS(current))) root.style.removeProperty(name);
  root.style.removeProperty("color-scheme");
  current = null;
  window.setTimeout(() => root.removeAttribute("data-topping-swapping"), 450);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/** The palette on the page now (null = the base topping), kept in step everywhere. */
function useCurrentPalette(): Palette | null {
  const [palette, setPalette] = useState<Palette | null>(current);
  useEffect(() => {
    const sync = () => setPalette(current);
    document.addEventListener(CHANGE_EVENT, sync);
    return () => document.removeEventListener(CHANGE_EVENT, sync);
  }, []);
  return palette;
}

/** Hero widget: the live pair, its contrast, Shuffle and Reset. */
export function ColorShuffle() {
  const palette = useCurrentPalette();

  return (
    <div className="pg-color">
      <p className="pg-color__pair">
        <span className="pg-color__chip" style={{ background: palette?.bg ?? "var(--background)" }} />
        <span className="pg-color__chip" style={{ background: palette?.fg ?? "var(--foreground)" }} />
        <span aria-live="polite">
          {palette ? `${palette.bg} / ${palette.fg} · ${palette.ratio}:1 ${wcagLevel(palette.ratio)}` : "Base · 15.1:1 AAA"}
        </span>
      </p>
      <div className="pg-color__actions">
        <button type="button" className="pg-color__button pg-color__button--primary" onClick={() => applyPalette(randomPalette())}>
          Shuffle ↻
        </button>
        <button type="button" className="pg-color__button" onClick={resetPalette} disabled={!palette}>
          Reset
        </button>
      </div>
    </div>
  );
}

/** Section cards: four random AA systems; press one to serve the page in it. */
export function ColorSystemCards({ count = 4 }: { count?: number }) {
  const active = useCurrentPalette();
  const [palettes, setPalettes] = useState<Palette[] | null>(null);

  // Random only after mount, so the server and the first client render agree.
  useEffect(() => {
    const shuffle = () => setPalettes(Array.from({ length: count }, () => randomPalette()));
    shuffle();
    document.addEventListener("colorsystemshuffle", shuffle);
    return () => document.removeEventListener("colorsystemshuffle", shuffle);
  }, [count]);

  return (
    <>
      {(palettes ?? Array.from({ length: count }, () => null)).map((p, i) => (
        <li key={p ? `${p.bg}${p.fg}` : i} className="pg-card">
          <button
            type="button"
            className="pg-card__link pg-card__button"
            aria-pressed={p !== null && active?.bg === p.bg && active.fg === p.fg}
            disabled={!p}
            onClick={() => p && applyPalette(p)}
          >
            <span className="pg-card__top">
              <span className="pg-card__title">System {String(i + 1).padStart(2, "0")}</span>
              <span className="pg-card__count">{p ? `[${p.ratio}:1]` : "[ ]"}</span>
            </span>
            <span className="pg-card__preview pg-card__preview--topping" style={p ? { background: p.bg } : undefined}>
              {p ? (
                <>
                  <span className="pg-swatch-type" style={{ color: p.fg }}>
                    Aa
                  </span>
                  <span className="pg-swatches" aria-hidden="true">
                    {[p.bg, p.card, p.muted, p.fg].map((c) => (
                      <span key={c} className="pg-swatch" style={{ background: c }} />
                    ))}
                  </span>
                </>
              ) : null}
            </span>
            <span className="pg-card__meta">
              {p ? `${p.bg} / ${p.fg} · ${wcagLevel(p.ratio)} · ${active?.bg === p.bg && active.fg === p.fg ? "served now" : "tap to serve"}` : "mixing…"}
            </span>
          </button>
        </li>
      ))}
    </>
  );
}

/** Section action: four new systems. */
export function ShuffleSystemsButton() {
  return (
    <button type="button" className="pg-pill" onClick={() => document.dispatchEvent(new CustomEvent("colorsystemshuffle"))}>
      <span>Shuffle systems</span>
      <span aria-hidden="true">↻</span>
    </button>
  );
}
