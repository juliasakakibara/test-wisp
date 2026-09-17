# Cleanup + Audit — plano (W3C-first)

Ordem: **auditar → decidir → limpar**. Não deletar CSS/tokens “no feeling” sem report.

Fontes: [`REFERENCES.md`](./REFERENCES.md) · script atual `npm run a11y:audit` · UI real na branch `update-2026`.

---

## Status (set 2026)

### Feito (craft na `update-2026` — fora / parcial do pipeline de audit)

| Item | Notas |
|------|--------|
| `REFERENCES.md` | Tokens, W3C, colors, randoma11y, MarkText |
| Fun themes (Core + Fun) | `data-fun-theme` + LS só home/styleguide |
| ThemeSwitcher nav face | `theme: value ▼` + select nativo |
| Focus invertido no face | bloco sólido foreground/background (`0038d04`) |
| Styleguide lean board | estilo randoma11y |
| Hero 3D + whoami cursor | PNG com placa preta, hotspot alinhado |
| Decisão About (C2-A) | `/about` página existe; docs ainda misturam redirect |

### Parcial (Fase B)

| Passo | Estado |
|-------|--------|
| B2 | Código separa color-mode / Fun / Redis; **HANDOFF ainda descreve só System/Light/Dark** |
| B3 | Pares Fun inspirados em randoma11y — sem npm `randoma11y` no pipeline |
| B4 | Face + optgroups Core/Fun — não é redesign swatches/components.ai |
| B5 | Focus visual ok; contraste formal ainda entra no A1 |
| B1 | Audit a11y dedicado (Escape / `aria-expanded` se custom) **pendente** |

### Não iniciado (pipeline formal + produto + docs GitHub)

Fase **0**, **A1–A8**, **C0–C1**, **C3–C5**, **D1–D3**, **E1–E4** (README/docs públicos, tokens schema, perf tests, mapa W3C).

---

## Princípios (W3C)

