// Estilo 02 · "Cardápio editorial" — derivado de ref-editorial-branco (antes
// ref-editorial-creme; renomeado em 06/10/2026: o creme #F4EFE6 saiu da paleta)
// (tendência 2026 de carrossel com cara de revista: serifa, tipografia
// superdimensionada, foto do dia a dia, recortes inesperados).
//
// Arquitetura (oposta ao estilo 01): fundo de PAPEL BRANCO (branco da logo) ou
// VERMELHO sólido da logo no modo marinho ("cartão vermelho" de opinião); tinta preta
// da logo; grade editorial ALINHADA À ESQUERDA com cabeçalho de revista (DUMI +
// "Nº 03 / 07"), fio fino com a barra de progresso vermelha e rodapé com fio; títulos em
// Bebas Neue gigante (condensada) misturada com Spectral itálico; índice de lista com
// numeração de revista. Foto EM COR numa JANELA EM ARCO (modo full) ou numa faixa
// que SANGRA pela borda esquerda (recorte inesperado); carimbo redondo vermelho
// da marca sobre a foto. Efeitos: grão de papel, sombra suave, contraste de escala.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF (marca.mjs). O modo `fria`
// não muda mais o papel (não há cinza na paleta).

const DISPLAY = "Bebas Neue";
const SERIF = "Spectral";

