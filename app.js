/* ============================================================
   DADOS DO CARDÁPIO
   ============================================================ */
const IFOOD_URL = "https://www.ifood.com.br/delivery/londrina-pr/dumi-sabores-orientais-colonial/441a1b9e-961e-4c71-b29b-7c34fa4727f8?utm_content=link_in_bio&utm_medium=social&utm_source=ig";

const CATEGORIAS = {
  petiscos:   { titulo: "Petiscos Orientais", subtitulo: "Para começar bem, compartilhando os sabores da Ásia.", tipo: "foto" },
  pratos:     { titulo: "Pratos Individuais", subtitulo: "Receitas autorais com temperos e técnicas de 6 países.", tipo: "foto" },
  sobremesas: { titulo: "Sobremesas", subtitulo: "O ponto doce para fechar a experiência Dumi.", tipo: "foto" },
  drinks:     { titulo: "Drinks", subtitulo: "Coquetéis autorais à base de saquê — com ou sem álcool.", tipo: "foto" },
  bebidas:    { titulo: "Bebidas", subtitulo: "Água, sucos, refrigerantes e cervejas geladas.", tipo: "simples" },
};

const CARDAPIO = [
  // ---------------- PETISCOS ----------------
  { id:"murtabak", cat:"petiscos", nome:"Murta Bak Ayam", origem:"Malásia", bandeira:"🇲🇾",
    preco:"R$ 19,00", desc:"Massa especial com recheio de carne, frango, ovo cozido e temperos especiais (01 unid).",
    nota:"Massa fina e crocante envolvendo um recheio suculento — o clássico street food malaio.", img:"img/murta-bak.jpg" },

  { id:"khuushuur", cat:"petiscos", nome:"Khuushuur", origem:"Mongólia", bandeira:"🇲🇳",
    preco:"R$ 23,00", desc:"Massa especial com recheio de carne suína, ovina e temperos especiais (02 unid).",
    nota:"Pastel frito à moda mongol, com casca dourada e recheio bem temperado.", img:"img/khuushuur.jpg" },

  { id:"satay", cat:"petiscos", nome:"Satay", origem:"Indonésia", bandeira:"🇮🇩",
    preco:"R$ 27,00", desc:"Espeto com mignon bovino, mignon suíno, sobrecoxa de frango e temperos especiais (03 unid).",
    nota:"Grelhado no ponto, com aroma defumado marcante e marinada aromática.", img:"img/satay.jpg" },

  { id:"guyoza", cat:"petiscos", nome:"Guyoza", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 19,00", desc:"Massa cozida e frita com recheio de carne suína e temperos especiais (02 unid).",
    nota:"Base crocante e parte superior macia — o clássico dumpling japonês.", img:"img/guyoza.jpg" },

  { id:"nikumanju", cat:"petiscos", nome:"Nikumanju", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 18,00", desc:"Pão oriental com recheio de carne suína, legumes e temperos especiais (02 unid).",
    nota:"Pãozinho no vapor, fofo por fora e saboroso por dentro.", img:"img/nikumanju.jpg" },

  { id:"ebifurai", cat:"petiscos", nome:"Ebi Furai", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 60,00", desc:"Camarão empanado à moda tempurá com temperos especiais (porção).",
    nota:"Casquinha crocante em farinha panko, camarão suculento por dentro.", img:"img/ebi-furai.jpg" },

  { id:"iscapeixe", cat:"petiscos", nome:"Isca de Peixe", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 35,00", desc:"Tiras de salmão empanadas em farinha panko (porção).",
    nota:"Empanado leve e crocante que realça o sabor do salmão.", img:"img/isca-de-peixe.jpg" },

  // ---------------- PRATOS INDIVIDUAIS ----------------
  { id:"chowmein", cat:"pratos", nome:"Chow Mein", origem:"China", bandeira:"🇨🇳",
    preco:"R$ 45,00", desc:"Macarrão, mignon bovino e suíno, sobrecoxa de frango, camarão na manteiga, gengibre e temperos especiais.",
    nota:"Macarrão salteado no wok, com o toque picante e aromático do gengibre.", img:"img/chow-mein.jpg" },

  { id:"khotauy", cat:"pratos", nome:"Kho Tauy", origem:"Vietnã", bandeira:"🇻🇳",
    preco:"R$ 34,00", desc:"Panceta caramelizada, água de coco, anis estrelado, pimenta e temperos especiais.",
    nota:"Doce, salgado e levemente picante — o equilíbrio clássico da cozinha vietnamita.", img:"img/kho-tauy.jpg" },

  { id:"xendeg", cat:"pratos", nome:"Xendeg", origem:"Mongólia", bandeira:"🇲🇳",
    preco:"R$ 40,00", desc:"Sobrecoxa de frango empanada com camarão e temperos especiais.",
    nota:"Combinação crocante de frango e camarão em um só prato.", img:"img/xendeg.jpg" },

  { id:"nuer", cat:"pratos", nome:"Nuer", origem:"Tailândia", bandeira:"🇹🇭",
    preco:"R$ 40,00", desc:"Mignon bovino, pimentão, pimenta vermelha, castanha de caju moída e temperos especiais.",
    nota:"Notas picantes tailandesas com a crocância da castanha de caju.", img:"img/nuer.jpg" },

  { id:"teppanyaki", cat:"pratos", nome:"Teppanyaki", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 50,00", desc:"Salmão grelhado acompanhado de camarão, shitake, shimeji e temperos especiais.",
    nota:"Grelhado na chapa quente, selando os sucos do salmão e dos cogumelos.", img:"img/teppanyaki.jpg" },

  { id:"camaraodumi", cat:"pratos", nome:"Camarão à moda Dumi", origem:"Japão/Brasil", bandeira:"🇯🇵🇧🇷",
    preco:"R$ 60,00", desc:"Camarões grelhados na manteiga acompanhados de um suculento camarão empanado, shitake e shimeji.",
    nota:"Duas texturas de camarão em um só prato — grelhado amanteigado e empanado crocante.", img:"img/camarao-moda-dumi.jpg" },

  { id:"lagosta", cat:"pratos", nome:"Lagosta Oriental", origem:"China", bandeira:"🇨🇳",
    preco:"R$ 60,00", desc:"Lagostim acompanhado de camarão, shitake, shimeji e temperos especiais.",
    nota:"Frutos do mar e cogumelos orientais em harmonia com temperos especiais.", img:"img/lagosta-oriental.jpg" },

  { id:"takoyude", cat:"pratos", nome:"Takô Yude", origem:"Japão/Brasil", bandeira:"🇯🇵🇧🇷",
    preco:"R$ 60,00", desc:"Tentáculo de polvo acompanhado de camarão, shitake, shimeji e temperos especiais.",
    nota:"Polvo macio ao ponto, servido com frutos do mar e cogumelos orientais.", img:"img/tako-yude.jpg" },

  { id:"yakisoba", cat:"pratos", nome:"Yakisoba", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 38,00", desc:"Macarrão, legumes, verduras e proteínas refogados em um molho espesso à base de shoyu.",
    nota:"Salteado no ponto certo, com o molho de shoyu envolvendo cada ingrediente.", img:"img/yakisoba.jpg" },

  { id:"udon", cat:"pratos", nome:"Udon", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 38,00", desc:"Sopa quente com macarrão fresco, ovos, kani e acompanhamentos ricos.",
    nota:"Caldo quente e reconfortante com o macarrão udon espesso e macio.", img:"img/udon.jpg" },

  // ---------------- SOBREMESAS ----------------
  { id:"dorayaki", cat:"sobremesas", nome:"Dorayaki", origem:"Japão", bandeira:"🇯🇵",
    preco:"R$ 25,00", desc:"Massa especial recheada de creme com sorvete caseiro.",
    nota:"Panquecas fofinhas de mel abraçando um recheio cremoso.", img:"img/dorayaki.jpg" },

  { id:"sorvetedumi", cat:"sobremesas", nome:"Sorvete Dumi", origem:"Brasil", bandeira:"🇧🇷",
    preco:"R$ 20,00", desc:"Sorvete caseiro à moda Dumi com calda. Sabores: café c/ brownie, ferrero rocher, flocos, frutas vermelhas e mousse de maracujá.",
    nota:"Receita caseira, cremosa, finalizada com calda especial.", img:"img/sorvete-dumi.jpg" },

  // ---------------- DRINKS ----------------
  { id:"gyul", cat:"drinks", nome:"Gyul", origem:"Autoral Dumi", bandeira:"🍶",
    preco:"Sem álcool R$ 20,00 · Com álcool R$ 25,00", desc:"Saquê, xarope de tangerina, água com gás, hortelã e mel.",
    nota:"Cítrico e refrescante, com o adocicado do mel e o frescor da hortelã.", img:"img/gyul.jpg" },

  { id:"shoga", cat:"drinks", nome:"Shoga", origem:"Autoral Dumi", bandeira:"🍶",
    preco:"Sem álcool R$ 20,00 · Com álcool R$ 25,00", desc:"Saquê, xarope de gengibre, água tônica, alecrim, canela e espuma.",
    nota:"Picância do gengibre com notas quentes de canela e alecrim.", img:"img/shoga.jpg" },

  { id:"aka", cat:"drinks", nome:"Aka", origem:"Autoral Dumi", bandeira:"🍶",
    preco:"Sem álcool R$ 20,00 · Com álcool R$ 25,00", desc:"Saquê, xarope de cranberry, água com gás, hibisco, cravo e alecrim.",
    nota:"Frutado e floral, com o toque especiado do cravo.", img:"img/aka.jpg" },

  { id:"sagwa", cat:"drinks", nome:"Sagwa", origem:"Autoral Dumi", bandeira:"🍶",
    preco:"Sem álcool R$ 20,00 · Com álcool R$ 25,00", desc:"Saquê, xarope de maçã verde, limão, água com gás e alecrim.",
    nota:"Ácido e leve, com a frescura da maçã verde e do limão.", img:"img/sagwa.jpg" },

  // ---------------- BEBIDAS ----------------
  { id:"agua-sem-gas", cat:"bebidas", nome:"Água Mineral sem gás", preco:"R$ 4,00", desc:"", img:"img/agua-sem-gas.jpg" },
  { id:"agua-com-gas", cat:"bebidas", nome:"Água Mineral com gás", preco:"R$ 5,00", desc:"", img:"img/agua-com-gas.jpg" },
  { id:"suco", cat:"bebidas", nome:"Suco de Polpa de Frutas", preco:"R$ 12,00", desc:"Abacaxi, Abacaxi c/ hortelã, Frutas Vermelhas e Maracujá", img:"img/suco-frutas.jpg" },
  { id:"refri", cat:"bebidas", nome:"Refrigerante (Lata)", preco:"R$ 7,00", desc:"Coca-cola, Guaraná e Tônica", img:"img/refrigerante.jpg" },
  { id:"stella", cat:"bebidas", nome:"Cerveja Stella Artois (Long neck)", preco:"R$ 12,00", desc:"", img:"img/stella.jpg" },
  { id:"heineken", cat:"bebidas", nome:"Cerveja Heineken (Long neck)", preco:"R$ 10,00", desc:"", img:"img/heineken.jpg" },
];

