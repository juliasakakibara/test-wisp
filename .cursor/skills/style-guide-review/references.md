# Referências — UI refinement / style guide review

## Workflow deste repo

| Doc | Uso |
|-----|-----|
| `docs/UI-REFINEMENT-WORKFLOW.md` | Frost-first: W1 páginas → W2 atomic → W3 tokens → W4 |
| `docs/STYLE-GUIDE-REVIEW.md` | OPEN / DECIDED / PARKED |
| `docs/TOKEN-AUDIT-LEDGER.md` | Oferta de `--*` (não é W1) |
| `docs/TOKEN-MAP.md` | Mermaid — atualizar na W3 |
| `docs/COMPONENT-INVENTORY.md` | Refazer na W2 pós-W1 |

## W1 — Interface inventory

| Recurso | URL |
|---------|-----|
| Brad Frost — Conducting an Interface Inventory | https://bradfrost.com/blog/post/conducting-an-interface-inventory/ |
| Atomic Design — The Atomic Workflow | https://atomicdesign.bradfrost.com/chapter-4/ |
| Smashing — Atomic Design Workflow | https://www.smashingmagazine.com/2016/12/atomic-design-workflow/ |
| Nathan Curtis — Component Cut-Up Workshop | https://nathanacurtis.substack.com/p/the-component-cut-up-workshop-1378ae110517 |

## W2–W3 — Atomic + tokens

| Recurso | URL | Nota |
|---------|-----|------|
| Curtis — Reimagining a token taxonomy | https://medium.com/eightshapes-llc/reimagining-a-token-taxonomy-462d35b2b033 | Auditar tokens **nos** componentes |
| Vodafone UK — Variables taxonomy | https://medium.com/vodafone-uk-design-experience/figma-variables-at-vodafone-uk-how-we-structured-taxonomy-for-a-complex-multi-brand-design-system-693b1b95675f | Brand→P→S→Page |
| Vanilla Foundations Workshop | https://www.figma.com/design/YWp3WQ9LqGtZBdCnq342eE/Vanilla-Foundations-Workshop--Community- | Pedagogia P+S+themes; **não** copiar nomes |
| UX Collective — Figma Variables | https://uxdesign.cc/design-system-figma-variables-f3d9c4351bcc | |
| Brad Frost — Themeable DS | https://bradfrost.com/blog/post/creating-themeable-design-systems/ | |
| Component Contracts | https://github.com/nvillapiano/component-contracts-figma | Pós-W3 se Figma |
| Brad Frost — DS Governance FigJam | https://www.figma.com/board/1NGkfRVIwNoV7DKOkh8VRC/Design-System-Governance-Process--Community- | Use→Talk→Build→Release→Adopt |

## Button / link

| Recurso | URL |
|---------|-----|
| Adam Silver — hand cursor | https://adamsilver.io/blog/buttons-shouldnt-have-a-hand-cursor/ |
| Adam Silver — buttons look like links | https://adamsilver.io/blog/but-sometimes-buttons-look-like-links/ |
| W3C Design System | https://design-system.w3.org |

## Contraste (não instalar)

| Recurso | URL |
|---------|-----|
| Once UI AI coding | https://docs.once-ui.com/api/agent/markdown?path=%2Fai-coding |
| Kelp | https://github.com/cferdinandi/kelp |

## Fatos do código

- Público: SiteNav + ThemeSwitcher (`<select>`); modes `data-color-mode` / `data-fun-theme`.
- Admin: `--admin-*`; preview iframe `data-env="admin"`.
- Visual plaquinha: CSS ad-hoc — nome TBD (V1).
