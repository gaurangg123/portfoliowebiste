/* ---------- navigation: the rail, the small-screen menu, the current section ----------
   The rail's ink glides to the section being read and its line fills with reading
   progress. The menu is a modal sheet: Escape or a link closes it, focus returns to
   the button, and the page behind is inert while it is open. The wordmark and Home go
   back to the top without adding "#top". */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var rail = /** @type {HTMLElement|null} */ (document.querySelector('[data-nav]'));
  if (!rail) return;
  var railEl = rail;

  /* reading progress: the rail's line and the small-screen back-to-top ring */
  var fill = /** @type {HTMLElement|null} */ (railEl.querySelector('[data-progress]'));
  var toTop = /** @type {HTMLElement|null} */ (document.querySelector('[data-to-top]'));
  var spine = /** @type {HTMLElement|null} */ (document.querySelector('[data-spine]'));
  var queued = false;
  var onScroll = function () {
    queued = false;
    var y = window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = String(max > 0 ? Math.min(1, y / max) : 0);
    if (fill) fill.style.setProperty('--p', p);
    if (spine) spine.style.setProperty('--p', p);
    if (toTop) { toTop.style.setProperty('--p', p); toTop.classList.toggle('is-on', y > window.innerHeight * 0.9); }
    DF.root.classList.toggle('is-scrolled', y > 8);
  };
  window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* small screens: the menu sheet */
  var btn = /** @type {HTMLButtonElement|null} */ (document.querySelector('[data-menu-btn]'));
  var sheet = /** @type {HTMLElement|null} */ (document.querySelector('[data-sheet]'));
  var wide = window.matchMedia('(min-width: 1024px)');
  var behind = document.querySelectorAll('main, footer, .rail, .masthead, .to-top');
  var open = false;
  /** @param {boolean} on @param {boolean} [restore] */
  var setMenu = function (on, restore) {
    if (!btn || !sheet) return;
    open = on;
    DF.root.classList.toggle('menu-open', on);
    btn.setAttribute('aria-expanded', String(on));
    var label = btn.querySelector('[data-menu-label]');
    if (label) label.textContent = on ? 'Close menu' : 'Open menu';
    DF.each(behind, function (n) { if (on) n.setAttribute('inert', ''); else n.removeAttribute('inert'); });
    if (on) {
      var first = /** @type {HTMLElement|null} */ (sheet.querySelector('a'));
      if (first) first.focus({ preventScroll: true });
    } else if (restore) {
      btn.focus();
    }
  };
  if (btn && sheet) {
    var b = btn, sh = sheet;
    b.addEventListener('click', function () { setMenu(!open); });
    sh.addEventListener('click', function (e) { if (/** @type {Element} */ (e.target).closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (!open) return;
      if (e.key === 'Escape') { setMenu(false, true); return; }
      // keep Tab inside the menu and its button
      if (e.key !== 'Tab') return;
      var items = /** @type {HTMLElement[]} */ ([b].concat(Array.prototype.slice.call(sh.querySelectorAll('a, button'))));
      var at = items.indexOf(/** @type {HTMLElement} */ (document.activeElement));
      var next = e.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at === items.length - 1 ? 0 : at + 1);
      e.preventDefault();
      items[next].focus();
    });
    DF.onMedia(wide, function (e) { if (e.matches && open) setMenu(false); });
  }

  /* back to the top without "#top": the wordmark and Home when they point at this page,
     the small-screen button, and the footer link */
  DF.each(document.querySelectorAll('[data-to-top], [data-to-top-link]'), function (el) {
    el.addEventListener('click', function () { DF.toTop(); });
  });
  DF.each(document.querySelectorAll('[data-home-link]'), function (a) {
    a.addEventListener('click', function (/** @type {MouseEvent} */ e) {
      if (a.pathname === location.pathname && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
        e.preventDefault();
        if (open) setMenu(false);
        DF.toTop(true);
      }
    });
  });

  /* the current section: links marked data-spy follow the section in the middle of the
     screen; the rail's ink glides to it. Between rail sections, the last one stays lit. */
  var ink = /** @type {HTMLElement|null} */ (railEl.querySelector('.rail__ink'));
  var links = document.querySelectorAll('a[data-spy]');
  /** @type {Record<string, HTMLAnchorElement[]>} */
  var byId = {};
  DF.each(links, function (a) {
    var id = a.getAttribute('data-spy');
    if (!document.getElementById(id)) return;
    (byId[id] = byId[id] || []).push(a);
  });
  var current = '';
  var moveInk = function () {
    if (!ink) return;
    var cur = /** @type {HTMLElement|null} */ (railEl.querySelector('.rail__list .rail__link[aria-current], .rail__list .rail__link[data-context]'));
    var box = ink.parentElement;
    if (!cur || !box || !cur.offsetParent) { ink.classList.remove('is-on'); return; }
    ink.style.setProperty('--y', Math.round(cur.getBoundingClientRect().top - box.getBoundingClientRect().top) + 'px');
    ink.classList.add('is-on');
  };
  /** @param {string} id */
  var setCurrent = function (id) {
    if (!id || id === current) return;
    current = id;
    DF.each(links, function (a) { a.removeAttribute('aria-current'); });
    if (byId[id]) byId[id].forEach(function (a) { a.setAttribute('aria-current', 'location'); });
    moveInk();
  };
  var ids = Object.keys(byId);
  if (ids.length && 'IntersectionObserver' in window) {
    /** @type {Record<string, boolean>} */
    var inView = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { inView[e.target.id] = e.isIntersecting; });
      var hit = '';
      for (var i = 0; i < ids.length; i++) if (inView[ids[i]]) hit = ids[i];
      setCurrent(hit);
    }, { rootMargin: '-42% 0px -52% 0px' });
    ids.forEach(function (id) { spy.observe(/** @type {Element} */ (document.getElementById(id))); });
    if (window.pageYOffset < 40) setCurrent(ids[0]);
  }
  window.addEventListener('resize', moveInk, { passive: true });
  moveInk();
})();
