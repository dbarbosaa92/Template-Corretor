// ── esc: HTML escape ──
function esc(str) {
  return String(str != null ? str : '—')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── toArray: PostgreSQL text[] / JSON array / CSV string ──
function toArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v !== 'string') return [];
  var s = v.trim();
  if (s.startsWith('{') && s.endsWith('}')) {
    var inner = s.slice(1, -1), result = [], current = '', inQuote = false;
    for (var i = 0; i < inner.length; i++) {
      var c = inner[i];
      if (c === '"') { inQuote = !inQuote; }
      else if (c === ',' && !inQuote) { var it = current.trim(); if (it) result.push(it); current = ''; }
      else { current += c; }
    }
    var last = current.trim(); if (last) result.push(last);
    return result;
  }
  if (s.startsWith('[')) { try { return JSON.parse(s); } catch (e) {} }
  return s.split(',').map(function(x) { return x.trim(); }).filter(Boolean);
}

// ── Cursor animation + addCursorHover ──
(function () {
  var cursor = document.getElementById('cursor');
  var ring   = document.getElementById('cursorRing');

  if (!cursor || !ring) {
    window.addCursorHover = function () {};
    return;
  }

  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
    ring.style.left   = rx + 'px'; ring.style.top   = ry + 'px';
    requestAnimationFrame(animCursor);
  }());

  window.addCursorHover = function (el) {
    el.addEventListener('mouseenter', function () {
      ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '0.6';
    });
    el.addEventListener('mouseleave', function () {
      ring.style.width = '32px'; ring.style.height = '32px'; ring.style.opacity = '1';
    });
  };
}());

// ── Navbar scroll ──
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}());

// ── Mobile menu ──
function toggleMobile() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobile()  { document.getElementById('mobileMenu').classList.remove('open'); }
