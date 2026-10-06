// Kit compartilhado pelos ESTILOS plugáveis — portado do motor do Instituto Kaizen.
// A marca (paleta por PAPEL, família de cor, tokens do roteiro) vem de ./marca.mjs.
// (carrosseis/_base/estilos/<id>.mjs).
//
// Um estilo é a "arquitetura visual" de uma referência: fontes, grade, moldura,
// tratamento de foto, hierarquia, CTA e efeitos. O roteiro dá só a estrutura do
// conteúdo (funções dos slides e textos). O motor chama, para cada slide:
//
//   estilo.montar({ slide, idx, total, f, formato, kit, roteiro }) → camadas[]
//
// onde cada camada é { svg } (SVG do canvas inteiro, viewBox W×H) ou
// { foto: { arquivo, x, y, w, h, pos, zoom, tratamento, mascara, rotacao } }.
// As camadas são compostas na ordem (a primeira fica no fundo).

import path from "node:path";
import { existsSync } from "node:fs";
import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import { PALETA as PALETA_MARCA, TOKENS, FAMILIA_MATIZES } from "./marca.mjs";

/* ------------------------------ paleta ------------------------------------ */
/**
 * Paleta por PAPEL (igual em todos os projetos): escuro, profundo, claro, branco,
 * neutro, acento, acento2. Os valores são da marca (marca.mjs).
 */
export const PALETA = { ...PALETA_MARCA };

const hexRgb = (hex) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export function rgba(hex, a) {
  const [r, g, b] = hexRgb(hex);
  return `rgba(${r},${g},${b},${+a.toFixed(3)})`;
}
/** Mistura duas cores (0 = a, 1 = b) e devolve hex. */
export function misturarHex(a, b, t) {
  const A = hexRgb(a);
  const B = hexRgb(b);
  return "#" + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, "0")).join("");
}
export const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * Família de cor permitida: neutros (saturação baixa) e os matizes da marca
 * (FAMILIA_MATIZES em marca.mjs). Qualquer outro matiz é barrado.
 */
export function corNaFamilia(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = hexRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d < 0.02) return true;
  const s = d / (1 - Math.abs(2 * l - 1));
  if (s < 0.14) return true;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return FAMILIA_MATIZES.some(([a, b]) => h >= a && h <= b);
}

/** Tokens de cor aceitos no roteiro: nomes da marca (TOKENS) + papéis + principal/suave. */
export const NOMES_COR = [...new Set([...Object.keys(TOKENS), ...Object.keys(PALETA_MARCA), "principal", "suave"])];
export const RE_TOKEN_COR = new RegExp("^(" + NOMES_COR.join("|") + ")(\\/(\\d{1,3}))?$");
/** Nome de token (da marca ou papel) → papel da paleta. */
export const papel = (nome) => TOKENS[nome] ?? nome;
/** Token de cor do roteiro → CSS. Estilos podem sobrescrever `principal`/`suave`. */
export function cor(token, escuro, sobrescreve = {}) {
  if (/^#[0-9a-f]{6}(\/\d{1,3})?$/i.test(token)) {
    const [h, op] = token.split("/");
    return op ? rgba(h, Number(op) / 100) : h;
  }
  const m = RE_TOKEN_COR.exec(token);
  if (!m) return escuro ? PALETA.branco : PALETA.escuro;
  const nome = papel(m[1]);
  // Adaptação: o roteiro é escrito pensando num fundo; se o estilo inverte o
  // fundo, cores claras em fundo claro (e escuras em fundo escuro) viram
  // principal/suave para não sumir.
  const adapt = { true: { escuro: "principal", profundo: "principal" }, false: { claro: "principal", branco: "principal", neutro: "suave" } }[escuro];
  const alvo = adapt[nome] ?? nome;
  const op = m[3] !== undefined ? Number(m[3]) / 100 : 1;
  let hex;
  let base = 1;
  if (alvo === "principal") hex = sobrescreve.principal?.[escuro ? 1 : 0] ?? (escuro ? PALETA.claro : PALETA.escuro);
  else if (alvo === "suave") {
    hex = sobrescreve.suave?.[escuro ? 1 : 0] ?? (escuro ? PALETA.neutro : PALETA.escuro);
    base = sobrescreve.suave ? 1 : escuro ? 1 : 0.58;
  } else hex = PALETA[alvo];
  const a = op * base;
  return a >= 1 ? hex : rgba(hex, a);
}

