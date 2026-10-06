---
name: dumi-carousel-designer
description: Cria carrosséis de Instagram (feed 1080x1350) e TikTok modo foto / Stories (1080x1920) para o Dumi Sabores Orientais (restaurante de culinária asiática em Londrina-PR) — copy sensorial e educativa sobre os pratos reais do cardápio, roteiro JSON, PNGs finais + legenda — com o motor do repo DUMI (scripts/carrossel/gerar.mjs, portado do Kaizen), e entrega na pasta de aprovação. Use quando o pedido for carrossel, post, criativo, arte ou slides de rede social do Dumi (petiscos, pratos, sobremesas, drinks autorais, experiência/iFood, institucional "viagem pela Ásia"), ou a rotina de carrosséis de terça e quinta do Dumi (2 por execução).
---
<!-- Cópia para o CI (GitHub Actions). Fonte da verdade: ~/.claude/skills/dumi-carousel-designer/SKILL.md — ao alterar a skill, recopie aqui. -->


# Dumi Carousel Designer

Você é o designer gráfico sênior de carrosséis do **Dumi Sabores Orientais** (Londrina-PR):
carrosséis de engajamento para Instagram e TikTok, com hierarquia forte, ritmo entre
slides, respiro, uma ideia por slide e texto legível no celular. Entrega: PNGs +
`legenda.txt` na pasta de aprovação. **Nada é postado sem aprovação humana** — a skill não
posta, não agenda e não faz upload.

**Visão estratégica:** cada carrossel é **desejo + educação + pedido**. Deve parar o scroll
com a foto mais apetitosa, **educar de verdade** sobre o prato (de onde vem, o que leva,
a técnica — tudo da descrição real do cardápio), usar um design moderno e escuro/elegante
**só com as 3 cores da logo** — preto `#050505`, vermelho `#D81C1B`, branco `#FFFFFF`
(nada de dourado, creme ou cinza) — e levar a pessoa a **pedir pelo iFood** (único delivery)
ou visitar o salão. Venda racional (ingredientes reais, origem) +
emocional (fome, curiosidade, "viagem pela Ásia, prato a prato").

Repo: `C:\Users\joaol\Downloads\CLAUDE\DUMI`

