# Inventário de componentes — style guide in-repo

**Não é um design system package.** É o mapa de primitivos / padrões básicos deste portfólio: o que já existe (React ou CSS), o que está duplicado, e o que extrair com tokens.

Relacionado: [`REFERENCES.md`](./REFERENCES.md) · [`TOKEN-MAP.md`](./TOKEN-MAP.md) · [`STYLE-GUIDE-REVIEW.md`](./STYLE-GUIDE-REVIEW.md) · [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md) · [`TOKEN-AUDIT-LEDGER.md`](./TOKEN-AUDIT-LEDGER.md) · [`contracts/chip.contract.json`](./contracts/chip.contract.json) · [`CLEANUP-AUDIT.md`](./CLEANUP-AUDIT.md) · [`/styleguide`](/styleguide).

*Audit: set 2026. Extração CSS pausada. Inventário será refeito na **W2** após W1 (páginas).*

---

## Princípios

1. Extrair **primitivos tokenizados** (`--foreground`, `--background`, `--space-*`, `--type-*`, `--radius`) — sem inventar API de DS.
2. **Public ≠ admin** — kits paralelos; não mergear `--admin-*` com chip público sem camada explícita.
3. Styleguide `/styleguide` documenta o que for P0/P1; features (Hero, ThemeSwitcher) não são átomos.
4. Quando virar package + consumers → aí sim a palavra **design system**.

---

## Resumo

| Camada | Situação |
|--------|----------|
| React | Quase só features/composites — **zero** Button / Chip / Link genéricos |
| CSS público | Padrões ad-hoc; chip invertido repetido em 3+ sítios |
| Admin | Mini kit `.admin-button` / `.admin-input` / etc. |
| `/styleguide` | Só contraste do tema ativo — **não** documenta componentes |

---

## Componentes React existentes (não-primitivos)

| Nome | Path | Papel |
|------|------|--------|
| `SiteChrome` | `src/components/SiteChrome.tsx` | Layout chrome |
| `SiteNav` | `src/components/SiteNav.tsx` | Nav + menu mobile |
| `SiteLogo` | `src/components/SiteLogo.tsx` | Brand + scramble |
| `ThemeSwitcher` | `src/components/ThemeSwitcher.tsx` | Core + Fun |
| `FooterSocial` | `src/components/FooterSocial.tsx` | Links sociais + CV |
| `ProjectCard` | `src/components/ProjectCard.tsx` | Card de projeto (domínio) |
| `HeroSection` / `HeroVisual` / `HeroModelViewer*` | `src/components/Hero*.tsx` | Hero 3D |
| `StyleguideThemeBoard` | `src/components/StyleguideThemeBoard.tsx` | Docs de tema |
| `ThemePreviewListener` | `src/components/ThemePreviewListener.tsx` | Infra admin |
| `wisp-content-wrapper` | `src/components/wisp-content-wrapper.tsx` | Aplica `.prose` |
| `DevSecrets` | `src/components/DevSecrets.tsx` | Dev only |

---

## Inventário de primitivos

Legenda de prioridade:

- **P0** — extrair agora (3+ usos ou drift visual)
- **P1** — em breve
- **P2** — depois / domínio

### P0

| Primitivo | Existe hoje | Tokens | Usos atuais | Notas |
|-----------|-------------|--------|-------------|--------|
| **Chip** (nome TBD) | Só CSS ad-hoc; contrato draft | `--foreground`, `--background`, `--radius`, `--type-body`, `--duration-fast` | `.nav-item.is-current`, `.site-nav__toggle`, focus face do theme (`<select>`) | **Nome e extração sob revisão** — [`STYLE-GUIDE-REVIEW.md`](./STYLE-GUIDE-REVIEW.md) V1. Draft: [`chip.contract.json`](./contracts/chip.contract.json). Não é admin. |
| **NavItem** | CSS `.nav-item*` + helper em `SiteNav` | `--foreground`, `--muted-foreground`, min 44px; current → Chip | `SiteNav` | Depende de Chip |
| **Link** | Várias classes | chrome / prose / back / emphasis | Footer, about CV, project back, logo, `.prose a`, whoami | Variants; reduzir drift hover/underline |
| **FocusRing** | Outline repetido | Public `--primary`; Admin `--admin-focus` | Nav, cards, logo, skip; inputs admin | Utility / mixin; ThemeSwitcher usa Chip no focus |

### P1