1. **Critérios versionados** — WCAG e specs de plataforma vêm da [W3C API](https://w3c.github.io/w3c-api/) / [`api.w3.org/doc`](https://api.w3.org/doc), não de memória.
2. **Design system documentado = verdade** — padrão [design-system.w3.org](https://design-system.w3.org): camadas CSS, FFO nas libs, i18n explícito.
3. **Tema = delta** — estilo [Kelp theme builder](https://kelpui.com/docs/customizing/theme-builder/): só emitir o que difere da base.
4. **Cor & switcher com craft** — [mrmrs/colors](https://github.com/mrmrs/colors), [components.ai](https://components.ai), [CSS GUI](https://components.ai/css-gui/home) e **[randoma11y](https://www.npmjs.com/package/randoma11y)** (pares acessíveis APCA/WCAG) informam paleta/UI do `ThemeSwitcher` e geração de presets — não só “3 botões”.
5. **Tokens nomeados** — mental model [DTCG Format](https://www.designtokens.org/tr/2025.10/format/); audit de órfãos antes de podar.
6. **Tipografia mensurável** — [Font Face Observer](https://fontfaceobserver.com) + [font-style-matcher](https://meowni.ca/font-style-matcher/).
7. **Layout debug só em dev** — [Pesticide](https://github.com/mrmrs/pesticide).

---

## Fase 0 — Spec pin via W3C API

**Status:** pendente · **Objetivo:** o audit sabe *qual* WCAG/TR está em vigor.

| Passo | Ação |
|-------|------|
| 0.1 | Client read-only: `GET https://api.w3.org/specifications/{shortname}` (ex. `WCAG22`, `appmanifest`) + versões/status |
| 0.2 | Script `scripts/w3c-spec-pin.ts` (ou seção no a11y audit) que imprime shortname, título, latest / TR URL |
| 0.3 | Commitar um snapshot leve `docs/spec-pins.json` (shortname → `latest-version` URL + data do fetch) — regenerável |
| 0.4 | Critérios do audit citam o pin (ex. “WCAG 2.2 1.4.3 / 1.4.11”) em vez de texto solto |

Libs oficiais se quiser: [node-w3capi](https://github.com/w3c/node-w3capi) / [Apiary](https://github.com/w3c/apiary). Começar com `fetch` + HAL basta.

**Fora de escopo:** ReSpec/Bikeshed (só consulta).

---

## Fase A — Audits automatizáveis

### A1 — Contraste & tema (já existe, expandir) · pendente

- Hoje: `npm run a11y:audit` → presets Redis (`theme-presets.ts`)
- Expandir:
  - color-mode **light/dark** reais (`globals.css` `:root[data-color-mode]`)
  - Fun themes ativos (`data-fun-theme`)
  - tokens derivados (`--muted-foreground`, `--border`) no público
  - estados do ThemeSwitcher (hover / focus invertido)
- Exit code ≠ 0 no CI quando falhar

### A2 — A11y de página · pendente

- axe (ou `@axe-core/playwright`) em: `/`, `/about`, um `/projects/[slug]`, `/admin/login`
- Manual: bookmarklet Text Spacing (WCAG 1.4.12) — já citado em `VISUAL-ANALYSIS.md`

### A3 — Tipografia · pendente

- Checklist font-style-matcher: métricas fallback vs Inter
- FFO só se sair de `next/font`; senão documentar cobertura next/font

### A4 — Tokens órfãos (DTCG-minded) · pendente

- Script: `--*` definidos em `globals.css` × usados em CSS/TSX
- Banlist Shadcn: `--card`, `--popover`, `--input`, etc.
- Report guia o **P1 delete**

### A5 — Layout CSS (dev) · pendente

- Pesticide bookmarklet / toggle local na passada de limpeza de `globals.css`
- Nunca em prod

### A6 — Tema Redis = delta (Kelp) · pendente

- Diff: CSS injetado `#__site_theme__` vs base color-mode
- Meta: emitir só overrides

### A7 — Manifest · pendente (i18n → **D2**)

- Checklist [appmanifest](https://www.w3.org/TR/appmanifest/) se houver PWA
- `lang` no documento alinhado ao locale ativo (depois de D2)

### A8 — Spec freshness (W3C API, contínuo) · pendente

- Job/script: se `latest` do pin mudou (ex. WCAG), falhar soft / abrir TODO no report
- Opcional: cruzar shortnames com [browser-specs](https://github.com/w3c/browser-specs) para APIs web usadas no hero (`model-viewer`, `matchMedia`, etc.)

---

## Fase B — ThemeSwitcher (trabalho dedicado)

Problema original: switcher só System/Light/Dark utilitário. **Já evoluiu** para face `theme: value ▼` + Core/Fun + focus invertido; falta fechar a11y formal, docs e craft restante.

| Passo | Ação | Estado | Ref |
|-------|------|--------|-----|
| B1 | Auditar a11y do switcher (nome, focus, teclado; native `<select>` já cobre muito) | pendente | WCAG |
| B2 | Docs: color-mode + Fun (`data-fun-theme`) vs tema Redis (admin) — sync HANDOFF | parcial | HANDOFF |
| B3 | Pares via randoma11y no pipeline / explorar mrmrs/colors | parcial (Fun manuais) | craft + a11y |
| B4 | Craft extra (swatches etc.) **só se** face atual não bastar | adiado — face shipped | components.ai |
| B5 | Contraste hover/focus no A1 | pendente (visual ok) | WCAG 1.4.11 |

Não misturar B com delete de CSS até A4 rodar.

---

## Fase C — Limpeza (depois dos reports)

### C0 — Docs = código · **próximo útil (com E1)**

- `HANDOFF` / `README` / styleguide: home = Hero + Work; `/about` página; hero 3D shipped; Fun themes; sem “redirect #about” mentiroso
- ThemeSwitcher: Core + Fun + focus invertido
- README GitHub face alinhado — ver **E1**

### C1 — Remover morto (guiado por A4/A5) · pendente

- SVGs create-next-app · font pixel órfã · CSS list/scroll-cue/spans · `(site)/layout` noop
- Campos Redis sem DOM: religar **ou** remover do admin

### C2 — Decisão About · **feito (A)**

- **A (preferida):** manter `/about` e docs seguem o código ← escolhido  
- **B:** one-page `#about` + redirect (só se reverter IA)

### C3 — Deps leves · pendente

- Trocar `lucide-react` / `date-fns`; avaliar GSAP só no scramble

### C4 — CSS structure (W3C DS / Kelp) · pendente

- Camadas ou split: public / admin / styleguide  
- Comentário Tailwind morto · renumerar seções

### C5 — Conteúdo · pendente

- Playbook Wisp · drafts TODO · Redis vs defaults
- CV: escrever/editar em MarkText → publicar HTML/PDF em `public/resume/` (ver D2)

**Fora:** dancing.glb, R3F face light, scroll-parallax — features, não cleanup.

---

## Fase D — Product / UX (pedido Julia, set 2026)

Trabalho de produto **em paralelo** ao pipeline W3C — não precisa esperar A4.

### D1 — Nav mobile · pendente · **prioridade alta**

Hoje: `SiteChrome` renderiza `.nav-list` horizontal (work / about / cv / style guide + ThemeSwitcher) sem padrão mobile dedicado — em viewport estreita o header aperta / quebra.

| Passo | Ação |
|-------|------|
| D1.1 | Definir padrão: menu overlay / drawer / lista empilhada (craft Helen-like, sem hamburger genérico se der) |
| D1.2 | Hit targets ≥ 44px; focus trap se drawer; `aria-expanded` / Escape |
| D1.3 | ThemeSwitcher acessível no mobile (não esconder só o focus invertido) |
| D1.4 | Testar ≤639px e landscape; axe no header |

### D2 — Idioma: EN first → PT · pendente

Hoje: `lang="en"`, copy/nav em inglês, resumes EN+PT estáticos em `public/resume/`.

| Passo | Ação |
|-------|------|
| D2.1 | **Pass EN:** auditar UI hardcoded (nav, skip-link, empty states, admin labels públicos) + SiteConfig/Wisp — tudo consistente em inglês |
| D2.2 | Inventário de strings (chrome + defaults Redis + metadata) |
| D2.3 | Estratégia: `en` default; `pt` via locale (`/pt/…` ou cookie/`Accept-Language`) — alinhar notas i18n W3C em REFERENCES |
| D2.4 | Traduzir chrome + about + hero; CV PT já existe — ligar nav `cv` ao locale |
| D2.5 | Authoring: MarkText para drafts; site publica HTML por locale |

Não misturar D2 com rewrite grande de CMS até D2.1 fechar.

### D3 — Performance de carregamento · pendente

Já há lazy do `model-viewer` (`HeroModelViewerLazy`) e GLB otimizado — ainda dá para medir e apertar.

| Passo | Ação |
|-------|------|
| D3.1 | Baseline: Lighthouse / Web Vitals (LCP, INP, CLS) em `/`, `/about`, um project |
| D3.2 | Hero: poster/LCP, adiar JS 3D, `prefers-reduced-motion` |
| D3.3 | Fonts (`next/font`), imagens (`next/image` sizes), route JS split |
| D3.4 | Cache headers / static onde der; opcional Speed Insights + Web Analytics (Vercel) |
| D3.5 | Budget: não regressar LCP ao adicionar Fun themes / nav mobile |

### D? — Candidatos (ainda não na lista ativa)

Só se sobrar capacidade — **não** são blockers agora:

| Ideia | Por quê |
|-------|---------|
| `#contact` / CTAs hero | Já no playbook / HANDOFF opcional |
| SEO OG por rota | metadata parcial; revisar com D2 |
| `prefers-reduced-motion` global | a11y + D3.2 |
| 404 / error UI craft | polish |
| CI strict sem `WISP_BLOG_ID` | HANDOFF “problemas conhecidos” |
| Analytics | só depois de conteúdo real |

---

## Fase E — Documentação do repo (GitHub + W3C-minded)

**Por quê:** o README já é case study, mas está **desatualizado** vs código (Fun themes, `/about`, hero 3D, cursor). As refs W3C em [`REFERENCES.md`](./REFERENCES.md) mostram o padrão: **design system documentado = verdade**, docs de uso/i18n separados, testes de assets/perf, tokens com schema nomeado ([DTCG Format](https://www.designtokens.org/tr/2025.10/format/)).

Modelo mental (não copiar PHP/Composer da W3C — só a *estrutura*):

| Ref W3C / DTCG | O que extrair para este repo |
|----------------|------------------------------|
| [design-system.w3.org](https://design-system.w3.org) — camadas CSS 00–90 | Documentar camadas reais do `globals.css` (settings → base → layout → components → admin) |
| [Using the design system](https://github.com/w3c/w3c-website-frontend/blob/main/docs/using-the-design-sytem.md) | `docs/` com “como usar / como testar” (local, preview, prod) |
| [i18n notes](https://github.com/w3c/w3c-website-frontend/blob/main/docs/internationalization.md) | Doc de locale EN→PT (amarra D2) |
| [DTCG Format](https://www.designtokens.org/tr/2025.10/format/) | Inventário + schema dos tokens (`--space-*`, color-mode, Fun) — revisão, não só órfãos A4 |
| Kelp theme builder | Documentar tema = delta (Redis vs base) |
| browser-specs / W3C API | Spec pins + o que testamos (amarra Fase 0 / A8 / D3) |

Hoje no GitHub: `README.md` (público) + `docs/*` (HANDOFF interno, playbook, drafts). Falta **mapa claro** README → docs e pacotes de teste/schema.

### E1 — Face pública do repo · pendente · **junto com C0**

| Passo | Ação |
|-------|------|
| E1.1 | Atualizar `README.md`: arquitetura real (Hero+Work, `/about`, Fun + Core, whoami cursor) |
| E1.2 | Índice no README → `docs/` (HANDOFF, CLEANUP-AUDIT, REFERENCES, playbook) — visitante GitHub acha o caminho |
| E1.3 | Badges/comandos mínimos: `npm run dev`, `a11y:audit`, `models:optimize` |
| E1.4 | Separar “case study” (README) vs “continuidade agent” (HANDOFF) — sem duplicar parágrafos eternamente |

### E2 — Docs de sistema (estilo W3C frontend) · pendente

| Passo | Ação |
|-------|------|
| E2.1 | `docs/DESIGN-SYSTEM.md` (ou seção README): camadas CSS, tokens, 3+1 theming (color-mode / Fun / preview / Redis) |
| E2.2 | `docs/TESTING.md`: a11y (`a11y:audit`, axe A2), contraste, Text Spacing; **perf** (Lighthouse/Web Vitals — amarra D3); checklist manual |
| E2.3 | `docs/I18N.md` stub → preenche com D2 (refs W3C i18n) |
| E2.4 | Opcional: `CONTRIBUTING.md` curto (branch, PR, não commitar secrets) |

### E3 — Tokens & schemas · pendente (depois ou junto de A4)

| Passo | Ação |
|-------|------|
| E3.1 | Inventário nomeado alinhado DTCG (core vs Fun vs admin) — tabela ou JSON leve |
| E3.2 | Schema / convenções: o que pode existir no Redis theme vs o que é só CSS |
| E3.3 | Ligar A4 (órfãos) ao inventário: report cita o schema, não lista solta |
| E3.4 | Styleguide `/styleguide` = doc viva; markdown = espelho para GitHub |

### E4 — Perf & qualidade no docs · pendente (com D3)

| Passo | Ação |
|-------|------|
| E4.1 | Registrar baseline (números + data) em `docs/TESTING.md` ou `docs/PERF.md` |
| E4.2 | Budget escrito (ex. LCP hero, peso GLB pós-`models:optimize`) |
| E4.3 | Como re-rodar (Lighthouse CI opcional mais tarde) |

**Fora de E:** ReSpec/Bikeshed como publisher do site — só consulta (já em REFERENCES).

---

## Ordem de execução sugerida (restante)

```
C0 + E1   Docs sync + README GitHub face     ← baixo risco, alto valor portfolio
D1        Nav mobile                         ← produto, alta
D3.1+E4.1 Baseline perf (medir + anotar)
0         Spec pin (W3C API)                 → docs/spec-pins.json
E2        DESIGN-SYSTEM + TESTING stubs
A1        Expandir a11y:audit
A4 + E3   Token orphans + schema DTCG-minded
D2.1      Pass EN
A2        axe (inclui nav mobile)
B1 + B2   ThemeSwitcher a11y + HANDOFF Fun
D3.2–D3.5 Otimizações guiadas pelo baseline
C1        Deletes guiados
D2.2–D2.5 Locale PT (+ E2.3 I18N.md)
B3/B5 · A3/A5–A8 · C3–C5 · E2.4 CONTRIBUTING
```

---

## Critério de “pronto”

| Check | Como | Agora |
|-------|------|-------|
| Specs pinadas | `spec-pins.json` + script regenera via API | ❌ |
| Contraste | `a11y:audit` passa presets **e** color-modes (+ Fun) | ❌ |
| Páginas | axe limpo nas rotas A2 | ❌ |
| Tokens | inventário/schema + A4 limpo ou justificado | ❌ |
| Docs internos | HANDOFF = código real | ❌ |
| Docs GitHub | README atualizado + mapa `docs/` + TESTING/PERF | ❌ |
| ThemeSwitcher | focus invertido shipped; ARIA/audit B1; docs B2 | parcial |
| W3C API | usada no pipeline de audit | ❌ |
| Nav mobile | header usável ≤639px + a11y | ❌ |
| i18n | EN consistente; PT disponível | ❌ |
| Perf | baseline documentado + LCP hero sob controle | ❌ |
| CV authoring | MarkText → resume HTML | tooling |

---

## Comandos âncora (hoje / alvo)

```bash
# Hoje
npm run a11y:audit

# Alvo (nomes sugeridos)
npm run audit:specs      # W3C API → spec-pins.json
npm run audit:a11y       # presets + color-mode + Fun (+ axe se houver)
npm run audit:tokens     # órfãos + banlist (+ cita schema E3)
```

---

*Última atualização: set 2026 — Fase D (nav/i18n/perf) + Fase E (docs GitHub, schemas tokens, testes W3C-minded).*
