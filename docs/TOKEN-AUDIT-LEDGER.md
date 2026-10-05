# Token audit ledger (oferta)

**Status:** rascunho útil — **não é W1** do workflow atual.  
**Papel:** catálogo do que **existe** no CSS/TS (`--*`). Revalidar na **W3** contra a matriz de uso da W2 (demanda).  
**Data:** 2026-09-17 (gerado antes da inversão Frost-first)  
**Fontes:** `src/app/globals.css`, `src/lib/fun-themes.ts`, `src/lib/theme-utils.ts`, `src/lib/theme-presets.ts`, `src/lib/color-mode.ts`  
**Não fazer a partir deste arquivo sozinho:** Mermaid final, inventário atomic, plano, renomear CSS.

Camadas **propostas** (rascunho — T1/T2 ainda OPEN):

| Código | Significado |
|--------|-------------|
| **B** | Brand / theme pack value (hex ou par que muda por mode) |
| **P** | Primitive / reference (escala bruta, âncora) |
| **S** | Semantic / system (papel na UI; idealmente alias) |
| **C** | Component / page (só um organismo ou página) |
| **A** | Admin kit paralelo |
| **L** | Literal / local (scoped a um seletor; não token de sistema) |
| **?** | Incerto / gap / órfão |

---

## 1. Modes atuais (mecanismo — sem fechar T2)

| Mode | Como ativa | O que sobrescreve |
|------|------------|-------------------|
| Core light | `data-color-mode="light"` (sem fun, sem admin) | Semantic color hex |
| Core dark | `data-color-mode="dark"` | Semantic color hex |
| Fun electric | `data-fun-theme="electric"` | Semantic color hex (home/styleguide) |
| Fun neon | `data-fun-theme="neon"` | idem |
| Fun signal | `data-fun-theme="signal"` | idem |
| Fun albers | `data-fun-theme="albers"` | idem |
| Redis / admin preview | `#__site_theme__` via `theme-utils` + `data-env="admin"` no iframe | `--primary`, `--background`, `--foreground`, `--radius`, fonts, derived muted/border; aliases `--input/--card/--popover*` |
| Fallback public | `:root:not([data-env=admin]):not([data-fun-theme])` | Mesmo set light-like se mode ausente |

**Nota:** Fun também vive em `fun-themes.ts` (TS mirror dos hex) — duplicação CSS ↔ TS.

Analogia Vodafone (ainda não implementada): cada mode acima ≈ **Brand pack**; hoje **não** há Primitive Collection nomeada — hex vai **direto** no Semantic.

---

## 2. Inventário por grupo

### 2.1 Space / grid — em geral **P → S** (já aliases)

| Token | Definição típica | Camada | Notes |
|-------|------------------|--------|-------|
| `--grid-unit` | `8px` | **P** | Âncora Julia Grid |
| `--space-1` … `--space-4`, `--space-6`, `--space-8`, `--space-12` | `calc(var(--grid-unit) * n)` | **S** (via P) | Escala incompleta vs uso |
| `--space-10` | **não definido em `:root`** | **?** | Usado em `.sg-page--lean` — **órfão** |
| `--container-max-width` | `calc(var(--grid-unit) * 150)` | **S** / layout | |
| `--reading-max-width` | `40rem` | **S** | Literal rem, não grid |
| `--julia-gap` | `var(--space-3)` | **S** | Alias |
| `--grid-columns`, `--grid-fraction`, `--grid-template` | layout grid | **C** / layout | Mais page/layout que semantic genérico |

### 2.2 Color — **S alimentado por B** (hex direto)

