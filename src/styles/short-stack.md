# Short Stack

The site's small token set: about 40 names. It's modelled on [Raster](https://rsms.me/raster/), with every value coming from [Pancake](pancake/theme.css).

- **Source:** `src/styles/short-stack.css`, imported in `src/app/layout.tsx` right after Pancake's `theme.css`.
- **The rule:** the site's CSS reads only Short Stack names. Pancake stays the source of the values, but `--lb-*` appears only inside `short-stack.css`.

```
Pancake (--lb-*)  →  Short Stack inputs  →  Short Stack derived  →  site CSS
                       ↑
              base light / dark, or a shuffled theme (inline on <html>)
```

## 1 · Inputs: what a theme sets

| Token | Light | Dark | Shuffle |
|---|---|---|---|
| `--background` | `--lb-neutral-50` (#fff) | `--lb-neutral-950` | random |
| `--foreground` | `--lb-neutral-900` | `--lb-neutral-100` | random, AA against the background |
| `--accent` | `--lb-yellow-400` | same | = foreground |
| `--on-accent` | `--lb-neutral-900` | same | = background |
| `--accent-edge` | = foreground | same | = foreground |
| `--palette` | 100% | 100% | 0% |
| `--palette-{green,pink,orange,blue,lilac}` | 400 steps | same | (folded by `--palette`) |
| `--palette-*-wash` | 200 steps | 800 steps | (folded) |
| `--palette-on` | `--lb-neutral-900` | `--lb-neutral-950` | (folded) |
| `--muted-opacity` | 70% | 70% | computed: the faintest that passes AA |
| `--inverse-muted-opacity` | 80% | 80% | computed |
| `--font-body`, `--font-display` | Pancake families | same | a random pair |

Light and dark aren't separate tokens. They are the same roles with different values. A shuffled theme is one more set of values.

**Palette (base themes only).** After GSAP, each widget and home section owns one colour family from Pancake's ramps: green, pink (red), orange, blue (cyan) and lilac (violet). A family is a strong colour (light mode: the 400 step) and a wash (200; 800 in dark mode).
- Widget tabs use the strong colour.
- Light widget cards (notes, Theme) use the wash.
- Dark widgets take the strong colour with dark text.
- Home section cards use the wash on hover.

`--palette` sets how much shows: 100% in base themes, 0% when shuffled. Every family is mixed with the colour it stands in for, so shuffled themes fold back to their own two colours. The assignments by widget id are in `globals.css` ("Palette").

| Family | Widgets / sections |
|---|---|
| green | figure, Theme, Riddle, Projects |
| blue | Syrup, terminal |
| orange | clock, Path, Playground |
| pink | covers, Limited RAM List, Pomodoro |
| lilac | Cloche, Modes, Themes |

Muted text inside the strong colours uses `--inverse-muted-opacity` 80% in base themes (dark text needs more ink there). `--live` (the status dot) is green, folded the same way.

**The yellow pill:** a bright yellow fill can't reach 3:1 against a light page. The yellows that do are mustard/ochre (#b88100), so the pill keeps the bright yellow and gets a foreground edge (`--accent-edge`). Its dark label is 10.9:1.

**Tried and dropped (2026-10-06):** a Caldera-style version (warm neutrals, a violet dot grid). It felt too quiet, so the palette above replaced it.

## 2 · Derived: never set directly

| Token | Formula | Used for |
|---|---|---|
| `--muted-foreground` | foreground at `--muted-opacity`, **alpha** | secondary text |
| `--inverse-muted` | background at `--inverse-muted-opacity`, **alpha** | secondary text on foreground-coloured widgets |
| `--border` | foreground 10%, **alpha** | every line and hairline |
| `--surface` | foreground 11% mixed into the background, **opaque** | cards, footer, hover fills |
| `--surface-hover` | foreground 21%, **opaque** | hover on a card |
| `--dots` | foreground 16%, alpha | canvas dot grid |
| `--live` | palette green, folded by `--palette` | status dot |

**Why two kinds of derivation:**
- **Text and lines use alpha** (Raster's idea). They sit on many different surfaces and should adapt to whatever is under them.
- **Surfaces are opaque mixes.** Alpha surfaces stack (a card on a tinted area gets darker than intended) and let images show through.

**Inverse widgets** (clock, terminal, pomodoro) need no extra tokens: they use `--foreground` as the background and `--background` as the text.

**Older names still work:** `--muted` = `--surface`, `--primary` = `--foreground`.

## 3 · Scales

| Group | Tokens |
|---|---|
| Type | `--font-size-small` 11 · `--font-size` 12 · `--font-size-large` 14 · `--font-size-display-1/2/3` 24 / 36 / 48 |
| Line height | `--line-height-display` 1.1 · `--line-height-tight` 1.33 · `--line-height` 1.5 · `--line-height-loose` 1.65 (case studies) |
| Weight | `--font-weight` · `--font-weight-medium` · `--font-weight-bold` |
| Space | `--unit` 4px; write `calc(var(--unit) * n)`, half steps allowed |
| Shape | `--radius-surface` 24 · `--radius-media` 12 · `--radius-inner` 8 · `--radius-small` 4 · `--radius-pill` · `--border-width` 1 · `--focus-width` 2 |
| Motion | `--duration-fast` 200ms · `--duration-slow` 450ms · `--ease` |

**Known exceptions, left as literal values on purpose:**
- **Decorative sizes:** clock numerals (46 / 30), swatch letter (64), theme font sample (40), the hero title's clamp floor (32 / 36–44 on phones).
- **Animation loops:** pulse 1.6s, caret 1s, pomodoro flash 0.6s.
- **Optical offsets:** timeline 5 / −19px, nav toggle −11px.

## 4 · Bridge

`short-stack.css` points a few Pancake semantics back at Short Stack: `--lb-fg-default`, `--lb-fg-muted`, `--lb-fg-inverse`, `--lb-bg-default`, `--lb-bg-strong` and `--lb-border-muted`. That way the parts still styled by Pancake (older pages, text styles) follow a shuffled theme too.

There's no loop, because Short Stack's inputs come from Pancake **primitives** (`--lb-neutral-*`), never from these semantics.

## Shuffle and contrast

`ColorSystem.tsx` writes only the inputs (table 1). `random-palette.ts` keeps `ALPHA` in sync with the derived formulas and accepts a background/foreground pair only if:
- muted text passes AA on the hardest surface (`--surface-hover`), at the faintest opacity that works, and
- inverse muted text passes AA on the foreground.

**Why the muted opacity is computed per theme and not fixed:** a fixed 70% rejected every pair below about 11.7:1, and random themes collapsed toward black-on-white (median contrast went from 8.9 to 15.3, dark themes from 43% to 20%). With a per-theme opacity, the median is 10.4 and 41% of themes are dark.

**Checked:** axe-core (WCAG 2.2 AA), 0 violations on Home, About and a case page in light and dark, plus 20 shuffled themes.

## Rules of thumb

- **New colour?** Derive it from `--foreground` and `--background`. If a theme would need to set it, it's an input, so add it to table 1, `VARS` in `ColorSystem.tsx` and the generator's checks.
- **New size or gap?** Use the scale. If it doesn't fit, it's either an exception (add it to the list above) or the scale is missing a step (add the step here first).
- **Never** write `--lb-*` outside `short-stack.css`.

## Next

Promote this to Pancake as an official output (`pancake:sync --lite`): the same file generated for any project, with alpha-derived colours as a topping option. Pancake gaps it would close: a raised surface, a 450ms duration, and runtime themes from a few inputs.
