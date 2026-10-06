# Briefing — Dumi Sabores Orientais

<!--
  ÚNICA fonte de fatos para os agentes de conteúdo. Montado em 03/10/2026 SÓ com o que já existia:
  (a) cardápio online deste projeto (`index.html` + `app.js`), (b) briefing do cliente no painel-conteudo
  (tabela clients, "Restaurante DUMI Sabores Orientais"). Nada aqui foi inventado; o que não existe nas
  fontes está como [a confirmar]. Versão para máquina (usada pelo conferir.mjs): `fatos.json`.
  Fato novo → atualizar AQUI e no fatos.json, com fonte e data.
-->

## Identidade
- **Nome:** Dumi Sabores Orientais (no painel: "Restaurante DUMI Sabores Orientais") — fonte: `index.html`, painel.
- **Instagram:** @dumisaboresorientais — fonte: `index.html`.
- **Endereço:** Av. Waldemar Spranger, 881 - Sala 5 · Jardim São Jorge, Londrina - PR · CEP 86047-285 — fonte: `index.html`.
- **WhatsApp (dúvidas):** wa.me/554396695824 → (43) 9669-5824 — fonte: `index.html`.
  ⚠ O número tem 8 dígitos após o DDD; confirmar com o Dumi se é `(43) 9669-5824` ou `(43) 99669-5824`.
- **Pedido/delivery:** **exclusivo via iFood** — fonte: rodapé do `index.html`. Link: ver `fatos.json → links.ifood`.
- **Horário de funcionamento:** [a confirmar] — não consta no site nem no painel.
- **Frase da marca:** "Uma viagem pela Ásia, prato a prato." — fonte: hero do `index.html`.
- **Origem dos pratos:** Japão, China, Tailândia, Indonésia, Vietnã, Mongólia, Malásia, Coreia e Singapura — fonte: `index.html`.

## Público, tom e objetivo (fonte: briefing do painel-conteudo)
- **Público:** jovens adultos, casais, famílias e amantes de culinária asiática que buscam qualidade, sabor
  autêntico e experiência marcante.
- **Tom:** descontraído, apetitoso, envolvente e moderno — despertar desejo imediato.
- **Busca:** desejo (food porn de qualidade), frescor dos ingredientes, promoções e conveniência do pedido.
- **Diretrizes:** textos curtos, diretos e sensoriais; CTA claro para iFood ou WhatsApp; destacar sabor único
  e rapidez na entrega. Não inventar produtos, preços, estoque ou condições.
- ⚠ **Conflito a resolver:** o briefing do painel cita "sushi", mas **não há sushi no cardápio online**.
  Até o Dumi confirmar, "sushi" fica em `termos_proibidos`.

## Promoção vista no site
- "Peça um Yakisoba e ganhe um Nikumanju de brinde" (link `urlgeni.us/ifood/comboyakisoba`) — fonte: hero do
  `index.html`. **Validade: [a confirmar]** → não publicar sem confirmação do Dumi no pedido.

## Cardápio (fonte: `app.js`, 03/10/2026 — preços do cardápio online; confirmar se iFood usa os mesmos)
### Petiscos Orientais
| Prato | Origem | Preço | Descrição (literal) | Foto |
| --- | --- | --- | --- | --- |
| Murta Bak Ayam | Malásia | R$ 19,00 | Massa especial com recheio de carne, frango, ovo cozido e temperos especiais (01 unid). | `img/murta-bak.jpg` |
| Khuushuur | Mongólia | R$ 23,00 | Massa especial com recheio de carne suína, ovina e temperos especiais (02 unid). | `img/khuushuur.jpg` |
| Satay | Indonésia | R$ 27,00 | Espeto com mignon bovino, mignon suíno, sobrecoxa de frango e temperos especiais (03 unid). | `img/satay.jpg` |
| Guyoza | Japão | R$ 19,00 | Massa cozida e frita com recheio de carne suína e temperos especiais (02 unid). | `img/guyoza.jpg` |
| Nikumanju | Japão | R$ 18,00 | Pão oriental com recheio de carne suína, legumes e temperos especiais (02 unid). | `img/nikumanju.jpg` |
| Ebi Furai | Japão | R$ 60,00 | Camarão empanado à moda tempurá com temperos especiais (porção). | `img/ebi-furai.jpg` |
| Isca de Peixe | Japão | R$ 35,00 | Tiras de salmão empanadas em farinha panko (porção). | `img/isca-de-peixe.jpg` |

