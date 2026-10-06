// Estilo 08 · "Mosaico" — derivado de ref-mosaico-quatro (último post do perfil: grade
// 2×2 de fotos de pratos, sem texto).
//
// Arquitetura: GRADE MODULAR 2×2 em todos os slides. Full: a tela vira uma folha de
// contato — quatro quadros da mesma foto EM COR, cada um com um recorte/zoom diferente
// (geral, aproximado, detalhe), separados por calhas pretas; o texto entra numa TARJA preta
// horizontal que atravessa o mosaico, com fio vermelho e o eyebrow num quadrado vermelho
// encostado nela. Papel: branco; a foto da faixa ocupa a linha de cima em dois quadros
// (geral + zoom) e o texto ocupa a linha de baixo. Marinho: preto com a grade em fios
// finos e o quadrante superior esquerdo VERMELHO — o número do slide (quando há) mora nele,
// em branco. Marca e contador com o ícone de 4 quadradinhos. Tipografia: DM Serif Display
// (títulos) + Poppins (rótulos e corpo). Alinhado à esquerda.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, caber, flor } from "./_comum.mjs";

const SERIF = "DM Serif Display";
const SANS = "Poppins";

const estilo = {
  id: "ref-mosaico-quatro",
  nome: "Mosaico",
  grao: 0.04,
  familias: {
    [SERIF]: ["dm-serif-display/DMSerifDisplay-Regular.ttf", "dm-serif-display/DMSerifDisplay-Italic.ttf"],
    [SANS]: ["poppins/Poppins-Light.ttf", "poppins/Poppins-Regular.ttf", "poppins/Poppins-Medium.ttf", "poppins/Poppins-SemiBold.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const full = s.modo === "full";
    const papel = s.modo === "papel";
    const X0 = f.mx;
    const XR = W - (story ? 120 : 90);
    const L = XR - X0;
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.6) : rgba(P.branco, 0.72);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });
    const G = 10; // calha

    const defs = `<defs>${kit.efeitosDefs("#000000")}</defs>`;

    /** Ícone de 4 quadradinhos (o atual em vermelho). */
    const icone = (x, y, q, ativo = 0, cor = tinta) =>
      [0, 1, 2, 3].map((k) => `<rect x="${x + (k % 2) * (q + 3)}" y="${y + Math.floor(k / 2) * (q + 3)}" width="${q}" height="${q}" fill="${k === ativo ? verm : cor}"/>`).join("");

    /* ---------- marca e contador ---------- */
    const corM = full ? P.branco : tinta;
    const sombraM = full ? `filter="url(#k-sombra)"` : "";
    // no full, marca e contador ficam em plaquinhas pretas (legíveis sobre qualquer quadro)
    const wCont = medir(`${pad(idx + 1)} / ${pad(total)}`, { fam: SANS, peso: 500, tam: 20, ls: 2 });
    let moldura =
      (full
        ? `<rect x="${X0 - 14}" y="${f.molduraTopo - 34}" width="${38 + medir("DUMI", { fam: SANS, peso: 600, tam: 24, ls: 4 }) + 28}" height="48" fill="${rgba(P.escuro, 0.82)}"/>` +
          `<rect x="${XR - wCont - 16}" y="${f.molduraTopo - 32}" width="${wCont + 30}" height="44" fill="${rgba(P.escuro, 0.82)}"/>`
        : "") +
      `<g ${sombraM}>` +
      icone(X0, f.molduraTopo - 22, 11, 0, corM) +
      T(X0 + 38, f.molduraTopo, "DUMI", { fam: SANS, peso: 600, tam: 24, c: corM, ls: 4 }) +
      T(XR, f.molduraTopo, `${pad(idx + 1)} / ${pad(total)}`, { fam: SANS, peso: 500, tam: 20, c: corM, a: "end", ls: 2 }) +
      `</g>`;
    const d = dicaDe(s);
    if (d) moldura += `<g ${sombraM}>` + T(XR - 44, f.molduraBase, d, { fam: SANS, peso: 600, tam: 18, c: corM, a: "end", ls: 3 }) + seta(XR, f.molduraBase - 6, full ? P.branco : verm, { w: 30 }) + `</g>`;
    if (!full) moldura += T(X0, f.molduraBase, "SABORES ORIENTAIS", { fam: SANS, peso: 500, tam: 15, c: suave, ls: 5 });

    /* ---------- blocos ---------- */
    const numNoQuadro = s.modo === "marinho" && s.numero;
    const tipoTitulo = (ln) => ({
      fam: SERIF,
      peso: 400,
      tam: Math.round(ln.tam * (ln.peso >= 700 ? 1.08 : 1.0)),
      it: ln.italico,
      c: ln.italico && ln.cor === "principal" ? (full ? P.branco : verm) : corTok(ln.cor),
    });
    const { blocos: B0, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.04,
      rot: { fam: SANS, peso: 600, ls: 3 },
      corpo: { fam: SANS, peso: 300, tam: story ? 33 : 30, lh: 1.5, largura: L - 40 },
      numero: { variante: "lado", fam: SERIF, tam: story ? 230 : 200 },
      caixa: { fam: SANS, peso: 600, tam: 34, h: 80, ls: 3 },
      citacao: { fam: SERIF, it: true, tam: story ? 58 : 52 },
      lista: { variante: "regua", fam: SANS, peso: 500, tam: story ? 36 : 33, rotTam: 19, col: 190 },
      tarja: { fam: SANS, peso: 300 },
      cta: { variante: "caixa", fam: SERIF, tam: story ? 120 : 108, ls: 1, linkFam: SANS, linkPeso: 400 },
    });
    const B = numNoQuadro ? B0.filter((b) => b.tipo !== "numero") : B0;
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const ebEst = { fam: SANS, peso: 600, tam: 19, ls: 4 };
    const eyebrowCaixa = (x, y) => {
      if (!s.eyebrow) return "";
      const t = s.eyebrow.toUpperCase();
      const w = medir(t, ebEst) + 40;
      return `<rect x="${x}" y="${y}" width="${w}" height="48" fill="${verm}"/>` + T(x + 20, y + 31, t, { ...ebEst, c: P.branco });
    };

    const camadas = [];
    let svgCima = "";
    let topo;
    let base = f.areaBase;
    let ancora = "topo";
    const pB = posDe(c, s.pos);
    const foco = pB && typeof pB === "object" ? pB : { x: 0.5, y: 0.5 };
    const desl = (dx, dy) => ({ x: Math.min(0.95, Math.max(0.05, (foco.x ?? 0.5) + dx)), y: Math.min(0.95, Math.max(0.05, (foco.y ?? 0.5) + dy)) });

    if (full) {
      camadas.push({ svg: `<rect width="${W}" height="${H}" fill="${P.escuro}"/>` });
      const cw = (W - G) / 2;
      const ch = (H - G) / 2;
      const z = s.zoom ?? 1;
      const quadros = [
        [0, 0, foco, z],
        [cw + G, 0, desl(0.12, -0.05), Math.min(3, z * 1.7)],
        [0, ch + G, desl(-0.12, 0.08), Math.min(3, z * 1.7)],
        [cw + G, ch + G, desl(0.04, 0.04), Math.min(3, z * 2.5)],
      ];
      for (const [x, y, p, zz] of quadros) camadas.push({ foto: { arquivo: s.fotoAbs, x, y, w: cw, h: ch, pos: p, zoom: zz, tratamento: "cor" } });
      // tarja preta atravessando o mosaico
      const padV = 54;
      const hT = hTexto + 2 * padV;
      const yC = Math.min(f.areaBase - hT / 2 + padV, Math.max(f.areaTopo + hT / 2, H * 0.56));
      const yT = yC - hT / 2;
      svgCima +=
        `<rect x="0" y="${yT}" width="${W}" height="${hT}" fill="${rgba(P.escuro, 0.93)}"/>` +
        `<rect x="0" y="${yT}" width="${W}" height="6" fill="${verm}"/>` +
        eyebrowCaixa(X0, yT - 48);
      topo = yT + padV;
      base = yT + hT - padV + 1;
    } else {
      let fundo = `<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>`;
      if (!papel) {
        const cw = (W - G) / 2;
        const ch0 = (H - G) / 2;
        // texto na metade de baixo; se não couber, o quadrante vermelho encolhe
        topo = Math.min(ch0 + G + 70, f.areaBase - hTexto);
        topo = Math.max(f.areaTopo + 40, topo);
        const ch = Math.min(ch0, topo - 70 - G);
        ancora = 'topo';
        fundo +=
          `<rect x="0" y="0" width="${cw}" height="${ch}" fill="${verm}"/>` +
          `<line x1="${cw + G / 2}" y1="0" x2="${cw + G / 2}" y2="${H}" stroke="${rgba(P.branco, 0.14)}" stroke-width="1.5"/>` +
          `<line x1="0" y1="${ch + G / 2}" x2="${W}" y2="${ch + G / 2}" stroke="${rgba(P.branco, 0.14)}" stroke-width="1.5"/>`;
        if (!numNoQuadro) {
          // quadrante vermelho sem número: flor branca da logo, grande e recortada pela borda
          const r0 = Math.min(cw, ch) * 0.34;
          fundo += `<g opacity="0.95">${flor(cw * 0.5, f.molduraTopo + 30 + (ch - f.molduraTopo - 30) * 0.5, r0, P.branco)}</g>`;
        } else {
          const est = caber(medir, s.numero.valor, { fam: SERIF, tam: Math.min(story ? 420 : 380, ch * 0.62) }, cw - 120);
          const yb = f.molduraTopo + 30 + (ch - f.molduraTopo - 30) * 0.5 + est.tam * 0.3;
          fundo += T(cw / 2, yb, s.numero.valor, { ...est, c: P.branco, a: 'middle' });
          if (s.numero.rotulo) fundo += T(cw / 2, yb + 60, s.numero.rotulo.toUpperCase(), { fam: SANS, peso: 600, tam: 24, c: P.branco, a: 'middle', ls: 5 });
        }
        svgCima += eyebrowCaixa(X0, topo - 76);
      } else if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H);
        const yF = f.fioTopo + 30;
        const cw = (W - 2 * X0 - G) / 2;
        const p = posDe(c, s.faixa.pos);
        const fo = p && typeof p === "object" ? p : { x: 0.5, y: 0.5 };
        camadas.push({ svg: fundo });
        fundo = "";
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: X0, y: yF, w: cw, h: hF, pos: fo, zoom: s.zoom ?? 1, tratamento: "cor" } });
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: X0 + cw + G, y: yF, w: cw, h: hF, pos: { x: Math.min(0.9, (fo.x ?? 0.5) + 0.1), y: fo.y ?? 0.5 }, zoom: Math.min(3, (s.zoom ?? 1) * 2), tratamento: "cor" } });
        svgCima += `<rect x="${X0}" y="${yF + hF + G}" width="${cw}" height="8" fill="${verm}"/>` + eyebrowCaixa(X0, yF + hF + G + 34);
        topo = yF + hF + G + 34 + (s.eyebrow ? 48 + 40 : 30);
      } else {
        topo = Math.max(f.areaTopo + (s.eyebrow ? 80 : 0), f.areaTopo + (f.areaBase - f.areaTopo - hTexto) / 2);
        svgCima += icone(X0, topo - (s.eyebrow ? 150 : 90), 26, idx % 4, P.escuro) + eyebrowCaixa(X0 + 70, topo - (s.eyebrow ? 150 : 90) + 3);
      }
      if (fundo) camadas.push({ svg: fundo });
    }

    const r = kit.empilhar(todos, topo, base, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
