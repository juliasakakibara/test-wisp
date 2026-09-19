# Style guide review — board vivo

**Status:** OPEN — ordem **Frost-first** (páginas → atomic → tokens → plano).  
**Workflow:** [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md)  
**Agente:** [`.cursor/skills/style-guide-review`](../.cursor/skills/style-guide-review/SKILL.md)

Relacionado: [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md) · [`COMPONENT-INVENTORY.md`](./COMPONENT-INVENTORY.md) · [`TOKEN-AUDIT-LEDGER.md`](./TOKEN-AUDIT-LEDGER.md) · [`TOKEN-MAP.md`](./TOKEN-MAP.md) · [`REFERENCES.md`](./REFERENCES.md) · [`contracts/chip.contract.json`](./contracts/chip.contract.json) (draft).

---

## Como usar

| Tag | Significado |
|-----|-------------|
| **OPEN** | Precisa de escolha |
| **DECIDED** | Julia escolheu — data + resumo |
| **PARKED** | Consciente; fora do escopo agora |
| **SPIKE** | Experimento curto |
| **WIP** | Fase em curso |

Gates: fim de cada **W*** = aprovação antes da próxima.

---

## Progresso do workflow

| Fase | Status | Nota |
|------|--------|------|
| P0 Meta + bootstrap | **M1–M4 feitos** | ver DECIDED P0 + [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md) |
| **W1** Interface inventory | **não iniciado** | + checklist Frost |
| **G1** Perguntas pós-inventário | pendente | Q1–Q5 no workflow |
| **W2** Atomic + prio Curtis + a11y | parcial | inventário antigo |
| **W3** Token taxonomy + Mermaid | ledger pronto | `TOKEN-AUDIT-LEDGER.md` |
| **W4** Plano | não iniciado | |
| **Adopt** | por item pós-impl | A1–A4 no workflow |

---

## Diagnóstico (acordo atual)

1. Visual (plaquinha) ≠ elemento (button / link / select).
2. Nome Chip confundiu — V1 OPEN.
3. Público vs admin: **um sistema**; isolamento de CSS (sem vazamento) = semana que vem (M4). Hoje ainda `--admin-*` separado na prática.
4. Ordem Frost-first + enrichments **centralizados** no workflow.
5. Markup chrome já button≠link; cursor = V3.
6. Meta P0: publicar + mostrar processo/lógica (NDA); audiência craft, não recrutador.

---

## OPEN — vocabulário

| ID | Questão | Opções |
|----|---------|--------|
| V1 | Nome do visual fg/bg? | A) Chip · B) outro · C) utility · D) park |
| V2 | Controles vs visual no inventário? | A) duas tabelas · B) coluna HTML · C) W2 decide |
| V3 | Pointer em button? | A) só links · B) manter · C) park |

## OPEN — tokens (W3)

| ID | Questão | Opções |
|----|---------|--------|
| T1 | Primitive de cor vs hex no semantic? | A) manter · B) P layer · C) só doc gap |
| T2 | Core/Fun/Redis = ? | A) appearance · B) brand · C) theme packs · D) ambíguo |
| T3 | Component tokens quando? | A) pós-S · B) CSS reuse · C) contracts |

## OPEN — página / contratos

| ID | Questão | Opções |
|----|---------|--------|
| P1 | Anatomia chrome | A) SiteChrome · B) W3C-like · C) landmarks |
| P2 | Styleguide controles? | A) contraste · B) +P0 · C) foundations |
| C1 | `chip.contract.json`? | A) manter · B) arquivar · C) deletar |
| C2 | Mais contracts? | A) não · B) Link · C) após W3 |

## PARKED

| ID | Item | Por quê |
|----|------|---------|
| K1 | Once UI / Kelp dep | Só ref |
| K2 | Figma CC | Após W3 + pedido |
| K3 | Isolamento formal público/`--admin-*` (sem vazamento CSS) | Semana que vem — M4 |
| K4 | Package npm / export DS | Provável semana que vem — M3 |
| K5 | NN/G maturity enterprise | Solo: infra + governança do workflow |

## DECIDED

| ID | Data | Decisão |
|----|------|---------|
| W0 | 2026-09-17 | Workflow P0→W1–W4; agente não decide sozinho |
| W0b | 2026-09-17 | Frost-first: páginas → atomic → tokens → plano |
| W0c | 2026-09-17 | Enrichments centralizados no workflow: checklist Frost, G1 Q1–Q5, Curtis must/nice/later, coluna a11y, P0 M1–M4, Adopt A1–A4 |
| P0 | 2026-09-17 | M1 craft/portfolio (DE/eng); M2 publicar; M3 sem npm agora (foco processo/lógica + NDA); M4 um sistema + isolamento CSS depois |

## SPIKE

| ID | Escopo | Quando |
|----|--------|--------|
| S1 | CSS visual (nome TBD) + 1 consumer | “spike … agora” |

---

## Sessão atual

**Fase:** P0 ✓  
**Canônico:** [`UI-REFINEMENT-WORKFLOW.md`](./UI-REFINEMENT-WORKFLOW.md)  
**Próximo:** **W1** interface inventory  
**Pergunta:** `roda W1`?
