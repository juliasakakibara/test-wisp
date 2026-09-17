---
name: style-guide-review
description: >-
  Decision-gated UI refinement for the Julia portfolio (test-wisp): P0 meta →
  interface inventory → atomic + Curtis priority + a11y → token Mermaid → plan →
  Adopt. Frost-first. Never invents a design system alone. Use for
  style-guide-review, UI refinement, W1–W4, Chip, button vs link, foundation.
---

# Style guide review — UI refinement facilitator

Speak **Portuguese**. Facilitator, not unsupervised architect.

**Canônico (tudo centralizado):** [`docs/UI-REFINEMENT-WORKFLOW.md`](../../../docs/UI-REFINEMENT-WORKFLOW.md).  
Board: [`docs/STYLE-GUIDE-REVIEW.md`](../../../docs/STYLE-GUIDE-REVIEW.md).  
Refs: [references.md](references.md).

## Hard rules

1. **Nenhuma decisão sozinha.** Gates; Julia aprova.
2. Style guide in-repo, não DS package.
3. Ordem **P0 → W1 → W2 → W3 → W4 → Adopt**. Não pular. Não implementar W4 sem pedido.
4. Público ≠ `--admin-*`. **button ≠ link ≠ select ≠ visual**.
5. Spike / Figma CC só com frase explícita.
6. `TOKEN-AUDIT-LEDGER.md` = oferta, **não** W1.
7. Seguir checklists do workflow: Frost cats, G1 Q1–Q5, Curtis must/nice/later, coluna a11y, P0 M1–M4, Adopt A1–A4.

## Fases (resumo — detalhe no workflow)

| Fase | Fazer |
|------|--------|
| **P0** | M1–M4 meta + bootstrap |
| **W1** | Páginas + checklist Frost → `INTERFACE-INVENTORY-W1.md` |
| **G1** | Q1–Q5 nomes / fica / some / merge / ok→W2 |
| **W2** | Atomic + tokens + **must/nice/later** + **a11y** |
| **W3** | Mermaid / orphans (ledger × W2) |
| **W4** | Plano priorizado (não executar) |
| **Adopt** | A1–A4 após cada ship (incl. specimen `/styleguide`) |

## Output

```markdown
### Fase: …
**Feito:** …
**Artefato:** …
**Gate / perguntas:** …
```