/* ------------------------------ fontes ------------------------------------ */
/**
 * Registro de famílias: { "Poppins": ["poppins/Poppins-Bold.ttf", …] } relativo a
 * assets/fonts/carrossel/. A medição usa só os arquivos da família (rápido).
 */
export function criarFontes(raiz, familias) {
  const base = path.join(raiz, "assets", "fonts", "carrossel");
  const mapa = {};
  for (const [fam, arqs] of Object.entries(familias)) {
    mapa[fam] = arqs.map((a) => path.join(base, a));
    for (const a of mapa[fam]) if (!existsSync(a)) throw new Error(`fonte ausente para "${fam}": ${a}`);
  }
  const todas = [...new Set(Object.values(mapa).flat())];
  const cache = new Map();
  function medir(texto, { fam, tam, it = false, ls = 0, peso = 400 }) {
    const t = String(texto).trim();
    if (!t) return 0;
    const k = `${fam}|${tam}|${it}|${ls}|${peso}|${t}`;
    if (!cache.has(k)) {
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(t.length * tam * 1.3 + 200)}" height="${Math.ceil(tam * 2.4)}">` +
        `<text x="50" y="${tam * 1.6}" font-family="${fam}" font-weight="${peso}" font-size="${tam}" ` +
        `font-style="${it ? "italic" : "normal"}" letter-spacing="${ls}">${esc(t)}</text></svg>`;
      const b = new Resvg(svg, { font: { fontFiles: mapa[fam] ?? todas, loadSystemFonts: false } }).getBBox();
      cache.set(k, b ? b.width : 0);
    }
    return cache.get(k);
  }
  function quebrar(texto, est, largura) {
    const linhas = [];
    for (const par of String(texto).split("\n")) {
      let atual = "";
      for (const p of par.split(/\s+/).filter(Boolean)) {
        const teste = atual ? `${atual} ${p}` : p;
        if (atual && medir(teste, est) > largura) {
          linhas.push(atual);
          atual = p;
        } else atual = teste;
      }
      if (atual) linhas.push(atual);
    }
    return linhas;
  }
  return { arquivos: todas, medir, quebrar };
}

/** <text> genérico. `a` = start|middle|end. `extra` = atributos crus (filter, transform…). */
export function T(x, y, texto, { fam, peso = 400, tam = 24, c = PALETA.escuro, a = "start", ls = 0, it = false, extra = "" } = {}) {
  return (
    `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a}" font-family="${fam}" font-weight="${peso}" ` +
    `font-size="${tam}" fill="${c}" letter-spacing="${ls}" font-style="${it ? "italic" : "normal"}" ${extra}>${esc(texto)}</text>`
  );
}

/** Tipografia extrudada (falso 3D): camadas deslocadas atrás da face. */
export function extrusao(x, y, texto, est, { passos = 8, dx = 2, dy = 2, lado = PALETA.escuro } = {}) {
  let g = "";
  for (let i = passos; i >= 1; i--) g += T(x + dx * i, y + dy * i, texto, { ...est, c: lado });
  return g + T(x, y, texto, est);
}

