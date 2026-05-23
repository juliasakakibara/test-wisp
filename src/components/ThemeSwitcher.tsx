"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [preference, setPreference] = useState<ColorModePreference>("system");
  const [effectiveMode, setEffectiveMode] = useState<ColorMode>("light");
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
      return;
    }

    const stored = readStoredPreference();
    const effective = applyColorModePreference(stored);
    setPreference(stored);
    setEffectiveMode(effective);
  }, [hydrated, inAdminIframe]);

  useEffect(() => {
    if (!hydrated || inAdminIframe || preference !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const effective = applyColorModePreference("system");
      setEffectiveMode(effective);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [hydrated, inAdminIframe, preference]);

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

  const handleSelect = (name: string) => {
    const nextPreference = preferenceFromPresetName(name);
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, nextPreference);
    const effective = applyColorModePreference(nextPreference);
    setPreference(nextPreference);
    setEffectiveMode(effective);
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  if (!hydrated || inAdminIframe) return null;

  const activeLabel = preferenceLabel(preference);

  return (
    <div className="theme-switcher">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="theme-switcher__toggle"
        aria-label="Toggle color mode"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="theme-switcher-menu"
      >
        <span className="theme-switcher__toggle-label">{activeLabel}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="theme-switcher-menu"
          className="theme-switcher__menu"
          role="menu"
          aria-label="Color mode"
        >
          <div className="theme-switcher__list">
            {PUBLIC_COLOR_MODE_OPTIONS.map((option) => {
              const isActive = preference === option.preference;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => handleSelect(option.name)}
                  className={`theme-switcher__option${isActive ? " theme-switcher__option--active" : ""}`}
                  role="menuitem"
                  aria-selected={isActive}
                >
                  <span className="theme-switcher__mode-icon" aria-hidden="true">
                    {option.preference === "dark"
                      ? "●"
                      : option.preference === "light"
                        ? "○"
                        : "◐"}
                  </span>
                  {option.name}
                  {option.preference === "system" && (
                    <span className="theme-switcher__option-hint">
                      ({effectiveMode === "dark" ? "dark" : "light"})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
