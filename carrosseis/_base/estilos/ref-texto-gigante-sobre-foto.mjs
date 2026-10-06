// Estilo 12 · "Sobre a foto" — derivado de ref-texto-gigante-sobre-foto (web: tendência
// de foto do dia a dia com TEXTO SUPERDIMENSIONADO direto sobre a imagem, sem caixa).
// Base: a descrição registrada em referencias.md.
//
// Arquitetura: CARTAZ JUSTIFICADO. Cada linha do título é escalada até ocupar a largura
// inteira da coluna (linhas curtas ficam enormes, longas ficam menores — todas com a mesma
// largura, como um cartaz tipográfico), em Barlow Condensed Bold caixa alta com entrelinha
// apertada; a ênfase em itálico vira Instrument Serif itálico também justificado. Foto EM
// COR sangrando a tela em todo slide que tenha foto (full e também papel/marinho com
// faixa), escurecida o suficiente para o texto branco sem caixa nenhuma. Sem foto: papel
// branco (tinta preta, ênfase vermelha) ou preto (branco + vermelho). Moldura mínima:
// DUMI e contador no topo, fio fino e "sabores orientais" na base.
// Tipografia: Barlow Condensed + Instrument Serif.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, caber } from "./_comum.mjs";

const COND = "Barlow Condensed";
const SERIF = "Instrument Serif";

