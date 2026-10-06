# CLAUDE.md - Diretrizes do Projeto (Produção JLC)

## Visão Geral do Projeto

Este repositório (`jlc-master-boilerplate`) contém a infraestrutura e os agentes automatizados
da **Produção JLC** para prospecção de clientes e conversão de web design em Londrina-PR,
operando com **custo zero de API** (via scraping de navegador). O único custo possível é a API
da Anthropic, e somente quando `ANTHROPIC_API_KEY` está configurada para gerar as abordagens
com IA — sem a chave, o agente cai automaticamente no gerador de mensagens padrão.

### Estrutura do monorepo

| Pasta                   | Papel                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `00-pasta-mae-cliente/` | **Template mestre por cliente fechado.** Copiado via `scripts/novo-cliente.ps1` a cada contrato novo, para montar site+app+agente de WhatsApp+automação daquele cliente. Ver `00-pasta-mae-cliente/README.md`. |
| `01-site-premium/`      | Starter Next.js (App Router) — site institucional/marketing de cliente.                                                                        |
| `02-app-local/`         | Starter Next.js — dashboard/aplicação de gestão do negócio do cliente.                                                                         |
| `03-agente-prospeccao/` | Agente Node/TypeScript de prospecção autônoma. Implementa o Método das Páginas.                                                                |
| `04-crm-prospeccao/`    | Next.js — CRM/painel de leads e métricas de conversão da prospecção.                                                                           |
| `branding/`             | **Pasta universal da marca.** Logo oficial e recursos visuais da Produção JLC (fonte única da verdade). Ver "Recursos de Marca (`branding/`)". |
| `docs/`                 | Documentação de entrega ao cliente (`MANUAL-DO-CLIENTE.md`, `CHECKLIST-DEPLOY.md`).                                                            |

A raiz carrega o ferramental de qualidade compartilhado (Husky + lint-staged + Prettier)
e a pasta `branding/`; cada módulo tem seu próprio `package.json`, `.gitignore` e `.env`.

## Identidade Visual da Produção JLC

Diretriz **obrigatória** nos módulos web (`01`, `02`, `04`), dashboards e qualquer material
entregue sob o selo Produção JLC.

> **Exceção — protótipo de redesign do lead (`03`, Passo "Refazer"):** a marca exibida é a
> **do lead**, não a da JLC. O **fundo** da página gerada é um **tom muito escuro derivado da
> cor de marca do próprio lead** (matiz da marca em luminosidade baixa — helper
> `fundoDaMarca()` em `src/redesign/cor.ts`), e a cor cheia da marca entra como acento. Sem
> cor de marca real extraída, cai num quase-preto neutro. O acabamento (tipografia,
> espaçamento, micro-interações) segue o padrão JLC; o fundo preto `#0a0a0a` abaixo **não**
> se aplica a esse protótipo. Ver `03-agente-prospeccao/METODO_PROSPECCAO.md`, Passo 02.

- **Fundo:** preto profundo `#0a0a0a` como base de toda a interface (dark mode corporativo).
- **Tipografia:** limpa, em branco `#ffffff` (cinzas foscos `#171717` / `#262626` para cards e
  superfícies translúcidas com _glassmorphism_).
- **Detalhes / acentos:** **gradiente tecnológico** — roxo → azul neon → ciano → amarelo ouro
  — aplicado em CTAs, destaques, bordas, ícones, gráficos e realces de dashboard. Valores de
  referência (ajustáveis no Tailwind config sob o namespace `jlc`):
  - roxo `#7c3aed`
  - azul neon `#2563eb`
  - ciano `#22d3ee`
  - amarelo ouro `#d4af37` (variantes `gold-light` `#e8c766`, `gold-dark` `#a9861f`)
- O gradiente é o **acento**, não o fundo: usar em traços finos e pontos focais sobre o preto,
  preservando o alto contraste e a legibilidade. Tokens neutros de tema (`background`,
  `foreground`, `muted`, `border`) permanecem como estão.
- Nos protótipos de redesign, esta identidade é a **moldura** da Produção JLC; o logo e as
  cores originais do cliente são preservados como o acento próprio dele dentro dessa moldura.

