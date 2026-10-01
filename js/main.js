(function () {
  var root = document.documentElement;
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  var themeBtn = document.getElementById('themeBtn');

  document.getElementById('yr').textContent = new Date().getFullYear();

  // "top" links must reach the very top; the sticky header would otherwise stop the jump short
  [].forEach.call(document.querySelectorAll('a[href="#top"]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    });
  });

  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
  });

  themeBtn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // highlight the active nav link while scrolling
  var links = [].slice.call(menu.querySelectorAll('a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var a = map[en.target.id] || map.top;
          if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'services', 'projects', 'research', 'contact'].forEach(function (id) {
      var el = document.getElementById(id); if (el) io.observe(el);
    });
    var hero = document.querySelector('.hero');
    io.observe(Object.assign(hero, { id: hero.id || 'top-hero' }));
    map['top-hero'] = map.top;
  }
})();
