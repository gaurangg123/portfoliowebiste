/* ============================================================
   Project walkthrough player
   A native <dialog> that plays one illustrative, silent walkthrough at a
   time from window.PortfolioDemos (demos.js). Loaded on first use by
   portfolio.js; exposes window.PortfolioWalkthrough.open(id, trigger, base).

   - starts only from the click that opened it; no autoplay elsewhere
   - Play/Pause, Replay, progress, elapsed/total time, steps, Close
   - ends on the final step (no loop); pauses when the tab is hidden
   - one walkthrough at a time; closing stops every timer and animation
   - reduced motion: a static sequence with Previous/Next instead
   - a real recording (demo.video) plays in a native <video> instead
   It never touches the Papercut player or the hero animation.
   ============================================================ */
(function () {
  'use strict';

  var doc = document, html = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var dlg = null, ui = null, cur = null;

  var ICON = {
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.4 1.7v8.6L10.4 6z"/></svg>',
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.6 1.6h2.4v8.8H2.6zM7 1.6h2.4v8.8H7z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>'
  };

  var fmt = function (ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
  };

  function build() {
    dlg = doc.createElement('dialog');
    dlg.className = 'wt';
    dlg.setAttribute('aria-labelledby', 'wt-title');
    dlg.setAttribute('aria-describedby', 'wt-note');
    /* role="list" on the steps: Safari drops list semantics when list-style is none */
    dlg.innerHTML =
      '<div class="wt__panel">' +
        '<div class="wt__head">' +
          '<div><p class="wt__note" id="wt-note"></p><h2 class="wt__title" id="wt-title"></h2></div>' +
          '<button class="wt__close" type="button" aria-label="Close walkthrough">' + ICON.close + '</button>' +
        '</div>' +
        '<div class="wt__stage"></div>' +
        '<div class="wt__caption"><p class="wt__step"></p><p class="wt__scene"></p><p class="wt__text"></p></div>' +
        '<div class="wt__controls">' +
          '<button class="wt__btn wt__btn--primary wt__play" type="button"></button>' +
          '<button class="wt__btn wt__replay" type="button">' + ICON.replay + '<span>Replay</span></button>' +
          '<button class="wt__btn wt__prev" type="button"><span aria-hidden="true">‹</span> Previous</button>' +
          '<button class="wt__btn wt__next" type="button">Next <span aria-hidden="true">›</span></button>' +
          '<div class="wt__bar" aria-hidden="true"><i></i></div>' +
          '<p class="wt__time"></p>' +
        '</div>' +
        '<ol class="wt__chapters" role="list" aria-label="Steps"></ol>' +
        '<p class="wt__foot"><a class="wt__case" href="#">Read the case study</a></p>' +
      '</div>';
    doc.body.appendChild(dlg);

    var q = function (s) { return dlg.querySelector(s); };
    ui = {
      panel: q('.wt__panel'), stage: q('.wt__stage'), note: q('.wt__note'), title: q('.wt__title'), close: q('.wt__close'),
      caption: q('.wt__caption'), step: q('.wt__step'), scene: q('.wt__scene'), text: q('.wt__text'),
      play: q('.wt__play'), replay: q('.wt__replay'), prev: q('.wt__prev'), next: q('.wt__next'),
      bar: q('.wt__bar i'), time: q('.wt__time'), chapters: q('.wt__chapters'), foot: q('.wt__foot'), caseLink: q('.wt__case')
    };

    /* listeners are attached once, here — never per open */
    ui.close.addEventListener('click', close);
    ui.play.addEventListener('click', function () { if (cur) { if (cur.playing) pause(); else play(); } });
    ui.replay.addEventListener('click', function () { if (cur) restart(); });
    ui.prev.addEventListener('click', function () { if (cur) seek(cur.scene - 1); });
    ui.next.addEventListener('click', function () { if (cur) seek(cur.scene + 1); });
    ui.chapters.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-i]');
      if (b && cur) seek(+b.getAttribute('data-i'));
    });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });   /* Escape */
    dlg.addEventListener('close', function () { if (!dlg.open) cleanup(); });   /* a reopen may have happened first */
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });   /* backdrop */
    doc.addEventListener('visibilitychange', function () {
      if (!doc.hidden || !cur) return;
      if (cur.playing) pause();
      if (cur.video && !cur.video.paused) cur.video.pause();
    });
    window.addEventListener('pagehide', function () { if (dlg.open) close(); });
  }

  /* ---------- stage ---------- */
  function renderStage() {
    ui.stage.innerHTML = '<div class="wt-root">' + cur.demo.stage + '</div>';
    ui.stage.setAttribute('aria-hidden', 'true');
    cur.root = ui.stage.firstElementChild;
    void cur.root.offsetWidth;            /* settle the start state so the first step animates */
    cur.scene = -1;
  }

  function renderVideo(base) {
    var v = cur.demo.video;
    var video = doc.createElement('video');
    video.className = 'wt-video';
    video.controls = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'metadata';
    if (v.poster) video.poster = new URL(v.poster, base).href;
    var src = doc.createElement('source');
    src.src = new URL(v.src, base).href;
    if (/\.webm$/i.test(v.src)) src.type = 'video/webm'; else if (/\.mp4$/i.test(v.src)) src.type = 'video/mp4';
    video.appendChild(src);
    if (v.captions) {
      var tr = doc.createElement('track');
      tr.kind = 'captions'; tr.srclang = 'en'; tr.label = 'English'; tr.default = true;
      tr.src = new URL(v.captions, base).href;
      video.appendChild(tr);
    }
    ui.stage.innerHTML = '';
    ui.stage.removeAttribute('aria-hidden');
    ui.stage.appendChild(video);
    cur.video = video;
  }

  function show(i) {
    var scenes = cur.demo.scenes, n = scenes.length;
    i = Math.max(0, Math.min(n - 1, i));
    if (i === cur.scene) return;
    cur.scene = i;
    if (cur.root) {
      cur.root.setAttribute('data-scene', String(i + 1));
      for (var k = 1; k <= n; k++) cur.root.classList.toggle('is-s' + k, k <= i + 1);
    }
    ui.step.textContent = 'Step ' + (i + 1) + ' of ' + n;
    ui.scene.textContent = scenes[i].title;
    ui.text.textContent = scenes[i].text;
    Array.prototype.forEach.call(ui.chapters.querySelectorAll('button'), function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    /* aria-disabled rather than disabled, so focus isn't lost on the first or last step */
    ui.prev.setAttribute('aria-disabled', String(i === 0));
    ui.next.setAttribute('aria-disabled', String(i === n - 1));
  }

  function progress() {
    var d = cur.demo, idx = 0;
    for (var k = 0; k < d.scenes.length; k++) if (cur.elapsed >= d.scenes[k].at) idx = k;
    show(idx);
    ui.bar.style.transform = 'scaleX(' + (cur.elapsed / d.duration).toFixed(4) + ')';
    var t = fmt(cur.elapsed) + ' / ' + fmt(d.duration);
    if (ui.time.textContent !== t) ui.time.textContent = t;
  }

  /* ---------- playback ---------- */
  function animations(fn) {
    if (!ui.stage.getAnimations) return;
    ui.stage.getAnimations({ subtree: true }).forEach(function (a) { try { a[fn](); } catch (e) {} });
  }
  function setButton() {
    var on = cur && cur.playing;
    ui.play.innerHTML = (on ? ICON.pause : ICON.play) + '<span>' + (on ? 'Pause' : 'Play') + '</span>';
  }
  function tick(now) {
    if (!cur || !cur.playing) return;
    cur.elapsed = Math.min(cur.demo.duration, cur.elapsed + Math.max(0, now - cur.last));
    cur.last = now;
    progress();
    if (cur.elapsed >= cur.demo.duration) { finish(); return; }
    cur.raf = requestAnimationFrame(tick);
  }
  function play() {
    if (!cur || cur.stepMode || cur.video) return;
    if (cur.ended) { restart(); return; }
    cur.playing = true;
    cur.last = performance.now();
    animations('play');
    setButton();
    cancelAnimationFrame(cur.raf);
    cur.raf = requestAnimationFrame(tick);
  }
  function pause() {
    if (!cur) return;
    cur.playing = false;
    cancelAnimationFrame(cur.raf);
    cur.raf = 0;
    animations('pause');
    setButton();
  }
  function finish() {
    cur.playing = false;
    cur.ended = true;
    cur.raf = 0;
    cur.elapsed = cur.demo.duration;
    progress();
    setButton();
  }
  function restart() {
    cancelAnimationFrame(cur.raf);
    cur.playing = false;
    cur.ended = false;
    cur.elapsed = 0;
    renderStage();
    progress();
    play();
  }
  function seek(i) {
    var n = cur.demo.scenes.length;
    i = Math.max(0, Math.min(n - 1, i));
    cur.elapsed = cur.demo.scenes[i].at;
    cur.ended = false;
    if (cur.playing) cur.last = performance.now();
    progress();
    if (!cur.playing) animations('play');   /* a chosen step is shown in full even while paused */
  }

  /* ---------- open / close ---------- */
  function open(id, trigger, base) {
    var demo = window.PortfolioDemos && window.PortfolioDemos[id];
    if (!demo) return false;
    if (!dlg) build();
    if (cur) stop();                         /* only one walkthrough at a time */
    base = base || doc.baseURI;

    cur = {
      id: id, demo: demo, trigger: trigger, root: null, video: null,
      elapsed: 0, last: 0, raf: 0, scene: -1, playing: false, ended: false,
      stepMode: !demo.video && reduce.matches
    };

    ui.title.textContent = demo.title;
    ui.note.textContent = demo.caption;
    var caseHref = new URL(demo.caseUrl, base).href;
    ui.foot.hidden = location.href.split('#')[0] === caseHref;
    ui.caseLink.href = caseHref;
    ui.caseLink.innerHTML = 'Read the case study<span class="visually-hidden">: ' + demo.title + '</span> <span aria-hidden="true">→</span>';
    ui.chapters.innerHTML = demo.scenes.map(function (s, i) {
      return '<li><button type="button" data-i="' + i + '"><span class="wt__num">' + (i + 1) + '</span><span class="wt__chap">' + s.title + '</span></button></li>';
    }).join('');

    dlg.classList.toggle('is-steps', cur.stepMode);
    dlg.classList.toggle('is-video', !!demo.video);
    if (cur.stepMode) ui.caption.setAttribute('aria-live', 'polite'); else ui.caption.removeAttribute('aria-live');

    if (demo.video) renderVideo(base); else renderStage();
    html.classList.add('wt-open');
    if (!dlg.open) dlg.showModal();
    ui.panel.scrollTop = 0;                  /* start at the top; focus must not scroll the title away */

    if (demo.video) {
      ui.close.focus({ preventScroll: true });
      var p = cur.video.play();
      if (p && p.catch) p.catch(function () {});
    } else if (cur.stepMode) {
      progress();
      ui.next.focus({ preventScroll: true });
    } else {
      progress();
      setButton();
      play();
      ui.play.focus({ preventScroll: true });
    }
    return true;
  }

  function stop() {
    if (!cur) return;
    cancelAnimationFrame(cur.raf);
    if (cur.video) { try { cur.video.pause(); } catch (e) {} }
    ui.stage.innerHTML = '';
    cur = null;
  }
  function cleanup() {
    stop();
    html.classList.remove('wt-open');
  }
  function close() {
    var trigger = cur && cur.trigger;
    cleanup();
    if (dlg && dlg.open) dlg.close();
    if (trigger && doc.contains(trigger)) trigger.focus({ preventScroll: true });
  }

  window.PortfolioWalkthrough = { open: open, close: close };
})();