### Recursos de Marca (`branding/`)

A logo oficial e todos os recursos visuais da Produção JLC vivem numa pasta **universal**
na raiz do monorepo — **caminho global de referência**:

```
jlc-master-boilerplate/branding/
```

É a **fonte única da verdade** da marca. Nenhum módulo deve manter cópia divergente da logo;
todos consomem os arquivos daqui.

| Caminho                 | Conteúdo                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------ |
| `branding/README.md`    | Guia da pasta: estrutura, nomenclatura (`jlc-*`), como cada módulo referencia.       |
| `branding/paleta.md`    | Referência rápida das cores (espelha esta seção).                                    |
| `branding/logo/`        | Logo oficial — `.svg` mestre + `.png`. Variações: principal, branca, preta, símbolo. |
| `branding/icons/`       | Favicon e ícones de app derivados do símbolo.                                        |
| `branding/fonts/`       | Fontes da marca para self-hosting (`.woff2`), quando aplicável.                      |
| `branding/social/`      | Modelos Open Graph / redes (`og-default.png` 1200×630, capas, avatares).             |
| `branding/assinaturas/` | Assinaturas de e-mail e artes de contato.                                            |

**Uso nos módulos:** os projetos Next.js (`01`, `02`, `04`) copiam o necessário para
`public/branding/` no setup (ou importam o `.svg` como componente), sem editar a arte.
No agente (`03`), a logo da Produção JLC entra apenas como moldura/marca d'água nas páginas
de redesign — o logo do cliente continua protagonista. Toda alteração na logo oficial
atualiza `branding/` **e** `branding/paleta.md`.

## Comandos Principais

- **Configuração de dependências do navegador (uma vez):** `cd 03-agente-prospeccao && npm run browser:setup`
  (equivale a `npx playwright install chromium`; em servidor Linux sem GUI use `npx playwright install --with-deps chromium`).
- **Prospecção (Modo Real):** `cd 03-agente-prospeccao && npm run dev`
  Coleta de verdade, abrindo o Google Maps num navegador automatizado (Playwright). Para produção: `npm run build && npm start`.
- **Prospecção (Modo Simulado/Mock):** `USAR_DADOS_SIMULADOS=1 npm run dev`
  Dados fictícios de Gleba Palhano/Centro, sem abrir o navegador — valida o pipeline (diagnóstico, mensagem, exportação, histórico) sem depender do Maps.
  No PowerShell: `$env:USAR_DADOS_SIMULADOS = "1"; npm run dev`.
- **Execução em blocos (ritmo blindado):**
  `LOTE_TAMANHO_POR_EXECUCAO=10 LOTE_BLOCO=1 npm start` / `LOTE_TAMANHO_POR_EXECUCAO=10 LOTE_BLOCO=2 npm start`
  (no Windows há `run-bloco1.bat` / `run-bloco2.bat`, que fixam essas variáveis e mandam a saída para `logs/`).
- **Prospecção + redesign + publicação (Passos 02 e 03):**
  `REDESIGN_ATIVO=1 PUBLICAR_VERCEL=1 VERCEL_TOKEN=… npm start` — gera o protótipo de cada lead
  e publica na Vercel, imprimindo o link `https://<slug>.vercel.app`. Sem `PUBLICAR_VERCEL` o
  protótipo fica só em `output/redesign/<slug>/`.
- **Módulos web (`01`, `02`, `04`):** `npm run dev` · `npm run build` · `npm start` · `npm run lint`.
- **Raiz:** `npm install` · `npm run format` (Prettier em todo o repositório).

### Infraestrutura de Webhook — Cloudflare Tunnel + n8n (padrão oficial)

O fluxo de prospecção **exige uma URL pública de webhook no ar** para o n8n **receber as
respostas de WhatsApp dos leads**. Sem essa ponte, o Passo 4 (abordagem) não fecha o ciclo.

- **Script oficial e único ponto de verdade:**
  `03-agente-prospeccao/scripts/start-n8n-tunnel.ps1` (versionado com o projeto).
  O `~/start-n8n-tunnel.ps1` é apenas um _shim_ que encaminha para ele — não editar lógica lá.
