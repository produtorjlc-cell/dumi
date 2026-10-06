# Catálogo de referências visuais — Dumi

Referências de **linguagem visual**, nunca material para postar. Não copiar logos, textos,
pessoas ou ilustrações de terceiros; cores **só as 3 da logo** (definição do usuário,
06/10/2026): preto `#050505`, vermelho `#D81C1B` e branco `#FFFFFF` (ver `marca.mjs`).
Dourado, creme e cinzas que aparecem nas referências são **traduzidos** para essas três.
As fotos dos slides vêm de `img/`, `carrosseis/_base/fotos-reais/` e da raiz (ver `fotos.md`).

Origem: (a) artes e prints do próprio Dumi na raiz do projeto (revisados um a um em
05/10/2026; as artes de cardápio e o `EXEMPLO LOGO.png` em 06/10/2026), (b) imagens soltas
pelo usuário em `carrosseis/_base/referencias-img/` (abertas e catalogadas em 06/10/2026,
nº 19–25) e (c) pesquisa web de 05/10/2026 (tendências de carrossel 2026 e design de
restaurante japonês/asiático) — as referências web estão documentadas com o link e a
descrição; quando chegar a vez de uma delas, abra o link para rever antes de criar o estilo.

## Fila sequencial (regra do usuário — igual ao Kaizen)

Cada referência é **uma arquitetura visual própria** (estilo em
`carrosseis/_base/estilos/<id>.mjs`) e é usada **uma única vez**, na ordem numérica.
Cadência (06/10/2026): **2 carrosséis por execução, terça e quinta** — cada execução
consome **2 referências** (os 2 carrosséis nunca usam a mesma), ou seja 4 por semana.

- `node scripts/carrossel/historico.mjs --proxima` mostra as próximas da fila, se o estilo
  já existe e as imagens novas ainda não catalogadas.
- **Imagens novas:** coloque em `carrosseis/_base/referencias-img/`; o `--proxima` lista as
  que ainda não estão aqui. Abra cada uma, catalogue no **fim** desta lista (próximo número).
- **Fila esgotada:** não repetir. Usar a menos recente com `meta.variacaoForte: true` e pedir
  novas referências ao usuário no resumo.
- `legado · dumi-editorial` fica fora da fila (estilo embutido do motor).

**O que o motor faz bem** (resvg): fotos em cor ou tratadas (P&B, duotone, quente), recorte
em círculo/arco, cartões inclinados com sombra, sombra em camadas, relevo, halo, gradientes,
vinheta, grão, zoom narrativo, tipografia gigante vazada. **Evitar:** recorte de pessoa do
fundo, dupla exposição, halftone, falso 3D elaborado.

> **Comida pede cor.** Diferente do Kaizen (duotone), nos estilos do Dumi a foto do prato
> fica **em cor** (`tratamento: "cor"`), no máximo escurecida/vinhetada. P&B só em foto de
> ambiente, como recurso pontual.

---

### legado · `dumi-editorial`
- **Arquivo:** nenhum. Estilo embutido do motor (Playfair + Inter, moldura espelhada, duotone).
- **Tradução:** fallback quando nenhuma referência servir; fora da fila.

### 01 · `ref-ardosia-vermelha`
- **Arquivo:** `EXEMPLO HERO.png` (raiz do projeto)
- **O que tem:** fundo de ardósia escura texturizada, logo centralizado (flor vermelha +
  "DUMI" branco + "- SABORES ORIENTAIS -" espaçado), fileira de bandeirinhas dos países na base.
  Muito respiro, tudo simétrico.
- **Tradução:** **estilo 01 "Noite de ardósia"** — fundo preto da logo com textura de
  pedra (grão + vinheta) e ondas vermelhas a ~4%, composição centralizada, serifa de alto
  contraste (DM Serif Display) com ênfase em itálico **vermelho**, kicker espaçado em caixa
  alta (Lato branco), foto do prato **em cor** como "prato na mesa" (círculo com aro
  vermelho) ou full-bleed com vinheta; fileira de pontos (progresso) no lugar das
  bandeiras; flor-assinatura vermelha como pequeno ornamento. Bandeiras não (terceiros/ruído).
  _(id antigo `ref-ardosia-dourada`; renomeado em 06/10/2026 — o dourado saiu da paleta.)_

