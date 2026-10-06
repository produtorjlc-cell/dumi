# Banco de fotos para os slides — Dumi

Inventário das imagens do projeto que podem entrar nos slides (modo `full`, `faixa` ou nos
recortes do estilo). **Primeira opção sempre** — o motor dispensa crédito para `img/`,
`carrosseis/_base/fotos-reais/` (fotos reais de celular, convertidas de
`carrosseis/IMAGENS DO DUMI/`) e os originais na raiz do projeto. Só se nenhuma servir: (2) imagem gerada por IA com prompt
derivado de uma referência de `referencias.md`, ou (3) foto livre de direitos
(Unsplash/Pexels) — ambas em `carrosseis/<slug>/fotos/` com crédito em `meta.creditos`.
**Nunca** foto de banco fingindo ser prato do Dumi: prato é sempre foto real do cardápio.

Medidas conferidas em 05/10/2026. Orientação: **P** paisagem · **Q** quadrada · **R** retrato.
Para recorte use `pos: { "x": …, "y": … }` (frações 0–1) apontando o assunto.

> **Atenção às paisagens do cardápio (900×534):** são fotos de cima sobre ardósia com o
> **nome do prato escrito pequeno no canto inferior direito**. Em `full` o motor amplia
> ~2,5× (fica suave e pode mostrar o rótulo): prefira usá-las em **círculo/faixa/cartão** e
> com `pos.x` ≈ 0,45 para tirar o rótulo do recorte. Para tela cheia, use as **retrato**
> ou os originais em alta da raiz (`CHOW MEIN.jpg`, `KHO TAUY.jpg`).

Regras de rotação: no máximo 1 uso da mesma foto por carrossel (exceto como fio condutor
com `zoom`), e **não repetir fotos das 2 entregas anteriores** (o motor avisa).

## Ambiente e marca — `img/`

| Arquivo | Assunto | Or. | Foco `pos` | Uso |
| --- | --- | --- | --- | --- |
| `img/ambiente-hero.jpg` | mesa com yakisoba e nikumanju em 1º plano, salão com painéis de cerejeira, luminárias e o painel DUMI ao fundo, clientes desfocados (original em alta: `AMBIENTE RESTAURANTE DUMI.png`, 2048×2048, raiz). **Uso liberado pelo Dumi** (06/10/2026) como foto do salão | Q 1600 | `{x:0.5,y:0.6}` | gancho `full` de experiência/salão; mesa posta |
| `img/restaurante-dentro.jpg` | mesa de cima: tigelas vermelhas e jogo americano | R 1400×2487 | `{x:0.5,y:0.4}` | `full` story, textura/ritual |
| `img/mesa-guioza.jpg` | mesa de cima com guioza, shoyu, hashi e cardápio DUMI | R 1400×2487 | `{x:0.5,y:0.35}` | `full` de mesa posta (tem logo no cardápio — ok, é da casa) |
| `PRATOS DUMI.jpeg` (raiz) | foto real de celular: nikumanju em 1º plano, yakisoba ao fundo, mesa de madeira. **À esquerda há um bolinho de arroz com alga que NÃO está no cardápio** — recortar fora | R 720×1280 | `{x:0.7,y:0.5}` + **`zoom: 1.7`** (sem zoom o item fora do cardápio aparece; testado 05/10) | `full` autêntico (mesa, foco suave) |
| `img/faixada-restaurante.jpg` | fachada à noite, letreiro DUMI iluminado | R 1400×2487 | `{x:0.5,y:0.45}` | ponte "onde estamos" (sem endereço na rotina) |

## Petiscos — `img/`

| Arquivo | Assunto | Or. | Foco `pos` | Uso |
| --- | --- | --- | --- | --- |
| `img/guyoza.jpg` | 3 guyozas douradas com shoyu em pote vermelho | P 856×752 | `{x:0.42,y:0.5}` | `full`/círculo, crocância |
| `img/nikumanju.jpg` | 2 pães no vapor sobre alface | R 781×936 | `{x:0.5,y:0.5}` | `full`, macio/vapor |
| `img/murta-bak.jpg` | murta bak empanado cortado, recheio aparente | Q 734×786 | `{x:0.5,y:0.45}` | `full`, recheio |
| `img/ebi-furai.jpg` | camarões empanados com molho, de cima | R 900×1200 | `{x:0.5,y:0.55}` | `full`, tempurá |
| `img/isca-de-peixe.jpg` | iscas de salmão em panko em prato octogonal (tem plaquinha "ISCA DE PEIXE" no topo) | R 896×1195 | `{x:0.5,y:0.62}` | `full` (recortar a plaquinha) |
| `img/khuushuur.jpg` | 2 khuushuur em prato branco sobre ardósia, de cima | P | `{x:0.45}` | círculo/faixa |
| `img/satay.jpg` | espetinhos de satay em travessa estreita, muito fundo preto | P | `{x:0.5,y:0.6}` | faixa larga (o prato é pequeno no quadro) |

