// Estilo 13 · "Polaroide de bastidor" — derivado de ref-bastidor-celular (web: tendência
// de fotos reais de celular, sem polimento, com TEXTO GRANDE sobreposto — autenticidade
// em vez de arte). Base: a descrição registrada em referencias.md.
//
// Arquitetura: ÁLBUM DE BASTIDOR. A foto EM COR vira uma polaroide (moldura branca com a
// faixa de baixo mais larga), girada de leve sobre a mesa preta, com legenda manuscrita
// curta (Great Vibes) na faixa da polaroide e uma tira de fita no topo. O texto grande em
// Lato Black entra por cima, invadindo a borda de baixo da polaroide, com sombra dura —
// cara de story caseiro. Papel: mesa branca com a polaroide da faixa menor e girada para o
// outro lado. Marinho: mesa preta com duas polaroides vazias empilhadas ao fundo (só a
// moldura, a 8%). Contador em "rolo de filme" (quadradinhos) e DUMI no topo.
// Tipografia: Lato (Black/Bold/Light) + Great Vibes (só legenda curta).
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, dicaDe, seta } from "./_comum.mjs";

const SANS = "Lato";
const SCRIPT = "Great Vibes";

const estilo = {
  id: "ref-bastidor-celular",
  nome: "Polaroide de bastidor",
  grao: 0.07,
  familias: {
    [SANS]: ["lato/Lato-Light.ttf", "lato/Lato-Regular.ttf", "lato/Lato-Italic.ttf", "lato/Lato-Bold.ttf", "lato/Lato-Black.ttf"],
    [SCRIPT]: ["great-vibes/GreatVibes-Regular.ttf"],
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
    const suave = papel ? rgba(P.escuro, 0.6) : rgba(P.branco, 0.78);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <filter id="dura" x="-10%" y="-20%" width="130%" height="160%"><feDropShadow dx="5" dy="6" stdDeviation="0.5" flood-color="#000000" flood-opacity="0.85"/></filter>
    </defs>`;
    const extra = papel ? "" : `filter="url(#dura)"`;

    /* ---------- marca + rolo de filme ---------- */
    let moldura =
      T(X0, f.molduraTopo, "DUMI", { fam: SANS, peso: 900, tam: 30, c: tinta, ls: 4 }) +
      T(X0 + medir("DUMI", { fam: SANS, peso: 900, tam: 30, ls: 4 }) + 16, f.molduraTopo, "Sabores Orientais", { fam: SCRIPT, tam: 34, c: verm });
    const q = 16;
    const xF = XR - total * (q + 6);
    for (let k = 0; k < total; k++)
      moldura += `<rect x="${xF + k * (q + 6)}" y="${f.molduraTopo - q}" width="${q}" height="${q}" fill="${k === idx ? verm : "none"}" stroke="${k === idx ? verm : rgba(tinta, 0.5)}" stroke-width="1.6"/>`;
    const d = dicaDe(s);
    if (d) moldura += T(XR - 44, f.molduraBase, d, { fam: SANS, peso: 900, tam: 19, c: tinta, a: "end", ls: 3 }) + seta(XR, f.molduraBase - 6, verm, { w: 30 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) =>
      ln.italico
        ? { fam: SANS, peso: 400, tam: Math.round(ln.tam * (full ? 1.12 : 0.98)), it: true, c: ln.cor === "principal" ? (full ? P.branco : verm) : corTok(ln.cor) }
        : { fam: SANS, peso: 900, tam: Math.round(ln.tam * (full ? 1.22 : 1.04)), c: corTok(ln.cor), ls: -1 };
    const { blocos: B, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.02,
      extra,
      rot: { fam: SANS, peso: 900, ls: 3 },
      corpo: { fam: SANS, peso: full ? 700 : 400, tam: story ? 34 : 31, lh: 1.45, largura: L - 40 },
      numero: { variante: "cima", fam: SANS, peso: 900, tam: story ? 240 : 210 },
      caixa: { fam: SANS, peso: 900, tam: 36, h: 76, ls: 2 },
      citacao: { fam: SANS, peso: 300, it: true, tam: story ? 52 : 48, aspasFam: SANS },
      lista: { variante: "chips", fam: SANS, peso: 700, tam: story ? 36 : 33, rotTam: 18 },
      tarja: { fam: SANS, peso: 400 },
      cta: { variante: "caixa", fam: SANS, peso: 900, tam: story ? 104 : 94, ls: 1, linkFam: SANS, linkPeso: 700 },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);
    const legendaFull = full && s.eyebrow && s.eyebrow.split(/\s+/).length <= 3; // eyebrow curto vira a legenda da polaroide
    const ebH = s.eyebrow && !legendaFull ? 60 : 0;

    /** Polaroide girada: moldura + foto + fita + legenda. */
    const camadas = [{ svg: `<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>` }];
    let svgCima = "";
    const polaroide = (arq, pos, x, y, w, giro, legenda) => {
      const m = Math.round(w * 0.045);
      const faixa = Math.round(w * 0.16);
      const ph = w - 2 * m;
      const h = m + ph + faixa;
      const cr = { x: x + w / 2, y: y + h / 2 };
      camadas.push({ svg: `${defs}<g transform="rotate(${giro} ${cr.x} ${cr.y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.branco}" filter="url(#k-camadas)"/></g>` });
      camadas.push({ foto: { arquivo: arq, x: x + m, y: y + m, w: w - 2 * m, h: ph, pos, zoom: s.zoom ?? 1, tratamento: "cor", rotacao: giro, centroRotacao: cr } });
      let g = `<g transform="rotate(${giro} ${cr.x} ${cr.y})">`;
      g += `<rect x="${cr.x - 90}" y="${y - 22}" width="180" height="44" fill="${rgba(P.branco, 0.55)}" transform="rotate(${-giro * 2} ${cr.x} ${y})"/>`;
      if (legenda) g += T(x + w - m - 10, y + m + ph + faixa * 0.66, legenda, { fam: SCRIPT, tam: Math.round(faixa * 0.5), c: P.escuro, a: "end" });
      g += `</g>`;
      camadas.push({ svg: g });
      return { h, y, giro };
    };

    let topo;
    if (full) {
      const yP = f.molduraTopo + 50;
      const dispH = f.areaBase - hTexto - ebH - 50 - yP; // texto branco nunca sobre a moldura branca
      const w = Math.max(W * 0.5, Math.min(W * (story ? 0.86 : 0.78), dispH / 1.12));
      const p = polaroide(s.fotoAbs, posDe(c, s.pos), (W - w) / 2 + 10, yP, w, -3, legendaFull ? s.eyebrow : "Dumi");
      topo = Math.max(p.y + p.h + 50 + ebH, f.areaBase - hTexto);
    } else if (papel && s.faixa) {
      const w = Math.min(W * 0.62, s.faixa.altura * H * 1.25);
      const p = polaroide(s.faixa.fotoAbs, posDe(c, s.faixa.pos), XR - w + 20, f.areaTopo - 40, w, 4, "Dumi");
      topo = p.y + p.h + 50 + ebH;
    } else {
      if (!papel) {
        for (const [gx, gy, gg] of [
          [W * 0.42, H * 0.12, 8],
          [W * 0.5, H * 0.16, -5],
        ])
          svgCima += `<g transform="rotate(${gg} ${gx + 260} ${gy + 300})" opacity="0.08"><rect x="${gx}" y="${gy}" width="520" height="600" fill="none" stroke="${P.branco}" stroke-width="3"/><rect x="${gx + 24}" y="${gy + 24}" width="472" height="472" fill="none" stroke="${P.branco}" stroke-width="2"/></g>`;
      }
      topo = Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
    }
    if (s.eyebrow && !legendaFull) svgCima += T(X0, topo - 26, s.eyebrow, { fam: SCRIPT, tam: 52, c: full ? P.branco : verm, extra });

    const r = kit.empilhar(todos, topo, f.areaBase, "topo", { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
