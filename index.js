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

  // Hover effect on interactive elements
  document.querySelectorAll('a, button, .quality-item, .imovel-card').forEach(el => {
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
    const m = document.getElementById('mobileMenu');
    m.classList.toggle('open');
  }
  function closeMobile() {
    document.getElementById('mobileMenu').classList.remove('open');
  }

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
  const cards = track.querySelectorAll('.imovel-card');
  const dotsContainer = document.getElementById('carouselDots');
  let currentSlide = 0;

  // Determine visible count
  function visibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  function totalSlides() {
    return Math.ceil(cards.length / visibleCount());
  }

  // Build dots
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
    currentSlide = Math.max(0, Math.min(idx, totalSlides() - 1));
    const cardW = cards[0].offsetWidth + 24; // gap = 24
    track.style.transform = `translateX(-${currentSlide * visibleCount() * cardW}px)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.getElementById('prevBtn').onclick = () => goTo(currentSlide - 1);
  document.getElementById('nextBtn').onclick = () => goTo(currentSlide + 1);

  buildDots();
  window.addEventListener('resize', () => { currentSlide = 0; goTo(0); buildDots(); });

  // Touch/swipe
  let touchStartX = 0;
  let touchMoved = false;
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchMoved = false;
  });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { touchMoved = true; goTo(dx < 0 ? currentSlide + 1 : currentSlide - 1); }
  });

  // Navegação para a página do imóvel ao clicar no card
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (!touchMoved) window.location.href = 'imovel.html?id=' + (i + 1);
      touchMoved = false;
    });
  });

  // ── EmailJS config ──
  // 1. Crie uma conta em https://www.emailjs.com
  // 2. Crie um Email Service (Gmail, etc) e anote o SERVICE_ID
  // 3. Crie um Email Template com as variáveis abaixo e anote o TEMPLATE_ID
  // 4. Copie sua Public Key em Account > API Keys
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