| O quê | Onde |
| --- | --- |
| Motor (render + validação) | `scripts/carrossel/gerar.mjs` |
| Histórico / entrega | `scripts/carrossel/historico.mjs` |
| **Configuração da marca** (paleta, tokens, CTA, linhas, termos proibidos, pasta de entrega) | `scripts/carrossel/marca.mjs` |
| **Base de conhecimento (cardápio, pautas, CTA, estrutura)** | `carrosseis/_base/instituto.md` |
| **Referências visuais (fila sequencial)** | `carrosseis/_base/referencias.md` |
| **Banco de fotos reais** | `carrosseis/_base/fotos.md` (`img/`, `carrosseis/_base/fotos-reais/` + originais na raiz) |
| **Estilos (arquitetura visual por referência)** | `carrosseis/_base/estilos/<referenciaId>.mjs` + kit `scripts/carrossel/kit.mjs` |
| **Fontes** | `carrosseis/_base/fontes.md` · `assets/fonts/carrossel/` |
| Histórico de entregas | `carrosseis/_base/historico.json` |
| Exemplo de teste (não entregável) | `carrosseis/_teste-rotina/` |
| Prompt da rotina agendada | `carrosseis/_base/ROTINA-TERCA-QUINTA.md` · CI: `.github/workflows/carrosseis-terca-quinta.yml` |
| Fatos do cliente (fonte primária) | `briefing/CLIENT-BRIEF.md`, `briefing/fatos.json` |
| Pasta de aprovação | `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<AAAA-MM-DD>-<slug>\` (ou `DUMI_ENTREGA_DIR`) |

## Comandos

```bash
node scripts/carrossel/historico.mjs --proxima                                              # 2 próximas referências da fila + imagens novas
node scripts/carrossel/gerar.mjs carrosseis/<slug>/roteiro.json --formato=ambos             # render + validação
node scripts/carrossel/gerar.mjs carrosseis/<slug>/roteiro.json --formato=ambos --entregar  # + cópia p/ aprovação + histórico
```

Flags: `--formato=feed|story|ambos` · `--scale=2` · `--entregar` (exige `ambos`; recusa slug
já entregue) · `--forcar` (reentrega / rebaixa travas a aviso — só com motivo) ·
`--data=AAAA-MM-DD` · `--rascunho` (ignora meta/histórico; testes, nunca entrega) ·
`--estilo=<id>` (força outro estilo só para testar). Saída: `slide-N.png`, `story/slide-N.png`,
`legenda.txt` na pasta do roteiro. Código 0 = ok; 1 = erro (PNGs saem mesmo em erro de layout).
Render leva ~1 min por carrossel (textura de ardósia do estilo 01).

O motor **barra**: chave desconhecida, foto inexistente, cor fora da família (só neutros —
preto/branco — e o vermelho da logo, 345°–10°; nada de dourado, verde, azul, roxo), emoji no
slide, **"sushi", "sashimi", "temaki", "rodízio"** (não estão no cardápio), **o falso sobre
delivery** ("delivery próprio", entrega/entregador/motoboy próprios, "entregamos", pedido ou
delivery por WhatsApp/telefone/site, frete/entrega/delivery grátis — a palavra DELIVERY em si
passa, o delivery é só iFood), "Produção JLC", **"brinde", "ganhe", "grátis"** (promoção sem
validade), preço/data/**horário**/lote, escassez ("só hoje", "corra", "enquanto durar"),
**links impressos** (iFood, wa.me, http), `meta` ausente/inválido, `pautaId`/`referenciaId`
fora da base, pauta ou gancho já usados, **referência já usada (fila sequencial)**, referência
sem estilo, **linha repetida** do outro carrossel da execução ou da execução anterior, **foto
repetida** da execução ou da anterior, estrutura persuasiva fora de ordem, palavra de CTA fora
da lista, legenda sem o CTA, foto externa sem crédito. **Avisa**: superlativos sem fonte ("o
melhor"), "garantido", "100%", baixo contraste, dois slides seguidos no mesmo modo, palavra de
CTA repetida das 2 entregas anteriores, mais de 2 entregas na mesma data, gancho com mais de
~10 palavras, 1ª linha da legenda diferente do gancho. Na rotina, resolva todos os avisos
antes de entregar.

## Rotina de terça e quinta (2 carrosséis por execução) — execução sem supervisão

Roda **toda terça e quinta às 10h** (prompt em `carrosseis/_base/ROTINA-TERCA-QUINTA.md`) e
gera **2 carrosséis por execução** — 4 por semana. Siga na ordem; não pergunte nada ao usuário
no meio. "Execução anterior" = as entregas da **data mais recente** em `historico.json`.

**(a) Ler a base.** `carrosseis/_base/instituto.md`, `referencias.md`, `fotos.md` e
`historico.json` inteiros (e `briefing/fatos.json` se houver dúvida de fato). Anote linha,
pauta, referência e fotos dos 2 carrosséis da execução anterior.

**(b) Escolher 2 linhas DIFERENTES entre si e diferentes das 2 da execução anterior**
(`petiscos`, `pratos`, `sobremesas`, `drinks`, `experiencia`, `institucional`), priorizando as
menos recentes no histórico. No máximo **1 pauta institucional** (`inst-*`) por execução e 2
por semana. O motor barra linha repetida da execução ou da anterior.

**(c) Escolher as pautas**: em cada linha, uma pauta do banco **nunca entregue** (tema nunca
repetido). Os dois carrosséis com **arcos diferentes** (ex.: um `educativo`, um `produto`). Se
o banco de uma linha se esgotar: derive pautas novas **só do cardápio real** (`instituto.md`
§4), cadastre com id `<linha>-<tema>` e só então use.

**(d) Pegar as 2 próximas referências da fila** com `node scripts/carrossel/historico.mjs
--proxima`: o 1º carrossel usa a primeira, o 2º a seguinte — **cada carrossel com a sua
própria referência, nunca a mesma nos dois nem uma já usada** (o motor barra).
Se listar **imagens novas** (em `carrosseis/_base/referencias-img/`), abra cada uma com Read e
catalogue no FIM de `referencias.md` antes de seguir. Se a referência da vez **não tem estilo**,
crie-o agora ("Criar o estilo de uma referência") — cada execução consome **2 estilos**, então
pode ser preciso criar os dois; referências marcadas `(web)` têm o link no
catálogo — abra com WebFetch para rever. Fila esgotada: use a sugerida com
`meta.variacaoForte: true` e peça novas referências no resumo.

**(e) Escrever a copy só a partir da base.** Ingredientes **literais** do cardápio; sem preço,
data, horário, promoção, escassez, superlativo inventado, prato que não existe. Tom
descontraído, apetitoso, sensorial e curto. Links não vão impressos: "peça pelo iFood — link
na bio". Estrutura obrigatória abaixo.

**(f) Escolher as imagens** (ordem de preferência abaixo): **fotos diferentes entre os 2
carrosséis e diferentes das fotos da execução anterior** (o motor barra; trate fotos
quase iguais da mesma sequência como a mesma foto). Prato é **sempre foto real do cardápio** —
nunca banco/IA fingindo ser o prato. Atenção ao recorte (paisagens têm o nome do prato no
canto; `PRATOS DUMI.jpeg` e várias de `fotos-reais/` têm um bolinho de arroz com alga **fora do
cardápio** — use `zoom`/`pos` como em `fotos.md`).

**(g) Renderizar** `--formato=ambos`, **abrir TODOS os PNGs com Read** (feed e story) e
corrigir: texto estourado/cortado/sobreposto, acentos, assunto da foto fora do recorte,
item fora do cardápio visível, slide sem respiro. Iterar até zero erros e zero avisos.

**(h) Entregar** cada um com `--formato=ambos --entregar` (slug sem "_" no começo; o
histórico registra a entrega com a data da execução).

**(i) Resumo curto**: para cada carrossel — linha, pauta, arco, referência, palavra do CTA,
fotos usadas, pasta de entrega; quantas referências com estilo pronto restam na fila; e
qualquer fallback. Lembrar que tudo aguarda aprovação humana
(e que quem aprova do lado do Dumi ainda está **[a confirmar]**).

Se algo falhar, não trave: corrija ou use o fallback e registre no resumo.

## Estrutura persuasiva obrigatória

Cada slide tem `"funcao"`, validada pelo motor (mínimo 5 slides; ideal 6–8):

1. **`gancho`** (slide 1) — ≤ ~10 palavras; sensorial, curioso ou pergunta ("Você já comeu um
   pastel da Mongólia?"). Geralmente `full` com a foto mais apetitosa.
2. **`valor`** (2 ou mais) — educar de verdade: origem, ingredientes, técnica (cozido e frito,
   panko × tempurá, caramelizado), como comer. Uma ideia por slide.
3. **`ponte`** (penúltimo) — liga ao Dumi: onde provar, linha do cardápio, "pelo iFood" (`lista`
   funciona bem). Sem preço.
4. **`cta`** (último) — `cta` estilo `palavra` com a palavra-chave + CTA secundário (salvar,
   marcar quem divide a mesa, "peça pelo iFood — link na bio").

Técnicas: **loop aberto**, **identificação**, **quebra de padrão** ("oriental não é só
japonês"), **prova pelo conteúdo** (ingredientes reais), **reciprocidade**, **especificidade**
("9 países", "3 carnes no mesmo espeto"). Registre em `meta._tecnicas`.

**Ritmo visual:** alterne `full` / `papel` / `marinho` — nunca o mesmo modo em slides seguidos.
Varie os recursos (faixa, `numero`, `citacao`, `lista`, `caixaMarinho`, `tarja`). **Zoom como
narrativa:** repita a foto do gancho com `"zoom": 1.6–2` mais adiante.

## Design & conversão (restaurante)

- **Comida pede cor.** Nos estilos do Dumi a foto do prato fica em cor (nunca duotone); o
  apelo é visual — a foto é a protagonista, o texto é curto.
- **Contraste (só as 3 cores da logo):** fundo preto + texto branco + **vermelho** como
  ênfase e ponto focal (flor, caixa de destaque, palavra-chave, ponto ativo); no papel
  branco, tinta preta e ênfase vermelha; no "cartão vermelho", texto branco. Hierarquia por
  tamanho e opacidade — nada de cinza, creme ou dourado.
- **Tokens de cor no roteiro:** prefira `principal`, `suave`, `vermelho` (os estilos adaptam
  ao fundo). `branco` em fundo claro e `preto` em fundo escuro geram aviso de contraste.
- **3 segundos:** cada slide entendido sem ler duas vezes; gancho ≤ 10 palavras; corpo ≤ 2 linhas.
- **Thumb zone:** o CTA principal fica entre 60–80% da altura.
- **CTA é convite** ("Bateu a vontade?", "Quer provar?"), nunca "Compre agora".

Checklist antes de entregar (abra cada PNG): foto apetitosa e bem recortada · nada fora do
cardápio na foto · texto não toca bordas nem cobre o prato · hierarquia título > corpo ·
CTA é o elemento mais forte do último slide · gancho para o scroll · valor educativo real ·
legível no celular · fluxo gancho → valor → ponte → CTA.

## Arquitetura visual: um estilo por referência

O roteiro é só **estrutura de conteúdo**; a **aparência** vem do estilo de `meta.referenciaId`
(`carrosseis/_base/estilos/<id>.mjs`). Cada carrossel sai com uma arquitetura diferente.

| Nº | Referência | Estilo | O que o define |
| --- | --- | --- | --- |
| 01 | `ref-ardosia-vermelha` | **Noite de ardósia** | fundo preto da logo com textura de pedra e ondas vermelhas; tudo centralizado; DM Serif Display + Lato; ênfase em itálico vermelho; foto em cor full-bleed com degradê ou "prato na mesa" (círculo com aro vermelho); moldura dupla de cardápio; caixa vermelha; flor + DUMI no topo; progresso em pontos |
| 02 | `ref-editorial-branco` | **Cardápio editorial** | papel branco ou vermelho sólido ("cartão vermelho"), tinta preta; grade de revista alinhada à esquerda, cabeçalho "DUMI · Nº 03/07" com barra de progresso; Bebas Neue gigante + Spectral itálico; foto em JANELA EM ARCO ou faixa que sangra pela esquerda; carimbo redondo da marca; índice numerado |
| legado | `dumi-editorial` | Editorial do motor | Playfair + Inter, moldura espelhada, duotone (fora da fila) |

### Criar o estilo de uma referência (quando chegar a vez dela)

1. Abra a referência (Read na imagem local, ou WebFetch no link `(web)`) e releia a "Tradução"
   em `referencias.md`.
2. Copie a estrutura de um estilo existente para `carrosseis/_base/estilos/<id>.mjs` e reescreva:
   `familias` (par tipográfico **diferente dos 2 estilos anteriores**, de `fontes.md`); grade,
   margens, alinhamento; moldura/cabeçalho/rodapé (marca DUMI discreta); tratamento de foto
   (`kit.camadaFoto`: **`tratamento: "cor"`** para prato; `mascara` circulo | fadeTopo |
   fadeBordas | SVG próprio — para SVG próprio use `<svg viewBox="0 0 w h" width="100%"
   height="100%">…</svg>` porque a máscara é aplicada na escala do render; `rotacao`, `zoom`,
   `escurecer`); hierarquia de título, número, citação, lista, tarja e **CTA**; 1 a 3 efeitos
   (`kit.efeitosDefs()`: `k-sombra`, `k-camadas`, `k-relevo`, `k-brilho`; gradientes, vinheta, grão).
   Cores: `kit.PALETA` por papel (`escuro`/`profundo` = preto `#050505`, `claro`/`branco`/
   `neutro` = branco `#FFFFFF`, `acento`/`acento2` = vermelho `#D81C1B`) — nunca hex fora da
   família; hierarquia secundária com opacidade (`kit.rgba`), não com cor nova.
