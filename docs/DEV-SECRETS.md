# Dev secrets & easter eggs

> Conteúdo do site: [`CONTENT-PLAYBOOK.md`](./CONTENT-PLAYBOOK.md)

For curious humans who read source or open DevTools. Not user-facing — zero impact on a11y.

## Console

On first load, the browser console prints a welcome + hint.

```js
__julia.help()   // command table
__julia.auway()  // Academy flagship lore
__julia.hairy()  // plant app lore
__julia.byteVerse() // + 4s Byte Verse mode on the logo
__julia.cat()
__julia.grid()
__julia.sam()    // who is Samantha?
```

## Keyboard

| Trigger | Effect |
|---|---|
| **Konami** ↑↑↓↓←→←→BA | Byte Verse mode — wiggling site title + console |
| Type `auway` | Console message |
| Type `hairy` | Console message |
| Type `julia` | Console message |
| Type `byteverse` | Console message |

Phrases only fire outside inputs / contenteditable.

## Source breadcrumbs

- `src/lib/dev-secrets.ts` — logic
- `src/components/DevSecrets.tsx` — mounted in root layout
- `src/app/layout.tsx` — HTML comment in `<head>`
- `src/app/globals.css` — `:root` comment + `.byte-verse-mode` animation
- `src/lib/redis.ts` — copy defaults + comentários no código

## Regra de ouro

Easter eggs são **brinde** para quem abre DevTools ou lê o código — nunca escondam menu, links ou conteúdo importante. Konami tremer o logo? Sim. GitHub só depois do Konami? Não.