const estilo = {
  id: "ref-texto-gigante-sobre-foto",
  nome: "Sobre a foto",
  grao: 0.05,
  familias: {
    [COND]: ["barlow-condensed/BarlowCondensed-Regular.ttf", "barlow-condensed/BarlowCondensed-SemiBold.ttf", "barlow-condensed/BarlowCondensed-Bold.ttf"],
    [SERIF]: ["instrument-serif/InstrumentSerif-Regular.ttf", "instrument-serif/InstrumentSerif-Italic.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const arqFoto = s.modo === "full" ? s.fotoAbs : s.faixa?.fotoAbs;
    const posFoto = posDe(c, s.modo === "full" ? s.pos : s.faixa?.pos);
    const comFoto = !!arqFoto;
    const claro = !comFoto && s.modo === "papel";
    const X0 = f.mx;
    const XR = W - (story ? 120 : 90);
    const L = XR - X0;
    const tinta = claro ? P.escuro : P.branco;
    const suave = claro ? rgba(P.escuro, 0.62) : rgba(P.branco, 0.82);
    const verm = P.acento;
    const enfase = comFoto ? P.branco : verm;
    const corTok = (t) => {
      const nome = kit.papel(String(t).split("/")[0]);
      if ((nome === "acento" || nome === "acento2") && comFoto) return P.branco;
      return kit.cor(t, !claro, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });
    };

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <linearGradient id="escuro" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0.45"/>
        <stop offset="0.25" stop-color="#000000" stop-opacity="0.05"/>
        <stop offset="0.55" stop-color="#000000" stop-opacity="0.25"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.82"/>
      </linearGradient>
      <filter id="sT" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.55"/></filter>
    </defs>`;
    const extra = comFoto ? `filter="url(#sT)"` : "";

    /* ---------- título justificado ---------- */
    const tituloBloco = (linhas, nome) => {
      const it = linhas.map((ln) => {
        const t = ln.italico ? ln.t : ln.t.toUpperCase();
        const base = ln.italico ? { fam: SERIF, peso: 400, it: true, tam: 100 } : { fam: COND, peso: 700, tam: 100, ls: 1 };
        const w = medir(t, base);
        const tam = Math.min(Math.round((100 * L) / w), Math.round(ln.tam * (story ? 3.4 : 3.1)), story ? 330 : 300);
        const nomeCor = kit.papel(String(ln.cor).split("/")[0]);
        const cor = ln.italico && ln.cor === "principal" ? enfase : corTok(ln.cor);
        return { t, e: { ...base, tam, c: nomeCor === "principal" && !ln.italico ? tinta : cor } };
      });
      const alt = it.map((q) => q.e.tam * (q.e.fam === COND ? 0.74 : 0.78));
      const gap = 16;
      return {
        tipo: nome,
        h: alt.reduce((p, q) => p + q, 0) + gap * (it.length - 1) + 10 + it.at(-1).e.tam * 0.24, // folga de descendentes (p, ç)
        desenhar: (y0) => {
          let y = y0;
          return it
            .map((q, k) => {
              y += alt[k];
              const g = T(X0, y, q.t, { ...q.e, extra });
              y += gap;
              return g;
            })
            .join("");
        },
      };
    };

    const { blocos: B, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque: comFoto ? P.branco : verm,
      contraDestaque: comFoto ? P.escuro : P.branco,
      tituloBloco,
      extra,
      rot: { fam: COND, peso: 700, ls: 4 },
      corpo: { fam: SERIF, peso: 400, tam: story ? 44 : 40, lh: 1.25, largura: L - 40 },
      numero: { variante: "lado", fam: COND, peso: 700, tam: story ? 300 : 270 },
      caixa: { fam: COND, peso: 700, tam: 44, h: 80, ls: 3, fundo: verm, c: P.branco },
      citacao: { fam: SERIF, it: true, tam: story ? 76 : 70 },
      lista: { variante: "regua", fam: COND, peso: 600, tam: story ? 44 : 40, rotTam: 22, col: 200 },
      tarja: { fam: SERIF, it: true },
      cta: { variante: "sublinhado", fam: COND, peso: 700, tam: story ? 210 : 190, ls: 2, linkFam: SERIF, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    /* ---------- fundo ---------- */
    const camadas = [];
    if (comFoto) {
      camadas.push({ foto: { arquivo: arqFoto, x: 0, y: 0, w: W, h: H, pos: posFoto, zoom: s.zoom ?? 1, tratamento: "cor", escurecer: s.modo === "full" ? 0.12 : 0.3 } });
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#escuro)"/>` });
    } else camadas.push({ svg: `<rect width="${W}" height="${H}" fill="${claro ? P.claro : P.escuro}"/>` });

    /* ---------- moldura mínima ---------- */
    let moldura =
      T(X0, f.molduraTopo, "DUMI", { fam: COND, peso: 700, tam: 32, c: tinta, ls: 5, extra }) +
      T(XR, f.molduraTopo, `${pad(idx + 1)} — ${pad(total)}`, { fam: COND, peso: 600, tam: 24, c: suave, a: "end", ls: 3, extra }) +
      `<line x1="${X0}" y1="${f.molduraBase - 34}" x2="${XR}" y2="${f.molduraBase - 34}" stroke="${rgba(tinta, 0.4)}" stroke-width="1.2"/>` +
      T(X0, f.molduraBase, "sabores orientais", { fam: SERIF, tam: 26, it: true, c: suave, extra });
    const d = dicaDe(s);
    if (d) moldura += T(XR - 44, f.molduraBase, d, { fam: COND, peso: 700, tam: 22, c: tinta, a: "end", ls: 3, extra }) + seta(XR, f.molduraBase - 7, comFoto ? P.branco : verm, { w: 30 });

    const ebH = s.eyebrow ? 60 : 0;
    const ancora = s.ancora ?? (comFoto ? "base" : "centro");
    let topo = f.areaTopo + ebH;
    if (ancora === "centro") topo = Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
    if (ancora === "base") topo = Math.max(f.areaTopo + ebH, f.areaBase - hTexto);
    const eb = s.eyebrow ? T(X0, topo - 30, s.eyebrow.toUpperCase(), { fam: COND, peso: 700, tam: 26, c: comFoto ? P.branco : verm, ls: 6, extra }) + `<rect x="${X0}" y="${topo - 22}" width="60" height="4" fill="${verm}"/>` : "";

    const r = kit.empilhar(todos, topo, f.areaBase, "topo", { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${eb}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
