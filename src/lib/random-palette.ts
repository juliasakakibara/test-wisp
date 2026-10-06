/**
 * Random accessible colour systems (after randoma11y). A theme is two primaries,
 * paper (bg) and ink (fg); globals.css derives every other colour from them with
 * the alphas below (after Raster). The surface alphas are fixed; the two muted
 * text alphas are found per theme (the faintest that still passes AA on the
 * hardest surface) and written as numbers, so any AA pair keeps its character.
 */

export type Palette = {
  bg: string;
  fg: string;
  /** Muted text as it lands on the card fill (for display). */
  muted: string;
  /** Share of ink for muted text, and of paper for muted text on ink widgets. */
  mutedAlpha: number;
  invertedMutedAlpha: number;
  card: string;
  cardHover: string;
  line: string;
  /** Muted text on fg-coloured widgets. */
  invertedMuted: string;
  ratio: number;
  scheme: "light" | "dark";
};

type Rgb = [number, number, number];

const AA = 4.5;
/** Derived colours aim a little above AA so rounding never lands them at 4.49. */
const TARGET = 4.6;

/** Mirrors the derived tokens in globals.css (share of ink, or of paper for inverse). */
export const ALPHA = {
  page: 0.05, // --lb-bg-default
  card: 0.11, // --lb-bg-strong
  cardHover: 0.21, // --lb-bg-bolder
  line: 0.1, // --lb-border-muted
  /** Base-theme defaults for the muted alphas; random themes compute their own. */
  muted: 0.7, // --pg-muted-alpha → --lb-fg-muted
  invertedMuted: 0.6, // --pg-inverse-muted-alpha → --lb-fg-inverse-muted (paper over ink)
} as const;

/** The faintest share of `ink` over `on` that still reads at AA on `on` (null if none). */
function faintestAlpha(ink: Rgb, on: Rgb, from: number): number | null {
  for (let a = from; a <= 1.0001; a += 0.02) {
    if (contrast(mix(on, ink, a), on) >= TARGET) return Math.round(a * 100) / 100;
  }
  return null;
}


function hslToRgb(h: number, s: number, l: number): Rgb {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

const hex = (c: Rgb) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

function luminance([r, g, b]: Rgb): number {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [0, 1, 2].map((i) => a[i] + (b[i] - a[i]) * t) as Rgb;


export function randomPalette(random: () => number = Math.random): Palette {
  for (let attempt = 0; attempt < 400; attempt++) {
    const bg = hslToRgb(random() * 360, 0.15 + random() * 0.8, 0.06 + random() * 0.9);
    const bgIsLight = luminance(bg) > 0.18;
    const fgHue = random() * 360;
    const fg = hslToRgb(fgHue, random() * 0.9, bgIsLight ? random() * 0.3 : 0.75 + random() * 0.25);
    const ratio = contrast(bg, fg);
    if (ratio < AA) continue;

    // Composite the alphas the way the browser will, then test the hardest pairs:
    // muted text on the card hover, and muted paper text on ink widgets.
    const card = mix(bg, fg, ALPHA.card);
    const cardHover = mix(bg, fg, ALPHA.cardHover);
    const mutedAlpha = faintestAlpha(fg, cardHover, ALPHA.muted);
    const invertedMutedAlpha = faintestAlpha(bg, fg, ALPHA.invertedMuted);
    if (mutedAlpha === null || invertedMutedAlpha === null) continue;

    return {
      bg: hex(bg),
      fg: hex(fg),
      muted: hex(mix(card, fg, mutedAlpha)),
      mutedAlpha,
      invertedMutedAlpha,
      card: hex(card),
      cardHover: hex(cardHover),
      line: hex(mix(bg, fg, ALPHA.line)),
      invertedMuted: hex(mix(fg, bg, invertedMutedAlpha)),
      ratio: Math.round(ratio * 10) / 10,
      scheme: bgIsLight ? "light" : "dark",
    };
  }
  // Practically unreachable; a safe pair rather than a failing one.
  return { bg: "#ffffff", fg: "#1c1c1c", muted: "#606060", mutedAlpha: ALPHA.muted, invertedMutedAlpha: ALPHA.invertedMuted, card: "#e3e3e3", cardHover: "#d6d6d6", line: "#cacaca", invertedMuted: "#a0a0a0", ratio: 15.1, scheme: "light" };
}

export const wcagLevel = (ratio: number) => (ratio >= 7 ? "AAA" : "AA");
