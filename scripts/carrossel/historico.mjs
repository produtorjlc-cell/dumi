// Histórico anti-repetição + entrega na pasta de aprovação.
// Portado do motor do Instituto Kaizen; o que é da marca vem de ./marca.mjs.
//
// Usado por scripts/carrossel/gerar.mjs. Fontes:
//   carrosseis/_base/instituto.md   → ids de pauta válidos ("- `id` · …") — base de conhecimento da marca
//   carrosseis/_base/referencias.md → ids de referência válidos ("### `id`")
//   carrosseis/_base/historico.json → entregas anteriores
//
// Regras (barram o render, salvo --forcar):
//   - pautaId já entregue em outro carrossel
//   - gancho (slide 1) já usado
//   - referenciaId já usada (a fila de referencias.md é sequencial e não repete)
//   - cadência terça/quinta (2 carrosséis por execução = mesma data de entrega):
//     linha (meta.curso) ou foto repetida do outro carrossel da MESMA execução ou de
//     qualquer carrossel da execução ANTERIOR (a data de entrega mais recente)
// Avisos: foto usada nas 2 entregas anteriores; gancho diferente do título do slide 1;
//         mais de 2 entregas na mesma data.

import { readFile, writeFile, mkdir, copyFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as M from "./marca.mjs";

/** Linhas de conteúdo, arcos e palavras de CTA da marca (marca.mjs). */
export const CURSOS = M.CURSOS;
export const ARCOS = M.ARCOS;
/** Lista oficial de palavras-chave para o CTA de comentário. */
export const PALAVRAS_CTA = M.PALAVRAS_CTA;
export const ORIGENS_FOTO = ["ia", "unsplash", "pexels"];
export const FUNCOES = ["gancho", "valor", "ponte", "cta"];

/** Pasta de aprovação da marca (marca.mjs). */
export const DESTINO_PADRAO = M.DESTINO_PADRAO;

const JANELA_FOTO = 2;

export function caminhosBase(raiz) {
  const base = path.join(raiz, "carrosseis", "_base");
  return {
    base,
    instituto: path.join(base, "instituto.md"),
    referencias: path.join(base, "referencias.md"),
    historico: path.join(base, "historico.json"),
  };
}

async function idsDe(arquivo, re) {
  if (!existsSync(arquivo)) return null;
  const txt = await readFile(arquivo, "utf8");
  return new Set([...txt.matchAll(re)].map((m) => m[1]));
}

export async function lerBase(raiz) {
  const c = caminhosBase(raiz);
  return {
    pautas: await idsDe(c.instituto, /^\s*[-*]\s+`([a-z0-9]+(?:-[a-z0-9]+)+)`/gm),
    referencias: await idsDe(c.referencias, /^#{2,4}\s+(?:[^`\n]*·\s*)?`([a-z0-9]+(?:-[a-z0-9]+)+)`/gm),
  };
}

/* ------------------------- fila de referências ---------------------------- */
export const PASTAS_REFERENCIA = M.PASTAS_REFERENCIA.map((p) => path.join(...p.split("/")));

/**
 * Fila = referências numeradas de referencias.md ("### 07 · `id`" + "**Arquivo:** `x`"),
 * em ordem. "legado" fica fora da fila.
 */
export async function lerFila(raiz) {
  const arq = caminhosBase(raiz).referencias;
  if (!existsSync(arq)) return null;
  const txt = await readFile(arq, "utf8");
  const fila = [];
  const re = /^###\s+(\d{2,3})\s+·\s+`([a-z0-9-]+)`[\s\S]*?\*\*Arquivo:\*\*\s+`([^`]+)`/gm;
  for (const m of txt.matchAll(re)) fila.push({ n: Number(m[1]), id: m[2], arquivo: m[3] });
  return fila.sort((a, b) => a.n - b.n);
}

function usadasNaFila(historico, ignorarSlug) {
  return new Set(historico.entregas.filter((e) => !e.legado && e.slug !== ignorarSlug).map((e) => e.referenciaId));
}

/** Próximas `n` referências + imagens novas ainda não catalogadas. */
export async function proximas(raiz, n = 2) {
  const fila = (await lerFila(raiz)) ?? [];
  const historico = await lerHistorico(raiz);
  const usadas = usadasNaFila(historico);
  const livres = fila.filter((r) => !usadas.has(r.id));
  const dirEstilos = path.join(caminhosBase(raiz).base, "estilos");
  const comEstilo = (r) => ({ ...r, estilo: existsSync(path.join(dirEstilos, `${r.id}.mjs`)) });
  let escolhidas = livres.slice(0, n).map(comEstilo);
  let esgotada = false;
  if (escolhidas.length < n) {
    esgotada = true;
    // sem referência nova: a menos recente, marcada como variação forte
    const ultimaVez = new Map();
    for (const e of historico.entregas) if (!e.legado) ultimaVez.set(e.referenciaId, e.data);
    const antigas = fila
      .filter((r) => !escolhidas.some((x) => x.id === r.id))
      .sort((a, b) => String(ultimaVez.get(a.id) ?? "").localeCompare(String(ultimaVez.get(b.id) ?? "")));
    escolhidas = [...escolhidas, ...antigas.slice(0, n - escolhidas.length).map((r) => ({ ...comEstilo(r), variacaoForte: true }))];
  }
  // catalogado = arquivo principal de uma referência OU qualquer nome de imagem citado entre
  // crases em referencias.md (séries e cópias idênticas listadas junto da referência)
  const catalogados = new Set(fila.map((r) => r.arquivo.normalize("NFC")));
  const txtRef = existsSync(caminhosBase(raiz).referencias) ? await readFile(caminhosBase(raiz).referencias, "utf8") : "";
  for (const m of txtRef.matchAll(/`([^`\n]+\.(?:jpe?g|png|webp))`/gi)) catalogados.add(m[1].normalize("NFC"));
  const novas = [];
  const vistos = new Set();
  for (const p of PASTAS_REFERENCIA) {
    const dir = path.join(raiz, p);
    if (!existsSync(dir)) continue;
    for (const f of await readdir(dir)) {
      const k = f.normalize("NFC");
      if (!/\.(jpe?g|png|webp)$/i.test(f) || catalogados.has(k) || vistos.has(k)) continue;
      vistos.add(k);
      novas.push(path.join(p, f));
    }
  }
  return { fila, usadas: [...usadas], escolhidas, esgotada, novas };
}

export async function lerHistorico(raiz) {
  const arq = caminhosBase(raiz).historico;
  if (!existsSync(arq)) return { versao: 1, entregas: [] };
  const h = JSON.parse((await readFile(arq, "utf8")).replace(/^\uFEFF/, ""));
  if (!Array.isArray(h.entregas)) throw new Error(`${arq}: "entregas" deve ser uma lista`);
  return h;
}

const normalizar = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Valida o bloco `meta` do roteiro contra a base e o histórico.
 * `slug` = nome da pasta do roteiro; entregas com o mesmo slug são ignoradas
 * (re-render de um carrossel já entregue).
 */
export function checarMeta({ meta, slug, slides, fotos, base, historico, legenda, fila, data }) {
  const erros = [];
  const avisos = [];
  const repeticoes = [];
  if (!meta || typeof meta !== "object") {
    erros.push(
      `roteiro: bloco "meta" obrigatório — { curso, pautaId, arco, referenciaId, gancho, palavraCta } (use --rascunho só para testes fora da rotina)`,
    );
    return { erros, avisos, repeticoes };
  }
  const CHAVES = ["curso", "pautaId", "arco", "referenciaId", "gancho", "palavraCta", "campanha", "creditos", "variacaoForte"];
  for (const k of Object.keys(meta)) if (!CHAVES.includes(k) && !k.startsWith("_")) erros.push(`meta: chave desconhecida "${k}"`);
  for (const k of ["curso", "pautaId", "arco", "referenciaId", "gancho"])
    if (typeof meta[k] !== "string" || !meta[k].trim()) erros.push(`meta.${k} é obrigatório (texto)`);
  if (erros.length) return { erros, avisos, repeticoes };

  if (!CURSOS.includes(meta.curso)) erros.push(`meta.curso "${meta.curso}" inválido (use ${CURSOS.join(", ")})`);
  if (!ARCOS.includes(meta.arco)) erros.push(`meta.arco "${meta.arco}" inválido (use ${ARCOS.join(", ")})`);
  if (!base.pautas) avisos.push(`carrosseis/_base/instituto.md não encontrado — pautaId não verificado`);
  else if (!base.pautas.has(meta.pautaId))
    erros.push(`meta.pautaId "${meta.pautaId}" não existe no banco de pautas (carrosseis/_base/instituto.md) — cadastre a pauta antes`);
  if (!base.referencias) avisos.push(`carrosseis/_base/referencias.md não encontrado — referenciaId não verificado`);
  else if (!base.referencias.has(meta.referenciaId))
    erros.push(`meta.referenciaId "${meta.referenciaId}" não existe em carrosseis/_base/referencias.md`);

  const titulo1 = normalizar(slides[0]?.titulo?.map((l) => l.t).join(" "));
  if (titulo1 && normalizar(meta.gancho) !== titulo1)
    avisos.push(`meta.gancho difere do título do slide 1 — o histórico registra o gancho do meta`);
  const nPalavras = normalizar(meta.gancho).split(" ").filter(Boolean).length;
  if (nPalavras > 12) avisos.push(`gancho com ${nPalavras} palavras — o slide 1 deve ter no máximo ~10`);

  // Estrutura persuasiva e CTA de engajamento (obrigatórios fora de campanha)
  if (meta.campanha !== true) {
    if (!PALAVRAS_CTA.includes(meta.palavraCta))
      erros.push(`meta.palavraCta deve ser uma das palavras oficiais: ${PALAVRAS_CTA.join(", ")}`);
    erros.push(...checarEstrutura(slides, meta.palavraCta));
    const linhas = String(legenda ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
    if (!linhas.length) erros.push(`legenda obrigatória na rotina (gancho na 1ª linha + CTA repetido)`);
    else {
      if (normalizar(linhas[0]) !== normalizar(meta.gancho))
        avisos.push(`a 1ª linha da legenda deveria ser o gancho ("${meta.gancho}")`);
      if (meta.palavraCta && !String(legenda).includes(meta.palavraCta))
        erros.push(`a legenda precisa repetir o CTA com a palavra "${meta.palavraCta}" (em caixa alta)`);
    }
  }

  const outras = historico.entregas.filter((e) => e.slug !== slug);
  const pauta = outras.find((e) => e.pautaId === meta.pautaId);
  if (pauta) repeticoes.push(`pauta "${meta.pautaId}" já foi entregue em ${pauta.data} (${pauta.slug}) — escolha outra`);
  const gancho = outras.find((e) => normalizar(e.gancho) === normalizar(meta.gancho));
  if (gancho) repeticoes.push(`gancho "${meta.gancho}" já usado em ${gancho.data} (${gancho.slug})`);
  // Fila sequencial de referências: nunca repetir; seguir a ordem 01, 02, 03…
  if (fila) {
    const naFila = fila.find((r) => r.id === meta.referenciaId);
    const usadas = usadasNaFila(historico, slug);
    const ref = outras.find((e) => e.referenciaId === meta.referenciaId && !e.legado);
    const esgotada = fila.every((r) => usadas.has(r.id));
    if (!naFila && meta.referenciaId !== M.MARCA.legadoId)
      erros.push(`meta.referenciaId "${meta.referenciaId}" não está na fila de referencias.md`);
    else if (meta.referenciaId === M.MARCA.legadoId && meta.campanha !== true)
      erros.push(`"${M.MARCA.legadoId}" é o estilo legado — a rotina usa a próxima referência da fila (node scripts/carrossel/historico.mjs --proxima)`);
    else if (ref && !(esgotada && meta.variacaoForte === true))
      repeticoes.push(
        `referência ${naFila?.n ?? ""} "${meta.referenciaId}" já foi usada em ${ref.data} (${ref.slug}) — cada carrossel usa uma referência NOVA (veja --proxima)` +
          (esgotada ? `; a fila esgotou: use meta.variacaoForte: true e peça novas referências ao usuário` : ""),
      );
    else if (naFila) {
      const puladas = fila.filter((r) => r.n < naFila.n && !usadas.has(r.id)).map((r) => `${String(r.n).padStart(2, "0")} ${r.id}`);
      if (puladas.length > 1)
        avisos.push(`a fila está sendo pulada — referências anteriores ainda não usadas: ${puladas.join(", ")} (a ordem é sequencial)`);
    }
  }
  erros.push(...checarCreditos(meta.creditos, fotos, slug));

  // Cadência terça e quinta: cada execução entrega 2 carrosséis na mesma data. Os 2 têm
  // linhas e fotos diferentes entre si e diferentes dos da execução anterior.
  const hoje = data ?? dataLocal();
  const ordenadas = [...outras].sort((a, b) => String(a.data).localeCompare(String(b.data)));
  const irmaos = ordenadas.filter((e) => e.data === hoje);
  const anteriores = ordenadas.filter((e) => String(e.data) < hoje);
  const dataAnterior = anteriores.length ? anteriores[anteriores.length - 1].data : null;
  const execAnterior = anteriores.filter((e) => e.data === dataAnterior);
  if (irmaos.length >= 2)
    avisos.push(`já há ${irmaos.length} entrega(s) em ${hoje} — a rotina faz 2 carrosséis por execução`);
  for (const e of irmaos)
    if (e.curso === meta.curso)
      repeticoes.push(`linha "${meta.curso}" já é a do outro carrossel desta execução (${e.slug}) — os 2 da execução têm linhas diferentes`);
  for (const e of execAnterior)
    if (e.curso === meta.curso)
      repeticoes.push(`linha "${meta.curso}" foi usada na execução anterior (${e.data}, ${e.slug}) — escolha outra`);
  const vizinhas = new Map();
  for (const e of [...execAnterior, ...irmaos]) for (const f of e.fotos ?? []) vizinhas.set(f, e);
  for (const f of fotos)
    if (vizinhas.has(f)) {
      const e = vizinhas.get(f);
      repeticoes.push(`foto "${f}" já usada em ${e.data} (${e.slug}) — fotos não se repetem na execução nem em relação à anterior`);
    }
  const fotosRecentes = new Set(outras.slice(-JANELA_FOTO).flatMap((e) => e.fotos ?? []));
  for (const f of fotos)
    if (fotosRecentes.has(f) && !vizinhas.has(f)) avisos.push(`foto "${f}" já apareceu nas ${JANELA_FOTO} entregas anteriores`);
  if (meta.palavraCta && outras.slice(-JANELA_FOTO).some((e) => e.palavraCta === meta.palavraCta))
    avisos.push(`palavra de CTA "${meta.palavraCta}" já usada nas ${JANELA_FOTO} entregas anteriores — varie se houver outra que case com a linha`);
  return { erros, avisos, repeticoes };
}

/**
 * Fotos fora do banco da marca (geradas por IA ou de banco livre) ficam em
 * carrosseis/<slug>/fotos/ e precisam de crédito em meta.creditos:
 * { foto, origem: ia|unsplash|pexels, url?, licenca?, prompt?, referenciaId? }.
 */
function checarCreditos(creditos, fotos, slug) {
  const erros = [];
  const lista = creditos ?? [];
  if (!Array.isArray(lista)) return [`meta.creditos deve ser uma lista`];
  for (const [k, c] of lista.entries()) {
    if (!c || typeof c.foto !== "string" || !ORIGENS_FOTO.includes(c.origem))
      erros.push(`meta.creditos[${k}]: precisa de "foto" e "origem" (${ORIGENS_FOTO.join(", ")})`);
    else if (c.origem === "ia" && (!c.prompt || !c.referenciaId))
      erros.push(`meta.creditos[${k}]: imagem de IA precisa de "prompt" e "referenciaId" (o prompt parte sempre de uma referência)`);
    else if (c.origem !== "ia" && (!c.url || !c.licenca))
      erros.push(`meta.creditos[${k}]: foto de banco livre precisa de "url" de origem e "licenca"`);
  }
  const creditadas = new Set(lista.map((c) => path.posix.basename(String(c?.foto ?? "").split("\\").join("/"))));
  for (const f of fotos)
    if (!M.fotoDoBanco(f) && !creditadas.has(path.posix.basename(f)))
      erros.push(`foto "${f}" não é do banco da marca (${M.DESCRICAO_BANCO}) — registre origem e licença em meta.creditos (${slug})`);
  return erros;
}

/**
 * Estrutura obrigatória da rotina: slide 1 `gancho`, meio `valor` (≥ 2),
 * penúltimo `ponte`, último `cta` com a palavra-chave em caixa `palavra`.
 */
function checarEstrutura(slides, palavra) {
  const erros = [];
  const f = slides.map((s) => s.funcao);
  const n = slides.length;
  if (n < 5) erros.push(`a rotina pede no mínimo 5 slides (gancho, 2+ de valor, ponte, CTA) — há ${n}`);
  if (f.some((x) => !FUNCOES.includes(x)))
    erros.push(`todo slide precisa de "funcao" (${FUNCOES.join(" | ")}) na rotina`);
  if (f[0] !== "gancho") erros.push(`slide 1 deve ter funcao "gancho"`);
  if (f[n - 1] !== "cta") erros.push(`o último slide deve ter funcao "cta"`);
  if (n >= 3 && f[n - 2] !== "ponte") erros.push(`o penúltimo slide deve ter funcao "ponte" (liga o valor ao produto/à marca)`);
  const meio = f.slice(1, -2);
  if (meio.filter((x) => x === "valor").length < 2 || meio.some((x) => x !== "valor"))
    erros.push(`os slides do meio (2 ao ${n - 2}) devem ser todos funcao "valor" (mínimo 2)`);
  const cta = slides[n - 1]?.cta ?? [];
  const pal = cta.find((c) => c.estilo === "palavra");
  if (!pal) erros.push(`o último slide precisa de um cta estilo "palavra" com a palavra-chave para comentar`);
  else if (palavra && normalizar(pal.texto) !== normalizar(palavra))
    erros.push(`o cta "palavra" do último slide ("${pal.texto}") deve ser meta.palavraCta ("${palavra}")`);
  return erros;
}

export function dataLocal(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Copia feed + story/ + legenda.txt para <destino>/<data>-<slug>/ e registra
 * a entrega no histórico. Recusa reentregar o mesmo slug sem `forcar`.
 */
export async function entregar({ raiz, dir, slug, meta, fotos, total, data, destinoRaiz, forcar, log }) {
  const destinoBase = destinoRaiz ?? process.env[M.ENV_ENTREGA] ?? DESTINO_PADRAO;
  if (!existsSync(destinoBase))
    throw new Error(`pasta de aprovação não encontrada: ${destinoBase} (crie-a ou defina ${M.ENV_ENTREGA})`);
  const historico = await lerHistorico(raiz);
  const anterior = historico.entregas.find((e) => e.slug === slug);
  if (anterior && !forcar)
    throw new Error(`"${slug}" já foi entregue em ${anterior.data} (${anterior.pastaEntrega}) — use --forcar para reentregar`);

  const pasta = path.join(destinoBase, `${data}-${slug}`);
  if (existsSync(pasta) && !forcar) throw new Error(`a pasta de entrega já existe: ${pasta} — use --forcar`);
  await mkdir(path.join(pasta, "story"), { recursive: true });

  const copiar = async (de, para) => {
    if (!existsSync(de)) throw new Error(`arquivo esperado não existe: ${de}`);
    await copyFile(de, para);
  };
  for (let i = 1; i <= total; i++) {
    await copiar(path.join(dir, `slide-${i}.png`), path.join(pasta, `slide-${i}.png`));
    await copiar(path.join(dir, "story", `slide-${i}.png`), path.join(pasta, "story", `slide-${i}.png`));
  }
  await copiar(path.join(dir, "legenda.txt"), path.join(pasta, "legenda.txt"));
  // numa reentrega com menos slides, remove os excedentes que ESTE fluxo copiou antes
  for (const sub of [pasta, path.join(pasta, "story")])
    for (const f of await readdir(sub)) {
      const m = /^slide-(\d+)\.png$/.exec(f);
      if (m && Number(m[1]) > total) await unlink(path.join(sub, f));
    }

  const entrada = {
    data,
    slug,
    curso: meta.curso,
    pautaId: meta.pautaId,
    arco: meta.arco,
    referenciaId: meta.referenciaId,
    gancho: meta.gancho,
    palavraCta: meta.palavraCta ?? null,
    ...(meta.variacaoForte ? { variacaoForte: true } : {}),
    creditos: meta.creditos ?? [],
    fotos,
    pastaEntrega: pasta,
  };
  historico.entregas = historico.entregas.filter((e) => e.slug !== slug);
  historico.entregas.push(entrada);
  historico.entregas.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  await writeFile(caminhosBase(raiz).historico, JSON.stringify(historico, null, 2) + "\n", "utf8");
  log?.(`  ok  entregue em ${pasta}`);
  log?.(`  ok  histórico atualizado (${historico.entregas.length} entrega(s))`);
  return entrada;
}

/* ------------------------------ CLI --------------------------------------- *
 *   node scripts/carrossel/historico.mjs --proxima [--n=2]
 * Mostra as próximas referências da fila (e se já têm estilo), as usadas e as
 * imagens novas ainda não catalogadas em referencias.md.
 * ------------------------------------------------------------------------- */
const execDireto = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (execDireto) {
  const args = process.argv.slice(2);
  const n = Number((args.find((a) => a.startsWith("--n=")) ?? "--n=2").slice(4)) || 2;
  if (!args.includes("--proxima")) {
    console.log("Uso: node scripts/carrossel/historico.mjs --proxima [--n=2]");
    process.exit(1);
  }
  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  const r = await proximas(raiz, n);
  const pad = (x) => String(x).padStart(2, "0");
  console.log(`Fila de referências: ${r.usadas.length} usada(s) de ${r.fila.length}.`);
  console.log(`Próxima(s) ${n}:`);
  for (const e of r.escolhidas)
    console.log(
      `  ${pad(e.n)} · ${e.id}  —  ${e.arquivo}\n       estilo: ${e.estilo ? "pronto (carrosseis/_base/estilos/" + e.id + ".mjs)" : "AINDA NÃO EXISTE → criar antes de renderizar"}` +
        (e.variacaoForte ? "\n       FILA ESGOTADA: reuso com meta.variacaoForte: true — peça novas referências ao usuário" : ""),
    );
  if (r.novas.length) {
    console.log(`Imagens novas sem catálogo (${r.novas.length}) — catalogar no FIM de referencias.md (${pad(r.fila.length + 1)}, ${pad(r.fila.length + 2)}…):`);
    for (const f of r.novas) console.log(`  + ${f}`);
  } else console.log("Nenhuma imagem nova para catalogar.");
  process.exit(0);
}
