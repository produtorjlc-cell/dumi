// Motor de carrosséis (Instagram / TikTok) — portado do motor do Instituto Princípio
// Kaizen Londrina. Tudo o que é da marca (paleta, regras de texto, CTA, pastas) vem de
// ./marca.mjs; este arquivo é igual em todos os projetos.
//
// Data-driven: lê um roteiro JSON e gera `slide-N.png` + `legenda.txt` na MESMA
// pasta do roteiro. É o port genérico do gerador one-off do "Resgate da Criança
// Interior" (scripts/gerar-slides-carrossel.mjs): modos `full` / `papel` /
// `marinho`, faixa de foto em duotone, tarjas, caixa marinho, caixa de CTA,
// palavra-eco, moldura espelhada, cantoneiras, contador, dots e grão.
//
// O roteiro NÃO carrega coordenadas: o motor mede o texto com as fontes reais
// (via resvg), quebra linhas de corpo/tarjas automaticamente e empilha os blocos
// por âncora (topo / centro / base) dentro de áreas seguras calculadas para cada
// formato — o mesmo roteiro renderiza em feed (1080x1350) e story (1080x1920).
//
// Uso:
//   node scripts/carrossel/gerar.mjs carrosseis/<slug>/roteiro.json [--formato=feed|story|ambos] [--scale=2]
//   npm run carrossel -- carrosseis/<slug>/roteiro.json --formato=ambos
//
// Saída: feed → <pasta>/slide-N.png · story → <pasta>/story/slide-N.png ·
//        legenda → <pasta>/legenda.txt. Código de saída 0 (ok) ou 1 (erro).

import { mkdir, writeFile, readFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";

import { lerBase, lerHistorico, lerFila, checarMeta, entregar, dataLocal } from "./historico.mjs";
import * as kit from "./kit.mjs";
import { MARCA, REGRAS } from "./marca.mjs";
import { pathToFileURL } from "node:url";

const kitCor = kit.cor;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(__dirname, "..", "..");

/* -------------------------------------------------------------------------- *
 * Marca — paleta por PAPEL (valores em marca.mjs)
 * -------------------------------------------------------------------------- */
const PALETA = kit.PALETA;
const RGB_PROFUNDO = (() => {
  const n = Number.parseInt(PALETA.profundo.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
})();
const SERIF = "Playfair Display";
const SANS = "Inter";
const FONTES = [
  "assets/fonts/carrossel/PlayfairDisplay.ttf",
  "assets/fonts/carrossel/PlayfairDisplay-Italic.ttf",
  "assets/fonts/carrossel/Inter.ttf",
].map((p) => path.resolve(RAIZ, p));

const MOLDURA_PADRAO = MARCA.moldura;

/**
 * Geometria por formato. Tudo em px do canvas final (antes do --scale).
 * `areaTopo`/`areaBase` delimitam onde o conteúdo pode ficar; no story elas
 * fogem da barra de progresso/perfil (topo) e da legenda/botões do TikTok e
 * Stories (base). `mxd` é a margem direita do texto (maior no story por causa
 * da coluna de ícones do TikTok).
 */
const FORMATOS = {
  feed: {
    W: 1080, H: 1350, mx: 90, mxd: 90,
    molduraTopo: 72, fioTopo: 96, fioBase: 1350 - 96, molduraBase: 1350 - 64,
    rodape: 1350 - 172, areaTopo: 180, areaBase: 1350 - 226,
    corpoTam: 31,
  },
  story: {
    W: 1080, H: 1920, mx: 90, mxd: 120,
    molduraTopo: 206, fioTopo: 230, fioBase: 1920 - 300, molduraBase: 1920 - 268,
    rodape: 1920 - 384, areaTopo: 316, areaBase: 1920 - 440,
    corpoTam: 33,
  },
};

const MODOS = ["full", "papel", "marinho"];
const POSICOES = [
  "attention", "entropy", "centre", "center", "top", "bottom", "left", "right",
  "north", "south", "east", "west", "northeast", "northwest", "southeast", "southwest",
];
const ANCORAS = ["topo", "centro", "base"];

/* -------------------------------------------------------------------------- *
 * Cores
 * -------------------------------------------------------------------------- */
function rgba(hex, a) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${+a.toFixed(3)})`;
}
function misturar(hexA, hexB, t) {
  const a = Number.parseInt(hexA.slice(1), 16);
  const b = Number.parseInt(hexB.slice(1), 16);
  const c = (s) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return { r: c(16), g: c(8), b: c(0) };
}
/** Token de cor → CSS. `principal`/`suave` dependem do fundo (escuro/claro). */
function cor(token, escuro) {
  return kitCor(token, escuro, { principal: [PALETA.escuro, PALETA.branco] });
}

/* -------------------------------------------------------------------------- *
 * Texto: medição real (resvg) + SVG
 * -------------------------------------------------------------------------- */
const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/**
 * O Playfair/Inter em assets/ são fontes variáveis e o resvg desenha só a
 * instância padrão (Regular). Para os pesos altos o motor aplica um "negrito
 * simulado": contorno da mesma cor proporcional ao tamanho.
 */
const engrossar = (peso, tam) => (Math.max(0, peso - 500) / 400) * 0.026 * tam;

const cacheMedida = new Map();
/** Largura visível (px) de uma linha, medida com as fontes reais. */
function medir(texto, { fam = SANS, tam = 24, it = false, ls = 0, peso = 400 } = {}) {
  const t = String(texto).trim();
  if (!t) return 0;
  const k = `${fam}|${tam}|${it ? 1 : 0}|${ls}|${t}`;
  if (!cacheMedida.has(k)) {
    const w = Math.ceil(t.length * tam * 1.3 + 200);
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.ceil(tam * 2.2)}">` +
      `<text x="50" y="${tam * 1.5}" font-family="${fam}" font-size="${tam}" ` +
      `font-style="${it ? "italic" : "normal"}" letter-spacing="${ls}">${esc(t)}</text></svg>`;
    const b = new Resvg(svg, {
      font: { fontFiles: FONTES, loadSystemFonts: false, defaultFontFamily: SERIF },
    }).getBBox();
    cacheMedida.set(k, b ? b.width : 0);
  }
  return cacheMedida.get(k) + engrossar(peso, tam);
}

/** Quebra gulosa por palavras, respeitando a largura máxima. */
function quebrar(texto, estilo, largura) {
  const linhas = [];
  for (const paragrafo of String(texto).split("\n")) {
    let atual = "";
    for (const p of paragrafo.split(/\s+/).filter(Boolean)) {
      const teste = atual ? `${atual} ${p}` : p;
      if (atual && medir(teste, estilo) > largura) {
        linhas.push(atual);
        atual = p;
      } else atual = teste;
    }
    if (atual) linhas.push(atual);
  }
  return linhas;
}

function T(x, y, s, o = {}) {
  const { fam = SANS, peso = 400, tam = 24, c = PALETA.profundo, a = "start", ls = 0, it = false } = o;
  const sw = engrossar(peso, tam);
  const contorno = sw > 0.25 ? ` stroke="${c}" stroke-width="${sw.toFixed(2)}" stroke-linejoin="round"` : "";
  return (
    `<text x="${x}" y="${y.toFixed(1)}" text-anchor="${a}" font-family="${fam}" font-size="${tam}" ` +
    `fill="${c}" letter-spacing="${ls}" font-style="${it ? "italic" : "normal"}"${contorno}>` +
    `${esc(s)}</text>`
  );
}

const canto = (x, y, dx, dy, c) =>
  `<path d="M ${x} ${y + dy} L ${x} ${y} L ${x + dx} ${y}" fill="none" stroke="${c}" stroke-width="2"/>`;

/* -------------------------------------------------------------------------- *
 * Blocos de conteúdo. Cada um devolve { tipo, h, desenhar(yTopo) → svg }.
 * -------------------------------------------------------------------------- */
