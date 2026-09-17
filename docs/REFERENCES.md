# Referências — tokens, specs e W3C

Consulta permanente (não é backlog de feature).  
Plano: [`CLEANUP-AUDIT.md`](./CLEANUP-AUDIT.md) — Fase **E** = docs GitHub + schemas + testes.

## Como estas refs alimentam o repo

| Tema | Refs abaixo | Entrega neste projeto |
|------|-------------|------------------------|
| Design system documentado | W3C DS, using-the-design-system | `docs/CSS-ARCHITECTURE.md` + `/styleguide` + inventário — **style guide in-repo**, não package DS |
| Componentes / primitivos | Component Contracts + craft local | [`COMPONENT-INVENTORY.md`](./COMPONENT-INVENTORY.md) + [`contracts/chip.contract.json`](./contracts/chip.contract.json) |
| Tokens / schema | DTCG, Material tokens, Vodafone Variables, UX Collective (Variables), Component Contracts | [`TOKEN-MAP.md`](./TOKEN-MAP.md) + A4 orphans (E3) |
| Taxonomia multi-layer / multi-brand | Vodafone + UX Collective Variables + Component Contracts | Primitive → Semantic → Page; **themes = brand modes** (Core, Fun, Redis) |
| Contrato → Figma / CSS | Component Contracts (JSON → vars → set) | Só após decisões em [`STYLE-GUIDE-REVIEW.md`](./STYLE-GUIDE-REVIEW.md); Figma opcional |
| Button ≠ link / cursor | Adam Silver (2 posts) | Vocabulário de controles; pointer = link |
| HTML/CSS-first UI kits | Kelp; Once UI (contraste) | Inspiração — **não** dependência sem pedido |
| Revisão de fundação / UI refinement | board + workflow Frost-first | [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md) · [`STYLE-GUIDE-REVIEW.md`](./STYLE-GUIDE-REVIEW.md) · skill `style-guide-review` |
| Case writing / NDA | UX Collective Variables article (estrutura sem citar marcas) | Tom em drafts CMS / cases — não vazar cliente |
| i18n | W3C frontend + templates i18n notes | `docs/I18N.md` + Fase D2 |
| Specs versionadas | W3C API, browser-specs | `spec-pins.json` (Fase 0 / A8) |
| Perf & qualidade | (Lighthouse/Vitals no plano D3/E4; FFO / font-style-matcher em tipografia) | `docs/TESTING.md` / `PERF.md` |
| Cor / a11y craft | mrmrs/colors, randoma11y, components.ai | Fun themes + `a11y:audit` |

Não publicar o site com ReSpec/Bikeshed — só consulta de *como* documentar specs.

---

## Design tokens

