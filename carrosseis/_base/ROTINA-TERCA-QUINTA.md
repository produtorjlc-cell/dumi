---
name: dumi-carrosseis-terca-quinta
description: Gera 2 carrosséis educativos do Dumi Sabores Orientais por execução (terça e quinta, 10h) e entrega em C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI
---

<!--
  Prompt da rotina de terça e quinta às 10:00 (America/Sao_Paulo) — 2 carrosséis por
  execução, 4 por semana. Usado:
  (a) como tarefa agendada local do Claude (copiar para
      ~/.claude/scheduled-tasks/dumi-carrosseis-terca-quinta/SKILL.md ou criar pela
      ferramenta de tarefas agendadas, toda terça e quinta às 10:00) — é a rota que entrega
      na pasta C:\CAPCUT;
  (b) pelo workflow .github/workflows/carrosseis-terca-quinta.yml (job opcional "rotina"),
      que entrega como artefato do GitHub Actions.
-->

Rotina de terça e quinta: gerar os **2 carrosséis** de Instagram/TikTok desta execução para o Dumi Sabores Orientais (Londrina-PR) e entregá-los para aprovação. Responda sempre em português do Brasil.

Repositório: C:\Users\joaol\Downloads\CLAUDE\DUMI (trabalhe dentro dele).

0. **Trava de dia já entregue:** abra `carrosseis/_base/historico.json`. Se já houver 2 ou mais entregas com a data de hoje, NÃO gere nada: encerre e responda apenas "Hoje já tem entrega no histórico — nada gerado".
1. Invoque a skill `dumi-carousel-designer` e siga à risca a seção "Rotina de terça e quinta (2 carrosséis por execução)" do SKILL.md dela. A base de informações está em `carrosseis/_base/instituto.md`, o catálogo de referências visuais em `carrosseis/_base/referencias.md`, o banco de fotos em `carrosseis/_base/fotos.md` e o histórico do que já foi feito em `carrosseis/_base/historico.json`.
2. Abra `historico.json` antes de tudo e identifique a **execução anterior** (as entregas da data mais recente). Regras do usuário (inegociáveis):
   - **2 carrosséis por execução**, com **linhas de conteúdo diferentes entre si** (petiscos, pratos, sobremesas, drinks, experiência, institucional) e **diferentes das 2 linhas da execução anterior**;
   - cada carrossel com uma **pauta nunca usada** (confira o histórico) — nunca repetir tema, pauta ou informação;
   - cada carrossel com a **sua própria referência visual**: as 2 próximas da fila (`node scripts/carrossel/historico.mjs --proxima`), nunca a mesma nos dois e nunca uma já usada;
   - **fotos diferentes** entre os 2 carrosséis e diferentes das fotos da execução anterior (o motor barra; trate sequências quase iguais da mesma foto como a mesma foto);
   - nunca colocar valor/preço, promoção, data nem horário; nada de "sushi" ou "rodízio";
   - foco em educar sobre os pratos reais (origem, ingredientes, técnica), despertar desejo e levar ao pedido pelo iFood (o delivery é **só** pelo iFood — nunca "delivery próprio");
   - copy só a partir da base de informações, sem inventar pratos, ingredientes, números, depoimentos ou escassez;
   - cores só as da logo: preto `#050505`, vermelho `#D81C1B`, branco `#FFFFFF`;
   - palavra do CTA da lista oficial: DUMI, QUERO, DELIVERY, CARDÁPIO.
3. Se a referência da vez ainda não tem estilo em `carrosseis/_base/estilos/`, crie-o antes de renderizar (seção "Criar o estilo de uma referência" da skill). Se a fila esgotar, avise no resumo e peça novas referências.
4. Renderize os 2 nos formatos feed e story, abra TODOS os PNGs para conferir visualmente e corrija qualquer texto cortado ou sobreposto, foto mal recortada ou item fora do cardápio visível (o bolinho de arroz com alga das fotos reais não está no cardápio) antes de entregar.
5. Entregue cada um com o flag de entrega do motor (`--formato=ambos --entregar`). O destino é `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<data>-<slug>\` (ou `DUMI_ENTREGA_DIR`) e o histórico é atualizado. Slug sem "_" no começo.
6. Não faça commit, não faça push e não publique em nenhuma rede social: tudo passa por aprovação humana.
7. Termine com um resumo curto: as 2 linhas, a pauta, o arco, a referência, a palavra do CTA, as fotos e a pasta de entrega de cada carrossel; quantas referências com estilo pronto ainda restam na fila. Se algo falhar (fonte, foto, motor, estilo), diga exatamente o quê, em vez de entregar pela metade.
