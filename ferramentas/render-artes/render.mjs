// Renderiza templates HTML de artes em PNG (redes sociais) e PDF (gráfica).
// DUMI: cópia sem alteração do motor do Mercado Casa Grande (ferramentas/render-artes/render.mjs, 03/10/2026).
// Templates do Dumi: templates/posts-dumi.html (feed + story) e templates/carrossel-dumi.html (slides).
//
// Uso:  node render.mjs <template.html> [pasta-de-saida]
//
// Convenções do template:
//  - Cada arte é um elemento com atributo data-out="nome.png" e tamanho fixo em px
//    (ex.: feed 1080x1350, story 1080x1920). Opcional data-escala="2" para PNG em alta.
//  - Para PDF de gráfica: <meta name="pdf" content="nome.pdf"> + CSS @page com o tamanho
//    final (ex.: A5 com sangria). O PDF sai com todas as páginas do documento.
//  - Saída padrão: pasta "saida/" ao lado do template.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [, , entrada, saidaArg] = process.argv;
if (!entrada) {
  console.error("Uso: node render.mjs <template.html> [pasta-de-saida]");
  process.exit(1);
}

const arquivo = resolve(entrada);
const saida = resolve(saidaArg ?? join(dirname(arquivo), "saida"));
mkdirSync(saida, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await page.goto(pathToFileURL(arquivo).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Classe "render" no <html>: o template pode esconder guias de corte etc. na saída final.
  await page.evaluate(() => document.documentElement.classList.add("render"));

  const artes = await page.$$("[data-out]");
  for (const el of artes) {
    const nome = await el.getAttribute("data-out");
    const escala = Number((await el.getAttribute("data-escala")) ?? "1");
    if (escala !== 1) {
      // Página nova com deviceScaleFactor para PNG em alta resolução.
      const hi = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: escala });
      await hi.goto(pathToFileURL(arquivo).href, { waitUntil: "networkidle" });
      await hi.evaluate(() => document.fonts.ready);
      await hi.evaluate(() => document.documentElement.classList.add("render"));
      await hi.locator(`[data-out="${nome}"]`).screenshot({ path: join(saida, nome) });
      await hi.close();
    } else {
      await el.screenshot({ path: join(saida, nome) });
    }
    console.log("PNG", join(saida, nome));
  }

  const pdf = await page.$eval('meta[name="pdf"]', (m) => m.content).catch(() => null);
  if (pdf) {
    await page.emulateMedia({ media: "print" });
    await page.pdf({ path: join(saida, pdf), printBackground: true, preferCSSPageSize: true });
    console.log("PDF", join(saida, pdf));
  }
  // Variantes de PDF: <meta name="pdf-variantes" content="a.pdf=.frente-a,.verso; b.pdf=.frente-b,.verso">
  // Para cada variante, mostra só as .pagina que batem com os seletores (na ordem do documento).
  const variantes = await page.$eval('meta[name="pdf-variantes"]', (m) => m.content).catch(() => null);
  if (variantes) {
    await page.emulateMedia({ media: "print" });
    for (const item of variantes.split(";").map((s) => s.trim()).filter(Boolean)) {
      const [nome, seletores] = item.split("=").map((s) => s.trim());
      await page.evaluate((sel) => {
        document.querySelectorAll(".pagina").forEach((p) => {
          p.style.display = p.matches(sel) ? "" : "none";
        });
      }, seletores);
      await page.pdf({ path: join(saida, nome), printBackground: true, preferCSSPageSize: true });
      console.log("PDF", join(saida, nome));
    }
  }
  if (!artes.length && !pdf && !variantes) console.warn("Nenhum [data-out] nem <meta name=pdf> encontrado.");
} finally {
  await browser.close();
}