### 02 · `ref-editorial-branco`
- **Arquivo:** `(web) https://mysocialboutique.co/5-instagram-carousel-design-trends-fall-2026/`
- **O que tem:** tendência 2026 "Things I find incredibly chic": serifas, **tipografia
  superdimensionada**, fotografia do dia a dia, **recortes inesperados**, cara de revista.
- **Tradução:** **estilo 02 "Cardápio editorial"** — papel **branco** da logo (ou
  **vermelho** sólido no "cartão vermelho"), tinta preta, grotesca condensada gigante
  (Bebas Neue) + serifa itálica (Spectral), foto **em cor** num recorte de arco (janela
  oriental) ou faixa sangrada com corte "inesperado", numeração de página de revista, selo
  redondo de **origem do prato** (carimbo vermelho), régua fina vermelha.
  _(id antigo `ref-editorial-creme`; renomeado em 06/10/2026 — o creme saiu da paleta.)_

### 03 · `ref-olho-magico`
- **Arquivo:** `DELIVERY DUMI.png` (raiz)
- **O que tem:** foto cinematográfica vista por um **olho mágico** (moldura circular escura,
  lente olho-de-peixe), luz quente, logo pequeno no topo central, entregador estendendo a
  sacola e o prato.
- **Tradução:** `full` com máscara circular grande e vinheta pesada em volta (o "visor"),
  logo/eyebrow centralizado no topo, texto na faixa escura de baixo. Bom para "como pedir
  pelo iFood". Lente distorcida não.

### 04 · `ref-banner-pratos`
- **Arquivo:** `EXEMPLO HERO 2.png` (raiz)
- **O que tem:** colagem de vários pratos sobre mesa escura, marca no centro, bandeirinhas.
- **Tradução:** slide-mapa com 3–5 fotos pequenas em cor espalhadas (círculos/cartões
  sobrepostos) em volta de um título central; depois um slide por prato. Bom para "petiscos
  de 4 países" e "mapa das origens".

### 05 · `ref-recorte-etiqueta`
- **Arquivo:** `INSTAGRA @dumisaboresorientais.png` (raiz — post fixado)
- **O que tem:** pessoa recortada com contorno branco sobre fundo texturizado, etiqueta
  retangular com cargo + nome.
- **Tradução:** a **etiqueta** (tarja pequena em caixa alta + tarja grande com o nome) vira
  o rótulo do prato/origem; o recorte de pessoa não (o motor não recorta).

### 06 · `ref-titulo-pesado-tarja`
- **Arquivo:** `INSTAGRA @dumisaboresorientais.png` (raiz — 2º post)
- **O que tem:** close de comida, título branco pesado e condensado em duas linhas, nome
  da marca numa **caixa vermelha** logo abaixo.
- **Tradução:** `full` + título pesado (Archivo Black) + `caixaMarinho` vermelha com
  "DUMI" ou o nome do prato. Gancho direto.

### 07 · `ref-nome-gigante`
- **Arquivo:** `INSTAGRA @dumisaboresorientais.png` (raiz — post "UDON")
- **O que tem:** nome do prato **gigante em vermelho** sobre a tigela vista de cima, subtítulo
  minúsculo embaixo.
- **Tradução:** `full` com foto de cima, uma palavra enorme (o nome do prato) e `corpo` de
  uma linha com a descrição literal. Ótimo para série "um prato por slide".

### 08 · `ref-mosaico-quatro`
- **Arquivo:** `INSTAGRA @dumisaboresorientais.png` (raiz — último post)
- **O que tem:** grade 2×2 de fotos de pratos, sem texto.
- **Tradução:** slide de "prova visual" com 4 fotos em grade e um título curto por cima numa
  tarja; depois detalhar um por slide.

