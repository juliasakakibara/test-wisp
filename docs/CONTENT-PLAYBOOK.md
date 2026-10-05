# Content Playbook — não esquecer na hora H

**Comece aqui** quando for publicar conteúdo real (copy, Wisp, mídia, deploy).

Tom de voz: divertido, humano, menos corporativo — baseado no [about antigo](https://juliasakakibara.com.br/about-me).

---

## Mapa da documentação

| Doc | Para quê |
|-----|----------|
| **[CONTENT-PLAYBOOK.md](./CONTENT-PLAYBOOK.md)** ← você está aqui | Checklist master — o que fazer e em que ordem |
| [CONTENT-STRATEGY.md](./CONTENT-STRATEGY.md) | Estratégia, tiers, tom de voz, copy SiteConfig §6 |
| [CASE-TEMPLATE.md](./CASE-TEMPLATE.md) | Esqueleto para começar um case |
| [WISP-POST-DRAFTS.md](./WISP-POST-DRAFTS.md) | Rascunhos completos para colar no Wisp CMS |
| [DEV-SECRETS.md](./DEV-SECRETS.md) | Easter eggs no código (`__julia`, Konami) |
| [HANDOFF.md](./HANDOFF.md) | Arquitetura técnica, admin, env vars |
| [`src/lib/redis.ts`](../src/lib/redis.ts) | **Fonte de verdade** do `DEFAULT_SITE_CONFIG` |

---

## Colar numa nova conversa (conteúdo)

```
Estou publicando o conteúdo real do meu portfólio.
Leia docs/CONTENT-PLAYBOOK.md e docs/WISP-POST-DRAFTS.md.
Prioridade: Auway primeiro, tom divertido do about-me, HTML/CSS puro na UI pública.
```

---

## Fase 0 — Antes de escrever

- [ ] Ler [CONTENT-STRATEGY.md §2](./CONTENT-STRATEGY.md) (tom de voz)
- [ ] Portfolio antigo aberto para imagens/copy: https://juliasakakibara.com.br/
- [ ] Wisp CMS acessível (`NEXT_PUBLIC_WISP_BLOG_ID` no `.env.local`)
- [ ] Admin local: http://localhost:3000/admin/theme

### Redis vs defaults (importante)

| Situação | O que o site mostra |
|----------|---------------------|
| Redis **vazio** | `DEFAULT_SITE_CONFIG` em `redis.ts` (já com copy da Julia) |
| Redis **com dados** | O que foi salvo no admin — **ignora** defaults novos |

Para forçar copy nova: editar no `/admin/theme` **ou** apagar key `site_config` no Upstash.

---

## Fase 1 — SiteConfig (copy estática)

**Onde:** `/admin/theme` ou [`redis.ts`](../src/lib/redis.ts) → depois salvar no admin.

**Texto canônico:** [CONTENT-STRATEGY.md §6](./CONTENT-STRATEGY.md) (= `DEFAULT_SITE_CONFIG`).

| Campo | Status | Nota |
|-------|--------|------|
| `siteName` | ✅ rascunho pronto | Julia Sakakibara |
| `siteDescription` | ✅ | SEO / metadata |
| `heroTitle` | ✅ | |
| `heroDescription` | ✅ | Menciona Auway + Byte Verse |
| `aboutTitle` | ✅ | `/about` |
| `aboutIntro` | ✅ | ballet, judo, plot twist |
| `aboutBody` | ✅ | 3 things, stack, Academy thread, telepathy beta |
| `workSectionTitle` | ✅ | Selected work |
| `workSectionIntro` | ✅ | Auway primeiro |
| `footerText` | ✅ | coffee + tokens + telepathy |

### Ainda não existem no SiteConfig (roadmap)

- [ ] CTAs no hero (Work, GitHub, LinkedIn) — precisa implementação
- [ ] Links sociais no footer — precisa campos novos ou HTML no footer
- [ ] `heroRole` line separada — opcional
- [ ] Resume PDF link

### CV / resume — authoring

- Tooling: **[MarkText](https://github.com/marktext/marktext)** (markdown live preview, free) — ver [`REFERENCES.md`](./REFERENCES.md)
- Publicado no site: `public/resume/julia-sakakibara-en.html` (+ PT)
- Fluxo: editar em MarkText → export/portar para HTML (ou PDF) → commit em `public/resume/`
- Plano: [`CLEANUP-AUDIT.md`](./CLEANUP-AUDIT.md) **Fase D2** (EN first → PT) · MarkText em REFERENCES

---

## Fase 2 — Posts Wisp (case studies)

**Rascunhos:** [WISP-POST-DRAFTS.md](./WISP-POST-DRAFTS.md)

### Ordem na home (`#work`) — 6 cards

| # | Slug | Nome | Prioridade |
|---|------|------|------------|
| 1 | `auway` | **Auway** | 🔴 fazer primeiro |
| 2 | `julia-portfolio` | This Portfolio | meta case |
| 3 | `hairy` | Hairy | Academy — plantas + hardware + Watch |
| 4 | `byte-verse` | Byte Verse | Space Invaders + acelerômetro |
| 5 | `mvp-mcp-figma` | MVP MCP → Figma | |
| 6 | `hidden-guardians` | Hidden Guardians | AR / USDZ |

### Tier 2 — publicar, fora da home

| Slug | Nome |
|------|------|
| `visualizador-3d` | 3D Product Viewer |
| `404-error-page` | 404 Error Page |
| `pool-watch` | PoolWatch |

### Checklist por post

- [ ] `title`, `slug`, `description` (card)
- [ ] `image` cover 16:9 (reusar MyPortfolio se necessário)
- [ ] `tags` — disciplina + stack (máx. 2 visíveis no card)
- [ ] `publishedAt` = **ano do projeto**, não data de hoje
- [ ] Corpo: [`CASE-TEMPLATE.md`](./CASE-TEMPLATE.md) — problema → decisão → resultado, não capítulos de processo
- [ ] ≥1 link externo (demo, GitHub, vídeo)
- [ ] Preencher `[TODO]` nos rascunhos antes de publicar

### Mídia prioritária (não esquecer)

| Projeto | O que gravar/capturar |
|---------|------------------------|
| **Auway** | App + collar no pet + Apple Watch — vídeo 15–30s |
| **Hairy** | Plant ID + hardware + Watch |
| **Byte Verse** | Alguém inclinando o celular jogando |
| **Hidden Guardians** | Link USDZ já existe |
| **404** | Demo + GitHub já existem |

### Cluster Apple Developer Academy (narrativa)

Contar como **três faces do mesmo perfil**:

- **Auway** — flagship, Strava de pets, collar RP2040, gamificação, DS temático (Halloween etc.)
- **Hairy** — continuação do TCC, plantas, sensores, ML, Watch
- **Byte Verse** — lab, acelerômetro, Space Invaders (era "Game" no site antigo)

TCC / Repositório Técnico: **não** é post separado — mencionar dentro de Hairy + portfolio.

---

## Fase 3 — Implementação visual (código)

Ainda pendente — não bloqueia Wisp, mas completa a experiência.

| Item | Onde | Referência |
|------|------|------------|
| Hero 3D | `Developer/3d` → integrar no site | [CONTENT-STRATEGY §7](./CONTENT-STRATEGY.md) |
| CTAs hero | `layout.tsx` / `(site)/page.tsx` | Work, GitHub, LinkedIn |
| Footer social | `layout.tsx` + SiteConfig? | §6 roadmap |
| OG images por case | Wisp + metadata | opcional |

**Hero 3D:** usar `model-3.glb` (~4.6 MB), não `teste.glb` (13 MB). Client component + `prefers-reduced-motion`.

---

## Fase 4 — QA antes de considerar “live”

### Conteúdo

- [ ] Home mostra 6 projetos (não empty state)
- [ ] About lê bem no mobile (quebras de linha do `aboutBody`)
- [ ] Auway abre em `/projects/auway` com links funcionando
- [ ] Tags nos cards fazem sentido (Case study · ano · disciplinas)

### Técnico

- [ ] `npm run build` passa
- [ ] `NEXT_PUBLIC_SITE_URL` setado em prod
- [ ] Admin password ≠ `admin123` em prod
- [ ] Republish no admin se editou copy (`republishSite`)

### Opcional divertido

- [ ] Console: `__julia.help()` — ver [DEV-SECRETS.md](./DEV-SECRETS.md)
- [ ] Konami code no logo 😄

---

## Referências rápidas (links)

| Recurso | URL |
|---------|-----|
| About (tom de voz) | https://juliasakakibara.com.br/about-me |
| Portfolio antigo | https://juliasakakibara.com.br/ |
| Auway (visual) | https://juliasakakibara.com.br/auway |
| 404 demo | https://juliasakakibara.github.io/404-error-page/ |
| 404 GitHub | https://github.com/juliasakakibara/404-error-page |
| Hidden Guardians AR | https://juliasakakibara.github.io/usdz-file/HiddenGuardiansFixed.usdz |
| MVP MCP GitHub | https://github.com/juliasakakibara/mvp-mcp |
| GitHub Julia | https://github.com/juliasakakibara |

---

## Resumo em uma frase

> **Auway primeiro no Wisp**, copy estática já está no `redis.ts`, tom do [about-me](https://juliasakakibara.com.br/about-me), vídeos dos cases mobile, hero 3D depois.

---

*Última atualização: maio 2026 — sincronizado com `redis.ts` e tiers da CONTENT-STRATEGY.*
