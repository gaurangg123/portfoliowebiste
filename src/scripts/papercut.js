/* ---------- Papercut (instrumental) ----------
   - silent on every page load; only the Play button starts it, and the file isn't
     requested before that first press
   - what the controls show comes from the audio element's own events, so it stays
     right when playback is blocked, fails, buffers or is paused elsewhere
   - after the first Play a small control stays in the navigation for pausing
   - eases in quietly from 2:09 and pauses when the tab is hidden
   - the walkthrough player never touches it */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var audio = /** @type {HTMLAudioElement|null} */ (document.getElementById('papercut'));
  var playBtns = document.querySelectorAll('[data-music]');
  if (!audio || !playBtns.length) return;
  var a = /** @type {HTMLAudioElement} */ (audio);
  var card = document.querySelector('[data-music-card]');
  var mini = /** @type {HTMLElement|null} */ (document.querySelector('[data-music-mini]'));
  var status = document.getElementById('music-status');
  var VOL = 0.7, START = 129;
  var state = 'idle';                     // idle | loading | playing: mirrors the element
  var started = false, raf = 0;

  if (card) { var c = card; DF.watch(c, function (on) { c.classList.toggle('is-offscreen', !on); }); }

  /** @param {number} to @param {number} ms @param {() => void} [done] */
  var fade = function (to, ms, done) {
    cancelAnimationFrame(raf);
    var from = a.volume, t0 = performance.now();
    if (DF.reduce.matches || ms <= 0) { a.volume = to; if (done) done(); return; }
    var step = function (/** @type {number} */ now) {
      var k = Math.max(0, Math.min((now - t0) / ms, 1));
      a.volume = Math.max(0, Math.min(1, from + (to - from) * k * k));
      if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
    };
    step(t0);
  };
  /** @param {string} msg */
  var say = function (msg) { if (status) status.textContent = msg; };
  var render = function () {
    var on = state !== 'idle';
    DF.each(playBtns, function (b) {
      b.classList.toggle('is-on', on);
      var l = b.querySelector('.audio__label');
      if (l) l.textContent = on ? 'Pause' : 'Play';
    });
    if (card) card.classList.toggle('is-playing', state === 'playing');
    if (mini) {
      if (started) mini.hidden = false;
      mini.classList.toggle('is-on', on);
      mini.setAttribute('aria-label', (on ? 'Pause' : 'Play') + ' Papercut (instrumental)');
    }
  };
  /** @param {string} s @param {string} [msg] */
  var set = function (s, msg) { state = s; render(); if (msg !== undefined) say(msg); };

  var play = function () {
    if (started && !a.paused) { set('playing', ''); fade(VOL, 400); return; }   // pressed again mid fade-out
    if (!a.getAttribute('src')) a.src = a.getAttribute('data-src') || '';
    var first = !started;
    started = true;
    set('loading', 'Loading…');
    if (first) {
      a.volume = 0;
      var seek = function () { try { a.currentTime = START; } catch (e) { /* not seekable yet */ } };
      if (a.readyState >= 1) seek(); else a.addEventListener('loadedmetadata', seek, { once: true });
    }
    var p = a.play();
    if (p && p.catch) p.catch(function (err) {
      if (err && err.name === 'AbortError') return;          // paused before it started
      cancelAnimationFrame(raf);
      set('idle', err && err.name === 'NotAllowedError' ? 'Your browser blocked playback. Press Play to try again.' : 'The track couldn’t be played. Please try again.');
    });
    fade(VOL, first ? 2500 : 400);
  };
  var pause = function () { set('idle', ''); fade(0, 300, function () { if (state === 'idle') a.pause(); }); };
  var toggle = function () { if (state === 'idle') play(); else pause(); };

  a.loop = true;
  a.addEventListener('playing', function () { if (state !== 'idle') set('playing', ''); });
  a.addEventListener('waiting', function () { if (state === 'playing') set('loading', 'Loading…'); });
  a.addEventListener('pause', function () { if (state !== 'idle') set('idle', ''); });
  a.addEventListener('error', function () { if (!started) return; cancelAnimationFrame(raf); set('idle', 'The track couldn’t be played. Please try again.'); });
  DF.each(playBtns, function (b) { b.addEventListener('click', toggle); });
  if (mini) mini.addEventListener('click', toggle);
  document.addEventListener('visibilitychange', function () { if (document.hidden && state !== 'idle') { cancelAnimationFrame(raf); a.pause(); } });
  render();
})();
