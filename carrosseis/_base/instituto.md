# Base de conhecimento — Dumi Sabores Orientais (Londrina-PR)

Fonte única de informação para a copy dos carrosséis. **Tudo aqui foi compilado de**
`briefing/CLIENT-BRIEF.md`, `briefing/fatos.json`, `img/PALETA-DUMI.md`, do cardápio online
(`index.html` + `app.js`) e do print do perfil (`INSTAGRA @dumisaboresorientais.png`). Cada
bloco cita a origem. Se algo não está aqui nem nesses arquivos, **não existe para a copy**:
não inventar pratos, ingredientes, preços, promoções, prêmios, números, depoimentos ou
histórias.

> **Sem preço, sem data e sem horário.** A rotina semanal **não mostra valor, promoção,
> data nem horário** — o motor bloqueia `R$`, datas, meses, "18h", "lote", "parcelado".
> Preço só em carrossel de campanha (`meta.campanha: true`), por pedido explícito do usuário
> e com o preço confirmado no iFood.

> **Promoção não confirmada.** "Peça um Yakisoba e ganhe um Nikumanju de brinde" aparece no
> site, mas a validade é **[a confirmar]** (`fatos.json` → `publicar: false`). O motor
> barra "brinde", "ganhe", "grátis".

---

## 1. O restaurante

_Fontes: `briefing/CLIENT-BRIEF.md` (Identidade), hero do `index.html`, bio do Instagram (print)._

- **Nome:** Dumi Sabores Orientais (no painel: "Restaurante DUMI Sabores Orientais").
- **Frase da marca:** "Uma viagem pela Ásia, prato a prato." (hero do site)
- **Bio do Instagram:** "Novo conceito da Culinária Oriental". (print do perfil)
- **Origem dos pratos (9 países):** Japão, China, Tailândia, Indonésia, Vietnã, Mongólia,
  Malásia, Coreia e Singapura. (`index.html`)
  > Hoje o cardápio online tem pratos de **Japão, China, Tailândia, Indonésia, Vietnã,
  > Mongólia e Malásia** (+ Japão/Brasil e Brasil). Coreia e Singapura aparecem na lista de
  > origens, mas **sem prato correspondente no cardápio** — não atribuir prato a elas.
- **Cidade:** Londrina-PR · Av. Waldemar Spranger, 881 - Sala 5 · Jardim São Jorge.
  (Endereço só entra em carrossel de "como chegar", nunca na rotina educativa.)
- **Pedido/delivery:** **exclusivo via iFood**. (rodapé do `index.html`) — na copy: "peça
  pelo iFood, link na bio". Nunca "delivery próprio", "frete/entrega grátis".
- **Dúvidas:** WhatsApp (número em `fatos.json`; não vai impresso no carrossel da rotina).
- **Instagram:** @dumisaboresorientais.
- **Horário:** a bio do Instagram (print) mostra "Terça a Sábado | 18h às 22h"; o briefing
  ainda marca **[a confirmar]**. Não usar na rotina (o motor bloqueia horário).
- **Ambiente:** salão com painéis de flor de cerejeira, luminárias redondas e mesas de
  madeira (foto `img/ambiente-hero.jpg` / original `AMBIENTE RESTAURANTE DUMI.png` — uso
  liberado pelo Dumi em 06/10/2026); fachada com letreiro iluminado "DUMI"
  (`img/faixada-restaurante.jpg`).

## 2. Equipe

_Fonte: print do perfil do Instagram (post fixado)._

- O post fixado do perfil apresenta **"Empresário — Reinaldo M. Kuwahara"**. Papel exato,
  autorização de imagem e o que pode ser dito sobre ele: **[a confirmar com o Dumi]**.
  Até confirmar: **não citar nome de pessoa** nos carrosséis da rotina.
- Não inventar chef, cozinheiros, "nossa equipe de X anos" etc.

## 3. Regras de marca e palavras proibidas

_Fontes: `briefing/fatos.json` (termos_proibidos), `CLIENT-BRIEF.md` (Público, tom)._

- **Tom:** descontraído, apetitoso, envolvente e moderno — frases curtas, diretas e
  **sensoriais** (crocante, caramelizado, quente, cremoso…) **sempre ancoradas na descrição
  real do prato** (§4).
- **Proibido (o motor barra):** "sushi"/"sashimi"/"temaki" (não estão no cardápio),
  "rodízio", "frete/entrega/delivery grátis", "delivery próprio"/entrega própria/
  "entregamos"/pedido por WhatsApp (o delivery é só iFood), "Produção JLC",
  "brinde"/"ganhe"/"grátis" (promoção sem validade), preço, data, horário, escassez
  ("últimas porções", "só hoje", "corra", "enquanto durar"), links impressos.
