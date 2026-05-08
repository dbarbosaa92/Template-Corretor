// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.opacity = '0.6';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '32px';
    cursorRing.style.height = '32px';
    cursorRing.style.opacity = '1';
  });
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu ──
function toggleMobile() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ── Carregar dados do imóvel ──
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get('id'));
const property = typeof PROPERTIES !== 'undefined' && PROPERTIES.find(p => p.id === id);

if (!property) {
  window.location.href = 'index.html';
} else {
  document.title = property.nome + ' | Thiago Bastos';

  const galeriaImg = document.getElementById('detalheImg');
  const galeriaContador = document.getElementById('galeriaContador');
  const galeriaBtnAnterior = document.getElementById('galeriaAnterior');
  const galeriaBtnSeguinte = document.getElementById('galeriaSeguinte');
  const galeriaStrip = document.getElementById('galeriaStrip');
  const imagens = property.imagens || [];
  let fotoAtual = 0;

  galeriaImg.alt = property.nome;

  // ── Galeria de fotos ──
  function setFoto(index) {
    if (!imagens.length) return;
    fotoAtual = (index + imagens.length) % imagens.length;

    galeriaImg.style.opacity = '0';
    setTimeout(function() {
      galeriaImg.src = imagens[fotoAtual];
      galeriaImg.onload = function() { galeriaImg.style.opacity = '1'; };
    }, 180);

    galeriaContador.textContent = (fotoAtual + 1) + ' / ' + imagens.length;

    document.querySelectorAll('.galeria-thumb').forEach(function(t, i) {
      t.classList.toggle('active', i === fotoAtual);
    });

    var activeThumb = galeriaStrip.children[fotoAtual];
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Montar thumbnails
  imagens.forEach(function(src, i) {
    var thumb = document.createElement('div');
    thumb.className = 'galeria-thumb' + (i === 0 ? ' active' : '');

    var imgEl = document.createElement('img');
    imgEl.src = src.replace(/w=\d+/, 'w=300');
    imgEl.alt = '';
    imgEl.loading = 'lazy';

    thumb.appendChild(imgEl);
    thumb.addEventListener('click', function() { setFoto(i); });
    galeriaStrip.appendChild(thumb);
  });

  // Controles: mostrar ou ocultar conforme número de fotos
  if (imagens.length <= 1) {
    galeriaBtnAnterior.style.display = 'none';
    galeriaBtnSeguinte.style.display = 'none';
    galeriaContador.style.display = 'none';
    galeriaStrip.style.display = 'none';
  } else {
    galeriaBtnAnterior.addEventListener('click', function() { setFoto(fotoAtual - 1); });
    galeriaBtnSeguinte.addEventListener('click', function() { setFoto(fotoAtual + 1); });

    // Teclado
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') setFoto(fotoAtual - 1);
      if (e.key === 'ArrowRight') setFoto(fotoAtual + 1);
    });

    // Swipe mobile
    var heroSection = document.querySelector('.detalhe-hero');
    var gTouchStart = 0;
    heroSection.addEventListener('touchstart', function(e) {
      gTouchStart = e.changedTouches[0].screenX;
    });
    heroSection.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].screenX - gTouchStart;
      if (Math.abs(dx) > 50) setFoto(dx < 0 ? fotoAtual + 1 : fotoAtual - 1);
    });
  }

  setFoto(0);

  // ── Badge, nome, localização, preço ──
  var badge = document.getElementById('detalheBadge');
  badge.textContent = property.statusLabel;
  badge.className = 'imovel-badge badge-' + property.status;

  document.getElementById('detalheNome').textContent = property.nome;
  document.getElementById('detalheLoc').textContent = property.local;
  document.getElementById('detalhePreco').textContent = property.preco;

  // ── Descrição ──
  document.getElementById('detalheDescricao').textContent = property.descricao;

  // ── Stats ──
  var statsData = [
    { label: 'Quartos', value: property.quartos },
    { label: 'Banheiros', value: property.banheiros },
    { label: 'Vagas', value: property.vagas },
    { label: 'Área', value: property.area }
  ];
  var statsEl = document.getElementById('detalheStats');
  statsData.forEach(function(s) {
    var div = document.createElement('div');
    div.className = 'detalhe-stat';
    div.innerHTML = '<span class="stat-value">' + s.value + '</span><span class="stat-label">' + s.label + '</span>';
    statsEl.appendChild(div);
  });

  // ── Características ──
  var featEl = document.getElementById('detalheFeatures');
  property.caracteristicas.forEach(function(f) {
    var li = document.createElement('li');
    li.className = 'detalhe-feature';
    li.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' + f;
    featEl.appendChild(li);
  });

  // ── Card lateral ──
  document.getElementById('detalheCardPreco').textContent = property.preco;
  document.getElementById('detalheCardArea').textContent = property.area;

  var msg = encodeURIComponent('Olá! Tenho interesse no imóvel ' + property.nome + ' (' + property.local + ') no valor de ' + property.preco + '. Poderia me dar mais informações?');
  document.getElementById('detalheWhatsapp').href = 'https://wa.me/5527992792515?text=' + msg;
}
