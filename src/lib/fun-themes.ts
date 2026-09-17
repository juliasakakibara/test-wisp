/** Fun themes inspired by designtokens.org (Core + Fun switcher). Home/styleguide only. */

export const FUN_THEME_STORAGE_KEY = "home_fun_theme";
export const THEME_CHANGE_EVENT = "julia:theme-change";

export function notifyThemeChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export type FunThemeId =
  | "matrix"
  | "nier"
  | "rebeccapurple"
  | "sunset"
  | "virtualboy"
  | "zengarden";

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

/** Hex values adapted from DTCG `:root[data-theme=…]` semantic tokens → Julia tokens. */
export const FUN_THEMES: FunThemeTokens[] = [
  {
    id: "matrix",
    label: "Matrix",
    colorScheme: "dark",
    primary: "#00a544",
    background: "#000600",
    foreground: "#00c758",
    primaryForeground: "#000600",
    mutedForeground: "#008138",
    border: "rgba(13, 84, 43, 0.55)",
    muted: "rgba(0, 197, 88, 0.08)",
  },
  {
    id: "nier",
    label: "NieR",
    colorScheme: "light",
    primary: "#525051",
    background: "#ccc8b2",
    foreground: "#525051",
    primaryForeground: "#ccc8b2",
    mutedForeground: "#646363",
    border: "rgba(82, 80, 81, 0.35)",
    muted: "rgba(82, 80, 81, 0.08)",
  },
  {
    id: "rebeccapurple",
    label: "rebeccapurple",
    colorScheme: "light",
    primary: "#663399",
    background: "#e5d7fa",
    foreground: "#21003b",
    primaryForeground: "#e5d7fa",
    mutedForeground: "#56337c",
    border: "rgba(102, 51, 153, 0.35)",
    muted: "rgba(102, 51, 153, 0.08)",
  },
  {
    id: "sunset",
    label: "Sunset",
    colorScheme: "light",
    primary: "#c53c00",
    background: "#ffedd5",
    foreground: "#861043",
    primaryForeground: "#ffedd5",
    mutedForeground: "#b75000",
    border: "rgba(197, 60, 0, 0.3)",
    muted: "rgba(197, 60, 0, 0.08)",
  },
  {
    id: "virtualboy",
    label: "VirtualBoy",
    colorScheme: "dark",
    primary: "#bf000f",
    background: "#0f0000",
    foreground: "#e40014",
    primaryForeground: "#0f0000",
    mutedForeground: "#bf000f",
    border: "rgba(130, 24, 26, 0.55)",
    muted: "rgba(228, 0, 20, 0.1)",
  },
  {
    id: "zengarden",
    label: "Zen Garden",
    colorScheme: "light",
    primary: "#49968e",
    background: "#fcfcfc",
    foreground: "#335050",
    primaryForeground: "#ffffff",
    mutedForeground: "#4f6969",
    border: "rgba(73, 150, 142, 0.3)",
    muted: "rgba(73, 150, 142, 0.08)",
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
export function pathAllowsFunThemes(pathname: string): boolean {
  return pathname === "/" || pathname === "/styleguide" || pathname.startsWith("/styleguide/");
}

export function readStoredFunTheme(): FunThemeId | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(FUN_THEME_STORAGE_KEY);
  return isFunThemeId(stored) ? stored : null;
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
