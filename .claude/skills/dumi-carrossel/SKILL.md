---
name: dumi-carrossel
description: Motor de carrossel do Dumi Sabores Orientais. Gera slides PNG 1080×1350 (slide-01..N.png) com a paleta e a marca do Dumi a partir das fotos do cardápio e do texto da ficha, usando o template ferramentas/render-artes/templates/carrossel-dumi.html; também padroniza slides PNG prontos (ex.: vindos do Canva). Use com "faz um carrossel do Dumi", "carrossel do cardápio", "/dumi-carrossel <ID>".
---

<!--
  O QUE É: o motor (passo a passo técnico) que o agente editor-carrossel segue. Pode ser usado sozinho
  pela sessão principal para um carrossel rápido.
  BASE: mesmo motor do Mercado Casa Grande (ferramentas/render-artes: render.mjs + conferir.mjs),
  com template próprio do Dumi. NÃO usar o motor do KAIZEN (paleta do Instituto + --entregar para a pasta dele).
-->

# Carrossel do Dumi

## Marca (fonte: `tailwind-config.js` e `index.html` do cardápio online)
| Token | Cor | Uso |
| --- | --- | --- |
| `--bg` | `#121212` | fundo dos slides (com padrão de ondas douradas a 5 %) |
| `--surface` / `--surface2` | `#1B1B1B` / `#212121` | painéis, cartões |
| `--gold` / `--gold-light` | `#D4AF37` / `#E9CD73` | kicker, origem, preço, fios |
| `--red` | `#C8102E` (CTA `#E5233F → #9C0C24`) | botão iFood, flor do logo |
| `--text` / `--muted` | `#FFFFFF` / `#E5E7EB` | títulos / texto de apoio |
Fontes: **Playfair Display** (títulos, itálico para ênfase) + **Inter** (texto). Logo: `img/logo.png` em círculo.

## Tipos de slide do template
| `tipo` | Para quê | Campos |
| --- | --- | --- |
| `capa` | 1º slide: gancho + foto grande | `kicker`, `titulo`, `apoio`, `foto` |
| `prato` | um prato por slide | `kicker` (país), `titulo` (nome), `apoio` (descrição real), `preco` (opcional), `foto` |
| `cta` | último slide: pedir | `kicker`, `titulo`, `apoio`, `botao`, `rodape` (endereço/@) |
Contador `02/05` e pontos de progresso saem sozinhos. `modelo: true` carimba "MODELO — NÃO PUBLICAR".

## Modo A — gerar do zero (padrão)
1. Texto slide a slide pronto na ficha (seção 2) — escrito pelo `social-media`. Sem texto → pare.
2. Copie o template:
   `ferramentas/render-artes/templates/carrossel-dumi.html` → `marketing/producao/AAAA-MM/<ID>/carrossel.html`.
3. Edite **só** o bloco `DADOS` (topo do arquivo): `RAIZ: "../../../../"`, `modelo: false`, `slides: [...]`
   (cada `foto` é relativa à raiz do projeto: `"img/yakisoba.jpg"`, `"CHOW MEIN.jpg"`).
   Foto pequena (os `img/*.jpg` dos pratos têm 900×534) só na faixa de foto do slide `prato`;
   para `capa` use original em alta (raiz do projeto, ex. `CHOW MEIN.jpg`) ou foto nova de `entrada/fotos/`.
4. Render: `node ferramentas/render-artes/render.mjs marketing/producao/AAAA-MM/<ID>/carrossel.html marketing/producao/AAAA-MM/<ID>/carrossel`
5. Conferir: `node ferramentas/render-artes/conferir.mjs marketing/producao/AAAA-MM/<ID>/carrossel.html` (0 erros).
6. Olhar cada PNG (Read). Corrigir e renderizar de novo até ficar limpo.

## Modo B — slides PNG prontos (Canva, designer, cliente)
1. Coloque os PNG em `marketing/producao/AAAA-MM/<ID>/carrossel/`.
2. Padronize: renomeie na ordem para `slide-01.png … slide-NN.png` (2 dígitos — o painel ordena pelo nome),
   confirme 1080×1350 (ou todos do mesmo tamanho, 4:5) e 2 a 10 slides (limite do Instagram: 10).
3. Não há `conferir.mjs` para PNG pronto → o `verificador-realidade` confere fatos e marca pelo olho.

## Saída (igual nos dois modos)
`marketing/producao/AAAA-MM/<ID>/carrossel/slide-01.png … slide-NN.png` + `legenda.txt` na pasta da peça.
Depois do APROVADO do verificador → skill `entregar-aprovacao` (a subpasta inteira vira **um** carrossel no painel).

## Regras
- Fatos só de `briefing/fatos.json` + ficha. Preço fora de `precos_confirmados` = erro no `conferir.mjs`.
- Sem emoji de bandeira (o Windows não desenha); escreva o país.
- Pré-requisito de máquina (uma vez, pelo João): `npm install` em `ferramentas/render-artes` e
  `npx playwright install chromium`.
