// Utilitários compartilhados pelos estilos 03 em diante (NÃO é um estilo: o "_" no nome
// deixa este arquivo fora da fila — o motor só carrega carrosseis/_base/estilos/<id>.mjs).
//
// O que mora aqui é só o "encanamento" repetido: os blocos de conteúdo do roteiro
// (número, título, caixa, citação, corpo, lista, tarja, CTA) desenhados com variantes
// configuráveis, a flor-assinatura, setas e utilidades. A ARQUITETURA de cada estilo
// (fundo, grade, moldura, recorte e tratamento de foto, composição, tipografia) continua
// no arquivo do estilo — cada um escolhe fontes, cores, alinhamento e a variante de cada
// bloco. Alterou algo aqui? Renderize de novo todos os estilos que importam este arquivo.
//
// Cores: só as da marca (kit.PALETA → preto #050505, vermelho #D81C1B, branco #FFFFFF),
// com opacidade via kit.rgba; #000000 só em sombra/vinheta (neutro).

export const pad = (n) => String(n).padStart(2, "0");

/** `pos` do roteiro pode ser { feed, story }. */
export const posDe = (c, p) => (p && typeof p === "object" && ("feed" in p || "story" in p) ? p[c.formato] : p);

/** Texto da dica ("arraste →") sem a seta, em caixa alta; null se não houver. */
export const dicaDe = (s) => (s.dica ? s.dica.replace(/[→>]/g, "").trim().toUpperCase() : null);

/** Flor-assinatura da logo (5 pétalas) centrada em (x, y), raio r. */
export function flor(x, y, r, cor, giro = 0) {
  const p = `M0 0 C ${r * 0.34} ${-r * 0.32} ${r * 0.3} ${-r * 0.78} 0 ${-r} C ${-r * 0.3} ${-r * 0.78} ${-r * 0.34} ${-r * 0.32} 0 0 Z`;
  let g = `<g transform="translate(${x} ${y}) rotate(${giro})">`;
  for (let k = 0; k < 5; k++) g += `<path d="${p}" fill="${cor}" transform="rotate(${k * 72})"/>`;
  return g + `</g>`;
}

/** Seta para a direita terminando em (x, y). */
export const seta = (x, y, cor, { w = 32, sw = 2.2, ab = 8 } = {}) =>
  `<path d="M ${x - w} ${y} H ${x} M ${x - ab - 2} ${y - ab} L ${x} ${y} L ${x - ab - 2} ${y + ab}" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="square"/>`;

/** Reduz o tamanho até `texto` caber em `largura`. */
export function caber(medir, texto, est, largura) {
  const w = medir(texto, est);
  if (w <= largura) return { ...est };
  return { ...est, tam: Math.max(12, Math.floor((est.tam * largura) / w)) };
}

/**
 * Blocos de conteúdo do slide. Devolve { blocos, pe } para kit.empilhar.
 * o = {
 *   x, L, a ("start" | "middle"), tinta, suave, destaque, contraDestaque (texto sobre destaque),
 *   titulo(ln) → estilo tipográfico, lh, extra (atributos crus p/ texto sobre foto),
 *   corpo { fam, peso, tam, it, lh, c }, rot { fam, peso, ls } (rótulos em caixa alta),
 *   numero { variante: cima | lado | vazado | circulo, fam, peso, tam, it },
 *   caixa { fam, peso, tam, h, fundo, c, ls, contorno },
 *   citacao { fam, peso, it, tam, aspasFam },
 *   lista { variante: regua | pontilhado | chips | numerada | cartoes, fam, peso, tam },
 *   tarja { fam, peso, it },
 *   cta { variante: caixa | contorno | sublinhado | etiqueta, fam, peso, tam, ls, linkFam, linkPeso, linkIt },
 * }
 */