- **O que o script faz:** sobe um **Cloudflare Quick Tunnel** (gratuito, sem conta) apontando
  para `http://localhost:5678`, sobe o **n8n** já com `WEBHOOK_URL` / `N8N_HOST` /
  `N8N_PROTOCOL=https` / `N8N_EDITOR_BASE_URL` configurados para o endereço público, e grava a
  URL atual em `03-agente-prospeccao/.tunnel-url.txt` (uma linha, git-ignored).
- **Portas:** n8n em `5678`, task broker em `5679`.
- **Pré-requisito (uma vez):** `winget install --id Cloudflare.cloudflared`.
- **Verificação de pré-voo:** `powershell -ExecutionPolicy Bypass -File scripts/start-n8n-tunnel.ps1 -CheckOnly`
  → sai com código `0` se n8n + túnel estão de pé e `/healthz` público responde `200`; código `1`
  caso contrário (aí rodar o mesmo script **sem** `-CheckOnly`).
- **URL efêmera:** o endereço `*.trycloudflare.com` **muda a cada reinício** do cloudflared e
  não tem SLA. Sempre reler `.tunnel-url.txt` e propagar o valor para `LEAD_WEBHOOK_URL` (e para
  o workflow do n8n / CRM que consome a resposta) antes de prospectar.
- **Não usar** `npx n8n start --tunnel`: a flag e o serviço `hooks.n8n.cloud` foram
  descontinuados pelo n8n; a única rota suportada é o script acima.
- **Caminhos de webhook no n8n:** produção `https://<url>/webhook/<caminho>`,
  teste `https://<url>/webhook-test/<caminho>`.

### Variáveis de ambiente do agente (`03-agente-prospeccao`)

| Variável                         | Função                                                                                                                                                                                                                                                                                  |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `USAR_DADOS_SIMULADOS`           | `1`/`true` força o **modo mock**. Em branco/`0` → **modo real** (scraping).                                                                                                                                                                                                             |
| `WHATSAPP_NUMERO_PADRAO`         | WhatsApp oficial da Produção JLC (DDI+DDD, só dígitos). Vira a assinatura de contato ao fim de cada mensagem — sempre acrescentada pelo código, nunca pela IA.                                                                                                                          |
| `LEAD_WEBHOOK_URL`               | Endpoint público (n8n) que recebe as respostas de WhatsApp dos leads. Aponta para `https://<slug>.trycloudflare.com/webhook/<caminho>`, com o host lido de `.tunnel-url.txt` (URL efêmera — reconferir a cada sessão). Ver "Infraestrutura de Webhook — Cloudflare Tunnel + n8n".       |
| `ANTHROPIC_API_KEY`              | Habilita a redação das abordagens por IA (Claude), com fallback automático para o gerador padrão em qualquer erro. Único item com custo.                                                                                                                                                |
| `LOTE_TAMANHO_POR_EXECUCAO`      | Empresas novas processadas por execução (padrão `10`).                                                                                                                                                                                                                                  |
| `LOTE_BLOCO`                     | Rótulo do bloco (`1` ou `2`) — só aparece no log.                                                                                                                                                                                                                                       |
| `NOTA_MINIMA` / `MIN_AVALIACOES` | Filtro universal de qualidade (padrão `4.7` e `20`).                                                                                                                                                                                                                                    |
| `REDESIGN_ATIVO`                 | `1`/`true` gera um protótipo de redesign por lead em `output/redesign/<slug>/` (Passo 02).                                                                                                                                                                                              |
| `PUBLICAR_VERCEL`                | `1`/`true` publica cada protótipo na Vercel e devolve `https://<slug>.vercel.app` (Passo 03). Exige `REDESIGN_ATIVO=1` e `VERCEL_TOKEN`.                                                                                                                                                |
| `VERCEL_TOKEN` / `VERCEL_SCOPE`  | Token da Vercel (nunca commitar) e slug do time, quando o token acessa mais de um.                                                                                                                                                                                                      |
| `INSTAGRAM_ATIVO`                | `1`/`true` liga a fonte cruzada Instagram (Passo 01b): varredura **só pública** do perfil do lead (foto de perfil → logo, bio → "sobre", seguidores/verificado, feed quando exposto). **Sem login, sem cookie de sessão, sem conta logada** — handle só de link real, nunca adivinhado. |
| `SCRAPER_DELAY_MS`               | Pausa entre requisições ao Maps. Manter **≥ 2000**.                                                                                                                                                                                                                                     |
| `SCRAPER_HEADLESS`               | `false` abre o navegador visível — para resolver CAPTCHA na mão.                                                                                                                                                                                                                        |