### 09 · `ref-cards-flutuantes`
- **Arquivo:** `download (1).jpg` (raiz)
- **O que tem:** celular e cartões de produto **flutuando** em camadas, sombras suaves,
  fundo claro neutro com luz lateral.
- **Tradução:** fundo branco com cartões de foto sobrepostos em profundidade (`k-camadas`),
  leve inclinação, luz lateral em gradiente. Bom para "como pedir pelo iFood" (sem imprimir
  tela de app de terceiros).

### 10 · `ref-cartao-vermelho`
- **Arquivo:** `(web) https://mysocialboutique.co/5-instagram-carousel-design-trends-fall-2026/`
- **O que tem:** tendência "Things that deserve a red card": tipografia forte, **fundo
  sólido** e **um único visual** reconhecível; formato de opinião.
- **Tradução:** fundo vermelho Dumi sólido + uma foto pequena recortada + frase opinativa
  grande ("Oriental não é só japonês"). Quebra de padrão.

### 11 · `ref-bilhete-lembrete`
- **Arquivo:** `(web) https://mysocialboutique.co/5-instagram-carousel-design-trends-fall-2026/`
- **O que tem:** tendência "Just checking if…": tipografia grande e simples sobre foto ou
  fundo liso, cada slide parece um **bilhete**.
- **Tradução:** `papel` branco, uma frase por slide em sans grande, sem moldura; carrossel
  curto de identificação ("Só passando pra saber se você já provou…").

### 12 · `ref-texto-gigante-sobre-foto`
- **Arquivo:** `(web) https://mysocialboutique.co/5-instagram-carousel-design-trends-fall-2026/`
- **O que tem:** foto do dia a dia com **texto superdimensionado direto sobre a imagem**.
- **Tradução:** `full` em todos os slides, título de 2–3 palavras ocupando a largura, sem caixa.

### 13 · `ref-bastidor-celular`
- **Arquivo:** `(web) https://mysocialboutique.co/5-instagram-carousel-design-trends-fall-2026/`
- **O que tem:** fotos reais de celular, sem polimento, com **texto grande sobreposto** —
  autenticidade em vez de arte.
- **Tradução:** série de bastidor (preparo, salão) com fotos reais enviadas pelo Dumi
  (`entrada/fotos/`), moldura de polaroid simples. Depende de fotos novas.

### 14 · `ref-marmore-negro`
- **Arquivo:** `(web) https://foodshot.ai/blog/aesthetic-food-backgrounds`
- **O que tem:** fundos de comida "moody": **ardósia carvão** fosca e **mármore negro com
  veios dourados** — clima editorial de alto padrão.
- **Tradução:** fundo preto com veios **brancos/vermelhos** finos em SVG (linhas curvas a
  6–10% de opacidade — dourado não), fotos em cor com sombra forte. Variação luxuosa do 01.

### 15 · `ref-circulo-vermelho-hashi`
- **Arquivo:** `(web) https://99designs.com/inspiration/designs/japanese-restaurant`
- **O que tem:** iconografia de pôster japonês: **círculo vermelho** grande (sol) atrás do
  prato, hashi levantando o macarrão, preto/vermelho/dourado (aqui: preto/vermelho/branco).
- **Tradução:** círculo vermelho sólido como palco da foto (prato em cor por cima), título
  vertical curto ao lado; ótimo para yakisoba/chow mein/udon.

### 16 · `ref-poster-minimal-japones`
- **Arquivo:** `(web) https://www.pinterest.com/ideas/japanese-restaurant-graphic-design/928527405919/`
- **O que tem:** pôster minimalista japonês: equilíbrio, muito espaço negativo, grade
  assimétrica, um elemento de cor.
- **Tradução:** `papel` branco quase vazio, foto pequena deslocada para um canto, título em
  coluna estreita, uma única mancha vermelha. Slide de respiro/insight.

### 17 · `ref-menu-preto-fio`
- **Arquivo:** `(web) https://www.postermywall.com/index.php/art/template/776ca12bc9d3a8b0835ab0ecce8a0059/black-modern-japanese-food-menu-design-template`
- **O que tem:** cardápio preto moderno: títulos de seção dourados, itens com **linha
  pontilhada** até a coluna da direita, divisores finos.
