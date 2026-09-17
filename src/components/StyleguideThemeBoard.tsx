"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  FUN_THEMES,
  getFunTheme,
  readStoredFunTheme,
  type FunThemeId,
} from "@/lib/fun-themes";
import {
  preferenceLabel,
  readStoredPreference,
  resolveEffectiveMode,
  type ColorModePreference,
} from "@/lib/color-mode";
import { contrastRatio } from "@/lib/theme-presets";
import { THEME_CHANGE_EVENT } from "@/lib/fun-themes";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

type PreviewPair = {
  name: string;
  background: string;
  foreground: string;
  primary: string;
  mutedForeground: string;
  border: string;
  source: "fun" | "core";
};

function readCorePair(preference: ColorModePreference): PreviewPair {
  const mode = resolveEffectiveMode(preference);
  if (mode === "dark") {
    return {
      name: preferenceLabel(preference) + (preference === "system" ? " → Dark" : ""),
      background: "#000000",
      foreground: "#ffffff",
      primary: "#ffffff",
      mutedForeground: "#a3a3a3",
      border: "rgba(255, 255, 255, 0.15)",
      source: "core",
    };
  }
  return {
    name: preferenceLabel(preference) + (preference === "system" ? " → Light" : ""),
    background: "#ffffff",
    foreground: "#000000",
    primary: "#000000",
    mutedForeground: "#737373",
    border: "rgba(0, 0, 0, 0.15)",
    source: "core",
  };
}

function resolvePreview(): PreviewPair {
  const fun = readStoredFunTheme();
  if (fun) {
    const theme = getFunTheme(fun);
    return {
      name: theme.label,
      background: theme.background,
      foreground: theme.foreground,
      primary: theme.primary,
      mutedForeground: theme.mutedForeground,
      border: theme.border,
      source: "fun",
    };
  }
  return readCorePair(readStoredPreference());
}

/** randoma11y-style pair board for the active home/styleguide theme */
export function StyleguideThemeBoard() {
  const hydrated = useHydrated();
  const [pair, setPair] = useState<PreviewPair | null>(null);
  const [funId, setFunId] = useState<FunThemeId | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const refresh = () => {
      setPair(resolvePreview());
      setFunId(readStoredFunTheme());
    };

    refresh();

    const onStorage = (event: StorageEvent) => {
      if (
        event.key === "home_fun_theme" ||
        event.key === "user_color_mode" ||
        event.key === null
      ) {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(THEME_CHANGE_EVENT, refresh);
    };
  }, [hydrated]);

  if (!hydrated || !pair) {
    return (
      <section className="sg-theme-board sg-theme-board--pending" aria-label="Theme preview">
        <p className="sg-theme-board__hint">Loading theme…</p>
      </section>
    );
  }

  const ratio = contrastRatio(pair.foreground, pair.background);

  return (
    <section className="sg-theme-board" aria-label="Active theme style guide">
      <div
        className="sg-theme-board__stage"
        style={{ backgroundColor: pair.background, color: pair.foreground }}
      >
        <p className="sg-theme-board__eyebrow">
          {pair.source === "fun" ? "Fun theme" : "Core"} · live from localStorage
        </p>
        <h2 className="sg-theme-board__title">{pair.name}</h2>
        <p className="sg-theme-board__ratio">
          Contrast {ratio.toFixed(2)}:1 · WCAG {ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "fail"}
        </p>
        <p className="sg-theme-board__sample">
          The quick brown fox jumps over the lazy dog. Design tokens stay readable when contrast
          holds.
        </p>
      </div>

      <ul className="sg-theme-board__swatches">
        {(
          [
            ["background", pair.background],
            ["foreground", pair.foreground],
            ["primary", pair.primary],
            ["muted", pair.mutedForeground],
            ["border", pair.border],
          ] as const
        ).map(([label, value]) => (
          <li key={label} className="sg-theme-board__swatch-item">
            <span
              className="sg-theme-board__chip"
              style={{ background: value }}
              aria-hidden="true"
            />
            <span className="sg-theme-board__swatch-meta">
              <strong>{label}</strong>
              <code>{value}</code>
            </span>
          </li>
        ))}
      </ul>

      <p className="sg-theme-board__note">
        Change theme in the header (home / styleguide). Fun themes persist in{" "}
        <code>home_fun_theme</code>
        {funId ? ` · active: ${FUN_THEMES.find((t) => t.id === funId)?.label}` : ""}. Project pages
        keep Core only.
      </p>
    </section>
  );
}