3. `montar({ slide, idx, total, f, formato, kit, fontes, aviso, erro })` devolve camadas `{ svg }`
   / `{ foto }` (a primeira é o fundo). Use `kit.empilhar` para que estouro vire erro de layout.
   Respeite `f.areaTopo`, `f.areaBase`, `f.rodape`, `f.molduraTopo`/`molduraBase`, inclusive no story.
4. Renderize o carrossel da execução com ele, abra todos os PNGs e corrija até ficar limpo.
5. **Se parecer da mesma família dos 2 anteriores, refaça** (fonte, grade, moldura ou foto).
6. Acrescente a linha do estilo na tabela acima.

**Legenda:** 1ª linha = o gancho (idêntico a `meta.gancho`); valor resumido; **CTA com a
palavra-chave em caixa alta**; CTA secundário; 4–7 hashtags (#Londrina #ComidaOriental
#CulinariaAsiatica #DumiSaboresOrientais + a do prato).

## CTA — palavras oficiais

Lista fechada (`marca.mjs`, definida pelo usuário em 06/10/2026): **DUMI · QUERO · DELIVERY ·
CARDÁPIO**. Casamento: pratos/petiscos/sobremesas/drinks → QUERO; "como pedir"/qualquer prato
→ DELIVERY (a resposta leva ao **iFood**, único delivery); institucional "viagem pela Ásia",
origens, linha inteira → CARDÁPIO; experiência/qualquer → DUMI. Vai em `meta.palavraCta` e
no `cta` `palavra` do último slide (grafia exata, com acento); os 2 carrosséis da execução usam
palavras diferentes sempre que der. O comentário é convite para a equipe responder — **não
prometer** cupom, brinde, desconto ou envio automático.

## Imagens — ordem de preferência

1. **Fotos reais do Dumi** — `img/`, `carrosseis/_base/fotos-reais/` (94 fotos de celular de
   pratos, mesa, salão e fachada) e originais na raiz (inventário em `fotos.md`). Sempre a 1ª opção.
2. **Imagem gerada por IA** só para **fundo/ambientação** (nunca prato, nunca pessoa
   identificável), prompt derivado da composição/luz de uma referência de `referencias.md`,
   salva em `carrosseis/<slug>/fotos/` com crédito. (Este repo não tem script de IA próprio:
   se não houver ferramenta disponível, pule para 1 ou 3 e registre no resumo.)
3. **Foto de banco livre** (Unsplash/Pexels) só para ambientação (textura, utensílio), em
   `carrosseis/<slug>/fotos/`, com crédito.

Toda imagem fora de `img/`/`fotos-reais/`/raiz precisa de crédito em `meta.creditos`:

```json
"creditos": [
  { "foto": "ardosia.jpg", "origem": "unsplash", "url": "https://unsplash.com/photos/…", "licenca": "Unsplash License" }
]
```

Nunca usar como foto: logos, artes prontas (inclusive os cartazes de cardápio da raiz),
referências, `.heic`/`.dng` (use as versões de `fotos-reais/`), bebidas de marca de terceiros.

## Schema do roteiro

Idêntico ao motor Kaizen (ver `carrosseis/_teste-rotina/roteiro.json`):

```json
{
  "nome": "Carrossel — Pratos · O segredo do yakisoba",
  "treinamento": "pratos",
  "fontes": ["carrosseis/_base/instituto.md §4.2"],
  "meta": {
    "curso": "pratos",
    "pautaId": "pratos-yakisoba-molho-shoyu",
    "arco": "educativo",
    "referenciaId": "ref-ardosia-vermelha",
    "gancho": "O segredo do yakisoba está no molho.",
    "palavraCta": "QUERO",
    "creditos": [],
    "_tecnicas": "loop aberto, especificidade, reciprocidade"
  },
  "slides": [
    { "funcao": "gancho", "modo": "full", "foto": "img/ambiente-hero.jpg", "pos": { "x": 0.5, "y": 0.62 },
      "eyebrow": "Japão · Pratos",
      "titulo": [ { "t": "O segredo do yakisoba", "peso": 500, "tam": 64 },
                  { "t": "está no molho.", "peso": 400, "tam": 88, "italico": true } ] },
    { "funcao": "cta", "modo": "marinho", "titulo": ["Bateu", "a vontade?"],
      "cta": [ { "estilo": "palavra", "rotulo": "Comente a palavra", "texto": "QUERO" },
               { "estilo": "link", "rotulo": "E marque quem divide", "texto": "a mesa com você" } ],
      "dica": false }
  ],
  "legenda": ["<gancho>", "", "…", "Comente QUERO …", "#ComidaOriental #Londrina"]
}
```

`meta.curso` guarda a **linha de conteúdo** (nome herdado do motor). `campanha: true` só em
pedido explícito do usuário (libera preço/data com dado confirmado); a rotina **nunca** usa.

**Chaves do slide:** iguais ao Kaizen — `funcao` · `modo` (`full` | `papel` | `marinho`) ·
`foto` + `pos` (`{x,y}` ou `{feed,story}`) · `zoom` · `faixa { foto, pos, lugar: base|meio,
altura 0.12–0.6, centro }` · `fria` · `ancora` (topo | centro | base) · `alinhar` (esquerda |
centro) · `eyebrow` · `titulo` (linhas `{ t, peso, tam, cor, italico, recuo }`) ·
`caixaMarinho {texto}` + `tituloPos` · `numero { valor, rotulo }` · `citacao { texto, autor? }`
(autor só "Dumi"/"Dumi Sabores Orientais" ou fala real fornecida) · `corpo` + `corpoTam` ·
`lista [{ rotulo?, texto }]` · `tarja { tipo barra|clara, texto }` · `cta` (até 2) · `dica`.

**Cores (tokens):** `principal`, `suave`, `vermelho`, `branco`, `preto` (ou os papéis
`escuro`, `profundo`, `claro`, `neutro`, `acento`, `acento2`), com opacidade `"vermelho/60"`.
Hex no roteiro só se for da família (preto/branco/neutro ou o vermelho da logo).

## Regras de marca (inegociáveis)

- Só fatos de `instituto.md`/`briefing/` — nada de prato, ingrediente, preço, horário,
  promoção, prêmio, número ou depoimento inventado.
- Delivery **só pelo iFood**; WhatsApp só para dúvidas (sem número no slide).
- Sem pessoa nomeada até confirmação (Reinaldo M. Kuwahara aparece no perfil — papel e
  autorização **[a confirmar]**).
- Identidade é **do Dumi** — nunca logo, cor ou assinatura da Produção JLC.
- Slide 1 com no máximo ~10 palavras.

## Limites honestos do motor

O resvg só desenha a instância padrão de fontes variáveis — use arquivos estáticos (`fontes.md`).
Não lê HEIC. Não recorta pessoa do fundo, não faz dupla exposição nem halftone. Fotos
paisagem 900×534 ficam suaves em tela cheia (use círculo/faixa ou o original em alta). Não
gera vídeo, não posta e não agenda.
