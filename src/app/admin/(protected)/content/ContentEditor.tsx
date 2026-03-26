"use client";

import Link from "next/link";
import { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { saveConfig } from "@/lib/actions";
import { SiteConfig } from "@/lib/redis";
import { Settings, Image, Layout, FileText, ChevronRight, Save, ExternalLink, MousePointer2 } from "lucide-react";

export default function ContentEditor({ initial }: { initial: SiteConfig }) {
  const [config, setConfig] = useState<SiteConfig>(initial);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Persistência Local (Cache de Edição) ──
  useEffect(() => {
    const cached = localStorage.getItem("wisp_content_cache");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Só aplica se for um objeto válido
        if (parsed && typeof parsed === "object") {
          setConfig(prev => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error("Erro ao carregar cache local", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!saved) {
      localStorage.setItem("wisp_content_cache", JSON.stringify(config));
    }
  }, [config, saved]);

  // ── Sync: Sidebar -> Iframe ──
  const sendToPreview = useCallback((field: keyof SiteConfig, value: string) => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "CONTENT_PREVIEW",
      field,
      value
    }, "*");
  }, []);

  // ── Ref para ter sempre o estado mais atualizado sem re-registrar o listener ──
  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  // ── Sync: Iframe -> Sidebar ──
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 🚀 Sincronização Robusta: Envia o estado COMPLETO
      if (event.data?.type === "IFRAME_READY") {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;

        // 1. Ativa Modo Edição
        win.postMessage({ type: "VISUAL_EDIT_MODE", mode: "on" }, "*");

        // 2. Sincroniza o estado COMPLETO (Memória Temporária)
        win.postMessage({ type: "SYNC_STATE", config: configRef.current }, "*");
      }

      if (event.data?.type === "CONTENT_CHANGE") {
        const { field, value } = event.data;
        setConfig(prev => ({ ...prev, [field]: value }));
        setSaved(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // Estável

  // ── Ativar modo de edição no iframe quando carregar ──
  const initIframe = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "VISUAL_EDIT_MODE",
      mode: "on"
    }, "*");
  };

  function update(key: keyof SiteConfig, value: string) {
    setConfig({ ...config, [key]: value });
    setSaved(false);
    sendToPreview(key, value);
  }

  function handleSave() {
    startTransition(async () => {
      await saveConfig(config);
      localStorage.removeItem("wisp_content_cache");
      setSaved(true);
    });
  }

  return (
    <div className="fixed inset-0 flex bg-[#0f0f0f] font-mono overflow-hidden">
      
      {/* ── Sidebar ── */}
      <aside className="w-[300px] shrink-0 flex flex-col border-r border-white/10">
        
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">Admin</p>
          <h1 className="text-sm font-semibold text-white mt-0.5">
            Conteúdo Estático
          </h1>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex border-b border-white/10 bg-white/[0.02]">
          <Link 
            href="/admin/theme" 
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70 transition-all border-r border-white/10"
          >
            <Layout size={12} className="opacity-50" />
            Tema
          </Link>
          <Link 
            href="/admin/content" 
            className="flex-1 flex items-center justify-center gap-2 px-3 py-3 text-[10px] uppercase tracking-wider text-white border-b-2 border-primary bg-white/[0.03]"
          >
            <FileText size={12} className="text-primary" />
            Conteúdo
          </Link>
        </nav>

        {/* Editor Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-32 custom-scrollbar">
          
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-2">
            <p className="text-[10px] text-primary/80 flex items-center gap-2 leading-relaxed">
              <MousePointer2 size={12} />
              Você pode editar clicando diretamente nos textos no preview à direita!
            </p>
          </div>

          {/* SEO & Site */}
          <section className="space-y-4">
            <SectionLabel icon={<Settings size={12}/>}>Site & SEO</SectionLabel>
            <div className="space-y-3">
              <InputGroup 
                label="Nome do Site / Logo" 
                value={config.siteName} 
                onChange={(v) => update("siteName", v)} 
              />
              <TextAreaGroup 
                label="Descrição SEO" 
                value={config.siteDescription} 
                onChange={(v) => update("siteDescription", v)}
                rows={2}
              />
            </div>
          </section>

          {/* Home Page Content */}
          <section className="space-y-4">
            <SectionLabel icon={<Image size={12}/>}>Home (Hero)</SectionLabel>
            <div className="space-y-3">
              <InputGroup 
                label="Título do Hero" 
                value={config.heroTitle} 
                onChange={(v) => update("heroTitle", v)} 
              />
              <TextAreaGroup 
                label="Subtítulo do Hero" 
                value={config.heroDescription} 
                onChange={(v) => update("heroDescription", v)}
                rows={3}
              />
            </div>
          </section>

          {/* About Page Content */}
          <section className="space-y-4">
            <SectionLabel icon={<FileText size={12}/>}>Página Sobre</SectionLabel>
            <div className="space-y-3">
              <InputGroup 
                label="Título" 
                value={config.aboutTitle} 
                onChange={(v) => update("aboutTitle", v)} 
              />
              <TextAreaGroup 
                label="Introdução" 
                value={config.aboutIntro} 
                onChange={(v) => update("aboutIntro", v)}
                rows={2}
              />
              <TextAreaGroup 
                label="Corpo do Texto" 
                value={config.aboutBody} 
                onChange={(v) => update("aboutBody", v)}
                rows={6}
              />
            </div>
          </section>

          {/* Footer Content */}
          <section className="space-y-4">
            <SectionLabel icon={<Layout size={12}/>}>Rodapé (Footer)</SectionLabel>
            <div className="space-y-3">
              <InputGroup 
                label="Texto do Rodapé" 
                value={config.footerText} 
                onChange={(v) => update("footerText", v)} 
              />
            </div>
          </section>

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 bg-[#0f0f0f]">
          {saved ? (
             <div className="space-y-2">
              <p className="text-[10px] text-green-400 text-center py-1">
                ✓ Conteúdo salvo!
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-md border border-white/20 text-[10px] text-white/60 hover:text-white transition-colors"
                >
                  Ver <ExternalLink size={10}/>
                </Link>
                <button
                  onClick={() => setSaved(false)}
                  className="py-2 rounded-md bg-white/10 text-[10px] text-white/60 hover:text-white transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-md text-[11px] font-bold hover:bg-white/90 transition-all disabled:opacity-50"
            >
              <Save size={14} />
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </button>
          )}
        </div>

      </aside>

      {/* ── Preview ── */}
      <main className="flex-1 bg-[#f5f5f5] relative">
        <div className="absolute inset-x-0 top-0 h-10 bg-[#0f0f0f] border-b border-white/10 flex items-center px-4 justify-between z-10">
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
             <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
             <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
           </div>
           <span className="text-[10px] text-white/40 tracking-wider">VISUAL EDITOR MODE <span className="text-green-500 ml-1">● ACTIVE</span></span>
           <div className="flex gap-2">
             <button onClick={() => iframeRef.current!.src = "/"} className="text-[9px] text-white/30 hover:text-white">Home</button>
             <button onClick={() => iframeRef.current!.src = "/about"} className="text-[9px] text-white/30 hover:text-white">About</button>
           </div>
        </div>
        <iframe
          ref={iframeRef}
          src="/"
          className="w-full h-full pt-10"
          title="Preview"
          onLoad={initIframe}
        />
      </main>

    </div>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/20 flex items-center gap-2">
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
