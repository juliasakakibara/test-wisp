"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getFunTheme,
  readStoredFunTheme,
  THEME_CHANGE_EVENT,
} from "@/lib/fun-themes";
import {
  preferenceLabel,
  readStoredPreference,
  resolveEffectiveMode,
  type ColorModePreference,
} from "@/lib/color-mode";
import { contrastRatio } from "@/lib/theme-presets";

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
  source: "fun" | "core";
};

function readCorePair(preference: ColorModePreference): PreviewPair {
  const mode = resolveEffectiveMode(preference);
  if (mode === "dark") {
    return {
      name: preferenceLabel(preference) + (preference === "system" ? " → Dark" : ""),
      background: "#000000",
      foreground: "#ffffff",
      source: "core",
    };
  }
  return {
    name: preferenceLabel(preference) + (preference === "system" ? " → Light" : ""),
    background: "#ffffff",
    foreground: "#000000",
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
      source: "fun",
    };
  }
  return readCorePair(readStoredPreference());
}

function wcagLabel(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA large";
  return "fail";
}

/** Lean randoma11y / colorable-style board for the active theme */
export function StyleguideThemeBoard() {
  const hydrated = useHydrated();
  const [pair, setPair] = useState<PreviewPair | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const refresh = () => {
      setPair(resolvePreview());
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
      <section className="sg-lean sg-lean--pending" aria-label="Theme preview">
        <p>Loading theme…</p>
      </section>
    );
  }

  const ratio = contrastRatio(pair.foreground, pair.background);

  return (
    <section className="sg-lean" aria-label="Active theme style guide">
      <header className="sg-lean__hero">
        <p className="sg-lean__specimen" aria-hidden="true">
          Aa
        </p>
        <div className="sg-lean__score">
          <p className="sg-lean__ratio">
            {ratio.toFixed(2)} <span>{wcagLabel(ratio)}</span>
          </p>
          <p className="sg-lean__name">
            {pair.source === "fun" ? "Fun" : "Core"} · {pair.name}
          </p>
          <p className="sg-lean__blurb">
            Contrast is the difference in luminance that makes text distinguishable from its
            background. Pick a theme in the header to live-update this page.
          </p>
        </div>
      </header>

      <div className="sg-lean__pair">
        <div className="sg-lean__swatch">
          <span className="sg-lean__swatch-label">Background</span>
          <code className="sg-lean__hex">{pair.background}</code>
        </div>
        <div className="sg-lean__swatch">
          <span className="sg-lean__swatch-label">Text</span>
          <code className="sg-lean__hex">{pair.foreground}</code>
        </div>
      </div>

      <blockquote className="sg-lean__quote">
        <p>
          “Color is my day-long obsession, joy, and torment.”
        </p>
        <cite>— Claude Monet</cite>
      </blockquote>

      <pre className="sg-lean__code">{`:root {
  --background: ${pair.background};
  --foreground: ${pair.foreground};
  --link: color-mix(in srgb, var(--foreground) 62%, transparent);
  --link-strong: var(--foreground);
  --link-underline: var(--foreground);
}`}</pre>

      <div className="sg-lean__links" aria-label="Link contract">
        <p className="sg-lean__links-title">Link</p>
        <div className="sg-lean__link-row">
          <a href="#main-content" className="link">
            default
          </a>
          <a href="#main-content" className="link is-current">
            nav active
          </a>
          <span className="sg-lean__control-demo" aria-hidden="true">
            <span>theme:</span>&nbsp;system ▼
          </span>
        </div>
        <p className="sg-lean__emphasis-demo">
          DESIGN FOR <em className="hero-title__emphasis">UNUSUAL</em> PROBLEMS
        </p>
        <p className="sg-lean__link-note">
          Default: italic + `--link` (~62% foreground). Hover/focus: full opacity +
          underline. Nav active: italic + `--link-underline` (no fill chip). Theme:
          control, not link. Hero emphasis: italic + heavier weight, no underline.
        </p>
      </div>
    </section>
  );
}