| Recurso | URL | Nota |
|---|---|---|
| Design Tokens Community Group | https://www.designtokens.org | |
| DTCG Format (2025.10) | https://www.designtokens.org/tr/2025.10/format/ | |
| DTCG theme switcher (Core + Fun) | https://www.designtokens.org | |
| Material tokens (overview + Mermaid) | https://github.com/material-foundation/material-tokens/blob/main/tokens.md#tokens-overview | Ref → System |
| Vodafone UK — Figma Variables taxonomy | https://medium.com/vodafone-uk-design-experience/figma-variables-at-vodafone-uk-how-we-structured-taxonomy-for-a-complex-multi-brand-design-system-693b1b95675f | Primitive → Semantic → Page |
| UX Collective — Optimising DS with Figma Variables | https://uxdesign.cc/design-system-figma-variables-f3d9c4351bcc | Estrutura **sem citar marcas** — modelo NDA-safe |
| Brad Frost — Creating Themeable Design Systems | https://bradfrost.com/blog/post/creating-themeable-design-systems/ | Themes; W3 |
| Brad Frost — Conducting an Interface Inventory | https://bradfrost.com/blog/post/conducting-an-interface-inventory/ | **W1** — páginas primeiro |
| Brad Frost — DS Governance Process (FigJam) | https://www.figma.com/board/1NGkfRVIwNoV7DKOkh8VRC/Design-System-Governance-Process--Community- | Use → Talk → Design&Build → Release → Adopt |
| Nathan Curtis — Component Cut-Up | https://nathanacurtis.substack.com/p/the-component-cut-up-workshop-1378ae110517 | W1/W2 — cortar páginas |
| Nathan Curtis — Token taxonomy | https://medium.com/eightshapes-llc/reimagining-a-token-taxonomy-462d35b2b033 | W3 — auditar tokens nos componentes |
| Vanilla Foundations Workshop (Community) | https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community- | Primitive + Semantic + **themes**; ref de workflow — **não** copiar nomenclatura |
| Mapa deste repo | [`TOKEN-MAP.md`](./TOKEN-MAP.md) | Taxonomia + Mermaid local |
| Workflow UI refinement | [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md) | Canônico: P0 meta → W1 Frost → W2 Curtis+a11y → W3 Mermaid → W4 → Adopt |
| Ledger tokens (oferta) | [`TOKEN-AUDIT-LEDGER.md`](./TOKEN-AUDIT-LEDGER.md) | Dump `--*`; revalidar na W3 |

## Foundations com themes (ref de workflow — Vanilla)

Arquivo: [Vanilla Foundations Workshop (Community)](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-)  
**Não** adotar a nomenclatura Vanilla (`space/0`, `text/default`, …). Pegar emprestado só o **padrão de documentação + themes**.

| Fundação | Node | O que ilustra |
|----------|------|----------------|
| [Colors](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-?node-id=50-1465) | `50:1465` | Primitive ramps **e** Semantic (text/surface/…) com modes Default · Dark · Soft · Soft Dark · Neon |
| [Typography](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-?node-id=816-2389) | `816:2389` | Primitive type (size/line/weight/family) + Semantic roles (heading/body/…) + theme Soft |
| [Radius](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-?node-id=72-2374) | `72:2374` | Escala primitive (0 → round) |
| [Spacing](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-?node-id=72-2593) | `72:2593` | Escala primitive (px steps) |
| [Viewport](https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community-?node-id=402-2501) | `402:2501` | Page-level widths (≈ Vodafone Page / Viewport) |

**Para W2:** Mermaid deve mostrar (1) escalas P por domínio, (2) Semantic que **muda com theme mode**, (3) Viewport/Page à parte — como Vanilla + diagrama Vodafone (Brand→P→S→Page), com **nossos** nomes (`--space-*`, `--foreground`, …).

Cruzar com W1: hoje cor = hex no Semantic (sem ramp P); space/type já mais perto do modelo Vanilla.

---

## Component contracts (Figma + JSON)

Contrato JSON = fonte; Figma variables + component set (e CSS) = build targets. Skills `cc-figma-tokens` / `cc-figma-component` compilam — não “inventam” UI.

| Recurso | URL | Nota |
|---|---|---|
| Component Contracts (repo) | https://github.com/nvillapiano/component-contracts-figma | Schema + exemplos Button/Accordion + skills |
| Community file (Figma) | https://www.figma.com/community/file/1617658204115347372 | Arquivo gerado a partir dos contracts |
| Design file (mirror) | https://www.figma.com/design/4jbVb5ots7FqvyWY5qtGb1/Component-Contracts--Community- | Mesmo conteúdo Community |
| Schema | https://github.com/nvillapiano/component-contracts-figma/blob/main/schema/schema.json | Validar `*.contract.json` |
| Chip (rascunho deste repo) | [`contracts/chip.contract.json`](./contracts/chip.contract.json) | P0 — solid / on-inverted; mapa → `--foreground` / `--background` |

Cópia local de referência (fora do git): `~/Downloads/component-contracts-figma-main`.

## Button / link / material honesty

