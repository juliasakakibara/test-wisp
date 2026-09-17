import { FUN_THEME_STORAGE_KEY, FUN_THEME_IDS } from "@/lib/fun-themes";
import { NEUTRAL_DARK, NEUTRAL_LIGHT } from "@/lib/theme-presets";

/** Resolved appearance */
export type ColorMode = "light" | "dark";

/** User preference — system follows OS until overridden */
export type ColorModePreference = "system" | ColorMode;

export const COLOR_MODE_STORAGE_KEY = "user_color_mode";
const LEGACY_THEME_STORAGE_KEY = "user_theme_preference";

/** Inline vars that must be cleared so CSS [data-color-mode] tokens win */
export const THEME_INLINE_VARS = [
  "--primary",
  "--background",
  "--foreground",
  "--radius",
  "--font-family",
  "--primary-foreground",
  "--muted-foreground",
  "--border",
  "--muted",
] as const;

export function clearInlineThemeVars(root: HTMLElement = document.documentElement): void {
  for (const variable of THEME_INLINE_VARS) {
    root.style.removeProperty(variable);
  }
}

export function readStoredPreference(): ColorModePreference {
  if (typeof window === "undefined") return "system";

  if (localStorage.getItem(LEGACY_THEME_STORAGE_KEY)) {
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }

  const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (stored === "system" || stored === "light" || stored === "dark") {
    return stored;
  }
  return "system";
}

export function resolveSystemMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveEffectiveMode(preference: ColorModePreference): ColorMode {
  if (preference === "light" || preference === "dark") return preference;
  return resolveSystemMode();
}

/** Apply mode via CSS [data-color-mode] — never inline color tokens on public site */
export function applyColorMode(mode: ColorMode): void {
  const html = document.documentElement;
  html.setAttribute("data-color-mode", mode);
  clearInlineThemeVars(html);
}

export function applyColorModePreference(preference: ColorModePreference): ColorMode {
  const effective = resolveEffectiveMode(preference);
  applyColorMode(effective);
  return effective;
}

function inlineVarsJs(): string {
  return JSON.stringify([...THEME_INLINE_VARS]);
}

/** Runs before first paint — color mode + home/styleguide Fun themes from localStorage */
export function getColorModeInitScript(): string {
  const funIds = JSON.stringify(FUN_THEME_IDS);
  return `(function(){try{var html=document.documentElement;var vars=${inlineVarsJs()};vars.forEach(function(v){html.style.removeProperty(v);});var inIframe=false;try{inIframe=window.self!==window.top;}catch(e){inIframe=true;}if(inIframe){html.setAttribute("data-env","admin");return;}var legacy=${JSON.stringify(LEGACY_THEME_STORAGE_KEY)};if(localStorage.getItem(legacy))localStorage.removeItem(legacy);var k=${JSON.stringify(COLOR_MODE_STORAGE_KEY)};var s=localStorage.getItem(k);if(s==="light"||s==="dark"||s==="system"){var m=s==="light"?"light":s==="dark"?"dark":matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";html.setAttribute("data-color-mode",m);}var path=location.pathname||"/";var allowFun=path==="/"||path==="/styleguide"||path.indexOf("/styleguide/")===0;var funKey=${JSON.stringify(FUN_THEME_STORAGE_KEY)};var funIds=${funIds};var fun=localStorage.getItem(funKey);if(allowFun&&funIds.indexOf(fun)!==-1){html.setAttribute("data-fun-theme",fun);}else{html.removeAttribute("data-fun-theme");}}catch(e){}})();`;
}

export function preferenceLabel(preference: ColorModePreference): string {
  if (preference === "system") return "System";
  return preference === "dark" ? "Dark" : "Light";
}

export function preferenceFromPresetName(name: string): ColorModePreference {
  if (name === "System") return "system";
  if (name === "Dark") return "dark";
  return "light";
}

export const PUBLIC_COLOR_MODE_OPTIONS: { name: string; preference: ColorModePreference }[] = [
  { name: "System", preference: "system" },
  { name: "Light", preference: "light" },
  { name: "Dark", preference: "dark" },
];

export { NEUTRAL_LIGHT, NEUTRAL_DARK };
