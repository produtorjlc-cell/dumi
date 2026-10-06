---
name: entregar-aprovacao
description: Copia os arquivos finais de uma peça do Dumi (marketing/producao/AAAA-MM/<ID>/) para a fila do painel-conteudo em C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\, preservando o legenda.txt. Use logo depois do APROVADO do verificador-realidade, ou com "/entregar-aprovacao <ID>".
---

<!--
  O QUE FAZ: etapa 5 do docs/FLUXO-OPERACIONAL.md. Substitui o "João copia o final para a fila" do
  Mercado Casa Grande por uma cópia padronizada.
  POR QUE O FORMATO IMPORTA: o monitor do painel (painel-conteudo/lib/scripts/monitor-approval-folder.ts)
  lê C:\CAPCUT\ENVIAR PARA APROVAÇÃO\<CLIENTE>\ assim:
    - arquivo solto = 1 post (imagem → feed, vídeo → reels);
    - SUBPASTA com 1 mídia = 1 post; SUBPASTA com 2+ mídias = 1 CARROSSEL (ordem numérica dos nomes);
    - só lê .jpg .jpeg .png .webp .mp4 .mov (legenda.txt e .json são ignorados);
    - ignora arquivo alterado há menos de 60 s e arquivo "-Cover.jpg" do CapCut;
    - casa a pasta "DUMI" com o cliente "Restaurante DUMI Sabores Orientais" (ignora acento/caixa/espaço);
    - o nome da subpasta vira o título do post.
  Por isso: UMA subpasta por post. Feed + story da mesma peça NÃO podem ficar juntos (virariam carrossel).
-->

# Entregar para aprovação — Dumi

## 0. Pré-condições (pare se alguma falhar)
- Ficha `marketing/producao/AAAA-MM/<ID>/ficha.md` com **APROVADO** do `verificador-realidade` na seção 4.
  Sem APROVADO → não copie nada; avise o orquestrador.
- `legenda.txt` existe na pasta da peça e não tem `[colchete]` aberto. Faltou → devolva ao `social-media`.
- A pasta `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\` existe (já criada; o painel lê dali).

## 1. Nome da pasta de destino
`<ID>-<slug>` — ID da ficha + slug curto do assunto, minúsculo, sem acento, com hífen.
Ex.: `DUMI-20261010-01-yakisoba`, `DUMI-20261012-02-drinks-sake`.
(Prefixo do Dumi = `DUMI-`; o `MCG-` é do Mercado Casa Grande.)

## 2. O que copiar (um post por subpasta)
| Peça | Origem (`marketing/producao/AAAA-MM/<ID>/`) | Destino (`...\DUMI\`) |
| --- | --- | --- |
| Post de feed | `feed.png` | `<ID>-<slug>\feed.png` |
| Story | `story.png` | `<ID>-<slug>\story.png` |
| Feed **e** story | `feed.png` + `story.png` | `<ID>-<slug>-feed\feed.png` e `<ID>-<slug>-story\story.png` (2 pastas!) |
| Carrossel | `carrossel\slide-01.png … slide-NN.png` | `<ID>-<slug>\slide-01.png …` (mesmos nomes, 2 dígitos) |
| Vídeo / Reels | `video\final.mp4` | `<ID>-<slug>\final.mp4` |

Em **toda** subpasta de destino vai junto uma cópia de `legenda.txt`.
Nunca copiar: `ficha.md`, `*.html`, `reels.json`, `planos/`, rascunhos, versões reprovadas.

## 3. Regra do legenda.txt (preservar)
- Destino **sem** `legenda.txt` → copie o da produção.
- Destino **com** `legenda.txt` (o João pode ter editado) → **não sobrescreva**. Compare; se forem diferentes,
  mostre as duas versões ao João e pergunte qual vale. A versão escolhida volta para a ficha e para a produção.

## 4. Comando (PowerShell) — exemplo para um carrossel
```powershell
$id   = "DUMI-20261010-01"; $slug = "yakisoba"; $mes = "2026-10"
$orig = "C:\Users\joaol\Downloads\CLAUDE\DUMI - CARDAPIO ONLINE\marketing\producao\$mes\$id"
$dest = "C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\$id-$slug"
New-Item -ItemType Directory -Force $dest | Out-Null
Copy-Item "$orig\carrossel\slide-*.png" $dest                       # mídia
if (-not (Test-Path "$dest\legenda.txt")) { Copy-Item "$orig\legenda.txt" $dest }   # preserva legenda
Get-ChildItem $dest | Select-Object Name, Length                     # confere
```
Reentrega por **ajuste** (post `em_ajuste` no painel): sobrescreva só a mídia **com o mesmo nome** — o monitor
vê o arquivo regravado e devolve o post para "pronto para aprovação" sozinho. Não crie pasta nova para ajuste.

## 5. Depois de copiar
1. Liste o destino e confira contagem/tamanho (arquivo < 1 KB é ignorado pelo monitor).
2. Registre na ficha (seção 5): pasta de destino, arquivos, data/hora.
3. Diga ao João: _"Na fila: `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<pasta>` — o monitor cria o post na próxima
   rodada (8h/12h/16h/20h) ou quando ele rodar `npm run monitor`. Antes de mandar o link ao Dumi, troque a
   legenda da IA pelo `legenda.txt`."_
4. **Não** rode `npm run monitor` nem `npm run publicar` — isso é do João (ou do agendador do Windows).

## Observação
Ao aprovar, o painel move só a **mídia** para `C:\CAPCUT\APROVADOS\DUMI\<pasta>\`; o `legenda.txt` fica na
pasta de envio (por isso ela não some). Pode ser apagado à mão depois da publicação.
