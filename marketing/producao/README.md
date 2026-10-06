# Produção — uma pasta por peça

<!-- Estrutura padrão. A skill entregar-aprovacao depende destes nomes: não renomear. -->
```
marketing/producao/AAAA-MM/<ID>/          ← ID = DUMI-AAAAMMDD-NN (data de publicação)
├─ ficha.md                 ← combinado da peça (modelo: _MODELO-FICHA.md)
├─ legenda.txt              ← legenda final (social-media), texto puro
├─ arte.html                ← fonte do feed/story (template posts-dumi.html)
├─ feed.png                 ← 1080×1350
├─ story.png                ← 1080×1920
├─ carrossel.html           ← fonte do carrossel (template carrossel-dumi.html)
├─ carrossel/slide-01.png … slide-NN.png   ← 1080×1350
└─ video/
   ├─ reels.json            ← configuração do reels-express (Receita 1)
   ├─ planos/               ← cortes intermediários (Receita 2, opcional)
   └─ final.mp4             ← 1080×1920 — único arquivo de vídeo que vai para aprovação
```
Só existe o que a peça usa (um post de feed não tem `carrossel/` nem `video/`).

- Render: `node ferramentas/render-artes/render.mjs <arte.html|carrossel.html> <pasta>`.
- Conferência: `node ferramentas/render-artes/conferir.mjs <arte.html|carrossel.html>`.
- Depois do APROVADO do `verificador-realidade`: skill `entregar-aprovacao` copia os finais para
  `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\`.
