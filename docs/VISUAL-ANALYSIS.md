# Análise visual — referência rsms / Raster

Documento de referência para continuidade de trabalho visual no portfólio Wisp/Julia.  
Referências: [rsms.me](https://rsms.me) · [Raster](https://rsms.me/raster/)

---

## 1. Marco teórico

### Hierarquia visual e Gestalt

A [Nielsen Norman Group](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) define hierarquia visual como a organização dos elementos para que o olho consuma o conteúdo na ordem de importância pretendida. Mecanismos: **escala**, **contraste/cor** e **agrupamento** (proximidade, região comum).

O princípio de [proximidade](https://www.nngroup.com/articles/gestalt-proximity/) explica por que rsms/Raster funcionam: títulos próximos das descrições; datas em grupo secundário; seções separadas por whitespace, não por caixas.

### Grid e tipografia

NN/g enfatiza alinhamento a grid, hierarquia tipográfica clara e **2–3 tamanhos de tipo** ([Good Visual Design, Explained](https://www.nngroup.com/articles/good-visual-design/)). O Raster usa `--lineHeight` como **unidade atômica** — tipografia, padding e ritmo vertical derivam dela.

Neste projeto: `--grid-unit: 8px` governa espaço; tipografia deve convergir para uma escala unificada (meta da Fase 2+).

### Acessibilidade (WCAG 2.2)

| Critério | Relevância |
|----------|------------|
| [1.4.3 Contraste mínimo](https://www.w3.org/TR/WCAG22/#contrast-minimum) | Texto ≥ 4.5:1 |
| [1.4.11 Contraste não-textual](https://www.w3.org/TR/WCAG22/#non-text-contrast) | UI, focus rings ≥ 3:1 |
| [1.4.8 Apresentação visual](https://www.w3.org/TR/WCAG22/#visual-presentation) (AAA) | ≤80 chars/linha, leading ≥1.5 |
| [1.4.12 Espaçamento de texto](https://www.w3.org/TR/WCAG22/#text-spacing) (AA) | Layout não quebra com overrides |

Pesquisa McLeish (2007) e estudos de line-length (Baymard): **50–75 caracteres/linha** e leading generoso reduzem carga cognitiva.

### Heurísticas de Nielsen

| Heurística | Aplicação |
|------------|-----------|
| Consistência e padrões | Tokens existem; pesos e seções precisam convergir |
| Estética e design minimalista | rsms é monocromático; chrome extra (borders, theme no header) adiciona ruído |
| Reconhecimento vs. memorização | Nav por âncoras (#about, #work) — bom |
| Flexibilidade | ThemeSwitcher alinha a 1.4.8, mas fragmenta identidade |

---

## 2. Referência rsms / Raster — o que copiar

### rsms.me

1. Índice escaneável: `H3` + uma linha + data — sem cards obrigatórios
2. Tipografia como hierarquia: poucos pesos; tamanho faz o trabalho
3. Cor mínima: preto/cinza; acento só onde importa
4. Whitespace generoso entre seções
5. **Inter** como voz tipográfica
6. Nav inline simples — sem header sticky pesado

### Raster

1. Grid declarativo com spans expressivos (`span=2-5`, `span=6..`)
2. Escala unificada via `--lineHeight`
3. Responsivo declarativo (`span-s=row`, `columns-s=3`) — breakpoint ~600dp
4. Simplicidade: HTML descritivo, CSS puro

---

## 3. Estado atual do projeto

### Pontos fortes (preservar)

| Aspecto | Onde |
|---------|------|
| Grid | `.julia-grid`, `--grid-template`, subgrid nos cards |
| Tokens / temas | `color-mix()`, `deriveAccessibleTokens()` |
| Coluna de leitura | `.julia-reading-column` |
| HTML semântico | `aria-labelledby`, skip link |
| Contraste WCAG | `validateThemePreset()` em `theme-presets.ts` |
| Style guide | `/styleguide` |

### Lacunas identificadas

| ID | Problema | Prioridade |
|----|----------|------------|
| A | Grid subutilizado na home (só work usa grid) | Alta |
| B | Escala tipográfica desacoplada do grid | Alta |
| C | Cards image-first vs. índice rsms | Alta |
| D | `scroll-margin-top` insuficiente para header 4rem | Alta |
| E | Inter carregada mas `--font-family` → `sans-serif` genérico | Alta |
| F | Chrome visual (sticky header, borders, labels coloridos) | Média |
| G | Hover/focus fracos em cards | Média |
| H | Densidade tipográfica inconsistente (about-body) | Média |
| I | Responsividade menos expressiva que Raster | Média |

### Matriz comparativa

| Dimensão | rsms/Raster | Projeto | Gap |
|----------|-------------|---------|-----|
| Unidade de escala | `--lineHeight` | `--grid-unit` só espacial | Alto |
| Layout de página | Grid com spans | Coluna única + grid em work | Alto |
| Índice de projetos | Lista textual | Cards image-first | Alto |
| Tipografia | Inter, 2–3 pesos | Pesos 800–900 | Alto |
| Header | Minimal inline | Sticky + blur + theme | Médio |
| A11y contraste | Implícito | Validado em código | Vantagem nossa |

---

## 4. Roadmap

### Fase 1 — Fundação ✅

- [x] Documento de referência (`docs/VISUAL-ANALYSIS.md`)
- [x] Aplicar Inter via `--font-inter` em `resolveFontFamily`
- [x] Corrigir `scroll-margin-top` / `scroll-padding-top` para header 4rem
- [x] Unificar escala tipográfica (3 níveis; pesos 400 / 600 / 800)
- [x] Labels de seção (`.section-label`) em `--muted-foreground`

**Arquivos tocados:** `src/lib/theme-presets.ts`, `src/app/globals.css`

### Fase 2 — Composição ✅

1. [x] Recompor home com `.julia-grid` e spans assimétricos
2. [x] About dentro de `.julia-reading-column`
3. [x] Substituir `border-top` em seções por ritmo `--space-12`
4. [x] Header mais editorial (estático, nav inline com separadores)

**Arquivos tocados:** `src/app/(site)/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/styleguide/page.tsx`

### Fase 3 — Conteúdo e interação ✅

1. [x] Variante lista rsms para projetos (default; `variant="card"` preservado)
2. [x] Hover/focus visíveis em links, lista, nav e cards
3. [x] Spans responsivos por célula (`.julia-span-md-8`, `.julia-span-row-s`)
4. [x] ThemeSwitcher movido para o footer

**Arquivos tocados:** `ProjectCard.tsx`, `(site)/page.tsx`, `layout.tsx`, `globals.css`

### Fase 4 — Refinamento ✅

1. [x] WCAG 1.4.11 — `--border` calculado ≥ 3:1; separadores 4px substituídos por `·` textual
2. [x] WCAG 1.4.12 — `line-height: 1.5`, `overflow-wrap`, espaçamento entre parágrafos em `.prose`
3. [x] Teste de escaneabilidade documentado (§8 abaixo)
4. [x] Script `npm run a11y:audit` para validação contínua dos presets

**Arquivos tocados:** `theme-presets.ts`, `theme-utils.ts`, `layout.tsx`, `globals.css`, `ProjectCard.tsx`, `projects/[slug]/page.tsx`, `scripts/a11y-audit.ts`, `package.json`

---

## 8. Auditoria WCAG e teste de escaneabilidade (Fase 4)

### 8.1 WCAG 1.4.11 — Contraste não-textual

| Problema encontrado | Correção |
|---------------------|----------|
| `--border` em 15% `color-mix` ≈ 1.5:1 no tema Neutro | `computeBorder()` em `theme-presets.ts` — itera mix até ≥ 3:1 |
| Separadores 4×4px com `background: var(--border)` | Substituídos por `.meta-separator` com caractere `·` em `--muted-foreground` (texto ≥ 4.5:1) |
| Admin iframe usava border 15% hardcoded | `theme-utils.ts` injeta `--border` derivado |

Validação: `npm run a11y:audit` — 10 presets, todos passam.

### 8.2 WCAG 1.4.12 — Espaçamento de texto

| Requisito | Implementação |
|-----------|---------------|
| `line-height` ≥ 1.5 | Base `html`; blocos de conteúdo em `.site-main` |
| `p + p` spacing | `.prose p + p { margin-top: 1.5em }` |
| Sem clipping com overrides | `overflow-wrap: anywhere` em textos; removido `-webkit-line-clamp` dos cards |
| Parágrafos about | `.about-intro + .about-body { margin-top: 1.5em }` |

**Teste manual recomendado:** extensão [Text Spacing](https://chrome.google.com/webstore) ou bookmarklet WCAG — verificar home e `/projects/[slug]` sem overflow horizontal.

### 8.3 Teste dos 5 segundos (NN/g)

Protocolo: mostrar a home por 5s, depois perguntar (1) propósito do site, (2) ações possíveis, (3) tipo de conteúdo.

| Pergunta | rsms.me (referência) | Projeto atual (pós Fase 3–4) | Status |
|----------|----------------------|------------------------------|--------|
| Propósito | Site pessoal de Rasmus, software | Hero + About comunicam identidade/profissão | ✓ Paridade |
| Ações | Navegar Projects, About, Work | About · Work no header; lista clicável | ✓ Paridade |
| Conteúdo principal | Lista de projetos + artigos | Lista rsms-style em Work | ✓ Paridade |
| Hierarquia visual | Título > descrição > meta | `--type-*` tokens; labels muted | ✓ Melhor que antes |
| Ruído visual | Mínimo | Theme no footer; sem cards image-first | ✓ Aproximado |

**Gaps remanescentes (pós-roadmap):** hero ainda genérico sem foto/identidade visual; work list depende de conteúdo Wisp publicado; footer ainda tem `border-top` (aceitável como único separador estrutural).

---

## 5. Decisões de design (Fase 1)

### Escala tipográfica proposta

Derivada de `--grid-unit` e alinhada a 3 níveis NN/g:

| Token | Uso | Peso |
|-------|-----|------|
| `--type-display` | Hero, títulos de página | 800 |
| `--type-heading` | H2 de seção, título de card | 700 |
| `--type-body` | Lead, intro, corpo | 400 |
| `--type-meta` | Labels, captions, nav | 600 (uppercase labels) / 400 |

### Scroll offset

```css
:root {
  --header-height: 4rem;
}
#about, #work, #hero {
  scroll-margin-top: calc(var(--header-height) + var(--space-2));
}
html {
  scroll-padding-top: var(--header-height);
}
```

### Inter

```ts
// theme-presets.ts — preset sans
return "var(--font-inter), system-ui, sans-serif";
```

---

## 6. Como retomar em conversa nova

Diga ao agente:

> Leia `docs/VISUAL-ANALYSIS.md` e continue a partir da Fase N.

Ou cite a fase e o item específico da checklist.

---

## 7. Síntese

Roadmap visual **completo** (Fases 1–4). A infraestrutura (Julia-Grid, tokens, WCAG programático, styleguide) está à frente da referência rsms. O layout atual atinge **paridade de escaneabilidade** com rsms.me; refinamentos futuros são conteúdo (copy, projetos publicados) e identidade visual personalizada — não estrutura.
