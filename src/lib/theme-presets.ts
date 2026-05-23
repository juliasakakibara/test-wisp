import { ThemeConfig } from "./redis";

export type ThemePreset = ThemeConfig & { name: string };

/** Raster-style neutral — black on white */
export const NEUTRAL_LIGHT: ThemePreset = {
  name: "Light",
  primary: "#000000",
  background: "#ffffff",
  foreground: "#000000",
  radius: "0",
  fontFamily: "font-sans",
};

/** Raster-style neutral — white on black */
export const NEUTRAL_DARK: ThemePreset = {
  name: "Dark",
  primary: "#ffffff",
  background: "#000000",
  foreground: "#ffffff",
  radius: "0",
  fontFamily: "font-sans",
};

export const THEME_PRESETS: ThemePreset[] = [
  NEUTRAL_LIGHT,
  NEUTRAL_DARK,
  {
    name: "Neutro",
    primary: "#000000",
    background: "#ffffff",
    foreground: "#000000",
    radius: "0",
    fontFamily: "font-sans",
  },
  {
    name: "Green",
    primary: "#16a34a",
    background: "#ffffff",
    foreground: "#14532d",
    radius: "0.5rem",
    fontFamily: "font-sans",
  },
  {
    name: "Blue",
    primary: "#2563eb",
    background: "#ffffff",
    foreground: "#1e3a8a",
    radius: "0.5rem",
    fontFamily: "font-sans",
  },
  {
    name: "Violet",
    primary: "#7c3aed",
    background: "#ffffff",
    foreground: "#2e1065",
    radius: "0.75rem",
    fontFamily: "font-sans",
  },
  {
    name: "Rose",
    primary: "#e11d48",
    background: "#ffffff",
    foreground: "#4c0519",
    radius: "1rem",
    fontFamily: "font-serif",
  },
  {
    name: "Orange",
    primary: "#ea580c",
    background: "#fffbeb",
    foreground: "#431407",
    radius: "0.75rem",
    fontFamily: "font-sans",
  },
  {
    name: "Minimal",
    primary: "#18181b",
    background: "#ffffff",
    foreground: "#09090b",
    radius: "0",
    fontFamily: "font-sans",
  },
  {
    name: "Midnight",
    primary: "#34d399",
    background: "#0f172a",
    foreground: "#f8fafc",
    radius: "0.5rem",
    fontFamily: "font-sans",
  },
  {
    name: "Cream",
    primary: "#92400e",
    background: "#fef3c7",
    foreground: "#1c1917",
    radius: "1rem",
    fontFamily: "font-serif",
  },
  {
    name: "Lavender",
    primary: "#a855f7",
    background: "#faf5ff",
    foreground: "#3b0764",
    radius: "1rem",
    fontFamily: "font-sans",
  },
];

function parseHex(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const srgb = channel / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** WCAG contrast math — because "looks fine on my monitor" is not a standard. */
export function contrastRatio(fg: string, bg: string): number {
  const fgLum = relativeLuminance(...parseHex(fg));
  const bgLum = relativeLuminance(...parseHex(bg));
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function mixHex(fg: string, bg: string, fgPercent: number): string {
  const [fr, fgG, fb] = parseHex(fg);
  const [br, bgG, bb] = parseHex(bg);
  const ratio = fgPercent / 100;
  const mix = (a: number, b: number) => Math.round(a * ratio + b * (1 - ratio));
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  return `#${toHex(mix(fr, br))}${toHex(mix(fgG, bgG))}${toHex(mix(fb, bb))}`;
}

export function pickReadableOn(bg: string, candidates: [string, string]): string {
  const [a, b] = candidates;
  return contrastRatio(a, bg) >= contrastRatio(b, bg) ? a : b;
}

function computeMutedForeground(preset: ThemeConfig, minRatio = 4.5): string {
  for (let mix = 60; mix <= 95; mix += 1) {
    const color = mixHex(preset.foreground, preset.background, mix);
    if (contrastRatio(color, preset.background) >= minRatio) {
      return color;
    }
  }
  return preset.foreground;
}

/** WCAG 1.4.11 — borders/separators ≥ 3:1 against background */
function computeBorder(preset: ThemeConfig, minRatio = 3): string {
  for (let mix = 15; mix <= 100; mix += 1) {
    const color = mixHex(preset.foreground, preset.background, mix);
    if (contrastRatio(color, preset.background) >= minRatio) {
      return color;
    }
  }
  return preset.foreground;
}

export function validateThemePreset(preset: ThemePreset): void {
  const textMin = 4.5;
  const uiMin = 3;

  if (contrastRatio(preset.foreground, preset.background) < textMin) {
    throw new Error(`${preset.name}: foreground/background below ${textMin}:1`);
  }

  if (contrastRatio(preset.primary, preset.background) < uiMin) {
    throw new Error(`${preset.name}: primary/background below ${uiMin}:1`);
  }

  const mutedForeground = computeMutedForeground(preset);
  if (contrastRatio(mutedForeground, preset.background) < textMin) {
    throw new Error(`${preset.name}: muted-foreground/background below ${textMin}:1`);
  }

  const border = computeBorder(preset);
  if (contrastRatio(border, preset.background) < uiMin) {
    throw new Error(`${preset.name}: border/background below ${uiMin}:1`);
  }
}

function mixCss(fg: string, bg: string, fgPercent: number): string {
  return `color-mix(in srgb, ${fg} ${fgPercent}%, ${bg})`;
}

function isHexColor(color: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color.trim());
}

function pickReadableOnSafe(primary: string, bg: string, fg: string): string {
  if (isHexColor(primary) && isHexColor(bg) && isHexColor(fg)) {
    return pickReadableOn(primary, [bg, fg]);
  }
  return mixCss(fg, primary, 12);
}

export type AccessibleThemeTokens = {
  "--primary-foreground": string;
  "--muted-foreground": string;
  "--border": string;
  "--muted": string;
};

/** Safe derived tokens — injected alongside base theme vars on <html>. */
export function deriveAccessibleTokens(preset: ThemeConfig): AccessibleThemeTokens {
  const { foreground: fg, background: bg, primary } = preset;

  if (isHexColor(fg) && isHexColor(bg)) {
    return {
      "--primary-foreground": pickReadableOnSafe(primary, bg, fg),
      "--muted-foreground": computeMutedForeground(preset),
      "--border": computeBorder(preset),
      "--muted": mixHex(fg, bg, 6),
    };
  }

  return {
    "--primary-foreground": pickReadableOnSafe(primary, bg, fg),
    "--muted-foreground": mixCss(fg, bg, 55),
    "--border": mixCss(fg, bg, 28),
    "--muted": mixCss(fg, bg, 6),
  };
}

if (process.env.NODE_ENV !== "production") {
  // Dev-only: scream if a preset fails WCAG. Production trusts the process.
  THEME_PRESETS.forEach(validateThemePreset);
}

export function resolveFontFamily(fontFamily: string): string {
  if (fontFamily === "font-mono") return "var(--font-mono), ui-monospace, monospace";
  if (fontFamily === "font-serif") return 'Georgia, "Times New Roman", serif';
  return "var(--font-inter), system-ui, sans-serif";
}

export function presetToThemeConfig(preset: ThemePreset): ThemeConfig {
  return {
    primary: preset.primary,
    background: preset.background,
    foreground: preset.foreground,
    radius: preset.radius,
    fontFamily: preset.fontFamily,
  };
}