function blocoEyebrow(texto, ctx) {
  const c = ctx.escuro ? PALETA.branco : PALETA.escuro;
  const sub = ctx.escuro ? PALETA.claro : PALETA.escuro;
  const s = texto.toUpperCase();
  const est = { tam: 21, ls: 3, peso: 600 };
  if (medir(s, est) > ctx.larguraTexto) ctx.aviso(`eyebrow "${texto}" é mais largo que a área`);
  const centro = ctx.alinhar === "centro";
  const x = centro ? ctx.W / 2 : ctx.mx;
  return {
    tipo: "eyebrow",
    h: 38,
    desenhar: (y) => {
      const base = y + 16;
      const x1 = centro ? ctx.W / 2 - 60 : ctx.mx;
      return (
        T(x, base, s, { ...est, c, a: centro ? "middle" : "start" }) +
        `<line x1="${x1}" y1="${base + 16}" x2="${x1 + 120}" y2="${base + 16}" stroke="${sub}" stroke-width="2"/>`
      );
    },
  };
}

function blocoTitulo(linhas, ctx, tipo = "titulo") {
  const centro = ctx.alinhar === "centro";
  const ls = linhas.map((ln) => {
    let tam = ln.tam;
    const max = ctx.larguraTexto - (centro ? 0 : ln.recuo);
    const est = { fam: SERIF, tam, it: ln.italico, peso: ln.peso };
    const w = medir(ln.t, est);
    if (w > max) {
      const novo = Math.floor((tam * max) / w) - 1;
      ctx.aviso(`linha de título "${ln.t}" não cabe em ${tam}px — reduzida para ${novo}px`);
      tam = novo;
    }
    return { ...ln, tam };
  });
  const bases = [];
  let y = ls[0].tam * 0.82;
  ls.forEach((ln, k) => {
    bases.push(y);
    const prox = ls[k + 1];
    if (prox) y += ln.tam * 0.52 + prox.tam * 0.78 + 6;
  });
  const h = y + ls.at(-1).tam * 0.28;
  return {
    tipo,
    h,
    desenhar: (y0) =>
      ls
        .map((ln, k) =>
          T(centro ? ctx.W / 2 : ctx.mx + ln.recuo, y0 + bases[k], ln.t, {
            fam: SERIF,
            peso: ln.peso,
            tam: ln.tam,
            c: cor(ln.cor, ctx.escuro),
            it: ln.italico,
            a: centro ? "middle" : "start",
          }),
        )
        .join(""),
  };
}

function blocoCaixaMarinho(caixa, ctx) {
  const largura = ctx.W - ctx.mx - ctx.mxd;
  let tam = caixa.tam ?? 62;
  const w = medir(caixa.texto, { fam: SERIF, tam, peso: 900 });
  if (w > largura - 60) tam = Math.floor((tam * (largura - 60)) / w);
  const h = Math.round(tam * 1.74);
  const fundo = ctx.modo === "marinho" ? PALETA.profundo : PALETA.escuro;
  return {
    tipo: "caixaMarinho",
    h,
    desenhar: (y) =>
      `<rect x="${ctx.mx}" y="${y}" width="${largura}" height="${h}" fill="${fundo}"/>` +
      T(ctx.mx + largura / 2, y + h / 2 + tam * 0.3, caixa.texto, {
        fam: SERIF, peso: 900, tam, c: PALETA.branco, a: "middle",
      }),
  };
}

function blocoCorpo(texto, ctx, tamanho) {
  const tam = tamanho ?? ctx.corpoTam;
  const est = { tam, peso: 400 };
  const linhas = quebrar(texto, est, ctx.larguraTexto);
  const lh = Math.round(tam * 1.45);
  const centro = ctx.alinhar === "centro";
  const c = ctx.escuro ? rgba(PALETA.claro, 0.92) : rgba(PALETA.profundo, 0.86);
  return {
    tipo: "corpo",
    h: (linhas.length - 1) * lh + tam * 1.05,
    desenhar: (y) =>
      linhas
        .map((l, k) =>
          T(centro ? ctx.W / 2 : ctx.mx, y + tam * 0.8 + k * lh, l, {
            ...est, c, a: centro ? "middle" : "start",
          }),
        )
        .join(""),
  };
}

function blocoLista(itens, ctx) {
  const largura = ctx.W - ctx.mx - ctx.mxd;
  const estRot = { tam: 17, ls: 3, peso: 600 };
  const estTx = { fam: SERIF, tam: ctx.formato === "story" ? 42 : 38, peso: 500 };
  const lh = Math.round(estTx.tam * 1.26);
  const linhaCor = ctx.escuro ? rgba(PALETA.branco, 0.28) : rgba(PALETA.escuro, 0.2);
  const rotCor = ctx.escuro ? PALETA.neutro : rgba(PALETA.escuro, 0.62);
  const txCor = ctx.escuro ? PALETA.branco : PALETA.escuro;
  const linhas = itens.map((it) => ({ ...it, tx: quebrar(it.texto, estTx, largura) }));
  const alturas = linhas.map((it) => 22 + (it.rotulo ? 30 : 0) + estTx.tam * 0.8 + (it.tx.length - 1) * lh + estTx.tam * 0.3 + 22);
  return {
    tipo: "lista",
    h: alturas.reduce((a, b) => a + b, 0),
    desenhar: (y0) => {
      let y = y0;
      let out = "";
      linhas.forEach((it, k) => {
        out += `<line x1="${ctx.mx}" y1="${y}" x2="${ctx.mx + largura}" y2="${y}" stroke="${linhaCor}" stroke-width="1.4"/>`;
        let b = y + 22;
        if (it.rotulo) {
          b += 16;
          out += T(ctx.mx, b, it.rotulo.toUpperCase(), { ...estRot, c: rotCor });
          b += 14;
        }
        b += estTx.tam * 0.8;
        it.tx.forEach((l, j) => (out += T(ctx.mx, b + j * lh, l, { ...estTx, c: txCor })));
        y += alturas[k];
      });
      out += `<line x1="${ctx.mx}" y1="${y}" x2="${ctx.mx + largura}" y2="${y}" stroke="${linhaCor}" stroke-width="1.4"/>`;
      return out;
    },
  };
}

function blocoTarja(tarja, ctx) {
  const largura = ctx.W - ctx.mx - ctx.mxd;
  const barra = tarja.tipo === "barra";
  const est = barra ? { tam: tarja.tam ?? 36, peso: 500 } : { tam: tarja.tam ?? 30, peso: 500 };
  const interna = barra ? largura - 42 - 40 : largura - 80;
  const fonte = Array.isArray(tarja.texto) ? tarja.texto : [tarja.texto];
  const linhas = fonte.flatMap((t) => quebrar(t, est, interna));
  const lh = Math.round(est.tam * (barra ? 1.55 : 1.6));
  const pad = barra ? 32 : 30;
  const primeira = pad + est.tam * 0.76;
  const h = Math.round(primeira + (linhas.length - 1) * lh + est.tam * 0.24 + pad);
  return {
    tipo: "tarja",
    h,
    desenhar: (y) => {
      let g = "";
      if (barra) {
        g += `<rect x="${ctx.mx}" y="${y}" width="${largura}" height="${h}" fill="${PALETA.branco}"${
          ctx.escuro ? "" : ` stroke="${rgba(PALETA.escuro, 0.1)}" stroke-width="1.2"`
        }/>`;
        g += `<rect x="${ctx.mx}" y="${y}" width="11" height="${h}" fill="${PALETA.escuro}"/>`;
        linhas.forEach((l, k) => (g += T(ctx.mx + 42, y + primeira + k * lh, l, { ...est, c: PALETA.profundo })));
      } else {
        g += `<rect x="${ctx.mx}" y="${y}" width="${largura}" height="${h}" fill="${PALETA.branco}" opacity="0.94"/>`;
        linhas.forEach(
          (l, k) =>
            (g += T(ctx.mx + largura / 2, y + primeira + k * lh, l, { ...est, c: PALETA.profundo, a: "middle" })),
        );
      }
      return g;
    },
  };
}

