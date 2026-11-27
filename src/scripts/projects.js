/* ---------- projects: filters and the explorer ----------
   Filters are toggle buttons (aria-pressed); the result count is announced. On wide
   screens the index selects which project the showcase shows: hover previews it,
   click or Enter selects it, ↑/↓ move through the index. On smaller screens every
   project is a full card in a swipeable row, with a counter and previous/next. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var box = document.querySelector('[data-explorer]');
  if (!box) return;
  var buttons = box.querySelectorAll('button[data-filter]');
  var cards = /** @type {NodeListOf<HTMLElement>} */ (box.querySelectorAll('[data-mission]'));
  var items = /** @type {NodeListOf<HTMLButtonElement>} */ (box.querySelectorAll('.px__item'));
  var status = box.querySelector('[data-filter-status]');
  var wide = window.matchMedia('(min-width: 1024px)');
  var hoverable = window.matchMedia('(hover: hover)');
  var total = cards.length, active = '', lastXY = '';

  /** @param {string} slug @param {boolean} [animate] */
  var show = function (slug, animate) {
    if (slug === active) return;
    active = slug;
    DF.each(items, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-show') === slug)); });
    DF.each(cards, function (c) {
      var on = c.id === 'px-' + slug;
      c.classList.toggle('is-active', on);
      if (on && animate && wide.matches && DF.motionOn()) { c.classList.remove('is-entering'); void c.offsetWidth; c.classList.add('is-entering'); }
    });
  };
  /** @param {HTMLElement} el */
  var visible = function (el) { var li = el.closest('li'); return !(li && li.hidden) && !el.hidden; };

  DF.each(items, function (b, i) {
    var slug = b.getAttribute('data-show') || '';
    b.addEventListener('click', function () { show(slug, true); });
    // a mouse that actually moves over an item previews it; Chrome's synthetic moves after a
    // scroll or a layout change (same position) are ignored, so they can't undo a keyboard choice
    b.addEventListener('pointermove', function (/** @type {PointerEvent} */ e) {
      if (e.pointerType !== 'mouse' || !hoverable.matches) return;
      var xy = e.screenX + ',' + e.screenY;
      if (xy === lastXY) return;
      lastXY = xy;
      show(slug, true);
    });
    b.addEventListener('focus', function () { show(slug, true); });
    b.addEventListener('keydown', function (/** @type {KeyboardEvent} */ e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      var step = e.key === 'ArrowDown' ? 1 : -1;
      for (var k = 1; k <= items.length; k++) {
        var next = items[(i + step * k + items.length * 2) % items.length];
        if (visible(next)) { next.focus(); break; }
      }
    });
  });
  DF.each(cards, function (c) { c.addEventListener('animationend', function () { c.classList.remove('is-entering'); }); });

  /** @param {string} key */
  var filter = function (key) {
    var shown = 0, first = '';
    DF.each(buttons, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key)); });
    var match = function (/** @type {Element} */ el) { return key === 'all' || (el.getAttribute('data-cats') || '').split(' ').indexOf(key) !== -1; };
    DF.each(cards, function (c, i) {
      var on = match(c);
      c.hidden = !on;
      c.classList.remove('is-entering');
      if (on) {
        if (!first) first = c.id.slice(3);
        if (!wide.matches && DF.motionOn()) { c.style.setProperty('--k', String(shown)); void c.offsetWidth; c.classList.add('is-entering'); }
        shown++;
      }
      void i;
    });
    DF.each(items, function (b) { var li = b.closest('li'); if (li) li.hidden = !match(li); });
    var cur = document.getElementById('px-' + active);
    if (!cur || cur.hidden) { active = ''; show(first, true); }
    if (status) {
      var label = '';
      DF.each(buttons, function (b) { if (b.getAttribute('data-filter') === key) label = (b.firstChild && b.firstChild.textContent) || ''; });
      status.textContent = key === 'all' ? 'Showing all ' + total + ' projects' : 'Showing ' + shown + ' of ' + total + ' projects · ' + label.trim();
    }
  };
  DF.each(buttons, function (b) { b.addEventListener('click', function () { filter(b.getAttribute('data-filter') || 'all'); sync(true); }); });
  if (items.length) show(items[0].getAttribute('data-show') || '');

  /* smaller screens: the swipeable row — a position counter, a progress rail, previous/next */
  var stage = /** @type {HTMLElement|null} */ (box.querySelector('[data-missions]'));
  var prev = /** @type {HTMLButtonElement|null} */ (box.querySelector('[data-px-prev]'));
  var next = /** @type {HTMLButtonElement|null} */ (box.querySelector('[data-px-next]'));
  var pos = box.querySelector('[data-px-pos]'), tot = box.querySelector('[data-px-total]');
  var rail = /** @type {HTMLElement|null} */ (box.querySelector('[data-px-rail]'));
  var pad = function (/** @type {number} */ n) { return (n < 10 ? '0' : '') + n; };
  var shownCards = function () { return Array.prototype.filter.call(cards, function (/** @type {HTMLElement} */ c) { return !c.hidden; }); };
  var queued = false;
  /** @param {boolean} [reset] */
  var sync = function (reset) {
    queued = false;
    if (!stage || wide.matches) return;
    if (reset) stage.scrollLeft = 0;
    var list = shownCards(), n = list.length, at = 0;
    var x = stage.scrollLeft, maxX = stage.scrollWidth - stage.clientWidth;
    for (var i = 0; i < n; i++) if (list[i].offsetLeft - stage.offsetLeft - x <= list[i].offsetWidth / 2) at = i;
    if (maxX > 0 && x >= maxX - 4) at = n - 1;
    if (pos) pos.textContent = pad(Math.min(n, at + 1));
    if (tot) tot.textContent = pad(n);
    if (rail) { rail.style.setProperty('--w', (100 / Math.max(1, n)) + '%'); rail.style.setProperty('--x', String(at)); }
    if (prev) prev.disabled = at <= 0;
    if (next) next.disabled = at >= n - 1;
  };
  /** @param {number} dir */
  var go = function (dir) {
    if (!stage) return;
    var list = shownCards(); if (!list.length) return;
    var gap = list.length > 1 ? list[1].offsetLeft - list[0].offsetLeft - list[0].offsetWidth : 0;
    stage.scrollBy({ left: dir * (list[0].offsetWidth + gap), behavior: DF.motionOn() ? 'smooth' : 'auto' });
  };
  if (stage) {
    var st = stage;
    st.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(function () { sync(); }); } }, { passive: true });
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    DF.onMedia(wide, function () { sync(true); });
    sync();
  }
})();
