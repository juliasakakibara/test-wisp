/**
 * Random accessible colour systems (after randoma11y): a random background, a
 * text colour searched until it passes WCAG AA (4.5:1), then every other role
 * derived from that pair and checked again.
 */

export type Palette = {
  bg: string;
  fg: string;
  /** Muted text: as faint as it can be while still 4.5:1 on the card fill. */
  muted: string;
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

/** The faintest mix of `from` toward `to` that still reads at 4.5:1 on `on`. */
function faintest(from: Rgb, to: Rgb, on: Rgb): Rgb {
  for (let t = 0.6; t < 1; t += 0.04) {
    const c = mix(from, to, t);
    if (contrast(c, on) >= TARGET) return c;
  }
  return to;
}

export function randomPalette(random: () => number = Math.random): Palette {
  for (let attempt = 0; attempt < 400; attempt++) {
    const bg = hslToRgb(random() * 360, 0.15 + random() * 0.8, 0.06 + random() * 0.9);
    const bgIsLight = luminance(bg) > 0.18;
    const fgHue = random() * 360;
    const fg = hslToRgb(fgHue, random() * 0.9, bgIsLight ? random() * 0.3 : 0.75 + random() * 0.25);
    const ratio = contrast(bg, fg);
    if (ratio < AA) continue;

    const card = mix(bg, fg, 0.08);
    const muted = faintest(bg, fg, card);
    // The card is the hardest surface for muted text; bail out if even full fg fails there.
    if (contrast(muted, card) < AA || contrast(fg, card) < AA) continue;

    return {
      bg: hex(bg),
      fg: hex(fg),
      muted: hex(muted),
      card: hex(card),
      cardHover: hex(mix(bg, fg, 0.14)),
      line: hex(mix(bg, fg, 0.2)),
      invertedMuted: hex(faintest(fg, bg, fg)),
      ratio: Math.round(ratio * 10) / 10,
      scheme: bgIsLight ? "light" : "dark",
    };
  }
  // Practically unreachable; a safe pair rather than a failing one.
  return { bg: "#f2f2f2", fg: "#1c1c1c", muted: "#606060", card: "#e3e3e3", cardHover: "#d6d6d6", line: "#cacaca", invertedMuted: "#a0a0a0", ratio: 15.1, scheme: "light" };
}

export const wcagLevel = (ratio: number) => (ratio >= 7 ? "AAA" : "AA");