function blocoCta(cta, ctx) {
  const largura = ctx.W - ctx.mx - ctx.mxd;
  // "palavra" = caixa cheia (destaque principal); "link" = caixa vazada com fio
  const palavra = cta.estilo === "palavra";
  const h = palavra ? 150 : 136;
  const claroCheio = ctx.escuro;
  let caixa, rotCor, txCor;
  if (palavra) {
    caixa = `fill="${claroCheio ? PALETA.claro : PALETA.escuro}"`;
    rotCor = claroCheio ? rgba(PALETA.escuro, 0.72) : PALETA.neutro;
    txCor = claroCheio ? PALETA.profundo : PALETA.branco;
  } else {
    caixa = `fill="none" stroke="${claroCheio ? rgba(PALETA.claro, 0.7) : rgba(PALETA.escuro, 0.55)}" stroke-width="2"`;
    rotCor = claroCheio ? PALETA.neutro : rgba(PALETA.escuro, 0.62);
    txCor = claroCheio ? PALETA.branco : PALETA.escuro;
  }
  const texto = palavra ? `“${cta.texto}”` : cta.texto;
  const est = palavra ? { fam: SERIF, tam: 54, peso: 900 } : { tam: 34, peso: 700 };
  const w = medir(texto, est);
  if (w > largura - 60) est.tam = Math.floor((est.tam * (largura - 60)) / w);
  return {
    tipo: "cta",
    h,
    desenhar: (y) =>
      `<rect x="${ctx.mx + 1}" y="${y + 1}" width="${largura - 2}" height="${h - 2}" ${caixa}/>` +
      T(ctx.mx + largura / 2, y + 50, cta.rotulo.toUpperCase(), { tam: 21, peso: 700, ls: 3, c: rotCor, a: "middle" }) +
      T(ctx.mx + largura / 2, y + (palavra ? 114 : 98), texto, { ...est, c: txCor, a: "middle" }),
  };
}

/**
 * Índice gigante ("01", "02"…) para carrossel de dicas/passos. Playfair itálico
 * (numerais oldstyle — a fonte não expõe `lnum` no resvg), vazado por padrão.
 * `rotulo` opcional ao lado, em caixa alta.
 */
function blocoNumero(num, ctx) {
  const tam = num.tam ?? (ctx.formato === "story" ? 290 : 250);
  const centro = ctx.alinhar === "centro";
  const c = ctx.escuro ? PALETA.claro : PALETA.escuro;
  const est = { fam: SERIF, tam, it: true, peso: 400 };
  const w = medir(num.valor, est);
  const base = tam * 0.76;
  const h = tam * 1.02;
  const rotC = ctx.escuro ? PALETA.neutro : rgba(PALETA.escuro, 0.62);
  return {
    tipo: "numero",
    h,
    desenhar: (y) => {
      const x = centro ? ctx.W / 2 : ctx.mx;
      const tinta =
        num.estilo === "cheio"
          ? `fill="${c}"`
          : `fill="none" stroke="${c}" stroke-width="${(tam / 95).toFixed(2)}" stroke-linejoin="round"`;
      let g =
        `<text x="${x}" y="${(y + base).toFixed(1)}" text-anchor="${centro ? "middle" : "start"}" ` +
        `font-family="${SERIF}" font-size="${tam}" font-style="italic" ${tinta}>${esc(num.valor)}</text>`;
      if (num.rotulo) {
        const ry = y + base - tam * 0.1;
        if (centro) g += T(ctx.W / 2, y + h + 4, num.rotulo.toUpperCase(), { tam: 19, peso: 600, ls: 3.4, c: rotC, a: "middle" });
        else {
          const rx = ctx.mx + w + 36;
          g += `<line x1="${rx}" y1="${(ry - 34).toFixed(1)}" x2="${rx + 64}" y2="${(ry - 34).toFixed(1)}" stroke="${rotC}" stroke-width="2"/>`;
          g += T(rx, ry, num.rotulo.toUpperCase(), { tam: 19, peso: 600, ls: 3.4, c: rotC });
        }
      }
      return g;
    },
    hExtra: centro && num.rotulo ? 24 : 0,
  };
}

/** Citação em destaque: aspas gigantes + texto em itálico + autor opcional. */
function blocoCitacao(cit, ctx) {
  const centro = ctx.alinhar === "centro";
  const gTam = 220;
  const tam = cit.tam ?? (ctx.formato === "story" ? 50 : 46);
  const est = { fam: SERIF, tam, it: true, peso: 500 };
  const linhas = quebrar(cit.texto, est, ctx.larguraTexto);
  const lh = Math.round(tam * 1.32);
  const aspasC = ctx.escuro ? rgba(PALETA.neutro, 0.9) : rgba(PALETA.escuro, 0.35);
  const txC = ctx.escuro ? PALETA.branco : PALETA.escuro;
  const autC = ctx.escuro ? PALETA.neutro : rgba(PALETA.escuro, 0.62);
  const primeira = gTam * 0.34 + 18 + tam * 0.8;
  const ultima = primeira + (linhas.length - 1) * lh;
  const autorBase = ultima + tam * 0.3 + 44;
  const h = cit.autor ? autorBase + 8 : ultima + tam * 0.3;
  return {
    tipo: "citacao",
    h,
    desenhar: (y) => {
      const x = centro ? ctx.W / 2 : ctx.mx;
      const a = centro ? "middle" : "start";
      let g = `<text x="${centro ? x : x - 8}" y="${(y + gTam * 0.72).toFixed(1)}" text-anchor="${a}" font-family="${SERIF}" font-size="${gTam}" font-style="italic" fill="${aspasC}">“</text>`;
      linhas.forEach((l, k) => (g += T(x, y + primeira + k * lh, l, { ...est, c: txC, a })));
      if (cit.autor) g += T(x, y + autorBase, `— ${cit.autor.toUpperCase()}`, { tam: 18, peso: 600, ls: 3, c: autC, a });
      return g;
    },
  };
}

function gapEntre(a, b) {
  if (a === "numero") return 30;
  if (a === "caixaMarinho" || b === "caixaMarinho") return 26;
  if (a === "cta" && b === "cta") return 18;
  if (a === "titulo" && b === "corpo") return 34;
  return 42;
}

/** Empilha blocos numa região [topo, base] conforme a âncora. */
function empilhar(blocos, topo, base, ancora, ctx, rotulo) {
  if (!blocos.length) return { svg: "", pos: {} };
  let h = 0;
  blocos.forEach((b, k) => (h += b.h + (k ? gapEntre(blocos[k - 1].tipo, b.tipo) : 0)));
  const disp = base - topo;
  if (h > disp + 1) {
    ctx.erro(
      `${rotulo}: o conteúdo precisa de ${Math.round(h)}px, mas a área tem ${Math.round(disp)}px ` +
        `(excede ${Math.round(h - disp)}px) — encurte o texto, reduza tamanhos ou a altura da faixa`,
    );
  }
  let y = ancora === "topo" ? topo : ancora === "base" ? base - h : topo + (disp - h) / 2;
  if (ancora !== "topo" && y < topo) y = topo;
  let svg = "";
  const pos = {};
  blocos.forEach((b, k) => {
    if (k) y += gapEntre(blocos[k - 1].tipo, b.tipo);
    pos[b.tipo] ??= { topo: y, base: y + b.h };
    svg += b.desenhar(y);
    y += b.h;
  });
  return { svg, pos };
}

/* -------------------------------------------------------------------------- *
 * Montagem de um slide (SVG transparente onde entram foto/faixa)
 * -------------------------------------------------------------------------- */
function geometriaFaixa(s, f) {
  if (!s.faixa) return null;
  const { lugar, altura, centro } = s.faixa;
  const h = Math.round(altura * f.H);
  if (lugar === "meio") {
    const c = f.areaTopo + (f.areaBase - f.areaTopo) * centro;
    const topo = Math.round(c - h / 2);
    return { topo, base: topo + h, h, lugar };
  }
  const base = f.rodape - 44;
  return { topo: base - h, base, h, lugar };
}

