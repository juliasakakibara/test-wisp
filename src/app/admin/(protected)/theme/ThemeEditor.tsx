"use client";

import Link from "next/link";
import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { saveTheme, saveConfig } from "@/lib/actions";
import { ThemeConfig, SiteConfig } from "@/lib/redis";
import { Settings, ExternalLink } from "lucide-react";

// ── Temas pré-definidos ────────────────────────────────────────────────────
const THEMES = [
  { name: "Neutro",    primary: "#6b7280", bg: "#ffffff", fg: "#111827", radius: "0",      font: "font-sans"  },
  { name: "Green",     primary: "#16a34a", bg: "#ffffff", fg: "#14532d", radius: "0.5rem", font: "font-sans"  },
  { name: "Blue",      primary: "#2563eb", bg: "#ffffff", fg: "#1e3a8a", radius: "0.5rem", font: "font-sans"  },
  { name: "Violet",    primary: "#7c3aed", bg: "#ffffff", fg: "#2e1065", radius: "0.75rem",font: "font-sans"  },
  { name: "Rose",      primary: "#e11d48", bg: "#ffffff", fg: "#4c0519", radius: "1rem",   font: "font-serif" },
  { name: "Orange",    primary: "#ea580c", bg: "#fffbeb", fg: "#431407", radius: "0.75rem",font: "font-sans"  },
  { name: "Minimal",   primary: "#18181b", bg: "#ffffff", fg: "#09090b", radius: "0",      font: "font-mono"  },
  { name: "Midnight",  primary: "#34d399", bg: "#0f172a", fg: "#f8fafc", radius: "0.5rem", font: "font-mono"  },
  { name: "Cream",     primary: "#92400e", bg: "#fef3c7", fg: "#1c1917", radius: "1rem",   font: "font-serif" },
  { name: "Lavender",  primary: "#a855f7", bg: "#faf5ff", fg: "#3b0764", radius: "1rem",   font: "font-sans"  },
];

const RADII = [
  { label: "Nenhum", value: "0" },
  { label: "Pequeno", value: "0.3rem" },
  { label: "Médio",  value: "0.6rem" },
  { label: "Grande", value: "1rem" },
];

const FONTS = [
  { label: "Mono",  value: "font-mono" },
  { label: "Sans",  value: "font-sans" },
  { label: "Serif", value: "font-serif" },
];

