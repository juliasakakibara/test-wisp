"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { contrast, wcagLevel } from "@/lib/random-palette";
import { randomTheme, type Theme } from "@/lib/themes";

const CHANGE_EVENT = "themechange";
const SHUFFLE_EVENT = "themeshuffle";

/**
 * A theme sets only Short Stack's inputs (src/styles/short-stack.css): background,
 * foreground, accent, the two muted opacities, and fonts. Every other colour is
 * derived in CSS, so it follows. Set inline on <html>: beats the base, survives navigation.
 */
const VARS = ({ palette: p, fonts }: Theme): Record<string, string> => ({
  "--background": p.bg,
  "--foreground": p.fg,
  "--accent": p.fg,
  "--on-accent": p.bg,
  // colour details are for the base themes only
  "--palette": "0",
  "--muted-opacity": `${Math.round(p.mutedAlpha * 100)}%`,
  "--inverse-muted-opacity": `${Math.round(p.invertedMutedAlpha * 100)}%`,
  // Duotone for project images: shadows take the darker colour, highlights the lighter
  "--duo-ink": p.scheme === "light" ? p.fg : p.bg,
  "--duo-paper": p.scheme === "light" ? p.bg : p.fg,
  "--font-display": fonts.display.css,
  "--font-body": fonts.body.css,
  "--font-family": fonts.body.css,
  // Pancake-styled parts (pills' text style) read the families directly
  "--lb-font-family-1": fonts.display.css,
  "--lb-font-family-2": fonts.body.css,
});

let current: Theme | null = null;

function swap(apply: (root: HTMLElement) => void) {
  const root = document.documentElement;
  root.setAttribute("data-topping-swapping", "");
  apply(root);
  window.setTimeout(() => root.removeAttribute("data-topping-swapping"), 450);
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function applyTheme(next: Theme) {
  swap((root) => {
    if (current) for (const name of Object.keys(VARS(current))) root.style.removeProperty(name);
    for (const [name, value] of Object.entries(VARS(next))) root.style.setProperty(name, value);
    root.style.colorScheme = next.palette.scheme;
    current = next;
  });
}

export function resetTheme() {
  swap((root) => {
    if (current) for (const name of Object.keys(VARS(current))) root.style.removeProperty(name);
    root.style.removeProperty("color-scheme");
    current = null;
  });
}

/** The theme on the page now (null = the base), kept in step everywhere. */
function useCurrentTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(current);
  useEffect(() => {
    const sync = () => setTheme(current);
    document.addEventListener(CHANGE_EVENT, sync);
    return () => document.removeEventListener(CHANGE_EVENT, sync);
  }, []);
  return theme;
}

const same = (a: Theme | null, b: Theme | null) =>
  !!a && !!b && a.palette.bg === b.palette.bg && a.palette.fg === b.palette.fg && a.fonts === b.fonts;

/** Text/page contrast of the base theme as painted now (it differs between light and dark). */
function subscribeMode(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    observer.disconnect();
    document.removeEventListener(CHANGE_EVENT, onChange);
  };
}
const toRgb = (css: string) => {
  // "rgb(r, g, b)" or "color(srgb r g b)" (0–1), as browsers report mixed colours
  const n = css.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return (css.startsWith("color(") ? n.slice(0, 3).map((v) => v * 255) : n.slice(0, 3)) as [number, number, number];
};
function readBaseRatio() {
  const s = getComputedStyle(document.body);
  return Math.round(contrast(toRgb(s.backgroundColor), toRgb(s.color)) * 10) / 10;
}

