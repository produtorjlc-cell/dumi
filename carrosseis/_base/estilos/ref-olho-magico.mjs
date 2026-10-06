// Estilo 03 · "Olho mágico" — derivado de ref-olho-magico (DELIVERY DUMI.png: a cena
// vista por um olho mágico — moldura circular escura, luz quente, logo pequeno no topo).
//
// Arquitetura: tudo CENTRALIZADO num eixo vertical. No modo full a foto do prato (EM COR)
// vive dentro de uma LENTE circular grande — aro preto grosso, anéis concêntricos finos
// (branco e um arco vermelho), vinheta interna de lente e um halo de luz em volta, sobre o
// preto da "porta". O texto fica na faixa escura de baixo. Papel: branco, a foto da faixa
// vira uma lente menor no topo. Marinho: preto com anéis vermelhos concêntricos irradiando
// do centro (a "lente" sem a foto). Marca empilhada no topo (flor + DUMI + "- SABORES
// ORIENTAIS -"), contador mono na base. Tipografia: Instrument Serif (títulos, itálico
// vermelho) + Space Mono (rótulos, corpo técnico). Lista numerada em círculos, número
// vazado, CTA em pílula contornada (ecos da lente).
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, flor, posDe, pad, dicaDe, seta } from "./_comum.mjs";

const SERIF = "Instrument Serif";
const MONO = "Space Mono";