## Pratos — `img/` (paisagens de cima sobre ardósia, salvo indicação)

| Arquivo | Assunto | Or. | Foco `pos` | Uso |
| --- | --- | --- | --- | --- |
| `img/camarao-moda-dumi.jpg` | camarões grelhados + empanado, shitake, prato octogonal | R 900×1021 | `{x:0.5,y:0.5}` | `full`, mar |
| `img/chow-mein.jpg` · alta `CHOW MEIN.jpg` | chow mein com hashi e molhos | P | `{x:0.45}` | círculo; `full` com o original |
| `img/kho-tauy.jpg` · alta `KHO TAUY.jpg` | panceta caramelizada em prato azul | P | `{x:0.45}` | círculo; `full` com o original |
| `img/yakisoba.jpg` | yakisoba em prato branco, hashi ao lado | P | `{x:0.5}` | círculo vermelho/faixa |
| `img/udon.jpg` | tigela de udon com ovos, de cima | P | `{x:0.42}` | círculo |
| `img/nuer.jpg` | nuer em prato azul | P | `{x:0.48}` | círculo |
| `img/xendeg.jpg` | xendeg em prato branco | P | `{x:0.48}` | círculo |
| `img/teppanyaki.jpg` | salmão grelhado com camarão e folhas | P | `{x:0.5}` | círculo |
| `img/lagosta-oriental.jpg` | lagostim com camarão em prato branco | P | `{x:0.45}` | círculo |
| `img/tako-yude.jpg` | polvo com camarão, shitake e shimeji | P | `{x:0.48}` | círculo |

## Sobremesas e drinks — `img/`

| Arquivo | Assunto | Or. | Foco `pos` | Uso |
| --- | --- | --- | --- | --- |
| `img/dorayaki.jpg` | dorayaki com sorvete em prato rosado | P | `{x:0.5}` | círculo |
| `img/sorvete-dumi.jpg` | sorvete caseiro com calda | P | `{x:0.48}` | círculo |
| `img/gyul.jpg` | drink amarelo com tangerina e hortelã, taça (recorte do cartaz `GYUL.jpg`: tem um **ornamento dourado no canto superior esquerdo** — recortar fora) | R 900×1480 | `{x:0.55,y:0.55}` | `full` com `zoom` ≥ 1.15 |
| `img/aka.jpg` | drink vermelho com cranberry, taça | R 630×886 | `{x:0.5,y:0.45}` | `full` |
| `img/sagwa.jpg` | drink verde-claro com maçã, taça | R 574×970 | `{x:0.5,y:0.5}` | `full` (baixa resolução: preferir faixa/cartão) |
| `img/shoga.jpg` | drink claro com limão e espuma, copo alto | R 485×836 | `{x:0.5,y:0.5}` | cartão (baixa resolução) |

## Fotos reais — `carrosseis/_base/fotos-reais/` (catalogadas em 06/10/2026)

94 JPGs de celular em **retrato 1125–1126×2000** (convertidos de HEIC/DNG/JPG de
`carrosseis/IMAGENS DO DUMI/` — o motor não lê HEIC/DNG; use sempre a versão daqui).
Todas foram abertas e revisadas. Muitas são **sequências quase iguais** do mesmo prato:
use **uma por carrossel** e não repita a mesma sequência na execução seguinte. Prefixo
omitido na tabela: `carrosseis/_base/fotos-reais/`.

> **Itens fora do cardápio nas fotos:** um **bolinho de arroz com alga (tipo onigiri)**
> aparece num pratinho vermelho ou de cerâmica em várias fotos (marcadas com ⚠). Ele **não
> está no cardápio** — recorte-o fora (`pos`/`zoom`) ou não use a foto. Os nomes dos
> pratos das fotos foram **confirmados pelo Dumi** (06/10/2026) — são os da coluna "O que se vê".

