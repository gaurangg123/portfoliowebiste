/* ============================================================
   Gaurang Ashava — Data & AI Engineer
   Interactions: nav · menu · reveal · progress · cursor
   No dependencies. ~4kb.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- current year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav stuck state + scroll progress ---------- */
  var nav = document.getElementById('nav');
  var bar = document.querySelector('.progress i');
  var ticking = false;

  function onFrame() {
    ticking = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    window.setTimeout(function () { menu.hidden = true; }, reduce ? 0 : 300);
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      if (menu.hidden) openMenu(); else closeMenu();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { closeMenu(); burger.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('[data-rv]');

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
  } else {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          rv.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(revealables, function (el) { rv.observe(el); });

    /* safety net: anything still hidden after 2.5s is shown */
    window.setTimeout(function () {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('in'); });
    }, 2500);
  }

  /* ---------- hero headline line reveal ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    if (reduce) hero.classList.add('in');
    else requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('in'); });
    });
  }

  /* ---------- active section indicator ---------- */
  var linkFor = {
    top: null, about: 'about', build: 'about',
    work: 'work', lab: 'work',
    experience: 'experience', stack: 'stack', contact: 'contact'
  };
  var navLinks = document.querySelectorAll('.nav__links a');
  var sections = document.querySelectorAll('main section[id], .hero[id]');

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      var target = linkFor[id];
      Array.prototype.forEach.call(navLinks, function (a) {
        a.classList.toggle('is-active', !!target && a.getAttribute('href') === '#' + target);
      });
    };
    var seen = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.intersectionRatio; });
      var best = null, bestRatio = 0;
      Object.keys(seen).forEach(function (id) {
        if (seen[id] > bestRatio) { bestRatio = seen[id]; best = id; }
      });
      if (best && bestRatio > 0) setActive(best);
    }, { threshold: [0, 0.15, 0.35, 0.6, 0.9] });
    Array.prototype.forEach.call(sections, function (s) { so.observe(s); });
  }

  /* ---------- subtle custom cursor (fine pointers) ---------- */
  var fine = window.matchMedia('(pointer: fine)').matches;
  if (fine && !reduce) {
    var dot = document.createElement('div');
    dot.className = 'cursor';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);

    var tx = -50, ty = -50, cx = -50, cy = -50, running = false;
    var hot = 'a, button, .pcard, .bcard, .lcard, .cert, .plat, .tags li';

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.classList.add('is-on');
      dot.classList.toggle('is-hot', !!(e.target.closest && e.target.closest(hot)));
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });

    window.addEventListener('pointerleave', function () { dot.classList.remove('is-on'); });

    function loop() {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) requestAnimationFrame(loop);
      else running = false;
    }
  }
})();
