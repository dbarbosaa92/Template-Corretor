  document.querySelectorAll('a, button, .quality-item').forEach(addCursorHover);

  // ── Scroll Reveal ──
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  // ── Carousel ──
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;
  let cards = [];
  let touchStartX = 0;
  let touchMoved = false;

  function visibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  function totalSlides() {
    return Math.ceil(cards.length / visibleCount());
  }
  function buildDots() {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('div');
      d.className = 'dot' + (i === currentSlide ? ' active' : '');
      d.onclick = () => goTo(i);
      dotsContainer.appendChild(d);
    }
  }
  function goTo(idx) {
    if (!cards.length) return;
    currentSlide = Math.max(0, Math.min(idx, totalSlides() - 1));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * visibleCount() * cardW}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.getElementById('prevBtn').onclick = () => goTo(currentSlide - 1);
  document.getElementById('nextBtn').onclick = () => goTo(currentSlide + 1);

  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchMoved = false;
  });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { touchMoved = true; goTo(dx < 0 ? currentSlide + 1 : currentSlide - 1); }
  });

  window.addEventListener('resize', () => {
    if (cards.length) { currentSlide = 0; goTo(0); buildDots(); }
  });

  const locSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  const arrowSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

  function buildCard(p) {
    const imgs = toArray(p.imagens);
    const imgSrc = imgs.length ? imgs[0].replace('w=1400', 'w=800') : '';
    const status = p.status || 'disponivel';
    const statusLabel = p.status_label || 'Disponível';
    return `<div class="imovel-card" data-id="${p.id}">
      <div class="imovel-img">
        <img src="${imgSrc}" alt="${esc(p.nome)}" loading="lazy">
        <div class="imovel-badge badge-${esc(status)}">${esc(statusLabel)}</div>
      </div>
      <div class="imovel-info">
        <h3 class="imovel-nome">${esc(p.nome)}</h3>
        <p class="imovel-loc">${locSvg}${esc(p.local)}</p>
        <div class="imovel-footer">
          <span class="imovel-preco">${esc(p.preco)}</span>
          <span class="imovel-area">${esc(p.area)}</span>
        </div>
        <a class="card-cta" href="imovel.html?id=${p.id}" onclick="event.stopPropagation()">
          Ver detalhes ${arrowSvg}
        </a>
      </div>
    </div>`;
  }

  async function initCarousel() {
    let data, error;
    try {
      const result = await sbClient.from('imoveis').select('*').order('id');
      data  = result.data;
      error = result.error;
    } catch (e) {
      console.error('[index.js] Erro ao buscar imóveis:', e);
      track.innerHTML = '<p class="carousel-empty">Erro ao carregar imóveis.</p>';
      return;
    }

    if (error || !data || !data.length) {
      console.warn('[index.js] Nenhum imóvel retornado.', error);
      track.innerHTML = '<p class="carousel-empty">Nenhum imóvel cadastrado.</p>';
      return;
    }

    track.innerHTML = data.map(p => buildCard(p)).join('');
    cards = Array.from(track.querySelectorAll('.imovel-card'));

    cards.forEach(card => {
      const pid = card.dataset.id;
      card.addEventListener('click', () => {
        if (!touchMoved) window.location.href = 'imovel.html?id=' + pid;
        touchMoved = false;
      });
      addCursorHover(card);
    });

    buildDots();
  }

  initCarousel();

  // ── Avaliações ──
  function criarCard(item) {
    var card = document.createElement('div');
    card.className = 'avaliacao-card';

    var stars = document.createElement('div');
    stars.className = 'avaliacao-stars';
    for (var i = 1; i <= 5; i++) {
      var s = document.createElement('span');
      if (i > item.estrelas) s.className = 'star-empty';
      s.textContent = '★';
      stars.appendChild(s);
    }

    var texto = document.createElement('p');
    texto.className = 'avaliacao-texto';
    texto.textContent = '“' + item.comentario + '”';

    var footer = document.createElement('div');
    footer.className = 'avaliacao-footer';

    var nome = document.createElement('span');
    nome.className = 'avaliacao-nome';
    nome.textContent = item.nome;

    var data = document.createElement('span');
    data.className = 'avaliacao-data';
    data.textContent = item.data;

    footer.appendChild(nome);
    footer.appendChild(data);
    card.appendChild(stars);
    card.appendChild(texto);
    card.appendChild(footer);
    return card;
  }

  async function initAvaliacoes() {
    var avaliacoesTrack = document.getElementById('avaliacoesTrack');
    if (!avaliacoesTrack) return;
    try {
      var res  = await fetch('avaliacoes.json');
      var data = await res.json();

      data.forEach(function (item) { avaliacoesTrack.appendChild(criarCard(item)); });
      data.forEach(function (item) { avaliacoesTrack.appendChild(criarCard(item)); });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          avaliacoesTrack.classList.add('rolando');
        });
      });
    } catch (e) {
      console.error('[index.js] Erro ao carregar avaliações:', e);
    }
  }

  initAvaliacoes();

  // ── EmailJS config ──
  const EMAILJS_PUBLIC_KEY  = 'a8uGR3bIBk-Iayu5a';
  const EMAILJS_SERVICE_ID  = 'service_tyomv08';
  const EMAILJS_TEMPLATE_ID = 'template_2q5gypb';

  emailjs.init(EMAILJS_PUBLIC_KEY);

  // ── Contact Form ──
  const form = document.getElementById('contactForm');
  const submitBtn = form.querySelector('.btn-submit');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        form.style.display = 'none';
        document.getElementById('formSuccess').style.display = 'block';
      })
      .catch(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Enviar Mensagem';
        alert('Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
      });
  });

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
