// Estilo 10 · "Cartão vermelho" — derivado de ref-cartao-vermelho (web: tendência
// "Things that deserve a red card" — tipografia forte, FUNDO SÓLIDO e UM ÚNICO visual
// reconhecível; formato de opinião). Base: a descrição registrada em referencias.md.
//
// Arquitetura: QUEBRA DE PADRÃO. Full: o slide inteiro é vermelho sólido da logo; a foto
// do prato (EM COR) entra pequena, num recorte quadrado com moldura preta, encostada no
// canto superior direito — o único visual; a frase de opinião ocupa a largura em Archivo
// Black branco, alinhada à esquerda, com a ênfase em Spectral itálico. Papel: branco com
// tinta preta, ênfase vermelha e a foto da faixa num quadrado pequeno no canto inferior
// direito. Marinho: preto com um "cartão vermelho" de árbitro girado saindo pela borda
// direita. Cabeçalho mínimo (DUMI + "sabores orientais" em itálico), contador por extenso
// ("3 de 7"). Tipografia: Archivo Black + Spectral.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, dicaDe, seta } from "./_comum.mjs";

const PESADA = "Archivo Black";
const SERIF = "Spectral";

const estilo = {
  id: "ref-cartao-vermelho",
  nome: "Cartão vermelho",
  grao: 0.045,
  familias: {
    [PESADA]: ["archivo-black/ArchivoBlack-Regular.ttf"],
    [SERIF]: ["spectral/Spectral-Light.ttf", "spectral/Spectral-LightItalic.ttf", "spectral/Spectral-Regular.ttf", "spectral/Spectral-Italic.ttf", "spectral/Spectral-Medium.ttf"],
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
    const fundo = full ? P.acento2 : papel ? P.claro : P.escuro;
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.62) : rgba(P.branco, 0.82);
    const destaque = full ? P.branco : P.acento; // no vermelho, o destaque é branco
    const contra = full ? P.acento : P.branco;
    const corTok = (t) => {
      const nome = kit.papel(String(t).split("/")[0]);
      if (nome === "acento" || nome === "acento2") return destaque;
      return kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });
    };

    const defs = `<defs>${kit.efeitosDefs("#000000")}</defs>`;

    /* ---------- cabeçalho mínimo ---------- */
    let moldura =
      T(X0, f.molduraTopo + 4, "DUMI", { fam: PESADA, tam: 30, c: tinta, ls: 2 }) +
      T(X0 + medir("DUMI", { fam: PESADA, tam: 30, ls: 2 }) + 14, f.molduraTopo + 2, "sabores orientais", { fam: SERIF, peso: 300, tam: 24, it: true, c: suave }) +
      T(X0, f.molduraBase, `${idx + 1} de ${total}`, { fam: SERIF, peso: 400, tam: 24, it: true, c: suave });
    const d = dicaDe(s);
    if (d) moldura += T(XR - 46, f.molduraBase, d.toLowerCase(), { fam: SERIF, peso: 500, tam: 26, it: true, c: tinta, a: "end" }) + seta(XR, f.molduraBase - 8, tinta, { w: 32 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) =>
      ln.italico
        ? { fam: SERIF, peso: 400, tam: Math.round(ln.tam * (full ? 1.36 : 1.12)), it: true, c: ln.cor === "principal" ? destaque : corTok(ln.cor) }
        : { fam: PESADA, peso: 400, tam: Math.round(ln.tam * (full ? 1.32 : 1.08)), c: corTok(ln.cor), ls: -1.5 };
    const { blocos: B, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque,
      contraDestaque: contra,
      titulo: tipoTitulo,
      lh: 1.0,
      rot: { fam: SERIF, peso: 500, ls: 3 },
      corpo: { fam: SERIF, peso: 400, tam: story ? 37 : 34, lh: 1.42, largura: L - 60 },
      numero: { variante: "cima", fam: PESADA, tam: story ? 300 : 270 },
      caixa: { fam: PESADA, tam: 40, h: 84, ls: 1, fundo: full ? P.escuro : P.acento, c: P.branco },
      citacao: { fam: SERIF, peso: 300, it: true, tam: story ? 64 : 58, aspasFam: PESADA },
      lista: { variante: "pontilhado", fam: SERIF, peso: 500, tam: story ? 40 : 37, rotTam: 20 },
      tarja: { fam: SERIF, peso: 400 },
      cta: { variante: "caixa", fam: PESADA, tam: story ? 112 : 100, ls: 1, linkFam: SERIF, linkPeso: 400, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const ebEst = { fam: SERIF, peso: 500, tam: 30, it: true };
    const eyebrow = (y) => (s.eyebrow ? `<rect x="${X0}" y="${y - 12}" width="40" height="4" fill="${destaque}"/>` + T(X0 + 56, y, s.eyebrow, { ...ebEst, c: tinta }) : "");
    const ebH = s.eyebrow ? 70 : 0;

    const camadas = [{ svg: `${defs}<rect width="${W}" height="${H}" fill="${fundo}"/>` }];
    let svgCima = "";
    let topo;
    let ancora = "topo";

    /** O único visual: foto quadrada pequena com moldura preta. */
    const quadro = (arq, pos, x, y, q, giro) => {
      const cr = { x: x + q / 2, y: y + q / 2 };
      camadas.push({ svg: `${defs}<g transform="rotate(${giro} ${cr.x} ${cr.y})"><rect x="${x - 14}" y="${y - 14}" width="${q + 28}" height="${q + 28}" fill="${P.escuro}" filter="url(#k-camadas)"/></g>` });
      camadas.push({ foto: { arquivo: arq, x, y, w: q, h: q, pos, zoom: s.zoom ?? 1, tratamento: "cor", rotacao: giro, centroRotacao: cr } });
    };

    if (full) {
      const q = Math.round(W * (story ? 0.46 : 0.4));
      const yQ = f.areaTopo - 30;
      quadro(s.fotoAbs, posDe(c, s.pos), XR - q, yQ, q, 4);
      topo = Math.max(yQ + q + 60 + ebH, f.areaBase - hTexto);
      if (topo + hTexto > f.areaBase) topo = Math.max(f.areaTopo + ebH, f.areaBase - hTexto);
      svgCima += eyebrow(topo - 40);
    } else if (papel) {
      if (s.faixa) {
        const q = Math.round(Math.min(W * 0.36, s.faixa.altura * H * 1.1));
        const yQ = f.areaBase - q + 20;
        quadro(s.faixa.fotoAbs, posDe(c, s.faixa.pos), XR - q, yQ, q, -4);
        topo = f.areaTopo + ebH;
        svgCima += eyebrow(topo - 40);
        // o texto não pode invadir o quadro: limita a base
        const r = kit.empilhar(todos, topo, yQ - 50, "topo", { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
        camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
        return camadas;
      }
      topo = Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
      svgCima += eyebrow(topo - 40);
    } else {
      // cartão de árbitro saindo pela borda direita
      const cw = story ? 300 : 260;
      const chh = cw * 1.45;
      const x = W - cw * 0.62;
      const y = f.areaTopo - 40;
      camadas.push({ svg: `${defs}<g transform="rotate(14 ${x + cw / 2} ${y + chh / 2})"><rect x="${x}" y="${y}" width="${cw}" height="${chh}" rx="18" fill="${P.acento2}" filter="url(#k-camadas)"/></g>` });
      topo = Math.max(f.areaTopo + ebH + (s.numero ? 0 : 60), f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
      svgCima += eyebrow(topo - 40);
    }

    const r = kit.empilhar(todos, topo, f.areaBase, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
