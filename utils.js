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
