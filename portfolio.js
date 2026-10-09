/* ============================================================
   Gaurang Ashava — Data & AI Engineer
   nav · menu · reveal · progress · theme toggle · vibe loop
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
  var linkFor = { about: 'about', build: 'about', work: 'work', lab: 'work', experience: 'experience', stack: 'stack', contact: 'contact' };
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

  /* ---------- vibe: an original drum + bass loop, synthesized live ----------
     Opt-in only (browsers block audible autoplay anyway). No audio files. */
  var vibeBtn = document.getElementById('vibe');
  var AC = window.AudioContext || window.webkitAudioContext;
  if (vibeBtn && !AC) vibeBtn.hidden = true;

  if (vibeBtn && AC) {
    var ctx = null, master = null, noise = null, timer = null;
    var step = 0, nextAt = 0, playing = false;
    var sixteenth = 60 / 92 / 4;   /* 92 bpm, half-time feel */

    /* 16-step patterns (an original groove, E minor) */
    var KICK  = [1,0,0,0, 0,0,1,0, 1,0,1,0, 0,0,0,0];
    var SNARE = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
    var HAT   = [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,0];
    var BASS  = [28,0,28,0, 0,28,31,0, 26,0,26,0, 0,26,33,0];   /* MIDI notes, 0 = rest */
    var PADS  = [[52,55,59], [50,53,57]];                        /* Em, Dm-ish, alternating bars */

    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
    function env(g, t, peak, len) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    }
    function kick(t) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      env(g, t, 1, 0.32);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.34);
    }
    function hiss(t, len, freq, type, vol) {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = type; f.frequency.value = freq;
      env(g, t, vol, len);
      s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + len + 0.02);
    }
    function bass(t, m) {
      var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = hz(m);
      f.type = 'lowpass'; f.frequency.value = 420;
      env(g, t, 0.5, sixteenth * 1.9);
      o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + sixteenth * 2);
    }
    function pad(t, chord) {
      chord.forEach(function (m) {
        var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = hz(m);
        f.type = 'lowpass'; f.frequency.value = 900;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.5);
        g.gain.linearRampToValueAtTime(0.0001, t + sixteenth * 16);
        o.connect(f); f.connect(g); g.connect(master); o.start(t); o.stop(t + sixteenth * 16 + 0.05);
      });
    }
    function schedule() {
      while (nextAt < ctx.currentTime + 0.12) {
        var i = step % 16;
        if (i === 0) pad(nextAt, PADS[Math.floor(step / 16) % 2]);
        if (KICK[i]) kick(nextAt);
        if (SNARE[i]) hiss(nextAt, 0.2, 1700, 'bandpass', 0.9);
        if (HAT[i]) hiss(nextAt, 0.04, 7500, 'highpass', 0.25);
        if (BASS[i]) bass(nextAt, BASS[i]);
        nextAt += sixteenth; step++;
      }
    }
    function setup() {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.16;                     /* background, not foreground */
      master.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noise.getChannelData(0);
      for (var k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    }
    function setUi(on) {
      vibeBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      vibeBtn.setAttribute('aria-label', on ? 'Stop background music' : 'Play background music');
      vibeBtn.querySelector('.vibe__txt').textContent = on ? 'Stop the vibe' : 'Play the vibe';
    }
    function play() {
      if (!ctx) setup();
      ctx.resume();                                 /* must happen inside the tap (iOS) */
      step = 0; nextAt = ctx.currentTime + 0.06;
      timer = window.setInterval(schedule, 25);
      playing = true; setUi(true);
    }
    function stop() {
      window.clearInterval(timer); timer = null;
      if (ctx) ctx.suspend();
      playing = false; setUi(false);
    }
    setUi(false);
    vibeBtn.addEventListener('click', function () { if (playing) stop(); else play(); });
    /* save battery: stop when the tab/app goes to the background */
    document.addEventListener('visibilitychange', function () { if (document.hidden && playing) stop(); });
  }
})();