/* ============================================================
   RENDERIZAÇÃO
   ============================================================ */
const gridFoto = document.getElementById('grid-photo');
const gridSimples = document.getElementById('grid-simple');
const catTitulo = document.getElementById('cat-title');
const catSubtitulo = document.getElementById('cat-sub');

const ICONE_FOLHA = `
  <svg viewBox="0 0 64 64" class="w-8 h-8 mb-3 opacity-80" fill="#C8102E" aria-hidden="true">
    <path d="M32 4c3 8 3 15 0 22 8-4 14-4 22 0-6 6-12 8-22 8 10 3 16 9 20 18-10-1-17-5-22-12 1 10-2 17-8 24-2-9-2-16 2-24-8 5-16 5-24 2 5-8 11-12 20-14C10 27 5 21 2 13c9-2 16-1 22 4C21 10 24 6 32 4z"/>
  </svg>`;

function blocoPlaceholder(item){
  return `
    <div class="placeholder-art w-full h-full flex flex-col items-center justify-center text-center px-6">
      ${ICONE_FOLHA}
      <p class="font-display text-gold/90 text-lg leading-snug">${item.nome}</p>
    </div>`;
}

function cardFoto(item){
  const posStyle = item.pos ? ` style="object-position:${item.pos}"` : '';
  const ehDrink = item.cat === 'drinks';
  const encaixe = ehDrink ? 'object-contain p-4' : 'object-cover';
  const img = item.img
    ? `<img src="${item.img}" alt="${item.nome}" class="card-img w-full h-full ${encaixe}"${posStyle}>`
    : blocoPlaceholder(item);
  const aspecto = ehDrink ? 'aspect-[3/4]' : 'aspect-[4/3]';

  return `
  <article class="card fade-up group bg-surface border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-red/40 transition-colors" data-id="${item.id}">
    <div class="relative ${aspecto} overflow-hidden bg-black">
      ${img}
      <span class="absolute top-3 left-3 bg-red/90 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide text-white">
        ${item.origem}
      </span>
    </div>
    <div class="p-5">
      <div class="flex items-start justify-between gap-3 mb-1.5">
        <h3 class="font-display text-lg leading-snug">${item.nome}</h3>
      </div>
      <p class="text-gold font-semibold text-sm mb-2">${item.preco}</p>
      <p class="text-textmuted text-xs leading-relaxed mb-4 line-clamp-2">${item.desc}</p>
      <button class="w-full ifood-btn text-white text-sm font-bold py-3 rounded-full abrir-ifood min-h-[44px]">
        Pedir no iFood
      </button>
    </div>
  </article>`;
}

