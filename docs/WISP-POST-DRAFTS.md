# Rascunhos de posts — Wisp CMS

> **Checklist:** [`CONTENT-PLAYBOOK.md`](./CONTENT-PLAYBOOK.md) · **Estratégia:** [`CONTENT-STRATEGY.md`](./CONTENT-STRATEGY.md)

Copy-paste reference para criar/editar posts no Wisp.  
**Tom:** inglês, informal, divertido — alinhado ao [about antigo](https://juliasakakibara.com.br/about-me).  
**Metadados:** preencher `image`, `publishedAt` (ano real) e links antes de publicar.

Convenção de tags: `[Disciplina]` + `[Stack]` — máx. 2 no card.

**Ordem na home (`#work`):** 1 Auway · 2 Portfolio · 3 Hairy · 4 Byte Verse · 5 MVP MCP · 6 Hidden Guardians  
*(3D Product Viewer, 404, PoolWatch = Tier 2, fora da grid)*

---

## Tier 1 — Featured (ordem na home: Auway primeiro)

---

### 1. Auway ⭐ Flagship

```yaml
title: Auway
slug: auway
description: Strava for pets — track walks, steps, and distance with gamification, Apple Watch, a themable design system, and a smart collar I built smaller than anything I could buy.
tags: [Product, Swift]
publishedAt: 2024-01-01  # ajustar — ano Apple Developer Academy
```

```markdown
## The short version

Auway is what happens when you look at pet activity trackers and think: *cute, but that collar is huge and the app feels like a spreadsheet.*

So I built **Strava for pets** — at Apple Developer Academy. Distance, steps, gamification, Apple Watch, a design system ready for Halloween skins, and a **custom smart collar** on Arduino Nano RP2040 that's smaller than any commercial one I could find. Clip it on the collar, get better data. Looks good too. (I'm allowed to say that. It was my best Academy project.)

Business rules, UI, and hardware — structured enough that this feels **ready to sell**, not "student demo."

## Context

Pet parents want to know their dog (or cat, if they're brave) is getting enough activity. Most apps exist. Most collars are chunky. Most gamification feels like a afterthought.

Auway treats pet activity like a product people would **pay for**: clear metrics, rewarding loops, Watch glances, and hardware that doesn't turn your pet into a walking IoT billboard.

## Role & stack

- **Role:** Product Designer + iOS Developer + Hardware (solo/team — adjust)
- **Context:** Apple Developer Academy — **flagship project**
- **App:** Swift, SwiftUI (confirm), WatchKit, HealthKit-style activity patterns (confirm)
- **Hardware:** Arduino Nano RP2040 — custom smart collar prototype
- **Design:** Full design system with **seasonal theming** (e.g. Halloween modifications without rebuilding the app)

## What I built

### The app (Strava energy, pet context)
- **Activity monitoring** — distance, steps, walks over time
- **Gamification** — progression and rewards that actually motivate (not just badges for opening the app)
- **Apple Watch companion** — quick stats and nudges on the wrist
- **Business logic** — rules structured for real product behavior, not prototype shortcuts

### The design system
- Cohesive visual language across iPhone + Watch
- **Theme-ready architecture** — swap seasonal flavors (Halloween, etc.) without breaking components
- Polished enough that stakeholders could imagine this on the App Store tomorrow

### The hardware (the part I'm quietly proud of)
- Custom tracker on **Arduino Nano RP2040**
- Couldn't find a commercial smart collar small enough — so I made one
- Mounts on the pet's existing collar → **more precise** readings, less visual bulk
- Software + firmware + industrial feel as one story

## Key decisions

**Build the collar, don't compromise on size**  
Off-the-shelf hardware was too big. A smaller device on the collar means better ergonomics for the pet and cleaner data for the app. Sometimes the "feature" is physical.

**Gamification as core loop, not sticker layer**  
Activity apps die when the chart is boring. Auway bakes motivation into the product structure — same reason Strava works for humans.

**Design system built for modification**  
Seasonal events (Halloween, etc.) prove the system is **tokenized and scalable**, not one-off screens. That's sellable thinking.

**Watch as companion, not afterthought**  
Quick glances during walks. The phone stays in the pocket; the pet stays in motion.

## What's next (honest section — recruiters like roadmap)

Plenty of room to grow — and I mean that as opportunity, not "it was unfinished":
- [ ] Deeper social / leaderboards among pet owners
- [ ] More breed/size calibration for step accuracy
- [ ] Production firmware hardening on RP2040
- [ ] App Store path + hardware manufacturing partner
- [ ] [Add your real roadmap items]

## Results

- Best project at Apple Developer Academy (self-assessed — and the one I'd pitch)
- End-to-end: research → design system → app → Watch → custom hardware
- Product structure ready for market conversation
- [ ] Demo video — **priority for portfolio**
- [ ] TestFlight / pitch deck link — fill in

## Links

- Previous portfolio: https://juliasakakibara.com.br/auway
- Demo video: [TODO — walkthrough app + collar on pet]
- Figma / prototype: [TODO]
- GitHub (hardware firmware / app): [TODO if public]
```

**Notas internas (PT):** Este é o case #1 na grid. Investir em vídeo curto: app + coleira no pet + Watch. Mencionar RP2040 no card se couber na descrição.

---

### 2. This Portfolio

```yaml
title: This Portfolio
slug: julia-portfolio
description: A portfolio that explains how it was built — semantic CSS, design tokens, headless CMS, and themes that pass WCAG without crying.
tags: [Design Systems, Next.js]
publishedAt: 2026-01-01  # ajustar
```

**Content (HTML ou Markdown no Wisp):**

```markdown
## The meta case study

Yes, the portfolio is a case study. Very on-brand.

I wanted a site that proves what it claims: semantic HTML, token-driven CSS, and zero Tailwind utilities on public pages. If you're a recruiter skimming at 11pm, the engineering is in the repo — but the *experience* should still feel intentional.

## Context

Personal portfolio for a design engineer. Needs to host case studies (Wisp CMS), let me edit copy without redeploying (Redis + admin), and let visitors swap themes without breaking contrast.

## Role & stack

- **Role:** Design Engineer (solo)
- **Stack:** Next.js 16, TypeScript, Wisp CMS, Upstash Redis, CSS custom properties, `@tailwindcss/typography` only for CMS prose
- **Design system:** Julia Grid — 8px atomic scale, responsive `--grid-template`, `color-mix()` for derived tokens

## What I built

- One-page home: hero → about → work
- Project pages at `/projects/[slug]` with JSON-LD (`CreativeWork`)
- Admin theme editor with live iframe preview
- `ThemeSwitcher` with WCAG-validated presets via `deriveAccessibleTokens()`
- Styleguide at `/styleguide` (ghost page, `noindex`)

## Key decisions

**HTML/CSS over utility classes on public UI**  
Tailwind stays for tooling and prose — not for layout chrome. Forces a real design system in `globals.css` §11.

**Hybrid data: Wisp + Redis**  
Volatile content (projects) from CMS. Structural copy and default theme from Redis. Best of both without over-engineering.

**Anchor navigation with scroll-padding**  
Sticky header + hash links = classic UX trap. Fixed with `scroll-padding-top` and `prefers-reduced-motion` respect. Small detail, big difference.

## Results

- Production-ready ISR (`revalidate = 60`)
- Accessible focus states, skip link, semantic landmarks
- The site documents itself — you're reading proof

## Links

- Live: [your-domain]
- GitHub: [repo URL]
- Styleguide: `/styleguide`
```

**Placeholder links:** substituir quando deploy estiver público.

---

### 3. Hairy

> Rascunho na **§6** abaixo (Academy cluster). Na home, Auway (#1) → Portfolio (#2) → **Hairy (#3)**.

---

### 4. Byte Verse

> Rascunho na **§7** abaixo. Na home, posição **#4**.

---

### 5. MVP MCP → Figma

```yaml
title: MVP MCP → Figma
slug: mvp-mcp-figma
description: An MCP agent that reads UX/UI guidelines and spits out a configured Figma file. Because copy-paste from Notion is not a design system strategy.
tags: [Engineering, MCP]
publishedAt: 2025-01-01  # ajustar
```

```markdown
## Context

Design ops bottleneck: guidelines live in docs, Figma starts empty, someone manually rebuilds components. I wanted an agent bridge — Model Context Protocol server that turns guidelines into a starting Figma file.

## Role & stack

- **Role:** Design Engineer / Tooling
- **Stack:** MCP (Model Context Protocol), Figma API ecosystem, agent workflow
- **Repo:** `juliasakakibara/mvp-mcp`

## What I built

MVP MCP server: feed it UX/UI guidelines, get a configured initial Figma file structure. Early proof that agents can do boring setup work so humans do interesting decisions.

## Key decisions

**MCP over bespoke scripts**  
Standard protocol = composable with other tools and future agents. Not another one-off automation graveyard.

**Guidelines in → file structure out**  
Scope kept intentionally narrow. Perfect is the enemy of "actually runs."

## Results

- Public repo with working MVP direction
- Connects to broader research on agentic accessibility and design tooling

## Links

- GitHub: https://github.com/juliasakakibara/mvp-mcp
```

---

### 6. Hidden Guardians

```yaml
title: Hidden Guardians
slug: hidden-guardians
description: AR experience you can open on your iPhone — because flat screenshots don't do guardians justice.
tags: [3D Web, iOS]
publishedAt: 2023-01-01  # ajustar — ano real
```

```markdown
## Context

Hidden Guardians — an AR-focused project where the object lives in your space, not on a screen.grab.

## Role & stack

- **Role:** Designer + Developer
- **Stack:** USDZ / AR Quick Look, 3D asset pipeline for iOS
- **Platform:** iPhone (Safari AR)

## What I built

3D guardians packaged for AR Quick Look. Tap the link on iPhone, place the model in your room, walk around it. No app install required — which is either lazy or brilliant, depending on your PM.

## Key decisions

**USDZ for zero-friction AR**  
App Store downloads kill curiosity. AR Quick Look meets people where they are: a link in the browser.

## Results

- "Try on your iPhone" demo live
- Portfolio piece that people actually *show* to friends (best kind)

## Links

- AR demo: https://juliasakakibara.github.io/usdz-file/HiddenGuardiansFixed.usdz
- Previous portfolio: https://juliasakakibara.com.br/hidden-guardians
```

---

## Tier 1 (continued) — Academy cluster (rascunhos completos §6–7)

---

### 6. Hairy

```yaml
title: Hairy
slug: hairy
description: Plant care app from Apple Developer Academy — hardware sensors, plant recognition, and Apple Watch. The practical sequel to my accessibility research rabbit hole.
tags: [Mobile, Swift]
publishedAt: 2024-01-01  # ajustar — ano Academy
```

```markdown
## Context

Hairy started where my undergrad research left off — and where **Auway** (my Academy flagship — Strava for pets) proved I could ship full product loops: app, Watch, hardware, design system.

At Apple Developer Academy I applied the same hardware-first mindset to plants: an app that helps you care for them using real sensors, on-device recognition, and an Apple Watch companion.

Less theory, more "will this plant survive if I forget it for three days."

## Role & stack

- **Role:** iOS Developer / Design Engineer
- **Context:** Apple Developer Academy — continuation of TCC research
- **Stack:** Swift, SwiftUI/UIKit (confirm), Core ML / Vision (plant recognition), WatchKit, hardware sensors (moisture/light/etc. — confirm specs)
- **Devices:** iPhone + Apple Watch + custom/prototype hardware

## What I built

- iOS app for plant care workflows
- **Plant recognition** — point camera, identify species, get care context
- **Hardware integration** — sensors feeding live data into the app
- **Apple Watch companion** — glanceable alerts and quick actions when your phone is across the room (and the plant is judging you)

## Research foundation

The TCC (*Repositório Técnico*) focused on semantic HTML, JSON-LD, design tokens, and agent-ready documentation. Hairy applies the same obsession with **structured, actionable information** — just with soil instead of `<section>` tags.

**Sibling project:** [Auway](./WISP-POST-DRAFTS.md#1-auway--flagship) was the Academy flagship (pets); Hairy explores plants + sensors on the same hardware-first mindset.

## Key decisions

**Hardware + software together**  
A plant app that ignores real moisture levels is just a calendar with leaves. Sensors ground the UX in reality.

**Watch as companion, not clone**  
Notifications and quick status — not a tiny copy of the entire app. Wrist real estate is precious.

**On-device recognition where possible**  
Privacy and offline use matter when you're in a garden, a greenhouse, or just a very dim apartment.

## Results

- [ ] Academy showcase / demo — fill in
- [ ] TestFlight or App Store link — fill in
- [ ] X species recognized — fill in
- [ ] Working hardware prototype — fill in

## Links

- Previous portfolio: https://juliasakakibara.com.br/hairy
- Demo video: [TODO]
- GitHub: [TODO if public]
- TCC reference: Repositório Técnico (internal docs)
```

**TODOs:** Preencher com dados reais antes de publicar — recruiters notice blank links.

---

### 7. Byte Verse

```yaml
title: Byte Verse
slug: byte-verse
description: Space Invaders, but you move the ship by tilting your iPhone. Accelerometer as game controller — weird, physical, and harder than it looks.
tags: [Mobile, Core Motion]
publishedAt: 2022-01-01  # ajustar — ano real
```

```markdown
## Context

Byte Verse is what happens when you ask: *what if Space Invaders, but the phone IS the controller?*

No on-screen D-pad. You tilt the iPhone — accelerometer data drives the character. Your body is part of the game loop. Very Wii Sports energy, zero Nintendo budget.

(Previously listed as "Game" on my old portfolio, which did this project a disservice. It had a name. It had vibes.)

## Role & stack

- **Role:** iOS Developer / Game Designer
- **Stack:** Swift, Core Motion (accelerometer), [SpriteKit / SceneKit / UIKit — confirm]
- **Input:** Device tilt → lateral movement
- **Genre:** Arcade shooter (Space Invaders homage)

## How it works

1. Hold the phone and tilt left/right
2. Core Motion streams acceleration on the X axis
3. Values normalized with dead zone + sensitivity curve (so tiny hand tremors don't count as input)
4. Enemies descend. You shoot. You probably tilt too hard at first.

## Key decisions

**Accelerometer over virtual buttons**  
Physical movement changes game feel entirely. More immersive, less precise — which is the point.

**Dead zone calibration**  
Holding a phone "still" is never perfectly still. Neutral threshold keeps gameplay fair.

**Same brain as Hairy and Auway**  
All three Academy projects treat **device sensors as first-class input**. Auway tracks pets on a custom collar; Hairy listens to plant hardware; Byte Verse tilts the phone to shoot aliens. Same stack, different chaos.

## Results

- Playable on-device demo
- Great party trick ("wait, you control it by *moving*?")
- [ ] Demo video — highly recommended for this case

## Links

- Previous portfolio: https://juliasakakibara.com.br/game
- Demo video: [TODO — 15–30s of someone tilting + playing]
- GitHub: [TODO if public]
```

---

---

## Tier 2 — Supporting (fora da home)

---

### 8. 3D Product Viewer

```yaml
title: 3D Product Viewer
slug: visualizador-3d
description: Spin products in the browser — React Three Fiber, Next.js, and GLB models that actually load before you get bored.
tags: [3D Web, Three.js]
publishedAt: 2025-01-01  # ajustar
```

```markdown
## Context

Industrial product visualization in the browser. The goal: let people inspect objects in 3D without installing anything — phones, carabiners, lighters, whatever fits in a `.glb`.

## Role & stack

- **Role:** Frontend Developer
- **Stack:** Next.js 15, React Three Fiber, `@react-three/drei`, Three.js, TypeScript, Tailwind (internal UI)
- **Assets:** Multiple GLB models (phone, napkin holder, carabiner, lunar lighter)

## What I built

Interactive 3D viewer with orbit controls, product switching, and a layout built for e-commerce-style presentation. Local dev server required (browsers hate `file://` for GLB — learned that the fun way).

## Key decisions

**R3F over raw Three.js**  
Declarative React beats imperative scene graphs when you want to ship and iterate.

**Next.js App Router**  
SSR for shell, client for canvas. Keeps first paint sane while the 3D loads.

## Results

- Multiple product models viewable in one app
- Foundation for hero 3D experiments (lighter `model-viewer` variant lives in `/Developer/3d`)

## Links

- Repo: local `visualizador-3d-produto`
- Demo: [localhost / deploy URL]
```

---

### 9. 404 Error Page

```yaml
title: 404 Error Page
slug: 404-error-page
description: A JavaScript lab for the page nobody wants to land on — interactive, open source, and weirdly fun.
tags: [Open Source, JavaScript]
publishedAt: 2021-01-01  # ajustar
```

```markdown
## Context

404 pages are usually sad. This one is a small JavaScript lab — proof that even error states deserve craft.

## Role & stack

- **Role:** Frontend Developer
- **Stack:** HTML, CSS, JavaScript
- **Type:** Open source experiment

## What I built

Custom 404 experience with interactive elements. Published demo + source for anyone who wants to steal ideas (please do).

## Key decisions

**Treat errors as product surface**  
First impression when something breaks. Might as well not be a white page with "Not found."

## Results

- Live demo on GitHub Pages
- One of the few old portfolio pieces with documented links

## Links

- Demo: https://juliasakakibara.github.io/404-error-page/
- GitHub: https://github.com/juliasakakibara/404-error-page
- Previous portfolio: https://juliasakakibara.com.br/404-error-page
```

---

### 10. PoolWatch

```yaml
title: PoolWatch
slug: pool-watch
description: DeFi pool monitor that watches prices so you don't have to refresh charts at 2am. Node backend, email alerts, glassmorphism UI — the full package.
tags: [Engineering, Node.js]
publishedAt: 2024-01-01  # ajustar
```

```markdown
## Context

Liquidity pools move fast. PoolWatch monitors DeFi pools across networks (Ethereum, Solana, Base, Polygon, BSC) and emails you when targets hit — so you can pretend to have a life outside charts.

## Role & stack

- **Role:** Full-stack Developer
- **Frontend:** Vanilla JS, HTML, CSS (glassmorphism UI)
- **Backend:** Node.js, Express
- **APIs:** GeckoTerminal v2, Resend (email alerts)
- **Repo:** local `pool-watch`

## What I built

- Real-time trending pools dashboard
- Backend proxy (CORS + rate limiting — browsers and APIs, eternal enemies)
- 24/7 server-side monitoring even when the tab is closed
- Email alerts via Resend

## Key decisions

**Proxy backend**  
Public APIs + browser = pain. Node proxy keeps keys safe and requests sane.

**Vanilla frontend**  
Not everything needs React. Fast to ship, easy to debug at 2am.

## Results

- Functional monitor with multi-chain support
- [ ] Deploy URL — fill in

## Links

- Repo: local `Developer/pool-watch`
- Demo: [TODO]
```

---

### Auway

Rascunho completo em **§1 — Tier 1 Featured** (flagship). Não duplicar.

---

## Tier 3 — Archive (rascunho mínimo)

Publicar só se quiser URL viva; **não** colocar na home.

| Slug | Title | Nota |
|---|---|---|
| `ogro-bicicletas` | Ogro Bicicletas | Branding — expandir se houver narrativa cliente |
| `senses` | Senses | Visual case — precisa contexto |
| `listo` | Listo | Alternativa ao Auway; pick one for Tier 2 |

---

## Campos Wisp — checklist por post

| Campo | Dica |
|---|---|
| `title` | Nome público (Byte Verse, not "Game") |
| `slug` | kebab-case, estável para URLs |
| `description` | 1–2 frases — aparece no card |
| `image` | 16:9 cover; usar arte do portfolio antigo enquanto não houver nova |
| `tags` | 2–4 tags; card mostra 2 |
| `publishedAt` | **Ano do projeto**, não data de publicação do post |
| `content` | Markdown/HTML com seções do template |

---

## Imagens — fontes do portfolio antigo

CDN MyPortfolio (extrair do site antigo ao migrar):

- Auway, Hidden Guardians, Senses, Listo, 404, Game, Ogro, Hairy — thumbnails em `juliasakakibara.com.br`

Para **Auway**, Hairy e Byte Verse: priorizar **screenshots + vídeo demo** novos (Auway: app + collar no pet + Watch).

---

## Próximo passo

1. Revisar drafts — corrigir TODOs e anos  
2. Criar posts no Wisp — **Auway primeiro**, depois restante Tier 1  
3. Colar SiteConfig de [`CONTENT-STRATEGY.md`](./CONTENT-STRATEGY.md) §6 no admin  
4. Publicar home quando **Auway** + ≥4 Tier 1 estiverem prontos  

---

*Rascunho — maio 2026. Tom calibrado contra [about-me](https://juliasakakibara.com.br/about-me).*
