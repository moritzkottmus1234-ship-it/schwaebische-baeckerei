(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var body = document.body;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40 && !body.classList.contains('nav-open'));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeNav() {
    body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    onScroll();
  }
  toggle.addEventListener('click', function () {
    var open = !body.classList.contains('nav-open');
    if (!open) return closeNav();
    body.classList.add('nav-open');
    header.classList.remove('scrolled');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
  });
  document.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', closeNav); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  // Scroll-Animationen
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo-Formular: sendet nichts
  var form = document.getElementById('order-form');
  if (form) {
    var dateInput = form.querySelector('input[type=date]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      form.querySelector('.form-msg').hidden = false;
      form.reset();
    });
  }
})();