| Arquivo(s) | O que se vê | Foco `pos` | Uso |
| --- | --- | --- | --- |
| `dumi-20250924-195327.jpg` | **fachada à noite**: letreiro iluminado "DUMI" com a flor, "SABORES ORIENTAIS", porta de vidro, salão aceso ao fundo, calçada de bloquete | `{x:0.3,y:0.4}` | ponte "onde estamos" (sem endereço na rotina); alternativa real a `img/faixada-restaurante.jpg` |
| `dumi-20250924-200535.jpg` … `-200758.jpg` (21 fotos: 200535, 200544, 200547, 200554, 200556, 200608, 200612, 200615, 200629, 200659, 200708, 200716, 200720, 200726, 200734, 200737, 200740, 200743, 200753, 200755, 200758) | mesa de cima: **2 guiozas** em prato branco com molho escuro em potinho quadrado **vermelho** e alface; ao lado o **cardápio preto com a logo DUMI** e bandeirinhas, hashis embalados e pratinho de cerâmica com bambu (confere com Guyoza, `img/guyoza.jpg`) | prato `{x:0.6,y:0.4}` (200535) · cardápio `{x:0.35,y:0.75}` | `full` guyoza "à mesa"; a logo no cardápio é da casa (ok) |
| `dumi-20250924-201109.jpg`, `-201114.jpg`, `-201124.jpg`, `-201153.jpg`, `-201155.jpg`, `-201157.jpg` | **2 meias-luas empanadas** (panko) em prato branco com acelga/alface; potinhos vermelhos com molho; cardápio DUMI ao fundo em 201109/201114 — **Khuushuur** (02 unid, a mesma meia-lua de `img/khuushuur.jpg`) | `{x:0.5,y:0.5}` | `full` crocância do khuushuur |
| `dumi-20250924-201515.jpg` | **salão real**: teto preto com luminárias redondas de papel e trepadeira, parede branca, vitrine para a rua | `{x:0.5,y:0.4}` | ambiente/experiência |
| `dumi-20250924-201527.jpg` | **parede pintada com galhos de cerejeira**, painel de ripas com "DUMI" e leque, luminárias | `{x:0.5,y:0.45}` | ambiente/experiência |
| `dumi-20250924-201659.jpg`, `-201706.jpg`, `-201710.jpg`, `-201725.jpg`, `-201744.jpg`, `-201754.jpg`, `-201759.jpg`; raiz `20250924_201748.jpg` (3024×4032, ainda não convertido) | **pote de porcelana vermelho e branco** com ideograma, sobre bandeja de bambu; parede vermelha, quadro e plantas desfocados | `{x:0.55,y:0.6}` | detalhe de ambiente (textura vermelha da casa) |
| `dumi-20250924-201827.jpg` | **quadro de beco oriental com lanternas** na parede vermelha do salão | `{x:0.45,y:0.4}` | detalhe de ambiente |
| `dumi-20250924-203616.jpg` … `-203744.jpg` (15 fotos: 203616, 203624, 203627, 203703, 203704, 203713, 203715, 203717, 203720, 203723, 203727, 203729, 203731, 203733, 203744) ⚠ | **tiras de carne bovina** com pimentão verde, cebolinha, cogumelos e castanhas em prato branco; cardápio DUMI ao lado em várias — **Nuer** | `{x:0.55,y:0.45}`; ⚠ onigiri no canto superior esquerdo | `full`/círculo de prato picante |
| `dumi-20250924-204244.jpg` … `-204345.jpg` (14 fotos: 204244, 204251, 204253, 204256, 204304, 204306, 204307, 204311, 204326, 204331, 204333, 204341, 204343, 204345) ⚠ | **prato fundo de cerâmica** com macarrão largo, carnes, cogumelos, cenoura em tiras, cebolinha e castanhas; em 204326–204333 aparece o **porta-sachês de madeira "DUMI"** — **Chow Mein** (macarrão largo, como em `CHOW MEIN.jpg`) | `{x:0.5,y:0.6}`; ⚠ onigiri em pratinho vermelho em várias | `full` de mesa; 204331 tem a marca no porta-sachês |
| `dumi-img-3037.jpg`, `-3038.jpg`, `-3043.jpg`, `-3047.jpg` | **2 guiozas** douradas em prato branco quadrado, molho escuro em potinho preto, alface; 3047 é close (confere com Guyoza) | `{x:0.5,y:0.55}` | `full` guyoza (luz mais limpa que a série 2007xx) |
| `dumi-img-3050.jpg`, `-3052.jpg`, `-3056.jpg` | **3 pães no vapor** em prato branco com alface e tomate; 3056 é close (confere com Nikumanju) | `{x:0.5,y:0.5}` | `full` nikumanju, "macio/vapor" |
| `dumi-img-3090.jpg` | **macarrão salteado** com legumes, gengibre em conserva vermelho e kani em prato octogonal, de cima — **Yakisoba** (mesma travessa da série 9088) | `{x:0.5,y:0.45}` | `full`/círculo |
| `dumi-img-3096.jpg`, `-3098.jpg`, `-3099.jpg`, `-3100.jpg`, `-3101.jpg` ⚠ | **prato do mar** em travessa octogonal: camarões, polvo, salmão, shimeji/shitake, molho escuro e molho de pimenta, gergelim, tomate — **Takô Yude** | `{x:0.55,y:0.55}`; ⚠ onigiris no topo | `full` "pratos do mar" (recortar os onigiris) |
| `dumi-img-9088.jpg`, `-9089.jpg`, `-9090.jpg`, `-9091.jpg`, `-9092.jpg`, `-9106.jpg`, `-9107.jpg`, `-9108.jpg` ⚠ | **macarrão salteado com ovos de codorna**, cogumelos, gengibre vermelho e proteína grelhada em travessa octogonal, sobre bandeja/granito escuro — **Yakisoba**; 9106–9108 com onigiris em 1º plano | `{x:0.5,y:0.45}` (9091 é close) | `full` macarrão; 9106–9108 ⚠ |
| `dumi-img-9093.jpg`, `-9094.jpg`, `-9095.jpg`, `-9096.jpg` ⚠ | **tigela preta de sopa com macarrão**, 2 metades de ovo, carne, cenoura e gergelim, em bandeja; hashi embalado vermelho — **Udon** | `{x:0.45,y:0.35}` (9095 é close) | `full`/círculo sopa quente; ⚠ onigiri embaixo |
| `dumi-img-9099.jpg`, `-9100.jpg` ⚠ | Yakisoba + **2 pães no vapor** (Nikumanju) em pratinho com bambu, de cima | `{x:0.6,y:0.7}` (pães) | combinação de mesa |

