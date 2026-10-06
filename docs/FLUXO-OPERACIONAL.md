# Fluxo operacional — do pedido do Dumi ao post publicado

_Versão 1 (03/10/2026). Mesma arquitetura do Mercado Casa Grande (`MERCADO CASAGRANDE/docs/FLUXO-OPERACIONAL.md`),
com três diferenças: agentes próprios de **vídeo** e **carrossel**, entrega **automática** na fila do painel
(skill `entregar-aprovacao`) e um agente **publicador** que só confere a fila. Objetivo: toda informação do
Dumi entra por um lugar só, vira um pedido com ID, passa pelos agentes na ordem certa, é aprovada pelo
cliente no Painel de Conteúdo e só então é publicada — sem dado inventado._

<!-- PAPÉIS -->
## Quem faz o quê
| Papel | Quem | Responsabilidade |
| --- | --- | --- |
| Cliente | Dumi Sabores Orientais — [responsável a confirmar] | Manda pratos, promoções, fotos e vídeos; aprova ou pede ajuste pelo link do painel |
| Operador | **João** | Cola o pedido, revisa no painel, troca a legenda da IA, manda o link, conecta contas |
| Orquestrador | Claude (`/orquestrador-dumi`, `/novo-pedido`) | Estrutura o pedido, cria fichas, delega, passa pelo portão, entrega na fila |
| Especialistas | `social-media`, `diretor-arte`, `editor-carrossel`, `editor-video`, `verificador-realidade`, `publicador` | Texto, arte, carrossel, vídeo, portão de qualidade, conferência da publicação |
| Painel | `C:\Users\joaol\Projetos\painel-conteudo` (porta 3010) | Cria o post a partir da fila, coleta a aprovação, move para APROVADOS, publica |

<!-- VISÃO GERAL -->
## Visão geral
```
 DUMI ──WhatsApp──► JOÃO ──/novo-pedido──► entrada/AAAA-MM-DD_assunto.md  (IDs DUMI-AAAAMMDD-NN)
                                                 │
                                    ficha por peça em marketing/producao/AAAA-MM/<ID>/
                                                 │
                         social-media → roteiro/texto na ficha + legenda.txt
                                                 │
            ┌──────────────────────┬─────────────┴────────────┬──────────────────────┐
     editor-video            diretor-arte               editor-carrossel
   (Reels / clipe curto)   (feed / story)            (slides do cardápio)
            └──────────────────────┴─────────────┬────────────┴──────────────────────┘
                                                 │
                        conferir.mjs → verificador-realidade (APROVADO / REPROVADO, máx. 3)
                                                 │ APROVADO
                         skill entregar-aprovacao → C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\
                                                 │
                       monitor do painel cria o post → João troca a legenda → link /aprovar/c/<token>
                                                 │
                     Dumi APROVA ──► arquivo vai sozinho para C:\CAPCUT\APROVADOS\DUMI\<ID>-<slug>\
                                                 │
                     publicador confere → painel publica no Instagram (TikTok/YouTube se conectados)
```

<!-- AS 8 ETAPAS -->
## As 8 etapas

### 1. `/novo-pedido` registra o pedido
- João abre o Claude Code nesta pasta e roda `/novo-pedido <mensagem colada>`.
  Fotos → `entrada/fotos/AAAA-MM-DD/`; vídeos do celular → `entrada/videos-brutos/AAAA-MM-DD/`.
- Sai `entrada/AAAA-MM-DD_assunto.md` (modelo `entrada/_MODELO-PEDIDO.md`) com um **ID por peça**
  (`DUMI-AAAAMMDD-NN`, data de publicação) e a pasta + ficha de cada peça (`marketing/producao/_MODELO-FICHA.md`).
- Validação: prato está no cardápio? preço confere? promoção tem validade? Faltou → perguntas prontas para o Dumi.

### 2. `social-media` escreve roteiro + legenda
- Escreve na **seção 2 da ficha**: texto da arte, texto slide a slide (carrossel) ou roteiro com tempos e
  2–3 headlines (vídeo).
- Grava a legenda final em `marketing/producao/AAAA-MM/<ID>/legenda.txt` (texto puro, ≤ 5 hashtags).

