document.querySelectorAll('a, button').forEach(addCursorHover);

// ── Helpers ──
function val(v, fallback) {
  return (v !== null && v !== undefined && v !== '') ? v : (fallback != null ? fallback : '—');
}

function setText(id, value, fallback) {
  var el = document.getElementById(id);
  if (el) el.textContent = val(value, fallback);
}

// ── Carregar dados do imóvel via Supabase ──
async function loadImovel() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  if (!id) {
    window.location.href = 'index.html';
    return;
  }

  let property, fetchError;
  try {
    const result = await sbClient
      .from('imoveis')
      .select('*')
      .eq('id', id)
      .single();
    property = result.data;
    fetchError = result.error;
  } catch (e) {
    console.error('[imovel.js] Erro ao conectar ao Supabase:', e);
    mostrarErro('Não foi possível conectar ao banco de dados.');
    return;
  }

  if (fetchError || !property) {
    console.error('[imovel.js] Imóvel não encontrado. id=' + id, fetchError);
    window.location.href = 'index.html';
    return;
  }

  // ── Título da aba ──
  document.title = val(property.nome, 'Imóvel') + ' | Thiago Bastos';

  // ── Galeria de fotos ──
  const imagens = toArray(property.imagens);
  let fotoAtual = 0;

  const galeriaImg       = document.getElementById('detalheImg');
  const galeriaContador  = document.getElementById('galeriaContador');
  const galeriaBtnAnterior = document.getElementById('galeriaAnterior');
  const galeriaBtnSeguinte = document.getElementById('galeriaSeguinte');
  const galeriaStrip     = document.getElementById('galeriaStrip');
  var thumbs = [];

  if (galeriaImg) galeriaImg.alt = val(property.nome, 'Imóvel');

  function setFoto(index) {
    if (!imagens.length || !galeriaImg) return;
    fotoAtual = (index + imagens.length) % imagens.length;

    galeriaImg.onload = function () { galeriaImg.style.opacity = '1'; };
    galeriaImg.onerror = function () { galeriaImg.style.opacity = '1'; };
    galeriaImg.style.opacity = '0';
    galeriaImg.src = imagens[fotoAtual];

    if (galeriaContador) galeriaContador.textContent = (fotoAtual + 1) + ' / ' + imagens.length;

    thumbs.forEach(function (t, i) { t.classList.toggle('active', i === fotoAtual); });

    if (galeriaStrip) {
      var activeThumb = galeriaStrip.children[fotoAtual];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // Thumbnails
  if (galeriaStrip && imagens.length > 0) {
    imagens.forEach(function (src, i) {
      var thumb = document.createElement('div');
      thumb.className = 'galeria-thumb' + (i === 0 ? ' active' : '');

      var imgEl = document.createElement('img');
      imgEl.src = src.replace(/w=\d+/, 'w=300');
      imgEl.alt = '';
      imgEl.loading = 'lazy';

      thumb.appendChild(imgEl);
      thumb.addEventListener('click', function () { setFoto(i); });
      galeriaStrip.appendChild(thumb);
    });
    thumbs = Array.from(galeriaStrip.querySelectorAll('.galeria-thumb'));
  }

  // Controles de navegação
  if (imagens.length <= 1) {
    if (galeriaBtnAnterior) galeriaBtnAnterior.style.display = 'none';
    if (galeriaBtnSeguinte) galeriaBtnSeguinte.style.display = 'none';
    if (galeriaContador)    galeriaContador.style.display = 'none';
    if (galeriaStrip)       galeriaStrip.style.display = 'none';
  } else {
    if (galeriaBtnAnterior) galeriaBtnAnterior.addEventListener('click', function () { setFoto(fotoAtual - 1); });
    if (galeriaBtnSeguinte) galeriaBtnSeguinte.addEventListener('click', function () { setFoto(fotoAtual + 1); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  setFoto(fotoAtual - 1);
      if (e.key === 'ArrowRight') setFoto(fotoAtual + 1);
    });

    var heroSection = document.querySelector('.detalhe-hero');
    if (heroSection) {
      var gTouchStart = 0;
      heroSection.addEventListener('touchstart', function (e) { gTouchStart = e.changedTouches[0].screenX; });
      heroSection.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].screenX - gTouchStart;
        if (Math.abs(dx) > 50) setFoto(dx < 0 ? fotoAtual + 1 : fotoAtual - 1);
      });
    }
  }

  setFoto(0);

  // ── Hero: badge, nome, localização, preço ──
  var badge = document.getElementById('detalheBadge');
  if (badge) {
    badge.textContent = val(property.status_label, 'Disponível');
    badge.className = 'imovel-badge badge-' + val(property.status, 'disponivel');
  }

  setText('detalheNome',  property.nome,  'Sem título');
  setText('detalheLoc',   property.local, '—');
  setText('detalhePreco', property.preco, '—');

  // ── Descrição ──
  setText('detalheDescricao', property.descricao, 'Descrição não informada.');

  // ── Stats ──
  var statsEl = document.getElementById('detalheStats');
  if (statsEl) {
    var statsData = [
      { label: 'Quartos',   value: val(property.quartos,   '—') },
      { label: 'Banheiros', value: val(property.banheiros, '—') },
      { label: 'Vagas',     value: val(property.vagas,     '—') },
      { label: 'Área',      value: val(property.area,      '—') }
    ];
    statsEl.innerHTML = '';
    statsData.forEach(function (s) {
      var div = document.createElement('div');
      div.className = 'detalhe-stat';
      div.innerHTML = '<span class="stat-value">' + s.value + '</span><span class="stat-label">' + s.label + '</span>';
      statsEl.appendChild(div);
    });
  }

  // ── Características ──
  var featEl = document.getElementById('detalheFeatures');
  if (featEl) {
    var caracteristicas = toArray(property.caracteristicas);
    var checkSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    if (caracteristicas.length > 0) {
      featEl.innerHTML = caracteristicas.map(function (f) {
        return '<li class="detalhe-feature">' + checkSvg + f + '</li>';
      }).join('');
    } else {
      featEl.innerHTML = '<li class="detalhe-feature" style="color:var(--silver)">Não informadas.</li>';
    }
  } else {
    console.error('[imovel.js] Elemento #detalheFeatures não encontrado no DOM.');
  }

  // ── Card lateral ──
  setText('detalheCardPreco', property.preco, '—');
  setText('detalheCardArea',  property.area,  '—');

  var waEl = document.getElementById('detalheWhatsapp');
  if (waEl) {
    var nomeImovel = val(property.nome, 'Imóvel');
    var localImovel = val(property.local, '');
    var precoImovel = val(property.preco, '');
    var msg = encodeURIComponent('Olá! Tenho interesse no imóvel ' + nomeImovel + (localImovel ? ' (' + localImovel + ')' : '') + (precoImovel ? ' no valor de ' + precoImovel : '') + '. Poderia me dar mais informações?');
    waEl.href = 'https://wa.me/5527992792515?text=' + msg;
  }
}

function mostrarErro(mensagem) {
  var main = document.querySelector('.detalhe-content');
  if (main) {
    main.innerHTML = '<div style="padding:4rem;text-align:center;color:var(--silver);font-size:0.9rem;letter-spacing:0.1em">' + mensagem + '<br><br><a href="index.html" style="color:var(--gold);text-decoration:none;letter-spacing:0.2em;font-size:0.75rem;text-transform:uppercase">← Voltar ao portfólio</a></div>';
  }
}

loadImovel();
