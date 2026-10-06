// Estilo 09 · "Cartões flutuantes" — derivado de ref-cards-flutuantes (download (1).jpg:
// celular e cartões de produto FLUTUANDO em camadas, sombras suaves, fundo claro neutro
// com luz lateral).
//
// Arquitetura: PROFUNDIDADE. Fundo branco com luz lateral (gradiente de sombra neutra
// vindo da direita) e a foto EM COR num cartão de cantos arredondados, inclinado, com
// sombra em camadas; atrás dele um cartão "fantasma" girado para o outro lado; em volta,
// três chips pequenos (recortes aproximados da mesma foto) flutuando em alturas e giros
// diferentes, como os ícones da referência. Papel: o mesmo jogo com a foto da faixa,
// menor. Marinho: noite preta com o TEXTO dentro de um grande cartão branco flutuante
// (sombra profunda) e um cartão vermelho espiando por trás. Tudo alinhado à esquerda,
// cantos arredondados em todo lugar (eyebrow em pílula, CTA em pílula, lista em cartões).
// Tipografia: Fira Sans (títulos SemiBold, corpo) + Instrument Serif itálico (ênfase).
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF (sombras = preto translúcido).

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, flor } from "./_comum.mjs";

const SANS = "Fira Sans";
const SERIF = "Instrument Serif";

const arred = (w, h, r) => `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100%"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="#fff"/></svg>`;