/* ------------------------------ efeitos ----------------------------------- */
/**
 * Filtros prontos (ids fixos, prefixo k-). Inclua `efeitosDefs()` dentro de <defs>.
 *  k-sombra      sombra única suave (para fundo claro)
 *  k-camadas     sombra em duas camadas (profundidade)
 *  k-relevo      alto relevo neumórfico: luz clara em cima/esquerda, sombra embaixo/direita
 *  k-brilho      halo claro (texto/objeto "aceso" em fundo escuro)
 *  k-especular   relevo por feSpecularLighting (sutil no resvg)
 */
export function efeitosDefs(sombra = PALETA.profundo) {
  return `
  <filter id="k-sombra" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="${sombra}" flood-opacity="0.28"/></filter>
  <filter id="k-camadas" x="-30%" y="-30%" width="160%" height="170%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dy="3" result="a"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="20"/><feOffset dy="24" result="b"/>
    <feFlood flood-color="${sombra}" flood-opacity="0.22"/><feComposite in2="a" operator="in" result="a2"/>
    <feFlood flood-color="${sombra}" flood-opacity="0.30"/><feComposite in2="b" operator="in" result="b2"/>
    <feMerge><feMergeNode in="b2"/><feMergeNode in="a2"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="k-relevo" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="10"/><feOffset dx="-10" dy="-10" result="l"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dx="12" dy="14" result="d"/>
    <feFlood flood-color="#FFFFFF" flood-opacity="0.95"/><feComposite in2="l" operator="in" result="l2"/>
    <feFlood flood-color="${sombra}" flood-opacity="0.26"/><feComposite in2="d" operator="in" result="d2"/>
    <feMerge><feMergeNode in="d2"/><feMergeNode in="l2"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="k-relevo-p" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dx="-4" dy="-4" result="l"/>
    <feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dx="5" dy="6" result="d"/>
    <feFlood flood-color="#FFFFFF" flood-opacity="0.95"/><feComposite in2="l" operator="in" result="l2"/>
    <feFlood flood-color="${sombra}" flood-opacity="0.28"/><feComposite in2="d" operator="in" result="d2"/>
    <feMerge><feMergeNode in="d2"/><feMergeNode in="l2"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="k-brilho" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="g"/>
    <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="k-especular" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b"/>
    <feSpecularLighting in="b" surfaceScale="6" specularConstant="0.9" specularExponent="22" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting>
    <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
    <feComposite in="SourceGraphic" in2="s2" operator="arithmetic" k1="0" k2="1" k3="0.8" k4="0"/>
  </filter>`;
}

/* ------------------------------ layout ------------------------------------ */
/**
 * Empilha blocos { tipo, h, desenhar(y) } numa região. `gap(a, b)` define o
 * espaço entre tipos. Estouro vai para `erro(msg)` (vira erro de layout).
 */
export function empilhar(blocos, topo, base, ancora, { gap = () => 40, erro, rotulo = "" } = {}) {
  if (!blocos.length) return { svg: "", pos: {}, h: 0 };
  let h = 0;
  blocos.forEach((b, k) => (h += b.h + (k ? gap(blocos[k - 1].tipo, b.tipo) : 0)));
  const disp = base - topo;
  if (h > disp + 1)
    erro?.(`${rotulo}: o conteúdo precisa de ${Math.round(h)}px, mas a área tem ${Math.round(disp)}px — encurte o texto ou reduza tamanhos`);
  let y = ancora === "topo" ? topo : ancora === "base" ? base - h : topo + (disp - h) / 2;
  if (y < topo) y = topo;
  let svg = "";
  const pos = {};
  blocos.forEach((b, k) => {
    if (k) y += gap(blocos[k - 1].tipo, b.tipo);
    pos[b.tipo] ??= { topo: y, base: y + b.h };
    svg += b.desenhar(y);
    y += b.h;
  });
  return { svg, pos, h };
}

/**
 * Bloco de título a partir das linhas do roteiro. `tipo(ln)` devolve o estilo
 * tipográfico de cada linha ({ fam, peso, tam, it, c, ls }); `lh` = entrelinha.
 * Linhas largas demais são reduzidas (aviso).
 */
