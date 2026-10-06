# Marca do Dumi — paleta, fontes e logo

<!--
  Fonte: tailwind-config.js e index.html do cardápio online (03/10/2026). Nada inventado.
  Usado pelos templates (ferramentas/render-artes/templates/*.html) e pelos agentes de conteúdo.
  Este arquivo está no .vercelignore (não vai para o site publicado).
-->

## Cores
| Token | Hex | Onde aparece no site | Uso nas peças |
| --- | --- | --- | --- |
| bg | `#121212` | fundo da página | fundo de toda arte |
| surface / surface2 | `#1B1B1B` / `#212121` | cards, rodapé | painéis |
| border | `#2C2C2C` | bordas | fios discretos |
| gold / goldlight | `#D4AF37` / `#E9CD73` | "SABORES ORIENTAIS", kicker | kicker, país, preço, ênfase em itálico |
| red | `#C8102E` | botões, scrollbar, ícone | acentos, ponto ativo |
| CTA iFood | `#E5233F → #9C0C24` (gradiente) | botão "Peça pelo iFood" | botão de pedido |
| texto / textmuted | `#FFFFFF` / `#E5E7EB` | títulos / apoio | títulos / apoio |
Padrão de fundo: ondas douradas a 5 % de opacidade (SVG do `body` do site).

## Fontes
- **Playfair Display** 600/700 (+ itálico 600) — títulos, nome do prato, preço.
- **Inter** 400–700 — kicker (caixa alta, espaçado), texto de apoio, botão.

## Logo
- `img/logo.png` (500×500): círculo preto, "DUMI" branco, flor vermelha, "- SABORES ORIENTAIS -".
  O PNG tem **fundo branco** em volta do círculo → nas artes, usar dentro de um círculo com a imagem
  ampliada 180 % (classe `.logo` dos templates), que recorta o branco.
- Também na raiz: `LOGO.png`, `LOGO VETORIZADA.png` (500×500).

## Voz (resumo do briefing do painel)
Descontraída, apetitosa, moderna. Frases curtas e sensoriais. CTA: iFood (pedido) ou WhatsApp (dúvidas).
