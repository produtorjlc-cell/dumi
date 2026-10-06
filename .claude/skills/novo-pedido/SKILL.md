---
name: novo-pedido
description: Registra um pedido de conteúdo do Dumi Sabores Orientais (prato em destaque, promoção, aviso, data comemorativa, vídeo, ajuste) colado do WhatsApp pelo João, cria o arquivo em entrada/ com IDs DUMI-AAAAMMDD-NN e dispara a produção pelo orquestrador-dumi. Use com "/novo-pedido <mensagem>" ou "/novo-pedido ajuste <ID> <pedido de ajuste>".
---

<!--
  ADAPTADO de MERCADO CASAGRANDE/.claude/skills/novo-pedido/SKILL.md. Etapa 1 do docs/FLUXO-OPERACIONAL.md.
  Diferenças: prefixo de ID DUMI-, pasta de vídeos brutos, validações de restaurante (prato no cardápio,
  promoção com validade, iFood).
-->

# Novo pedido — Dumi

1. **Ler** a mensagem colada e os arquivos citados (`entrada/fotos/AAAA-MM-DD/`,
   `entrada/videos-brutos/AAAA-MM-DD/`). Não inventar nada fora dela ou de `briefing/CLIENT-BRIEF.md`.
2. **Criar** `entrada/AAAA-MM-DD_assunto.md` a partir de `entrada/_MODELO-PEDIDO.md`: quem pediu, mensagem
   original, tabela de peças com **ID `DUMI-AAAAMMDD-NN`** (data de publicação), tipo (feed/story/carrossel/
   reels/clipe), fatos novos, perguntas.
3. **Validar:** o prato está no cardápio? Preço confere com `fatos.json`? Promoção tem validade? Data de
   publicação antes do fim da validade? Dia da semana confere com a data? Vídeo bruto existe e está legível?
   Faltou → escreva as perguntas prontas para o João mandar ao Dumi e **pare as peças afetadas**.
4. **Registrar:** fato permanente novo (horário, prato novo, preço novo) → `briefing/CLIENT-BRIEF.md` **e**
   `briefing/fatos.json` (com fonte e data).
5. **Produzir:** criar a pasta e a ficha de cada peça (`marketing/producao/AAAA-MM/<ID>/ficha.md`, modelo
   `_MODELO-FICHA.md`) e acionar a skill `orquestrador-dumi`.
6. **Ajuste** (`/novo-pedido ajuste <ID> ...`): anotar no histórico do pedido e da ficha, refazer só o pedido,
   reentregar com o **mesmo nome de arquivo** (skill `entregar-aprovacao`, seção "Reentrega por ajuste").
   Máx. 2 rodadas antes de sugerir uma ligação.
7. **Responder ao João:** IDs criados · o que já foi para produção · perguntas para o Dumi (texto pronto).
