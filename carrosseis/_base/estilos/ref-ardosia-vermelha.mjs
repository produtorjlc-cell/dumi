// Estilo 01 · "Noite de ardósia" — derivado de ref-ardosia-vermelha (antes
// ref-ardosia-dourada; renomeado em 06/10/2026 quando a paleta passou a ser só a da logo)
// (EXEMPLO HERO.png: ardósia escura, logo centralizado, "- SABORES ORIENTAIS -"
// espaçado, fileira de bandeiras na base).
//
// Arquitetura: fundo sempre PRETO da logo com textura de pedra (ardósia) e ondas
// VERMELHAS a ~4%; tudo CENTRALIZADO; títulos em DM Serif Display com ênfase em itálico
// vermelho; rótulos e corpo em Lato branco. Foto do prato SEMPRE EM COR: tela cheia com
// degradê/vinheta (modo full) ou "prato na mesa" — círculo com aro vermelho e sombra
// (faixa). Destaques em moldura dupla vermelha de cardápio; caixa de destaque vermelha
// (como o "DUMI" em caixa dos posts). Marca discreta no topo (flor vermelha + DUMI ·
// SABORES ORIENTAIS); progresso em pontos na base (no lugar das bandeiras). Efeitos:
// textura, vinheta, sombra em camadas, brilho no CTA.
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF (marca.mjs) — sem dourado.

const SERIF = "DM Serif Display";
const SANS = "Lato";

/** Flor-assinatura (5 pétalas) centrada em (x, y), raio r. */
function flor(x, y, r, cor) {
  const p = `M0 0 C ${r * 0.34} ${-r * 0.32} ${r * 0.3} ${-r * 0.78} 0 ${-r} C ${-r * 0.3} ${-r * 0.78} ${-r * 0.34} ${-r * 0.32} 0 0 Z`;
  let g = `<g transform="translate(${x} ${y})">`;
  for (let k = 0; k < 5; k++) g += `<path d="${p}" fill="${cor}" transform="rotate(${k * 72})"/>`;
  return g + `</g>`;
}