export function blocos(c, o) {
  const { slide: s, kit, fontes } = c;
  const { T, rgba } = kit;
  const { medir, quebrar } = fontes;
  const story = c.formato === "story";
  const { x, L, a = "start", tinta, suave, destaque, extra = "" } = o;
  const contra = o.contraDestaque ?? kit.PALETA.branco;
  const centro = a === "middle";
  const xL = centro ? x - L / 2 : x; // borda esquerda da coluna
  const xL0 = xL;
  const rot = { fam: o.rot.fam, peso: o.rot.peso ?? 700, ls: o.rot.ls ?? 3 };
  const B = [];
  const pe = [];

  // o.tituloBloco(linhas, nome) → bloco próprio do estilo (ex.: uma tarja por linha)
  const titulo =
    o.tituloBloco ??
    ((linhas, nome) => kit.blocoTitulo(linhas, { medir, largura: L, x, a, tipo: o.titulo, lh: o.lh ?? 1.06, aviso: c.aviso, nome, extra }));

  /* número */
  if (s.numero) {
    const n = o.numero ?? {};
    const v = n.variante ?? "cima";
    const tam = n.tam ?? (story ? 240 : 210);
    const est = { fam: n.fam, peso: n.peso ?? 400, tam, it: !!n.it };
    const wN = medir(s.numero.valor, est);
    const r = s.numero.rotulo ? s.numero.rotulo.toUpperCase() : "";
    if (v === "circulo") {
      const R = n.raio ?? (story ? 92 : 84);
      const tn = caber(medir, s.numero.valor, { ...est, tam: R * 1.05 }, R * 1.5);
      B.push({
        tipo: "numero",
        h: R * 2,
        desenhar: (y) => {
          const cx = centro ? x - (r ? medir(r, { ...rot, tam: 26 }) / 2 + 20 : 0) : xL + R;
          return (
            `<circle cx="${cx}" cy="${y + R}" r="${R}" fill="${destaque}"/>` +
            T(cx, y + R + tn.tam * 0.36, s.numero.valor, { ...tn, c: contra, a: "middle" }) +
            (r ? T(cx + R + 26, y + R + 9, r, { ...rot, tam: 26, c: tinta }) : "")
          );
        },
      });
    } else if (v === "lado") {
      B.push({
        tipo: "numero",
        h: tam * 0.74,
        desenhar: (y) => {
          const wr = r ? medir(r, { ...rot, tam: 28 }) + 70 : 0;
          const x0 = centro ? x - (wN + wr) / 2 : xL;
          return (
            T(x0, y + tam * 0.72, s.numero.valor, { ...est, c: destaque, extra }) +
            (r
              ? `<line x1="${x0 + wN + 22}" y1="${y + tam * 0.72 - 10}" x2="${x0 + wN + 58}" y2="${y + tam * 0.72 - 10}" stroke="${tinta}" stroke-width="2"/>` +
                T(x0 + wN + 70, y + tam * 0.72, r, { ...rot, tam: 28, c: tinta, extra })
              : "")
          );
        },
      });
    } else {
      const vaz = v === "vazado";
      B.push({
        tipo: "numero",
        h: tam * 0.74 + (r ? 52 : 0),
        desenhar: (y) =>
          T(x, y + tam * 0.72, s.numero.valor, {
            ...est,
            c: vaz ? "none" : destaque,
            a,
            extra: vaz ? `stroke="${destaque}" stroke-width="${n.traco ?? 3}" ${extra}` : extra,
          }) + (r ? T(x, y + tam * 0.74 + 40, r, { ...rot, tam: 24, c: tinta, a, extra }) : ""),
      });
    }
  }

  if (s.titulo.length) B.push(titulo(s.titulo, "titulo"));

  /* caixa de destaque */
  if (s.caixaMarinho) {
    const k = o.caixa ?? {};
    const h = k.h ?? 104;
    let est = { fam: k.fam, peso: k.peso ?? 400, tam: k.tam ?? 56, ls: k.ls ?? 2 };
    const txt = k.caixaAlta === false ? s.caixaMarinho.texto : s.caixaMarinho.texto.toUpperCase();
    est = caber(medir, txt, est, L - 72);
    const wT = medir(txt, est);
    const wC = k.cheia ? L : Math.min(L, wT + 72);
    B.push({
      tipo: "caixa",
      h,
      desenhar: (y) => {
        const x0 = centro ? x - wC / 2 : xL;
        return (
          (k.contorno
            ? `<rect x="${x0}" y="${y}" width="${wC}" height="${h}" fill="none" stroke="${k.fundo ?? destaque}" stroke-width="3"/>`
            : `<rect x="${x0}" y="${y}" width="${wC}" height="${h}" fill="${k.fundo ?? destaque}"/>`) +
          T(x0 + wC / 2, y + h / 2 + est.tam * 0.35, txt, { ...est, c: k.c ?? contra, a: "middle" })
        );
      },
    });
  }

  if (s.tituloPos?.length) B.push(titulo(s.tituloPos, "tituloPos"));

  /* citação */
  if (s.citacao) {
    const q = o.citacao ?? {};
    const tam = s.citacao.tam ?? q.tam ?? (story ? 50 : 46);
    const est = { fam: q.fam, peso: q.peso ?? 400, tam, it: q.it ?? true, c: tinta };
    const linhas = quebrar(s.citacao.texto, est, L - 20);
    const lh = tam * 1.24;
    const topo = 104;
    const ult = topo + tam * 0.8 + (linhas.length - 1) * lh; // linha de base do último verso
    const h = ult + (s.citacao.autor ? 62 : tam * 0.3);
    B.push({
      tipo: "citacao",
      h,
      desenhar: (y) =>
        T(centro ? x : xL - 4, y + 118, "“", { fam: q.aspasFam ?? q.fam, peso: 400, tam: 180, c: destaque, a }) +
        linhas.map((l, k) => T(x, y + topo + tam * 0.8 + k * lh, l, { ...est, a, extra })).join("") +
        (s.citacao.autor ? T(x, y + ult + 56, `— ${s.citacao.autor}`.toUpperCase(), { ...rot, tam: 20, c: suave, a, extra }) : ""),
    });
  }

  /* corpo */
  if (s.corpo) {
    const k = o.corpo;
    const est = { fam: k.fam, peso: k.peso ?? 400, tam: s.corpoTam ?? k.tam ?? (story ? 35 : 32), it: !!k.it, c: k.c ?? tinta, ls: k.ls ?? 0 };
    B.push(kit.blocoTexto(s.corpo, { quebrar, largura: k.largura ?? L, x, a, est, lh: k.lh ?? 1.45, extra }));
  }

  /* lista */
  if (s.lista?.length) {
    const k = o.lista ?? {};
    const v = k.variante ?? "regua";
    const tam = k.tam ?? (story ? 38 : 35);
    const est = { fam: k.fam, peso: k.peso ?? 500, tam, it: !!k.it, c: tinta };
    const rotE = { ...rot, tam: k.rotTam ?? 22 };
    const itens = s.lista.map((it, i) => ({ ...it, n: (it.rotulo ?? pad(i + 1)).toUpperCase() }));
    if (v === "pontilhado") {
      // cardápio: texto à esquerda … pontilhado … rótulo à direita
      const linhas = itens.map((it) => {
        const rr = caber(medir, it.n, rotE, L * 0.42);
        const wr = medir(it.n, rr);
        const e = caber(medir, it.texto, est, L - wr - 70);
        return { it, rr, wr, e, we: medir(it.texto, e) };
      });
      const passo = tam * 1.9;
      B.push({
        tipo: "lista",
        h: linhas.length * passo,
        desenhar: (y0) =>
          linhas
            .map((l, i) => {
              const b = y0 + i * passo + tam;
              const xa = xL + l.we + 18;
              const xb = xL + L - l.wr - 18;
              return (
                T(xL, b, l.it.texto, { ...l.e, extra }) +
                (xb > xa ? `<line x1="${xa}" y1="${b - 4}" x2="${xb}" y2="${b - 4}" stroke="${rgba(tinta, 0.55)}" stroke-width="2.4" stroke-dasharray="1.5 9" stroke-linecap="round"/>` : "") +
                T(xL + L, b, l.it.n, { ...l.rr, c: destaque, a: "end", extra })
              );
            })
            .join(""),
      });
    } else if (v === "chips") {
      const linhas = itens.map((it) => {
        const rr = caber(medir, it.n, rotE, L * 0.4);
        const wr = medir(it.n, rr) + 36;
        const ql = quebrar(it.texto, est, L - wr - 24);
        return { it, rr, wr, ql };
      });
      const alt = linhas.map((l) => Math.max(58, l.ql.length * tam * 1.22) + 26);
      const wMaxC = Math.max(...linhas.map((l) => l.wr + 24 + Math.max(...l.ql.map((q) => medir(q, est)))));
      const offC = centro ? Math.max(0, (L - wMaxC) / 2) : 0;
      B.push({
        tipo: "lista",
        h: alt.reduce((p, q) => p + q, 0) - 26,
        desenhar: (y0) => {
          let y = y0;
          const xL = xL0 + offC;
          return linhas
            .map((l, i) => {
              const g =
                `<rect x="${xL}" y="${y}" width="${l.wr}" height="52" rx="26" fill="${destaque}"/>` +
                T(xL + l.wr / 2, y + 26 + l.rr.tam * 0.36, l.it.n, { ...l.rr, c: contra, a: "middle" }) +
                l.ql.map((q, j) => T(xL + l.wr + 24, y + 26 + tam * 0.36 + j * tam * 1.22, q, { ...est, extra })).join("");
              y += alt[i];
              return g;
            })
            .join("");
        },
      });
    } else if (v === "numerada" || v === "cartoes") {
      const cart = v === "cartoes";
      const col = cart ? 0 : 92;
      const linhas = itens.map((it) => ({ it, ql: quebrar(it.texto, est, L - col - (cart ? 64 : 0)) }));
      const alt = linhas.map((l) => (cart ? 44 + rotE.tam + 14 + l.ql.length * tam * 1.22 + 24 : Math.max(76, 30 + l.ql.length * tam * 1.22)));
      const gap = 18;
      const wMaxN = Math.max(...linhas.flatMap((l) => l.ql.map((q) => medir(q, est))));
      const offN = centro && !cart ? Math.max(0, (L - col - wMaxN) / 2) : 0;
      B.push({
        tipo: "lista",
        h: alt.reduce((p, q) => p + q, 0) + gap * (alt.length - 1),
        desenhar: (y0) => {
          let y = y0;
          return linhas
            .map((l, i) => {
              let g;
              if (cart) {
                g =
                  `<rect x="${xL}" y="${y}" width="${L}" height="${alt[i]}" fill="${k.fundoCartao ?? rgba(tinta, 0.06)}" stroke="${rgba(tinta, 0.22)}" stroke-width="1.4"/>` +
                  `<rect x="${xL}" y="${y}" width="8" height="${alt[i]}" fill="${destaque}"/>` +
                  T(xL + 32, y + 30 + rotE.tam * 0.8, l.it.n, { ...rotE, c: destaque }) +
                  l.ql.map((q, j) => T(xL + 32, y + 44 + rotE.tam + 14 + tam * 0.8 + j * tam * 1.22, q, { ...est })).join("");
              } else {
                const xo = xL + offN;
                g =
                  `<circle cx="${xo + 32}" cy="${y + 34}" r="32" fill="none" stroke="${destaque}" stroke-width="2.6"/>` +
                  T(xo + 32, y + 34 + 9, pad(i + 1), { ...rotE, tam: 24, c: destaque, a: "middle", ls: 1 }) +
                  (l.it.rotulo ? T(xo + col, y + 14, l.it.n, { ...rotE, tam: 18, c: suave }) : "") +
                  l.ql.map((q, j) => T(xo + col, y + 34 + (l.it.rotulo ? 18 : 0) + tam * 0.36 + j * tam * 1.22, q, { ...est, extra })).join("");
              }
              y += alt[i] + gap;
              return g;
            })
            .join("");
        },
      });
    } else {
      // régua: rótulo em coluna à esquerda, texto à direita, fios entre itens
      const col = k.col ?? 210;
      const linhas = itens.map((it) => ({ it, rr: caber(medir, it.n, rotE, col - 20), ql: quebrar(it.texto, est, L - col) }));
      const alt = linhas.map((l) => Math.max(l.ql.length * tam * 1.22, 44) + 36);
      B.push({
        tipo: "lista",
        h: alt.reduce((p, q) => p + q, 0),
        desenhar: (y0) => {
          let y = y0;
          let g = `<line x1="${xL}" y1="${y}" x2="${xL + L}" y2="${y}" stroke="${rgba(tinta, 0.32)}" stroke-width="1.3"/>`;
          linhas.forEach((l, i) => {
            const b = y + 18 + tam * 0.86;
            g += T(xL, b - 3, l.it.n, { ...l.rr, c: destaque });
            l.ql.forEach((q, j) => (g += T(xL + col, b + j * tam * 1.22, q, { ...est, extra })));
            y += alt[i];
            g += `<line x1="${xL}" y1="${y}" x2="${xL + L}" y2="${y}" stroke="${rgba(tinta, 0.32)}" stroke-width="1.3"/>`;
          });
          return g;
        },
      });
    }
  }

  /* tarja (rodapé do bloco) */
  if (s.tarja) {
    const k = o.tarja ?? {};
    const barra = s.tarja.tipo === "barra";
    const est = { fam: k.fam ?? o.corpo.fam, peso: k.peso ?? 400, tam: s.tarja.tam ?? (story ? 34 : 31), it: barra && k.it !== false, c: tinta };
    const ls = [].concat(s.tarja.texto).flatMap((t) => quebrar(t, est, L - 80));
    const lh = est.tam * 1.4;
    const h = 56 + (ls.length - 1) * lh + est.tam;
    if (barra && centro) {
      // coluna centralizada: fio curto vermelho em cima e texto centrado
      const hc = 34 + (ls.length - 1) * lh + est.tam;
      pe.push({
        tipo: "tarja",
        h: hc,
        desenhar: (y) =>
          `<rect x="${x - 40}" y="${y}" width="80" height="5" fill="${destaque}"/>` +
          ls.map((l, j) => T(x, y + 30 + est.tam * 0.8 + j * lh, l, { ...est, a: "middle", extra })).join(""),
      });
    } else pe.push({
      tipo: "tarja",
      h,
      desenhar: (y) =>
        (barra
          ? `<rect x="${xL}" y="${y}" width="8" height="${h}" fill="${destaque}"/>`
          : `<rect x="${xL}" y="${y}" width="${L}" height="${h}" fill="none" stroke="${rgba(tinta, 0.45)}" stroke-width="1.4"/>`) +
        ls.map((l, j) => T(barra ? xL + 36 : xL + L / 2, y + 28 + est.tam * 0.8 + j * lh, l, { ...est, a: barra ? "start" : "middle", extra })).join(""),
    });
  }

  /* CTA */
  const k = o.cta ?? {};
  for (const ct of s.cta) {
    if (ct.estilo === "palavra") {
      const v = k.variante ?? "sublinhado";
      const caixa = v === "caixa" || v === "contorno" || v === "etiqueta";
      const padX = caixa ? 56 : 0;
      let est = { fam: k.fam, peso: k.peso ?? 400, tam: k.tam ?? (story ? 150 : 136), ls: k.ls ?? 2, it: !!k.it };
      est = caber(medir, ct.texto, est, L - padX * 2 - (v === "etiqueta" ? 50 : 0));
      const wP = medir(ct.texto, est);
      const hP = est.tam * 0.74 + (caixa ? 64 : 0);
      const rotC = { ...rot, tam: k.rotTam ?? 24 };
      pe.push({
        tipo: "cta",
        h: 46 + hP + (caixa ? 0 : 34),
        desenhar: (y) => {
          const wC = wP + padX * 2 + (v === "etiqueta" ? 50 : 0);
          const x0 = centro ? x - wC / 2 : xL;
          const yb = y + 46;
          let g = T(x, y + 22, ct.rotulo.toUpperCase(), { ...rotC, c: suave, a, extra });
          if (v === "caixa") {
            g += `<rect x="${x0}" y="${yb}" width="${wC}" height="${hP}" fill="${destaque}" filter="${k.filtro ?? ""}"/>`;
            g += T(x0 + wC / 2, yb + 32 + est.tam * 0.72, ct.texto, { ...est, c: contra, a: "middle" });
          } else if (v === "contorno") {
            g += `<rect x="${x0}" y="${yb}" width="${wC}" height="${hP}" rx="${hP / 2}" fill="none" stroke="${destaque}" stroke-width="4"/>`;
            g += T(x0 + wC / 2, yb + 32 + est.tam * 0.72, ct.texto, { ...est, c: destaque, a: "middle" });
          } else if (v === "etiqueta") {
            const n = hP / 2;
            g += `<path d="M ${x0} ${yb} H ${x0 + wC - n} L ${x0 + wC} ${yb + n} L ${x0 + wC - n} ${yb + hP} H ${x0} Z" fill="${destaque}"/>`;
            g += `<circle cx="${x0 + wC - n * 0.62}" cy="${yb + n}" r="9" fill="${k.furo ?? kit.PALETA.escuro}"/>`;
            g += T(x0 + padX + wP / 2, yb + 32 + est.tam * 0.72, ct.texto, { ...est, c: contra, a: "middle" });
          } else {
            const xp = centro ? x - wP / 2 : xL;
            g += T(xp, yb + est.tam * 0.74, ct.texto, { ...est, c: destaque, extra });
            g += `<rect x="${xp}" y="${yb + est.tam * 0.74 + 18}" width="${wP}" height="10" fill="${tinta}"/>`;
          }
          return g;
        },
      });
    } else {
      const e2 = { fam: k.linkFam ?? o.corpo.fam, peso: k.linkPeso ?? 400, tam: story ? 38 : 35, it: k.linkIt ?? false };
      const est = caber(medir, ct.texto, e2, L - 70);
      pe.push({
        tipo: "cta2",
        h: 92,
        desenhar: (y) => {
          const w = medir(ct.texto, est);
          const x1 = centro ? x - (w + 60) / 2 : xL;
          return (
            T(x, y + 22, ct.rotulo.toUpperCase(), { ...rot, tam: 21, c: suave, a, extra }) +
            T(x1, y + 74, ct.texto, { ...est, c: tinta, extra }) +
            seta(x1 + w + 60, y + 62, destaque)
          );
        },
      });
    }
  }
  return { blocos: B, pe };
}

/** Espaçamento padrão entre blocos. */
export const gapPadrao = (a, b) =>
  a === "numero" ? 22 : b === "cta" || b === "cta2" ? 44 : a === "cta" ? 24 : a === "titulo" && b === "corpo" ? 30 : b === "lista" ? 40 : 36;

/** Altura total de uma pilha (para reservar espaço antes de desenhar). */
export const alturaPilha = (lista, gap = gapPadrao) => lista.reduce((p, b, k) => p + b.h + (k ? gap(lista[k - 1].tipo, b.tipo) : 0), 0);
