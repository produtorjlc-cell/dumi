// Estilo 11 · "Bilhete" — derivado de ref-bilhete-lembrete (web: tendência "Just checking
// if…" — tipografia grande e simples sobre foto ou fundo liso, cada slide parece um
// BILHETE). Base: a descrição registrada em referencias.md.
//
// Arquitetura: um BILHETE por slide. O conteúdo inteiro mora num papel branco levemente
// girado, preso por uma fita adesiva vermelha translúcida, com pauta fina de caderno,
// cabeçalho mono "LEMBRETE Nº 03" e assinatura "— Dumi" com a flor no pé. Texto grande e
// direto em Poppins, alinhado à esquerda, sempre tinta preta (ênfase vermelha). O fundo
// muda por modo: full = foto EM COR do prato sangrando a tela (o bilhete cobre só a parte
// de baixo); papel = mesa branca com a foto da faixa colada por fita acima do bilhete;
// marinho = preto liso. Tipografia: Poppins + Space Mono.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, flor } from "./_comum.mjs";

const SANS = "Poppins";
const MONO = "Space Mono";

const estilo = {
  id: "ref-bilhete-lembrete",
  nome: "Bilhete",
  grao: 0.03,
  familias: {
    [SANS]: ["poppins/Poppins-Light.ttf", "poppins/Poppins-Regular.ttf", "poppins/Poppins-Italic.ttf", "poppins/Poppins-Medium.ttf", "poppins/Poppins-SemiBold.ttf"],
    [MONO]: ["space-mono/SpaceMono-Regular.ttf", "space-mono/SpaceMono-Bold.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const papel = s.modo === "papel";
    const full = s.modo === "full";
    const padN = 64; // margem interna do bilhete
    const xN = f.mx - 20; // borda do bilhete
    const wN = W - 2 * xN - (story ? 30 : 0);
    const X0 = xN + padN;
    const L = wN - 2 * padN;
    const tinta = P.escuro;
    const suave = rgba(P.escuro, 0.6);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, false, { principal: [P.escuro, P.escuro], suave: [P.escuro, P.escuro] });
    const giro = [-1.6, 1.2, -0.8, 1.6][idx % 4];

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <linearGradient id="baixo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0.5"/><stop offset="0.14" stop-color="#000000" stop-opacity="0"/><stop offset="0.45" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.55"/>
      </linearGradient>
    </defs>`;

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) => ({
      fam: SANS,
      peso: ln.italico ? 400 : ln.peso >= 700 ? 600 : 500,
      tam: Math.round(ln.tam * 0.92),
      it: ln.italico,
      c: ln.italico && ln.cor === "principal" ? verm : corTok(ln.cor),
      ls: -0.8,
    });
    const { blocos: B, pe } = blocos(c, {
      x: X0,
      L,
      a: "start",
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 1.1,
      rot: { fam: MONO, peso: 700, ls: 2 },
      corpo: { fam: SANS, peso: 300, tam: story ? 34 : 31, lh: 1.5 },
      numero: { variante: "lado", fam: SANS, peso: 600, tam: story ? 200 : 180 },
      caixa: { fam: MONO, peso: 700, tam: 32, h: 72, ls: 2 },
      citacao: { fam: SANS, peso: 400, it: true, tam: story ? 50 : 46, aspasFam: MONO },
      lista: { variante: "numerada", fam: SANS, peso: 500, tam: story ? 36 : 33, rotTam: 18 },
      tarja: { fam: SANS, peso: 400, it: false },
      cta: { variante: "contorno", fam: SANS, peso: 600, tam: story ? 96 : 88, ls: 1, linkFam: SANS, linkPeso: 400, linkIt: true },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    /* ---------- o bilhete ---------- */
    const hCab = 70; // "LEMBRETE Nº" + eyebrow
    const hEb = s.eyebrow ? 56 : 0;
    const hPe = 86; // assinatura
    const hN = hCab + hEb + hTexto + hPe + 2 * 40;
    let yN;
    const camadas = [];
    let foto = "";
    if (full) {
      camadas.push({ foto: { arquivo: s.fotoAbs, x: 0, y: 0, w: W, h: H, pos: posDe(c, s.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#baixo)"/>` });
      yN = f.areaBase + 40 - hN;
    } else {
      camadas.push({ svg: `<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>` });
      if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H);
        const wF = Math.round(wN * 0.78);
        const xF = W / 2 - wF / 2 + 30;
        const yF = f.areaTopo - 50;
        const cr = { x: xF + wF / 2, y: yF + hF / 2 };
        camadas.push({ svg: `${defs}<g transform="rotate(3 ${cr.x} ${cr.y})"><rect x="${xF - 12}" y="${yF - 12}" width="${wF + 24}" height="${hF + 24}" fill="${P.branco}" filter="url(#k-sombra)"/></g>` });
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: xF, y: yF, w: wF, h: hF, pos: posDe(c, s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor", rotacao: 3, centroRotacao: cr } });
        foto = `<g transform="rotate(-6 ${cr.x} ${yF - 10})"><rect x="${cr.x - 80}" y="${yF - 34}" width="160" height="46" fill="${rgba(verm, 0.78)}"/></g>`;
        yN = Math.max(yF + hF + 40, f.areaBase + 40 - hN);
        if (yN + hN > f.areaBase + 60) yN = f.areaBase + 60 - hN;
      } else yN = Math.max(f.areaTopo - 40, (f.areaTopo + f.areaBase) / 2 - hN / 2);
    }
    const cxN = xN + wN / 2;
    const cyN = yN + hN / 2;
    let pauta = "";
    for (let y = yN + hCab + 40; y < yN + hN - 30; y += 48) pauta += `<line x1="${xN + 30}" y1="${y}" x2="${xN + wN - 30}" y2="${y}" stroke="${rgba(P.escuro, 0.06)}" stroke-width="1.2"/>`;
    const papelN =
      `<rect x="${xN}" y="${yN}" width="${wN}" height="${hN}" fill="${P.branco}" filter="url(#k-camadas)" ${papel ? `stroke="${rgba(P.escuro, 0.12)}" stroke-width="1.5"` : ""}/>` +
      pauta +
      `<line x1="${xN + 54}" y1="${yN}" x2="${xN + 54}" y2="${yN + hN}" stroke="${rgba(verm, 0.35)}" stroke-width="1.5"/>` +
      `<rect x="${cxN - 110}" y="${yN - 26}" width="220" height="52" fill="${rgba(verm, 0.8)}" transform="rotate(-3 ${cxN} ${yN})"/>`;
    const cab =
      T(X0, yN + 40 + 26, `LEMBRETE Nº ${pad(idx + 1)}`, { fam: MONO, peso: 700, tam: 20, c: suave, ls: 3 }) +
      T(xN + wN - padN, yN + 40 + 26, `${pad(idx + 1)}/${pad(total)}`, { fam: MONO, peso: 400, tam: 20, c: suave, a: "end", ls: 2 }) +
      (s.eyebrow ? T(X0, yN + 40 + hCab + 26, s.eyebrow, { fam: SANS, peso: 500, tam: 28, it: true, c: verm }) : "");
    const yPe = yN + hN - 40 - 20;
    const assinatura = flor(X0 + 12, yPe - 9, 12, verm) + T(X0 + 34, yPe, "— Dumi, Sabores Orientais", { fam: SANS, peso: 400, tam: 24, it: true, c: suave });

    const r = kit.empilhar(todos, yN + 40 + hCab + hEb, yN + 40 + hCab + hEb + hTexto + 2, "topo", { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    if (yN < f.molduraTopo + 20 || yN + hN > H - 40) c.erro(`slide ${idx + 1} (${c.formato}): o bilhete não cabe na tela — encurte o texto`);

    /* ---------- fora do bilhete: marca e dica ---------- */
    const corF = papel ? P.escuro : P.branco;
    let fora =
      T(f.mx, f.molduraTopo, "DUMI", { fam: MONO, peso: 700, tam: 24, c: corF, ls: 6, extra: full ? `filter="url(#k-sombra)"` : "" }) +
      (full ? "" : T(W - f.mx, f.molduraTopo, "SABORES ORIENTAIS", { fam: MONO, peso: 400, tam: 15, c: rgba(corF, 0.75), a: "end", ls: 3 }));
    const d = dicaDe(s);
    if (d) fora += T(W - f.mx - 44, f.molduraBase, d, { fam: MONO, peso: 700, tam: 18, c: corF, a: "end", ls: 2 }) + seta(W - f.mx, f.molduraBase - 6, full ? P.branco : verm, { w: 30 });

    camadas.push({ svg: `${defs}${foto}<g transform="rotate(${giro} ${cxN} ${cyN})">${papelN}${cab}${r.svg}${assinatura}</g>${fora}` });
    return camadas;
  },
};

export default estilo;