// ── Componente principal ───────────────────────────────────────────────────
export default function ThemeEditor({ initialTheme, initialConfig }: { initialTheme: ThemeConfig, initialConfig: SiteConfig }) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [saved, setSaved] = useState(false);
  const [selectedThemeName, setSelectedThemeName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Resizable Sidebar Logic ──
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const savedWidth = localStorage.getItem("admin_sidebar_width");
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRef.current) {
        const newWidth = Math.min(Math.max(260, e.clientX), 600);
        setSidebarWidth(newWidth);
        localStorage.setItem("admin_sidebar_width", newWidth.toString());
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
    iframeRef.current?.contentWindow?.postMessage({
      type: "CONTENT_PREVIEW",
      field,
      value
    }, "*");
  }, []);

  // ── Sync: Iframe -> Sidebar ──
  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

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
        setConfig(prev => ({ ...prev, [field]: value }));
        setSaved(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [theme, sendPreview]);

  // ── Theme Handlers ──
  function applyPreset(p: typeof THEMES[number]) {
    const newTheme: ThemeConfig = {
      primary: p.primary,
      background: p.bg,
      foreground: p.fg,
      radius: p.radius,
      fontFamily: p.font,
    };
    setTheme(newTheme);
    setSelectedThemeName(p.name);
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

  // ── Config Handlers ──
  function updateConfig(key: keyof SiteConfig, value: string) {
    setConfig({ ...config, [key]: value });
    setSaved(false);
    sendConfigPreview(key, value);
  }

  function handleSave() {
    startTransition(async () => {
      await saveTheme(theme);
      await saveConfig(config);
      localStorage.removeItem("wisp_content_cache");
      setSaved(true);
    });
  }

  return (
    <div className="fixed inset-0 flex bg-[#0f0f0f] font-mono overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside 
        className="relative z-20 shrink-0 flex flex-col border-r border-white/10 bg-[#0f0f0f]"
        style={{ width: `${sidebarWidth}px` }}
      >

        {/* Logo/título */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10 shrink-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">Visual Editor</p>
          <h1 className="text-sm font-semibold text-white mt-0.5">Configurações globais</h1>
        </div>

        <div className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">

          {/* ── Site & SEO ── */}
          <section className="space-y-4">
            <SectionLabel icon={<Settings size={12}/>}>Site & SEO</SectionLabel>
            <div className="space-y-3">
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

          {/* ── Temas pré-definidos ── */}
          <div>
            <SectionLabel icon={<Settings size={12}/>}>Tema Rápido</SectionLabel>
            <div className="grid grid-cols-2 gap-1.5 mt-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => applyPreset(t)}
                  className="group relative flex items-center gap-2 px-2.5 py-2 rounded-md border transition-all text-left"
                  style={{
                    borderColor: selectedThemeName === t.name ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)",
                    backgroundColor: selectedThemeName === t.name ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                >
                  <span className="relative shrink-0 w-5 h-5 rounded-full border border-white/20 overflow-hidden">
                    <span className="absolute inset-0" style={{ backgroundColor: t.bg }} />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-tl-full" style={{ backgroundColor: t.primary }} />
                  </span>
                  <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors truncate">
                    {t.name}
                  </span>
                  {selectedThemeName === t.name && (
                    <span className="absolute right-2 text-white/60 text-[10px]">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Cor Primária ── */}
          <div>
            <SectionLabel icon={<Settings size={12}/>}>Cores</SectionLabel>
            <div className="space-y-1.5 mt-2">
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
          </div>

          {/* ── Radius ── */}
          <div>
            <SectionLabel icon={<Settings size={12}/>}>Bordas</SectionLabel>
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {RADII.map((r) => (
                <button
                  key={r.value}
                  onClick={() => updateRaw("radius", r.value)}
                  className="flex flex-col items-center gap-1.5 py-2 rounded transition-colors"
                  style={{
                    backgroundColor: theme.radius === r.value ? "rgba(255,255,255,0.1)" : "transparent",
                    border: `1px solid ${theme.radius === r.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span
                    className="w-4 h-4 border border-white/40"
                    style={{ borderRadius: r.value }}
                  />
                  <span className="text-[9px] text-white/40">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Fonte ── */}
          <div>
            <SectionLabel icon={<Settings size={12}/>}>Tipografia</SectionLabel>
            <div className="flex gap-1.5 mt-2">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => updateRaw("fontFamily", f.value)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded transition-colors"
                  style={{
                    backgroundColor: theme.fontFamily === f.value ? "rgba(255,255,255,0.1)" : "transparent",
                    border: `1px solid ${theme.fontFamily === f.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span
                    className="text-base text-white/70"
                    style={{
                      fontFamily: f.value === "font-mono" ? "monospace" : f.value === "font-serif" ? "serif" : "sans-serif",
                    }}
                  >
                    Aa
                  </span>
                  <span className="text-[9px] text-white/40">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Rodapé ── */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#0f0f0f]">
          {!saved ? (
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full py-2.5 bg-white text-black rounded-md text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Salvar Configurações"}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] text-green-400 text-center py-1">
                ✓ Tudo salvo com sucesso!
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md border border-white/20 text-xs text-white/60 hover:text-white hover:border-white/40 transition-colors"
                >
                  Ver Blog <ExternalLink size={12}/>
                </Link>
                <button
                  onClick={() => setSaved(false)}
                  className="py-2 rounded-md bg-white/10 text-xs text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Resizer Drag Handle ── */}
      <div 
        className="relative z-50 w-4 -ml-2 -mr-2 cursor-col-resize flex flex-col justify-center items-center hover:bg-white/[0.02] transition-colors shrink-0 group self-stretch"
        onMouseDown={(e) => {
          e.preventDefault();
          isResizingRef.current = true;
          setIsResizing(true);
          document.body.style.cursor = "col-resize";
        }}
      >
        <div className="w-[2px] h-8 bg-white/10 group-hover:bg-white/40 rounded-full transition-colors" />
      </div>

      {/* ── Preview (iframe) ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f5f5f5] relative">
        <div className="absolute inset-x-0 top-0 h-10 bg-[#0f0f0f] border-b border-white/10 flex items-center px-4 justify-between z-10">
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
           </div>
           <span className="text-[10px] text-white/40 tracking-wider">VISUAL EDITOR MODE <span className="text-green-500 ml-1">● ACTIVE</span></span>
           <div className="flex gap-2">
             <button onClick={() => { if(iframeRef.current) iframeRef.current.src = "/"; }} className="text-[9px] text-white/30 hover:text-white">Home</button>
             <button onClick={() => { if(iframeRef.current) iframeRef.current.src = "/about"; }} className="text-[9px] text-white/30 hover:text-white">About</button>
           </div>
        </div>
        
        <iframe
          ref={iframeRef}
          src="/"
          className="flex-1 w-full bg-white pt-10"
          title="Blog Preview"
          style={{ pointerEvents: isResizing ? "none" : "auto" }}
        />
      </main>
    </div>
  );
}

// ── Subcomponentes ─────────────────────────────────────────────────────────
function SectionLabel({ children, icon }: { children: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 flex items-center gap-2">
      {icon}
      {children}
    </p>
  );
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 font-medium ml-1">{label}</label>
      <input 
        type="text" 
        value={value ?? ""} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
      />
    </div>
  );
}

function TextAreaGroup({ label, value, onChange, rows = 3 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 font-medium ml-1">{label}</label>
      <textarea 
        rows={rows}
        value={value ?? ""} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all resize-none"
      />
    </div>
  );
}

function ColorInput({
  label, value, onChange
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  const isHex = value.startsWith("#");
  const defaultHex = isHex ? value.slice(0, 7) : "#888888";
  const [computedHex, setComputedHex] = useState<string | null>(null);

  const hex = isHex ? defaultHex : (computedHex || "#888888");

  useEffect(() => {
    let active = true;
    if (value.startsWith("#")) {
      return;
    }
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
    return () => { active = false; };
  }, [value]);

  return (
    <div className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-white/10 bg-white/[0.03] hover:border-white/20 transition-colors">
      <label className="relative cursor-pointer shrink-0">
        <span
          className="block w-5 h-5 rounded border border-white/20"
          style={{ backgroundColor: hex }}
        />
        <input
          type="color"
          value={hex.length === 7 ? hex : "#888888"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>

      <span className="text-[10px] text-white/30 w-16 shrink-0">{label}</span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[11px] text-white/60 focus:text-white focus:outline-none min-w-0"
        spellCheck={false}
      />
    </div>
  );
}