const estilo = {
  id: "ref-ardosia-vermelha",
  nome: "Noite de ardósia",
  grao: 0.06,
  familias: {
    [SERIF]: ["dm-serif-display/DMSerifDisplay-Regular.ttf", "dm-serif-display/DMSerifDisplay-Italic.ttf"],
    [SANS]: ["lato/Lato-Light.ttf", "lato/Lato-Regular.ttf", "lato/Lato-Italic.ttf", "lato/Lato-Bold.ttf", "lato/Lato-Black.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T, misturarHex } = kit;
    const { medir, quebrar } = fontes;
    const W = f.W;
    const H = f.H;
    const cx = W / 2;
    const story = c.formato === "story";
    const L = W - 2 * (story ? 140 : 120); // coluna central
    const realce = P.acento; // vermelho da logo (fios, molduras, números, ornamentos)
    const realceTexto = P.branco; // rótulos pequenos em branco (vermelho fino perde leitura no preto)
    const vermelho = P.acento2;
    const corTok = (t) => kit.cor(t, true, { principal: [P.escuro, P.branco], suave: [P.escuro, P.neutro] });
    const pos = (p) => (p && typeof p === "object" && ("feed" in p || "story" in p) ? p[c.formato] : p);

    /* ---------- fundo: ardósia + ondas vermelhas + vinheta ---------- */
    const fundo = s.modo === "marinho" ? P.profundo : P.escuro;
    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <filter id="pedra" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="3" seed="7" result="n"/>
        <feColorMatrix in="n" type="saturate" values="0" result="g"/>
        <feComponentTransfer in="g"><feFuncA type="table" tableValues="0 0.16"/></feComponentTransfer>
      </filter>
      <radialGradient id="vinheta" cx="50%" cy="46%" r="74%">
        <stop offset="0.5" stop-color="#000000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.7"/>
      </radialGradient>
      <radialGradient id="luz" cx="50%" cy="38%" r="60%">
        <stop offset="0" stop-color="${realce}" stop-opacity="0.07"/>
        <stop offset="1" stop-color="${realce}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="baseF" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0.62"/>
        <stop offset="0.2" stop-color="#000000" stop-opacity="0.08"/>
        <stop offset="0.48" stop-color="#000000" stop-opacity="0.22"/>
        <stop offset="0.74" stop-color="${P.profundo}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${P.profundo}" stop-opacity="0.98"/>
      </linearGradient>
      <filter id="txt" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="3" stdDeviation="8" flood-color="#000000" flood-opacity="0.8"/></filter>
    </defs>`;
    let ondas = "";
    for (let y = 40; y < H; y += 56) {
      let d = `M -40 ${y}`;
      for (let x = -40; x < W + 80; x += 120) d += ` q 30 -16 60 0 t 60 0`;
      ondas += `<path d="${d}" fill="none" stroke="${realce}" stroke-width="1.3" opacity="0.045"/>`;
    }
    const svgFundo = `${defs}<rect width="${W}" height="${H}" fill="${fundo}"/><rect width="${W}" height="${H}" filter="url(#pedra)"/>${ondas}<rect width="${W}" height="${H}" fill="url(#luz)"/>`;

    /* ---------- marca (topo) e progresso (base) ---------- */
    const pad = (n) => String(n).padStart(2, "0");
    const marca = "DUMI  ·  SABORES ORIENTAIS";
    const wm = medir(marca, { fam: SANS, peso: 700, tam: 16, ls: 6 });
    let moldura =
      flor(cx - wm / 2 - 26, f.molduraTopo - 5, 11, vermelho) +
      T(cx + 8, f.molduraTopo, marca, { fam: SANS, peso: 700, tam: 16, c: rgba(realceTexto, 0.88), a: "middle", ls: 6 });
    const gap = 24;
    const x0 = cx - ((total - 1) * gap) / 2;
    for (let k = 0; k < total; k++)
      moldura += k === idx
        ? `<circle cx="${x0 + k * gap}" cy="${f.molduraBase - 6}" r="6" fill="${vermelho}"/>`
        : `<circle cx="${x0 + k * gap}" cy="${f.molduraBase - 6}" r="3.4" fill="${rgba(P.neutro, 0.45)}"/>`;
    moldura += T(f.mx, f.rodape, `${pad(idx + 1)} — ${pad(total)}`, { fam: SANS, peso: 400, tam: 18, c: rgba(P.neutro, 0.75), ls: 4 });
    if (s.dica) {
      const d = s.dica.replace(/[→>]/g, "").trim().toUpperCase();
      moldura +=
        T(W - f.mx - 42, f.rodape, d, { fam: SANS, peso: 700, tam: 18, c: rgba(realceTexto, 0.9), a: "end", ls: 5 }) +
        `<path d="M ${W - f.mx - 32} ${f.rodape - 6} h 30 m -9 -7 l 9 7 l -9 7" fill="none" stroke="${realceTexto}" stroke-width="1.8"/>`;
    }

    /* ---------- blocos ---------- */
    const sombraTxt = s.modo === "full" ? `filter="url(#txt)"` : "";
    const tipoTitulo = (ln) => ({
      fam: SERIF,
      peso: 400,
      tam: Math.round(ln.tam * (ln.peso >= 700 ? 1.06 : 0.96)),
      it: ln.italico,
      c: ln.italico && ln.cor === "principal" ? realce : corTok(ln.cor),
    });
    const titulo = (linhas, nome) =>
      kit.blocoTitulo(linhas, { medir, largura: L, x: cx, a: "middle", tipo: tipoTitulo, lh: 1.04, aviso: c.aviso, nome, extra: sombraTxt });

    /** Moldura dupla de cardápio em volta de (x, y, w, h). */
    const molduraDupla = (x, y, w, h, op = 1) =>
      `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${rgba(realce, 0.75 * op)}" stroke-width="1.6"/>` +
      `<rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" fill="none" stroke="${rgba(realce, 0.35 * op)}" stroke-width="1"/>`;

    const blocos = [];
    const pe = [];
    if (s.numero) {
      const tam = story ? 250 : 220;
      blocos.push({
        tipo: "numero",
        h: tam * 0.74 + (s.numero.rotulo ? 46 : 0),
        desenhar: (y) =>
          T(cx, y + tam * 0.66, s.numero.valor, { fam: SERIF, tam, it: true, c: realce, a: "middle", extra: sombraTxt }) +
          (s.numero.rotulo
            ? T(cx, y + tam * 0.74 + 34, s.numero.rotulo.toUpperCase(), { fam: SANS, peso: 700, tam: 19, c: P.neutro, a: "middle", ls: 6 })
            : ""),
      });
    }
    if (s.titulo.length) blocos.push(titulo(s.titulo, "titulo"));
    if (s.caixaMarinho) {
      let tam = 60;
      const w0 = medir(s.caixaMarinho.texto, { fam: SERIF, tam });
      if (w0 > L - 60) tam = Math.floor((tam * (L - 60)) / w0);
      const w = Math.min(L + 40, medir(s.caixaMarinho.texto, { fam: SERIF, tam }) + 110);
      blocos.push({
        tipo: "caixa",
        h: 112,
        desenhar: (y) =>
          `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="112" rx="4" fill="${vermelho}" filter="url(#k-camadas)"/>` +
          T(cx, y + 56 + tam * 0.34, s.caixaMarinho.texto, { fam: SERIF, tam, c: P.branco, a: "middle" }),
      });
    }
    if (s.tituloPos?.length) blocos.push(titulo(s.tituloPos, "tituloPos"));
    if (s.citacao) {
      const tam = s.citacao.tam ?? (story ? 50 : 46);
      const est = { fam: SERIF, tam, it: true, c: P.branco };
      const linhas = quebrar(s.citacao.texto, est, L);
      const lh = tam * 1.2;
      const gl = 200;
      const primeira = gl * 0.4 + tam * 0.8;
      const h = primeira + (linhas.length - 1) * lh + tam * 0.3 + (s.citacao.autor ? 54 : 0);
      blocos.push({
        tipo: "citacao",
        h,
        desenhar: (y) =>
          T(cx, y + gl * 0.6, "“", { fam: SERIF, tam: gl, c: rgba(realce, 0.7), a: "middle" }) +
          linhas.map((l, k) => T(cx, y + primeira + k * lh, l, { ...est, a: "middle", extra: sombraTxt })).join("") +
          (s.citacao.autor ? T(cx, y + h - 6, s.citacao.autor.toUpperCase(), { fam: SANS, peso: 700, tam: 18, c: realce, a: "middle", ls: 6 }) : ""),
      });
    }
    if (s.corpo)
      blocos.push(
        kit.blocoTexto(s.corpo, {
          quebrar,
          largura: L - 20,
          x: cx,
          a: "middle",
          est: { fam: SANS, peso: 400, tam: s.corpoTam ?? (story ? 35 : 32), c: rgba(P.claro, 0.9) },
          lh: 1.42,
          extra: sombraTxt,
        }),
      );
    if (s.lista?.length) {
      const tam = story ? 44 : 40;
      const itens = s.lista.map((it) => ({ ...it, linhas: quebrar(it.texto, { fam: SERIF, tam }, L) }));
      const alt = itens.map((it) => (it.rotulo ? 32 : 0) + it.linhas.length * tam * 1.1 + 6);
      const gapL = 44;
      blocos.push({
        tipo: "lista",
        h: alt.reduce((a, b) => a + b, 0) + gapL * (itens.length - 1),
        desenhar: (y0) => {
          let y = y0;
          let g = "";
          itens.forEach((it, k) => {
            if (k) {
              const yy = y - gapL / 2;
              g += `<line x1="${cx - 90}" y1="${yy}" x2="${cx - 14}" y2="${yy}" stroke="${rgba(realce, 0.45)}" stroke-width="1"/>`;
              g += `<path d="M ${cx} ${yy - 6} l 6 6 l -6 6 l -6 -6 Z" fill="${rgba(realce, 0.8)}"/>`;
              g += `<line x1="${cx + 14}" y1="${yy}" x2="${cx + 90}" y2="${yy}" stroke="${rgba(realce, 0.45)}" stroke-width="1"/>`;
            }
            let b = y;
            if (it.rotulo) {
              b += 18;
              g += T(cx, b, it.rotulo.toUpperCase(), { fam: SANS, peso: 900, tam: 17, c: realceTexto, a: "middle", ls: 5 });
              b += 14;
            }
            it.linhas.forEach((l, j) => (g += T(cx, b + tam * 0.86 + j * tam * 1.1, l, { fam: SERIF, tam, c: P.branco, a: "middle", extra: sombraTxt })));
            y += alt[k] + gapL;
          });
          return g;
        },
      });
    }
    if (s.tarja) {
      const est = { fam: SANS, peso: 400, tam: s.tarja.tam ?? (story ? 33 : 31), c: P.claro };
      const linhas = [].concat(s.tarja.texto).flatMap((t) => quebrar(t, est, L - 110));
      const lh = est.tam * 1.42;
      const h = 76 + (linhas.length - 1) * lh + est.tam;
      const w = Math.min(L + 40, Math.max(...linhas.map((l) => medir(l, est))) + 130);
      pe.push({
        tipo: "tarja",
        h,
        desenhar: (y) =>
          `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" fill="${s.tarja.tipo === "barra" ? rgba("#000000", 0.45) : rgba(P.claro, 0.04)}"/>` +
          molduraDupla(cx - w / 2, y, w, h) +
          linhas.map((l, k) => T(cx, y + 38 + est.tam * 0.8 + k * lh, l, { ...est, a: "middle" })).join(""),
      });
    }
    for (const ct of s.cta) {
      if (ct.estilo === "palavra") {
        let tam = story ? 120 : 108;
        const w0 = medir(ct.texto, { fam: SERIF, tam, it: true });
        if (w0 > L - 120) tam = Math.floor((tam * (L - 120)) / w0);
        const wPal = medir(ct.texto, { fam: SERIF, tam, it: true });
        const w = Math.min(L + 60, wPal + 170);
        pe.push({
          tipo: "cta",
          h: 262,
          desenhar: (y) =>
            T(cx, y + 24, ct.rotulo.toUpperCase(), { fam: SANS, peso: 700, tam: 20, c: realce, a: "middle", ls: 6 }) +
            `<rect x="${cx - w / 2}" y="${y + 58}" width="${w}" height="196" fill="${rgba("#000000", 0.35)}"/>` +
            molduraDupla(cx - w / 2, y + 58, w, 196) +
            `<rect x="${cx - 22}" y="${y + 46}" width="44" height="24" fill="${fundo}"/>` +
            flor(cx, y + 58, 13, vermelho) +
            T(cx, y + 156 + tam * 0.33, ct.texto, { fam: SERIF, tam, it: true, c: P.branco, a: "middle", extra: `filter="url(#k-brilho)"` }),
        });
      } else {
        pe.push({
          tipo: "cta2",
          h: 96,
          desenhar: (y) => {
            const w = medir(ct.texto, { fam: SANS, peso: 400, tam: 34 });
            return (
              T(cx, y + 20, ct.rotulo.toUpperCase(), { fam: SANS, peso: 700, tam: 18, c: P.neutro, a: "middle", ls: 6 }) +
              T(cx - 22, y + 70, ct.texto, { fam: SANS, peso: 400, tam: 34, c: P.claro, a: "middle" }) +
              `<path d="M ${cx - 22 + w / 2 + 14} ${y + 60} h 30 m -9 -7 l 9 7 l -9 7" fill="none" stroke="${realce}" stroke-width="2"/>`
            );
          },
        });
      }
    }

    /* ---------- regiões e fotos ---------- */
    const camadas = [{ svg: svgFundo }];
    let topo = f.areaTopo + (s.eyebrow ? 84 : 24);
    let base = f.areaBase;
    if (s.modo === "full") {
      camadas.push({ foto: { arquivo: s.fotoAbs, x: 0, y: 0, w: W, h: H, pos: pos(s.pos), zoom: s.zoom ?? 1, tratamento: "cor", escurecer: 0.08 } });
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#baseF)"/><rect width="${W}" height="${H}" fill="url(#vinheta)" opacity="0.6"/>` });
    } else if (s.faixa) {
      // "prato na mesa": foto em círculo com aro vermelho
      const D = Math.round(Math.min(s.faixa.altura * H * 1.3, story ? 720 : 560, W - 220));
      let cy;
      if (s.faixa.lugar === "meio") cy = f.areaTopo + (f.areaBase - f.areaTopo) * s.faixa.centro;
      else cy = f.rodape - 56 - D / 2;
      camadas.push({
        svg:
          `${defs}<circle cx="${cx}" cy="${cy + 10}" r="${D / 2 + 6}" fill="#000000" opacity="0.55" filter="url(#k-camadas)"/>` +
          `<circle cx="${cx}" cy="${cy}" r="${D / 2 + 30}" fill="none" stroke="${rgba(realce, 0.22)}" stroke-width="1"/>`,
      });
      camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: cx - D / 2, y: cy - D / 2, w: D, h: D, pos: pos(s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor", mascara: "circulo" } });
      camadas.push({ svg: `${defs}<circle cx="${cx}" cy="${cy}" r="${D / 2 + 12}" fill="none" stroke="${rgba(realce, 0.8)}" stroke-width="2"/>` });
      if (s.faixa.lugar === "meio") {
        base = cy - D / 2 - 50;
        const r = kit.empilhar(pe, cy + D / 2 + 56, f.areaBase, "centro", { gap: () => 30, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato}), abaixo da foto` });
        pe.length = 0;
        camadas.push({ svg: `${defs}${r.svg}` });
      } else base = cy - D / 2 - 54;
    }
    camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#vinheta)" opacity="${s.modo === "full" ? 0 : 0.85}"/>` });

    let eb = "";
    if (s.eyebrow) {
      const t = s.eyebrow.toUpperCase();
      const w = medir(t, { fam: SANS, peso: 700, tam: 21, ls: 7 });
      const y = f.areaTopo + 34;
      eb =
        T(cx, y, t, { fam: SANS, peso: 700, tam: 21, c: realceTexto, a: "middle", ls: 7, extra: sombraTxt }) +
        `<line x1="${cx - w / 2 - 54}" y1="${y - 8}" x2="${cx - w / 2 - 20}" y2="${y - 8}" stroke="${realce}" stroke-width="1.6"/>` +
        `<line x1="${cx + w / 2 + 20}" y1="${y - 8}" x2="${cx + w / 2 + 54}" y2="${y - 8}" stroke="${realce}" stroke-width="1.6"/>`;
    }
    const ancora = s.ancora ?? (s.modo === "full" ? "base" : "centro");
    const r = kit.empilhar([...blocos, ...pe], topo, base, ancora, {
      gap: (a, b) => (a === "numero" ? 22 : b === "cta" || b === "cta2" ? 40 : a === "cta" ? 26 : a === "titulo" && b === "corpo" ? 34 : 42),
      erro: c.erro,
      rotulo: `slide ${idx + 1} (${c.formato})`,
    });
    camadas.push({ svg: `${defs}${eb}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