const estilo = {
  id: "ref-editorial-branco",
  nome: "Cardápio editorial",
  grao: 0.05,
  familias: {
    [DISPLAY]: ["bebas-neue/BebasNeue-Regular.ttf"],
    [SERIF]: [
      "spectral/Spectral-Light.ttf",
      "spectral/Spectral-LightItalic.ttf",
      "spectral/Spectral-Regular.ttf",
      "spectral/Spectral-Italic.ttf",
      "spectral/Spectral-Medium.ttf",
      "spectral/Spectral-SemiBold.ttf",
    ],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T, misturarHex } = kit;
    const { medir, quebrar } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const verm = s.modo === "marinho"; // "cartão vermelho"
    const X0 = 90;
    const XR = W - (story ? 120 : 90);
    const L = XR - X0;
    const centro = s.alinhar === "centro";
    const xT = centro ? (X0 + XR) / 2 : X0;
    const aT = centro ? "middle" : "start";

    const papel = P.claro; // papel branco da logo (sem creme, sem cinza)
    const fundo = verm ? P.acento2 : papel;
    const tinta = verm ? P.claro : P.escuro;
    const tintaSuave = verm ? rgba(P.claro, 0.82) : rgba(P.escuro, 0.66);
    const destaque = verm ? P.branco : P.acento2; // vermelho no papel, branco no vermelho
    const corTok = (t) => {
      const nome = kit.papel(String(t).split("/")[0]);
      if (nome === "acento" || nome === "acento2") return destaque; // vermelho some no cartão vermelho
      const k = kit.cor(t, verm, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });
      return nome === "suave" || nome === "neutro" ? (verm ? rgba(P.branco, 0.82) : rgba(P.escuro, 0.66)) : k;
    };
    const pos = (p) => (p && typeof p === "object" && ("feed" in p || "story" in p) ? p[c.formato] : p);

    const defs = `<defs>${kit.efeitosDefs(P.escuro)}
      <radialGradient id="luzPapel" cx="22%" cy="12%" r="90%">
        <stop offset="0" stop-color="#FFFFFF" stop-opacity="${verm ? 0.05 : 0.55}"/>
        <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>`;

    /* ---------- cabeçalho e rodapé de revista ---------- */
    const pad = (n) => String(n).padStart(2, "0");
    let cab =
      T(X0, f.molduraTopo + 4, "DUMI", { fam: DISPLAY, tam: 38, c: tinta, ls: 4 }) +
      T(X0 + medir("DUMI", { fam: DISPLAY, tam: 38, ls: 4 }) + 18, f.molduraTopo, "sabores orientais", { fam: SERIF, peso: 400, tam: 20, it: true, c: tintaSuave }) +
      T(XR, f.molduraTopo, `Nº ${pad(idx + 1)} / ${pad(total)}`, { fam: SERIF, peso: 400, tam: 22, it: true, c: tintaSuave, a: "end" }) +
      `<line x1="${X0}" y1="${f.fioTopo}" x2="${XR}" y2="${f.fioTopo}" stroke="${rgba(tinta, 0.28)}" stroke-width="1.2"/>` +
      `<rect x="${X0}" y="${f.fioTopo - 2.5}" width="${(L * (idx + 1)) / total}" height="5" fill="${destaque}"/>` +
      `<line x1="${X0}" y1="${f.fioBase}" x2="${XR}" y2="${f.fioBase}" stroke="${rgba(tinta, 0.28)}" stroke-width="1.2"/>` +
      T(X0, f.molduraBase, "Uma viagem pela Ásia, prato a prato.", { fam: SERIF, peso: 400, tam: 20, it: true, c: tintaSuave });
    if (s.dica) {
      const d = s.dica.replace(/[→>]/g, "").trim().toUpperCase();
      cab +=
        T(XR - 44, f.molduraBase + 2, d, { fam: DISPLAY, tam: 28, c: destaque, a: "end", ls: 2 }) +
        `<path d="M ${XR - 34} ${f.molduraBase - 8} h 32 m -10 -8 l 10 8 l -10 8" fill="none" stroke="${destaque}" stroke-width="2.4"/>`;
    }

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) =>
      ln.peso >= 700
        ? { fam: DISPLAY, peso: 400, tam: Math.round(ln.tam * 1.34), c: corTok(ln.cor), ls: 1 }
        : { fam: SERIF, peso: ln.italico ? 300 : 400, tam: Math.round(ln.tam * 0.9), it: ln.italico, c: ln.italico && ln.cor === "principal" ? destaque : corTok(ln.cor) };
    const titulo = (linhas, nome) => kit.blocoTitulo(linhas, { medir, largura: L, x: xT, a: aT, tipo: tipoTitulo, lh: 1.0, aviso: c.aviso, nome });

    const blocos = [];
    const pe = [];
    if (s.numero) {
      const tam = story ? 360 : 320;
      const wN = medir(s.numero.valor, { fam: DISPLAY, tam });
      blocos.push({
        tipo: "numero",
        h: tam * 0.74,
        desenhar: (y) => {
          const xn = centro ? xT - wN / 2 : X0;
          let g = T(xn, y + tam * 0.72, s.numero.valor, { fam: DISPLAY, tam, c: destaque });
          if (s.numero.rotulo)
            g +=
              `<line x1="${xn + wN + 26}" y1="${y + tam * 0.72 - 12}" x2="${xn + wN + 80}" y2="${y + tam * 0.72 - 12}" stroke="${tinta}" stroke-width="1.6"/>` +
              T(xn + wN + 92, y + tam * 0.72, s.numero.rotulo, { fam: SERIF, peso: 300, tam: 40, it: true, c: tinta });
          return g;
        },
      });
    }
    if (s.titulo.length) blocos.push(titulo(s.titulo, "titulo"));
    if (s.caixaMarinho) {
      let tam = 66;
      const w0 = medir(s.caixaMarinho.texto, { fam: DISPLAY, tam, ls: 2 });
      if (w0 > L - 80) tam = Math.floor((tam * (L - 80)) / w0);
      blocos.push({
        tipo: "caixa",
        h: 108,
        desenhar: (y) =>
          `<rect x="${X0}" y="${y}" width="${L}" height="108" fill="${P.escuro}"/>` +
          T(centro ? xT : X0 + 36, y + 54 + tam * 0.36, s.caixaMarinho.texto, { fam: DISPLAY, tam, c: P.claro, a: aT, ls: 2 }),
      });
    }
    if (s.tituloPos?.length) blocos.push(titulo(s.tituloPos, "tituloPos"));
    if (s.citacao) {
      const tam = s.citacao.tam ?? (story ? 52 : 48);
      const est = { fam: SERIF, peso: 300, tam, it: true, c: tinta };
      const linhas = quebrar(s.citacao.texto, est, L - 40);
      const lh = tam * 1.22;
      const h = 120 + (linhas.length - 1) * lh + tam * 0.3 + (s.citacao.autor ? 50 : 0);
      blocos.push({
        tipo: "citacao",
        h,
        desenhar: (y) =>
          T(centro ? xT : X0 - 6, y + 120, "“", { fam: SERIF, peso: 400, tam: 190, c: destaque, a: aT }) +
          linhas.map((l, k) => T(xT, y + 100 + tam * 0.8 + k * lh, l, { ...est, a: aT })).join("") +
          (s.citacao.autor ? T(xT, y + h - 6, `— ${s.citacao.autor}`, { fam: SERIF, peso: 400, tam: 24, it: true, c: tintaSuave, a: aT }) : ""),
      });
    }
    if (s.corpo)
      blocos.push(
        kit.blocoTexto(s.corpo, {
          quebrar,
          largura: L - (centro ? 0 : 40),
          x: xT,
          a: aT,
          est: { fam: SERIF, peso: 400, tam: s.corpoTam ?? (story ? 35 : 32), c: rgba(tinta, 0.88) },
          lh: 1.48,
        }),
      );
    if (s.lista?.length) {
      const tam = story ? 40 : 37;
      const col = 150;
      const itens = s.lista.map((it, k) => ({ ...it, n: it.rotulo ?? pad(k + 1), l: quebrar(it.texto, { fam: SERIF, peso: 500, tam }, L - col) }));
      const alt = itens.map((it) => Math.max(it.l.length * tam * 1.22, 44) + 34);
      blocos.push({
        tipo: "lista",
        h: alt.reduce((a, b) => a + b, 0),
        desenhar: (y0) => {
          let y = y0;
          let g = `<line x1="${X0}" y1="${y}" x2="${XR}" y2="${y}" stroke="${rgba(tinta, 0.3)}" stroke-width="1.2"/>`;
          itens.forEach((it, k) => {
            const b = y + 17 + tam * 0.86;
            const rot = String(it.n).toUpperCase();
            let tr = 26;
            const wr = medir(rot, { fam: DISPLAY, tam: tr, ls: 2 });
            if (wr > col - 16) tr = Math.floor((tr * (col - 16)) / wr);
            g += T(X0, b - 2, rot, { fam: DISPLAY, tam: tr, c: destaque, ls: 2 });
            it.l.forEach((l, j) => (g += T(X0 + col, b + j * tam * 1.22, l, { fam: SERIF, peso: 500, tam, c: tinta })));
            y += alt[k];
            g += `<line x1="${X0}" y1="${y}" x2="${XR}" y2="${y}" stroke="${rgba(tinta, 0.3)}" stroke-width="1.2"/>`;
          });
          return g;
        },
      });
    }
    if (s.tarja) {
      const barra = s.tarja.tipo === "barra";
      const est = { fam: SERIF, peso: barra ? 300 : 400, tam: s.tarja.tam ?? (story ? 36 : 33), it: barra, c: tinta };
      const linhas = [].concat(s.tarja.texto).flatMap((t) => quebrar(t, est, L - 80));
      const lh = est.tam * 1.4;
      const h = 60 + (linhas.length - 1) * lh + est.tam;
      pe.push({
        tipo: "tarja",
        h,
        desenhar: (y) =>
          (barra
            ? `<rect x="${X0}" y="${y}" width="10" height="${h}" fill="${destaque}"/>`
            : `<rect x="${X0}" y="${y}" width="${L}" height="${h}" fill="none" stroke="${rgba(tinta, 0.4)}" stroke-width="1.4"/>`) +
          linhas.map((l, k) => T(barra ? X0 + 40 : X0 + L / 2, y + 30 + est.tam * 0.8 + k * lh, l, { ...est, a: barra ? "start" : "middle" })).join(""),
      });
    }
    for (const ct of s.cta) {
      if (ct.estilo === "palavra") {
        let tam = story ? 190 : 170;
        const w0 = medir(ct.texto, { fam: DISPLAY, tam, ls: 2 });
        if (w0 > L) tam = Math.floor((tam * L) / w0);
        const wP = medir(ct.texto, { fam: DISPLAY, tam, ls: 2 });
        pe.push({
          tipo: "cta",
          h: 70 + tam * 0.78 + 34,
          desenhar: (y) => {
            const xp = centro ? xT - wP / 2 : X0;
            return (
              T(xT, y + 30, ct.rotulo, { fam: SERIF, peso: 300, tam: 34, it: true, c: tintaSuave, a: aT }) +
              T(xp, y + 62 + tam * 0.76, ct.texto, { fam: DISPLAY, tam, c: destaque, ls: 2 }) +
              `<rect x="${xp}" y="${y + 62 + tam * 0.76 + 20}" width="${wP}" height="10" fill="${tinta}"/>`
            );
          },
        });
      } else {
        pe.push({
          tipo: "cta2",
          h: 96,
          desenhar: (y) => {
            const w = medir(ct.texto, { fam: SERIF, peso: 400, tam: 38, it: true });
            const x1 = centro ? xT - w / 2 : X0;
            return (
              T(xT, y + 24, ct.rotulo.toUpperCase(), { fam: DISPLAY, tam: 26, c: tintaSuave, a: aT, ls: 2 }) +
              T(x1, y + 76, ct.texto, { fam: SERIF, peso: 400, tam: 38, it: true, c: tinta }) +
              `<path d="M ${x1 + w + 18} ${y + 64} h 34 m -10 -8 l 10 8 l -10 8" fill="none" stroke="${destaque}" stroke-width="2.4"/>`
            );
          },
        });
      }
    }

    /* ---------- carimbo da marca ---------- */
    const carimbo = (x, y) =>
      `<g transform="rotate(-12 ${x} ${y})" opacity="0.94">` +
      `<circle cx="${x}" cy="${y}" r="92" fill="${P.claro}" stroke="${P.acento2}" stroke-width="4"/>` +
      `<circle cx="${x}" cy="${y}" r="80" fill="none" stroke="${P.acento2}" stroke-width="1.4"/>` +
      T(x, y + 14, "DUMI", { fam: DISPLAY, tam: 58, c: P.acento2, a: "middle", ls: 3 }) +
      T(x, y - 34, "SABORES", { fam: DISPLAY, tam: 20, c: P.acento2, a: "middle", ls: 4 }) +
      T(x, y + 46, "ORIENTAIS", { fam: DISPLAY, tam: 20, c: P.acento2, a: "middle", ls: 4 }) +
      `</g>`;

    /* ---------- regiões e fotos ---------- */
    const camadas = [{ svg: `${defs}<rect width="${W}" height="${H}" fill="${fundo}"/><rect width="${W}" height="${H}" fill="url(#luzPapel)"/>` }];
    let topo = f.areaTopo + (s.eyebrow ? 70 : 10);
    let base = f.areaBase;
    const gapB = (a, b) => (a === "numero" ? 18 : b === "cta" || b === "cta2" ? 40 : a === "cta" ? 22 : a === "titulo" && b === "corpo" ? 30 : 40);
    let svgFoto = "";
    if (s.modo === "full") {
      // janela em ARCO: a foto fica acima do texto (que vem ancorado embaixo)
      const todos = [...blocos, ...pe];
      const hTexto = todos.reduce((a, b, k) => a + b.h + (k ? gapB(todos[k - 1].tipo, b.tipo) : 0), 0);
      const yA = f.fioTopo + 34;
      const hA = Math.max(story ? 520 : 340, f.areaBase - hTexto - 56 - yA - (s.eyebrow ? 60 : 0));
      const r = Math.min(L / 2, hA / 2);
      const arco = `<svg viewBox="0 0 ${L} ${hA}" width="100%" height="100%" preserveAspectRatio="none"><path d="M0 ${hA} V ${r} A ${r} ${r} 0 0 1 ${r} 0 H ${L - r} A ${r} ${r} 0 0 1 ${L} ${r} V ${hA} Z" fill="#fff"/></svg>`;
      camadas.push({ svg: `${defs}<g transform="translate(${X0} ${yA + 6})" filter="url(#k-sombra)"><path d="M0 ${hA} V ${r} A ${r} ${r} 0 0 1 ${r} 0 H ${L - r} A ${r} ${r} 0 0 1 ${L} ${r} V ${hA} Z" fill="${rgba(P.escuro, 0.1)}"/></g>` });
      camadas.push({ foto: { arquivo: s.fotoAbs, x: X0, y: yA, w: L, h: hA, pos: pos(s.pos), zoom: s.zoom ?? 1, tratamento: "cor", mascara: arco } });
      svgFoto =
        `<g transform="translate(${X0 - 14} ${yA - 14})"><path d="M0 ${hA + 28} V ${r + 14} A ${r + 14} ${r + 14} 0 0 1 ${r + 14} 0 H ${L + 14 - r} A ${r + 14} ${r + 14} 0 0 1 ${L + 28} ${r + 14} V ${hA + 28}" fill="none" stroke="${destaque}" stroke-width="1.6"/></g>` +
        carimbo(XR - 70, yA + Math.min(hA - 90, r * 0.55 + 70));
      topo = yA + hA + 44 + (s.eyebrow ? 60 : 0);
    } else if (s.faixa) {
      // faixa que SANGRA pela borda esquerda (recorte inesperado)
      const hF = Math.round(s.faixa.altura * H);
      const wF = XR - 40;
      let yF;
      if (s.faixa.lugar === "meio") yF = Math.round(f.areaTopo + (f.areaBase - f.areaTopo) * s.faixa.centro - hF / 2);
      else yF = f.rodape - 34 - hF;
      camadas.push({ svg: `${defs}<rect x="0" y="${yF + 14}" width="${wF}" height="${hF}" fill="${rgba(P.escuro, 0.22)}" filter="url(#k-sombra)"/>` });
      camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: 0, y: yF, w: wF, h: hF, pos: pos(s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
      svgFoto = `<rect x="${wF + 14}" y="${yF}" width="6" height="${hF}" fill="${destaque}"/>` + carimbo(XR - 30, yF + 20);
      if (s.faixa.lugar === "meio") {
        base = yF - 40;
        const r = kit.empilhar(pe, yF + hF + 50, f.areaBase, "centro", { gap: () => 30, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato}), abaixo da foto` });
        pe.length = 0;
        svgFoto += r.svg;
      } else base = yF - 50;
    }

    let eb = "";
    if (s.eyebrow) {
      const y = s.modo === "full" ? topo - 52 : f.areaTopo + 34;
      const t = s.eyebrow;
      const w = medir(t, { fam: SERIF, peso: 400, tam: 32, it: true });
      const x1 = centro ? xT - w / 2 - 34 : X0;
      eb =
        `<line x1="${x1}" y1="${y - 10}" x2="${x1 + 46}" y2="${y - 10}" stroke="${destaque}" stroke-width="2.4"/>` +
        T(x1 + 60, y, t, { fam: SERIF, peso: 400, tam: 32, it: true, c: destaque });
    }
    const ancora = s.ancora ?? (s.modo === "full" ? "base" : "centro");
    const r = kit.empilhar([...blocos, ...pe], topo, base, ancora, { gap: gapB, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgFoto}${eb}${r.svg}${cab}` });
    return camadas;
  },
};

export default estilo;
