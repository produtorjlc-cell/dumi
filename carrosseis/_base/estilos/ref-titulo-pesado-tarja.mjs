// Estilo 06 · "Manchete" — derivado de ref-titulo-pesado-tarja (2º post do perfil:
// close de comida, título branco PESADO em duas linhas e o nome da marca numa caixa
// vermelha logo abaixo).
//
// Arquitetura: tipografia de manchete. Full: foto EM COR sangrando a tela inteira (só
// escurecida e vinhetada), título Archivo Black enorme CENTRALIZADO no meio da imagem com
// sombra em camadas e a caixa vermelha "DUMI" (ou a caixaMarinho do roteiro) logo abaixo —
// a assinatura do post. Papel: jornal branco com cabeçalho de manchete (DUMI pesado + fios
// duplos pretos), texto alinhado à esquerda, foto da faixa recortada em bloco reto com fio
// vermelho grosso. Marinho: preto com a primeira palavra do título repetida gigante e
// vazada ao fundo (textura tipográfica). Progresso numa barra grossa segmentada.
// Tipografia: Archivo Black (títulos, número, CTA) + Lato (corpo e rótulos).
// Paleta: só preto #050505, vermelho #D81C1B e branco #FFFFFF.

import { blocos, gapPadrao, alturaPilha, posDe, pad, dicaDe, seta, caber } from "./_comum.mjs";

const PESADA = "Archivo Black";
const SANS = "Lato";

