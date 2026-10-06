# Entrada — tudo o que o Dumi manda

<!-- Porta única de entrada (modelo Mercado Casa Grande). Nada vai para produção sem passar por aqui. -->
- Um arquivo por pedido: `AAAA-MM-DD_assunto.md` (modelo: `_MODELO-PEDIDO.md`), criado pela skill `/novo-pedido`.
- Fotos recebidas: `fotos/AAAA-MM-DD/` (prato do dia, ambiente, equipe).
- Vídeos brutos do celular: `videos-brutos/AAAA-MM-DD/` (take falado → Receita 1; cenas sem fala → Receita 2).
- Processado = tem IDs `DUMI-AAAAMMDD-NN`, ficha criada e histórico preenchido.
- Fluxo completo: `docs/FLUXO-OPERACIONAL.md`.
