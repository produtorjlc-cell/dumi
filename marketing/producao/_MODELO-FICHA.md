# Ficha da peça — DUMI-AAAAMMDD-NN · [assunto]

> Um arquivo por peça, em `marketing/producao/AAAA-MM/<ID>/ficha.md`. É o **único lugar** onde a peça é
> combinada: cada agente lê a ficha, escreve **só a sua seção** e devolve. Ninguém trabalha "de cabeça".
> Modelo herdado do Mercado Casa Grande, adaptado ao Dumi (vídeo, carrossel e fila do painel).

<!-- SEÇÃO 1 — preenchida pelo orquestrador (skill orquestrador-dumi / novo-pedido) -->
## 1. Pedido (orquestrador)
- **Origem:** `entrada/AAAA-MM-DD_assunto.md` · pedido de: [nome no Dumi / João]
- **Tipo:** feed 1080×1350 / story 1080×1920 / carrossel (N slides) / Reels falado (Receita 1) / clipe curto (Receita 2)
- **Publicar em:** AAAA-MM-DD · canal: Instagram (@dumisaboresorientais)
- **Objetivo (1 frase):** ...
- **Fatos confirmados usados** (copiar do briefing/pedido, com fonte): prato · preço · promoção + validade
- **Material:** fotos (`img/...`, `entrada/fotos/AAAA-MM-DD/...`) · brutos (`entrada/videos-brutos/AAAA-MM-DD/...`)
- **Faltando** (vira `[colchete]` + pergunta ao Dumi): ...
- **Faixa:** 🟢 rápida · 🔵 completa

<!-- SEÇÃO 2 — social-media. A legenda final também vai em legenda.txt (mesma pasta). -->
## 2. Texto (`social-media`)
- **Post/story:** kicker · título · apoio · CTA
- **Carrossel (slide a slide):**
  1. `capa` — kicker · título · apoio · foto
  2. `prato` — kicker (país) · título (prato) · apoio (descrição real) · preço · foto
  N. `cta` — kicker · título · apoio · botão · rodapé
- **Vídeo:** receita · roteiro com tempos (7–8 s) · headlines (2–3 opções) · textos de tela
- **Legenda** (= `legenda.txt`): ...

<!-- SEÇÃO 3 — quem produziu: diretor-arte (feed/story), editor-carrossel ou editor-video -->
## 3. Produção (`diretor-arte` / `editor-carrossel` / `editor-video`)
- **Template / receita:** posts-dumi · carrossel-dumi · reels-express · clipe curto
- **Fotos / brutos usados:** arquivo + origem
- **Arquivos finais:** `feed.png` · `story.png` · `carrossel/slide-01..NN.png` · `video/final.mp4`
- **conferir.mjs / medições do vídeo:** OK / erros corrigidos

<!-- SEÇÃO 4 — verificador-realidade. "APROVADO" aqui libera a skill entregar-aprovacao. -->
## 4. Portão (`verificador-realidade`)
- **Veredito:** APROVADO / REPROVADO (tentativa N de 3) · problemas: ...

<!-- SEÇÃO 5 — entrega, aprovação do cliente e publicação (entregar-aprovacao, João, publicador) -->
## 5. Entrega, aprovação e publicação
- **Fila do painel:** `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\` · copiado em AAAA-MM-DD HH:MM
- **Legenda no painel trocada pelo legenda.txt:** sim/não
- **Aprovação do Dumi:** quem · quando (arquivo em `C:\CAPCUT\APROVADOS\DUMI\<ID>-<slug>\`)
- **Publicação:** data/hora agendada · link do post
- **Histórico:** AAAA-MM-DD enviado · ajuste "..." · aprovado · publicado