/** Hero widget: the live theme as a theme card (same anatomy as the section cards), with Shuffle and Reset. */
export function ThemeShuffle() {
  const theme = useCurrentTheme();
  const p = theme?.palette;
  const baseRatio = useSyncExternalStore(subscribeMode, readBaseRatio, () => 16);
  const display = theme?.fonts.display ?? { name: "Newsreader", css: "var(--font-display)" };
  const body = theme?.fonts.body ?? { name: "Geist Mono", css: "var(--font-body)" };
  // Base theme: the page's own tokens; a served theme: its literal colours
  const swatches = p ? [p.bg, p.card, p.muted, p.fg] : ["var(--background)", "var(--surface)", "var(--muted-foreground)", "var(--foreground)"];

  return (
    <div className="pg-color">
      {/* left of this row is the widget's drag label ("Theme"), placed by the canvas */}
      <span className="pg-card__top">
        <span className="pg-card__count">[{p ? p.ratio : baseRatio}:1]</span>
      </span>
      {/* no inner preview box: the page is already in this theme */}
      <span className="pg-theme-font" style={{ fontFamily: display.css }}>
        {display.name}
      </span>
      <span className="pg-theme-body" style={{ fontFamily: body.css }}>
        + {body.name}
      </span>
      <span className="pg-swatches" aria-hidden="true">
        {swatches.map((c, i) => (
          <span key={i} className="pg-swatch" style={{ background: c }} />
        ))}
      </span>
      <span className="pg-card__meta" aria-live="polite">
        {p ? `Shuffled · ${p.bg} / ${p.fg} · ${wcagLevel(p.ratio)}` : "Base theme · AAA"}
      </span>
      <div className="pg-color__actions">
        <button type="button" className="pg-color__button pg-color__button--primary" onClick={() => applyTheme(randomTheme())}>
          Shuffle ↻
        </button>
        <button type="button" className="pg-color__button" onClick={resetTheme} disabled={!theme}>
          Reset
        </button>
      </div>
    </div>
  );
}

/** Section cards: four random themes; press one to serve the page in it. */
export function ThemeCards({ count = 4 }: { count?: number }) {
  const active = useCurrentTheme();
  const [themes, setThemes] = useState<Theme[] | null>(null);

  // Random only after mount, so the server and the first client render agree.
  useEffect(() => {
    const shuffle = () => setThemes(Array.from({ length: count }, () => randomTheme()));
    shuffle();
    document.addEventListener(SHUFFLE_EVENT, shuffle);
    return () => document.removeEventListener(SHUFFLE_EVENT, shuffle);
  }, [count]);

  return (
    <>
      {(themes ?? Array.from({ length: count }, () => null)).map((t, i) => (
        <li key={t ? `${i}-${t.palette.bg}${t.palette.fg}` : i} className="pg-card">
          <button
            type="button"
            className="pg-card__link pg-card__button pg-theme-card"
            style={t ? ({ "--card-bg": t.palette.bg, "--card-fg": t.palette.fg, "--card-muted": t.palette.muted } as CSSProperties) : undefined}
            aria-pressed={same(t, active)}
            disabled={!t}
            onClick={() => t && applyTheme(t)}
          >
            {/* after Berd's agent cards, flat: the card is the theme (its colours), with a
                label + number, one visual, the name and a two-column spec row */}
            <span className="pg-card__top">
              <span className="pg-card__title">Theme</span>
              <span className="pg-card__count">{same(t, active) ? "served" : String(i + 1).padStart(2, "0")}</span>
            </span>
            <span className="pg-theme-font" style={t ? { fontFamily: t.fonts.display.css } : undefined}>
              {t ? t.fonts.display.name : ""}
            </span>
            <span className="pg-theme-card__name">{t ? `${t.fonts.display.name} + ${t.fonts.body.name}` : "mixing…"}</span>
            <span className="pg-theme-card__specs">
              <span>
                <b>Pair</b>
                {t ? (
                  <span className="pg-theme-card__pair" role="img" aria-label={`${t.palette.bg} and ${t.palette.fg}`}>
                    <span style={{ background: t.palette.bg }} />
                    <span style={{ background: t.palette.fg }} />
                  </span>
                ) : (
                  "–"
                )}
              </span>
              <span>
                <b>Contrast</b>
                {t ? `${t.palette.ratio}:1` : "–"}
              </span>
            </span>
          </button>
        </li>
      ))}
    </>
  );
}

/** Section action: four new themes. */
export function ShuffleThemesButton() {
  return (
    <button type="button" className="pg-pill" onClick={() => document.dispatchEvent(new CustomEvent(SHUFFLE_EVENT))}>
      <span>Shuffle themes</span>
      <span aria-hidden="true">↻</span>
    </button>
  );
}
