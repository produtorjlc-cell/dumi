// Estilo 04 · "Mesa de banquete" — derivado de ref-banner-pratos (EXEMPLO HERO 2.png:
// colagem de vários pratos sobre a mesa escura, marca no centro, fileira de bandeirinhas).
//
// Arquitetura: COLAGEM DE PRATOS. No modo full a mesma foto do prato (EM COR) aparece em
// três "pratos" circulares de tamanhos diferentes — grande sangrando pela esquerda, médio
// e pequeno à direita com zoom crescente (efeito de mesa cheia vista de cima) — com aro
// branco e sombra em camadas; o texto fica centralizado embaixo, como a marca no banner.
// Papel: branco com os três pratos em fileira no topo. Marinho: preto com pratos vazios
// (contornos) nos cantos. Progresso em BANDEIRINHAS retangulares (a atual vermelha) no
// lugar das bandeiras dos países. Tipografia: Poppins (títulos SemiBold/Bold, corpo
// Light) + Great Vibes só em destaque curto (linha em itálico com até 3 palavras).
// Lista em pílulas vermelhas, número em círculo cheio, CTA em caixa vermelha.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, flor, posDe, dicaDe, seta } from "./_comum.mjs";

const SANS = "Poppins";
const SCRIPT = "Great Vibes";

