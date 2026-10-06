// Marca — configuração ÚNICA do motor de carrosséis do Dumi Sabores Orientais.
//
// O motor (gerar.mjs, historico.mjs, kit.mjs) é o mesmo do Instituto Kaizen; tudo o
// que é da marca mora aqui: paleta por papel, família de cor aceita, tokens do
// roteiro, linhas de conteúdo, arcos, palavras de CTA, termos proibidos, banco de
// fotos, pastas de referência e pasta de aprovação.
//
// Fontes dos dados: briefing/CLIENT-BRIEF.md, briefing/fatos.json, img/PALETA-DUMI.md.
// Mudou um fato da marca? Atualize lá E aqui.

export const MARCA = {
  nome: "Dumi Sabores Orientais",
  curto: "DUMI",
  moldura: { esquerda: "DUMI", direita: "SABORES ORIENTAIS" },
  /** Estilo embutido do motor (fora da fila de referências). */
  legadoId: "dumi-editorial",
  /** Única atribuição de citação aceita sem aviso. */
  reAutorCitacao: /^Dumi( Sabores Orientais)?$/,
};

/**
 * Paleta por PAPEL — SÓ as 3 cores da logo (definição do usuário, 06/10/2026):
 * preto, vermelho e branco. Hex amostrados com sharp em `LOGO VETORIZADA.png`
 * (= img/logo.png; mediana dos pixels "de núcleo", sem antialias):
 *   preto    #050505  círculo da logo (≈ 78% dos pixels opacos)
 *   vermelho #D81C1B  flor da logo (conferido em `EXEMPLO LOGO.png`: #DF2327)
 *   branco   #FFFFFF  letras "DUMI" / "SABORES ORIENTAIS" (vazadas no PNG vetorizado)
 *
 *  escuro   preto da logo (superfícies, tinta sobre papel)   #050505
 *  profundo preto da logo (fundo)                            #050505
 *  claro    "papel" = branco da logo                         #FFFFFF
 *  branco   títulos                                          #FFFFFF
 *  neutro   apoio = branco (hierarquia por opacidade)        #FFFFFF
 *  acento   vermelho da logo (ênfase, fios, kicker, CTA)     #D81C1B
 *  acento2  vermelho da logo (caixas, cartão vermelho)       #D81C1B
 *
 * Fora da paleta (removidos): creme #F4EFE6 (derivado, não aprovado) e dourado #D4AF37 /
 * vermelho #C8102E (vêm do site, não da logo). Nenhum cinza de apoio foi necessário: o texto
 * secundário usa branco/preto com opacidade dentro dos estilos. Os estilos só misturam com
 * preto/branco puros para sombra, vinheta e grão (neutros, sem matiz novo).
 */
export const PALETA = {
  escuro: "#050505",
  profundo: "#050505",
  claro: "#FFFFFF",
  branco: "#FFFFFF",
  neutro: "#FFFFFF",
  acento: "#D81C1B",
  acento2: "#D81C1B",
};

/** Nomes de cor que o roteiro pode usar (→ papel). Opacidade com "/NN": "vermelho/60". */
export const TOKENS = {
  preto: "profundo",
  branco: "branco",
  vermelho: "acento",
};

/** Matizes aceitos além dos neutros: só o vermelho da logo (345°–360°, 0°–10°). */
export const FAMILIA_MATIZES = [
  [345, 360],
  [0, 10],
];

/** Linhas de conteúdo (campo `meta.curso`, nome mantido do motor Kaizen). */
export const CURSOS = ["petiscos", "pratos", "sobremesas", "drinks", "experiencia", "institucional"];
export const ARCOS = ["educativo", "produto", "experiencia", "depoimento", "campanha"];
/** Lista fechada de palavras-chave para o CTA de comentário (ver instituto.md §3.1). */
export const PALAVRAS_CTA = ["DUMI", "QUERO", "DELIVERY", "CARDÁPIO"];

/** Pasta de aprovação ("Ç"/"Ã" como escapes para não depender do encoding). */
export const DESTINO_PADRAO = "C:\\CAPCUT\\ENVIAR PARA APROVA\u00c7\u00c3O\\DUMI";
export const ENV_ENTREGA = "DUMI_ENTREGA_DIR";

