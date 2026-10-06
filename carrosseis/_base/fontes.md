# Biblioteca de fontes dos carrosséis

_Copiada do motor do Instituto Kaizen em 05/10/2026 (mesmos arquivos em `assets/fonts/carrossel/`)._

Todas ficam em `assets/fonts/carrossel/` e têm licença **SIL Open Font License 1.1**
(uso comercial livre, inclusive em imagens; o `OFL.txt` fica junto de cada família).
Origem: repositório oficial `github.com/google/fonts` (pasta `ofl/<família>`).

**Atenção ao resvg:** ele só desenha a instância padrão de fontes **variáveis**. Por isso
a biblioteca usa arquivos **estáticos por peso** (Poppins-Bold.ttf, BarlowCondensed-Medium.ttf…).
Playfair Display e Inter antigos são variáveis, e só renderizam no peso Regular (o estilo
legado simula negrito com contorno). Para uma família nova, baixe os `.ttf` estáticos. Se
o repositório só tiver `[wght].ttf`, gere instâncias com `fonttools varLib.instancer` (exige
Python) ou escolha outra família.

| Família (nome no SVG) | Estilo | Arquivos | Usada em |
| --- | --- | --- | --- |
| `Playfair Display` | serifada didone (variável → só Regular) | `PlayfairDisplay.ttf`, `PlayfairDisplay-Italic.ttf` | legado (dumi-editorial) — são também as fontes do site do Dumi (img/PALETA-DUMI.md) |
| `Inter` | grotesca neutra (variável → só Regular) | `Inter.ttf` | legado (dumi-editorial) — são também as fontes do site do Dumi (img/PALETA-DUMI.md) |
| `Instrument Serif` | serifada display condensada, com itálico elegante | `instrument-serif/` Regular, Italic | livre |
| `Barlow Condensed` | grotesca **condensada** | `barlow-condensed/` Light, Regular, Medium, SemiBold, Bold | livre |
| `Poppins` | grotesca geométrica | `poppins/` Light, Regular, Italic, Medium, SemiBold, Bold | livre |
| `Space Mono` | **mono** editorial/técnica | `space-mono/` Regular, Bold | livre |
| `Bebas Neue` | display condensada, só caixa alta | `bebas-neue/` Regular | 02 Cardápio editorial |
| `DM Serif Display` | serifada display de alto contraste | `dm-serif-display/` Regular, Italic | 01 Noite de ardósia |
| `Archivo Black` | grotesca **pesada** (impacto) | `archivo-black/` Regular | livre |
| `Great Vibes` | **script** caligráfica (usar pouco: uma palavra de destaque) | `great-vibes/` Regular | livre |
| `Lato` | grotesca humanista (corpo muito legível) | `lato/` Light, Regular, Italic, Bold, Black | 01 Noite de ardósia |
| `Fira Sans` | grotesca técnica | `fira-sans/` Light, Regular, Medium, SemiBold, Bold | livre |
| `Spectral` | serifada de leitura, itálico elegante | `spectral/` ExtraLight, Light, LightItalic, Regular, Italic, Medium, SemiBold | 02 Cardápio editorial |

Regras:

- Cada estilo declara as suas famílias em `familias` (caminhos relativos a
  `assets/fonts/carrossel/`); o motor só carrega essas.
- Cada estilo novo deve usar um **par tipográfico diferente** dos 2 estilos anteriores da fila.
- A script (Great Vibes) nunca vai em frase longa nem em corpo de texto.
- Para adicionar uma família: baixar do google/fonts (ou do GitHub do autor, com a licença
  OFL/Apache), salvar em `assets/fonts/carrossel/<familia>/` com o `OFL.txt`, e registrar aqui.