const estilo = {
  id: "ref-olho-magico",
  nome: "Olho mágico",
  grao: 0.05,
  familias: {
    [SERIF]: ["instrument-serif/InstrumentSerif-Regular.ttf", "instrument-serif/InstrumentSerif-Italic.ttf"],
    [MONO]: ["space-mono/SpaceMono-Regular.ttf", "space-mono/SpaceMono-Bold.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const cx = W / 2;
    const story = c.formato === "story";
    const papel = s.modo === "papel";
    const L = W - 2 * (story ? 150 : 120);
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.62) : rgba(P.branco, 0.7);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <radialGradient id="lenteVinheta" cx="50%" cy="50%" r="50%">
        <stop offset="0.62" stop-color="#000000" stop-opacity="0"/>
        <stop offset="0.9" stop-color="#000000" stop-opacity="0.38"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.85"/>
      </radialGradient>
      <radialGradient id="porta" cx="50%" cy="40%" r="70%">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.07"/>
        <stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.015"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.6"/>
      </radialGradient>
    </defs>`;

    /* ---------- marca no topo e contador na base ---------- */
    const yF = f.molduraTopo - 22;
    let moldura =
      flor(cx, yF, 15, verm) +
      T(cx, f.molduraTopo + 30, "DUMI", { fam: SERIF, tam: 46, c: tinta, a: "middle", ls: 6 }) +
      T(cx, f.molduraTopo + 56, "- SABORES ORIENTAIS -", { fam: MONO, peso: 400, tam: 13, c: suave, a: "middle", ls: 4 });
    moldura += T(cx, f.molduraBase, `${pad(idx + 1)} — ${pad(total)}`, { fam: MONO, peso: 700, tam: 18, c: suave, a: "middle", ls: 3 });
    const d = dicaDe(s);
    if (d) moldura += T(W - f.mx - 44, f.molduraBase, d, { fam: MONO, peso: 700, tam: 17, c: tinta, a: "end", ls: 2 }) + seta(W - f.mx, f.molduraBase - 6, verm, { w: 30 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) => ({
      fam: SERIF,
      peso: 400,
      tam: Math.round(ln.tam * (ln.peso >= 700 ? 1.18 : 1.08)),
      it: ln.italico,
      c: ln.italico && ln.cor === "principal" ? verm : corTok(ln.cor),
    });
    const { blocos: B, pe } = blocos(c, {
      x: cx,
      L,
      a: "middle",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.0,
      rot: { fam: MONO, peso: 700, ls: 3 },
      corpo: { fam: MONO, peso: 400, tam: story ? 32 : 30, lh: 1.5, c: rgba(tinta, 0.9) },
      numero: { variante: "vazado", fam: SERIF, tam: story ? 260 : 230, traco: 2.4 },
      caixa: { fam: MONO, peso: 700, tam: 34, h: 78, ls: 3 },
      citacao: { fam: SERIF, it: true, tam: story ? 64 : 58 },
      lista: { variante: "numerada", fam: SERIF, peso: 400, tam: story ? 46 : 42, rotTam: 18 },
      tarja: { fam: MONO, it: false },
      cta: { variante: "contorno", fam: SERIF, tam: story ? 128 : 116, ls: 1, linkFam: SERIF, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const eyebrow = (y) => {
      if (!s.eyebrow) return "";
      const t = s.eyebrow.toUpperCase();
      const w = medir(t, { fam: MONO, peso: 700, tam: 20, ls: 4 });
      return (
        `<line x1="${cx - w / 2 - 70}" y1="${y - 7}" x2="${cx - w / 2 - 22}" y2="${y - 7}" stroke="${verm}" stroke-width="2"/>` +
        `<line x1="${cx + w / 2 + 22}" y1="${y - 7}" x2="${cx + w / 2 + 70}" y2="${y - 7}" stroke="${verm}" stroke-width="2"/>` +
        T(cx, y, t, { fam: MONO, peso: 700, tam: 20, c: papel ? verm : P.branco, a: "middle", ls: 4 })
      );
    };

    /** Aro da lente (por cima da foto). */
    const aro = (ycx, R, escuro) =>
      `<circle cx="${cx}" cy="${ycx}" r="${R}" fill="url(#lenteVinheta)"/>` +
      `<circle cx="${cx}" cy="${ycx}" r="${R + 15}" fill="none" stroke="${escuro ? "#000000" : P.escuro}" stroke-width="30"/>` +
      `<circle cx="${cx}" cy="${ycx}" r="${R + 31}" fill="none" stroke="${rgba(escuro ? P.branco : P.escuro, 0.22)}" stroke-width="1.4"/>` +
      `<circle cx="${cx}" cy="${ycx}" r="${R + 44}" fill="none" stroke="${verm}" stroke-width="2.6" stroke-dasharray="${(R + 44) * 1.1} ${(R + 44) * 5.2}" transform="rotate(200 ${cx} ${ycx})"/>` +
      `<circle cx="${cx}" cy="${ycx}" r="${R + 58}" fill="none" stroke="${rgba(escuro ? P.branco : P.escuro, 0.1)}" stroke-width="1"/>`;

    const camadas = [];
    let svgCima = "";
    let topo = f.areaTopo;
    let base = f.areaBase;
    let ancora = s.ancora ?? "centro";
    let yEb = null;

    if (s.modo === "full") {
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${P.escuro}"/><rect width="${W}" height="${H}" fill="url(#porta)"/>` });
      const yTexto = f.areaBase - hTexto;
      const limTopo = f.molduraTopo + 82 + 62; // marca + espessura dos anéis
      const limBase = yTexto - (s.eyebrow ? 84 : 40) - 60;
      let R = Math.min(W / 2 - 96, (limBase - limTopo) / 2);
      if (R < 210) {
        R = 210;
        c.erro(`slide ${idx + 1} (${c.formato}): pouco espaço para a lente — encurte o texto`);
      }
      const ycx = limTopo + (limBase - limTopo) / 2;
      camadas.push({ foto: { arquivo: s.fotoAbs, x: cx - R, y: ycx - R, w: 2 * R, h: 2 * R, pos: posDe(c, s.pos), zoom: s.zoom ?? 1, tratamento: "cor", mascara: "circulo" } });
      svgCima += aro(ycx, R, true);
      topo = ycx + R + 60 + (s.eyebrow ? 84 : 40);
      yEb = topo - 46;
      ancora = "topo";
    } else {
      let fundo = papel ? P.claro : P.escuro;
      let orn = "";
      if (!papel) {
        for (let r = 140; r < H; r += 96) orn += `<circle cx="${cx}" cy="${H / 2}" r="${r}" fill="none" stroke="${verm}" stroke-width="${r % 192 === 140 % 192 ? 2 : 1}" opacity="${Math.max(0.04, 0.2 - r / 5000)}"/>`;
        orn += `<rect width="${W}" height="${H}" fill="url(#porta)"/>`;
      }
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${fundo}"/>${orn}` });
      if (s.faixa) {
        const R = Math.min(L / 2 - 20, (s.faixa.altura * H) / 2 + 30);
        const ycx = f.areaTopo + 30 + R;
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: cx - R, y: ycx - R, w: 2 * R, h: 2 * R, pos: posDe(c, s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor", mascara: "circulo" } });
        svgCima += aro(ycx, R, !papel);
        topo = ycx + R + 70 + (s.eyebrow ? 70 : 0);
        yEb = topo - 46;
      } else if (s.eyebrow) {
        // eyebrow logo acima do bloco centralizado
        const yTop = Math.max(f.areaTopo + 60, f.areaTopo + (f.areaBase - f.areaTopo - hTexto) / 2);
        yEb = yTop - 10;
        topo = yTop + 30;
        ancora = "topo";
      }
    }
    if (yEb !== null) svgCima += eyebrow(yEb);

    const r = kit.empilhar(todos, topo, base, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