- **Tradução:** slide-lista (`lista`) com rótulo **vermelho** = país de origem e texto =
  prato, pontilhado branco até o país; sem preço na rotina. _(id antigo
  `ref-menu-preto-dourado`, nunca usado; renomeado em 06/10/2026.)_

<!-- Catalogadas em 06/10/2026 (cada imagem aberta e revisada antes de catalogar). -->

### 18 · `ref-cartaz-cardapio-vertical`
- **Arquivo:** `GUIOZA.png` (raiz — mesma série: `CHOW MEIN.png`, `DORAYAKI (2).jpg`,
  `MURTA BAK.png`, `NIKUMANJU.png`, `AKA.png`, `SAGWA.png`, `SHOGA.png`, `GYUL.jpg`)
- **O que tem:** cartazes de cardápio do próprio Dumi, verticais: fundo preto texturizado
  com folhas de bambu nos cantos, logo "DUMI · SABORES ORIENTAIS" no topo com selo
  quadrado vermelho, **tarja vertical vermelha** com o nome em japonês/chinês, foto do prato
  ou drink em cor no centro, nome em serifa clara ("GYOZA", "18. DORAYAKI"), país em
  vermelho, descrição curta, **ideograma grande em pincel** no canto inferior direito e
  rodapé com ícone redondo + frase. Usa dourado nos títulos.
- **Tradução:** "ficha de cardápio" por slide — foto do prato em cor no centro, número do
  item + nome em serifa **branca**, país em **vermelho**, tarja vertical vermelha à esquerda
  com o nome do prato em caixa alta (sem ideograma inventado — só letras latinas), fio e
  selo vermelhos; nada de dourado nem de folhas de bambu (ruído). Ótimo para série "um prato
  por slide" e para drinks.

### 19 · `ref-onda-vermelha-branca`
- **Arquivo:** `download (2).jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** página vertical dividida por uma **curva em S**: metade branca à esquerda,
  vermelha à direita; tigelas pretas vistas de cima descendo em zigue-zague pela curva,
  pinceladas vermelhas e respingos, legendas pequenas ao lado de cada tigela, marca
  pequena no meio da área branca.
- **Tradução:** fundo partido por curva branco/vermelho (as 3 cores da logo já estão
  aqui), fotos de pratos recortadas em **círculo** "descendo" pela curva com nome + país em
  texto pequeno ao lado; pincelada vermelha em SVG como ornamento. Ótimo para "mapa das
  origens" ou "petiscos de 4 países". Logo e textos de terceiros não.

### 20 · `ref-busca-google`
- **Arquivo:** `Referencia _ Pesquisa Google.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** prato coreano em panela de pedra sobre mesa de madeira, salão desfocado
  ao fundo; por cima, o logotipo "Google" em branco e uma **caixa de busca** com a pergunta
  e a sugestão (nome do restaurante); logo do restaurante pequeno na base.
- **Tradução:** gancho em forma de **barra de busca** desenhada em SVG (caixa branca
  arredondada + lupa) com a pergunta do público ("o que é khuushuur?") sobre a foto real em
  cor; a "sugestão" embaixo é o nome do prato. **Sem** a marca Google (terceiros) — só a
  linguagem da busca.

### 21 · `ref-busca-cartao-quente`
- **Arquivo:** `Sahibs Barbeque _ Google Search Rogan Josh.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** fundo bordô texturizado, **cartão translúcido** com gradiente quente no
  topo contendo a barra de busca, tigela de cobre com fumaça saindo para fora do cartão,
  logos nos cantos superiores e título em serifa na base (nome em caixa alta).
- **Tradução:** fundo preto com vinheta vermelha, cartão arredondado translúcido (branco a
  ~8%) com a barra de busca, foto do prato "saindo" do cartão (foto maior que a moldura) e
  título em serifa branca + palavra em vermelho na base. Variação do 20 com cartão — usar
  longe dele na fila.

### 22 · `ref-titulo-vertical-gigante`
- **Arquivo:** `Restaurante Japonês ✦ Social Media Design - Cristiane Silva.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** fundo grafite com padrão sutil de ondas, um único item (temaki) recortado
  e cortado pela borda esquerda, frase curta em sans à direita e o **nome do item empilhado
  em letras gigantes** (2 letras por linha) em fonte display de pincel, "logo" vermelho no topo.