| Token | Onde | Camada | Notes |
|-------|------|--------|-------|
| `--background` | Core / Fun / Redis | **S** ← **B** | Hex por mode; sem `color/neutral/0` |
| `--foreground` | idem | **S** ← **B** | |
| `--primary` | idem | **S** ← **B** | |
| `--primary-foreground` | idem | **S** ← **B** | |
| `--muted-foreground` | idem | **S** ← **B** | Misto hex / rgba |
| `--border` | idem | **S** ← **B** | rgba |
| `--muted` | idem | **S** ← **B** | rgba |
| `--input`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground` | só inject Redis (`theme-utils`) | **S** alias / **?** | Não no `:root` público estável |

Defaults em `:root` (linhas ~36–39) só partial (`primary-foreground`, border, muted*) — `--background`/`--foreground`/`--primary` vêm dos selectors de mode.

### 2.3 Typography — **S** (estável entre themes)

| Token | Camada | Notes |
|-------|--------|-------|
| `--font-sans-stack`, `--font-mono-stack` | **P**/stack | Ref Next font vars |
| `--font-inter`, `--font-mono` | **P** | Injetados pelo Next |
| `--font-body`, `--font-display` | **S** | Alias stacks; Redis pode sobrescrever |
| `--font-family` | **S** / **?** | Usado em styleguide + limpo no color-mode; Redis seta |
| `--font-weight-body/medium/heading/display` | **S** | |
| `--type-hero*`, `--type-display`, `--type-heading`, `--type-subheading`, `--type-lead`, `--type-body`, `--type-meta`, `--type-caption` | **S** | Escala type; hero* um pouco **C** |

### 2.4 Shape / motion

| Token | Camada | Notes |
|-------|--------|-------|
| `--radius` | **S** (Redis pode mudar) | Default `0` |
| `--radius-card`, `--radius-card-hover` | **C** | Project card |
| `--duration-fast` | **S** | Único motion token global |

### 2.5 Chrome / header — **C**

| Token | Camada | Notes |
|-------|--------|-------|
| `--header-height` | **C** | |
| `--header-blur-extent`, `--header-blur-1…5` | **C** | |
| `--header-tint` | **C** | `color-mix` de `--background` |
| `--blur`, `--mask` | **L** | Locais por `[data-blur]` layer |

### 2.6 Hero — **C**

| Token | Camada |
|-------|--------|
| `--hero-height*`, `--hero-stage-*`, `--hero-copy-*`, `--hero-model-*`, `--hero-mobile-*`, `--hero-load-*`, `--hero-bob-*`, `--hero-meta-*`, `--hero-title-inline-end` | **C** |
| `--poster-color` | **L**/C | Em hero viewer |

### 2.7 Project card — **C**

| Token | Camada |
|-------|--------|
| `--project-card-aspect`, `--project-card-aspect-featured`, `--project-card-label-invert`, `--project-card-image-scale-hover` | **C** |

### 2.8 Admin — **A** (kit paralelo)

| Token | Notes |
|-------|-------|
| `--admin-bg`, `--admin-surface`, `--admin-surface-hover` | Hex fixos |
| `--admin-border`, `--admin-border-subtle` | |
| `--admin-text`, `--admin-text-muted`, `--admin-text-faint` | |
| `--admin-accent`, `--admin-accent-fg` | |
| `--admin-danger`, `--admin-focus` | |
| (bloco ~1591 e ~2652) | **Definição duplicada** em dois sítios do CSS |

Admin **não** consome `--background`/`--foreground` do público para o shell.

### 2.9 Ruído do grep (não tokens)

`--admin-`, `--font-`, `--space-`, `--type-` — pedaços de nomes em comentários/concat; ignorar.

---

## 3. Gaps vs refs (Brad Frost / UX Collective / Vodafone / CC)

| Gap | Evidência | Relevância |
|-----|-----------|------------|
| Sem **Primitive** de cor nomeada | Modes escrevem `#4338ca` etc. direto em `--background` | T1 — Vodafone/CC esperam Brand→Primitive→Semantic |
| Semantic color = **B disfarçado de S** | Trocar “marca” = reescrever os mesmos 7 custom props | Funciona; não escala como diagrama Vodafone |
| Fun duplicado | `globals.css` + `fun-themes.ts` | Drift risk |
| `--space-10` órfão | Usado, não definido | Bug / escala incompleta (`1–4,6,8,12` sem 5,7,9,10,11) |
| Redis injecta tokens “shadcn-like” | `--card`, `--popover`, `--input` | Só preview; inventário público não documentava |
| Admin duplicado | dois blocos `--admin-*` | Limpeza C1 candidata |
| Page layer fraca | Hero/card bem tokenizados; “plaquinha” **não** tem token — só `var(--foreground)` inline no CSS do componente | Visual compartilhado sem Tier 3 |
| Modes vs “brands” | 2 core + 4 fun + redis + admin | T2 OPEN |

O que **já está bem** (perto das refs):
- Space a partir de `--grid-unit` (primitive → semantic).
- Type scale estável entre themes.
- UI consome nomes semantic (`--foreground`), não “electric”.

---

## 4. Contagem aproximada

| Bucket | ~N tokens distintos |
|--------|---------------------|
| Space/grid/layout | ~15 |
| Color semantic (public) | 7 (+5 Redis-only aliases) |
| Type + font | ~20 |
| Shape/motion | 4 |
| Header C | ~8 + L blur/mask |
| Hero C | ~20 |
| Project card C | 4 |
| Admin A | ~12 |
| **Total útil** | **~90** (grep ~98 com ruído) |

---

## 5. Uso na W3 (após inventário de telas)

Este ledger = **oferta**. Depois da W2 (atomic + usage), marcar cada token:

| Flag | Significado |
|------|-------------|
| USED | aparece na matriz W2 |
| ORPHAN | só no CSS/ledger, zero uso no inventário |
| LITERAL-GAP | UI usa hex/px hardcoded onde deveria haver token |

Opções Mermaid (T1/T2/T3) ficam OPEN até G2→W3.

**Ref visual W3 (sem copiar nomes):** [Vanilla Foundations](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-).

---

## Histórico

- 2026-09-17: criado como “W1 token audit”; workflow invertido (Frost-first) → **ledger**; W1 oficial = interface inventory.