Versione apenas `.env.example`; o `.env` com valores reais nunca vai para o controle de versão.

## Diretrizes Operacionais do Agente (O Método das Páginas)

Manual detalhado: `03-agente-prospeccao/METODO_PROSPECCAO.md`. O agente opera de forma
autônoma e multissetorial (restaurantes, clínicas, barbearias, comércios, prestadores de
serviço, etc.) seguindo rigorosamente estas etapas:

**Passo 0 — Verificar a infraestrutura (pré-voo obrigatório).** Sempre que for iniciar uma
nova rodada de prospecção, **antes de qualquer outra ação**, o motor executa este roteiro:

- **Verificar a infraestrutura:** rodar `powershell -ExecutionPolicy Bypass -File 03-agente-prospeccao/scripts/start-n8n-tunnel.ps1 -CheckOnly`
  para checar se o **n8n** (porta `5678`) e o **Cloudflare Tunnel** estão ativos em background
  e se o `/healthz` público responde `200` (exit `0` = ok; exit `1` = incompleto).
- **Ligar (se necessário):** se algo estiver fora do ar (PC reiniciado, terminal fechado),
  executar o mesmo script **sem** `-CheckOnly`, ler a **nova URL pública** em
  `03-agente-prospeccao/.tunnel-url.txt` e propagá-la para `LEAD_WEBHOOK_URL` e para o
  workflow do n8n/CRM que recebe as respostas de WhatsApp.
- **Começar a prospecção:** só com a ponte pública confirmada de pé, seguir para os Passos
  1–4 abaixo (Achar → Refazer → Subir → Ofertar). Sem webhook público no ar, **não iniciar**
  a prospecção — as respostas dos leads se perderiam.

1. **Achar:** Varrer comércios em Londrina (Gleba Palhano, Centro, Av. Higienópolis e demais
   regiões comerciais) com **nota 4.7+ e alto volume de avaliações (≥ 20)**, classificando o
   nicho automaticamente pela categoria real do Maps. Descartar sites modernos, fluidos e com
   boa conversão; manter apenas leads **sem site ativo** ou com páginas datadas/deficientes
   (lentas, "estilo 2012", sem domínio próprio, sem CTA, redirecionador gratuito) e **com
   telefone**. Um "site" que na verdade é só Instagram/Linktree **não** desqualifica —
   serve de fonte cruzada. Empresa abordada nos **últimos 90 dias** fica bloqueada e não
   volta ao funil.
   - **Fonte cruzada Instagram (`INSTAGRAM_ATIVO=1`):** quando a ficha do Maps ou o "site"
     social traz um `instagram.com/<handle>`, raspar o **perfil público** (só URL, sem
     login/sessão/conta logada — risco de ban) para foto de perfil (logo), bio, seguidores,
     verificado e imagens do feed quando expostas. Handle nunca é adivinhado pelo nome.
     Best-effort: falha não interrompe o funil.
2. **Refazer:** Construir uma nova versão da página com **acabamento no padrão Produção JLC**
   (tipografia limpa, espaçamento, micro-interações) mas exibindo a **marca do lead**: o
   **fundo** é um tom muito escuro derivado da **cor de marca do próprio lead** (não o preto
   `#0a0a0a` da JLC — ver a exceção em "Identidade Visual da Produção JLC"), e o logo e a cor
   cheia da marca do cliente entram como acento. Foco em conversão para WhatsApp.
   **Regra de ouro: não inventar informações** — todo o conteúdo
   (serviços, cardápio, horários, história, endereço, contato) vem do material real do
   negócio. Ajustar o foco ao nicho (agendamento para clínicas/barbearias; cardápio/reservas
   para restaurantes; vitrine/orçamento para lojas).