export function blocoTitulo(linhas, { medir, largura, x, a = "start", tipo, lh = 1.1, aviso, nome = "titulo", extra = "" }) {
  const ls = linhas.map((ln) => {
    const e = { ...tipo(ln) };
    const w = medir(ln.t, e);
    if (w > largura) {
      const novo = Math.floor((e.tam * largura) / w) - 1;
      aviso?.(`linha "${ln.t}" reduzida de ${e.tam}px para ${novo}px para caber`);
      e.tam = novo;
    }
    return { t: ln.t, e };
  });
  const bases = [];
  let y = ls[0].e.tam * 0.8;
  ls.forEach((l, k) => {
    bases.push(y);
    if (ls[k + 1]) y += Math.max(l.e.tam, ls[k + 1].e.tam) * lh * 0.55 + ls[k + 1].e.tam * lh * 0.45;
  });
  const h = y + ls.at(-1).e.tam * 0.28;
  return {
    tipo: nome,
    h,
    desenhar: (y0) => ls.map((l, k) => T(x, y0 + bases[k], l.t, { ...l.e, a, extra })).join(""),
  };
}

/** Bloco de parágrafo com quebra automática. */
export function blocoTexto(texto, { quebrar, largura, x, a = "start", est, lh = 1.45, nome = "corpo", extra = "" }) {
  const linhas = quebrar(texto, est, largura);
  const passo = Math.round(est.tam * lh);
  return {
    tipo: nome,
    h: (linhas.length - 1) * passo + est.tam * 1.05,
    linhas,
    desenhar: (y) => linhas.map((l, k) => T(x, y + est.tam * 0.8 + k * passo, l, { ...est, a, extra })).join(""),
  };
}

/* ------------------------------ fotos ------------------------------------- */
const SOMBRA_DUO = hexRgb(misturarHex(PALETA.profundo, PALETA.escuro, 0.55));
const LUZ_DUO = hexRgb(misturarHex(PALETA.escuro, PALETA.claro, 0.8));
const RGB_PROFUNDO = hexRgb(PALETA.profundo);

/** Recorte "cover" com ponto focal e zoom (zoom > 1 aproxima; narrativa de zoom). */
async function recorte(arquivo, w, h, pos = "attention", zoom = 1) {
  const m = await sharp(arquivo).metadata();
  if (typeof pos === "string" && zoom === 1) return sharp(arquivo).resize(w, h, { fit: "cover", position: pos });
  const foco = typeof pos === "object" ? pos : { x: 0.5, y: 0.5 };
  const k = Math.max(w / m.width, h / m.height) * zoom;
  const rw = Math.max(w, Math.round(m.width * k));
  const rh = Math.max(h, Math.round(m.height * k));
  const left = Math.min(rw - w, Math.max(0, Math.round((foco.x ?? 0.5) * rw - w / 2)));
  const top = Math.min(rh - h, Math.max(0, Math.round((foco.y ?? 0.5) * rh - h / 2)));
  const buf = await sharp(arquivo).resize(rw, rh, { fit: "fill" }).extract({ left, top, width: w, height: h }).toBuffer();
  return sharp(buf);
}

/**
 * Tratamentos: "duotone" (escuro da marca → claro), "pb" (preto e branco com contraste),
 * "tinta" (monocromático claro na cor da marca, para fundos claros; "azul" = alias legado),
 * "quente" (P&B aquecido pelo acento), "noite" (P&B escurecido na cor profunda
 * escuro), "cor" (original).
 */
