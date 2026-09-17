# Cleanup + Audit — plano (W3C-first)

Ordem: **auditar → decidir → limpar**. Não deletar CSS/tokens “no feeling” sem report.

Fontes: [`REFERENCES.md`](./REFERENCES.md) · script atual `npm run a11y:audit` · UI real na branch `update-2026`.

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

**Objetivo:** o audit sabe *qual* WCAG/TR está em vigor.

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

### A1 — Contraste & tema (já existe, expandir)

- Hoje: `npm run a11y:audit` → presets Redis (`theme-presets.ts`)
- Expandir:
  - color-mode **light/dark** reais (`globals.css` `:root[data-color-mode]`)
  - tokens derivados (`--muted-foreground`, `--border`) no público
- Exit code ≠ 0 no CI quando falhar

### A2 — A11y de página

- axe (ou `@axe-core/playwright`) em: `/`, `/about`, um `/projects/[slug]`, `/admin/login`
- Manual: bookmarklet Text Spacing (WCAG 1.4.12) — já citado em `VISUAL-ANALYSIS.md`

### A3 — Tipografia

- Checklist font-style-matcher: métricas fallback vs Inter
- FFO só se sair de `next/font`; senão documentar cobertura next/font

### A4 — Tokens órfãos (DTCG-minded)

- Script: `--*` definidos em `globals.css` × usados em CSS/TSX
- Banlist Shadcn: `--card`, `--popover`, `--input`, etc.
- Report guia o **P1 delete**

### A5 — Layout CSS (dev)

- Pesticide bookmarklet / toggle local na passada de limpeza de `globals.css`
- Nunca em prod

### A6 — Tema Redis = delta (Kelp)

- Diff: CSS injetado `#__site_theme__` vs base color-mode
- Meta: emitir só overrides

### A7 — Manifest + i18n

- Checklist [appmanifest](https://www.w3.org/TR/appmanifest/) se houver PWA
- `lang`, resumes EN/PT vs site — notas W3C i18n em REFERENCES

### A8 — Spec freshness (W3C API, contínuo)

- Job/script: se `latest` do pin mudou (ex. WCAG), falhar soft / abrir TODO no report
- Opcional: cruzar shortnames com [browser-specs](https://github.com/w3c/browser-specs) para APIs web usadas no hero (`model-viewer`, `matchMedia`, etc.)

---

## Fase B — ThemeSwitcher (trabalho dedicado)

Problema: switcher atual é menu System/Light/Dark utilitário; refs (colors + components.ai) pedem **cor como craft** e UI mais clara.

| Passo | Ação | Ref |
|-------|------|-----|
| B1 | Auditar a11y do switcher (nome acessível, focus, Escape, `aria-expanded`) — A2 | WCAG |
| B2 | Separar mentalmente **color-mode** (visitante) vs **tema Redis** (admin) — docs + UI | HANDOFF 3 camadas |
| B3 | Explorar paleta / rampas com [mrmrs/colors](https://github.com/mrmrs/colors); gerar pares com [randoma11y](https://www.npmjs.com/package/randoma11y) (`WCAG21` 4.5 alinhado ao `a11y:audit`, ou APCA se documentar pin); UI craft em [components.ai](https://components.ai) / [CSS GUI](https://components.ai/css-gui/home) | craft + a11y |
| B4 | Redesign do controle (swatches/ícones, menos menu genérico) sem quebrar `user_color_mode` | components.ai |
| B5 | Contraste dos estados hover/active/focus no switcher entra no A1 | WCAG 1.4.11 |

Não misturar B com delete de CSS até A4 rodar.

---

## Fase C — Limpeza (depois dos reports)

### C0 — Docs = código

- `HANDOFF` / `README` / styleguide: home = Hero + Work; `/about` página; hero 3D shipped; sem “redirect #about” mentiroso

### C1 — Remover morto (guiado por A4/A5)

- SVGs create-next-app · font pixel órfã · CSS list/scroll-cue/spans · `(site)/layout` noop
- Campos Redis sem DOM: religar **ou** remover do admin

### C2 — Decisão About

- **A (preferida):** manter `/about` e docs seguem o código  
- **B:** one-page `#about` + redirect (só se reverter IA)

### C3 — Deps leves

- Trocar `lucide-react` / `date-fns`; avaliar GSAP só no scramble

### C4 — CSS structure (W3C DS / Kelp)

- Camadas ou split: public / admin / styleguide  
- Comentário Tailwind morto · renumerar seções

### C5 — Conteúdo

- Playbook Wisp · drafts TODO · Redis vs defaults

**Fora:** dancing.glb, R3F face light, scroll-parallax — features, não cleanup.

---

## Ordem de execução sugerida

```
0  Spec pin (W3C API)           → docs/spec-pins.json
A1 Expandir a11y:audit          → light/dark + presets
A4 Token orphan report          → lista de deletes
A2 axe nas rotas críticas
B1–B2 ThemeSwitcher a11y + docs
C0 Docs sync
C1 Deletes guiados
B3–B5 Redesign switcher (colors / components.ai)
A3 Tipografia · A5 Pesticide na passada CSS · A6 tema delta
A7 Manifest/i18n · A8 freshness
C3–C5 resto
```

---

## Critério de “pronto”

| Check | Como |
|-------|------|
| Specs pinadas | `spec-pins.json` + script regenera via API |
| Contraste | `a11y:audit` passa presets **e** color-modes |
| Páginas | axe limpo nas rotas A2 |
| Tokens | zero órfãos na banlist; report A4 vazio ou justificado |
| Docs | HANDOFF descreve a home real |
| ThemeSwitcher | focus/ARIA ok; visual alinhado a B4 sem regressão de color-mode |
| W3C API | usada no pipeline de audit (não só link em REFERENCES) |

---

## Comandos âncora (hoje / alvo)

```bash
# Hoje
npm run a11y:audit

# Alvo (nomes sugeridos)
npm run audit:specs      # W3C API → spec-pins.json
npm run audit:a11y       # presets + color-mode (+ axe se houver)
npm run audit:tokens     # órfãos + banlist
```

---

*Última atualização: set 2026 — plano recriado com W3C API, ThemeSwitcher, mrmrs/colors e components.ai.*