- **Tradução:** foto do prato em cor sangrando pela esquerda + nome do prato em display
  gigante empilhado (Bebas/Archivo, branco) na coluna direita, frase de apoio curta acima,
  marca vermelha discreta no topo. Tema **temaki/sushi não** (fora do cardápio) — só a
  composição.

### 23 · `ref-ingrediente-educativo`
- **Arquivo:** `#wasabi #sushi #comidajaponesa #conteudo #mkt #up_.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** post quadrado escuro: ingrediente (wasabi) em close num prato preto, fundo
  desfocado, **nome do ingrediente em display fino e elegante** grande e um parágrafo curto
  "Você sabia que…" em sans espaçada; logo pequeno no canto.
- **Tradução:** série "ingrediente do cardápio" (shitake, panko, anis estrelado, castanha de
  caju — só os da descrição literal): close em cor, nome em serifa/display fina branca
  gigante, 2 linhas de "você sabia" ancoradas no cardápio. Sushi e wasabi não.

### 24 · `ref-ondas-faixa-explicativa`
- **Arquivo:** `#ComidaJaponesa #SushiSantoAndre #GastronomiaJaponesaABC #SantoAndreFood #ABCpaulista #RestaurantesJaponeses #SushiLoversABC #SashimiTime #CulinariaJaponesa #TemakiSantoAndre #FoodLoversABC #JapaNoABC_.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** story vertical: topo com **padrão de ondas concêntricas (seigaiha)
  vermelhas** sobre preto, título condensado branco ("O SHOYO") com fio dourado embaixo,
  texto explicativo em caixa alta espaçada, metade de baixo com foto (hashi molhando no
  shoyu), marca d'água repetida.
- **Tradução:** cabeçalho com ondas seigaiha vermelhas em SVG, título condensado branco +
  fio **vermelho**, explicação em caixa alta curta, foto do prato na metade de baixo com
  degradê preto. Ótimo para "o segredo do yakisoba é o molho". Marca d'água não.

### 25 · `ref-pergunta-resposta`
- **Arquivo:** `_#ComidaJaponesa #SushiSantoAndre #GastronomiaJaponesaABC #SantoAndreFood #ABCpaulista #RestaurantesJaponeses #SushiLoversABC #SashimiTime #CulinariaJaponesa #TemakiSantoAndre #FoodLoversABC #JapaNoABC #SushiAddict.jpg` (`carrosseis/_base/referencias-img/`)
- **O que tem:** post quadrado com degradê preto → vermelho, título grande ("TEMAKI"),
  **pergunta** em caixa alta, **pílula "RESPOSTA: SIM!"** contornada, resposta em sans,
  bloco "Dica:" no fim; mão segurando o item à direita.
- **Tradução:** carrossel de dúvidas reais ("Guyoza é cozida ou frita?" → pílula
  "RESPOSTA: OS DOIS"), uma pergunta por slide, resposta da descrição do cardápio, "Dica" no
  fim; foto do prato à direita. Tema temaki não.

### 26 · `ref-palco-holofotes`
- **Arquivo:** `EXEMPLO LOGO.png` (raiz)
- **O que tem:** fundo preto com **fachos de luz** descendo do topo (holofotes), logo
  centralizado (flor vermelha, DUMI branco, "- SABORES ORIENTAIS -") e fileira de
  bandeirinhas dos países embaixo; faixa branca vazia na base.
- **Tradução:** capa/CTA "em cena": fachos de luz branca a 6–10% em SVG, prato ou palavra
  no centro do palco, marca em cima; progresso em pontos no lugar das bandeiras. Variação
  teatral do 01 — usar longe dele na fila.
