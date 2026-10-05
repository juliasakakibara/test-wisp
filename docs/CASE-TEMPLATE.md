# Template de case — começar daqui

Copia o bloco **Esqueleto** para um post novo no Wisp. O corpo vai em inglês (ver [CONTENT-STRATEGY.md](./CONTENT-STRATEGY.md) §2). As instruções daqui ficam em português.

Base: feedback de Florian Bölter sobre o portfólio da Christine Liang ([showcase](https://blog.opendoorscareers.com/p/junior-portfolio-showcase-christine-liang)) e a estrutura do case [Butternut AI](https://www.christineliangdesign.com/works/butternut-ai), adaptada ao que este site já publica: `title` no card e no H1, `description` como lead em `/projects/[slug]`, tags como rótulo de contribuição.

A espinha é só três coisas: **problema → o que você fez → o que aconteceu**. O resto é suporte.

---

## O que copiar do Butternut

| O que ela faz | Por que funciona | O que não copiar |
|---|---|---|
| H1 que nomeia o buraco: *Closing the gap between generate and publish* | A história cabe no título | O parágrafo “How might we…”. É rótulo de processo. Os insights já são o desafio |
| Lead com número real: 300k tentaram, menos de 15% publicaram; 2.7 → 4.3 | O pedido de superfície (“modernizar a UI”) aparece só para ser corrigido pela pergunta real | Inventar KPI. Sem número, descreva a mudança observável ou o que você aprendeu |
| Quatro falhas nomeadas, uma linha cada | Vira a lista do que você vai aprofundar | Board de pesquisa, quotes soltos, sticky notes |
| Cada falha que você mudou vira uma seção com heading que já diz a coisa: *The blank prompt box was setting users up to fail* | O heading faz 80–90% do trabalho. O corpo tem 1–2 frases | Seções chamadas Problem, Research, Process, Ideation, High-Fidelity, Outcome, Context, What I built, Key decisions, Results |
| O “antes” anotado mora **na mesma seção** que nomeia o problema (*One toolbar doing too many jobs*) | Florian cobra isso no case de e-commerce dela, que começa falando do site antigo sem mostrar o site antigo | Uma galeria de telas estáticas no final |
| A decisão cabe numa frase: o cliente queria editar no site, então ela separou ferramentas universais e contextuais — em vez de jogar tudo numa sidebar | Mostra julgamento, não inventário de entregáveis | Capítulo de colaboração. No máximo uma frase de como um feedback mudou a direção |
| Um visual por seção. Várias telas viram um clipe | O meio do case costuma estar inchado | O board do prompt dela é denso demais. Um clipe ou um frame anotado chega |
| *If I had a few more weeks* amarrado ao problema original (ainda é o publish que derruba) | Honestidade. Trabalho incompleto não vira case inteiro | Roadmap de features que você gostaria de ter desenhado |
| No final, o sistema que não existia | Só entra porque era um buraco real do produto | Seção de design system por padrão |

O case fraco, no mesmo portfólio, é o freelance de e-commerce (*Carly*). O Florian descreve o formato que falha mesmo quando o trabalho foi real: brief → análise → redesign → screenshots → reflexão curta. O começo não mostra o antes. A solução é uma fileira de telas paradas. Se esse for o projeto que a vaga abre primeiro, a apresentação tem que trabalhar mais: motion, antes/depois, detalhe de UI isolado, ou callouts do que mudou e por quê.

---

## Como isso cabe neste site

| Campo Wisp | Função | Exemplo no espírito do Butternut |
|---|---|---|
| `title` | Nome no card e H1 da página | `Auway` |
| `description` | Lead. Problema + resultado + o que você fez. A home ainda não imprime isso no card; a página do projeto imprime | `Pet trackers ship a huge collar and a spreadsheet app. I designed and built a smaller collar, the iOS app, and the Watch so a walk actually feels worth taking.` |
| `tags` | Máx. 2. O primeiro vira o rótulo do card (`Product`, `Swift`) | disciplina + stack |
| `image` | Cover 16:9 que já mostra o trabalho, não um mockup genérico | frame do produto em uso |
| `publishedAt` | Ano do projeto, não a data de hoje | `2024-01-01` |
| corpo | Marcos, não capítulos de processo | ver esqueleto |

Um zoom de implementação entra quando você construiu de verdade (estado, API, motion, fidelidade, o que quebrou no código). Uma seção. Linguagem simples primeiro, restrição concreta depois. Não é dump de stack — stack fica na linha de meta.

Projeto pessoal que você desenhou e publicou pode sentar na grid principal. Projeto inacabado não entra na home, a menos que o preview já funcione como mini-case: o que é, por que importa, e por que alguém perguntaria numa entrevista.

---

## O que a página já desenha sozinha

`/projects/[slug]` não lê seções nomeadas. Ela lê campos do post, nesta ordem:

1. `Case study` · ano de `publishedAt` · `tags`
2. H1 = `title`
3. Lead = `description`
4. Cover = `image`
5. Corpo = `content` (HTML do editor: parágrafo, H2, imagem, citação, link, vídeo)

Não existe campo para role, time, duração ou tools. Isso é o **primeiro parágrafo** do corpo, sem heading. H1 dentro do corpo compete com o título da página. Seção nova = **H2**. Citação = blockquote. Um visual = um bloco de imagem ou vídeo, com figcaption.

## Esqueleto no editor

Apague o bloco que não tiver marco. Três marcos bons vencem seis medianos.

### Campos do post

| Campo | O que escrever |
|---|---|
| `title` | Nome do projeto |
| `slug` | kebab-case |
| `description` | Problema + o que mudou + o que você fez. 1–2 frases. A mesma história do corpo |
| `tags` | No máximo 2: disciplina + stack. A primeira vira o rótulo do card |
| `image` | Cover 16:9 do produto em uso |
| `publishedAt` | Ano do projeto (`YYYY-01-01`), não a data de hoje |

### Corpo, bloco a bloco

| # | Bloco no Wisp | Pergunta | Conteúdo |
|---|---|---|---|
| 1 | Parágrafo | fora | `Role · Team · Não fiz · Duração · Tools · um link` |
| 2 | H2 | O que estava errado? | A falha, com número ou cena |
| 3 | Parágrafo | | 1–2 frases |
| 4 | Imagem + caption | | O antes, se for redesign. Senão, o estado quebrado |
| 5 | H2 | O que você decidiu? | A decisão, já dita no heading |
| 6 | Parágrafo | | 0–3 frases. Restrição + o que você escolheu |
| 7 | Imagem ou vídeo + caption | | Um visual. Quatro telas viram um clipe |
| 8 | H2 + parágrafo + visual | | Repita 5–7 mais uma ou duas vezes. Zoom de código entra aqui, uma vez, se você construiu |
| 9 | H2 | O que aconteceu? | O fato, a mudança visível, ou a fala |
| 10 | Parágrafo | | Sem KPI inventado |
| 11 | Citação e/ou imagem | | A prova |
| 12 | H2 + parágrafo | Rabo, opcional | `If I had a few more weeks` — um próximo passo amarrado ao problema do bloco 2 |

Caption explica o frame. Se o H2 e a imagem já contam, o parágrafo fica vazio.

---

## Antes de publicar

- [ ] Dá para ler só os headings e entender problema → decisão → resultado
- [ ] Nenhum H2 é rótulo de processo (Context, Research, Process, Outcome, What I built, Results)
- [ ] O antes está no mesmo bloco que nomeia o problema
- [ ] Um visual por seção. Telas demais viraram clipe
- [ ] Role, time e o que você não fez estão numa linha, não num capítulo
- [ ] Métrica é real. Se não houver, o resultado é observável ou aprendizado
- [ ] `description` conta a mesma história do corpo
- [ ] Tem um link externo (demo, GitHub ou vídeo)
- [ ] Se for o case que a vaga abre primeiro: motion, antes/depois ou detalhe de UI — não uma fileira de screenshots

Rascunhos atuais em [WISP-POST-DRAFTS.md](./WISP-POST-DRAFTS.md) ainda seguem o esqueleto antigo (Context → Stack → Decisions → Results). Na próxima escrita, comece por este arquivo.
