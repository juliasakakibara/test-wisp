"use client";

import { useEffect, useState } from "react";
import { wcagLevel } from "@/lib/random-palette";
import { randomTheme, type Theme } from "@/lib/themes";

const CHANGE_EVENT = "themechange";
const SHUFFLE_EVENT = "themeshuffle";

/** Site tokens a theme drives; set inline on <html>, so they beat the base topping and survive navigation. */
const VARS = ({ palette: p, fonts }: Theme): Record<string, string> => ({
  "--background": p.bg,
  "--foreground": p.fg,
  "--muted-foreground": p.muted,
  "--primary": p.fg,
  "--primary-foreground": p.bg,
  "--link": p.fg,
  "--link-strong": p.fg,
  "--link-underline": p.fg,
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
  // Duotone for project images: shadows take the darker colour, highlights the lighter
  "--duo-ink": p.scheme === "light" ? p.fg : p.bg,
  "--duo-paper": p.scheme === "light" ? p.bg : p.fg,
  "--lb-font-family-1": fonts.display.css,
  "--lb-font-family-2": fonts.body.css,
  "--font-display": fonts.display.css,
  "--font-body": fonts.body.css,
  "--font-family": fonts.body.css,
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

/** Hero widget: the live theme (fonts, pair, contrast), Shuffle and Reset. */
export function ThemeShuffle() {
  const theme = useCurrentTheme();
  const p = theme?.palette;

  return (
    <div className="pg-color">
      <p className="pg-color__fonts">
        {theme ? `${theme.fonts.display.name} + ${theme.fonts.body.name}` : "Newsreader + Geist Mono"}
      </p>
      <p className="pg-color__pair">
        <span className="pg-color__chip" style={{ background: p?.bg ?? "var(--background)" }} />
        <span className="pg-color__chip" style={{ background: p?.fg ?? "var(--foreground)" }} />
        <span aria-live="polite">{p ? `${p.bg} / ${p.fg} · ${p.ratio}:1 ${wcagLevel(p.ratio)}` : "Base · 15.1:1 AAA"}</span>
      </p>
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
            className="pg-card__link pg-card__button"
            aria-pressed={same(t, active)}
            disabled={!t}
            onClick={() => t && applyTheme(t)}
          >
            <span className="pg-card__top">
              <span className="pg-card__title">Theme {String(i + 1).padStart(2, "0")}</span>
              <span className="pg-card__count">{t ? `[${t.palette.ratio}:1]` : "[ ]"}</span>
            </span>
            <span className="pg-card__preview pg-card__preview--topping" style={t ? { background: t.palette.bg } : undefined}>
              {t ? (
                <>
                  <span className="pg-theme-font" style={{ color: t.palette.fg, fontFamily: t.fonts.display.css }}>
                    {t.fonts.display.name}
                  </span>
                  <span className="pg-theme-body" style={{ color: t.palette.muted, fontFamily: t.fonts.body.css }}>
                    + {t.fonts.body.name}
                  </span>
                  <span className="pg-swatches" aria-hidden="true">
                    {/* Keyed by role: two roles can share a colour (muted falls back to fg) */}
                    {(["bg", "card", "muted", "fg"] as const).map((role) => (
                      <span key={role} className="pg-swatch" style={{ background: t.palette[role] }} />
                    ))}
                  </span>
                </>
              ) : null}
            </span>
            <span className="pg-card__meta">
              {t ? `${t.palette.bg} / ${t.palette.fg} · ${wcagLevel(t.palette.ratio)} · ${same(t, active) ? "served now" : "tap to serve"}` : "mixing…"}
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