### 3. Produção conforme a peça
| Peça | Agente | Ferramenta | Saída |
| --- | --- | --- | --- |
| Reels falado (take de celular) | `editor-video` — Receita 1 | skill `reels-express` (`build.py reels.json`) | `video/final.mp4` |
| Clipe curto (comida/ambiente, sem fala, 7–8 s) | `editor-video` — Receita 2 | ffmpeg / CapCut + `img/logo.png` + trilha licenciada | `video/final.mp4` |
| Post de feed / story | `diretor-arte` | `templates/posts-dumi.html` → `render.mjs` | `feed.png`, `story.png` |
| Carrossel | `editor-carrossel` | skill `dumi-carrossel` + `templates/carrossel-dumi.html` | `carrossel/slide-NN.png` |

### 4. `verificador-realidade` confere qualidade
- Antes: `node ferramentas/render-artes/conferir.mjs <arte.html|carrossel.html>` (erro mecânico volta direto).
- Depois: fatos × `briefing/fatos.json`, marca, foto, legibilidade no celular, vídeo (duração, formato, áudio),
  legenda. Veredito na **seção 4 da ficha**. REPROVADO → volta ao mesmo agente (máx. 3; na 3ª vai ao João).

### 5. `entregar-aprovacao` copia para o CapCut
- Só com APROVADO na ficha. Copia os finais para `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\`
  (ex.: `DUMI-20261010-01-yakisoba`), **uma subpasta por post**, com `legenda.txt` preservado.
- Feed + story da mesma peça = duas subpastas (`...-feed`, `...-story`), senão o painel monta um carrossel.

### 6. Monitor cria o post no painel
- O monitor do painel (`npm run monitor`; agendado 8h, 12h, 16h, 20h) lê a pasta `DUMI`, casa com o cliente
  "Restaurante DUMI Sabores Orientais" e cria o post como **pronto para aprovação** (subpasta com 2+ imagens =
  carrossel; vídeo = reels). Arquivo alterado há < 60 s fica para a próxima rodada.
- A IA do monitor escreve uma legenda própria → **o João troca pelo `legenda.txt`** no painel
  (`http://localhost:3010/dashboard`) e dá uma olhada final (5 min).
- O João manda ao Dumi o link fixo do cliente: `/aprovar/c/<token>`.

### 7. Cliente aprova (arquivo vai para APROVADOS)
- **Aprovou** → o painel move a mídia sozinho para `C:\CAPCUT\APROVADOS\DUMI\<ID>-<slug>\`
  (`moverParaAprovados`, `lib/media.ts`). Registrar na ficha (seção 5).
- **Pediu ajuste** → `/novo-pedido ajuste <ID> ...` → refazer só o pedido → reentregar com o **mesmo nome de
  arquivo** (o monitor devolve o post para aprovação sozinho). Máx. 2 rodadas; na 3ª, ligação rápida.

### 8. Publicador posta no Instagram (e TikTok/YouTube se conectadas)
- O post entra na fila do painel quando estiver **aprovado + com data + conta do Dumi conectada**.
  Hora padrão 18:00 (Brasília). Imagem/carrossel/story → só Instagram; vídeo → todas as redes conectadas.
- O agente `publicador` confere a ficha e a fila e diz ao João o que falta; **não posta sozinho** e só roda
  `npm run publicar -- --listar` / `--simular` com pedido do João.
- Dumi hoje = **só Instagram** (`@dumisaboresorientais`).

<!-- REGRAS -->
## Regras que valem em todas as etapas
- **Não inventar** prato, preço, promoção, validade, horário ou prazo — fonte única: `briefing/`.
- Publicar **só** depois da aprovação do Dumi registrada no painel **e** na ficha.
- Ninguém escreve senha/token em arquivo; Claude não roda `monitor`/`publicar` nem sobe servidor sem pedido do João.
- Nada de infraestrutura nova: o painel-conteudo é o único lugar de aprovação e publicação.
- Pastas internas (`.claude/`, `briefing/`, `docs/`, `entrada/`, `ferramentas/`, `marketing/`) estão no
  `.vercelignore` — não vão para o cardápio online publicado.

<!-- PENDÊNCIAS -->
## Pendências para fechar o fluxo
- [ ] Conectar a conta do Instagram do Dumi no painel (`npm run conectar-conta`, o João digita o token).
- [ ] Definir quem aprova do lado do Dumi e mandar o link `/aprovar/c/<token>` uma vez para teste.
- [ ] `npm install` + `npx playwright install chromium` em `ferramentas/render-artes` (uma vez).
- [ ] Registrar ao menos uma trilha licenciada em `marketing/trilhas/LICENCAS.md` (ou usar áudio do Instagram).
- [ ] Respostas do Dumi: horário, formato do WhatsApp, validade da promoção, sushi sim/não, preços do iFood.
- [ ] Testar o ciclo inteiro com UMA peça (ex.: carrossel de exemplo com `modelo: false`).
