# Estratégia de conteúdo — Portfólio Julia Sakakibara

> **Checklist operacional:** [`CONTENT-PLAYBOOK.md`](./CONTENT-PLAYBOOK.md) — use na hora de publicar.

Rascunho de referência para reescrever copy, cases no Wisp CMS e campos do admin (Redis).  
**Tom de voz:** menos corporativo, mais humano e divertido — como o [about antigo](https://juliasakakibara.com.br/about-me).

---

## 1. Posicionamento

### De → Para

| Antes (site antigo + placeholder) | Depois (site novo) |
|---|---|
| "Freelancer Designer who codes" | **Design Engineer** — traduz necessidades reais em sistemas que funcionam |
| Grid visual sem narrativa técnica | Case studies com contexto, stack, decisões e links |
| 8 projetos flat | **6 na home** — curados por impacto para tech recruiters |
| About genérico / placeholder "Samantha" | About pessoal + stack + arco TCC → Academy (**Auway** como flagship) → web |

### One-liner (hero)

> **Designer who codes. Engineer who cares about how things feel.**

Alternativa mais playful:

> **I build things people can actually use — usually with too many tabs open and a cat nearby.**

### Para quem escrevemos

1. **Tech recruiters** — precisam de stack, links e proof of shipping em 30 segundos  
2. **Eng leads / design systems** — tokens, arquitetura CSS, decisões técnicas  
3. **Pares criativos** — 3D, motion, hardware, experimentos  

---

## 2. Tom de voz (voice guide)

Base: [juliasakakibara.com.br/about-me](https://juliasakakibara.com.br/about-me)

### Faça

- Frases curtas. Parágrafos respiráveis.
- Humor seco, autoironia leve (*"telepathy is still in beta"*, *"my brain has limited RAM"*).
- Metáforas concretas (listas, padrões, RAM) em vez de buzzwords.
- Primeira pessoa. Confiante sem ser arrogante.
- Mostrar curiosidade multidisciplinar (ballet → judo → design → código → 3D printer).

### Evite

- "Passionate about leveraging synergies..."
- "Spearheaded cross-functional initiatives..."
- Tom de case study de consultoria Big Four.
- Listar 15 tecnologias sem contexto.
- Descrições que poderiam ser de qualquer portfólio Behance.

### Exemplos de tom

| ❌ Sério demais | ✅ Seu tom |
|---|---|
| "Implemented accelerometer-based input modality" | "You tilt the phone. The ship moves. It's weirdly satisfying." |
| "Led end-to-end product development" | "I built the app, broke the hardware twice, fixed it the third time." |
| "Utilized semantic HTML for SEO optimization" | "I like HTML that machines *and* humans can read. Recruiters are both, apparently." |

### Idioma

- **Site / cases:** inglês (mercado tech internacional + consistência com about antigo).
- **Notas internas neste doc:** português.
- Se quiser versão PT-BR depois: duplicar posts no Wisp ou campo bilíngue no futuro.

---

## 3. Pontos fortes (estratégia)

### Produto & narrativa

| Força | Por quê importa |
|---|---|
| **Auway — flagship Academy** | Produto quase pronto para venda: Strava de pets, gamificação, DS temático, hardware custom |
| **Cluster Apple Developer Academy** (Auway + Hairy + Byte Verse) | Três projetos, três problemas — mesmo perfil: app + sensores + Watch |
| **Arco TCC → Academy → Portfolio** | Pesquisa → ship mobile → web semântica |
| **Hardware DIY** (Auway RP2040 collar + Hairy sensors) | Smart collar menor que comercial — diferencial físico + digital |
| **Meta case (este site)** | O portfólio explica como foi construído — recruiters adoram |
| **3D em duas camadas** (hero model-viewer + Visualizador R3F + Hidden Guardians AR) | Prova range: leve → pesado → AR nativo |
| **MVP MCP / Figma** | Posiciona na fronteira AI + design tooling (2025–2026) |
| **About autêntico** | Humaniza; recruiters lembram de pessoas, não de grids |

### Técnico (já implementado)

- Julia Grid + tokens 8px, CSS puro na UI pública  
- Temas com validação WCAG (`deriveAccessibleTokens`)  
- Wisp CMS + Redis admin sem redeploy  
- JSON-LD, OG, ISR — SEO técnico de verdade  

---

## 4. Pontos a melhorar (estratégia)

| Gap | Impacto | Ação |
|---|---|---|
| Conteúdo placeholder no Redis | Site parece template | Colar copy da seção 6 no admin |
| Cases sem links (GitHub, demo, vídeo) | Recruiter bate dead-end | Todo post Tier 1–2 com ≥1 link |
| Hero sem CTA nem role line | Fold não converte | CTAs: Work, GitHub, LinkedIn |
| Hero 3D não integrado | Perde wow factor | Integrar `Developer/3d` (ver §7) |
| "Game" genérico no site antigo | Byte Verse invisível | Renomear + case dedicado |
| Projetos Tier 3 na home | Dilui qualidade | Máx. 6 cards; resto só por URL |
| About só texto plano | Perde stack visual | Listas + ferramentas (como about antigo) |
| Sem vídeo nos cases mobile | Motion precisa ser vista | 15–30s demo para Hairy e Byte Verse |
| Footer sem social | Contato escondido | Email, LinkedIn, GitHub, resume PDF |

---

## 5. Curadoria de projetos

### Tier 1 — Featured (home `#work`, ordem sugerida)

**Auway abre a grid** — é o case mais forte para recruiters (produto completo, Academy, hardware + DS).

| # | Slug Wisp | Nome | Por quê |
|---|---|---|---|
| 1 | `auway` | **Auway** | **Flagship Academy** — Strava de pets, gamificação, DS temático, collar RP2040, Watch |
| 2 | `julia-portfolio` | This Portfolio | Meta case — Julia Grid, Wisp, WCAG themes |
| 3 | `hairy` | Hairy | Academy — TCC → plantas, hardware, ML, Watch |
| 4 | `byte-verse` | Byte Verse | Academy lab — Space Invaders + acelerômetro |
| 5 | `mvp-mcp-figma` | MVP MCP → Figma | Agentic design tooling |
| 6 | `hidden-guardians` | Hidden Guardians | AR / USDZ — wow factor |

> **6 cards = limite da home.** Visualizador 3D e 404 ficam Tier 2 com URL ativa — linkáveis no About ou no case Auway (hardware/3D).

### Tier 2 — Supporting (Wisp ativo, fora da home)

| # | Slug | Nome | Por quê |
|---|---|---|---|
| 7 | `visualizador-3d` | 3D Product Viewer | R3F + Next.js |
| 8 | `404-error-page` | 404 Error Page | Open source + demo live |
| 9 | `pool-watch` | PoolWatch | DeFi monitor — full-stack breadth |

### Tier 3 — Archive (não colocar na home)

Ogro Bicicletas, Senses, Listo, Game (substituído por Byte Verse).

### Cluster narrativo — Apple Developer Academy

```text
Auway     → produto flagship (pets, gamificação, collar custom, pronto p/ mercado)
Hairy     → TCC em prática (plantas, sensores, Watch, ML)
Byte Verse → experimento (motion gaming, acelerômetro)
```

No About e no hero, mencionar **Auway** como prova de product thinking — não só craft visual.

**Repositório Técnico / TCC:** não é case separado — vira seção *"Research foundation"* dentro de Hairy e do case do portfólio.

### Tags Wisp (convenção)

- **Disciplina:** `Product` · `Mobile` · `Design Systems` · `Hardware` · `3D Web` · `Open Source`
- **Stack:** `Swift` · `WatchKit` · `Arduino` · `Next.js` · `Three.js` · `Core Motion` · `MCP`

Máx. 2 tags visíveis no card; resto no corpo do case.

---

## 6. Copy — SiteConfig (admin / Redis)

**Fonte de verdade:** [`src/lib/redis.ts`](../src/lib/redis.ts) → `DEFAULT_SITE_CONFIG`.  
Esta seção espelha o código. Se divergir, o `redis.ts` manda.

Colar via `/admin/theme` ou deixar os defaults (Redis vazio usa `DEFAULT_SITE_CONFIG`).

### Metadata

```
siteName: Julia Sakakibara
siteDescription: Design engineer portfolio — Auway (Strava for pets), Academy apps, semantic web, and hardware that fits on a collar. Cat-approved. Telepathy: beta.
```

### Hero

```
heroTitle: Julia Sakakibara

heroDescription: Designer who codes. I build things that could ship tomorrow — like a pet activity app with a smart collar smaller than anything I could buy. Also: design systems, 3D, and tilting your phone to shoot aliens.

[CTAs futuros — não são SiteConfig hoje]
→ View work (#work)
→ GitHub
→ LinkedIn
```

### About

Espelha [about-me](https://juliasakakibara.com.br/about-me) — tom pessoal, não corporativo.

```
aboutTitle: /about

aboutIntro: I've always bounced between fields — ballet, judo, philosophy, architecture. After high school I thought I had to pick one lane. Plot twist: I didn't.

aboutBody:
Design sits between understanding people and building things that actually work. That's what keeps me here — stealing ideas from different disciplines to solve weird, real problems.

Out of office (but still at home): devoted cat person, 3D printer enthusiast, night owl testing AI tools when the world gets quiet.

3 things about me:
▪ My brain has limited RAM — hence the lists. So many lists.
▪ I see patterns in places that probably don't need patterns. They make sense, I promise.
▪ Ambidextrous by accident (broke my right arm three times; adaptation was mandatory).

What I'm building with lately:
Next.js · TypeScript · Julia Grid · Three.js · Swift · Core Motion · Figma MCP · Wisp CMS

The thread: undergrad research (Agentic Accessibility) → Apple Developer Academy — Auway, Hairy, Byte Verse. This site is the web side of the same brain.

Thanks for stopping by. Email works. Telepathy is still in beta testing.
```

> `aboutBody` usa quebras de linha — renderiza com `white-space: pre-line` em `.about-body`.

### Work section

```
workSectionTitle: Selected work

workSectionIntro: Case studies and things I'd actually pitch — starting with Auway. Context included. Pretty screenshots also included.
```

### Footer

```
footerText: Built with too much coffee and just enough tokens. · Telepathy still in beta.
```

> Links sociais (GitHub, LinkedIn, email) ainda não são campos `SiteConfig` — ver roadmap §4 (footer enriquecido).

---

## 7. Hero 3D (`Developer/3d`)

### Papel na estratégia

O viewer 3D no hero é **proof of craft no primeiro segundo** — não decoração.

### Integração (quando implementar)

1. Copiar `model-3.glb` (~4.6 MB) → `public/models/hero.glb` (comprimir se possível)
2. Client component com `@google/model-viewer`
3. Layout: copy + CTAs à esquerda, viewer à direita (`julia-grid`)
4. `prefers-reduced-motion`: sem auto-rotate
5. Tokens do site, não CSS hardcoded do protótipo

### Copy do hint (playful)

> *Drag to spin · or just admire it — no tilt required here*

---

## 8. Template de case study (Wisp)

Todo post deve ter:

1. **Hook** — 1 frase com personalidade  
2. **Context** — problema + para quem  
3. **Role & stack** — bullets  
4. **What I built** — narrativa, não spec sheet  
5. **Key decisions** — 2–3 com trade-offs  
6. **Results** — métricas ou outcomes honestos  
7. **Links** — demo · GitHub · vídeo  

Posts completos em [`WISP-POST-DRAFTS.md`](./WISP-POST-DRAFTS.md).

---

## 9. Checklist antes de publicar

### Site

- [ ] SiteConfig com copy real (§6)
- [ ] Hero 3D integrado ou placeholder intencional
- [ ] CTAs no hero (Work, GitHub, LinkedIn)
- [ ] Footer com links sociais
- [ ] Resume PDF linkado

### Wisp — Tier 1 (6 posts — home)

- [ ] **auway** ← escrever primeiro
- [ ] julia-portfolio
- [ ] hairy
- [ ] byte-verse
- [ ] mvp-mcp-figma
- [ ] hidden-guardians

### Wisp — Tier 2 (3 posts)

- [ ] visualizador-3d
- [ ] 404-error-page
- [ ] pool-watch

### Por post

- [ ] `title`, `slug`, `description` (card)
- [ ] `image` (cover 16:9)
- [ ] `tags` (disciplina + stack)
- [ ] `publishedAt` = ano do projeto
- [ ] ≥1 link externo no corpo
- [ ] Vídeo demo (mobile cases)

---

## 10. Ordem de execução sugerida

| Fase | O quê | Tempo est. |
|---|---|---|
| **A** | SiteConfig + About (§6) | 1h |
| **B** | Post **Auway** no Wisp (prioridade #1) | 0.5 dia |
| **C** | Restante Tier 1 + Tier 2 | 1–2 dias |
| **D** | Hero 3D + CTAs | 0.5 dia |
| **E** | Vídeos demo + screenshots | contínuo |

---

## 11. Links de referência

| Recurso | URL |
|---|---|
| About antigo (tom de voz) | https://juliasakakibara.com.br/about-me |
| Portfolio antigo | https://juliasakakibara.com.br/ |
| 404 Error (demo + GitHub) | https://juliasakakibara.github.io/404-error-page/ |
| Hidden Guardians USDZ | https://juliasakakibara.github.io/usdz-file/HiddenGuardiansFixed.usdz |
| GitHub | https://github.com/juliasakakibara |
| Rascunhos dos posts | [`WISP-POST-DRAFTS.md`](./WISP-POST-DRAFTS.md) |
| Checklist master | [`CONTENT-PLAYBOOK.md`](./CONTENT-PLAYBOOK.md) |
| Handoff técnico | [`HANDOFF.md`](./HANDOFF.md) |

---

*Última atualização: maio 2026 — rascunho para reescrita de conteúdo.*
