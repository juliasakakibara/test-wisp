/** Fun themes — lean, high-contrast pairs (home/styleguide only). */

export const FUN_THEME_STORAGE_KEY = "home_fun_theme";
export const THEME_CHANGE_EVENT = "julia:theme-change";

export function notifyThemeChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export type FunThemeId = "electric" | "neon" | "signal" | "albers";

export type FunThemeTokens = {
  id: FunThemeId;
  label: string;
  colorScheme: "light" | "dark";
  primary: string;
  background: string;
  foreground: string;
  primaryForeground: string;
  mutedForeground: string;
  border: string;
  muted: string;
};

/**
 * Four playful pairs inspired by randoma11y / colorable refs —
 * not the old DTCG Matrix/NieR set.
 */
export const FUN_THEMES: FunThemeTokens[] = [
  {
    id: "electric",
    label: "Electric",
    colorScheme: "dark",
    primary: "#ffffff",
    background: "#4338ca",
    foreground: "#ffffff",
    primaryForeground: "#4338ca",
    mutedForeground: "rgba(255, 255, 255, 0.72)",
    border: "rgba(255, 255, 255, 0.35)",
    muted: "rgba(255, 255, 255, 0.1)",
  },
  {
    id: "neon",
    label: "Neon",
    colorScheme: "dark",
    primary: "#c8f542",
    background: "#2a1038",
    foreground: "#c8f542",
    primaryForeground: "#2a1038",
    mutedForeground: "rgba(200, 245, 66, 0.7)",
    border: "rgba(200, 245, 66, 0.35)",
    muted: "rgba(200, 245, 66, 0.1)",
  },
  {
    id: "signal",
    label: "Signal",
    colorScheme: "light",
    primary: "#e10600",
    background: "#ffffff",
    foreground: "#e10600",
    primaryForeground: "#ffffff",
    mutedForeground: "rgba(225, 6, 0, 0.72)",
    border: "rgba(225, 6, 0, 0.28)",
    muted: "rgba(225, 6, 0, 0.08)",
  },
  {
    id: "albers",
    label: "Albers",
    colorScheme: "light",
    primary: "#30223e",
    background: "#d2dfc4",
    foreground: "#30223e",
    primaryForeground: "#d2dfc4",
    mutedForeground: "rgba(48, 34, 62, 0.72)",
    border: "rgba(48, 34, 62, 0.28)",
    muted: "rgba(48, 34, 62, 0.08)",
  },
];

export const FUN_THEME_IDS = FUN_THEMES.map((t) => t.id);

export function isFunThemeId(value: string | null | undefined): value is FunThemeId {
  return FUN_THEME_IDS.includes(value as FunThemeId);
}

export function getFunTheme(id: FunThemeId): FunThemeTokens {
  return FUN_THEMES.find((t) => t.id === id)!;
}

/** Routes where Fun themes apply and appear in the switcher. */
/** Experiment (playground): Fun themes are off; random AA themes replace them (components/ColorSystem). */
export function pathAllowsFunThemes(pathname: string): boolean {
  void pathname;
  return false;
}

export function readStoredFunTheme(): FunThemeId | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(FUN_THEME_STORAGE_KEY);
  if (!isFunThemeId(stored)) {
    if (stored) localStorage.removeItem(FUN_THEME_STORAGE_KEY);
    return null;
  }
  return stored;
}

export function writeStoredFunTheme(id: FunThemeId | null): void {
  if (typeof window === "undefined") return;
  if (id === null) {
    localStorage.removeItem(FUN_THEME_STORAGE_KEY);
    return;
  }
  localStorage.setItem(FUN_THEME_STORAGE_KEY, id);
}

export function applyFunTheme(id: FunThemeId | null): void {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (id === null) {
    html.removeAttribute("data-fun-theme");
    return;
  }
  html.setAttribute("data-fun-theme", id);
}

export function syncFunThemeForPath(pathname: string): FunThemeId | null {
  if (!pathAllowsFunThemes(pathname)) {
    applyFunTheme(null);
    return null;
  }
  const stored = readStoredFunTheme();
  applyFunTheme(stored);
  return stored;
}
