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

  // Vorbestellung: wird per FormSubmit als E-Mail verschickt
  var form = document.getElementById('order-form');
  if (form) {
    var dateInput = form.querySelector('input[type=date]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);
    var msg = form.querySelector('.form-msg');
    var err = form.querySelector('.form-err');
    var btn = form.querySelector('button[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      if (form.elements._honey && form.elements._honey.value) return;
      msg.hidden = true; err.hidden = true;
      btn.disabled = true; var label = btn.textContent; btn.textContent = 'Wird gesendet …';
      var data = {
        Name: form.elements.name.value.trim(),
        Telefon: form.elements.tel.value.trim(),
        Abholdatum: form.elements.datum.value,
        Bestellung: form.elements.wunsch.value.trim(),
        _subject: 'Neue Vorbestellung über die Website – ' + form.elements.name.value.trim(),
        _template: 'table',
        _captcha: 'false'
      };
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok || String(res.j.success) === 'false') throw new Error(res.j.message || 'Fehler');
          msg.hidden = false; form.reset();
        })
        .catch(function () { err.hidden = false; })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  }
})();