function montarSVG(s, idx, total, f, moldura, ctxBase) {
  const escuro = s.modo !== "papel";
  const ctx = {
    ...f,
    ...ctxBase,
    escuro,
    modo: s.modo,
    alinhar: s.alinhar,
    larguraTexto: s.alinhar === "centro" ? f.W - 2 * f.mxd : f.W - f.mx - f.mxd,
  };
  const faixa = geometriaFaixa(s, f);
  let g = "";

  if (s.modo === "full") {
    g += `<rect width="${f.W}" height="${f.H}" fill="${PALETA.profundo}" opacity="0.2"/>`;
    g += `<rect width="${f.W}" height="${f.H}" fill="url(#vGrad)"/>`;
  }

  // Regiões de texto
  const eyebrow = s.eyebrow ? blocoEyebrow(s.eyebrow, ctx) : null;
  let topo = f.areaTopo;
  if (eyebrow) topo += eyebrow.h + 44;
  let baseCabeca = f.areaBase;
  let peTopo = null;
  if (faixa?.lugar === "base") baseCabeca = faixa.topo + faixa.h * 0.08;
  if (faixa?.lugar === "meio") {
    baseCabeca = faixa.topo + faixa.h * 0.06;
    peTopo = faixa.base + 34;
  }

  const cabeca = [];
  const pe = [];
  if (s.numero) {
    const n = blocoNumero(s.numero, ctx);
    cabeca.push({ ...n, h: n.h + n.hExtra });
  }
  if (s.titulo.length) cabeca.push(blocoTitulo(s.titulo, ctx));
  if (s.caixaMarinho) cabeca.push(blocoCaixaMarinho(s.caixaMarinho, ctx));
  if (s.tituloPos?.length) cabeca.push(blocoTitulo(s.tituloPos, ctx, "tituloPos"));
  if (s.citacao) cabeca.push(blocoCitacao(s.citacao, ctx));
  if (s.corpo) cabeca.push(blocoCorpo(s.corpo, ctx, s.corpoTam));
  if (s.lista?.length) cabeca.push(blocoLista(s.lista, ctx));
  if (s.tarja) pe.push(blocoTarja(s.tarja, ctx));
  for (const c of s.cta) pe.push(blocoCta(c, ctx));

  const rotulo = `slide ${idx + 1} (${ctx.formato})`;
  let pos;
  let svgTexto = "";
  // palavra-eco: centralizada na região principal, atrás do texto
  if (s.eco) {
    const meioY = (topo + baseCabeca) / 2;
    let tam = 220;
    const w = medir(s.eco, { fam: SERIF, tam, peso: 900 });
    if (w > f.W - 60) tam = Math.floor((tam * (f.W - 60)) / w);
    g += T(f.W / 2, meioY + tam * 0.36, s.eco, {
      fam: SERIF, peso: 900, tam,
      c: escuro ? rgba(PALETA.branco, 0.045) : rgba(PALETA.escuro, 0.045),
      a: "middle",
    });
  }
  if (peTopo !== null) {
    const a = empilhar(cabeca, topo, baseCabeca, s.ancora, ctx, `${rotulo}, acima da faixa`);
    const b = empilhar(pe, peTopo, f.areaBase, "centro", ctx, `${rotulo}, abaixo da faixa`);
    svgTexto = a.svg + b.svg;
    pos = a.pos;
  } else {
    const a = empilhar([...cabeca, ...pe], topo, baseCabeca, s.ancora, ctx, rotulo);
    svgTexto = a.svg;
    pos = a.pos;
  }
  if (eyebrow) {
    // eyebrow fixo no topo da área; em âncora "topo" o título vem logo abaixo
    g += eyebrow.desenhar(f.areaTopo);
  }
  g += svgTexto;

  // cantoneiras em torno do título
  if (pos.titulo) {
    const cc = escuro ? rgba(PALETA.claro, 0.5) : rgba(PALETA.escuro, 0.4);
    g += canto(f.mx - 36, Math.round(pos.titulo.topo - 10), 24, 24, cc);
    g += canto(f.W - f.mxd + 30, Math.round((pos.tituloPos ?? pos.titulo).base + 10), -24, -24, cc);
  }

  // rodapé: contador + dica + dots
  const fc = escuro ? PALETA.neutro : PALETA.profundo;
  const pad = (n) => String(n).padStart(2, "0");
  g += T(f.mx, f.rodape, `${pad(idx + 1)} / ${pad(total)}`, { peso: 600, tam: 19, c: fc, ls: 2 });
  if (s.dica) g += T(f.W - f.mx, f.rodape, s.dica.toUpperCase(), { peso: 600, tam: 21, c: fc, a: "end", ls: 2 });
  const gap = 26;
  const x0 = f.W / 2 - ((total - 1) * gap) / 2;
  const on = escuro ? PALETA.claro : PALETA.escuro;
  const off = escuro ? rgba(PALETA.branco, 0.32) : rgba(PALETA.profundo, 0.2);
  for (let k = 0; k < total; k++)
    g += `<circle cx="${x0 + k * gap}" cy="${f.rodape - 6}" r="${k === idx ? 5 : 3.2}" fill="${k === idx ? on : off}"/>`;

  // moldura espelhada topo/rodapé
  const mc = escuro ? PALETA.branco : PALETA.profundo;
  const fio = escuro ? rgba(PALETA.branco, 0.3) : rgba(PALETA.profundo, 0.22);
  const mo = { peso: 600, tam: 19, c: mc, ls: 3.4 };
  g += T(f.mx, f.molduraTopo, moldura.esquerda, mo) + T(f.W - f.mx, f.molduraTopo, moldura.direita, { ...mo, a: "end" });
  g += `<line x1="${f.mx}" y1="${f.fioTopo}" x2="${f.W - f.mx}" y2="${f.fioTopo}" stroke="${fio}" stroke-width="1.4"/>`;
  g += `<line x1="${f.mx}" y1="${f.fioBase}" x2="${f.W - f.mx}" y2="${f.fioBase}" stroke="${fio}" stroke-width="1.4"/>`;
  g += T(f.mx, f.molduraBase, moldura.esquerda, mo) + T(f.W - f.mx, f.molduraBase, moldura.direita, { ...mo, a: "end" });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f.W}" height="${f.H}" viewBox="0 0 ${f.W} ${f.H}">
  <defs>
    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${PALETA.profundo}" stop-opacity="0.6"/>
      <stop offset="0.36" stop-color="${PALETA.profundo}" stop-opacity="0.12"/>
      <stop offset="0.62" stop-color="${PALETA.profundo}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${PALETA.profundo}" stop-opacity="0.9"/>
    </linearGradient>
  </defs>
  ${g}
</svg>`;
  return { svg, faixa };
}

/**
 * Grão de papel/filme (feTurbulence). É a parte mais cara do render, então é
 * rasterizado uma vez por formato/opacidade e reaproveitado em todos os slides.
 */
const cacheGrao = new Map();
function grao(f, scale, opacidade) {
  const k = `${f.W}x${f.H}@${scale}|${opacidade}`;
  if (!cacheGrao.has(k)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f.W}" height="${f.H}" viewBox="0 0 ${f.W} ${f.H}">
  <defs><filter id="grao" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="2" seed="11" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
  </filter></defs>
  <rect width="${f.W}" height="${f.H}" filter="url(#grao)" opacity="${opacidade}"/>
</svg>`;
    cacheGrao.set(
      k,
      new Resvg(svg, { fitTo: { mode: "zoom", value: scale }, background: "rgba(0,0,0,0)" }).render().asPng(),
    );
  }
  return cacheGrao.get(k);
}

/* -------------------------------------------------------------------------- *
 * Fotos → duotone escuro da marca / claro
 * -------------------------------------------------------------------------- */
/**
 * Mapa de gradiente de verdade: preto da foto → sombra, branco → luz. As duas
 * pontas são derivadas só por opacidade da paleta: sombra = escuro a 55%
 * sobre profundo; luz = claro a 80% sobre escuro.
 */
/** PNG intermediário sem compressão (só vive em memória). */
const RAPIDO = { compressionLevel: 0 };
const SOMBRA = misturar(PALETA.profundo, PALETA.escuro, 0.55);
const LUZ = misturar(PALETA.escuro, PALETA.claro, 0.8);

