"use client";

import Link from "next/link";
import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { saveTheme, saveConfig, listPosts, savePost, deletePost } from "@/lib/actions";
import { ThemeConfig, SiteConfig, BlogPost } from "@/lib/redis";
import { Settings, ExternalLink, FileText, Plus, Palette, PenTool, LayoutTemplate } from "lucide-react";
import TipTapEditor from "@/components/TipTapEditor";

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

  // ── CMS States ──
  const [activeTab, setActiveTab] = useState<"pages" | "theme" | "settings">("theme");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activePost, setActivePost] = useState<BlogPost | "new"| null>(null);
  const [draftPost, setDraftPost] = useState<Partial<BlogPost>>({});

  useEffect(() => {
    if (activePost === "new") {
      setDraftPost({ title: "", slug: "", category: "article", tags: [], content: "", published: true });
    } else if (activePost) {
      setDraftPost({ ...activePost });
    }
  }, [activePost]);

  // ── Resizable Sidebar Logic ──
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    // Carrega a listagem de posts
    listPosts(0, 50, true).then(setPosts);

    const savedWidth = localStorage.getItem("admin_sidebar_width");
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRef.current) {
        const newWidth = Math.min(Math.max(260, e.clientX - 64), 600); // 64px = largura do menu lateral fixo
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

  // ── Handlers ──
  function applyPreset(p: typeof THEMES[number]) {
    const newTheme: ThemeConfig = {
      primary: p.primary, background: p.bg, foreground: p.fg, radius: p.radius, fontFamily: p.font,
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

  function updateConfig(key: keyof SiteConfig, value: string) {
    setConfig({ ...config, [key]: value });
    setSaved(false);
    sendConfigPreview(key, value);
  }

  function handleSaveThemeConfig() {
    startTransition(async () => {
      await saveTheme(theme);
      await saveConfig(config);
      localStorage.removeItem("wisp_content_cache");
      setSaved(true);
    });
  }

  function handleSavePost() {
    if(!draftPost.title || !draftPost.slug) return alert("Ops! Título e Slug são obrigatórios antes de salvar.");
    startTransition(async () => {
      await savePost(draftPost as BlogPost);
      listPosts(0, 50, true).then(setPosts);
      alert("Salvo com sucesso!");
      // Não limpa o activePost para mantermos no modo Edição contínua
      if(activePost === "new") {
         setActivePost({ ...(draftPost as BlogPost), createdAt: Date.now(), updatedAt: Date.now() });
      }
    });
  }

  function handleDeletePost() {
    if(!activePost || activePost === "new") return;
    if(confirm("Tem certeza que deseja apagar permanentemente? Essa ação não pode ser desfeita.")) {
      deletePost((activePost as BlogPost).slug).then(() => {
        listPosts(0, 50, true).then(setPosts);
        setActivePost(null);
      });
    }
  }

  const projectPosts = posts.filter(p => p.category === "project");
  const articlePosts = posts.filter(p => p.category === "article");

  return (
    <div className="fixed inset-0 flex bg-[#0f0f0f] font-mono overflow-hidden" style={{ colorScheme: 'dark' }}>

      {/* ── Camada 1: Menu Fixo Lateral (Adobe Portfolio Style) ── */}
      <nav className="w-16 shrink-0 flex flex-col items-center py-4 border-r border-white/10 bg-[#0a0a0a] z-30">
        <div className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center mb-8">P</div>
        
        <div className="flex flex-col gap-4 w-full px-2">
          <MenuButton 
            icon={<FileText size={18} />} 
            label="Páginas" 
            isActive={activeTab === "pages"} 
            onClick={() => { setActiveTab("pages"); setActivePost(null); }} 
          />
          <MenuButton 
            icon={<Palette size={18} />} 
            label="Temas" 
            isActive={activeTab === "theme"} 
            onClick={() => setActiveTab("theme")} 
          />
          <MenuButton 
            icon={<Settings size={18} />} 
            label="Ajustes" 
            isActive={activeTab === "settings"} 
            onClick={() => setActiveTab("settings")} 
          />
        </div>

        <div className="mt-auto pb-2 w-full px-2">
           <Link href="/" target="_blank" className="flex flex-col items-center gap-1 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all">
             <ExternalLink size={16} />
             <span className="text-[8px] uppercase tracking-widest mt-1">Sair</span>
           </Link>
        </div>
      </nav>

      {/* ── Camada 2: Painel Contextual ── */}
      <aside 
        className="relative z-20 shrink-0 flex flex-col border-r border-white/10 bg-[#0f0f0f]"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="px-5 pt-5 pb-4 border-b border-white/10 shrink-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
             {activeTab === "pages" ? "Conteúdo" : activeTab === "theme" ? "Visual Editor" : "Global"}
          </p>
          <h1 className="text-sm font-semibold text-white mt-0.5">
             {activeTab === "pages" ? "Publicações" : 
              activeTab === "theme" ? "Estilo do Site" : 
              "Configurações gerais"}
          </h1>
        </div>

        <div className="flex-1 p-4 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* Aba: Páginas (Gestão de Conteúdo e SEO Lateral) */}
          {activeTab === "pages" && activePost !== null && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
               <button onClick={() => setActivePost(null)} className="text-white/40 hover:text-white text-[10px] flex items-center gap-1 uppercase tracking-widest font-semibold pb-2 border-b border-white/5 w-full">
                 ← Voltar para Menu
               </button>
               
               <InputGroup label="Título da Página" value={draftPost.title || ""} onChange={(v) => setDraftPost(prev => ({...prev, title: v}))} />
               <InputGroup label="Endereço URL (Slug)" value={draftPost.slug || ""} onChange={(v) => setDraftPost(prev => ({...prev, slug: v.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')}))} />
               
               <div className="flex flex-col gap-1.5 focus-within:ring-1 ring-white/20 rounded-md">
                   <label className="text-[10px] text-white/40 font-medium ml-1">Classificação da Coleção</label>
                   <select value={draftPost.category || "article"} onChange={(e) => setDraftPost(prev => ({...prev, category: e.target.value as "article"|"project"}))} className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:bg-white/[0.05] cursor-pointer appearance-none">
                     <option value="article">Artigo / Pensamento</option>
                     <option value="project">Projeto / Case de Portfólio</option>
                   </select>
               </div>
               
               <div className="flex flex-col justify-end pb-2 pt-2">
                  <label className="flex items-center justify-between cursor-pointer w-full group p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.04] transition-colors">
                     <span className="text-xs font-semibold text-white/70 uppercase tracking-wide group-hover:text-white transition-colors">{draftPost.published ? 'Ativo (Visível)' : 'Rascunho (inativo)'}</span>
                     <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${draftPost.published ? 'bg-green-500' : 'bg-gray-600'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${draftPost.published ? 'translate-x-5' : 'translate-x-0'}`} />
                     </div>
                     <input type="checkbox" className="hidden" checked={draftPost.published || false} onChange={(e) => setDraftPost(prev => ({...prev, published: e.target.checked}))} />
                  </label>
               </div>

               <div className="pt-6 border-t border-white/10 space-y-2">
                   <button type="button" onClick={handleSavePost} disabled={isPending} className="w-full py-2.5 bg-white text-black rounded-md text-xs font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                     {isPending ? 'Salvando...' : 'Salvar Alterações'}
                   </button>
                   {activePost !== "new" && (
                     <button type="button" onClick={handleDeletePost} className="w-full py-2 text-red-500 bg-red-500/10 rounded-md text-xs font-bold hover:bg-red-500/20 transition-colors">
                       Deletar Página
                     </button>
                   )}
               </div>
            </div>
          )}

          {activeTab === "pages" && activePost === null && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <button 
                onClick={() => setActivePost("new")}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
              >
                <Plus size={14} /> Criar nova Publicação
              </button>

              <div className="space-y-4 pt-2">
                <div>
                  <SectionLabel icon={<LayoutTemplate size={12}/>}>Telas Fixas (Layout)</SectionLabel>
                  <div className="space-y-1 mt-2">
                     <button onClick={() => {if(iframeRef.current) iframeRef.current.src = "/";}} className="w-full text-left px-3 py-2 rounded-md text-white/70 hover:bg-white/5 hover:text-white text-[11px] transition-colors border border-transparent hover:border-white/5 font-medium">✨ Home (Capa)</button>
                     <button onClick={() => {if(iframeRef.current) iframeRef.current.src = "/about";}} className="w-full text-left px-3 py-2 rounded-md text-white/70 hover:bg-white/5 hover:text-white text-[11px] transition-colors border border-transparent hover:border-white/5 font-medium">✨ Sobre a Autora</button>
                  </div>
                </div>

                <div>
                  <SectionLabel icon={<FileText size={12}/>}>Coleção: Projetos</SectionLabel>
                  {projectPosts.length === 0 ? <p className="text-white/30 text-[10px] py-2 px-3 italic">Vazio. Crie seu primeiro case!</p> : (
                    <div className="space-y-1 mt-2">
                      {projectPosts.map(post => (
                        <button key={post.slug} onClick={() => setActivePost(post)} className="w-full text-left px-3 py-2 rounded-md text-white/70 hover:bg-white/5 hover:text-white text-[11px] transition-colors border border-transparent hover:border-white/5 flex justify-between items-center group">
                          <span className="truncate pr-2">{post.title}</span>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-125 transition-transform ${post.published ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <SectionLabel icon={<PenTool size={12}/>}>Coleção: Artigos</SectionLabel>
                  {articlePosts.length === 0 ? <p className="text-white/30 text-[10px] py-2 px-3 italic">Compartilhe um pensamento...</p> : (
                    <div className="space-y-1 mt-2">
                      {articlePosts.map(post => (
                        <button key={post.slug} onClick={() => setActivePost(post)} className="w-full text-left px-3 py-2 rounded-md text-white/70 hover:bg-white/5 hover:text-white text-[11px] transition-colors border border-transparent hover:border-white/5 flex justify-between items-center group">
                          <span className="truncate pr-2">{post.title}</span>
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 group-hover:scale-125 transition-transform ${post.published ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Aba: Temas */}
          {activeTab === "theme" && (
             <div className="space-y-8">
               <div>
                 <SectionLabel icon={<LayoutTemplate size={12}/>}>Tema Rápido</SectionLabel>
                 <div className="grid grid-cols-2 gap-1.5 mt-2">
                   {THEMES.map((t) => (
                     <button
                       key={t.name}
                       onClick={() => applyPreset(t)}
                       className="group relative flex items-center gap-2 px-2.5 py-2 rounded-md border transition-all text-left"
                       style={{ borderColor: selectedThemeName === t.name ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.08)", backgroundColor: selectedThemeName === t.name ? "rgba(255,255,255,0.08)" : "transparent" }}
                     >
                       <span className="relative shrink-0 w-5 h-5 rounded-full border border-white/20 overflow-hidden">
                         <span className="absolute inset-0" style={{ backgroundColor: t.bg }} />
                         <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-tl-full" style={{ backgroundColor: t.primary }} />
                       </span>
                       <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors truncate">{t.name}</span>
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <SectionLabel icon={<Palette size={12}/>}>Cores Base</SectionLabel>
                 <div className="space-y-1.5 mt-2">
                   <ColorInput label="Primary" value={theme.primary} onChange={(hex) => updateColor("primary", hex)} />
                   <ColorInput label="Background" value={theme.background} onChange={(hex) => updateColor("background", hex)} />
                   <ColorInput label="Foreground" value={theme.foreground} onChange={(hex) => updateColor("foreground", hex)} />
                 </div>
               </div>

               <div>
                 <SectionLabel icon={<Settings size={12}/>}>Bordas e Fontes</SectionLabel>
                 <div className="grid grid-cols-4 gap-1.5 mt-2 mb-4">
                   {RADII.map((r) => (
                     <button
                       key={r.value} onClick={() => updateRaw("radius", r.value)}
                       className="flex flex-col items-center gap-1.5 py-2 rounded transition-colors"
                       style={{ backgroundColor: theme.radius === r.value ? "rgba(255,255,255,0.1)" : "transparent", border: `1px solid ${theme.radius === r.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}` }}
                     >
                       <span className="w-4 h-4 border border-white/40" style={{ borderRadius: r.value }} />
                     </button>
                   ))}
                 </div>
                 <div className="flex gap-1.5">
                   {FONTS.map((f) => (
                     <button
                       key={f.value} onClick={() => updateRaw("fontFamily", f.value)}
                       className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded transition-colors"
                       style={{ backgroundColor: theme.fontFamily === f.value ? "rgba(255,255,255,0.1)" : "transparent", border: `1px solid ${theme.fontFamily === f.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}` }}
                     >
                       <span className="text-white/50 text-[10px]">{f.label}</span>
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          )}

          {/* Aba: Configurações Gerais */}
          {activeTab === "settings" && (
            <section className="space-y-4">
              <SectionLabel icon={<Settings size={12}/>}>Logotipo e SEO</SectionLabel>
              <div className="space-y-3">
                <InputGroup label="Nome do Site" value={config.siteName} onChange={(v) => updateConfig("siteName", v)} />
                <TextAreaGroup label="Descrição SEO" value={config.siteDescription} onChange={(v) => updateConfig("siteDescription", v)} rows={2} />
              </div>

              <SectionLabel icon={<FileText size={12}/>}>Textos Principais</SectionLabel>
              <div className="space-y-3">
                <InputGroup label="Hero Title" value={config.heroTitle} onChange={(v) => updateConfig("heroTitle", v)} />
                <TextAreaGroup label="Hero Description" value={config.heroDescription} onChange={(v) => updateConfig("heroDescription", v)} rows={2} />
                <TextAreaGroup label="Footer Text" value={config.footerText} onChange={(v) => updateConfig("footerText", v)} rows={1} />
              </div>
            </section>
          )}
        </div>

        {/* Rodapé do Painel Secundário */}
        {(activeTab === "theme" || activeTab === "settings") && (
          <div className="p-4 border-t border-white/10 shrink-0 bg-[#0f0f0f]">
            {!saved ? (
              <button
                onClick={handleSaveThemeConfig} disabled={isPending}
                className="w-full py-2.5 bg-white text-black rounded-md text-xs font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvando..." : "Atualizar Layout"}
              </button>
            ) : (
                <button onClick={() => setSaved(false)} className="w-full py-2.5 rounded-md bg-white/10 text-xs text-white/60 hover:bg-white/15 hover:text-white transition-colors">
                  Salvo com sucesso! Continuar editando
                </button>
            )}
          </div>
        )}
      </aside>

      {/* ── Resizer Drag Handle ── */}
      <div 
        className="relative z-50 w-4 -ml-2 -mr-2 cursor-col-resize flex flex-col justify-center items-center hover:bg-white/[0.02] transition-colors shrink-0 group self-stretch"
        onMouseDown={(e) => { e.preventDefault(); isResizingRef.current = true; setIsResizing(true); document.body.style.cursor = "col-resize"; }}
      >
        <div className="w-[2px] h-8 bg-white/10 group-hover:bg-white/40 rounded-full transition-colors" />
      </div>

      {/* ── Camada 3: O Editor / Preview do Site ──────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-[#f5f5f5]">
        
        {/* Modo Editor Foco Total (Notion Style) - Camada 3 Oculta Painel de Configurações */}
        {activePost !== null ? (
          <div className="flex-1 overflow-y-auto bg-white flex justify-center text-primary pt-16 pb-32">
             <div className="max-w-3xl w-full px-8 xl:px-0">
                
                {/* Cabeçalho Imersivo */}
                <div className="mb-10 pb-6 border-b border-gray-100 flex items-end">
                   <h1 className="text-5xl font-black tracking-tight text-gray-900 flex-1 leading-tight break-words">
                      {draftPost.title || "Página sem título"}
                   </h1>
                </div>

                <div className="mt-8 transition-opacity duration-300">
                     <TipTapEditor initialContent={draftPost.content || ""} onChange={(md) => setDraftPost(prev => ({...prev, content: md}))} />
                </div>
                
                {/* Footer Save Button Flutuante (Melhoria requisitada pela usuária) */}
                <div className="fixed bottom-6 right-6 z-50">
                   <button type="button" onClick={handleSavePost} disabled={isPending} className="px-6 py-3 bg-black text-white rounded-full text-sm font-bold shadow-xl hover:bg-gray-800 hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-2">
                     {isPending ? 'Salvando...' : 'Salvar Conteúdo'}
                   </button>
                </div>
             </div>
          </div>
        ) : (
          /* Editor de visual (Iframe do site real) */
          <>
            <div className="absolute inset-x-0 top-0 h-10 bg-[#0f0f0f] border-b border-white/10 flex items-center px-4 justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] text-white/40 tracking-wider">VISUAL PREVIEW</span>
              <div className="flex gap-2">
                <button onClick={() => { if(iframeRef.current) iframeRef.current.src = "/"; }} className="text-[9px] text-white/30 hover:text-white">Home</button>
              </div>
            </div>
            
            <iframe
              ref={iframeRef}
              src="/"
              className="flex-1 w-full bg-white pt-10"
              title="Blog Preview"
              style={{ pointerEvents: isResizing ? "none" : "auto" }}
            />
          </>
        )}

      </main>
    </div>
  );
}

// ── Subcomponentes ─────────────────────────────────────────────────────────

function MenuButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
        isActive ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      {icon}
      <span className="text-[9px] font-medium tracking-wide uppercase">{label}</span>
      {isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full 2xl" />}
    </button>
  );
}

function SectionLabel({ children, icon }: { children: React.ReactNode, icon?: React.ReactNode }) {
  return <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30 flex items-center gap-2">{icon}{children}</p>;
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 font-medium ml-1">{label}</label>
      <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all" />
    </div>
  );
}

function TextAreaGroup({ label, value, onChange, rows = 3 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-white/40 font-medium ml-1">{label}</label>
      <textarea rows={rows} value={value ?? ""}  onChange={(e) => onChange(e.target.value)} className="bg-white/[0.03] border border-white/10 rounded-md px-3 py-2 text-[11px] text-white/80 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all resize-none" />
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (color: string) => void; }) {
  const hex = value; // Simplificando color pick por hora
  return (
    <div className="flex items-center gap-2 px-2.5 py-2 rounded-md border border-white/10 bg-white/[0.03]">
      <label className="relative cursor-pointer shrink-0">
        <span className="block w-5 h-5 rounded border border-white/20" style={{ backgroundColor: hex }} />
        <input type="color" value={hex.length === 7 ? hex : "#888888"} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
      </label>
      <span className="text-[10px] text-white/30 w-16 shrink-0">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-[11px] text-white/60 focus:text-white focus:outline-none min-w-0"  />
    </div>
  );
}