const estilo = {
  id: "ref-cards-flutuantes",
  nome: "Cartões flutuantes",
  grao: 0.025,
  familias: {
    [SANS]: ["fira-sans/FiraSans-Light.ttf", "fira-sans/FiraSans-Regular.ttf", "fira-sans/FiraSans-Medium.ttf", "fira-sans/FiraSans-SemiBold.ttf", "fira-sans/FiraSans-Bold.ttf"],
    [SERIF]: ["instrument-serif/InstrumentSerif-Regular.ttf", "instrument-serif/InstrumentSerif-Italic.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const noite = s.modo === "marinho";
    const X0 = f.mx + (noite ? 40 : 0);
    const XR = W - (story ? 120 : 90) - (noite ? 40 : 0);
    const L = XR - X0;
    const tinta = P.escuro; // texto sempre sobre branco (papel, full claro ou cartão)
    const suave = rgba(P.escuro, 0.58);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, false, { principal: [P.escuro, P.escuro], suave: [P.escuro, P.escuro] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <linearGradient id="luzLat" x1="0" y1="0" x2="1" y2="0.25">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
        <stop offset="0.55" stop-color="#000000" stop-opacity="0.025"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.13"/>
      </linearGradient>
      <radialGradient id="facho" cx="12%" cy="8%" r="70%">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="1"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
      <filter id="flutua" x="-40%" y="-40%" width="180%" height="190%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dy="6" result="a"/>
        <feGaussianBlur in="SourceAlpha" stdDeviation="30"/><feOffset dx="18" dy="40" result="b"/>
        <feFlood flood-color="#000000" flood-opacity="0.16"/><feComposite in2="a" operator="in" result="a2"/>
        <feFlood flood-color="#000000" flood-opacity="0.28"/><feComposite in2="b" operator="in" result="b2"/>
        <feMerge><feMergeNode in="b2"/><feMergeNode in="a2"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;

    /* ---------- marca e progresso (pílulas) ---------- */
    const corM = noite ? P.branco : P.escuro;
    let moldura =
      flor(f.mx + 14, f.molduraTopo - 8, 13, verm) +
      T(f.mx + 38, f.molduraTopo, "DUMI", { fam: SANS, peso: 700, tam: 26, c: corM, ls: 3 }) +
      T(f.mx + 38 + medir("DUMI", { fam: SANS, peso: 700, tam: 26, ls: 3 }) + 12, f.molduraTopo, "sabores orientais", { fam: SERIF, tam: 24, it: true, c: noite ? rgba(P.branco, 0.7) : suave });
    const pw = 26;
    const pg = 8;
    const xP = W - f.mx - (total * pw + (total - 1) * pg) - (idx ? 0 : 0) - 26;
    for (let k = 0; k < total; k++)
      moldura += `<rect x="${xP + k * (pw + pg) + (k > idx ? 26 : 0)}" y="${f.molduraTopo - 16}" width="${k === idx ? pw + 26 : pw}" height="12" rx="6" fill="${k === idx ? verm : rgba(corM, 0.22)}"/>`;
    const d = dicaDe(s);
    if (d) moldura += T(W - f.mx - 44, f.molduraBase, d, { fam: SANS, peso: 600, tam: 19, c: corM, a: "end", ls: 2 }) + seta(W - f.mx, f.molduraBase - 6, verm, { w: 30 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) =>
      ln.italico
        ? { fam: SERIF, peso: 400, tam: Math.round(ln.tam * 1.12), it: true, c: ln.cor === "principal" ? verm : corTok(ln.cor) }
        : { fam: SANS, peso: ln.peso >= 700 ? 700 : 600, tam: Math.round(ln.tam * 0.9), c: corTok(ln.cor), ls: -0.5 };
    const { blocos: B, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.06,
      rot: { fam: SANS, peso: 600, ls: 3 },
      corpo: { fam: SANS, peso: 300, tam: story ? 34 : 31, lh: 1.48, largura: L - 30 },
      numero: { variante: "circulo", fam: SANS, peso: 700, raio: story ? 92 : 84 },
      caixa: { fam: SANS, peso: 600, tam: 34, h: 76, ls: 2 },
      citacao: { fam: SERIF, it: true, tam: story ? 62 : 56 },
      lista: { variante: "cartoes", fam: SANS, peso: 500, tam: story ? 35 : 32, rotTam: 18, fundoCartao: P.branco },
      tarja: { fam: SANS, peso: 300 },
      cta: { variante: "contorno", fam: SANS, peso: 700, tam: story ? 104 : 94, ls: 2, linkFam: SERIF, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const ebEst = { fam: SANS, peso: 600, tam: 20, ls: 3 };
    const eyebrow = (x, y) => {
      if (!s.eyebrow) return "";
      const t = s.eyebrow.toUpperCase();
      const w = medir(t, ebEst) + 44;
      return `<rect x="${x}" y="${y - 32}" width="${w}" height="46" rx="23" fill="${P.escuro}"/>` + T(x + 22, y - 1, t, { ...ebEst, c: P.branco });
    };

    /** Cartão de foto girado (sombra + foto arredondada) + chips flutuantes. */
    const camadas = [];
    const cartao = (arq, pos, x, y, w, h, giro, zoom, raio = 30) => {
      const cr = { x: x + w / 2, y: y + h / 2 };
      camadas.push({ svg: `${defs}<g transform="rotate(${giro} ${cr.x} ${cr.y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${raio}" fill="${P.branco}" filter="url(#flutua)"/></g>` });
      camadas.push({ foto: { arquivo: arq, x, y, w, h, pos, zoom: Math.min(3, zoom), tratamento: "cor", mascara: arred(w, h, raio), rotacao: giro, centroRotacao: cr } });
      camadas.push({ svg: `<g transform="rotate(${giro} ${cr.x} ${cr.y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${raio}" fill="none" stroke="${P.branco}" stroke-width="6"/></g>` });
    };
    const fundoClaro = `${defs}<rect width="${W}" height="${H}" fill="${P.claro}"/><rect width="${W}" height="${H}" fill="url(#luzLat)"/><rect width="${W}" height="${H}" fill="url(#facho)" opacity="0.6"/>`;

    let svgCima = "";
    let topo;
    let ancora = "topo";

    const cena = (arq, pos, yTop, yBot, zoom, escala = 1) => {
      // cartão fantasma + cartão principal + 3 chips
      const hDisp = yBot - yTop;
      const w = Math.min(W * 0.66, hDisp * 0.95) * escala;
      const h = Math.min(hDisp * 0.84, w * 1.05);
      const x = W * 0.54 - w / 2;
      const y = yTop + (hDisp - h) / 2;
      camadas.push({ svg: `${defs}<g transform="rotate(7 ${x + w / 2} ${y + h / 2})"><rect x="${x + 30}" y="${y - 10}" width="${w}" height="${h}" rx="30" fill="${noite ? verm : P.branco}" filter="url(#flutua)"/></g>` });
      cartao(arq, pos, x, y, w, h, -5, zoom);
      const q = Math.round(w * 0.27);
      const chips = [
        [x - q * 0.62, y + h * 0.12, -9, 2.2],
        [x + w - q * 0.35, y + h * 0.06 - q * 0.4, 8, 2.8],
        [x + w - q * 0.55, y + h - q * 0.6, -4, 1.8],
      ];
      for (const [cx0, cy0, g, z] of chips) cartao(arq, pos, Math.min(W - q - 34, Math.max(28, cx0)), cy0, q, q, g, zoom * z, 20);
    };

    if (s.modo === "full") {
      camadas.push({ svg: fundoClaro });
      const ebH = s.eyebrow ? 70 : 0;
      topo = f.areaBase - hTexto;
      cena(s.fotoAbs, posDe(c, s.pos), f.molduraTopo + 40, topo - ebH - 30, s.zoom ?? 1);
      svgCima += eyebrow(X0, topo - 34);
    } else if (!noite) {
      camadas.push({ svg: fundoClaro });
      if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H * 1.25);
        const yA = f.areaTopo - 30;
        cena(s.faixa.fotoAbs, posDe(c, s.faixa.pos), yA, yA + hF, s.zoom ?? 1, 0.9);
        topo = yA + hF + 40 + (s.eyebrow ? 70 : 0);
        svgCima += eyebrow(X0, topo - 34);
      } else {
        topo = Math.max(f.areaTopo + 70, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + 70) / 2);
        svgCima += eyebrow(X0, topo - 34);
      }
    } else {
      // noite: texto num cartão branco flutuante
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${P.escuro}"/><rect width="${W}" height="${H}" fill="url(#facho)" opacity="0.08"/>` });
      const padC = 60;
      const ebH = s.eyebrow ? 70 : 0;
      const hC = hTexto + 2 * padC + ebH;
      const yC = Math.max(f.areaTopo - 20, f.areaTopo + (f.areaBase - f.areaTopo - hC) / 2);
      const xC = X0 - padC;
      const wC = L + 2 * padC;
      camadas.push({
        svg: `${defs}<g transform="rotate(-4 ${xC + wC / 2} ${yC + hC / 2})"><rect x="${xC + 26}" y="${yC + 30}" width="${wC}" height="${hC}" rx="34" fill="${verm}"/></g>` +
          `<rect x="${xC}" y="${yC}" width="${wC}" height="${hC}" rx="34" fill="${P.branco}" filter="url(#flutua)"/>`,
      });
      topo = yC + padC + ebH;
      svgCima += eyebrow(X0, topo - 34);
    }

    const r = kit.empilhar(todos, topo, f.areaBase + (noite ? 40 : 0), ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
