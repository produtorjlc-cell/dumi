// Estilo 05 · "Etiqueta" — derivado de ref-recorte-etiqueta (post fixado do perfil:
// figura recortada com contorno branco sobre fundo texturizado e uma ETIQUETA retangular
// com o cargo em tarja pequena + o nome em tarja grande).
//
// Arquitetura: tudo é RÓTULO. Cada linha do título vira uma tarja própria (caixa branca
// com tinta preta; linha em itálico ou vermelha vira tarja vermelha com texto branco), em
// Barlow Condensed caixa alta, empilhadas e alinhadas à esquerda no terço de baixo; o
// eyebrow é uma tarja pequena inclinada por cima (o "cargo"). Foto EM COR: no full ocupa a
// tela com um CONTORNO BRANCO grosso por dentro da borda (o "recorte com contorno"), no
// papel/marinho vira um adesivo (moldura branca, leve giro, sombra). Fundo do papel com
// grade de pontos; do marinho com listras diagonais finas. Cabeçalho em etiquetas (DUMI /
// SABORES ORIENTAIS), contador em etiqueta, CTA em etiqueta com furo, lista em cartões.
// Tipografia: Barlow Condensed (tarjas) + Fira Sans (corpo).
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, caber, seta } from "./_comum.mjs";

const COND = "Barlow Condensed";
const SANS = "Fira Sans";

