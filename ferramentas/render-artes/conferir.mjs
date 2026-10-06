// Conferência automática de artes (roda ANTES do verificador-realidade).
// DUMI: adaptado do Mercado Casa Grande (03/10/2026). Única mudança de lógica: a checagem de endereço
// procura "Spranger" (Av. Waldemar Spranger) em vez de "Veridiano". Fatos em ../../briefing/fatos.json.
//
// Uso:  node conferir.mjs <template.html> [mais.html ...]
//
// Para cada arte ([data-out]) confere: texto fora da margem de segurança, textos sobrepostos,
// imagem que não carregou, fonte que não carregou, telefone/endereço diferente do briefing,
// termos proibidos, preço não confirmado, QR pequeno no impresso e campos [a preencher].
// Fonte dos fatos: ../../briefing/fatos.json. Sai com código 1 se houver ERRO.
//
// Margens: feed 60 px laterais / 40 px topo-base · story 250 px topo / 340 px base ·
// impresso (.pagina) 8 mm da borda com sangria. Elemento com data-livre é ignorado.

import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const fatos = JSON.parse(readFileSync(join(aqui, "../../briefing/fatos.json"), "utf8"));
const arquivos = process.argv.slice(2);
if (!arquivos.length) {
  console.error("Uso: node conferir.mjs <template.html> [mais.html ...]");
  process.exit(1);
}

const browser = await chromium.launch();
let totalErros = 0;
try {
  for (const arq of arquivos) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 2200 } });
    await page.goto(pathToFileURL(resolve(arq)).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.documentElement.classList.add("render"));

    const resultados = await page.evaluate((fatos) => {
      const MM = 96 / 25.4;
      const out = [];
      for (const arte of document.querySelectorAll("[data-out]")) {
        const erros = [], avisos = [];
        const r = arte.getBoundingClientRect();
        const impresso = arte.classList.contains("pagina");
        const story = !impresso && r.height / r.width > 1.6;
        const m = impresso
          ? { t: 8 * MM, b: 8 * MM, l: 8 * MM, r: 8 * MM }
          : story ? { t: 250, b: 340, l: 60, r: 60 } : { t: 40, b: 40, l: 60, r: 60 };
        const tol = 2;

        // textos visíveis (linha a linha)
        const linhas = [];
        const walker = document.createTreeWalker(arte, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const n = walker.currentNode;
          if (!n.textContent.trim()) continue;
          const el = n.parentElement;
          if (el.closest("[data-livre], .guia, svg, style, script")) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
          const range = document.createRange();
          range.selectNodeContents(n);
          for (const q of range.getClientRects()) {
            if (q.width < 1 || q.height < 1) continue;
            // caixa de linha inclui folga da fonte; usa o miolo (60% da altura) para não dar falso alarme
            const f = q.height * 0.2;
            linhas.push({ el, q: { left: q.left, right: q.right, top: q.top + f, bottom: q.bottom - f }, txt: n.textContent.trim().slice(0, 40) });
          }
        }
        // 1. margem
        for (const { q, txt } of linhas) {
          const fora = [];
          if (q.left < r.left + m.l - tol) fora.push("esquerda");
          if (q.right > r.right - m.r + tol) fora.push("direita");
          if (q.top < r.top + m.t - tol) fora.push("topo");
          if (q.bottom > r.bottom - m.b + tol) fora.push("base");
          if (fora.length) erros.push(`texto fora da margem (${fora.join("/")}): "${txt}"`);
        }
        // 2. sobreposição entre textos de blocos diferentes
        const bloco = (el) => { let e = el; while (e && getComputedStyle(e).display.startsWith("inline")) e = e.parentElement; return e; };
        for (let i = 0; i < linhas.length; i++) for (let j = i + 1; j < linhas.length; j++) {
          const a = linhas[i], b = linhas[j];
          const ba = bloco(a.el), bb = bloco(b.el);
          if (ba === bb || ba.contains(bb) || bb.contains(ba)) continue;
          const w = Math.min(a.q.right, b.q.right) - Math.max(a.q.left, b.q.left);
          const h = Math.min(a.q.bottom, b.q.bottom) - Math.max(a.q.top, b.q.top);
          if (w > 3 && h > 3) erros.push(`textos sobrepostos: "${a.txt}" × "${b.txt}"`);
        }
        // 3. imagens e fontes
        for (const img of arte.querySelectorAll("img")) {
          if (!img.complete || img.naturalWidth === 0) erros.push(`imagem não carregou: ${img.getAttribute("src")}`);
        }
        const familias = new Set(linhas.map(({ el }) => getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim()));
        const carregadas = new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")));
        const sistema = ["serif", "sans-serif", "Georgia", "Arial", "monospace"];
        for (const f of familias) if (!carregadas.has(f) && !sistema.includes(f)) erros.push(`fonte não carregou: ${f}`);
        // 4. QR no impresso
        if (impresso) for (const img of arte.querySelectorAll('img[src*="qr-"]')) {
          const cs = getComputedStyle(img);
          const larg = img.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          if (larg / MM < 20) erros.push(`QR com ${(larg / MM).toFixed(1)} mm (mínimo 20 mm)`);
        }
        // 5. conteúdo × fatos
        const texto = arte.innerText.replace(/\s+/g, " ");
        const baixo = texto.toLowerCase();
        for (const { termo, motivo } of fatos.termos_proibidos) {
          if (baixo.includes(termo.toLowerCase())) erros.push(`termo proibido "${termo}" (${motivo})`);
        }
        for (const tel of texto.match(/\(?\d{2}\)?\s?\d{4,5}-\d{4}/g) || []) {
          if (!fatos.telefones_permitidos.some((p) => tel.endsWith(p))) erros.push(`telefone fora do briefing: ${tel}`);
        }
        if (/spranger/i.test(texto) && !texto.includes(fatos.endereco)) erros.push(`endereço diferente de "${fatos.endereco}"`);
        for (const preco of texto.match(/R\$\s?\d[\d.,]*/g) || []) {
          if (!fatos.precos_confirmados.includes(preco.replace(/\s/g, ""))) erros.push(`preço sem confirmação: ${preco}`);
        }
        const campos = (texto.match(/\[[^\]]+\]/g) || []).length;
        if (campos) avisos.push(`${campos} campo(s) [a preencher] — rascunho/template, não publicar assim`);
        out.push({ nome: arte.getAttribute("data-out"), erros: [...new Set(erros)], avisos });
      }
      return out;
    }, fatos);

    console.log(`\n== ${arq}`);
    if (!resultados.length) console.log("  (nenhum [data-out] encontrado)");
    for (const { nome, erros, avisos } of resultados) {
      totalErros += erros.length;
      console.log(`${erros.length ? "✗" : "✓"} ${nome}`);
      for (const e of erros) console.log(`    ERRO  ${e}`);
      for (const a of avisos) console.log(`    aviso ${a}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(totalErros ? `\n${totalErros} erro(s). Corrigir antes do verificador.` : "\nSem erros automáticos. Seguir para o verificador-realidade.");
process.exit(totalErros ? 1 : 0);