async function tratar(img, tratamento) {
  if (tratamento === "cor") return img.png().toBuffer();
  const { data, info } = await img.greyscale().linear(1.12, -8).raw().toBuffer({ resolveWithObject: true });
  if (tratamento === "pb") {
    return sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer();
  }
  const mapas = {
    duotone: [SOMBRA_DUO, LUZ_DUO],
    tinta: [hexRgb(misturarHex(PALETA.escuro, PALETA.acento, 0.15)), hexRgb(misturarHex(PALETA.claro, "#FFFFFF", 0.4))],
    azul: [hexRgb(misturarHex(PALETA.escuro, PALETA.acento, 0.15)), hexRgb(misturarHex(PALETA.claro, "#FFFFFF", 0.4))],
    quente: [hexRgb(misturarHex(PALETA.profundo, "#000000", 0.3)), hexRgb(misturarHex(PALETA.claro, PALETA.acento, 0.18))],
    noite: [hexRgb(misturarHex(PALETA.profundo, "#000000", 0.4)), hexRgb(misturarHex(PALETA.neutro, PALETA.claro, 0.35))],
  };
  const [S, L] = mapas[tratamento] ?? mapas.duotone;
  const n = info.width * info.height;
  const out = Buffer.alloc(n * 3);
  for (let i = 0; i < n; i++) {
    const t = data[i * info.channels] / 255;
    for (let c = 0; c < 3; c++) out[i * 3 + c] = S[c] + (L[c] - S[c]) * t;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
}

async function mascarar(buf, w, h, mascara) {
  if (!mascara) return buf;
  let svg;
  if (mascara === "circulo") svg = `<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) / 2}" fill="#fff"/>`;
  else if (mascara === "fadeTopo")
    svg = `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.16" stop-color="#fff"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#m)"/>`;
  else if (mascara === "fadeBordas")
    svg = `<defs><radialGradient id="m" cx="50%" cy="50%" r="60%"><stop offset="0.6" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#m)"/>`;
  else if (mascara.startsWith("<")) svg = mascara;
  else return buf;
  const m = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${svg}</svg>`)).png().toBuffer();
  return sharp(buf).ensureAlpha().composite([{ input: m, blend: "dest-in" }]).png().toBuffer();
}

/**
 * Renderiza uma camada de foto já na escala final. Coordenadas em px do slide.
 * Devolve { input, left, top } para o composite do sharp.
 */
export async function camadaFoto(foto, escala) {
  const w = Math.max(2, Math.round(foto.w * escala));
  const h = Math.max(2, Math.round(foto.h * escala));
  let buf = await tratar(await recorte(foto.arquivo, w, h, foto.pos, foto.zoom ?? 1), foto.tratamento ?? "duotone");
  if (foto.escurecer) {
    const v = await sharp({ create: { width: w, height: h, channels: 4, background: { r: RGB_PROFUNDO[0], g: RGB_PROFUNDO[1], b: RGB_PROFUNDO[2], alpha: foto.escurecer } } }).png().toBuffer();
    buf = await sharp(buf).composite([{ input: v, blend: "over" }]).png().toBuffer();
  }
  buf = await mascarar(buf, w, h, foto.mascara);
  const left = Math.round(foto.x * escala);
  const top = Math.round(foto.y * escala);
  if (foto.rotacao) {
    // girar via SVG (<image> + rotate) para alinhar exatamente com cartões/molduras
    // desenhados pelo estilo com o mesmo transform. `centroRotacao` = pivô (px do slide).
    const cr = foto.centroRotacao ?? { x: foto.x + foto.w / 2, y: foto.y + foto.h / 2 };
    const Wc = Math.round(foto.canvasW * escala);
    const Hc = Math.round(foto.canvasH * escala);
    const href = `data:image/png;base64,${buf.toString("base64")}`;
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${Wc}" height="${Hc}">` +
      `<image x="${left}" y="${top}" width="${w}" height="${h}" preserveAspectRatio="none" xlink:href="${href}" ` +
      `transform="rotate(${foto.rotacao} ${cr.x * escala} ${cr.y * escala})"/></svg>`;
    return { input: new Resvg(svg).render().asPng(), left: 0, top: 0 };
  }
  return { input: buf, left, top };
}
