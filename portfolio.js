/* ============================================================
   Gaurang Ashava — Data & AI Engineer
   nav · menu · reveal · progress · theme toggle · track sheets · Papercut player
   No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- theme: system by default, toggle remembers choice ---------- */
  var toggle = document.getElementById('themeToggle');
  var themeMeta = document.getElementById('themeColor');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0F0E0D' : '#ECE5D7');
    if (toggle) toggle.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  applyTheme(root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
  /* follow the device while the visitor hasn't picked a theme */
  var onSystem = function (e) { if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light'); };
  if (systemDark.addEventListener) systemDark.addEventListener('change', onSystem);
  else if (systemDark.addListener) systemDark.addListener(onSystem);

  /* ---------- nav stuck state + progress ---------- */
  var nav = document.getElementById('nav');
  var bar = document.querySelector('.progress i');
  var ticking = false;
  function onFrame() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop;
    if (nav) nav.classList.toggle('is-stuck', y > 24);
    if (bar) {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onFrame();

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function openMenu() {
    menu.hidden = false;
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    window.setTimeout(function () { menu.hidden = true; }, reduce ? 0 : 250);
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { if (menu.hidden) openMenu(); else closeMenu(); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { closeMenu(); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) closeMenu(); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('[data-rv]');
  if (reduce || !('IntersectionObserver' in window)) {
    each(revealables, function (el) { el.classList.add('in'); });
  } else {
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    each(revealables, function (el) { rv.observe(el); });
    /* safety net: never leave content hidden */
    window.setTimeout(function () { each(revealables, function (el) { el.classList.add('in'); }); }, 2500);
  }

  var hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('in'); }); });

  /* ---------- active section in nav ---------- */
  var linkFor = { about: 'about', build: 'about', work: 'work', lab: 'work', experience: 'experience', stack: 'stack', next: 'stack', contact: 'contact' };
  var navLinks = document.querySelectorAll('.nav__links a');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var ratios = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { ratios[e.target.id] = e.intersectionRatio; });
      var best = null, bestR = 0;
      Object.keys(ratios).forEach(function (id) { if (ratios[id] > bestR) { bestR = ratios[id]; best = id; } });
      each(navLinks, function (a) {
        a.classList.toggle('is-active', !!linkFor[best] && a.getAttribute('href') === '#' + linkFor[best]);
      });
    }, { threshold: [0, 0.15, 0.35, 0.6, 0.9] });
    each(document.querySelectorAll('main section[id]'), function (s) { so.observe(s); });
  }

  /* ---------- track sheets: #/trk-01 … #/trk-05 ----------
     A hash route, so the phone's back button / gesture closes the sheet
     and every track has a shareable link. */
  var track = document.getElementById('track');
  if (track) {
    var sheet = document.getElementById('sheet');
    var pages = track.querySelectorAll('.tp');
    var scroller = document.getElementById('trackScroll');
    var count = document.getElementById('trackCount');
    var behind = [document.getElementById('main'), nav, document.querySelector('.foot'), document.getElementById('vibe'), document.getElementById('player')];
    var openedFromList = false, returnFocus = null, baseTitle = document.title;

    var idFromHash = function () { var m = location.hash.match(/^#\/trk-(\d\d)$/); return m ? m[1] : null; };
    var setBehind = function (on) { behind.forEach(function (el) { if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } }); };

    var show = function (id) {
      var page = track.querySelector('.tp[data-page="' + id + '"]');
      if (!page) return null;
      each(pages, function (p) { p.hidden = p !== page; });
      track.setAttribute('aria-labelledby', 'tp-' + id);
      if (count) count.textContent = 'Trk ' + id + ' of ' + (pages.length < 10 ? '0' : '') + pages.length;
      document.title = page.querySelector('.tp__title').textContent + ' — Gaurang Ashava';
      scroller.scrollTop = 0;
      return page;
    };

    var open = function (id) {
      var wasOpen = !track.hidden;
      var page = show(id);
      if (!page) return;
      if (wasOpen) { page.classList.remove('is-swapping'); void page.offsetWidth; page.classList.add('is-swapping'); return; }
      track.classList.remove('is-closing');
      sheet.style.transform = '';
      track.hidden = false;
      document.body.classList.add('is-locked');
      setBehind(true);
      track.focus({ preventScroll: true });
    };

    var close = function () {
      if (track.hidden) return;
      setBehind(false);
      document.body.classList.remove('is-locked');
      document.title = baseTitle;
      var done = function () { track.hidden = true; track.classList.remove('is-closing'); sheet.style.transform = ''; };
      if (reduce) done(); else { track.classList.add('is-closing'); window.setTimeout(done, 290); }
      if (returnFocus) { returnFocus.focus({ preventScroll: true }); returnFocus = null; }
    };

    /* "Done", scrim, Esc, swipe-down all go through here */
    var dismiss = function () {
      if (openedFromList) { openedFromList = false; history.back(); }
      else {                               /* arrived via a shared link: land on the tracklist */
        history.replaceState(null, '', location.pathname + location.search + '#work');
        close();
        var w = document.getElementById('work'); if (w) w.scrollIntoView();
      }
    };

    var route = function () { var id = idFromHash(); if (id) open(id); else close(); };

    document.addEventListener('click', function (e) {
      var link = e.target.closest('.trk__link');
      if (link) { openedFromList = true; returnFocus = link; }
    });
    track.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) { location.replace('#/trk-' + go.getAttribute('data-go')); return; }
      if (e.target.closest('[data-close]')) dismiss();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !track.hidden) dismiss(); });

    /* iOS-style: drag the sheet's header down to dismiss */
    var bar = document.getElementById('sheetBar');
    var startY = null, dy = 0;
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      startY = e.clientY; dy = 0;
      sheet.classList.add('is-dragging');
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', function (e) {
      if (startY === null) return;
      dy = Math.max(0, e.clientY - startY);
      sheet.style.transform = 'translate(-50%, ' + dy + 'px)';
    });
    var endDrag = function () {
      if (startY === null) return;
      startY = null;
      sheet.classList.remove('is-dragging');
      if (dy > 110) dismiss();
      else {
        sheet.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
        sheet.style.transform = '';
        window.setTimeout(function () { sheet.style.transition = ''; }, 320);
      }
    };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);

    window.addEventListener('hashchange', route);
    route();                               /* deep link: /#/trk-03 opens straight away */
  }

  /* ---------- Papercut: official YouTube video from 2:09 ----------
     Nothing loads until the visitor taps; the player can be closed any time. */
  var vibeBtn = document.getElementById('vibe');
  var player = document.getElementById('player');
  if (vibeBtn && player) {
    var frame = document.getElementById('playerFrame');
    var label = vibeBtn.querySelector('.vibe__txt');
    var setUi = function (on) {
      vibeBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      vibeBtn.setAttribute('aria-label', on ? 'Stop Papercut by Linkin Park' : 'Play Papercut by Linkin Park');
      label.textContent = on ? 'Stop Papercut' : 'Play Papercut';
    };
    var start = function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/vjVkXlxsO8Q?start=129&autoplay=1&playsinline=1&rel=0';
      f.title = 'Papercut by Linkin Park (official video) on YouTube';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      frame.appendChild(f);
      player.hidden = false;
      setUi(true);
    };
    var stop = function () { frame.innerHTML = ''; player.hidden = true; setUi(false); };
    setUi(false);
    vibeBtn.addEventListener('click', function () { if (player.hidden) start(); else stop(); });
    player.querySelector('.player__x').addEventListener('click', function () { stop(); vibeBtn.focus(); });
  }
})();