## Não usar como foto de slide

- `img/logo.png`, `LOGO.png`, `LOGO VETORIZADA.png` (logo — a marca já está no estilo).
- `img/agua-*.jpg`, `img/refrigerante.jpg`, `img/heineken.jpg`, `img/stella.jpg`,
  `img/suco-frutas.jpg` (bebidas industrializadas/marcas de terceiros; baixa resolução).
- `EXEMPLO HERO*.png`, `EXEMPLO LOGO.png`, `INSTAGRA @…png`, `DELIVERY DUMI.png`,
  `download (1).jpg` e tudo de `carrosseis/_base/referencias-img/` (artes prontas/referências
  — ver `referencias.md`).
- **Cartazes de cardápio** da raiz: `GUIOZA.png`, `CHOW MEIN.png`, `DORAYAKI (2).jpg`,
  `MURTA BAK.png`, `NIKUMANJU.png`, `AKA.png`, `SAGWA.png`, `SHOGA.png` e **`GYUL.jpg`**
  (arte pronta com texto e dourado — ref. 18; para o drink Gyul use `img/gyul.jpg`, recortando
  o ornamento dourado do canto).
- `LOGO.png` (mockup da logo em parede, não é foto).
- `carrosseis/IMAGENS DO DUMI/*` (originais HEIC/DNG — use as versões de `fotos-reais/`).
- `*.heic` (o motor não lê HEIC; as versões `.jpg` estão em `img/`).
- `IMAGM YAKISOBA ILUSTRATIVA PARA CARDAPIO ONLINE.jpg` (ilustrativa — não é foto real do prato).
- Vídeos (`*.mp4`): o motor só faz imagem estática.

## Fotos novas

Fotos reais novas (preparo, salão, equipe com autorização) chegam em `entrada/fotos/` ou
`carrosseis/IMAGENS DO DUMI/`; converta para `.jpg` (retrato, lado maior 2000 px) em
`carrosseis/_base/fotos-reais/` com nome em minúsculas-com-hífen, **abra cada uma** e
acrescente aqui.
