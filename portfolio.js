/* ============================================================
   Gaurang Ashava — Data & AI Engineer
   nav · menu · reveal · progress · theme toggle · Papercut · track sheets
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
  var toggles = document.querySelectorAll('.js-theme');
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

  /* ---------- active section in the top bar ----------
     The active section is the one crossing a line 35% down the viewport. */
  var linkFor = { about: 'about', build: 'about', work: 'work', lab: 'work', experience: 'experience', stack: 'stack', next: 'stack', contact: 'contact' };
  var navLinks = document.querySelectorAll('.nav__links a');
  var secs = document.querySelectorAll('main section[id]');
  var spyQueued = false;
  var spy = function () {
    spyQueued = false;
    var line = window.innerHeight * 0.35, current = null;
    each(secs, function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    each(navLinks, function (a) { a.classList.toggle('is-active', !!linkFor[current] && a.getAttribute('href') === '#' + linkFor[current]); });
  };
  window.addEventListener('scroll', function () { if (!spyQueued) { spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });
  window.addEventListener('resize', spy, { passive: true });
  spy();

  /* ---------- Papercut (instrumental) ----------
     Site-wide from 2:09 via the floating button, or a cue per track when a
     track opens. The quiet mix is baked into the file (iOS ignores page
     volume); fades happen where the browser allows. preload="none". */
  var music = (function () {
    var el = document.getElementById('papercut');
    var btn = document.getElementById('vibe');
    if (!el || !btn) return null;
    var label = btn.querySelector('.vibe__txt');
    var snd = document.getElementById('sheetSound');
    var CUES = { '01': 4.1, '02': 53.25, '03': 82, '04': 118.75, '05': 129 };   /* section entries */
    var SITE = 129;                                                                /* 2:09 */
    var siteOn = false, inTrack = false, current = null, raf = null;
    var trackPref = function () { try { return localStorage.getItem('trackMusic') !== 'off'; } catch (e) { return true; } };
    var setPref = function (on) { try { localStorage.setItem('trackMusic', on ? 'on' : 'off'); } catch (e) {} };

    var fade = function (to, ms, done) {
      cancelAnimationFrame(raf);
      var from = el.volume, t0 = performance.now();
      if (reduce || ms <= 0) { el.volume = to; if (done) done(); return; }
      (function step(now) {
        var k = Math.max(0, Math.min((now - t0) / ms, 1));   /* rAF time can precede t0 */
        el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
      })(t0);
    };
    var seek = function (t) {
      var go = function () { try { el.currentTime = t; } catch (e) {} };
      if (el.readyState >= 1) go(); else el.addEventListener('loadedmetadata', go, { once: true });
    };
    var playAt = function (t) {               /* must run inside a tap (iOS) */
      el.volume = 0; seek(t);
      var p = el.play(); if (p && p.catch) p.catch(function () {});
      fade(1, 600);
    };
    var jumpTo = function (t) { fade(0, 180, function () { seek(t); fade(1, 450); }); };
    var stop = function () { fade(0, 350, function () { el.pause(); }); };

    var sync = function () {
      var on = !el.paused;
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', on ? 'Pause Papercut (instrumental)' : 'Play Papercut (instrumental)');
      label.textContent = on ? 'Pause Papercut' : 'Play Papercut';
      if (snd) {
        snd.setAttribute('aria-pressed', on ? 'true' : 'false');
        snd.setAttribute('aria-label', on ? 'Mute track music' : 'Play track music');
      }
    };
    el.addEventListener('play', sync);
    el.addEventListener('pause', sync);
    el.addEventListener('ended', function () { siteOn = false; sync(); });
    sync();

    btn.addEventListener('click', function () {
      if (!el.paused) { siteOn = false; stop(); } else { siteOn = true; playAt(SITE); }
    });
    if (snd) snd.addEventListener('click', function () {
      if (!el.paused) { setPref(false); siteOn = false; stop(); }
      else { setPref(true); playAt(current && CUES[current] != null ? CUES[current] : SITE); }
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !el.paused) { siteOn = false; el.pause(); }
    });

    return {
      /* a track was tapped open (or prev/next) */
      enterTrack: function (id) {
        current = id; inTrack = true;
        if (CUES[id] == null) return;
        if (!el.paused) jumpTo(CUES[id]);
        else if (trackPref()) playAt(CUES[id]);
      },
      /* deep link: no tap, so no sound — just remember which track */
      setTrack: function (id) { current = id; },
      leaveTracks: function () {
        if (!inTrack) return;
        inTrack = false;
        if (!siteOn && !el.paused) stop();
      }
    };
  })();

  /* ---------- track sheets: #/trk-01 … #/trk-05 ----------
     A hash route, so the phone's back button / gesture closes the sheet
     and every track has a shareable link. */
  var track = document.getElementById('track');
  if (track) {
    var sheet = document.getElementById('sheet');
    var pages = track.querySelectorAll('.tp');
    var scroller = document.getElementById('trackScroll');
    var behind = [document.getElementById('main'), nav, document.querySelector('.foot'), document.getElementById('vibe')];
    var openedFromList = false, returnFocus = null, baseTitle = document.title;

    var idFromHash = function () { var m = location.hash.match(/^#\/trk-(\d\d)$/); return m ? m[1] : null; };
    var setBehind = function (on) { behind.forEach(function (el) { if (el) { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); } }); };

    var show = function (id) {
      var page = track.querySelector('.tp[data-page="' + id + '"]');
      if (!page) return null;
      each(pages, function (p) { p.hidden = p !== page; });
      track.setAttribute('aria-labelledby', 'tp-' + id);
      if (music) music.setTrack(id);
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
      if (music) music.leaveTracks();
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
      if (link) { openedFromList = true; returnFocus = link; if (music) music.enterTrack(link.getAttribute('data-trk')); }
    });
    track.addEventListener('click', function (e) {
      var go = e.target.closest('[data-go]');
      if (go) { if (music) music.enterTrack(go.getAttribute('data-go')); location.replace('#/trk-' + go.getAttribute('data-go')); return; }
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

})();
