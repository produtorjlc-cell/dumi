// Estilo 07 · "Nome gigante" — derivado de ref-nome-gigante (post "UDON" do perfil:
// o nome do prato GIGANTE em vermelho sobre a tigela vista de cima e um subtítulo
// minúsculo embaixo).
//
// Arquitetura: UMA PALAVRA DOMINA. A primeira linha do título vira um letreiro em Bebas
// Neue que ocupa a largura toda (vermelho; vazado em branco no marinho); as demais linhas
// encolhem para um subtítulo em Space Mono caixa alta, como a legenda miúda do post.
// Full: foto EM COR sangrando, de cima, com o letreiro atravessando a parte de baixo
// (sombra para separar do prato). Papel: branco, foto da faixa em bloco largo no topo e o
// letreiro MORDENDO a borda de baixo da foto (metade sobre a foto, metade no papel).
// Marinho: preto, letreiro vazado. Número também gigante e vazado. Cabeçalho e rodapé em
// mono minúsculo ("Nº 03/07", "DUMI — SABORES ORIENTAIS"), tudo centralizado.
// Tipografia: Bebas Neue + Space Mono.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, caber } from "./_comum.mjs";

const DISPLAY = "Bebas Neue";
const MONO = "Space Mono";

const estilo = {
  id: "ref-nome-gigante",
  nome: "Nome gigante",
  grao: 0.04,
  familias: {
    [DISPLAY]: ["bebas-neue/BebasNeue-Regular.ttf"],
    [MONO]: ["space-mono/SpaceMono-Regular.ttf", "space-mono/SpaceMono-Bold.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir, quebrar } = fontes;
    const W = f.W;
    const H = f.H;
    const cx = W / 2;
    const story = c.formato === "story";
    const full = s.modo === "full";
    const papel = s.modo === "papel";
    const L = W - 2 * (story ? 110 : 70);
    const Lt = W - 2 * (story ? 150 : 120); // coluna do texto miúdo
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.6) : rgba(P.branco, 0.75);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <filter id="sombraG" x="-10%" y="-30%" width="120%" height="170%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.55"/>
      </filter>
      <linearGradient id="pe" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.45" stop-color="#000000" stop-opacity="0"/>
        <stop offset="0.8" stop-color="#000000" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="topoG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0.55"/>
        <stop offset="0.16" stop-color="#000000" stop-opacity="0"/>
      </linearGradient>
    </defs>`;
    const sombra = full ? `filter="url(#sombraG)"` : "";

    /* ---------- mono minúsculo no topo e na base ---------- */
    const mono = (x, y, t, o = {}) => T(x, y, t, { fam: MONO, peso: 700, tam: 17, c: full ? P.branco : suave, ls: 3, ...o });
    let moldura =
      mono(f.mx, f.molduraTopo, `Nº ${pad(idx + 1)}/${pad(total)}`) +
      mono(W - f.mx, f.molduraTopo, "DUMI", { a: "end", c: full ? P.branco : tinta, tam: 20, ls: 6 }) +
      mono(cx, f.molduraBase, "DUMI — SABORES ORIENTAIS", { a: "middle", tam: 15, ls: 5 });
    const d = dicaDe(s);
    if (d) moldura += mono(W - f.mx - 42, f.molduraBase, d, { a: "end", c: full ? P.branco : tinta }) + seta(W - f.mx, f.molduraBase - 6, verm, { w: 28 });

    /* ---------- título: 1ª linha letreiro, resto subtítulo mono ---------- */
    let hGigante = 0;
    const tituloBloco = (linhas, nome) => {
      const [l0, ...resto] = linhas;
      const t0 = l0.t.toUpperCase();
      const vazado = s.modo === "marinho";
      const nomeCor = kit.papel(String(l0.cor).split("/")[0]);
      const c0 = nomeCor === "branco" || nomeCor === "claro" ? tinta : verm;
      const e0 = caber(medir, t0, { fam: DISPLAY, tam: Math.min(story ? 360 : 330, Math.round(l0.tam * 3.4)), ls: 2 }, L);
      const ac = e0.tam * 0.13; // folga para acentos (Á, Ã)
      const h0 = e0.tam * 0.7 + ac;
      hGigante = nome === "titulo" ? h0 - ac : hGigante;
      const sub = resto.flatMap((ln) => {
        const e = { fam: MONO, peso: 700, tam: Math.max(28, Math.min(story ? 46 : 42, Math.round(ln.tam * 0.5))), ls: 2, c: ln.italico ? (papel ? verm : P.branco) : corTok(ln.cor) };
        return quebrar(ln.t.toUpperCase(), e, Lt).map((t) => ({ t, e }));
      });
      const lhS = sub.length ? sub[0].e.tam * 1.35 : 0;
      return {
        tipo: nome,
        h: h0 + (sub.length ? 34 + sub.length * lhS : 0),
        desenhar: (y) =>
          T(cx, y + h0, t0, { ...e0, a: "middle", c: vazado ? "none" : c0, extra: vazado ? `stroke="${P.branco}" stroke-width="3"` : sombra }) +
          sub.map((q, k) => T(cx, y + h0 + 34 + q.e.tam * 0.8 + k * lhS, q.t, { ...q.e, a: "middle", extra: sombra })).join(""),
      };
    };

    const { blocos: B, pe } = blocos(c, {
      x: cx,
      L: Lt,
      a: "middle",
      tinta,
      suave,
      destaque: verm,
      tituloBloco,
      extra: sombra,
      rot: { fam: MONO, peso: 700, ls: 3 },
      corpo: { fam: MONO, peso: 400, tam: story ? 31 : 28, lh: 1.55 },
      numero: { variante: "vazado", fam: DISPLAY, tam: story ? 400 : 360, traco: 3 },
      caixa: { fam: DISPLAY, tam: 58, h: 88, ls: 4 },
      citacao: { fam: DISPLAY, peso: 400, it: false, tam: story ? 92 : 84 },
      lista: { variante: "pontilhado", fam: MONO, peso: 700, tam: story ? 34 : 31, rotTam: 20 },
      tarja: { fam: MONO, it: false },
      cta: { variante: "sublinhado", fam: DISPLAY, tam: story ? 230 : 210, ls: 4, linkFam: MONO, linkPeso: 700 },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const eyebrow = (y) => (s.eyebrow ? T(cx, y, `[ ${s.eyebrow.toUpperCase()} ]`, { fam: MONO, peso: 700, tam: 20, c: full ? P.branco : verm, a: "middle", ls: 3, extra: sombra }) : "");
    const ebH = s.eyebrow ? 56 : 0;

    const camadas = [];
    let svgCima = "";
    let topo;
    let ancora = "topo";
    if (full) {
      camadas.push({ foto: { arquivo: s.fotoAbs, x: 0, y: 0, w: W, h: H, pos: posDe(c, s.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#pe)"/><rect width="${W}" height="${H}" fill="url(#topoG)"/>` });
      topo = f.areaBase - hTexto;
      svgCima += eyebrow(topo - 34);
    } else {
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>` });
      if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H * 1.15);
        const yF = f.areaTopo + ebH;
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: f.mx, y: yF, w: W - 2 * f.mx, h: hF, pos: posDe(c, s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
        svgCima += eyebrow(yF - 24);
        // letreiro morde a borda de baixo da foto
        topo = B[0]?.tipo === "titulo" ? yF + hF - hGigante * 0.5 : yF + hF + 50;
      } else {
        topo = Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
        svgCima += eyebrow(topo - 34);
      }
    }

    const r = kit.empilhar(todos, topo, f.areaBase, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
