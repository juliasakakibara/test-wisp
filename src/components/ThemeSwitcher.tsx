"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  applyColorModePreference,
  COLOR_MODE_STORAGE_KEY,
  PUBLIC_COLOR_MODE_OPTIONS,
  readStoredPreference,
  resolveEffectiveMode,
  type ColorMode,
  type ColorModePreference,
} from "@/lib/color-mode";
import {
  applyFunTheme,
  FUN_THEMES,
  isFunThemeId,
  notifyThemeChange,
  pathAllowsFunThemes,
  syncFunThemeForPath,
  writeStoredFunTheme,
  type FunThemeId,
} from "@/lib/fun-themes";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function isInAdminIframe(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

type SelectValue = ColorModePreference | FunThemeId;

function displayThemeLabel(value: SelectValue): string {
  if (isFunThemeId(value)) {
    return FUN_THEMES.find((t) => t.id === value)?.label.toLowerCase() ?? value;
  }
  return value;
}

export function ThemeSwitcher() {
  const pathname = usePathname() ?? "/";
  const allowFun = pathAllowsFunThemes(pathname);
  const selectId = useId();
  const [preference, setPreference] = useState<ColorModePreference>("system");
  const [funTheme, setFunTheme] = useState<FunThemeId | null>(null);
  const [inAdminIframe, setInAdminIframe] = useState(false);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;
    setInAdminIframe(isInAdminIframe());
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || inAdminIframe) return;

    const storedRaw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (storedRaw === null) {
      setPreference("system");
    } else {
      const stored = readStoredPreference();
      applyColorModePreference(stored);
      setPreference(stored);
    }

    const activeFun = syncFunThemeForPath(pathname);
    setFunTheme(allowFun ? activeFun : null);
  }, [hydrated, inAdminIframe, pathname, allowFun]);

  useEffect(() => {
    if (!hydrated || inAdminIframe || preference !== "system" || funTheme) return;
    // On the first render `preference` is still the "system" default while the stored
    // choice is being restored: don't let the OS mode overwrite a saved light/dark.
    if (readStoredPreference() !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      applyColorModePreference("system");
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hydrated, inAdminIframe, preference, funTheme]);

  const handleChange = (value: SelectValue) => {
    if (isFunThemeId(value)) {
      writeStoredFunTheme(value);
      applyFunTheme(value);
      setFunTheme(value);
      notifyThemeChange();
      return;
    }

    localStorage.setItem(COLOR_MODE_STORAGE_KEY, value);
    writeStoredFunTheme(null);
    applyFunTheme(null);
    applyColorModePreference(value);
    setPreference(value);
    setFunTheme(null);
    notifyThemeChange();
  };

  if (!hydrated || inAdminIframe) return null;

  const selectValue: SelectValue = funTheme ?? preference;
  const activeLabel = displayThemeLabel(selectValue);

  return (
    <div className="theme-switcher">
      <span className="theme-switcher__face" aria-hidden="true">
        <span className="theme-switcher__prefix">theme:</span>{" "}
        <span className="theme-switcher__value">{activeLabel}</span>{" "}
        <span className="theme-switcher__chevron">▼</span>
      </span>
      <label className="theme-switcher__sr-only" htmlFor={selectId}>
        Theme
      </label>
      <select
        id={selectId}
        className="theme-switcher__select"
        value={selectValue}
        onChange={(event) => handleChange(event.target.value as SelectValue)}
        aria-label="Theme"
      >
        {PUBLIC_COLOR_MODE_OPTIONS.map((option) => (
          <option key={option.preference} value={option.preference}>
            {option.preference === "system"
              ? `System (${resolveEffectiveMode("system")})`
              : option.preference === "light"
                ? "Light"
                : "Dark"}
          </option>
        ))}
        {allowFun ? (
          <optgroup label="Fun">
            {FUN_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.label}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </div>
  );
}