function linhaSimples(item){
  const thumb = item.img
    ? `<div class="w-14 h-14 shrink-0 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
         <img src="${item.img}" alt="${item.nome}" class="w-full h-full object-contain">
       </div>`
    : `<div class="w-14 h-14 shrink-0 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-70">
         ${ICONE_FOLHA.replace('mb-3', 'mb-0').replace('w-8 h-8', 'w-6 h-6')}
       </div>`;

  return `
  <div class="fade-up py-4 flex items-center gap-4">
    ${thumb}
    <div class="flex-1 min-w-0 flex items-center justify-between gap-4">
      <div class="min-w-0">
        <p class="font-display text-base truncate">${item.nome}</p>
        ${item.desc ? `<p class="text-textmuted text-xs mt-1">${item.desc}</p>` : ''}
      </div>
      <p class="text-gold font-semibold text-sm whitespace-nowrap">${item.preco}</p>
    </div>
  </div>`;
}

function renderizar(cat){
  const meta = CATEGORIAS[cat];
  catTitulo.textContent = meta.titulo;
  catSubtitulo.textContent = meta.subtitulo;
  const itens = CARDAPIO.filter(i => i.cat === cat);

  if (meta.tipo === 'simples') {
    gridFoto.classList.add('hidden');
    gridSimples.classList.remove('hidden');
    gridSimples.innerHTML = itens.map(linhaSimples).join('');
  } else {
    gridSimples.classList.add('hidden');
    gridFoto.classList.remove('hidden');
    gridFoto.innerHTML = itens.map(cardFoto).join('');
    gridFoto.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.abrir-ifood')) return;
        abrirModal(card.dataset.id);
      });
      card.querySelector('.abrir-ifood')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(IFOOD_URL, '_blank', 'noopener');
      });
    });
  }

  observarElementosFade();
}

