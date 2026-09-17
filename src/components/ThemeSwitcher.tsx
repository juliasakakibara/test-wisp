"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  applyColorModePreference,
  COLOR_MODE_STORAGE_KEY,
  preferenceFromPresetName,
  preferenceLabel,
  PUBLIC_COLOR_MODE_OPTIONS,
  readStoredPreference,
  resolveEffectiveMode,
  type ColorMode,
  type ColorModePreference,
} from "@/lib/color-mode";
import {
  applyFunTheme,
  FUN_THEMES,
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

export function ThemeSwitcher() {
  const pathname = usePathname() ?? "/";
  const allowFun = pathAllowsFunThemes(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [preference, setPreference] = useState<ColorModePreference>("system");
  const [effectiveMode, setEffectiveMode] = useState<ColorMode>("light");
  const [funTheme, setFunTheme] = useState<FunThemeId | null>(null);
  const [inAdminIframe, setInAdminIframe] = useState(false);
  const hydrated = useHydrated();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    setInAdminIframe(isInAdminIframe());
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || inAdminIframe) return;

    const storedRaw = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (storedRaw === null) {
      setPreference("system");
      setEffectiveMode(resolveEffectiveMode("system"));
    } else {
      const stored = readStoredPreference();
      const effective = applyColorModePreference(stored);
      setPreference(stored);
      setEffectiveMode(effective);
    }

    const activeFun = syncFunThemeForPath(pathname);
    setFunTheme(allowFun ? activeFun : null);
  }, [hydrated, inAdminIframe, pathname, allowFun]);

  useEffect(() => {
    if (!hydrated || inAdminIframe || preference !== "system" || funTheme) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const effective = applyColorModePreference("system");
      setEffectiveMode(effective);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hydrated, inAdminIframe, preference, funTheme]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !toggleRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  const handleSelectCore = (name: string) => {
    const nextPreference = preferenceFromPresetName(name);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextPreference);
    writeStoredFunTheme(null);
    applyFunTheme(null);
    const effective = applyColorModePreference(nextPreference);
    setPreference(nextPreference);
    setEffectiveMode(effective);
    setFunTheme(null);
    setIsOpen(false);
    notifyThemeChange();
    toggleRef.current?.focus();
  };

  const handleSelectFun = (id: FunThemeId) => {
    writeStoredFunTheme(id);
    applyFunTheme(id);
    setFunTheme(id);
    setIsOpen(false);
    notifyThemeChange();
    toggleRef.current?.focus();
  };

  if (!hydrated || inAdminIframe) return null;

  const activeLabel = funTheme
    ? FUN_THEMES.find((t) => t.id === funTheme)?.label ?? "Theme"
    : preferenceLabel(preference);

  return (
    <div className="theme-switcher">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher__toggle"
        aria-label="Theme"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-switcher-menu"
      >
        <span className="theme-switcher__toggle-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </span>
        <span className="theme-switcher__toggle-label">{activeLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="theme-switcher-menu"
          className="theme-switcher__menu"
          role="menu"
          aria-label="Theme"
        >
          <div className="theme-switcher__list" role="group" aria-label="Core">
            <p className="theme-switcher__group-label">Core</p>
            {PUBLIC_COLOR_MODE_OPTIONS.map((option) => {
              const isActive = !funTheme && preference === option.preference;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => handleSelectCore(option.name)}
                  className={`theme-switcher__option${isActive ? " theme-switcher__option--active" : ""}`}
                  role="menuitemradio"
                  aria-checked={isActive}
                >
                  {isActive ? (
                    <span className="theme-switcher__check" aria-hidden="true">
                      ✓
                    </span>
                  ) : (
                    <span className="theme-switcher__check theme-switcher__check--empty" aria-hidden="true" />
                  )}
                  {option.name}
                  {option.preference === "system" && !funTheme && (
                    <span className="theme-switcher__option-hint">
                      ({effectiveMode === "dark" ? "dark" : "light"})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {allowFun ? (
            <div className="theme-switcher__list" role="group" aria-label="Fun">
              <p className="theme-switcher__group-label">Fun</p>
              {FUN_THEMES.map((theme) => {
                const isActive = funTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectFun(theme.id)}
                    className={`theme-switcher__option${isActive ? " theme-switcher__option--active" : ""}`}
                    role="menuitemradio"
                    aria-checked={isActive}
                  >
                    {isActive ? (
                      <span className="theme-switcher__check" aria-hidden="true">
                        ✓
                      </span>
                    ) : (
                      <span className="theme-switcher__check theme-switcher__check--empty" aria-hidden="true" />
                    )}
                    <span
                      className="theme-switcher__swatch"
                      style={{ background: theme.background, boxShadow: `inset 0 0 0 1px ${theme.border}` }}
                      aria-hidden="true"
                    />
                    <span
                      className="theme-switcher__swatch"
                      style={{ background: theme.foreground }}
                      aria-hidden="true"
                    />
                    {theme.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
