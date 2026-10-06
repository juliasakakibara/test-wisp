import { randomPalette, type Palette } from "@/lib/random-palette";

/**
 * Font pairs a theme can draw. Each family is loaded by next/font in the root
 * layout (not preloaded: a family downloads only when a theme uses it), so these
 * point at its CSS variable, with a plain fallback.
 */
export type FontPair = {
  display: { name: string; css: string };
  body: { name: string; css: string };
};

export const FONT_PAIRS: FontPair[] = [
  { display: { name: "Newsreader", css: "var(--font-newsreader), Georgia, serif" }, body: { name: "Geist Mono", css: "var(--font-geist-mono), ui-monospace, monospace" } },
  { display: { name: "Fraunces", css: "var(--font-fraunces), Georgia, serif" }, body: { name: "DM Sans", css: "var(--font-dm-sans), system-ui, sans-serif" } },
  { display: { name: "Instrument Serif", css: "var(--font-instrument-serif), Georgia, serif" }, body: { name: "Inter", css: "var(--font-inter), system-ui, sans-serif" } },
  { display: { name: "Space Grotesk", css: "var(--font-space-grotesk), system-ui, sans-serif" }, body: { name: "JetBrains Mono", css: "var(--font-mono), ui-monospace, monospace" } },
  { display: { name: "Inter", css: "var(--font-inter), system-ui, sans-serif" }, body: { name: "Geist Mono", css: "var(--font-geist-mono), ui-monospace, monospace" } },
  { display: { name: "Newsreader", css: "var(--font-newsreader), Georgia, serif" }, body: { name: "DM Sans", css: "var(--font-dm-sans), system-ui, sans-serif" } },
  { display: { name: "Geist", css: "var(--font-geist), system-ui, sans-serif" }, body: { name: "Geist Mono", css: "var(--font-geist-mono), ui-monospace, monospace" } },
  { display: { name: "Instrument Serif", css: "var(--font-instrument-serif), Georgia, serif" }, body: { name: "Geist", css: "var(--font-geist), system-ui, sans-serif" } },
];

/** A theme = one random AA palette + one font pair. */
export type Theme = { palette: Palette; fonts: FontPair };

export function randomTheme(random: () => number = Math.random): Theme {
  return {
    palette: randomPalette(random),
    fonts: FONT_PAIRS[Math.floor(random() * FONT_PAIRS.length)],
  };
}