/* ============================================================
   ABAS
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderizar(btn.dataset.cat);
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   MODAL
   ============================================================ */
const modal = document.getElementById('dish-modal');
const modalPainel = modal.querySelector('.modal-panel');
const modalImg = document.getElementById('modal-img');
const modalImgWrap = document.getElementById('modal-img-wrap');
const modalNome = document.getElementById('modal-name');
const modalPreco = document.getElementById('modal-price');
const modalDesc = document.getElementById('modal-desc');
const modalNota = document.getElementById('modal-note');
const modalBandeira = document.getElementById('modal-flag');
const modalIfood = document.getElementById('modal-ifood');

function abrirModal(id){
  const item = CARDAPIO.find(i => i.id === id);
  if (!item) return;

  modalNome.textContent = item.nome;
  modalPreco.textContent = item.preco;
  modalDesc.textContent = item.desc;
  modalNota.textContent = item.nota || '';
  modalBandeira.textContent = item.origem;
  modalIfood.href = IFOOD_URL;

  const ehDrink = item.cat === 'drinks';
  modalImgWrap.classList.remove('aspect-[4/3]', 'aspect-[3/4]');
  modalImgWrap.classList.add(ehDrink ? 'aspect-[3/4]' : 'aspect-[4/3]');
  modalImg.classList.remove('object-cover', 'object-contain', 'p-6');
  modalImg.classList.add(ehDrink ? 'object-contain' : 'object-cover');
  if (ehDrink) modalImg.classList.add('p-6');

  if (item.img) {
    modalImg.src = item.img;
    modalImg.alt = item.nome;
    modalImg.style.objectPosition = item.pos || 'center';
    modalImg.classList.remove('hidden');
    modalImgWrap.querySelector('.placeholder-art')?.remove();
  } else {
    modalImg.classList.add('hidden');
    if (!modalImgWrap.querySelector('.placeholder-art')) {
      modalImgWrap.insertAdjacentHTML('afterbegin', blocoPlaceholder(item));
    }
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    modalPainel.classList.remove('opacity-0', 'translate-y-4', 'sm:scale-95');
  });
}

function fecharModal(){
  modal.classList.add('opacity-0');
  modalPainel.classList.add('opacity-0', 'translate-y-4', 'sm:scale-95');
  document.body.style.overflow = '';
  setTimeout(() => modal.classList.add('hidden'), 250);
}

document.getElementById('modal-close').addEventListener('click', fecharModal);
document.getElementById('modal-backdrop').addEventListener('click', fecharModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharModal(); });

/* ============================================================
   SOMBRA DO CABEÇALHO + ANIMAÇÃO DE ENTRADA
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('shadow-lg', window.scrollY > 10);
  navbar.classList.toggle('shadow-black/40', window.scrollY > 10);
}, { passive: true });

let observador;
function observarElementosFade(){
  if (!observador) {
    observador = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observador.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll('.fade-up:not(.in-view)').forEach(el => observador.observe(el));
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */
document.getElementById('ano').textContent = new Date().getFullYear();
renderizar('petiscos');
observarElementosFade();
