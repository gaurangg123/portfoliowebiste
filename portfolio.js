/* ============================================================
   Gaurang Ashava — portfolio
   theme · nav · active link · gentle reveal · pipeline demo ·
   copy email · Papercut (plays only when Play is pressed)
   No dependencies. The pages work without this file; it only adds behaviour.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- year ---------- */
  each(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- theme: follows the device until the visitor picks one ---------- */
  var themeMeta = document.getElementById('themeColor');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var themeBtns = document.querySelectorAll('[data-theme-toggle]');

  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#141413' : '#F7F6F2');
    each(themeBtns, function (b) {
      var txt = b.querySelector('.theme-btn__txt');
      if (txt) txt.textContent = t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    });
  }
  applyTheme(root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light'));

  each(themeBtns, function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
  var onSystem = function (e) {
    var s = savedTheme();
    if (s !== 'light' && s !== 'dark') applyTheme(e.matches ? 'dark' : 'light');
  };
  if (systemDark.addEventListener) systemDark.addEventListener('change', onSystem);
  else if (systemDark.addListener) systemDark.addListener(onSystem);

  /* ---------- old track links (#/trk-01 … #/trk-05) now have real pages ----------
     The inline head script redirects fresh loads; this covers a hash
     change on an already-open homepage. */
  if (document.getElementById('work')) {
    var legacy = ['knowledge-portal', 'business-sheet', 'contract-intelligence', 'resume-matching', 'data-migration'];
    window.addEventListener('hashchange', function () {
      var m = location.hash.match(/^#\/trk-0([1-5])$/);
      if (m) location.replace('work/' + legacy[m[1] - 1] + '/');
    });
  }

  /* ---------- nav: hairline once the page scrolls ---------- */
  var nav = document.querySelector('[data-nav]');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (nav) nav.classList.toggle('is-scrolled', (window.pageYOffset || root.scrollTop) > 8);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- small screens: menu disclosure ---------- */
  var menuBtn = document.querySelector('[data-menu-btn]');
  var panel = document.getElementById('nav-panel');
  if (menuBtn && panel && nav) {
    var menuOpen = false;
    var setMenu = function (open) {
      menuOpen = open;
      panel.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (menuOpen && !nav.contains(e.target)) setMenu(false);
    });
    nav.addEventListener('focusout', function (e) {
      if (menuOpen && e.relatedTarget && !nav.contains(e.relatedTarget)) setMenu(false);
    });
    var wide = window.matchMedia('(min-width: 640px)');
    var onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- current section in the nav (homepage) ---------- */
  var navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    each(navLinks, function (a) {
      var id = a.getAttribute('href').slice(1);
      if (document.getElementById(id)) linkFor[id] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = linkFor[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          each(navLinks, function (l) { l.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'true');
        } else {
          a.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(function (id) { spy.observe(document.getElementById(id)); });
  }

  /* ---------- gentle entrance for content below the fold ----------
     Nothing is hidden until this runs, and anything already on screen
     is shown straight away, so content never waits on animation. */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    var fold = window.innerHeight * 0.94;
    each(revealables, function (el) {
      if (el.getBoundingClientRect().top < fold) el.classList.add('is-in');
      else reveal.observe(el);
    });
    root.classList.add('reveal-ready');
  }

  /* ---------- data migration diagram: stages light up once, in order ---------- */
  var pipes = document.querySelectorAll('[data-pipe]');
  if (pipes.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var pipeSeen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-playing'); pipeSeen.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    each(pipes, function (p) { pipeSeen.observe(p); });
  }

  /* ---------- copy email ---------- */
  each(document.querySelectorAll('[data-copy]'), function (btn) {
    var note = btn.parentNode.querySelector('[data-copy-status]');
    var label = btn.textContent;
    var timer = null;
    btn.addEventListener('click', function () {
      var done = function (ok) {
        btn.textContent = ok ? 'Copied' : label;
        if (note) note.textContent = ok ? 'Email address copied.' : 'Couldn’t copy. Select the address instead.';
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { btn.textContent = label; if (note) note.textContent = ''; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });

  /* ---------- Papercut (instrumental) ----------
     - silent on every page load; only the Play button starts it
     - the file isn't requested until that first press
     - eases in quietly from 2:09; after the first Play a small control
       stays in the nav so it can be paused from anywhere
     - pauses when the tab is hidden, and says so if it can't play */
  var audio = document.getElementById('papercut');
  var playBtns = document.querySelectorAll('[data-music]');
  if (audio && playBtns.length) {
    var mini = document.querySelector('[data-music-mini]');
    var status = document.getElementById('music-status');
    var VOL = 0.7, START = 129;
    var state = 'idle';                         /* idle | loading | playing */
    var everStarted = false, raf = null;

    var fade = function (to, ms, done) {
      cancelAnimationFrame(raf);
      var from = audio.volume, t0 = performance.now();
      if (reduceMotion.matches || ms <= 0) { audio.volume = to; if (done) done(); return; }
      (function step(now) {
        var k = Math.max(0, Math.min((now - t0) / ms, 1));
        audio.volume = Math.max(0, Math.min(1, from + (to - from) * k * k));
        if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    };
    var say = function (msg) { if (status) status.textContent = msg; };
    var render = function () {
      var on = state !== 'idle';
      each(playBtns, function (b) {
        b.classList.toggle('is-on', on);
        b.querySelector('.music-btn__txt').textContent = on ? 'Pause Papercut' : 'Play Papercut';
      });
      if (mini) {
        if (on) mini.hidden = false;            /* appears after the first Play, then stays */
        mini.classList.toggle('is-on', on);
        mini.setAttribute('aria-label', (on ? 'Pause' : 'Play') + ' Papercut (instrumental)');
      }
    };
    var fail = function () {
      cancelAnimationFrame(raf);
      state = 'idle';
      render();
      say('The track couldn’t be played right now.');
    };

    var play = function () {
      if (!audio.getAttribute('src')) audio.src = audio.getAttribute('data-src');
      state = 'loading';
      render();
      say('Loading…');
      var first = !everStarted;
      everStarted = true;
      if (first) {
        audio.volume = 0;
        var seek = function () { try { audio.currentTime = START; } catch (e) {} };
        if (audio.readyState >= 1) seek(); else audio.addEventListener('loadedmetadata', seek, { once: true });
      }
      var p = audio.play();
      if (p && p.catch) p.catch(function (err) { if (!err || err.name !== 'AbortError') fail(); });
      fade(VOL, first ? 2500 : 400);
    };
    var pause = function () {
      state = 'idle';
      render();
      say('');
      fade(0, 400, function () { if (state === 'idle') audio.pause(); });
    };

    audio.loop = true;
    audio.addEventListener('playing', function () {
      if (state === 'idle') return;
      state = 'playing';
      render();
      say('');
    });
    audio.addEventListener('error', function () { if (state !== 'idle') fail(); });

    each(playBtns, function (b) {
      b.addEventListener('click', function () { if (state === 'idle') play(); else pause(); });
    });
    if (mini) mini.addEventListener('click', function () { if (state === 'idle') play(); else pause(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state !== 'idle') { cancelAnimationFrame(raf); state = 'idle'; render(); audio.pause(); }
    });
  }
})();
