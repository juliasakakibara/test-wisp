"use client";

import { useEffect, useState } from "react";

/**
 * Theme Switcher - Client Component (Isolated)
 * - Allows visitors to choose themes on the public site
 * - Manages theme state in LocalStorage (not Redis)
 * - Updates CSS Custom Properties on <html> directly
 * - No server round-trip needed for visitor theme preference
 */

type ThemePreset = {
  name: string;
  primary: string;
  background: string;
  foreground: string;
  radius: string;
  fontFamily: string;
};

const THEME_PRESETS: ThemePreset[] = [
  {
    name: "Neutral",
    primary: "#6b7280",
    background: "#ffffff",
    foreground: "#111827",
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
    name: "Dark",
    primary: "#34d399",
    background: "#0f172a",
    foreground: "#f8fafc",
    radius: "0.5rem",
    fontFamily: "font-mono",
  },
];

export function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load persisted theme from localStorage on mount
    const savedTheme = localStorage.getItem("user_theme_preference");
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        applyTheme(theme);
      } catch {
        // Silently fail if localStorage is corrupted
      }
    }
  }, []);

  const applyTheme = (theme: ThemePreset) => {
    const html = document.documentElement;
    html.style.setProperty("--primary", theme.primary);
    html.style.setProperty("--background", theme.background);
    html.style.setProperty("--foreground", theme.foreground);
    html.style.setProperty("--radius", theme.radius);
    html.style.setProperty(
      "--font-family",
      theme.fontFamily === "font-mono"
        ? "monospace"
        : theme.fontFamily === "font-serif"
          ? "serif"
          : "sans-serif"
    );
    // Persist to localStorage
    localStorage.setItem("user_theme_preference", JSON.stringify(theme));
  };

  // Don't render until hydrated to avoid mismatch
  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded text-sm border border-[var(--foreground)]/20 hover:bg-[var(--background)]/80 transition-colors"
        aria-label="Toggle theme selector"
        aria-expanded={isOpen}
      >
        🎨
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 bg-[var(--background)] border border-[var(--foreground)]/20 rounded shadow-lg p-3 min-w-48 z-40"
          role="menu"
        >
          <div className="space-y-2">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.name}
                onClick={() => {
                  applyTheme(theme);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--foreground)]/5 transition-colors text-sm text-left"
                role="menuitem"
              >
                {/* Color preview */}
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: theme.background }}
                  />
                </div>
                <span className="text-[var(--foreground)]/80">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
