---
name: orquestrador-dumi
description: Orquestrador de conteúdo do Dumi Sabores Orientais. Use para qualquer pedido de conteúdo que envolva mais de um passo (post, story, carrossel, Reels, campanha). Roteia novo-pedido → social-media → editor-video / diretor-arte / editor-carrossel → verificador-realidade → entregar-aprovacao → painel-conteudo (aprovação e publicação).
---

<!--
  ADAPTADO de MERCADO CASAGRANDE/.claude/skills/orquestrador/SKILL.md (v2). Mesma lógica: só a sessão
  principal delega; todos trabalham em cima dos mesmos fatos, do mesmo template e da mesma ficha.
  Novidades do Dumi: agentes próprios de vídeo e carrossel, entrega automática na fila do painel
  (skill entregar-aprovacao) e agente publicador.
-->

# Orquestrador — Dumi Sabores Orientais

Você é a sessão principal: **só você delega**; especialistas não chamam uns aos outros.
Fluxo completo e papéis: `docs/FLUXO-OPERACIONAL.md`.

<!-- FONTES ÚNICAS: ninguém trabalha "de cabeça". -->
## Fontes únicas
| O quê | Onde | Quem altera |
| --- | --- | --- |
| Fatos do Dumi (cardápio, preço, endereço, contato) | `briefing/CLIENT-BRIEF.md` + `briefing/fatos.json` | só você, com fonte |
| Marca | `img/PALETA-DUMI.md` + templates em `ferramentas/render-artes/templates/` | `diretor-arte` / `editor-carrossel` |
| Pedido | `entrada/AAAA-MM-DD_assunto.md` (modelo `_MODELO-PEDIDO.md`) | skill `novo-pedido` |
| Uma peça | `marketing/producao/AAAA-MM/<ID>/ficha.md` (modelo `_MODELO-FICHA.md`) | cada agente, só a sua seção |
| Andamento | `STATUS.md` | você, ao fim de toda tarefa |

<!-- TRIAGEM -->
## 1. Triagem
1. Leia `STATUS.md` e o pedido. Pedido novo sem arquivo em `entrada/` → rode a skill `novo-pedido` primeiro.
2. Escolha a faixa: 🟢 **rápida** (template pronto + dados completos: prato do dia, story de cardápio) —
   `social-media` e produção podem ir em sequência curta, portão leve · 🔵 **completa** (campanha, data
   comemorativa, peça nova, vídeo com fala).
3. Crie a ficha de cada peça (seção 1) com os fatos **copiados com fonte**. Faltou → `[colchete]` + pergunta ao Dumi.
   ID: `DUMI-AAAAMMDD-NN` (data de publicação).

<!-- ROTEAMENTO: quem faz cada tipo de peça. -->
## 2. Roteamento
| Pedido | Agentes (em ordem) | Portão |
| --- | --- | --- |
| Post de feed / story | `social-media` → `diretor-arte` (`posts-dumi.html`) | `conferir.mjs` → `verificador-realidade` |
| **Carrossel** | `social-media` (texto slide a slide) → `editor-carrossel` (skill `dumi-carrossel`) | `conferir.mjs` → `verificador-realidade` |
| **Reels falado** (take de celular) | `social-media` (roteiro + 2–3 headlines) → `editor-video` Receita 1 (`reels-express`) | `verificador-realidade` |
| **Clipe curto** (comida/ambiente, sem fala) | `social-media` (roteiro 7–8 s) → `editor-video` Receita 2 | `verificador-realidade` |
| Texto puro (legenda, WhatsApp) | `social-media` | `verificador-realidade` |
| Entrega na fila do painel | skill `entregar-aprovacao` (você roda, logo após o APROVADO) | — |
| Publicação | `publicador` (confere fila; quem publica é o painel-conteudo) | aprovação do Dumi registrada |
Tarefa de 1 passo (trocar uma palavra) → você mesmo faz.

<!-- PACOTE DE DELEGAÇÃO -->
## 3. Como delegar
Todo pedido a um agente leva: caminho da ficha · objetivo em 1 frase · arquivos exatos a ler (máx. 4) ·
onde salvar · o que NÃO fazer · formato da resposta (≤ 8 linhas). Peças independentes vão em paralelo.

<!-- PORTÃO + ENTREGA: aqui está a diferença para o MCG — a entrega na fila é automática. -->
## 4. Portão e entrega
1. `conferir.mjs` (arte/carrossel) — erro mecânico volta direto ao produtor, sem gastar verificador.
2. `verificador-realidade` com ficha + arquivos finais. REPROVADO → volta ao mesmo agente. **Máx. 3 tentativas**;
   na 3ª, pare e leve ao João.
3. **APROVADO → rode a skill `entregar-aprovacao`** (copia para `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\`,
   uma subpasta por post, `legenda.txt` preservado). Versão reprovada nunca vai para a fila.
4. A partir daqui é o painel: monitor cria o post → João confere e troca a legenda da IA pelo `legenda.txt` →
   link `/aprovar/c/<token>` para o Dumi → aprovado vai sozinho para `C:\CAPCUT\APROVADOS\DUMI\` →
   `publicador` confere a fila. **Você não roda `npm run monitor` nem `npm run publicar`.**

<!-- REGISTRO -->
## 5. Registrar (sempre, no fim)
`STATUS.md` (o que ficou pronto, o que aguarda o Dumi/João, próximo passo) · fatos novos no briefing **e** no
`fatos.json` · histórico no pedido e na ficha.

## Relatório ao João (curto)
```
Na fila do painel: C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<pasta> (N arquivos)
Portão: conferir OK · verificador APROVADO (tentativas)
Falta do Dumi: <1–3 itens>
Próximo passo: <1 linha>
```