/** Recorte "cover": gravidade do sharp (string) ou ponto focal { x, y } em frações 0–1. */
async function recortar(foto, pos, w, h) {
  if (typeof pos === "string") return sharp(foto).resize(w, h, { fit: "cover", position: pos });
  const m = await sharp(foto).metadata();
  const k = Math.max(w / m.width, h / m.height);
  const rw = Math.max(w, Math.round(m.width * k));
  const rh = Math.max(h, Math.round(m.height * k));
  const left = Math.min(rw - w, Math.max(0, Math.round((pos.x ?? 0.5) * rw - w / 2)));
  const top = Math.min(rh - h, Math.max(0, Math.round((pos.y ?? 0.5) * rh - h / 2)));
  const buf = await sharp(foto).resize(rw, rh, { fit: "fill" }).extract({ left, top, width: w, height: h }).toBuffer();
  return sharp(buf);
}

async function duotone(foto, position, w, h) {
  const { data, info } = await (await recortar(foto, position, w, h))
    .greyscale()
    .linear(1.12, -8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const out = Buffer.alloc(n * 3);
  const d = [LUZ.r - SOMBRA.r, LUZ.g - SOMBRA.g, LUZ.b - SOMBRA.b];
  for (let i = 0; i < n; i++) {
    const t = data[i * info.channels] / 255;
    out[i * 3] = SOMBRA.r + d[0] * t;
    out[i * 3 + 1] = SOMBRA.g + d[1] * t;
    out[i * 3 + 2] = SOMBRA.b + d[2] * t;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).png(RAPIDO).toBuffer();
}

/** Máscara de alpha: fade no topo (e opcionalmente na base) da faixa. */
async function mascaraFade(w, h, topo, base) {
  const stops = [
    `<stop offset="0" stop-color="#fff" stop-opacity="0"/>`,
    `<stop offset="${topo.toFixed(3)}" stop-color="#fff" stop-opacity="1"/>`,
  ];
  if (base) {
    stops.push(`<stop offset="${(1 - base).toFixed(3)}" stop-color="#fff" stop-opacity="1"/>`);
    stops.push(`<stop offset="1" stop-color="#fff" stop-opacity="0"/>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1">${stops.join("")}</linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#m)"/></svg>`;
  return sharp(Buffer.from(svg)).png(RAPIDO).toBuffer();
}

/** `pos` pode ser gravidade, ponto focal {x,y} ou { feed: …, story: … }. */
const porFormato = (pos) => pos && typeof pos === "object" && ("feed" in pos || "story" in pos);
const posPara = (pos, formato) => (porFormato(pos) ? pos[formato] ?? "attention" : pos);

function validarPos(pos, onde, erros) {
  const um = (p) => {
    if (typeof p === "string") {
      if (!POSICOES.includes(p)) erros.push(`${onde}: pos "${p}" inválida (use ${POSICOES.join(", ")} ou { "x": 0.3, "y": 0.5 })`);
    } else if (p && typeof p === "object") {
      for (const e of ["x", "y"])
        if (p[e] !== undefined && (typeof p[e] !== "number" || p[e] < 0 || p[e] > 1))
          erros.push(`${onde}: pos.${e} deve ser fração entre 0 e 1`);
    } else erros.push(`${onde}: pos inválida`);
  };
  if (pos === undefined) return;
  if (porFormato(pos)) Object.values(pos).forEach(um);
  else um(pos);
}

async function renderSlide(s, idx, total, f, moldura, scale, ctxBase) {
  const { svg, faixa } = montarSVG(s, idx, total, f, moldura, ctxBase);
  const r = new Resvg(svg, {
    fitTo: { mode: "zoom", value: scale },
    font: { fontFiles: FONTES, loadSystemFonts: false, defaultFontFamily: SERIF },
    background: "rgba(0,0,0,0)",
  }).render();
  const w = r.width;
  const h = r.height;
  const k = h / f.H;

  let base;
  if (s.modo === "full") {
    base = sharp(await duotone(s.fotoAbs, posPara(s.pos, ctxBase.formato), w, h));
  } else {
    const fundo =
      s.modo === "marinho"
        ? PALETA.escuro
        : s.fria
          ? misturar(PALETA.claro, PALETA.neutro, 0.26)
          : PALETA.claro;
    base = sharp({ create: { width: w, height: h, channels: 3, background: fundo } });
  }

  const camadas = [];
  if (faixa) {
    const top = Math.round(faixa.topo * k);
    const bh = Math.round(faixa.h * k);
    let buf = await duotone(s.faixa.fotoAbs, posPara(s.faixa.pos, ctxBase.formato), w, bh);
    const veu = s.faixa.veu ?? s.modo === "marinho";
    if (veu) {
      const v = await sharp({
        create: { width: w, height: bh, channels: 4, background: { ...RGB_PROFUNDO, alpha: 0.45 } },
      })
        .png(RAPIDO)
        .toBuffer();
      buf = await sharp(buf).composite([{ input: v, blend: "over" }]).png(RAPIDO).toBuffer();
    }
    buf = await sharp(buf)
      .ensureAlpha()
      .composite([{ input: await mascaraFade(w, bh, 0.14, faixa.lugar === "meio" ? 0.12 : 0), blend: "dest-in" }])
      .png(RAPIDO)
      .toBuffer();
    camadas.push({ input: buf, left: 0, top });
  }
  camadas.push({ input: r.asPng(), blend: "over" });
  camadas.push({ input: grao(f, scale, s.modo === "papel" ? 0.07 : 0.09), blend: "over" });

  const cheio = await base.composite(camadas).png(RAPIDO).toBuffer();
  return sharp(cheio).resize(f.W, f.H, { fit: "fill" }).png({ compressionLevel: 8 }).toBuffer();
}

/* -------------------------------------------------------------------------- *
 * Validação do roteiro
 * -------------------------------------------------------------------------- */
const CHAVES_ROTEIRO = ["nome", "treinamento", "fontes", "moldura", "legenda", "slides", "meta"];
const CHAVES_SLIDE = [
  "modo", "foto", "pos", "ancora", "alinhar", "eyebrow", "titulo", "caixaMarinho", "tituloPos",
  "corpo", "corpoTam", "lista", "tarja", "cta", "linkBox", "eco", "faixa", "fria", "dica", "nota",
  "numero", "citacao", "funcao", "zoom",
];

/**
 * Regras de conteúdo da rotina (sem valor, data, horário e escassez; links não vão
 * impressos). Só um roteiro com `meta.campanha: true` (pedido explícito) passa.
 * Os padrões são da marca: REGRAS em marca.mjs.
 */
const RE_DATA_PRECO = REGRAS.dataPreco;
const RE_ESCASSEZ = REGRAS.escassez;
const RE_URL_VENDAS = REGRAS.url;

const CHAVES_LINHA = ["t", "peso", "tam", "cor", "italico", "recuo"];
const CHAVES_FAIXA = ["foto", "pos", "lugar", "altura", "centro", "veu"];

const RE_EMOJI = /\p{Extended_Pictographic}/u;
/** Termos proibidos (erro) e de revisão (aviso) da marca — valem em slide e legenda. */
function termosDaMarca(t, onde, erros, avisos) {
  for (const r of REGRAS.proibidos) {
    const m = r.re.exec(t);
    if (m) erros.push(`${onde}: "${(m[2] ?? m[0]).trim()}" é proibido — ${r.msg} (em "${t}")`);
  }
  for (const r of REGRAS.avisos) {
    const m = r.re.exec(t);
    if (m) avisos.push(`${onde}: "${(m[2] ?? m[0]).trim()}" — ${r.msg} (em "${t}")`);
  }
}

function resolverFoto(rel, dirRoteiro, onde, erros) {
  if (typeof rel !== "string" || !rel.trim()) {
    erros.push(`${onde}: "foto" deve ser um caminho (string)`);
    return null;
  }
  const cands = path.isAbsolute(rel) ? [rel] : [path.resolve(RAIZ, rel), path.resolve(dirRoteiro, rel)];
  const achou = cands.find((c) => existsSync(c));
  if (!achou) erros.push(`${onde}: foto não encontrada "${rel}" (procurado em: ${cands.join(" | ")})`);
  return achou ?? null;
}

/** Token da marca ou hex de um matiz da marca/neutro (derivados liberados; matizes estranhos não). */
function corValida(c) {
  if (kit.RE_TOKEN_COR.test(c)) return true;
  const m = /^(#[0-9a-f]{6})(\/\d{1,3})?$/i.exec(c);
  return !!m && kit.corNaFamilia(m[1]);
}

function normalizarLinhas(v, onde, erros, avisos, escuro) {
  if (v === undefined) return [];
  if (!Array.isArray(v)) {
    erros.push(`${onde}: deve ser uma lista de linhas`);
    return [];
  }
  return v.map((ln, k) => {
    const o = typeof ln === "string" ? { t: ln } : ln;
    const at = `${onde}[${k}]`;
    if (!o || typeof o.t !== "string" || !o.t.trim()) {
      erros.push(`${at}: cada linha precisa de "t" (texto)`);
      return { t: "", peso: 700, tam: 72, cor: "principal", italico: false, recuo: 0 };
    }
    for (const c of Object.keys(o)) if (!CHAVES_LINHA.includes(c)) erros.push(`${at}: chave desconhecida "${c}"`);
    const cr = o.cor ?? "principal";
    if (!corValida(cr)) erros.push(`${at}: cor "${cr}" fora da família da marca (tokens ${kit.NOMES_COR.join(", ")} com "/NN" opcional, ou hex de um matiz da marca/neutro)`);
    const pp = kit.papel(String(cr).split("/")[0]);
    if (!escuro && ["branco", "claro", "neutro"].includes(pp)) avisos.push(`${at}: cor "${cr}" tem baixo contraste sobre papel`);
    if (escuro && ["escuro", "profundo"].includes(pp)) avisos.push(`${at}: cor "${cr}" tem baixo contraste sobre fundo escuro`);
    const tam = o.tam ?? 72;
    if (typeof tam !== "number" || tam < 20 || tam > 240) erros.push(`${at}: "tam" deve ser número entre 20 e 240`);
    return {
      t: o.t,
      peso: o.peso ?? 700,
      tam,
      cor: cr,
      italico: !!o.italico,
      recuo: o.recuo ?? 0,
    };
  });
}

function verificarConteudo(t, onde, campanha, erros) {
  const urg = RE_ESCASSEZ.exec(t);
  if (urg) erros.push(`${onde}: escassez/urgência "${urg[0]}" em "${t}" — proibido (nada de urgência inventada)`);
  if (campanha) return;
  const dp = RE_DATA_PRECO.exec(t);
  if (dp) erros.push(`${onde}: data/valor/horário "${dp[0]}" em "${t}" — a rotina não publica preço, data, horário nem lote (só com meta.campanha: true, por pedido explícito)`);
  const url = RE_URL_VENDAS.exec(t);
  if (url) erros.push(`${onde}: link "${url[0]}" em "${t}" — links não vão impressos; use "link na bio"`);
}

function textosDoSlide(s) {
  const out = [s.eyebrow, s.corpo, s.eco, s.dica, s.caixaMarinho?.texto, s.numero?.valor, s.numero?.rotulo, s.citacao?.texto, s.citacao?.autor];
  for (const l of [...(s.titulo ?? []), ...(s.tituloPos ?? [])]) out.push(typeof l === "string" ? l : l?.t);
  for (const i of s.lista ?? []) out.push(i?.rotulo, i?.texto);
  if (s.tarja) out.push(...[].concat(s.tarja.texto));
  for (const c of [].concat(s.cta ?? [], s.linkBox ?? [])) out.push(c?.rotulo, c?.texto, c?.url);
  return out.filter((t) => typeof t === "string");
}

function validar(rot, dirRoteiro) {
  const erros = [];
  const avisos = [];
  if (!rot || typeof rot !== "object") return { erros: ["o roteiro deve ser um objeto JSON"], avisos };
  for (const c of Object.keys(rot))
    if (!CHAVES_ROTEIRO.includes(c) && !c.startsWith("_")) erros.push(`roteiro: chave desconhecida "${c}"`);
  if (!Array.isArray(rot.slides) || rot.slides.length === 0) {
    erros.push(`roteiro: "slides" deve ser uma lista com pelo menos 1 slide`);
    return { erros, avisos };
  }
  if (rot.slides.length > 10) avisos.push(`roteiro: ${rot.slides.length} slides — carrosséis com até 10 costumam render melhor`);

  const moldura = { ...MOLDURA_PADRAO, ...(rot.moldura ?? {}) };
  const campanha = rot.meta?.campanha === true;
  const slides = rot.slides.map((s, i) => {
    const onde = `slide ${i + 1}`;
    if (!s || typeof s !== "object") {
      erros.push(`${onde}: deve ser um objeto`);
      return null;
    }
    for (const c of Object.keys(s))
      if (!CHAVES_SLIDE.includes(c) && !c.startsWith("_")) erros.push(`${onde}: chave desconhecida "${c}"`);
    const modo = s.modo ?? "papel";
    if (!MODOS.includes(modo)) erros.push(`${onde}: modo "${modo}" inválido (use ${MODOS.join(", ")})`);
    const escuro = modo !== "papel";
    const n = { ...s, modo };

    validarPos(s.pos, onde, erros);
    if (modo === "full") {
      if (!s.foto) erros.push(`${onde}: modo "full" exige "foto"`);
      else n.fotoAbs = resolverFoto(s.foto, dirRoteiro, onde, erros);
    } else if (s.foto) avisos.push(`${onde}: "foto" só é usada no modo full — para ${modo} use "faixa"`);
    n.pos = s.pos ?? "attention";
    if (s.zoom !== undefined && (typeof s.zoom !== "number" || s.zoom < 1 || s.zoom > 3))
      erros.push(`${onde}: zoom deve ser número entre 1 (enquadramento normal) e 3 (bem próximo)`);

    n.titulo = normalizarLinhas(s.titulo, `${onde}.titulo`, erros, avisos, escuro);
    n.tituloPos = normalizarLinhas(s.tituloPos, `${onde}.tituloPos`, erros, avisos, escuro);
    if (!n.titulo.length && !s.numero && !s.citacao)
      erros.push(`${onde}: sem título ("titulo" é obrigatório, lista de linhas — opcional só com "numero" ou "citacao")`);
    if (s.numero !== undefined) {
      const nu = s.numero;
      if (!nu || typeof nu.valor !== "string" || !nu.valor.trim() || nu.valor.length > 3)
        erros.push(`${onde}: numero precisa de "valor" curto (ex.: "01")`);
      else {
        for (const c of Object.keys(nu)) if (!["valor", "rotulo", "estilo", "tam"].includes(c)) erros.push(`${onde}.numero: chave desconhecida "${c}"`);
        if (nu.estilo && !["vazado", "cheio"].includes(nu.estilo)) erros.push(`${onde}.numero: estilo deve ser "vazado" ou "cheio"`);
      }
    }
    if (s.citacao !== undefined) {
      const ci = s.citacao;
      if (!ci || typeof ci.texto !== "string" || !ci.texto.trim()) erros.push(`${onde}: citacao precisa de "texto"`);
      else for (const c of Object.keys(ci)) if (!["texto", "autor", "tam"].includes(c)) erros.push(`${onde}.citacao: chave desconhecida "${c}"`);
      if (ci?.autor && !MARCA.reAutorCitacao.test(ci.autor))
        avisos.push(`${onde}: citação atribuída a "${ci.autor}" — só com fala real fornecida pelo usuário ou presente no briefing`);
    }

    n.ancora = s.ancora ?? (modo === "full" ? "base" : "centro");
    if (!ANCORAS.includes(n.ancora)) erros.push(`${onde}: ancora "${n.ancora}" inválida (use ${ANCORAS.join(", ")})`);
    n.alinhar = s.alinhar ?? "esquerda";
    if (!["esquerda", "centro"].includes(n.alinhar)) erros.push(`${onde}: alinhar deve ser "esquerda" ou "centro"`);

    if (s.caixaMarinho && typeof s.caixaMarinho.texto !== "string") erros.push(`${onde}: caixaMarinho precisa de "texto"`);
    if (s.corpo !== undefined && typeof s.corpo !== "string") erros.push(`${onde}: "corpo" deve ser texto`);
    if (s.lista !== undefined) {
      if (!Array.isArray(s.lista)) erros.push(`${onde}: "lista" deve ser uma lista de { rotulo?, texto }`);
      else s.lista.forEach((it, k) => {
        if (!it || typeof it.texto !== "string") erros.push(`${onde}.lista[${k}]: precisa de "texto"`);
      });
    }
    if (s.tarja) {
      if (!["barra", "clara"].includes(s.tarja.tipo)) erros.push(`${onde}: tarja.tipo deve ser "barra" ou "clara"`);
      const tx = [].concat(s.tarja.texto ?? []);
      if (!tx.length || tx.some((t) => typeof t !== "string")) erros.push(`${onde}: tarja.texto deve ser texto ou lista de textos`);
    }
    const ctas = [].concat(s.cta ?? []);
    for (const lb of [].concat(s.linkBox ?? [])) ctas.push({ estilo: "link", rotulo: lb.rotulo, texto: lb.url });
    ctas.forEach((c, k) => {
      if (!c || typeof c.rotulo !== "string" || typeof c.texto !== "string")
        erros.push(`${onde}.cta[${k}]: precisa de "rotulo" e "texto"`);
      else if (c.estilo && !["link", "palavra"].includes(c.estilo))
        erros.push(`${onde}.cta[${k}]: estilo deve ser "link" ou "palavra"`);
    });
    if (ctas.length > 2) erros.push(`${onde}: no máximo 2 CTAs por slide`);
    n.cta = ctas;

    if (s.faixa) {
      for (const c of Object.keys(s.faixa)) if (!CHAVES_FAIXA.includes(c)) erros.push(`${onde}.faixa: chave desconhecida "${c}"`);
      if (modo === "full") erros.push(`${onde}: modo "full" não usa "faixa" (a foto já ocupa o slide)`);
      const lugar = s.faixa.lugar ?? "base";
      if (!["base", "meio"].includes(lugar)) erros.push(`${onde}.faixa: lugar deve ser "base" ou "meio"`);
      const altura = s.faixa.altura ?? 0.3;
      if (typeof altura !== "number" || altura < 0.12 || altura > 0.6) erros.push(`${onde}.faixa: altura deve ser fração entre 0.12 e 0.6 da altura do slide`);
      const centro = s.faixa.centro ?? 0.56;
      if (typeof centro !== "number" || centro < 0.2 || centro > 0.8) erros.push(`${onde}.faixa: centro deve ser fração entre 0.2 e 0.8`);
      validarPos(s.faixa.pos, `${onde}.faixa`, erros);
      n.faixa = {
        ...s.faixa, lugar, altura, centro,
        pos: s.faixa.pos ?? "attention",
        fotoAbs: resolverFoto(s.faixa.foto, dirRoteiro, `${onde}.faixa`, erros),
      };
    }
    if (s.pe !== undefined) erros.push(`${onde}: chave "pe" não existe`);
    n.dica = s.dica === false ? null : (s.dica ?? (i === 0 ? "arraste →" : null));

    if (s.funcao !== undefined && !["gancho", "valor", "ponte", "cta"].includes(s.funcao))
      erros.push(`${onde}: funcao deve ser gancho, valor, ponte ou cta`);
    if (i > 0 && (rot.slides[i - 1]?.modo ?? "papel") === modo)
      avisos.push(`${onde}: mesmo modo do slide anterior (${modo}) — alterne full / papel / marinho para dar ritmo`);
    for (const t of textosDoSlide(s)) {
      if (RE_EMOJI.test(t)) erros.push(`${onde}: emoji em "${t}" — as fontes do slide não têm emoji (emoji só na legenda)`);
      termosDaMarca(t, onde, erros, avisos);
      verificarConteudo(t, onde, campanha, erros);
    }
    return n;
  });

  const legenda = Array.isArray(rot.legenda) ? rot.legenda.join("\n") : rot.legenda;
  if (legenda !== undefined && typeof legenda !== "string") erros.push(`roteiro: "legenda" deve ser texto ou lista de linhas`);
  if (typeof legenda === "string") {
    for (const linha of legenda.split("\n")) {
      termosDaMarca(linha, "legenda", erros, avisos);
      verificarConteudo(linha, "legenda", campanha, erros);
    }
  }
  for (const lado of ["esquerda", "direita"])
    if (typeof moldura[lado] !== "string") erros.push(`moldura.${lado} deve ser texto`);

  return { erros, avisos, slides, moldura, legenda };
}

/* -------------------------------------------------------------------------- */
function legendaAutomatica(rot, slides) {
  const linhas = [rot.nome ?? `Carrossel — ${MARCA.nome}`, ""];
  slides.forEach((s, i) => {
    const t = [...s.titulo, ...s.tituloPos].map((l) => l.t).join(" ");
    linhas.push(`Slide ${i + 1}: ${t}${s.corpo ? ` — ${s.corpo}` : ""}`);
  });
  return linhas.join("\n");
}

function parseArgs(argv) {
  const o = { _: [] };
  for (const x of argv) {
    const m = /^--([^=]+)=(.*)$/.exec(x);
    if (m) o[m[1]] = m[2];
    else if (x.startsWith("--")) o[x.slice(2)] = true;
    else o._.push(x);
  }
  return o;
}

/** Caminho curto para log: relativo ao repo quando estiver dentro dele. */
function rel(p) {
  const r = path.relative(RAIZ, p);
  return r.startsWith("..") || path.isAbsolute(r) ? p : r;
}

async function limparExcedentes(dir, total) {
  if (!existsSync(dir)) return;
  for (const f of await readdir(dir)) {
    const m = /^slide-(\d+)\.png$/.exec(f);
    if (m && Number(m[1]) > total) {
      await unlink(path.join(dir, f));
      console.log(`  rm  ${rel(path.join(dir, f))} (slide excedente de uma versão anterior)`);
    }
  }
}

/* -------------------------------------------------------------------------- *
 * Estilos plugáveis: carrosseis/_base/estilos/<referenciaId>.mjs
 * -------------------------------------------------------------------------- */
const DIR_ESTILOS = path.join(RAIZ, "carrosseis", "_base", "estilos");

/** Carrega o estilo da referência. MARCA.legadoId (ou nenhum) = motor clássico embutido. */
async function carregarEstilo(id) {
  if (!id || id === MARCA.legadoId) return null;
  const arq = path.join(DIR_ESTILOS, `${id}.mjs`);
  if (!existsSync(arq))
    throw new Error(
      `a referência "${id}" ainda não tem estilo — crie ${rel(arq)} (ver SKILL.md, "Criar o estilo de uma referência")`,
    );
  const mod = (await import(pathToFileURL(arq).href)).default;
  if (!mod || typeof mod.montar !== "function") throw new Error(`${rel(arq)} precisa exportar default { familias, montar }`);
  mod.fontes = kit.criarFontes(RAIZ, mod.familias ?? {});
  return mod;
}

/** Recorta uma camada que saia do canvas (o composite do sharp não aceita sobra). */
async function encaixar(c, W, H) {
  const m = await sharp(c.input).metadata();
  const x0 = Math.max(0, c.left);
  const y0 = Math.max(0, c.top);
  const x1 = Math.min(W, c.left + m.width);
  const y1 = Math.min(H, c.top + m.height);
  if (x1 <= x0 || y1 <= y0) return null;
  if (x0 === c.left && y0 === c.top && x1 - x0 === m.width && y1 - y0 === m.height) return c;
  const input = await sharp(c.input)
    .extract({ left: x0 - c.left, top: y0 - c.top, width: x1 - x0, height: y1 - y0 })
    .png(RAPIDO)
    .toBuffer();
  return { input, left: x0, top: y0 };
}

async function renderizarComEstilo(estilo, s, idx, total, f, scale, ctxBase, rot, moldura) {
  const camadas = await estilo.montar({
    slide: s,
    idx,
    total,
    f,
    formato: ctxBase.formato,
    kit,
    fontes: estilo.fontes,
    moldura,
    roteiro: rot,
    aviso: ctxBase.aviso,
    erro: ctxBase.erro,
  });
  const w = Math.round(f.W * scale);
  const h = Math.round(f.H * scale);
  const arquivosFonte = [...estilo.fontes.arquivos, ...FONTES];
  const comp = [];
  for (const c of camadas.filter(Boolean)) {
    let item;
    if (c.svg) {
      const svg = c.svg.startsWith("<svg")
        ? c.svg
        : `<svg xmlns="http://www.w3.org/2000/svg" width="${f.W}" height="${f.H}" viewBox="0 0 ${f.W} ${f.H}">${c.svg}</svg>`;
      const png = new Resvg(svg, {
        fitTo: { mode: "zoom", value: scale },
        font: { fontFiles: arquivosFonte, loadSystemFonts: false, defaultFontFamily: SANS },
        background: "rgba(0,0,0,0)",
      })
        .render()
        .asPng();
      item = { input: png, left: 0, top: 0 };
    } else if (c.foto) item = await kit.camadaFoto({ canvasW: f.W, canvasH: f.H, ...c.foto }, scale);
    if (item) {
      const e = await encaixar(item, w, h);
      if (e) comp.push(e);
    }
  }
  if (estilo.grao) comp.push({ input: grao(f, scale, estilo.grao), blend: "over" });
  const cheio = await sharp({ create: { width: w, height: h, channels: 4, background: { ...RGB_PROFUNDO, alpha: 1 } } })
    .composite(comp)
    .png(RAPIDO)
    .toBuffer();
  return sharp(cheio).resize(f.W, f.H, { fit: "fill" }).flatten({ background: PALETA.profundo }).png({ compressionLevel: 8 }).toBuffer();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const arq = opts._[0];
  if (!arq || opts.help || opts.h) {
    console.log(
      "Uso: node scripts/carrossel/gerar.mjs <roteiro.json> [--formato=feed|story|ambos] [--scale=2]\n" +
        "      [--entregar] [--forcar] [--data=AAAA-MM-DD] [--rascunho]\n" +
        "  --entregar  copia feed + story + legenda para a pasta de aprovação e registra no histórico\n" +
        "  --forcar    reentrega o mesmo slug / rebaixa as travas do histórico a aviso\n" +
        "  --rascunho  ignora meta/histórico (testes fora da rotina; não entrega)",
    );
    return arq ? 0 : 1;
  }
  const formatos = opts.formato === "ambos" ? ["feed", "story"] : [opts.formato ?? "feed"];
  for (const fm of formatos)
    if (!FORMATOS[fm]) throw new Error(`--formato inválido "${fm}" (use feed, story ou ambos)`);
  const scale = Math.min(4, Math.max(1, Number.parseInt(opts.scale ?? "2", 10) || 2));

  for (const f of FONTES) if (!existsSync(f)) throw new Error(`fonte ausente: ${f}`);

  const caminho = path.resolve(process.cwd(), arq);
  if (!existsSync(caminho)) throw new Error(`roteiro não encontrado: ${caminho}`);
  let rot;
  try {
    rot = JSON.parse((await readFile(caminho, "utf8")).replace(/^﻿/, ""));
  } catch (e) {
    throw new Error(`JSON inválido em ${rel(caminho)}: ${e.message}`);
  }
  const dir = path.dirname(caminho);
  const slug = path.basename(dir);
  const v = validar(rot, dir);
  const fotos = [
    ...new Set(
      (v.slides ?? [])
        .filter(Boolean)
        .flatMap((s) => [s.fotoAbs, s.faixa?.fotoAbs])
        .filter(Boolean)
        .map((f) => rel(f).split(path.sep).join("/")),
    ),
  ];
  const forcar = !!opts.forcar;
  if (opts.entregar && opts.rascunho) throw new Error(`--entregar não combina com --rascunho`);
  if (!opts.rascunho && v.slides) {
    const m = checarMeta({
      meta: rot.meta,
      slug,
      slides: v.slides.filter(Boolean),
      fotos,
      base: await lerBase(RAIZ),
      historico: await lerHistorico(RAIZ),
      legenda: v.legenda,
      fila: await lerFila(RAIZ),
      data: opts.data ?? dataLocal(),
    });
    v.avisos.push(...m.avisos);
    v.erros.push(...m.erros);
    if (forcar) m.repeticoes.forEach((e) => v.avisos.push(`(--forcar) ${e}`));
    else v.erros.push(...m.repeticoes);
  }
  const data = opts.data ?? dataLocal();
  if (opts.entregar) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) throw new Error(`--data deve ser AAAA-MM-DD`);
    if (opts.formato !== "ambos") throw new Error(`--entregar exige --formato=ambos (feed + story)`);
    if (slug.startsWith("_")) throw new Error(`pastas iniciadas com "_" não são entregáveis`);
    const ja = (await lerHistorico(RAIZ)).entregas.find((e) => e.slug === slug);
    if (ja && !forcar)
      throw new Error(`"${slug}" já foi entregue em ${ja.data} (${ja.pastaEntrega}) — use --forcar para reentregar`);
  }
  for (const a of v.avisos) console.warn(`  AVISO  ${a}`);
  if (v.erros.length) {
    console.error(`x  Roteiro inválido (${v.erros.length} erro(s)):`);
    for (const e of v.erros) console.error(`   - ${e}`);
    return 1;
  }
  // fotos legíveis?
  for (const [i, s] of v.slides.entries())
    for (const f of [s.fotoAbs, s.faixa?.fotoAbs].filter(Boolean))
      await sharp(f).metadata().catch(() => {
        throw new Error(`slide ${i + 1}: não foi possível ler a imagem ${f}`);
      });

  const estilo = await carregarEstilo(opts.estilo ?? rot.meta?.referenciaId);
  console.log(`  estilo: ${estilo ? `${estilo.nome ?? ""} (${opts.estilo ?? rot.meta.referenciaId})` : `editorial clássico (${MARCA.legadoId})`}`);
  const errosLayout = [];
  const total = v.slides.length;
  for (const formato of formatos) {
    const f = FORMATOS[formato];
    const out = formato === "feed" ? dir : path.join(dir, "story");
    await mkdir(out, { recursive: true });
    for (const [i, s] of v.slides.entries()) {
      const ctxBase = {
        formato,
        aviso: (m) => console.warn(`  AVISO  slide ${i + 1} (${formato}): ${m}`),
        erro: (m) => errosLayout.push(m),
      };
      const png = estilo
        ? await renderizarComEstilo(estilo, s, i, total, f, scale, ctxBase, rot, v.moldura)
        : await renderSlide(s, i, total, f, v.moldura, scale, ctxBase);
      const alvo = path.join(out, `slide-${i + 1}.png`);
      await writeFile(alvo, png);
      console.log(`  ok  ${rel(alvo)}  (${f.W}x${f.H})`);
    }
    await limparExcedentes(out, total);
  }

  const legenda = v.legenda ?? legendaAutomatica(rot, v.slides);
  await writeFile(path.join(dir, "legenda.txt"), legenda.trimEnd() + "\n", "utf8");
  console.log(`  ok  ${rel(path.join(dir, "legenda.txt"))}`);

  if (errosLayout.length) {
    console.error(`\nx  ${errosLayout.length} problema(s) de layout (PNGs gerados para inspeção, mas corrija o roteiro):`);
    for (const e of errosLayout) console.error(`   - ${e}`);
    return 1;
  }
  console.log(`\nok  ${total} slide(s) × ${formatos.join(" + ")} em ${rel(dir) || "."}/ (${scale}x)`);
  if (opts.entregar) {
    await entregar({
      raiz: RAIZ, dir, slug, meta: rot.meta, fotos, total, data, forcar,
      log: (m) => console.log(m),
    });
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error("x  Falha ao gerar o carrossel");
    console.error(`   ${err?.message ?? String(err)}`);
    process.exit(1);
  });