- **Revisar (o motor avisa):** superlativos sem fonte ("o melhor", "a mais"), "garantido",
  "100%".
- **Sem depoimento inventado** — "Clientes" é um destaque do perfil, mas o texto das falas
  não está na base.
- **Ingredientes:** só os da descrição literal do cardápio. Não acrescentar "picante" se o
  prato não leva pimenta (o Nuer e o Kho Tauy levam).
- **Paleta (só as 3 cores da logo — definição do usuário, 06/10/2026):** preto `#050505`
  (círculo da logo), vermelho `#D81C1B` (flor da logo) e branco `#FFFFFF` (letras "DUMI").
  Hex amostrados com sharp em `LOGO VETORIZADA.png` (= `img/logo.png`); o vermelho confere
  com `EXEMPLO LOGO.png` (#DE1F20–#DF2327). **Fora:** creme `#F4EFE6` (derivado, não
  aprovado), dourado `#D4AF37`/`#E9CD73`, vermelho `#C8102E` e cinzas `#121212`/`#1B1B1B`
  (vêm do site, não da logo). Sem tom de apoio: texto secundário = branco/preto com
  opacidade. Nada de verde, azul, roxo, dourado (o motor barra). **Tipografia:** a do
  estilo da referência da vez (`fontes.md`).

## 3.1 CTA de engajamento

O último slide pede para **comentar UMA palavra-chave desta lista oficial** (em caixa
alta, no cta estilo `palavra`), mais um CTA secundário (salvar, marcar quem vai junto,
"peça pelo iFood — link na bio"):

| Palavra | Casa melhor com |
| --- | --- |
| `DUMI` | institucional, experiência, qualquer linha |
| `QUERO` | pratos, petiscos, sobremesas, drinks |
| `DELIVERY` | experiência "como pedir", qualquer prato — a resposta leva ao **iFood** (único delivery) |
| `CARDÁPIO` | institucional "viagem pela Ásia", origens dos pratos, linha inteira (petiscos, drinks) |

_Lista definida pelo usuário em 06/10/2026 (substitui DUMI · QUERO · FOME · ÁSIA · PROVAR)._
`DELIVERY` passa na validação como palavra de CTA; o que continua barrado é o **falso**:
"delivery próprio", entrega/entregador/motoboy próprios, "entregamos", pedido ou delivery por
WhatsApp/telefone/site/direct e frete/entrega/delivery grátis — o delivery do Dumi é
**exclusivo via iFood** (rodapé do `index.html`, `CLIENT-BRIEF.md`, `fatos.json`).

- Vai em `meta.palavraCta`, é registrada no histórico e deve **variar entre semanas**.
- O comentário é um convite para a equipe responder; **não prometer** cupom, brinde,
  desconto ou envio automático de link.

## 3.2 Estrutura persuasiva obrigatória

Igual ao motor Kaizen (o motor valida a ordem):

1. **`gancho` (slide 1)** — no máximo ~10 palavras; sensorial, curioso ou pergunta de
   identificação ("Você já comeu um pastel da Mongólia?"). Geralmente `full` com a foto
   mais apetitosa.
2. **`valor` (2 ou mais)** — educar de verdade: de onde vem o prato, o que leva, a técnica
   (empanado em panko × tempurá, caramelizado, no vapor), como comer. Uma ideia por slide.
3. **`ponte` (penúltimo)** — liga ao Dumi: onde provar, linha do cardápio, "peça pelo
   iFood". Sem preço.
4. **`cta` (último)** — palavra-chave para comentar + CTA secundário.

Técnicas: loop aberto · identificação · quebra de padrão ("Nem todo oriental é japonês") ·
prova pelo conteúdo (ingredientes reais) · reciprocidade · especificidade ("9 países",
"3 carnes no mesmo espeto"). Registre em `meta._tecnicas`.