const estilo = {
  id: "ref-titulo-pesado-tarja",
  nome: "Manchete",
  grao: 0.05,
  familias: {
    [PESADA]: ["archivo-black/ArchivoBlack-Regular.ttf"],
    [SANS]: ["lato/Lato-Light.ttf", "lato/Lato-Regular.ttf", "lato/Lato-Italic.ttf", "lato/Lato-Bold.ttf", "lato/Lato-Black.ttf"],
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
    const cx = full ? W / 2 : X0;
    const a = full ? "middle" : "start";
    const tinta = papel ? P.escuro : P.branco;
    const suave = papel ? rgba(P.escuro, 0.62) : rgba(P.branco, 0.78);
    const verm = P.acento;
    const corTok = (t) => kit.cor(t, !papel, { principal: [P.escuro, P.branco], suave: [P.escuro, P.branco] });

    const defs = `<defs>${kit.efeitosDefs("#000000")}
      <radialGradient id="vin" cx="50%" cy="55%" r="75%">
        <stop offset="0.35" stop-color="#000000" stop-opacity="0.05"/>
        <stop offset="1" stop-color="#000000" stop-opacity="0.78"/>
      </radialGradient>
      <filter id="sombraT" x="-20%" y="-40%" width="140%" height="190%">
        <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000000" flood-opacity="0.75"/>
        <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.6"/>
      </filter>
    </defs>`;
    const extra = full ? `filter="url(#sombraT)"` : "";

    /* ---------- cabeçalho de manchete + barra de progresso ---------- */
    let moldura =
      T(X0, f.molduraTopo + 8, "DUMI", { fam: PESADA, tam: 34, c: tinta, ls: 1, extra }) +
      T(XR, f.molduraTopo + 2, "SABORES ORIENTAIS", { fam: SANS, peso: 700, tam: 16, c: suave, a: "end", ls: 5, extra });
    if (!full)
      moldura +=
        `<rect x="${X0}" y="${f.fioTopo + 6}" width="${L}" height="4" fill="${tinta}"/>` +
        `<rect x="${X0}" y="${f.fioTopo + 14}" width="${L}" height="1.3" fill="${tinta}"/>`;
    const gB = 6;
    const wB = (L - gB * (total - 1)) / total;
    for (let k = 0; k < total; k++)
      moldura += `<rect x="${X0 + k * (wB + gB)}" y="${f.molduraBase - 10}" width="${wB}" height="${k === idx ? 10 : 4}" fill="${k <= idx ? verm : rgba(tinta, 0.3)}" transform="translate(0 ${k === idx ? 0 : 3})"/>`;
    const d = dicaDe(s);
    if (d) moldura += T(XR - 44, f.molduraBase - 26, d, { fam: SANS, peso: 900, tam: 19, c: tinta, a: "end", ls: 3, extra }) + seta(XR, f.molduraBase - 32, tinta, { w: 30 });

    /* ---------- blocos ---------- */
    const tipoTitulo = (ln) => {
      const nomeCor = kit.papel(String(ln.cor).split("/")[0]);
      const vermelha = ln.italico || nomeCor === "acento";
      return { fam: PESADA, peso: 400, tam: Math.round(ln.tam * (ln.italico ? 0.98 : 1.06) * (full ? 1.18 : 1)), c: vermelha ? (full ? P.branco : verm) : corTok(ln.cor), ls: -1 };
    };
    const { blocos: B, pe } = blocos(c, {
      x: cx,
      L,
      a,
      tinta,
      suave,
      destaque: verm,
      titulo: tipoTitulo,
      lh: 0.98,
      extra,
      rot: { fam: SANS, peso: 900, ls: 4 },
      corpo: { fam: SANS, peso: full ? 700 : 400, tam: story ? 35 : 32, lh: 1.42, largura: full ? L - 40 : L - 60 },
      numero: { variante: "cima", fam: PESADA, tam: story ? 250 : 220 },
      caixa: { fam: PESADA, tam: 50, h: 92, ls: 1 },
      citacao: { fam: SANS, peso: 300, it: true, tam: story ? 54 : 50, aspasFam: PESADA },
      lista: { variante: "regua", fam: SANS, peso: 700, tam: story ? 38 : 35, rotTam: 20, col: 200 },
      tarja: { fam: SANS, peso: 400 },
      cta: { variante: "sublinhado", fam: PESADA, tam: story ? 132 : 118, ls: 0, linkFam: SANS, linkPeso: 700 },
    });
    // assinatura do post: caixa vermelha "DUMI" sob o título nos slides de foto
    if (full && !s.caixaMarinho && s.titulo.length) {
      const i = B.findIndex((b) => b.tipo === "titulo");
      const est = { fam: PESADA, tam: 40, ls: 4 };
      const w = medir("DUMI", est) + 56;
      B.splice(i + 1, 0, {
        tipo: "caixa",
        h: 70,
        desenhar: (y) => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="70" fill="${verm}"/>` + T(cx, y + 35 + 14, "DUMI", { ...est, c: P.branco, a: "middle" }),
      });
    }
    const todos = [...B, ...pe];
    const hTexto = alturaPilha(todos);

    const ebEst = { fam: SANS, peso: 900, tam: 21, ls: 5 };
    const eyebrow = (y) => {
      if (!s.eyebrow) return "";
      const t = s.eyebrow.toUpperCase();
      const w = medir(t, ebEst);
      const x0 = full ? W / 2 - w / 2 : X0;
      return `<rect x="${x0 - (full ? 12 : 0)}" y="${y - 26}" width="${w + 24}" height="36" fill="${full ? P.branco : P.escuro}"/>` + T(x0 + (full ? 0 : 12), y, t, { ...ebEst, c: full ? P.escuro : P.branco });
    };

    const camadas = [];
    let svgCima = "";
    let topo = f.areaTopo;
    let ancora = s.ancora ?? "centro";
    const ebH = s.eyebrow ? 66 : 0;

    if (full) {
      camadas.push({ foto: { arquivo: s.fotoAbs, x: 0, y: 0, w: W, h: H, pos: posDe(c, s.pos), zoom: s.zoom ?? 1, tratamento: "cor", escurecer: 0.18 } });
      camadas.push({ svg: `${defs}<rect width="${W}" height="${H}" fill="url(#vin)"/>` });
      // bloco centrado um pouco abaixo do meio
      const yT = Math.min(f.areaBase - hTexto, Math.max(f.areaTopo + ebH, H * 0.64 - hTexto / 2));
      topo = yT;
      ancora = "topo";
      svgCima += eyebrow(yT - 42);
    } else {
      let fundo = `<rect width="${W}" height="${H}" fill="${papel ? P.claro : P.escuro}"/>`;
      if (!papel) {
        const palavra = (s.titulo[0]?.t ?? s.numero?.valor ?? "DUMI").split(/\s+/)[0].replace(/[^\p{L}\d]/gu, "").toUpperCase() || "DUMI";
        const est = caber(medir, palavra, { fam: PESADA, tam: story ? 420 : 380 }, W * 1.1);
        for (let k = 0; k < 4; k++)
          fundo += T(-30 + (k % 2) * 90, H * 0.28 + k * est.tam * 0.86, palavra, { ...est, c: "none", extra: `stroke="${rgba(P.branco, 0.06)}" stroke-width="2"` });
      }
      camadas.push({ svg: `${defs}${fundo}` });
      if (s.faixa) {
        const hF = Math.round(s.faixa.altura * H);
        const yF = f.fioTopo + 34;
        camadas.push({ foto: { arquivo: s.faixa.fotoAbs, x: X0, y: yF, w: L, h: hF, pos: posDe(c, s.faixa.pos), zoom: s.zoom ?? 1, tratamento: "cor" } });
        svgCima += `<rect x="${X0}" y="${yF + hF}" width="${L}" height="12" fill="${verm}"/>`;
        topo = yF + hF + 60 + ebH;
        ancora = "topo";
        svgCima += eyebrow(topo - 34);
      } else {
        const yT = Math.max(f.areaTopo + ebH, f.areaTopo + (f.areaBase - f.areaTopo - hTexto + ebH) / 2);
        topo = yT;
        ancora = "topo";
        svgCima += eyebrow(yT - 34);
      }
    }

    const r = kit.empilhar(todos, topo, f.areaBase, ancora, { gap: gapPadrao, erro: c.erro, rotulo: `slide ${idx + 1} (${c.formato})` });
    camadas.push({ svg: `${defs}${svgCima}${r.svg}${moldura}` });
    return camadas;
  },
};

export default estilo;