3. **Subir:** Publicar o protótipo na **Vercel** (padrão), gerando um **link limpo** no formato
   `https://proposta-[nicho]-[nome-da-empresa].vercel.app` — cada demonstração é um projeto
   Vercel próprio, nomeado pelo slug. Deploy automatizado via CLI da Vercel
   (`vercel deploy --prod --yes`, autenticado por `VERCEL_TOKEN`), ligado por `PUBLICAR_VERCEL=1`
   (exige `REDESIGN_ATIVO=1`). Validar o link público, responsivo e otimizado para mobile.
   **HostGator/Hostinger (cPanel) não é usada nesta etapa** — fica reservada só para depois que
   o cliente fecha e quer a versão final no **domínio próprio** dele. Fazer limpeza periódica
   dos projetos Vercel de demonstrações antigas (`vercel project rm <slug>`).
   Assim que o deploy é confirmado, o script dispara um `POST` "invisível" para
   `LEAD_WEBHOOK_URL` (n8n) com `{ nome, whatsapp, urlPrototipo }` — fire-and-forget, não
   trava o funil (`src/notificarWebhook.ts`).
4. **Ofertar:** Logo após o deploy (Passo 3), montar automaticamente a **abordagem de venda
   em 2 etapas** para o WhatsApp, por lead (`src/mensagemVenda.ts` + `gerarAbordagemVendaComIA`
   em `src/ia.ts`): **(1) Elogio** ao trabalho ancorado na reputação real do Google (nota +
   volume de avaliações de destaque), sem venda e sem link; **(2) Solução como bônus** — o
   protótipo `.vercel.app` já no ar, apresentado como bônus exclusivo e sem compromisso para
   elevar a experiência dos clientes, gerando curiosidade **sem parecer venda agressiva**.
   Sai também uma `mensagemUnica` (as duas num fluxo só, terminando em "posso te enviar o
   link?"). **Sem mencionar preço no primeiro contato** (evita filtro de spam).
   **Toda mensagem passa por revisão humana antes do envio.** Campos no `Prospect`:
   `abordagemVendaEtapa1/2`, `abordagemVenda`, `urlPrototipo`, `whatsappLinkVenda`.

### Ritmo e conformidade

- **Webhook público no ar é pré-condição de cada rodada.** As respostas de WhatsApp dos leads
  chegam pelo n8n via Cloudflare Tunnel; rodar prospecção com a ponte fora do ar perde retorno
  de lead. Fazer o pré-voo do Passo 0 antes de tudo (`scripts/start-n8n-tunnel.ps1 -CheckOnly`).
- **20 leads por semana**, em **2 blocos de 10** em horários diferentes (`LOTE_BLOCO=1` e `2`) — blindagem contra bloqueio da Meta no WhatsApp.
- Cada execução para ao atingir `LOTE_TAMANHO_POR_EXECUCAO`, mesmo que haja mais resultados.
- Dados coletados vêm de fichas públicas do Google Meu Negócio; a abordagem segue a LGPD e o Marco Civil — **nada de disparo em massa sem revisão humana**. Scraping do Maps contraria os Termos de Uso do Google: volume baixo e pausas padrão.

## Regras de Código e Manutenção

- Manter as credenciais sensíveis fora do controle de versão (`.gitignore`): `.env`,
  `ANTHROPIC_API_KEY`, `LEAD_WEBHOOK_URL`, `VERCEL_TOKEN`, e as credenciais do cPanel/HostGator
  (usadas só na migração para o domínio próprio do cliente fechado). Em CI, usar GitHub Secrets
  — nunca hardcoded. Não commitar `node_modules/`, `dist/`, `output/`, `.next/`, `.vercel/`,
  `logs/`, `*.log`, `*.tsbuildinfo`.
- **Infraestrutura de webhook:** o único script suportado é
  `03-agente-prospeccao/scripts/start-n8n-tunnel.ps1` (padrão oficial, versionado). Não criar
  cópias nem variantes; o `~/start-n8n-tunnel.ps1` é só um _shim_. O `.tunnel-url.txt` é
  efêmero e git-ignored — nunca commitar.
- Respeitar o atraso (`SCRAPER_DELAY_MS >= 2000`) nas varreduras do mapa para evitar bloqueios
  por CAPTCHA. Se aparecer verificação, rodar uma vez com `SCRAPER_HEADLESS=false` e resolver
  manualmente.
- Em caso de falha de scraping por mudança de estrutura HTML do mapa, atualizar os seletores
  centralizados no objeto `SELETORES` dentro de `googleMapsScraper.ts`. Enquanto ajusta, use
  `USAR_DADOS_SIMULADOS=1` para validar o resto do pipeline.
- **Commits:** Conventional Commits com escopo do módulo (`feat(03-agente-prospeccao): …`,
  `fix(04-crm-prospeccao): …`, `chore: …`). Branch principal: `master`; features grandes em
  branch própria. O hook `.husky/pre-commit` roda `lint-staged` (Prettier) — não desabilitar.
- **Nenhuma entrega sem build limpo:** `npm run build` sem erros nem avisos críticos e
  `npm run lint` sem pendências nos módulos web.

### Padrões dos módulos web

- **Stack:** Next.js (App Router) + TypeScript rigoroso, Tailwind CSS, Framer Motion, `lucide-react` / `clsx` / `tailwind-merge`.
- **Paleta de marca `jlc`:** ver a seção **"Identidade Visual da Produção JLC"** e `branding/paleta.md` — fundo preto `#0a0a0a`, tipografia branca e detalhes no gradiente tecnológico (roxo `#7c3aed` → azul neon `#2563eb` → ciano `#22d3ee` → amarelo ouro `#d4af37`). Sobreposta aos tokens neutros de tema, que ficam como estão.
- **Logo e ativos de marca:** consumir sempre de `branding/` (raiz do monorepo) — ver "Recursos de Marca (`branding/`)". Copiar para `public/branding/` no setup do módulo; não duplicar nem editar a arte oficial.
- **Arquitetura `src/`:** `app/` (rotas + `api/lead/route.ts`), `components/` (`WhatsAppButton.tsx`, `StatCard.tsx`), `lib/` (moeda BRL, máscaras BR, SEO), `services/` (WhatsApp, envio de lead, integrações — nada de `fetch` solto), `types/` (`index.ts` + `env.d.ts`).
- **Regras de ouro:** Server Components por padrão (`'use client'` só onde há interação/animação); `SEO.tsx` com metadados dinâmicos e JSON-LD em todo projeto; WhatsApp flutuante (tracking `gtag`/`fbq`) e captura de lead via webhook (ManyChat, `LEAD_WEBHOOK_URL`) nas páginas de venda.
- **Referências estéticas ("estilo Ferrari / luxo"):** Aceternity UI, Magic UI; `trevornoah.com`, `mariavasilyeva.com`, `odysseeclinic.com.au`, `rothfinder.com`; Awwwards, Godly Website, Mobbin, Land-book.


# Diretrizes Gerais do Ecossistema JLC

## Stack Tecnológica Padrão
- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- Animações: GSAP / Framer Motion.

## Padrão Estético e Design
- Estilo B2B industrial, minimalista e de alta conversão (referência: dark mode profundo, contraste forte).
- Cores principais: Preto, cinza escuro/chumbo, branco e detalhes em dourado/laranja corporativo.
- Whitespace generoso (padding vertical `py-24` ou `py-32`).

## Regras de Código
- Código limpo, modular e componentizado em `src/components/ui/`.
- Uso obrigatório de SVGs limpos e otimizados para ícones e ilustrações.
- Nunca utilize placeholders genéricos ou textos longos e confusos.

Nunca execute o trabalho por conta própria.
Sempre delegue a tarefa a um subagente.
Não use sempre o Fable.
Use o Opus 5.5 para tarefas mais simples.

## Distribuição de modelos

- Fable 5.1: arquitetura, bugs complexos e revisão de código.
- Opus 5.5: edições, testes, documentação e refatoração.
- Haiku 4.5: pesquisas e resumos.
- Especifique o modelo em cada chamada de agente.

## Delegação

- Um subagente por tarefa. Planeje antes de executar.
- Execute subagentes independentes em paralelo.
- Leia o relatório, nunca os arquivos.

## Sistema de conteúdo do Dumi (vídeo, Reels, story, carrossel → aprovação → publicação)

_Adicionado em 03/10/2026, no modelo do Mercado Casa Grande. Fluxo completo: `docs/FLUXO-OPERACIONAL.md`.
Esta pasta é também o **cardápio online** publicado na Vercel; as pastas internas abaixo estão no `.vercelignore`._

- **Cliente:** Dumi Sabores Orientais (@dumisaboresorientais) — Av. Waldemar Spranger, 881 - Sala 5, Jardim São
  Jorge, Londrina-PR. Delivery exclusivo via iFood; WhatsApp para dúvidas. Fatos: `briefing/CLIENT-BRIEF.md` +
  `briefing/fatos.json` (fonte única — nunca inventar prato, preço, promoção ou horário).
- **Marca nas peças:** a do Dumi, nunca a da Produção JLC — fundo `#121212`, dourado `#D4AF37`, vermelho
  `#C8102E`, Playfair Display + Inter, `img/logo.png`. Detalhes: `img/PALETA-DUMI.md`.

| Tipo | Nome | Arquivo | Papel |
| --- | --- | --- | --- |
| Skill | `orquestrador-dumi` (NOVA) | `.claude/skills/orquestrador-dumi/SKILL.md` | Roteia pedido → agentes → portão → fila do painel |
| Skill | `novo-pedido` | `.claude/skills/novo-pedido/SKILL.md` | Registra pedido em `entrada/` com IDs `DUMI-AAAAMMDD-NN` |
| Skill | `entregar-aprovacao` (NOVA) | `.claude/skills/entregar-aprovacao/SKILL.md` | Copia finais para `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\<ID>-<slug>\` |
| Skill | `dumi-carrossel` (NOVA) | `.claude/skills/dumi-carrossel/SKILL.md` | Motor de carrossel (template `carrossel-dumi.html`) |
| Agente | `editor-video` (NOVO) | `.claude/agents/editor-video.md` | Reels falado (`reels-express`) e clipe curto 7–8 s |
| Agente | `editor-carrossel` (NOVO) | `.claude/agents/editor-carrossel.md` | Carrossel a partir das fotos do cardápio |
| Agente | `publicador` (NOVO) | `.claude/agents/publicador.md` | Confere a fila; quem publica é o painel-conteudo |
| Agente | `social-media` | `.claude/agents/social-media.md` | Roteiro, texto e `legenda.txt` |
| Agente | `diretor-arte` | `.claude/agents/diretor-arte.md` | Feed/story (template `posts-dumi.html`) |
| Agente | `verificador-realidade` | `.claude/agents/verificador-realidade.md` | Portão de qualidade (APROVADO libera a entrega) |

- **Pastas:** pedidos em `entrada/` (fotos em `entrada/fotos/AAAA-MM-DD/`, vídeos em `entrada/videos-brutos/AAAA-MM-DD/`) ·
  peças em `marketing/producao/AAAA-MM/<ID>/` (`ficha.md`, `legenda.txt`, `feed.png`, `story.png`, `carrossel/`, `video/`) ·
  render em `ferramentas/render-artes/` (`render.mjs`, `conferir.mjs`, `templates/`).
- **Painel:** `C:\Users\joaol\Projetos\painel-conteudo` — o Dumi já está cadastrado ("Restaurante DUMI Sabores
  Orientais", só Instagram). Fila: `C:\CAPCUT\ENVIAR PARA APROVAÇÃO\DUMI\` → aprovado vai sozinho para
  `C:\CAPCUT\APROVADOS\DUMI\`. Uma subpasta = um post (2+ imagens na mesma subpasta = carrossel).
- **Regras:** publicar só depois da aprovação do Dumi (painel + ficha); trocar a legenda da IA do monitor pelo
  `legenda.txt`; Claude não roda `monitor`/`publicar` nem sobe servidor sem pedido do João; ninguém grava token em arquivo.