| Recurso | URL | Nota |
|---|---|---|
| Buttons shouldn’t have a hand cursor | https://adamsilver.io/blog/buttons-shouldnt-have-a-hand-cursor/ | Pointer = link; botões não |
| But sometimes buttons look like links | https://adamsilver.io/blog/but-sometimes-buttons-look-like-links/ | Submit · link · JS button · CTA |
| W3C Design System | https://design-system.w3.org | Anatomia documentada; não copiar API |

## HTML/CSS UI kits (inspiração)

| Recurso | URL | Nota |
|---|---|---|
| Kelp (GitHub) | https://github.com/cferdinandi/kelp | HTML + modern CSS + Web Components |
| Kelp site | https://kelpui.com | Theme builder |
| Once UI Core | https://github.com/once-ui-system/core | DS Next.js AI-native — **contraste** com style guide in-repo |

## Spec tooling

| Recurso | URL |
|---|---|
| browser-specs (W3C) | https://github.com/w3c/browser-specs |
| ReSpec docs | https://respec.org/docs/ |
| ReSpec | https://github.com/speced/respec/ |
| Bikeshed boilerplate | https://github.com/speced/bikeshed-boilerplate |
| ReSpec web services | https://github.com/speced/respec-web-services/tree/main |

## Web platform / W3C site

| Recurso | URL |
|---|---|
| Web App Manifest | https://www.w3.org/TR/appmanifest/ |
| W3C website templates | https://github.com/w3c/w3c-website-templates-bundle |
| W3C Design System | https://design-system.w3.org |
| W3C website frontend | https://github.com/w3c/w3c-website-frontend/tree/main |
| Using the design system | https://github.com/w3c/w3c-website-frontend/blob/main/docs/using-the-design-sytem.md |
| Internationalization notes (frontend) | https://github.com/w3c/w3c-website-frontend/blob/main/docs/internationalization.md |
| Internationalization (templates) | https://github.com/w3c/w3c-website-templates-bundle/blob/main/docs/internationalization/README.md |
| W3C API (repo) | https://github.com/w3c/w3c-api/ |
| W3C API docs | https://w3c.github.io/w3c-api/ |
| W3C API endpoints | https://api.w3.org/doc |

## Fonts & CSS UI kits

| Recurso | URL |
|---|---|
| Font Face Observer | https://fontfaceobserver.com |
| Font style matcher | https://meowni.ca/font-style-matcher/ |
| Kelp UI | https://kelpui.com |
| Kelp (GitHub) | https://github.com/cferdinandi/kelp |
| Kelp theme builder | https://kelpui.com/docs/customizing/theme-builder/ |
| components.ai | https://components.ai |
| CSS GUI (components.ai) | https://components.ai/css-gui/home |
| mrmrs/colors | https://github.com/mrmrs/colors |
| randoma11y (app) | https://github.com/components-ai/randoma11y |
| randoma11y (npm) | https://www.npmjs.com/package/randoma11y |
| randoma11y-js (source) | https://github.com/mrmrs/randoma11y-js |

## People & craft references

| Recurso | URL |
|---|---|
| Helen V. Holmes | https://www.helenvholmes.com |
| Helen V. Holmes — work | https://www.helenvholmes.com/work |
| Helen V. Holmes — resume | https://www.helenvholmes.com/resume |
| mrmrs | https://mrmrs.cc |
| Pesticide (CSS debug) | https://github.com/mrmrs/pesticide |

## Authoring (CV / markdown)

| Recurso | URL | Nota |
|---|---|---|
| MarkText | https://github.com/marktext/marktext | Preferido — free, open source, live preview |
| MarkText site | https://www.marktext.cc | Downloads |
| Typora | https://typora.io | Ref de UX (pago; não é a ferramenta do projeto) |
| markmap (opcional) | https://github.com/markmap/markmap | Mindmap a partir de markdown — só se CV explorar mapa |