const estilo = {
  id: "ref-recorte-etiqueta",
  nome: "Etiqueta",
  grao: 0.05,
  familias: {
    [COND]: ["barlow-condensed/BarlowCondensed-Medium.ttf", "barlow-condensed/BarlowCondensed-SemiBold.ttf", "barlow-condensed/BarlowCondensed-Bold.ttf"],
    [SANS]: ["fira-sans/FiraSans-Light.ttf", "fira-sans/FiraSans-Regular.ttf", "fira-sans/FiraSans-Medium.ttf", "fira-sans/FiraSans-SemiBold.ttf"],
  },

  montar(c) {
    const { slide: s, idx, total, f, kit, fontes } = c;
    const { PALETA: P, rgba, T } = kit;
    const { medir } = fontes;
    const W = f.W;
    const H = f.H;
    const story = c.formato === "story";
    const papel = s.modo === "papel";
    const X0 = f.mx;
    const XR = W - (story ? 130 : 90);
    const L = XR - X0;
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.62) : rgba(P.branco, 0.75);
    const verm = P.acento;

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <pattern id="pontos" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${rgba(P.escuro, 0.13)}"/></pattern>
      <pattern id="listras" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="2" height="22" fill="${rgba(P.branco, 0.045)}"/></pattern>
      <linearGradient id="chao" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.35" stop-color="#000000" stop-opacity="0"/>
        <stop offset="0.62" stop-color="${P.escuro}" stop-opacity="0.72"/>
        <stop offset="1" stop-color="${P.escuro}" stop-opacity="0.97"/>
      </linearGradient>
    </defs>`;

    /** Etiqueta simples (x à esquerda, y = topo). */
    const etq = (x, y, txt, { tam = 22, fundo = P.branco, cor = P.escuro, peso = 600, ls = 3, px = 14, giro = 0 } = {}) => {
      const w = medir(txt, { fam: COND, peso, tam, ls }) + 2 * px;
      const h = tam * 0.7 + 2 * tam * 0.42;
      return {
        w,
        h,
        svg:
          `<g transform="rotate(${giro} ${x} ${y + h})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fundo}"/>` +
          T(x + px, y + tam * 0.42 + tam * 0.7, txt, { fam: COND, peso, tam, c: cor, ls }) +
          `</g>`,
      };
    };

    /* ---------- cabeçalho e rodapé em etiquetas ---------- */
    const claroTag = papel ? P.escuro : P.branco;
    const escuroTag = papel ? P.branco : P.escuro;
    const e1 = etq(X0, f.molduraTopo - 26, "DUMI", { tam: 26, fundo: claroTag, cor: escuroTag, peso: 700, ls: 4 });
    const e2 = etq(X0 + e1.w, f.molduraTopo - 26, "SABORES ORIENTAIS", { tam: 18, fundo: verm, cor: P.branco, ls: 3 });
    let moldura = e1.svg + `<g transform="translate(0 ${(e1.h - e2.h) / 2})">${e2.svg}</g>`;
    const cont = `${pad(idx + 1)}/${pad(total)}`;
    const e3 = etq(XR - medir(cont, { fam: COND, peso: 700, tam: 22, ls: 2 }) - 28, f.molduraTopo - 24, cont, { tam: 22, fundo: "none", cor: tinta, peso: 700, ls: 2 });
    moldura += e3.svg.replace('fill="none"', `fill="none" stroke="${rgba(tinta, 0.6)}" stroke-width="1.5"`);
    const d = dicaDe(s);
    if (d) {
      const e4 = etq(XR - medir(d, { fam: COND, peso: 700, tam: 20, ls: 3 }) - 28 - 46, f.molduraBase - 32, d, { tam: 20, fundo: verm, cor: P.branco, peso: 700, ls: 3 });
      moldura += e4.svg + seta(XR, f.molduraBase - 32 + e4.h / 2, tinta, { w: 30 });
    }

    /* ---------- título: uma tarja por linha ---------- */
    const tituloBloco = (linhas, nome) => {
      const it = linhas.map((ln) => {
        const t = ln.t.toUpperCase();
        const nomeCor = kit.papel(String(ln.cor).split("/")[0]);
        const vermelha = ln.italico || nomeCor === "acento" || nomeCor === "acento2";
        let e = { fam: COND, peso: ln.peso >= 600 || ln.italico ? 700 : 600, tam: Math.round(ln.tam * (ln.italico ? 1.1 : 1.14)), ls: 1 };
        const px = Math.round(e.tam * 0.22);
        e = caber(medir, t, e, L - 2 * px);
        if (e.tam < ln.tam * 0.9) c.aviso(`tarja "${ln.t}" reduzida para ${e.tam}px para caber`);
        const py = Math.round(e.tam * 0.18);
        return { t, e, px, py, w: medir(t, e) + 2 * px, h: e.tam * 0.7 + 2 * py, fundo: vermelha ? verm : claroTag, cor: vermelha ? P.branco : escuroTag };
      });
      const gap = 6;
      return {
        tipo: nome,
        h: it.reduce((p, q) => p + q.h, 0) + gap * (it.length - 1),
        desenhar: (y0) => {
          let y = y0;
          return it
            .map((q, k) => {
              const g = `<rect x="${X0 + (k % 2) * 18}" y="${y}" width="${q.w}" height="${q.h}" fill="${q.fundo}"/>` + T(X0 + (k % 2) * 18 + q.px, y + q.py + q.e.tam * 0.7, q.t, { ...q.e, c: q.cor });
              y += q.h + gap;
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
      destaque: verm,
      tituloBloco,
      rot: { fam: COND, peso: 700, ls: 3 },
      corpo: { fam: SANS, peso: 400, tam: story ? 34 : 31, lh: 1.45, largura: L - 60 },
      numero: { variante: "lado", fam: COND, peso: 700, tam: story ? 230 : 210 },
      caixa: { fam: COND, peso: 700, tam: 46, h: 84, ls: 3, contorno: true, c: tinta, fundo: tinta },
      citacao: { fam: SANS, peso: 300, it: true, tam: story ? 50 : 46, aspasFam: SANS },
      lista: { variante: "cartoes", fam: SANS, peso: 500, tam: story ? 36 : 33, rotTam: 20, fundoCartao: papel ? rgba(P.escuro, 0.04) : rgba(P.branco, 0.06) },
      tarja: { fam: SANS, peso: 400, it: false },
      cta: { variante: "etiqueta", fam: COND, peso: 700, tam: story ? 128 : 116, ls: 3, furo: papel ? P.claro : P.escuro, linkFam: SANS, linkPeso: 500 },
    });
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const camadas = [];
    let svgCima = "";
    let topo = f.areaTopo;
    let ancora = s.ancora ?? (s.modo === "full" ? "base" : "centro");
    const ebH = s.eyebrow ? 60 : 0;
    const eyebrow = (y) => (s.eyebrow ? etq(X0, y, s.eyebrow.toUpperCase(), { tam: 22, fundo: P.escuro, cor: P.branco, peso: 700, ls: 3, giro: -3 }).svg.replace(`fill="${P.escuro}"`, `fill="${P.escuro}" stroke="${P.branco}" stroke-width="2"`) : "");

    if (s.modo === "full") {
      camadas.push({ svg: `<rect width="${W}" height="${H}" fill="${P.escuro}"/>` });
      camadas.push({ foto: { arquivo: s.fotoAbs, x: 0, y: 0, w: W, h: H, pos: posDe(c, s.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
      const m = 34;
      camadas.push({
        svg: `${defs}<rect width="${W}" height="${H}" fill="url(#chao)"/><rect x="0" y="0" width="${W}" height="${f.molduraTopo + 40}" fill="${rgba(P.escuro, 0.55)}"/>` +
          `<rect x="${m}" y="${f.molduraTopo + 30}" width="${W - 2 * m}" height="${H - 116 - f.molduraTopo - 30}" fill="none" stroke="${P.branco}" stroke-width="12"/>`,
      });
      topo = f.areaTopo + 120;
      ancora = s.ancora ?? "base";
      const yT = f.areaBase - hTexto;
      svgCima += eyebrow(yT - ebH);
    } else {
      const tex = papel ? `<rect width="${W}" height="${H}" fill="url(#pontos)"/>` : `<rect width="${W}" height="${H}" fill="url(#listras)"/>`;
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>${tex}` });
      if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H);
        const wF = Math.round(L * 0.86);
        const xF = X0 + 26;
        const yF = f.areaTopo + 16;
        const giro = idx % 2 ? 2.2 : -2.2;
        const cxr = { x: xF + wF / 2, y: yF + hF / 2 };
        const b = 16;
        camadas.push({ svg: `${defs}<g transform="rotate(${giro} ${cxr.x} ${cxr.y})"><rect x="${xF - b}" y="${yF - b}" width="${wF + 2 * b}" height="${hF + 2 * b}" fill="${P.branco}" filter="url(#k-camadas)"/></g>` });
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: xF, y: yF, w: wF, h: hF, pos: posDe(c, s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor", rotacao: giro, centroRotacao: cxr } });
        topo = yF + hF + 70 + ebH;
        ancora = "topo";
        svgCima += eyebrow(topo - ebH);
      } else {
        const yT = s.ancora === "topo" ? f.areaTopo + ebH : Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
        topo = yT;
        ancora = "topo";
        svgCima += eyebrow(yT - ebH);
      }
    }

    const r = kit.empilhar(todos, topo, f.areaBase, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
