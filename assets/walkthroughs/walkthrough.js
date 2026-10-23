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

   One clock drives everything: the elapsed time picks the step, and the
   scene, caption, step indicator, its ring and the progress bar all follow
   that step in the same frame. Choosing a step jumps straight to it: the
   steps in between are applied at once behind a short fade, so they never
   play, and the chosen step then builds exactly as it does in playback.
   ============================================================ */
(function () {
  'use strict';

  var doc = document, html = doc.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide = window.matchMedia('(min-width: 900px)');   /* steps beside the stage, as rows */
  var dlg = null, ui = null, cur = null;
  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var FADE_OUT = 140, FADE_IN = 260;                     /* a jump to any step but the next */

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
        '<div class="wt__caption"></div>' +
        '<p class="wt__live wt__vh" role="status"></p>' +
        '<div class="wt__nav"><ol class="wt__chapters" role="list" aria-label="Steps"></ol><span class="wt__ind" aria-hidden="true"></span></div>' +
        '<div class="wt__controls">' +
          '<button class="wt__btn wt__btn--primary wt__play" type="button"></button>' +
          '<button class="wt__btn wt__replay" type="button">' + ICON.replay + '<span>Replay</span></button>' +
          '<button class="wt__btn wt__prev" type="button"><span aria-hidden="true">‹</span> Previous</button>' +
          '<button class="wt__btn wt__next" type="button">Next <span aria-hidden="true">›</span></button>' +
          '<div class="wt__bar" aria-hidden="true"><i></i></div>' +
          '<p class="wt__time"></p>' +
        '</div>' +
        '<p class="wt__foot"><a class="wt__case" href="#">Read the case study</a></p>' +
      '</div>';
    doc.body.appendChild(dlg);

    var q = function (s) { return dlg.querySelector(s); };
    ui = {
      panel: q('.wt__panel'), stage: q('.wt__stage'), note: q('.wt__note'), title: q('.wt__title'), close: q('.wt__close'),
      caption: q('.wt__caption'), live: q('.wt__live'), nav: q('.wt__nav'), chapters: q('.wt__chapters'), ind: q('.wt__ind'),
      play: q('.wt__play'), replay: q('.wt__replay'), prev: q('.wt__prev'), next: q('.wt__next'),
      bar: q('.wt__bar i'), time: q('.wt__time'), foot: q('.wt__foot'), caseLink: q('.wt__case'), arc: null
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
    /* the indicator follows the steps' layout (rows or a strip) without travelling */
    if ('ResizeObserver' in window) new ResizeObserver(function () { placeIndicator(true); }).observe(ui.nav);
    else window.addEventListener('resize', function () { placeIndicator(true); });
  }

  /* ---------- stage ---------- */
  function renderStage() {
    if (cur.fade) { cur.fade.anim.cancel(); cur.fade = null; }
    ui.stage.innerHTML = '<div class="wt-root">' + cur.demo.stage + '</div>';
    ui.stage.setAttribute('aria-hidden', 'true');
    cur.root = ui.stage.firstElementChild;
    void cur.root.offsetWidth;            /* settle the start state so the first step animates */
    cur.scene = -1;
    cur.drawn = -1;
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

  /* the scene for step i (0-based): cumulative .is-s1 … classes and data-scene */
  function drawScene(i, upTo) {
    var root = cur.root, n = cur.demo.scenes.length;
    for (var k = 1; k <= n; k++) root.classList.toggle('is-s' + k, k <= upTo);
    root.setAttribute('data-scene', String(i + 1));
  }
  /* playback: the next step builds on the current one */
  function stepScene(i) {
    if (!cur.root) return;
    drawScene(i, i + 1);
    cur.drawn = i;
  }
  /* a chosen step: everything before it is applied at once (nothing in between
     plays), then the step itself builds as it does in playback */
  function settleScene(i) {
    var root = cur.root;
    root.classList.add('wt-instant');
    drawScene(i, i);
    void root.offsetWidth;
    root.classList.remove('wt-instant');
    root.classList.add('is-s' + (i + 1));
    cur.drawn = i;
  }
  /* a jump slides the stage a little in the direction of travel (left going forward,
     right going back) as it fades, settles the chosen step, then slides it in from the
     other side. A newer choice takes over the fade already under way. */
  function jumpScene(i) {
    var root = cur.root;
    if (!root) return;
    var dir = i < cur.drawn ? -1 : 1;
    cur.target = i;
    if (cur.stepMode || !root.animate) { settleScene(i); return; }
    if (cur.fade && cur.fade.out) return;          /* the fade already under way swaps to cur.target */
    var from = 1, x = 0;
    if (cur.fade) {                                 /* mid fade-in: leave from where it is */
      var cs = getComputedStyle(root);
      from = parseFloat(cs.opacity);
      if (cs.transform !== 'none') x = parseFloat(cs.transform.split(',')[4]) || 0;
      cur.fade.anim.cancel();
    }
    var dist = Math.min(24, root.offsetWidth * 0.03);
    var out = root.animate([
      { opacity: from, transform: 'translateX(' + x + 'px)' },
      { opacity: 0, transform: 'translateX(' + (-dir * dist) + 'px)' }
    ], { duration: Math.max(40, FADE_OUT * from), easing: 'ease-in', fill: 'forwards', id: 'wt-fade' });
    cur.fade = { out: true, anim: out };
    out.onfinish = function () {
      if (!cur || cur.root !== root) return;
      var d = cur.target < cur.drawn ? -1 : 1;
      settleScene(cur.target);
      var inn = root.animate([
        { opacity: 0, transform: 'translateX(' + (d * dist) + 'px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: FADE_IN, easing: EASE, id: 'wt-fade' });
      out.cancel();
      cur.fade = { out: false, anim: inn };
      inn.onfinish = function () { if (cur && cur.fade && cur.fade.anim === inn) cur.fade = null; };
      if (!cur.playing) sceneAnimations('finish');   /* paused: the chosen step appears complete */
    };
  }

  /* ---------- steps: caption, indicator, current step ---------- */
  function show(i, instant) {
    var scenes = cur.demo.scenes, n = scenes.length;
    cur.scene = i;
    Array.prototype.forEach.call(ui.caption.children, function (c, k) {
      c.classList.toggle('is-on', k === i);
      c.classList.toggle('is-past', k < i);
    });
    Array.prototype.forEach.call(ui.chapters.querySelectorAll('button'), function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var btn = ui.chapters.querySelectorAll('button')[i];
    ui.arc = btn && btn.querySelector('.wt__arc');
    if (ui.arc) arcTo(100);
    placeIndicator(!!instant);
    /* aria-disabled rather than disabled, so focus isn't lost on the first or last step */
    ui.prev.setAttribute('aria-disabled', String(i === 0));
    ui.next.setAttribute('aria-disabled', String(i === n - 1));
    if (cur.stepMode) ui.live.textContent = 'Step ' + (i + 1) + ' of ' + n + ': ' + scenes[i].title + '. ' + scenes[i].text;
  }

  /* one shared indicator: a row background on wide screens, a circle in the strip */
  function placeIndicator(instant) {
    if (!cur || cur.scene < 0 || !ui) return;
    var btn = ui.chapters.querySelectorAll('button')[cur.scene];
    if (!btn) return;
    var anchor = wide.matches ? btn : btn.querySelector('.wt__num');
    var nav = ui.nav.getBoundingClientRect(), r = anchor.getBoundingClientRect();
    if (!r.width) return;                           /* not laid out yet (dialog closed) */
    var x = r.left - nav.left + ui.nav.scrollLeft, y = r.top - nav.top + ui.nav.scrollTop;
    var ind = ui.ind;
    if (instant) ind.classList.add('is-instant');
    ind.style.width = r.width + 'px';
    ind.style.height = r.height + 'px';
    ind.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
    ind.classList.add('is-on');
    if (instant) { void ind.offsetWidth; ind.classList.remove('is-instant'); }
    /* a strip wider than the screen keeps the current step in view; focus never moves */
    var over = ui.nav.scrollWidth - ui.nav.clientWidth;
    if (over > 1) {
      var left = Math.max(0, Math.min(over, x + r.width / 2 - ui.nav.clientWidth / 2));
      if (Math.abs(left - ui.nav.scrollLeft) > 1) ui.nav.scrollTo({ left: left, behavior: instant || reduce.matches ? 'auto' : 'smooth' });
    }
  }

  function progress(instant) {
    var d = cur.demo, idx = 0;
    for (var k = 0; k < d.scenes.length; k++) if (cur.elapsed >= d.scenes[k].at) idx = k;
    if (idx !== cur.scene) {
      show(idx, instant);
      if (cur.fade && cur.fade.out) cur.target = idx; else if (idx !== cur.drawn) stepScene(idx);
    }
    ui.bar.style.transform = 'scaleX(' + (cur.elapsed / d.duration).toFixed(4) + ')';
    if (ui.arc) {
      var start = d.scenes[idx].at, end = idx + 1 < d.scenes.length ? d.scenes[idx + 1].at : d.duration;
      arcTo(100 - 100 * Math.min(1, (cur.elapsed - start) / (end - start)));
    }
    var t = fmt(cur.elapsed) + ' / ' + fmt(d.duration);
    if (ui.time.textContent !== t) ui.time.textContent = t;
  }

  /* the current step's ring; hidden while it has no length, so its round end never shows as a dot */
  function arcTo(off) {
    ui.arc.style.strokeDashoffset = off.toFixed(2);
    ui.arc.style.visibility = off > 99.5 ? 'hidden' : '';
  }

  /* ---------- playback ---------- */
  function sceneAnimations(fn) {
    if (!ui.stage.getAnimations) return;
    ui.stage.getAnimations({ subtree: true }).forEach(function (a) {
      if (a.id === 'wt-fade') return;               /* the jump fade runs its own short course */
      try { a[fn](); } catch (e) {}
    });
  }
  function setButton() {
    var on = cur && cur.playing;
    ui.play.innerHTML = (on ? ICON.pause : ICON.play) + '<span>' + (on ? 'Pause' : 'Play') + '</span>';
    dlg.classList.toggle('is-playing', !!on);
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
    sceneAnimations('play');
    setButton();
    cancelAnimationFrame(cur.raf);
    cur.raf = requestAnimationFrame(tick);
  }
  function pause() {
    if (!cur) return;
    cur.playing = false;
    cancelAnimationFrame(cur.raf);
    cur.raf = 0;
    sceneAnimations('finish');   /* settle the current step: a paused frame is never half-drawn */
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
    if (cur.root.animate && !cur.stepMode) cur.root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN, easing: EASE, id: 'wt-fade' });
    progress();
    play();
  }
  /* choosing a step keeps playing or paused as it was */
  function seek(i) {
    var n = cur.demo.scenes.length;
    i = Math.max(0, Math.min(n - 1, i));
    cur.elapsed = cur.demo.scenes[i].at;
    cur.ended = false;
    if (cur.playing) cur.last = performance.now();
    show(i);
    /* the next step builds exactly as in playback; anything else jumps */
    if (i === cur.drawn + 1 && !cur.fade && cur.root) stepScene(i); else jumpScene(i);
    progress();
    if (!cur.playing && !cur.fade) sceneAnimations('finish');
  }

  /* ---------- open / close ---------- */
  function open(id, trigger, base) {
    var demo = window.PortfolioDemos && window.PortfolioDemos[id];
    if (!demo) return false;
    if (!dlg) build();
    if (cur) stop();                         /* only one walkthrough at a time */
    base = base || doc.baseURI;

    cur = {
      id: id, demo: demo, trigger: trigger, root: null, video: null, fade: null, target: 0, drawn: -1,
      elapsed: 0, last: 0, raf: 0, scene: -1, playing: false, ended: false,
      stepMode: !demo.video && reduce.matches
    };

    var n = demo.scenes.length;
    ui.title.textContent = demo.title;
    ui.note.textContent = demo.caption;
    var caseHref = new URL(demo.caseUrl, base).href;
    ui.foot.hidden = location.href.split('#')[0] === caseHref;
    ui.caseLink.href = caseHref;
    ui.caseLink.innerHTML = 'Read the case study<span class="wt__vh">: ' + demo.title + '</span> <span aria-hidden="true">→</span>';
    /* every caption shares one cell, so the tallest sets the height and nothing below jumps */
    ui.caption.innerHTML = demo.scenes.map(function (s, i) {
      return '<div class="wt__cap"><p class="wt__step">Step ' + (i + 1) + ' of ' + n + '</p><p class="wt__scene">' + s.title + '</p><p class="wt__text">' + s.text + '</p></div>';
    }).join('');
    ui.chapters.innerHTML = demo.scenes.map(function (s, i) {
      return '<li><button type="button" data-i="' + i + '">' +
        '<span class="wt__num" aria-hidden="true"><svg class="wt__ring" viewBox="0 0 40 40" focusable="false"><circle class="wt__track" cx="20" cy="20" r="18.5"/><circle class="wt__arc" cx="20" cy="20" r="18.5" pathLength="100"/></svg><b>' + (i + 1) + '</b></span>' +
        '<span class="wt__chap"><span class="wt__vh">Step ' + (i + 1) + ': </span>' + s.title + '</span>' +
      '</button></li>';
    }).join('');
    ui.chapters.style.setProperty('--n', n);
    ui.ind.classList.remove('is-on');
    ui.live.textContent = '';
    ui.arc = null;

    dlg.classList.toggle('is-steps', cur.stepMode);
    dlg.classList.toggle('is-video', !!demo.video);

    if (demo.video) renderVideo(base); else renderStage();
    html.classList.add('wt-open');
    if (!dlg.open) dlg.showModal();
    ui.panel.scrollTop = 0;                  /* start at the top; focus must not scroll the title away */

    if (demo.video) {
      ui.close.focus({ preventScroll: true });
      var p = cur.video.play();
      if (p && p.catch) p.catch(function () {});
    } else if (cur.stepMode) {
      progress(true);
      ui.next.focus({ preventScroll: true });
    } else {
      progress(true);
      setButton();
      play();
      ui.play.focus({ preventScroll: true });
    }
    return true;
  }

  function stop() {
    if (!cur) return;
    cancelAnimationFrame(cur.raf);
    if (cur.fade) { cur.fade.anim.cancel(); cur.fade = null; }
    if (cur.video) { try { cur.video.pause(); } catch (e) {} }
    ui.stage.innerHTML = '';
    ui.ind.classList.remove('is-on');
    dlg.classList.remove('is-playing');
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