/**
 * Foto "da casa" (dispensa crédito): pasta img/ (versões web do cardápio), os originais
 * na raiz do projeto (ex.: "CHOW MEIN.jpg") e as fotos reais convertidas de
 * carrosseis/IMAGENS DO DUMI/ para carrosseis/_base/fotos-reais/ (JPG, ver fotos.md).
 */
export const fotoDoBanco = (rel) => rel.startsWith("img/") || rel.startsWith("carrosseis/_base/fotos-reais/") || !rel.includes("/");
export const DESCRICAO_BANCO = "img/, carrosseis/_base/fotos-reais/ ou a raiz do projeto";

/** Pastas onde o usuário solta imagens NOVAS de referência (o --proxima lista as não catalogadas). */
export const PASTAS_REFERENCIA = ["carrosseis/_base/referencias-img"];

/* ------------------------------ regras de texto ------------------------------ */
const L = "\\p{L}";
const palavra = (s) => new RegExp(`(^|[^${L}])(${s})(?=$|[^${L}])`, "iu");

export const REGRAS = {
  /** Erro em slide E legenda. */
  proibidos: [
    { re: palavra("sushi|sashimi|temaki|uramaki|hossomaki"), msg: "não está no cardápio (fatos.json) — confirmar com o Dumi antes" },
    { re: palavra("rodízio|rodizio"), msg: "não consta no cardápio" },
    /*
     * Delivery: a palavra DELIVERY é palavra de CTA oficial e passa. O que é FALSO e fica
     * barrado: o delivery do Dumi é EXCLUSIVO via iFood (rodapé do index.html: "Delivery
     * exclusivo via iFood"; CLIENT-BRIEF.md; fatos.json). Logo, nada de entrega própria,
     * entregador/motoboy próprio, pedido de delivery por WhatsApp/telefone/site, nem
     * frete/entrega/delivery grátis.
     */
    { re: /(frete|entrega|delivery)\s+(gr[aá]tis|gratuit[oa]|free)/iu, msg: "sem fonte — o delivery é pelo iFood, com as condições do iFood" },
    { re: /(delivery|entrega)\s+pr[oó]pri[oa]|(nossos?|nossas?)\s+(entregador(es)?|motoboys?)|(entregador(es)?|motoboys?)\s+pr[oó]pri/iu, msg: "o delivery é exclusivo via iFood — não existe entrega própria" },
    { re: palavra("entregamos|a gente entrega|levamos até você|levamos até a sua casa"), msg: "quem entrega é o iFood — diga \"peça pelo iFood\"" },
    { re: /(delivery|pedidos?|pe[cç]a|encomend\w*)\s+(pelo|por|no|via)\s+(whats\s?app|zap|telefone|site|direct)/iu, msg: "pedido/delivery só pelo iFood; WhatsApp é só para dúvidas" },
    { re: /produ[cç][aã]o\s+jlc/iu, msg: "identidade da agência não aparece nas peças do cliente" },
    { re: palavra("brinde|brindes|ganhe|grátis|gratis|de graça"), msg: "promoção sem validade confirmada (fatos.json: publicar=false)" },
  ],
  /** Aviso (revisar). */
  avisos: [
    { re: palavra("melhor|melhores|o mais|a mais"), msg: "superlativo sem fonte — prefira descrever o prato" },
    { re: palavra("garantido|garantida|100%"), msg: "promessa absoluta" },
  ],
  /** Rotina não publica preço, data, horário nem lote (só com meta.campanha: true). */
  dataPreco:
    /R\$\s?\d|\b\d{1,2}\/\d{1,2}(\/\d{2,4})?\b|\b(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b|\blotes?\b|\b20[2-9]\d\b|\b(parcel\w*)\b|à vista|\b\d{1,2}h(\d{2})?\b/iu,
  escassez:
    /((últimas|poucas|limitadas)\s+(vagas|unidades|porções)|só hoje|últimos dias|corra|garanta já|não perca|antes que acabe|enquanto durar)/iu,
  /** Links não vão impressos no slide nem na legenda: "link na bio" / "peça pelo iFood". */
  url: /(https?:\/\/|www\.|ifood\.com|urlgeni\.us|wa\.me)/iu,
  dicaTermos: "descreva o prato com os ingredientes reais do cardápio (instituto.md §4)",
};