| Primitivo | Existe hoje | Tokens | Usos | Notas |
|-----------|-------------|--------|------|--------|
| **SkipLink** | Markup em `SiteChrome` + `.skip-link` | = Chip + `--space-*` | 1× | Extrair após Chip |
| **Text / type roles** | Classes por página | `--type-*`, `--font-*` | Hero, about, project, sections | Documentar roles; React opcional |
| **Prose** | `.prose` + wrapper | Type + color + `--reading-max-width` | CMS Wisp | Manter bloco; specimen no styleguide |
| **Separator** | `.meta-separator` | `--muted-foreground` | Footer, about | `·` |
| **Admin Button** | `.admin-button*` | `--admin-accent*` | Login, ThemeEditor | Kit admin |
| **Admin Field / Input / Textarea / Label** | `.admin-input` etc. | `--admin-surface`, `--admin-border`, `--admin-focus` | Admin forms | Wrappers React finos OK |
| **Container / Grid** | `.julia-container`, `.julia-grid*` | `--grid-unit`, `--space-*`, `--container-max-width` | Home, project | Já tokenizado; doc no styleguide |

### P2

| Primitivo | Existe hoje | Notas |
|-----------|-------------|--------|
| **EmptyState** | `.work-empty` | Work grid |
| **Progress** | `.hero-viewer__progress*` | Loader 3D |
| **Tag / Meta** | `.project-meta*`, category | Project detail |
| **Backdrop / OverlayPanel** | `.site-nav__backdrop`, `.site-nav__panel` | Acoplado a `SiteNav` |
| **MediaCard** genérico | — | Evitar; `ProjectCard` fica domínio |
| **ThemeSwitcher** | React feature | Só reusar Chip no face/focus |

---

## Admin vs public

| Conceito | Public | Admin | Ação |
|----------|--------|-------|------|
| Chip / CTA fill | `--foreground` / `--background` | `.admin-button` / `--admin-accent` | Analogia, não merge |
| Focus | `--primary` | `--admin-focus` | FocusRing com map |
| Link | chrome / prose | `.admin-link` | Kits separados |
| Input | — | `.admin-*` | Só admin até form público |
| Selected row | Chip nav | `.admin-preset.is-selected` | ≠ Chip público |

---

## Styleguide — gap

**Documenta:** contraste do tema (Aa, ratio, swatches, snippet CSS).

**Não documenta:** Chip, NavItem, Link, FocusRing, type scale, Prose, Grid, admin forms.

**CSS legado / órfão (candidatos a limpeza C1):** bloco `.sg-*` antigo; `.hero-cta*`; `.project-list-item*`; `.site-chrome-link` (se sem markup).

---

## Roadmap de extração

```
1. Chip          → classes .chip / .chip--on-inverted (+ specimen /styleguide)
2. NavItem       → current = Chip; SiteNav consome
3. menu/close    → button.chip
4. ThemeSwitcher → focus face = Chip
5. Link variants → chrome | prose | back | emphasis
6. FocusRing     → utility pública (+ nota admin)
7. SkipLink      → opcional pós-Chip
8. Doc type/prose/grid no /styleguide
9. Admin wrappers (Button/Field) se o editor doer
```

### Checklist visual “Chip” (pausado)

- [x] Rascunhar [`chip.contract.json`](./contracts/chip.contract.json) (pode renomear/arquivar — C1)
- [ ] **Bloqueado:** decisões V1/V2 em [`STYLE-GUIDE-REVIEW.md`](./STYLE-GUIDE-REVIEW.md)
- [ ] Spike CSS só com pedido explícito (“spike Chip agora”) — S1
- [ ] Plugar consumers / specimen / dedupe — depois do spike

---

## Tokens de referência (público)

Ver taxonomia completa + Mermaid: [`TOKEN-MAP.md`](./TOKEN-MAP.md).

```
Color   --background --foreground --primary --primary-foreground
        --muted --muted-foreground --border
Type    --type-hero* --type-display --type-heading --type-subheading
        --type-lead --type-body --type-meta --type-caption
        --font-body --font-display --font-weight-*
Space   --grid-unit --space-1…12 --container-max-width --reading-max-width
Shape   --radius --radius-card --radius-card-hover
Motion  --duration-fast
```

Admin: `--admin-bg`, `--admin-surface`, `--admin-border*`, `--admin-text*`, `--admin-accent*`, `--admin-danger`, `--admin-focus` (+ `--space-*` / `--type-*` compartilhados).

---

*Próximo passo sugerido: **W1** interface inventory (páginas) — ver [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md); não extrair CSS antes.*