const estilo = {
  id: "ref-banner-pratos",
  nome: "Mesa de banquete",
  grao: 0.04,
  familias: {
    [SANS]: ["poppins/Poppins-Light.ttf", "poppins/Poppins-Regular.ttf", "poppins/Poppins-Italic.ttf", "poppins/Poppins-Medium.ttf", "poppins/Poppins-SemiBold.ttf", "poppins/Poppins-Bold.ttf"],
    [SCRIPT]: ["great-vibes/GreatVibes-Regular.ttf"],
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
    const L = W - 2 * (story ? 130 : 110);
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.6) : rgba(P.branco, 0.72);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <radialGradient id="mesa" cx="50%" cy="35%" r="80%">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="${papel ? 0 : 0.05}"/>
        <stop offset="1" stop-color="#000000" stop-opacity="${papel ? 0 : 0.5}"/>
      </radialGradient>
      <filter id="sombraPrato" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>`;

    /* ---------- marca (canto) e bandeirinhas de progresso ---------- */
    let moldura =
      flor(f.mx + 14, f.molduraTopo - 8, 14, verm) +
      T(f.mx + 38, f.molduraTopo, "DUMI", { fam: SANS, peso: 700, tam: 30, c: tinta, ls: 2 }) +
      T(f.mx + 38 + medir("DUMI", { fam: SANS, peso: 700, tam: 30, ls: 2 }) + 14, f.molduraTopo - 2, "SABORES ORIENTAIS", { fam: SANS, peso: 400, tam: 15, c: suave, ls: 3 });
    const bw = 34;
    const bg = 10;
    const x0 = cx - (total * bw + (total - 1) * bg) / 2;
    for (let k = 0; k < total; k++) {
      const x = x0 + k * (bw + bg);
      moldura +=
        k === idx
          ? `<rect x="${x}" y="${f.molduraBase - 22}" width="${bw}" height="22" fill="${verm}"/>`
          : `<rect x="${x + 0.75}" y="${f.molduraBase - 21.25}" width="${bw - 1.5}" height="20.5" fill="none" stroke="${rgba(tinta, 0.45)}" stroke-width="1.5"/>`;
    }
    const d = dicaDe(s);
    if (d) moldura += T(W - f.mx - 44, f.molduraBase - 4, d, { fam: SANS, peso: 600, tam: 18, c: tinta, a: "end", ls: 2 }) + seta(W - f.mx, f.molduraBase - 10, verm, { w: 30 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) => {
      const curta = ln.t.trim().split(/\s+/).length <= 3;
      if (ln.italico && curta)
        return { fam: SCRIPT, peso: 400, tam: Math.round(ln.tam * 1.42), c: ln.cor === "principal" ? verm : corTok(ln.cor) };
      if (ln.italico) return { fam: SANS, peso: 300, tam: Math.round(ln.tam * 0.86), it: true, c: ln.cor === "principal" ? verm : corTok(ln.cor) };
      return { fam: SANS, peso: ln.peso >= 700 ? 700 : 600, tam: Math.round(ln.tam * 0.9), c: corTok(ln.cor), ls: -0.5 };
    };
    const { blocos: B, pe } = blocos(c, {
      x: cx,
      L,
      a: "middle",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.08,
      rot: { fam: SANS, peso: 600, ls: 3 },
      corpo: { fam: SANS, peso: 300, tam: story ? 34 : 31, lh: 1.45 },
      numero: { variante: "circulo", fam: SANS, peso: 700, raio: story ? 96 : 86 },
      caixa: { fam: SANS, peso: 600, tam: 38, h: 84, ls: 2 },
      citacao: { fam: SANS, peso: 300, it: true, tam: story ? 50 : 46, aspasFam: SCRIPT },
      lista: { variante: "chips", fam: SANS, peso: 500, tam: story ? 38 : 35, rotTam: 18 },
      tarja: { fam: SANS, peso: 300 },
      cta: { variante: "caixa", fam: SANS, peso: 700, tam: story ? 104 : 94, ls: 2, linkFam: SANS, linkPeso: 300, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const eyebrow = (y) =>
      s.eyebrow
        ? T(cx, y - 6, s.eyebrow.toUpperCase(), { fam: SANS, peso: 600, tam: 21, c: verm, a: "middle", ls: 5 })
        : "";

    /** Prato: sombra + foto circular + aro branco. */
    const pratos = [];
    const prato = (arq, pos, x, y, dd, zoom) => pratos.push({ arq, pos, x, y, d: dd, zoom });

    const camadas = [];
    let topo = f.areaTopo;
    let ancora = s.ancora ?? "centro";
    let svgEb = "";

    if (s.modo === "full") {
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${P.escuro}"/><rect width="${W}" height="${H}" fill="url(#mesa)"/>` });
      const yTexto = f.areaBase - hTexto - (s.eyebrow ? 70 : 0);
      const top = f.molduraTopo + 40;
      const rh = Math.max(story ? 700 : 420, yTexto - 50 - top);
      const d1 = Math.min(rh * 0.86, W * 0.7);
      const z = s.zoom ?? 1;
      const p = posDe(c, s.pos);
      prato(s.fotoAbs, p, W * 0.36 - d1 / 2, top + rh * 0.5 - d1 / 2, d1, z);
      const xm = Math.min(W * 0.8, W - 44 - d1 * 0.29);
      const xp = Math.min(W * 0.82, W - 50 - d1 * 0.18);
      prato(s.fotoAbs, p, xm - d1 * 0.29, top + rh * 0.72 - d1 * 0.29, d1 * 0.58, z * 1.7);
      prato(s.fotoAbs, p, xp - d1 * 0.18, top + rh * 0.2 - d1 * 0.18, d1 * 0.36, z * 2.5);
      topo = top + rh + 50 + (s.eyebrow ? 70 : 0);
      if (s.eyebrow) svgEb = eyebrow(topo - 26);
      ancora = "topo";
    } else {
      let orn = "";
      if (!papel) {
        const cs = [
          [W * 0.06, H * 0.12, 210],
          [W * 0.98, H * 0.3, 160],
          [W * 0.02, H * 0.88, 180],
          [W * 0.93, H * 0.94, 240],
        ];
        for (const [x, y, r] of cs)
          orn += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${rgba(P.branco, 0.09)}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="none" stroke="${rgba(P.branco, 0.06)}" stroke-width="1.2"/>`;
      }
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/><rect width="${W}" height="${H}" fill="url(#mesa)"/>${orn}` });
      if (s.faixa) {
        const dd = Math.min(s.faixa.altura * H * 1.05, L * 0.46);
        const y = f.areaTopo + 10;
        const z = s.zoom ?? 1;
        const p = posDe(c, s.faixa.pos);
        prato(s.faixa.fotoAbs, p, cx - dd * 1.12, y + dd * 0.18, dd * 0.7, z * 1.6);
        prato(s.faixa.fotoAbs, p, cx + dd * 0.42, y + dd * 0.18, dd * 0.7, z * 2.2);
        prato(s.faixa.fotoAbs, p, cx - dd / 2, y, dd, z);
        topo = y + dd + 56 + (s.eyebrow ? 66 : 0);
        if (s.eyebrow) svgEb = eyebrow(topo - 24);
        ancora = "topo";
        if (topo + hTexto < f.areaBase) topo += Math.min(60, (f.areaBase - topo - hTexto) / 3);
      } else if (s.eyebrow) {
        const yTop = Math.max(f.areaTopo + 50, f.areaTopo + (f.areaBase - f.areaTopo - hTexto - 66) / 2 + 66);
        svgEb = eyebrow(yTop - 24);
        topo = yTop;
        ancora = "topo";
      }
    }

    if (pratos.length) {
      camadas.push({
        svg: `${defs}` + pratos.map((q) => `<circle cx="${q.x + q.d / 2 + 6}" cy="${q.y + q.d / 2 + 22}" r="${q.d / 2 + 6}" fill="#000000" opacity="${papel ? 0.3 : 0.75}" filter="url(#sombraPrato)"/>`).join(""),
      });
      for (const q of pratos) {
        camadas.push({ foto: { arquivo: q.arq, x: q.x, y: q.y, w: q.d, h: q.d, pos: q.pos, zoom: Math.min(3, q.zoom), tratamento: "cor", mascara: "circulo" } });
        camadas.push({ svg: `<circle cx="${q.x + q.d / 2}" cy="${q.y + q.d / 2}" r="${q.d / 2 + 4}" fill="none" stroke="${P.branco}" stroke-width="${papel ? 0 : 7}"/>` + (papel ? `<circle cx="${q.x + q.d / 2}" cy="${q.y + q.d / 2}" r="${q.d / 2 + 10}" fill="none" stroke="${verm}" stroke-width="2"/>` : "") });
      }
    }

    const r = kit.empilhar(todos, topo, f.areaBase, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgEb}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
