/* ============================================================
   Gaurang Ashava — Data & AI Engineer
   nav · menu · reveal · progress · theme toggle · track sheets · Papercut
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
  var toggles = document.querySelectorAll('.js-theme');   /* header + desktop sidebar */
  var themeMeta = document.getElementById('themeColor');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#0F0E0D' : '#ECE5D7');
    each(toggles, function (b) { b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); });
  }
  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  applyTheme(root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light'));

  each(toggles, function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
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

  /* ---------- active section: top bar (grouped) + desktop sidebar (1:1) ----------
     The active section is the one crossing a line 35% down the viewport. */
  var linkFor = { about: 'about', build: 'about', work: 'work', lab: 'work', experience: 'experience', stack: 'stack', next: 'stack', contact: 'contact' };
  var navLinks = document.querySelectorAll('.nav__links a');
  var sideLinks = document.querySelectorAll('.side__nav a');
  var secs = document.querySelectorAll('main section[id]');
  var spyQueued = false;
  var spy = function () {
    spyQueued = false;
    var line = window.innerHeight * 0.35, current = null;
    each(secs, function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    each(navLinks, function (a) { a.classList.toggle('is-active', !!linkFor[current] && a.getAttribute('href') === '#' + linkFor[current]); });
    each(sideLinks, function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + current); });
  };
  window.addEventListener('scroll', function () { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener('resize', spy, { passive: true });
  spy();

  /* ---------- track sheets: #/trk-01 … #/trk-05 ----------
     A hash route, so the phone's back button / gesture closes the sheet
     and every track has a shareable link. */
  var track = document.getElementById('track');
  if (track) {
    var sheet = document.getElementById('sheet');
    var pages = track.querySelectorAll('.tp');
    var scroller = document.getElementById('trackScroll');
    var behind = [document.getElementById('main'), nav, document.getElementById('side'), document.querySelector('.foot'), document.getElementById('vibe')];
    var openedFromList = false, returnFocus = null, baseTitle = document.title;

    var idFromHash = function () { var m = location.hash.match(/^#\/trk-(\d\d)$/); return m ? m[1] : null; };
    var setBehind = function (on) { behind.forEach(function (el) { if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } }); };

    var show = function (id) {
      var page = track.querySelector('.tp[data-page="' + id + '"]');
      if (!page) return null;
      each(pages, function (p) { p.hidden = p !== page; });
      track.setAttribute('aria-labelledby', 'tp-' + id);
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
      sheet.classList.remove('is-opening'); void sheet.offsetWidth;
      if (!reduce) sheet.classList.add('is-opening');   /* slide up once */
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

    sheet.addEventListener('animationend', function (e) {
      if (e.animationName === 'sheet-up') sheet.classList.remove('is-opening');
    });

    /* follow the finger / mouse / trackpad, then either dismiss or spring back */
    var follow = function (y) {
      sheet.classList.remove('is-opening', 'is-settling');
      sheet.classList.add('is-dragging');
      sheet.style.transform = 'translate(-50%, ' + y + 'px)';
    };
    var springBack = function () {
      sheet.classList.remove('is-dragging');
      sheet.classList.add('is-settling');
      sheet.style.transform = '';
      window.setTimeout(function () { sheet.classList.remove('is-settling'); }, 320);
    };
    var release = function (y) {
      sheet.classList.remove('is-dragging');
      if (y > 110) dismiss(); else springBack();
    };

    /* 1. drag the header down (touch, pen or mouse) */
    var bar = document.getElementById('sheetBar');
    var startY = null, dy = 0;
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button') || e.button > 0) return;
      startY = e.clientY; dy = 0;
      try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    });
    bar.addEventListener('pointermove', function (e) {
      if (startY === null) return;
      dy = Math.max(0, e.clientY - startY);
      if (dy > 2) follow(dy);
    });
    var endDrag = function () { if (startY === null) return; startY = null; release(dy); };
    bar.addEventListener('pointerup', endDrag);
    bar.addEventListener('pointercancel', endDrag);

    /* 2. laptops & desktops: keep scrolling up at the top of a sheet
       (two-finger trackpad swipe or mouse wheel) to pull it down */
    var pull = 0, pullTimer = null, lastScroll = 0;
    scroller.addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true });
    scroller.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.deltaY >= 0 || scroller.scrollTop > 0 || Date.now() - lastScroll < 250) {
        if (pull) { pull = 0; springBack(); }
        return;                                   /* normal scrolling, or momentum still settling */
      }
      e.preventDefault();
      pull += -e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      var y = Math.min(pull * 0.5, 240);
      window.clearTimeout(pullTimer);
      if (y > 150) { pull = 0; release(y); return; }
      follow(y);
      pullTimer = window.setTimeout(function () { pull = 0; springBack(); }, 180);
    }, { passive: false });

    window.addEventListener('hashchange', route);
    route();                               /* deep link: /#/trk-03 opens straight away */
  }

  /* ---------- Papercut, from 2:09 (assets/papercut.mp3) ----------
     preload="none": nothing downloads until the visitor taps. */
  var vibeBtn = document.getElementById('vibe');
  var song = document.getElementById('papercut');
  if (vibeBtn && song) {
    var START = 129;
    var label = vibeBtn.querySelector('.vibe__txt');
    var setUi = function (on) {
      vibeBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      vibeBtn.setAttribute('aria-label', on ? 'Pause Papercut by Linkin Park' : 'Play Papercut by Linkin Park');
      label.textContent = on ? 'Pause Papercut' : 'Play Papercut';
    };
    song.volume = 0.6;
    song.addEventListener('loadedmetadata', function () { if (song.currentTime < START - 1) song.currentTime = START; });
    song.addEventListener('ended', function () { setUi(false); });
    vibeBtn.addEventListener('click', function () {
      if (!song.paused) { song.pause(); setUi(false); return; }
      if (song.ended || song.currentTime < START - 1) { try { song.currentTime = START; } catch (err) {} }
      var p = song.play();                         /* inside the tap, so iOS allows it */
      setUi(true);
      if (p && p.catch) p.catch(function () { setUi(false); });
    });
    /* pause when the tab / app goes to the background */
    document.addEventListener('visibilitychange', function () { if (document.hidden && !song.paused) { song.pause(); setUi(false); } });
    setUi(false);
  }
})();
