import type { Metadata } from "next";
import { StyleguideThemeBoard } from "@/components/StyleguideThemeBoard";

export const metadata: Metadata = {
  title: "Julia Design System — Style Guide",
  description: "Documentação interna do design system: tokens, Julia-Grid, layout e theming.",
  robots: { index: false, follow: false },
};

export default function StyleGuidePage() {
  return (
    <div className="sg-page julia-container">
      <span className="sg-banner">Página fantasma — não indexada</span>

      <header className="sg-section">
        <h1 className="sg-hero-title">Julia Design System</h1>
        <p className="sg-hero-lead">
          Style guide vivo do portfólio. HTML semântico, CSS puro e tokens derivados de{" "}
          <span className="sg-code-inline">--grid-unit</span>. Inspirado na clareza do{" "}
          <a href="https://rsms.me/raster/" target="_blank" rel="noopener noreferrer">
            Raster
          </a>{" "}
          — grid descritivo, escala harmônica, zero utilitários na UI pública.
        </p>
        <p className="sg-note">
          Três camadas: visitante (color mode local) · preview no iframe (temporário) · admin Save
          (Redis). Escala compartilhada: <span className="sg-code-inline">--space-*</span>,{" "}
          <span className="sg-code-inline">--type-meta</span>,{" "}
          <span className="sg-code-inline">--font-*</span>. Fun themes (DTCG-style) só em home /
          styleguide.
        </p>
      </header>

      <StyleguideThemeBoard />

      <nav className="sg-toc" aria-label="Índice do style guide">
        <a href="#philosophy">Filosofia</a>
        <a href="#scale">Escala</a>
        <a href="#colors">Cores</a>
        <a href="#themes">Theming</a>
        <a href="#grid">Julia-Grid</a>
        <a href="#layout">Layout</a>
        <a href="#typography">Tipografia</a>
        <a href="#prose">Prose</a>
        <a href="#editable">data-editable</a>
        <a href="#admin">Admin</a>
        <a href="#utilities">Utilitários</a>
      </nav>

      {/* ── 1. Filosofia ── */}
      <section id="philosophy" className="sg-section">
        <h2 className="sg-section-title">Filosofia</h2>
        <p className="sg-section-lead">
          Simplicidade primeiro — como o Raster, o layout é declarado no HTML e resolvido pelo
          CSS. A diferença: usamos classes + custom properties em vez de custom elements.
        </p>

        <div
          className="julia-grid"
          style={{ "--grid-template": 2 } as React.CSSProperties}
        >
          <div className="julia-item sg-layer-card">
            <h3>Raster (referência)</h3>
            <p>
              <span className="sg-code-inline">&lt;r-grid columns=8&gt;</span> +{" "}
              <span className="sg-code-inline">span=2-5</span>. Grid declarativo via atributos
              HTML. Escala tipográfica baseada em <span className="sg-code-inline">--lineHeight</span>.
            </p>
          </div>
          <div className="julia-item sg-layer-card">
            <h3>Julia-Grid (este projeto)</h3>
            <p>
              <span className="sg-code-inline">.julia-grid</span> +{" "}
              <span className="sg-code-inline">--grid-template</span>. Escala espacial baseada
              em <span className="sg-code-inline">--grid-unit: 8px</span>. Cores derivadas via{" "}
              <span className="sg-code-inline">color-mix()</span>.
            </p>
          </div>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Camada</th>
              <th>Responsabilidade</th>
              <th>Arquivo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tokens base</td>
              <td>Espaçamento, grid, container</td>
              <td><code>globals.css</code> §1–2</td>
            </tr>
            <tr>
              <td>Tokens de tema (público)</td>
              <td>Color mode neutro — <code>[data-color-mode]</code></td>
              <td><code>globals.css</code> + <code>color-mode.ts</code></td>
            </tr>
            <tr>
              <td>Admin chrome</td>
              <td>Shell escuro — <code>--admin-*</code></td>
              <td><code>globals.css</code> § Admin</td>
            </tr>
            <tr>
              <td>Julia-Grid</td>
              <td>Colunas responsivas + subgrid</td>
              <td><code>globals.css</code> §4</td>
            </tr>
            <tr>
              <td>Componentes semânticos</td>
              <td>Header, footer, nav — estrutura pura</td>
              <td><code>globals.css</code> §5</td>
            </tr>
            <tr>
              <td>Prose</td>
              <td>Conteúdo Wisp (CMS)</td>
              <td><code>globals.css</code> §8 — CSS puro</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 2. Escala atômica ── */}
      <section id="scale" className="sg-section">
        <h2 className="sg-section-title">Escala atômica</h2>
        <p className="sg-section-lead">
          Toda distância deriva de <span className="sg-code-inline">--grid-unit: 8px</span>.
          Equivalente ao <span className="sg-code-inline">--lineHeight</span> do Raster como
          unidade fundamental — aqui a unidade é espacial, não tipográfica.
        </p>

        <div className="sg-scale-list">
          {[
            { token: "--space-1", mult: 1, px: 8 },
            { token: "--space-2", mult: 2, px: 16 },
            { token: "--space-3", mult: 3, px: 24 },
            { token: "--space-4", mult: 4, px: 32 },
            { token: "--space-6", mult: 6, px: 48 },
            { token: "--space-8", mult: 8, px: 64 },
            { token: "--space-12", mult: 12, px: 96 },
          ].map(({ token, mult, px }) => (
            <div key={token} className="sg-scale-row">
              <code>{token}</code>
              <div
                className="sg-scale-bar"
                style={{ width: `calc(var(--grid-unit) * ${mult})` }}
              />
              <span className="sg-scale-value">{px}px</span>
            </div>
          ))}
        </div>

        <h3 className="sg-subtitle">Container &amp; grid breakpoints</h3>
        <table className="sg-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Valor</th>
              <th>Uso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>--container-max-width</code></td>
              <td>1200px (150 × unit)</td>
              <td><code>.julia-container</code></td>
            </tr>
            <tr>
              <td><code>--grid-columns</code></td>
              <td>4 → 8 → 12</td>
              <td>Mobile / tablet / desktop</td>
            </tr>
            <tr>
              <td><code>--julia-gap</code></td>
              <td>space-3 → space-4 → space-6</td>
              <td>Gap do grid por breakpoint</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 3. Cores ── */}
      <section id="colors" className="sg-section">
        <h2 className="sg-section-title">Tokens de cor</h2>
        <p className="sg-section-lead">
          Modo claro/escuro via <code>[data-color-mode]</code> — paleta neutra monocromática no
          site público. Tokens derivados (<code>--border</code>, <code>--muted</code>) respondem ao
          color mode. Preview de tema colorido no admin iframe é efêmero até Salvar.
        </p>

        <div className="sg-swatches">
          <div className="sg-swatch">
            <div className="sg-swatch-color" style={{ background: "var(--primary)" }} />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Primary</p>
              <p className="sg-swatch-token">--primary</p>
            </div>
          </div>
          <div className="sg-swatch">
            <div className="sg-swatch-color" style={{ background: "var(--background)" }} />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Background</p>
              <p className="sg-swatch-token">--background</p>
            </div>
          </div>
          <div className="sg-swatch">
            <div className="sg-swatch-color" style={{ background: "var(--foreground)" }} />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Foreground</p>
              <p className="sg-swatch-token">--foreground</p>
            </div>
          </div>
          <div className="sg-swatch">
            <div
              className="sg-swatch-color"
              style={{
                background: "color-mix(in srgb, var(--foreground) 15%, var(--background))",
              }}
            />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Border</p>
              <p className="sg-swatch-token">--border</p>
            </div>
          </div>
          <div className="sg-swatch">
            <div
              className="sg-swatch-color"
              style={{
                background: "color-mix(in srgb, var(--foreground) 6%, var(--background))",
              }}
            />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Muted</p>
              <p className="sg-swatch-token">--muted</p>
            </div>
          </div>
          <div className="sg-swatch">
            <div
              className="sg-swatch-color"
              style={{
                background: "color-mix(in srgb, var(--foreground) 60%, var(--background))",
              }}
            />
            <div className="sg-swatch-meta">
              <p className="sg-swatch-name">Muted FG</p>
              <p className="sg-swatch-token">--muted-foreground</p>
            </div>
          </div>
        </div>

        <pre className="sg-code">{`:root {
  --border: color-mix(in srgb, var(--foreground) 15%, var(--background));
  --muted: color-mix(in srgb, var(--foreground) 6%, var(--background));
  --muted-foreground: color-mix(in srgb, var(--foreground) 60%, var(--background));
}`}</pre>
      </section>

      {/* ── 4. Theming ── */}
      <section id="themes" className="sg-section">
        <h2 className="sg-section-title">Camadas de theming</h2>
        <p className="sg-section-lead">
          Três contextos independentes — mesma escala espacial/tipográfica, persistência diferente.
        </p>

        <div
          className="julia-grid"
          style={{ "--grid-template": 3 } as React.CSSProperties}
        >
          <div className="julia-item sg-layer-card">
            <h3>Visitante</h3>
            <p>
              ThemeSwitcher → <code>data-color-mode</code> (System / Light / Dark). Neutro
              monocromático. Chave: <code>user_color_mode</code>.
            </p>
          </div>
          <div className="julia-item sg-layer-card">
            <h3>Preview (iframe)</h3>
            <p>
              Admin injeta <code>#__theme_preview__</code> via postMessage. Cores, raio e fonte
              mudam ao vivo — <strong>refresh restaura</strong> o estado do servidor.
            </p>
          </div>
          <div className="julia-item sg-layer-card">
            <h3>Admin Save → Redis</h3>
            <p>
              <code>saveTheme</code> + <code>saveConfig</code> — fonte da verdade para conteúdo
              estático e estilização persistida.
            </p>
          </div>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Token / escala</th>
              <th>Preview iframe</th>
              <th>Save Redis</th>
              <th>Visitante</th>
              <th>Fixo (CSS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>--primary</code>, cores tema</td>
              <td>✓ temporário</td>
              <td>✓</td>
              <td>neutro</td>
              <td>—</td>
            </tr>
            <tr>
              <td><code>--radius</code>, <code>--font-family</code></td>
              <td>✓ temporário</td>
              <td>✓</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td><code>data-color-mode</code></td>
              <td>—</td>
              <td>—</td>
              <td>✓ localStorage</td>
              <td>—</td>
            </tr>
            <tr>
              <td><code>--admin-*</code></td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
              <td>✓ admin UI</td>
            </tr>
            <tr>
              <td><code>--space-*</code>, <code>--type-*</code>, <code>--font-*</code></td>
              <td>✓</td>
              <td>—</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 5. Julia-Grid ── */}
      <section id="grid" className="sg-section">
        <h2 className="sg-section-title">Julia-Grid</h2>
        <p className="sg-section-lead">
          Grid responsivo com colunas automáticas. Equivalente ao{" "}
          <span className="sg-code-inline">&lt;r-grid&gt;</span> do Raster — o número de colunas
          por item é controlado por <span className="sg-code-inline">--grid-template</span> no
          container pai.
        </p>

        <h3 className="sg-subtitle">Demo ao vivo — <code>--grid-template: 3</code></h3>
        <p className="sg-type-caption" style={{ marginBottom: "var(--space-3)" }}>
          12 colunas ÷ 3 = 4 colunas por item → 3 cards por linha no desktop. Redimensione a
          janela para ver 4 → 8 → 12 colunas.
        </p>

        <div className="sg-demo-box">
          <p className="sg-demo-label">.julia-grid.debug</p>
          <div
            className="julia-grid debug"
            style={{ "--grid-template": 3 } as React.CSSProperties}
          >
            <div className="julia-item">1</div>
            <div className="julia-item">2</div>
            <div className="julia-item">3</div>
            <div className="julia-item">4</div>
            <div className="julia-item">5</div>
            <div className="julia-item">6</div>
          </div>
        </div>

        <pre className="sg-code">{`<div class="julia-grid debug" style="--grid-template: 3">
  <div class="julia-item">1</div>
  <div class="julia-item">2</div>
  <div class="julia-item">3</div>
</div>`}</pre>

        <h3 className="sg-subtitle">Subgrid — cards internos alinhados</h3>
        <p className="sg-type-caption" style={{ marginBottom: "var(--space-3)" }}>
          <code>.julia-subgrid</code> propaga colunas do pai — útil para cards de projeto com
          imagem, meta e título alinhados entre si.
        </p>

        <div className="sg-demo-box">
          <div
            className="julia-grid debug"
            style={{ "--grid-template": 3 } as React.CSSProperties}
          >
            {[1, 2, 3].map((n) => (
              <article
                key={n}
                className="julia-item julia-subgrid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "subgrid",
                  gap: "inherit",
                }}
              >
                <div style={{ gridColumn: "1 / -1", minHeight: "calc(var(--grid-unit) * 5)" }}>
                  img
                </div>
                <div style={{ gridColumn: "1 / -1", fontSize: "0.75rem" }}>meta</div>
                <div style={{ gridColumn: "1 / -1", fontWeight: 700 }}>Título {n}</div>
              </article>
            ))}
          </div>
        </div>

        <h3 className="sg-subtitle">Comparação com Raster</h3>
        <table className="sg-table">
          <thead>
            <tr>
              <th>Raster</th>
              <th>Julia-Grid</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>&lt;r-grid columns=8&gt;</code></td>
              <td><code>.julia-grid</code> + <code>--grid-columns</code> (responsive)</td>
            </tr>
            <tr>
              <td><code>&lt;r-cell span=2-5&gt;</code></td>
              <td><code>.julia-item</code> + <code>--grid-template</code></td>
            </tr>
            <tr>
              <td><code>span-s=row</code> (mobile)</td>
              <td>Colunas mudam via media query em <code>:root</code></td>
            </tr>
            <tr>
              <td><code>.debug</code></td>
              <td><code>.julia-grid.debug</code></td>
            </tr>
            <tr>
              <td><code>.julia-reading-column</code></td>
              <td>Coluna centralizada para texto longo (4→6→8 cols)</td>
            </tr>
          </tbody>
        </table>

        <pre className="sg-code">{`/* Fórmula de span por item */
.julia-item {
  grid-column: span calc(var(--grid-columns) / var(--grid-template));
}

/* Container */
.julia-container {
  width: min(100%, var(--container-max-width));
  margin-inline: auto;
  padding-inline: var(--space-3);
}`}</pre>
      </section>

      {/* ── 6. Layout ── */}
      <section id="layout" className="sg-section">
        <h2 className="sg-section-title">Componentes de layout</h2>
        <p className="sg-section-lead">
          Classes estruturais sem cor hardcoded — todo visual vem dos tokens. Preview miniatura
          abaixo usa os mesmos seletores do site.
        </p>

        <div className="sg-layout-preview">
          <header className="site-header">
            <div className="header-container">
              <span className="site-title">Site.</span>
              <nav className="nav-list">
                <span className="nav-item">About</span>
                <span className="nav-separator" aria-hidden="true">
                  ·
                </span>
                <span className="nav-item nav-item-muted">Work</span>
              </nav>
            </div>
          </header>
          <main className="site-main">.site-main — conteúdo da página</main>
          <footer className="site-footer">
            <p className="footer-text">.footer-text — rodapé tokenizado</p>
          </footer>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Elemento</th>
              <th>Comportamento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.site-body</code></td>
              <td><code>&lt;body&gt;</code> público</td>
              <td>Flex column, min-height 100vh</td>
            </tr>
            <tr>
              <td><code>.admin-body</code></td>
              <td><code>&lt;body&gt;</code> em /admin/*</td>
              <td>Sem chrome público — shell <code>.admin-app</code></td>
            </tr>
            <tr>
              <td><code>SiteChrome</code></td>
              <td>Header + main + footer</td>
              <td>Componente — omitido em rotas admin</td>
            </tr>
            <tr>
              <td><code>.site-header</code></td>
              <td><code>&lt;header&gt;</code></td>
              <td>Static, editorial — sem sticky/blur/border</td>
            </tr>
            <tr>
              <td><code>.site-main</code></td>
              <td><code>&lt;main&gt;</code></td>
              <td>Flex 1 — área de conteúdo</td>
            </tr>
            <tr>
              <td><code>.site-footer</code></td>
              <td><code>&lt;footer&gt;</code></td>
              <td>Border-top, ThemeSwitcher + footer-text</td>
            </tr>
            <tr>
              <td><code>.julia-reading-column</code></td>
              <td><code>&lt;article&gt;</code></td>
              <td>Coluna de leitura responsiva para posts</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 7. Tipografia ── */}
      <section id="typography" className="sg-section">
        <h2 className="sg-section-title">Tipografia</h2>
        <p className="sg-section-lead">
          Site público usa Inter via <code>--font-body</code> / <code>--font-display</code>. Mono
          só em <code>code</code>. Admin compartilha a mesma escala{" "}
          <code>--type-meta</code>, <code>--type-body</code>.
        </p>

        <div className="sg-demo-box">
          <p className="sg-type-label">Display / Hero</p>
          <p className="sg-type-display">Stories &amp; Ideas.</p>

          <p className="sg-type-label" style={{ marginTop: "var(--space-6)" }}>
            Heading
          </p>
          <p className="sg-type-heading">Nome do projeto</p>

          <p className="sg-type-label" style={{ marginTop: "var(--space-6)" }}>
            Body
          </p>
          <p className="sg-type-body">
            Texto de corpo com cor secundária via <code>--muted-foreground</code>. Line-height
            1.65 para leitura confortável.
          </p>

          <p className="sg-type-label" style={{ marginTop: "var(--space-6)" }}>
            Caption / Meta
          </p>
          <p className="sg-type-caption">Janeiro 2026 · React · Design System</p>

          <p className="sg-type-label" style={{ marginTop: "var(--space-6)" }}>
            Label / Tag
          </p>
          <p className="sg-type-label">CASE STUDY</p>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Classe CSS</th>
              <th>Peso</th>
              <th>Uso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.site-title</code></td>
              <td>800</td>
              <td>Logo / nome do site</td>
            </tr>
            <tr>
              <td><code>.sg-type-display</code></td>
              <td>900</td>
              <td>Hero title</td>
            </tr>
            <tr>
              <td><code>.nav-item</code></td>
              <td>500</td>
              <td>Links de navegação</td>
            </tr>
            <tr>
              <td><code>.footer-text</code></td>
              <td>400</td>
              <td>Rodapé</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 8. Prose ── */}
      <section id="prose" className="sg-section">
        <h2 className="sg-section-title">Prose — conteúdo Wisp</h2>
        <p className="sg-section-lead">
          Conteúdo dinâmico do CMS usa a class <code>.prose</code> — estilos 100% em{" "}
          <code>globals.css</code> §8, tokenizados. Sem Tailwind.
        </p>

        <div className="prose" style={{ maxWidth: "none" }}>
          <h2>Título de seção</h2>
          <p>
            Parágrafo com <a href="#">link primário</a> e texto normal. Cores herdadas de{" "}
            <code>--foreground</code> e <code>--primary</code>.
          </p>
          <blockquote>
            Citação em conteúdo longo — bordas e cores seguem o tema ativo.
          </blockquote>
          <pre>
            <code>{`const theme = getTheme(); // Server Component`}</code>
          </pre>
          <ul>
            <li>Item de lista</li>
            <li>Outro item</li>
          </ul>
        </div>
      </section>

      {/* ── 9. data-editable ── */}
      <section id="editable" className="sg-section">
        <h2 className="sg-section-title">data-editable — components as data</h2>
        <p className="sg-section-lead">
          Campos estáticos marcados com <code>data-editable=&quot;fieldName&quot;</code> tornam-se
          editáveis no iframe do admin. O valor persiste no Redis via Server Actions.
        </p>

        <div className="sg-editable-demo">
          <h2
            className="sg-type-display"
            data-editable="heroTitle"
            style={{ fontSize: "2rem" }}
          >
            Título editável
          </h2>
          <p className="sg-type-body" data-editable="heroDescription">
            Este parágrafo simula um campo editável. No admin iframe, aparece outline tracejado
            em <code>--primary</code>.
          </p>
        </div>

        <pre className="sg-code">{`<h1 data-editable="heroTitle">{config.heroTitle}</h1>

/* Admin iframe — globals.css §6 */
html[data-env="admin"] [data-editable] {
  outline: 2px dashed var(--primary);
}`}</pre>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Campo</th>
              <th>data-editable</th>
              <th>Fonte</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nome do site</td>
              <td><code>siteName</code></td>
              <td>Header</td>
            </tr>
            <tr>
              <td>Hero</td>
              <td><code>heroTitle</code>, <code>heroDescription</code></td>
              <td>Home</td>
            </tr>
            <tr>
              <td>About</td>
              <td><code>aboutTitle</code>, <code>aboutIntro</code>, <code>aboutBody</code></td>
              <td>About / Home</td>
            </tr>
            <tr>
              <td>Footer</td>
              <td><code>footerText</code></td>
              <td>Layout</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ── 10. Admin ── */}
      <section id="admin" className="sg-section">
        <h2 className="sg-section-title">Admin — <code>--admin-*</code></h2>
        <p className="sg-section-lead">
          Chrome do painel usa tokens próprios (escuro fixo). Escala espacial e tipográfica
          compartilhada com o site. Login + ThemeEditor migrados para CSS puro — zero Tailwind.
        </p>

        <div className="sg-admin-tokens">
          {[
            { token: "--admin-bg", color: "#09090b" },
            { token: "--admin-surface", color: "#18181b" },
            { token: "--admin-text", color: "#fafafa" },
            { token: "--admin-text-muted", color: "#a1a1aa" },
            { token: "--admin-accent", color: "#fafafa" },
            { token: "--admin-danger", color: "#f87171" },
          ].map(({ token, color }) => (
            <div key={token} className="sg-admin-token">
              <div className="sg-admin-token__swatch" style={{ background: color }} />
              <code>{token}</code>
            </div>
          ))}
        </div>

        <h3 className="sg-subtitle">Preview de componentes admin</h3>
        <div className="sg-admin-preview">
          <div className="admin-field">
            <label className="admin-label">Campo de exemplo</label>
            <input type="text" className="admin-input" defaultValue="Julia Sakakibara" readOnly />
          </div>
          <button type="button" className="admin-button" style={{ marginTop: "var(--space-2)" }}>
            Salvar Configurações
          </button>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Uso</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>.admin-app</code></td><td>Wrapper root em <code>/admin/*</code></td></tr>
            <tr><td><code>.admin-editor</code></td><td>ThemeEditor fullscreen</td></tr>
            <tr><td><code>.admin-sidebar</code></td><td>Painel lateral redimensionável</td></tr>
            <tr><td><code>.admin-preview</code></td><td>Área iframe + chrome de janela</td></tr>
            <tr><td><code>.admin-input</code>, <code>.admin-button</code></td><td>Form controls</td></tr>
          </tbody>
        </table>
      </section>

      {/* ── 11. Utilitários ── */}
      <section id="utilities" className="sg-section">
        <h2 className="sg-section-title">Utilitários tokenizados</h2>
        <p className="sg-section-lead">
          Spacing helpers derivados de <code>--space-*</code> — preferir estes a valores
          arbitrários. Raster usa <code>.padding1</code> baseado em line-height; aqui usamos a
          escala de grid.
        </p>

        <div
          className="julia-grid"
          style={{ "--grid-template": 3 } as React.CSSProperties}
        >
          <div className="julia-item padding-md sg-demo-card">
            .padding-md
          </div>
          <div className="julia-item gap-md sg-demo-card sg-demo-card--flex">
            <span>.gap-md</span>
            <span>→</span>
          </div>
          <div className="julia-item margin-md sg-demo-card">
            .margin-md
          </div>
        </div>

        <table className="sg-table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>.padding-sm/md/lg</code></td><td>space-2 / space-4 / space-6</td></tr>
            <tr><td><code>.margin-sm/md/lg</code></td><td>space-2 / space-4 / space-6</td></tr>
            <tr><td><code>.gap-sm/md/lg</code></td><td>space-2 / space-4 / space-6</td></tr>
            <tr><td><code>.julia-item.full-width</code></td><td>grid-column: 1 / -1</td></tr>
          </tbody>
        </table>
      </section>

      <footer className="sg-footer">
        <p>
          Julia Design System · referência:{" "}
          <a href="https://rsms.me/raster/" target="_blank" rel="noopener noreferrer">
            Raster
          </a>{" "}
          · arquivo fonte: <code>src/app/globals.css</code>
        </p>
      </footer>
    </div>
  );
}
