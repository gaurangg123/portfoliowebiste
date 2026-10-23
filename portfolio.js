/* ============================================================
   Gaurang Ashava — portfolio
   theme · nav · current section · keeping your place on resize ·
   record rotation fallback ·
   copy email · Papercut (plays only when Play is pressed)
   No dependencies. The pages work without this file; it only adds behaviour.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };
  var onChange = function (mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  };

  /* ---------- year ---------- */
  each(document.querySelectorAll('[data-year]'), function (el) { el.textContent = new Date().getFullYear(); });

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

  /* ---------- theme: follows the device until the visitor picks one ---------- */
  var themeMeta = document.getElementById('themeColor');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  var themeBtns = document.querySelectorAll('[data-theme-toggle]');

  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', t === 'dark' ? '#1A1918' : '#F6F4EE');
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
  onChange(systemDark, function (e) {
    var s = savedTheme();
    if (s !== 'light' && s !== 'dark') applyTheme(e.matches ? 'dark' : 'light');
  });

  /* ---------- header: hairline once the page scrolls ---------- */
  var nav = document.querySelector('[data-nav]');
  var navQueued = false;
  window.addEventListener('scroll', function () {
    if (navQueued || !nav) return;
    navQueued = true;
    requestAnimationFrame(function () {
      navQueued = false;
      nav.classList.toggle('is-scrolled', window.pageYOffset > 8);
    });
  }, { passive: true });
  if (nav) nav.classList.toggle('is-scrolled', window.pageYOffset > 8);

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
    onChange(window.matchMedia('(min-width: 900px)'), function (e) { if (e.matches) setMenu(false); });
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

  /* ---------- keep your place when the window is resized (homepage) ----------
     On larger screens a section's height follows the viewport, and that makes the
     browser's own scroll anchoring stand down during a resize. So remember which
     section sits under the header, and how far into it, and put it back after a
     resize. Scrolling itself is left to the browser; a phone's toolbar sliding
     away (a height-only change on a touch screen) is ignored. */
  var panes = document.querySelectorAll('main > section[id]');
  if (panes.length > 1) {
    var finePointer = window.matchMedia('(pointer: fine)');
    var place = null, settling = 0, placeQueued = false;
    var lastW = window.innerWidth, lastH = window.innerHeight;
    var headerLine = function () { return parseFloat(getComputedStyle(root).scrollPaddingTop) || 0; };
    var remember = function () {
      placeQueued = false;
      if (settling) return;
      var line = headerLine();
      for (var i = 0; i < panes.length; i++) {
        var r = panes[i].getBoundingClientRect();
        if (r.bottom > line + 1) { place = { el: panes[i], at: (line - r.top) / r.height }; return; }
      }
    };
    var restore = function () {
      settling = 0;
      if (!place) return;
      var r = place.el.getBoundingClientRect();
      var dy = r.top + place.at * r.height - headerLine();
      if (Math.abs(dy) < 2) return;
      var behavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';   /* an instant correction, never an animated scroll */
      window.scrollBy(0, dy);
      root.style.scrollBehavior = behavior;
    };
    window.addEventListener('scroll', function () {
      if (!placeQueued) { placeQueued = true; requestAnimationFrame(remember); }
    }, { passive: true });
    window.addEventListener('resize', function () {
      var w = window.innerWidth, h = window.innerHeight;
      var moved = w !== lastW || (h !== lastH && finePointer.matches);
      lastW = w; lastH = h;
      if (!moved) return;
      window.clearTimeout(settling);
      settling = window.setTimeout(restore, 120);
    }, { passive: true });
    remember();
  }

  /* ---------- hero record: scroll-linked rotation fallback ----------
     Browsers with CSS scroll-driven animations rotate it in CSS. Elsewhere this
     maps the hero's scroll range to the same angle: geometry is measured only
     when the layout changes, and scrolling just reads the scroll position. */
  var spin = document.querySelector('.sculpture__spin');
  var heroEl = document.querySelector('.hero');
  var cssScroll = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (spin && heroEl && !cssScroll) {
    var start = 0, range = 1, maxTurn = 140, turnQueued = false;
    var turn = function () {
      turnQueued = false;
      var p = reduceMotion.matches ? 0 : (window.pageYOffset - start) / range;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      spin.style.setProperty('--turn', (p * maxTurn).toFixed(2) + 'deg');
    };
    var measure = function () {
      var r = heroEl.getBoundingClientRect();
      start = r.top + window.pageYOffset - (nav ? nav.offsetHeight : 0);
      range = Math.max(1, r.height);
      maxTurn = parseFloat(getComputedStyle(spin).getPropertyValue('--turn-max')) || 140;
      turn();
    };
    window.addEventListener('scroll', function () {
      if (!turnQueued) { turnQueued = true; requestAnimationFrame(turn); }
    }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(heroEl);
    else window.addEventListener('resize', measure, { passive: true });
    onChange(reduceMotion, turn);
    measure();
  }

  /* ---------- project walkthroughs ----------
     The player and its demos load on the first "Watch walkthrough" click,
     so they cost nothing until someone asks for one. Paths resolve from
     this script's own URL, so they work on every page and under any base path. */
  var demoTriggers = document.querySelectorAll('[data-demo]');
  if (demoTriggers.length) {
    var siteRoot = new URL('.', (document.currentScript && document.currentScript.src) || location.href).href;
    var DEMO_V = '16';
    var demoLoad = null;
    var addAsset = function (tag, attrs) {
      return new Promise(function (resolve, reject) {
        var el = document.createElement(tag);
        Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
        el.onload = resolve;
        el.onerror = reject;
        document.head.appendChild(el);
      });
    };
    var loadDemos = function () {
      if (window.PortfolioWalkthrough && window.PortfolioDemos) return Promise.resolve(window.PortfolioWalkthrough);
      if (!demoLoad) {
        var base = siteRoot + 'assets/walkthroughs/';
        demoLoad = Promise.all([
          addAsset('link', { rel: 'stylesheet', href: base + 'walkthrough.css?v=' + DEMO_V }),
          addAsset('script', { src: base + 'demos.js?v=' + DEMO_V }),
          addAsset('script', { src: base + 'walkthrough.js?v=' + DEMO_V })
        ]).then(function () { return window.PortfolioWalkthrough; });
        demoLoad.catch(function () { demoLoad = null; });   /* allow a retry */
      }
      return demoLoad;
    };
    each(demoTriggers, function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-busy') === 'true') return;
        btn.setAttribute('aria-busy', 'true');
        var note = btn.closest('figure, .project, .more__item, .case-demo');
        note = note && note.querySelector('[data-demo-status]');
        loadDemos().then(function (player) {
          btn.removeAttribute('aria-busy');
          if (note) note.textContent = '';
          if (!player || !player.open(btn.getAttribute('data-demo'), btn, siteRoot)) throw new Error('missing demo');
        }).catch(function () {
          btn.removeAttribute('aria-busy');
          if (note) note.textContent = 'The walkthrough couldn’t load. Please try again, or read the case study.';
        });
      });
    });
  }

  /* ---------- copy email ---------- */
  each(document.querySelectorAll('[data-copy]'), function (btn) {
    var note = btn.parentNode.querySelector('[data-copy-status]');
    var txt = btn.querySelector('span') || btn;   /* change the words, keep the icon */
    var label = txt.textContent;
    var timer = null;
    btn.addEventListener('click', function () {
      var done = function (ok) {
        txt.textContent = ok ? 'Copied' : label;
        if (note) note.textContent = ok ? 'Email address copied.' : 'Couldn’t copy. Select the address instead.';
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { txt.textContent = label; if (note) note.textContent = ''; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });

  /* ---------- Papercut (instrumental) ----------
     - silent on every page load; only the Play button starts it, and the file
       isn't requested before that first press
     - what the controls show comes from the audio element's own events, so it
       stays right when playback is blocked, fails, buffers or is paused elsewhere
     - after the first Play a small control stays in the header for pausing
     - eases in quietly from 2:09 and pauses when the tab is hidden */
  var audio = document.getElementById('papercut');
  var playBtns = document.querySelectorAll('[data-music]');
  if (audio && playBtns.length) {
    var card = document.querySelector('[data-music-card]');
    var mini = document.querySelector('[data-music-mini]');
    /* the record only turns while it can be seen */
    if (card && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        card.classList.toggle('is-offscreen', !entries[entries.length - 1].isIntersecting);
      }).observe(card);
    }
    var status = document.getElementById('music-status');
    var VOL = 0.7, START = 129;
    var state = 'idle';                       /* idle | loading | playing — mirrors the element */
    var started = false, raf = null;

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
        b.querySelector('.music__label').textContent = on ? 'Pause' : 'Play';
      });
      if (card) card.classList.toggle('is-playing', state === 'playing');
      if (mini) {
        if (started) mini.hidden = false;
        mini.classList.toggle('is-on', on);
        mini.setAttribute('aria-label', (on ? 'Pause' : 'Play') + ' Papercut (instrumental)');
      }
    };
    var set = function (s, msg) { state = s; render(); if (msg !== undefined) say(msg); };

    var play = function () {
      if (started && !audio.paused) { set('playing', ''); fade(VOL, 400); return; }   /* pressed again mid fade-out */
      if (!audio.getAttribute('src')) audio.src = audio.getAttribute('data-src');
      var first = !started;
      started = true;
      set('loading', 'Loading…');
      if (first) {
        audio.volume = 0;
        var seek = function () { try { audio.currentTime = START; } catch (e) {} };
        if (audio.readyState >= 1) seek(); else audio.addEventListener('loadedmetadata', seek, { once: true });
      }
      var p = audio.play();
      if (p && p.catch) p.catch(function (err) {
        if (err && err.name === 'AbortError') return;          /* paused before it started */
        cancelAnimationFrame(raf);
        set('idle', err && err.name === 'NotAllowedError'
          ? 'Your browser blocked playback. Press Play to try again.'
          : 'The track couldn’t be played. Please try again.');
      });
      fade(VOL, first ? 2500 : 400);
    };
    var pause = function () {
      set('idle', '');
      fade(0, 300, function () { if (state === 'idle') audio.pause(); });
    };
    var toggle = function () { if (state === 'idle') play(); else pause(); };

    audio.loop = true;
    audio.addEventListener('playing', function () { if (state !== 'idle') set('playing', ''); });
    audio.addEventListener('waiting', function () { if (state === 'playing') set('loading', 'Loading…'); });
    audio.addEventListener('pause', function () { if (state !== 'idle') set('idle', ''); });
    audio.addEventListener('error', function () {
      if (!started) return;
      cancelAnimationFrame(raf);
      set('idle', 'The track couldn’t be played. Please try again.');
    });

    each(playBtns, function (b) { b.addEventListener('click', toggle); });
    if (mini) mini.addEventListener('click', toggle);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state !== 'idle') { cancelAnimationFrame(raf); audio.pause(); }
    });
    render();
  }
})();
