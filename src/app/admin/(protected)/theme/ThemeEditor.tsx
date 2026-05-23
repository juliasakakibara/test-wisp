"use client";

import Link from "next/link";
import { useState, useTransition, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { saveTheme, saveConfig, republishSite } from "@/lib/actions";
import { ThemeConfig, SiteConfig } from "@/lib/redis";
import { THEME_PRESETS, presetToThemeConfig } from "@/lib/theme-presets";
import { Settings, ExternalLink } from "lucide-react";

const RADII = [
  { label: "Nenhum", value: "0" },
  { label: "Pequeno", value: "0.3rem" },
  { label: "Médio", value: "0.6rem" },
  { label: "Grande", value: "1rem" },
];

const FONTS = [
  { label: "Mono", value: "font-mono" },
  { label: "Sans", value: "font-sans" },
  { label: "Serif", value: "font-serif" },
];

const DEFAULT_SIDEBAR_WIDTH = 320;
const SIDEBAR_WIDTH_KEY = "admin_sidebar_width";

function readStoredSidebarWidth(): number {
  const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
  if (!savedWidth) return DEFAULT_SIDEBAR_WIDTH;
  const width = parseInt(savedWidth, 10);
  return Number.isNaN(width) ? DEFAULT_SIDEBAR_WIDTH : width;
}

export default function ThemeEditor({
  initialTheme,
  initialConfig,
}: {
  initialTheme: ThemeConfig;
  initialConfig: SiteConfig;
}) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [saved, setSaved] = useState(false);
  const [republished, setRepublished] = useState(false);
  const [selectedThemeName, setSelectedThemeName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  useLayoutEffect(() => {
    setSidebarWidth(readStoredSidebarWidth());
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRef.current) {
        const newWidth = Math.min(Math.max(260, e.clientX), 600);
        setSidebarWidth(newWidth);
        localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
      }
    };
    const handleMouseUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const sendPreview = useCallback((t: ThemeConfig) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "THEME_PREVIEW", theme: t }, "*");
  }, []);

  const sendConfigPreview = useCallback((field: keyof SiteConfig, value: string) => {
    iframeRef.current?.contentWindow?.postMessage({ type: "CONTENT_PREVIEW", field, value }, "*");
  }, []);

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "IFRAME_READY") {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        win.postMessage({ type: "VISUAL_EDIT_MODE", mode: "on" }, "*");
        win.postMessage({ type: "SYNC_STATE", config: configRef.current }, "*");
        setTimeout(() => sendPreview(theme), 150);
      }

      if (event.data?.type === "CONTENT_CHANGE") {
        const { field, value } = event.data;
        setConfig((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme, sendPreview]);

  function applyPreset(preset: (typeof THEME_PRESETS)[number]) {
    const newTheme = presetToThemeConfig(preset);
    setTheme(newTheme);
    setSelectedThemeName(preset.name);
    setSaved(false);
    sendPreview(newTheme);
  }

  function updateColor(key: keyof ThemeConfig, newColor: string) {
    const newTheme = { ...theme, [key]: newColor };
    setTheme(newTheme);
    setSaved(false);
    sendPreview(newTheme);
  }

  function updateRaw(key: keyof ThemeConfig, value: string) {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    setSaved(false);
    sendPreview(newTheme);
  }

  function updateConfig(key: keyof SiteConfig, value: string) {
    setConfig({ ...config, [key]: value });
    setSaved(false);
    sendConfigPreview(key, value);
  }

  function handleSave() {
    startTransition(async () => {
      await saveTheme(theme);
      await saveConfig(config);
      setSaved(true);
      setRepublished(false);
      sendPreview(theme);
      iframeRef.current?.contentWindow?.postMessage(
        { type: "SYNC_STATE", config },
        "*"
      );
    });
  }

  function handleRepublish() {
    startTransition(async () => {
      await republishSite();
      setRepublished(true);
    });
  }

  function navigatePreview(href: string) {
    if (iframeRef.current) iframeRef.current.src = href;
  }

  return (
    <div className="admin-editor">
      <aside className="admin-sidebar" style={{ width: `${sidebarWidth}px` }}>
        <div className="admin-sidebar__header">
          <p className="admin-sidebar__eyebrow">Visual Editor</p>
          <h1 className="admin-sidebar__title">Configurações globais</h1>
        </div>

        <div className="admin-scroll">
          <div className="admin-stack admin-stack--lg">
            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Site & SEO</SectionLabel>
              <div className="admin-stack">
                <InputGroup
                  label="Nome do Site / Logo"
                  value={config.siteName}
                  onChange={(v) => updateConfig("siteName", v)}
                />
                <TextAreaGroup
                  label="Descrição SEO"
                  value={config.siteDescription}
                  onChange={(v) => updateConfig("siteDescription", v)}
                  rows={2}
                />
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Links & CTAs</SectionLabel>
              <div className="admin-stack">
                <InputGroup
                  label="GitHub URL"
                  value={config.githubUrl}
                  onChange={(v) => updateConfig("githubUrl", v)}
                />
                <InputGroup
                  label="LinkedIn URL"
                  value={config.linkedinUrl}
                  onChange={(v) => updateConfig("linkedinUrl", v)}
                />
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Seção Work</SectionLabel>
              <div className="admin-stack">
                <InputGroup
                  label="Título da seção"
                  value={config.workSectionTitle}
                  onChange={(v) => updateConfig("workSectionTitle", v)}
                />
                <TextAreaGroup
                  label="Intro da seção"
                  value={config.workSectionIntro}
                  onChange={(v) => updateConfig("workSectionIntro", v)}
                  rows={2}
                />
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Tema Rápido</SectionLabel>
              <div className="admin-preset-grid">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`admin-preset${selectedThemeName === preset.name ? " is-selected" : ""}`}
                  >
                    <span className="admin-preset__swatch">
                      <span
                        className="admin-preset__swatch-bg"
                        style={{ backgroundColor: preset.background }}
                      />
                      <span
                        className="admin-preset__swatch-primary"
                        style={{ backgroundColor: preset.primary }}
                      />
                    </span>
                    <span className="admin-preset__name">{preset.name}</span>
                    {selectedThemeName === preset.name ? (
                      <span className="admin-preset__check">✓</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Cores</SectionLabel>
              <div className="admin-color-list">
                <ColorInput
                  label="Primary"
                  value={theme.primary}
                  onChange={(hex) => updateColor("primary", hex)}
                />
                <ColorInput
                  label="Background"
                  value={theme.background}
                  onChange={(hex) => updateColor("background", hex)}
                />
                <ColorInput
                  label="Foreground"
                  value={theme.foreground}
                  onChange={(hex) => updateColor("foreground", hex)}
                />
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Bordas</SectionLabel>
              <div className="admin-option-grid">
                {RADII.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => updateRaw("radius", r.value)}
                    className={`admin-option${theme.radius === r.value ? " is-selected" : ""}`}
                  >
                    <span className="admin-option__preview" style={{ borderRadius: r.value }} />
                    <span className="admin-option__label">{r.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-section">
              <SectionLabel icon={<Settings size={12} />}>Tipografia</SectionLabel>
              <div className="admin-option-grid admin-option-grid--fonts">
                {FONTS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => updateRaw("fontFamily", f.value)}
                    className={`admin-option${theme.fontFamily === f.value ? " is-selected" : ""}`}
                  >
                    <span
                      className="admin-option__preview admin-option__preview--type"
                      style={{
                        fontFamily:
                          f.value === "font-mono"
                            ? "monospace"
                            : f.value === "font-serif"
                              ? "serif"
                              : "sans-serif",
                      }}
                    >
                      Aa
                    </span>
                    <span className="admin-option__label">{f.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="admin-sidebar__footer">
          {!saved ? (
            <div className="admin-sidebar__footer-actions">
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="admin-button"
              >
                {isPending ? "Salvando..." : "Salvar Configurações"}
              </button>
              <button
                type="button"
                onClick={handleRepublish}
                disabled={isPending}
                className="admin-button admin-button--ghost"
              >
                {isPending ? "Republicando..." : "Republicar conteúdo Wisp"}
              </button>
              {republished ? <p className="admin-status">✓ Cache do site invalidado</p> : null}
            </div>
          ) : (
            <div className="admin-sidebar__footer-actions">
              <p className="admin-status">✓ Tudo salvo com sucesso!</p>
              <div className="admin-button-grid">
                <Link href="/" target="_blank" className="admin-link">
                  Ver portfólio <ExternalLink size={12} />
                </Link>
                <button
                  type="button"
                  onClick={() => setSaved(false)}
                  className="admin-button admin-button--muted"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div
        className="admin-resizer"
        onMouseDown={(e) => {
          e.preventDefault();
          isResizingRef.current = true;
          setIsResizing(true);
          document.body.style.cursor = "col-resize";
        }}
      >
        <div className="admin-resizer__handle" />
      </div>

      <main className="admin-preview">
        <div className="admin-preview__chrome">
          <div className="admin-preview__dots">
            <div className="admin-preview__dot admin-preview__dot--red" />
            <div className="admin-preview__dot admin-preview__dot--amber" />
            <div className="admin-preview__dot admin-preview__dot--green" />
          </div>
          <span className="admin-preview__status">
            VISUAL EDITOR MODE
            <span className="admin-preview__status-live">● ACTIVE</span>
          </span>
          <div className="admin-preview__nav">
            <button type="button" className="admin-preview__nav-btn" onClick={() => navigatePreview("/")}>
              Home
            </button>
            <button
              type="button"
              className="admin-preview__nav-btn"
              onClick={() => navigatePreview("/#about")}
            >
              About
            </button>
          </div>
        </div>

        <iframe
          ref={iframeRef}
          src="/"
          className="admin-preview__iframe"
          title="Portfolio Preview"
          style={{ pointerEvents: isResizing ? "none" : "auto" }}
        />
      </main>
    </div>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <p className="admin-section-label">
      {icon}
      {children}
    </p>
  );
}

function InputGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      />
    </div>
  );
}

function TextAreaGroup({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="admin-textarea"
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const isHex = value.startsWith("#");
  const defaultHex = isHex ? value.slice(0, 7) : "#888888";
  const [computedHex, setComputedHex] = useState<string | null>(null);

  const hex = isHex ? defaultHex : computedHex || "#888888";

  useEffect(() => {
    let active = true;
    if (value.startsWith("#")) return;

    const el = document.createElement("div");
    el.style.color = value;
    el.style.display = "none";
    document.body.appendChild(el);
    const comp = window.getComputedStyle(el).color;
    document.body.removeChild(el);

    const match = comp.match(/(?:rgb|rgba)\((\d+),\s*(\d+),\s*(\d+)/);
    if (match && active) {
      const toHexStr = (n: string) => parseInt(n, 10).toString(16).padStart(2, "0");
      setTimeout(() => {
        if (active) setComputedHex(`#${toHexStr(match[1])}${toHexStr(match[2])}${toHexStr(match[3])}`);
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [value]);

  return (
    <div className="admin-color-row">
      <label className="admin-color-row__picker">
        <span className="admin-color-row__swatch" style={{ backgroundColor: hex }} />
        <input
          type="color"
          value={hex.length === 7 ? hex : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="admin-color-row__picker-input"
        />
      </label>
      <span className="admin-color-row__label">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-color-row__text"
        spellCheck={false}
      />
    </div>
  );
}