### Pratos Individuais
| Prato | Origem | Preço | Descrição (literal) | Foto |
| --- | --- | --- | --- | --- |
| Chow Mein | China | R$ 45,00 | Macarrão, mignon bovino e suíno, sobrecoxa de frango, camarão na manteiga, gengibre e temperos especiais. | `img/chow-mein.jpg` · alta: `CHOW MEIN.jpg` |
| Kho Tauy | Vietnã | R$ 34,00 | Panceta caramelizada, água de coco, anis estrelado, pimenta e temperos especiais. | `img/kho-tauy.jpg` · alta: `KHO TAUY.jpg` |
| Xendeg | Mongólia | R$ 40,00 | Sobrecoxa de frango empanada com camarão e temperos especiais. | `img/xendeg.jpg` |
| Nuer | Tailândia | R$ 40,00 | Mignon bovino, pimentão, pimenta vermelha, castanha de caju moída e temperos especiais. | `img/nuer.jpg` |
| Teppanyaki | Japão | R$ 50,00 | Salmão grelhado acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/teppanyaki.jpg` |
| Camarão à moda Dumi | Japão/Brasil | R$ 60,00 | Camarões grelhados na manteiga acompanhados de um suculento camarão empanado, shitake e shimeji. | `img/camarao-moda-dumi.jpg` |
| Lagosta Oriental | China | R$ 60,00 | Lagostim acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/lagosta-oriental.jpg` |
| Takô Yude | Japão/Brasil | R$ 60,00 | Tentáculo de polvo acompanhado de camarão, shitake, shimeji e temperos especiais. | `img/tako-yude.jpg` |
| Yakisoba | Japão | R$ 38,00 | Macarrão, legumes, verduras e proteínas refogados em um molho espesso à base de shoyu. | `img/yakisoba.jpg` |
| Udon | Japão | R$ 38,00 | Sopa quente com macarrão fresco, ovos, kani e acompanhamentos ricos. | `img/udon.jpg` |

### Sobremesas
| Prato | Origem | Preço | Descrição (literal) |
| --- | --- | --- | --- |
| Dorayaki | Japão | R$ 25,00 | Massa especial recheada de creme com sorvete caseiro. |
| Sorvete Dumi | Brasil | R$ 20,00 | Sorvete caseiro à moda Dumi com calda. Sabores: café c/ brownie, ferrero rocher, flocos, frutas vermelhas e mousse de maracujá. |

### Drinks autorais (base de saquê) — sem álcool R$ 20,00 · com álcool R$ 25,00
| Drink | Descrição (literal) |
| --- | --- |
| Gyul | Saquê, xarope de tangerina, água com gás, hortelã e mel. |
| Shoga | Saquê, xarope de gengibre, água tônica, alecrim, canela e espuma. |
| Aka | Saquê, xarope de cranberry, água com gás, hibisco, cravo e alecrim. |
| Sagwa | Saquê, xarope de maçã verde, limão, água com gás e alecrim. |

### Bebidas
Água sem gás R$ 4,00 · Água com gás R$ 5,00 · Suco de polpa (abacaxi, abacaxi c/ hortelã, frutas vermelhas,
maracujá) R$ 12,00 · Refrigerante lata (Coca-Cola, Guaraná, Tônica) R$ 7,00 · Stella Artois long neck R$ 12,00 ·
Heineken long neck R$ 10,00.

## Material bruto já existente (raiz do projeto)
Vídeos: `HERO CARDAPIO ONLINE (PROMO).mp4`, `PEÇA PELO IFOOD.mp4`, `Vídeo sem Texto.mp4` · fotos de ambiente:
`AMBIENTE RESTAURANTE DUMI.png` (2048×2048), `FAIXADA RESTAURANTE.heic`, `RESTAURANTE DENTRO.heic`,
`FOTO MESA GUIOZA.heic` (versões .jpg em `img/`).

## Pendências com o Dumi
- [ ] Horário de funcionamento.
- [ ] Formato do WhatsApp (8 ou 9 dígitos).
- [ ] Validade da promoção Yakisoba + Nikumanju.
- [ ] Tem sushi? (painel diz que sim, cardápio online não tem).
- [ ] Preços do iFood = preços do cardápio online?
- [ ] Quem aprova os posts do lado do Dumi (nome/contato).