Legenda: **1ª linha = o gancho**; resumo do valor; **repetir o CTA com a palavra-chave em
caixa alta**; 4–7 hashtags (#Londrina #ComidaOriental #CulinariaAsiatica #DumiSaboresOrientais…).

---

## 4. Catálogo — as linhas de conteúdo

Cada linha traz: o que é · itens reais (descrição literal do `app.js`) · **banco de pautas**.
Cada pauta tem um id estável (`- \`id\` · arco — ângulo`) que vai em `meta.pautaId`.

Arcos: `educativo` (padrão da rotina) · `produto` (apresentar um prato/linha) ·
`experiencia` (salão, pedido, ritual) · `depoimento` (só com fala real fornecida) ·
`campanha` (só com pedido explícito).

O campo do roteiro continua se chamando `meta.curso` (herança do motor); os valores são:
`petiscos` · `pratos` · `sobremesas` · `drinks` · `experiencia` · `institucional`.

### 4.1 Petiscos Orientais (`petiscos`)

| Prato | Origem | Descrição (literal) | Foto |
| --- | --- | --- | --- |
| Murta Bak Ayam | Malásia | Massa especial com recheio de carne, frango, ovo cozido e temperos especiais (01 unid). | `img/murta-bak.jpg` |
| Khuushuur | Mongólia | Massa especial com recheio de carne suína, ovina e temperos especiais (02 unid). | `img/khuushuur.jpg` |
| Satay | Indonésia | Espeto com mignon bovino, mignon suíno, sobrecoxa de frango e temperos especiais (03 unid). | `img/satay.jpg` |
| Guyoza | Japão | Massa cozida e frita com recheio de carne suína e temperos especiais (02 unid). | `img/guyoza.jpg` |
| Nikumanju | Japão | Pão oriental com recheio de carne suína, legumes e temperos especiais (02 unid). | `img/nikumanju.jpg` |
| Ebi Furai | Japão | Camarão empanado à moda tempurá com temperos especiais (porção). | `img/ebi-furai.jpg` |
| Isca de Peixe | Japão | Tiras de salmão empanadas em farinha panko (porção). | `img/isca-de-peixe.jpg` |

Banco de pautas:

- `petiscos-quatro-paises` · educativo — 7 petiscos, 4 países: Malásia, Mongólia, Indonésia e Japão na mesma mesa
- `petiscos-guyoza-cozida-e-frita` · educativo — por que a guyoza é cozida E frita: macia por dentro, dourada por baixo
- `petiscos-satay-tres-carnes` · educativo — satay, o espeto da Indonésia: mignon bovino, mignon suíno e sobrecoxa no mesmo prato
- `petiscos-khuushuur-mongolia` · educativo — você já comeu um pastel da Mongólia? Khuushuur, recheado de carne suína e ovina
- `petiscos-panko-x-tempura` · educativo — panko × tempurá: as duas crocâncias do Japão (Isca de Peixe e Ebi Furai)
- `petiscos-nikumanju-pao-oriental` · produto — Nikumanju: o pão oriental recheado de carne suína e legumes
- `petiscos-murta-bak-malasia` · produto — Murta Bak Ayam: carne, frango e ovo cozido numa massa da Malásia

### 4.2 Pratos Individuais (`pratos`)

| Prato | Origem | Descrição (literal) | Foto |
| --- | --- | --- | --- |
| Chow Mein | China | Macarrão, mignon bovino e suíno, sobrecoxa de frango, camarão na manteiga, gengibre e temperos especiais. | `img/chow-mein.jpg` · alta: `CHOW MEIN.jpg` |
| Kho Tauy | Vietnã | Panceta caramelizada, água de coco, anis estrelado, pimenta e temperos especiais. | `img/kho-tauy.jpg` · alta: `KHO TAUY.jpg` |
| Xendeg | Mongólia | Sobrecoxa de frango empanada com camarão e temperos especiais. | `img/xendeg.jpg` |
| Nuer | Tailândia | Mignon bovino, pimentão, pimenta vermelha, castanha de caju moída e temperos especiais. | `img/nuer.jpg` |
| Teppanyaki | Japão | Salmão grelhado acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/teppanyaki.jpg` |
| Camarão à moda Dumi | Japão/Brasil | Camarões grelhados na manteiga acompanhados de um suculento camarão empanado, shitake e shimeji. | `img/camarao-moda-dumi.jpg` |
| Lagosta Oriental | China | Lagostim acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/lagosta-oriental.jpg` |
| Takô Yude | Japão/Brasil | Tentáculo de polvo acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/tako-yude.jpg` |
| Yakisoba | Japão | Macarrão, legumes, verduras e proteínas refogados em um molho espesso à base de shoyu. | `img/yakisoba.jpg` |
| Udon | Japão | Sopa quente com macarrão fresco, ovos, kani e acompanhamentos ricos. | `img/udon.jpg` |

Banco de pautas:

- `pratos-yakisoba-molho-shoyu` · educativo — o segredo do yakisoba é o molho: espesso, à base de shoyu, refogado com tudo
- `pratos-kho-tauy-doce-salgado` · educativo — panceta caramelizada com água de coco e anis estrelado: o doce-salgado do Vietnã
- `pratos-udon-sopa-quente` · educativo — udon não é só macarrão: é sopa quente com macarrão fresco, ovos e kani
- `pratos-chow-mein-quatro-proteinas` · produto — chow mein: mignon bovino, mignon suíno, frango e camarão na manteiga num só prato
- `pratos-mar-shitake-shimeji` · produto — salmão, lagostim, polvo e camarão: os pratos do mar com shitake e shimeji
- `pratos-nuer-tailandia` · educativo — Nuer: pimentão, pimenta vermelha e castanha de caju moída — o equilíbrio tailandês
- `pratos-japao-brasil` · educativo — Japão/Brasil: Camarão à moda Dumi e Takô Yude, quando duas cozinhas se encontram
- `pratos-qual-combina-com-voce` · produto — macarrão, sopa, mar ou picante: qual prato combina com o seu dia?
- `pratos-xendeg-mongolia` · produto — Xendeg: sobrecoxa empanada com camarão, da Mongólia

### 4.3 Sobremesas (`sobremesas`)

| Prato | Origem | Descrição (literal) | Foto |
| --- | --- | --- | --- |
| Dorayaki | Japão | Massa especial recheada de creme com sorvete caseiro. | `img/dorayaki.jpg` |
| Sorvete Dumi | Brasil | Sorvete caseiro à moda Dumi com calda. Sabores: café c/ brownie, ferrero rocher, flocos, frutas vermelhas e mousse de maracujá. | `img/sorvete-dumi.jpg` |

- `sobremesas-dorayaki` · educativo — dorayaki: a massa japonesa recheada de creme, aqui com sorvete caseiro
- `sobremesas-cinco-sabores` · produto — sorvete caseiro à moda Dumi: 5 sabores, com calda — qual é o seu?

### 4.4 Drinks autorais — base de saquê (`drinks`)

Todos existem **com e sem álcool** (preço não vai na rotina).

| Drink | Descrição (literal) | Foto |
| --- | --- | --- |
| Gyul | Saquê, xarope de tangerina, água com gás, hortelã e mel. | `img/gyul.jpg` |
| Shoga | Saquê, xarope de gengibre, água tônica, alecrim, canela e espuma. | `img/shoga.jpg` |
| Aka | Saquê, xarope de cranberry, água com gás, hibisco, cravo e alecrim. | `img/aka.jpg` |
| Sagwa | Saquê, xarope de maçã verde, limão, água com gás e alecrim. | `img/sagwa.jpg` |

- `drinks-quatro-autorais` · educativo — 4 drinks autorais de saquê: tangerina, gengibre, cranberry e maçã verde
- `drinks-com-e-sem-alcool` · produto — todo drink autoral do Dumi tem versão sem álcool
- `drinks-shoga-gengibre` · educativo — Shoga: gengibre, alecrim, canela e espuma num drink de saquê

### 4.5 Experiência (`experiencia`)

- Pedido **só pelo iFood** (link na bio). Salão: `img/ambiente-hero.jpg`,
  `img/restaurante-dentro.jpg`, `img/mesa-guioza.jpg`; fachada `img/faixada-restaurante.jpg`.
- Destaques do perfil (print): CARDÁPIO, Clientes, NOSSOS…, IFood, BASTIDO(res), Localização.

- `experiencia-como-pedir-ifood` · produto — do desejo ao pedido: como achar o Dumi no iFood (link na bio)
- `experiencia-salao` · experiencia — cerejeiras, luz baixa e a mesa posta: como é o salão do Dumi
- `experiencia-hashi` · educativo — hashi em 3 passos (conhecimento geral; sem afirmar que é obrigatório usar)

---

## 5. Pautas institucionais (no máximo 1 por semana)

- `inst-viagem-pela-asia` · educativo — "Uma viagem pela Ásia, prato a prato": o que cada país traz ao cardápio
- `inst-novo-conceito` · educativo — "Novo conceito da Culinária Oriental": oriental não é só japonês
- `inst-mapa-das-origens` · produto — um prato de cada país do cardápio (Japão, China, Tailândia, Indonésia, Vietnã, Mongólia, Malásia)

---

## 6. Quando o banco de uma linha se esgotar

Derive pautas novas **só do conteúdo real** deste arquivo (um prato, um ingrediente
literal, uma técnica que está na descrição, uma origem), cadastre-as na seção da linha com
id novo no mesmo padrão (`<linha>-<tema>`, minúsculas e hífens) e só então use no
`meta.pautaId`. O motor recusa `pautaId` que não esteja cadastrado aqui.

## 7. Pendências que afetam a copy (do briefing)

- [ ] Horário (bio diz ter–sáb 18h–22h; briefing diz a confirmar).
- [ ] Validade da promoção Yakisoba + Nikumanju.
- [ ] Tem sushi? (painel diz que sim, cardápio online não tem) — até lá, proibido.
- [ ] Preços do iFood = preços do cardápio online?
- [ ] Quem aprova os posts do lado do Dumi.
- [ ] Papel e autorização de imagem de Reinaldo M. Kuwahara.
