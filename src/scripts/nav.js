/* ---------- navigation: bar state, small-screen menu, current section, back to top ---------- */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var nav = document.querySelector('[data-nav]');
  if (!nav) return;
  var navEl = /** @type {HTMLElement} */ (nav);

  /* the bar firms up once the page has scrolled */
  var queued = false;
  var toTop = /** @type {HTMLElement|null} */ (document.querySelector('[data-to-top]'));
  var onScroll = function () {
    queued = false;
    var y = window.pageYOffset;
    navEl.classList.toggle('is-scrolled', y > 8);
    if (toTop) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      toTop.classList.toggle('is-on', y > window.innerHeight * 0.9);
      toTop.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0));
    }
  };
  window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* small screens: the menu opens a full-screen sheet */
  var btn = navEl.querySelector('[data-menu-btn]');
  var sheet = navEl.querySelector('[data-sheet]');
  var wide = window.matchMedia('(min-width: 1024px)');
  var open = false;
  /** @param {boolean} on @param {boolean} [restore] */
  var setMenu = function (on, restore) {
    if (!btn || !sheet) return;
    open = on;
    navEl.classList.toggle('is-open', on);
    DF.root.classList.toggle('menu-open', on);
    btn.setAttribute('aria-expanded', String(on));
    var txt = btn.querySelector('.nav__menu-txt');
    if (txt) txt.textContent = on ? 'Close' : 'Menu';
    if (on) {
      var first = /** @type {HTMLElement|null} */ (sheet.querySelector('a'));
      if (first) first.focus({ preventScroll: true });
    } else if (restore) {
      /** @type {HTMLElement} */ (btn).focus();
    }
  };
  if (btn && sheet) {
    btn.addEventListener('click', function () { setMenu(!open); });
    sheet.addEventListener('click', function (e) { if (/** @type {Element} */ (e.target).closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) setMenu(false, true); });
    navEl.addEventListener('focusout', function (e) {
      var to = /** @type {FocusEvent} */ (e).relatedTarget;
      if (open && to && !navEl.contains(/** @type {Node} */ (to))) setMenu(false);
    });
    DF.onMedia(wide, function (e) { if (e.matches && open) setMenu(false); });
  }

  /* back to the top without adding "#top": the floating button, the footer link, and the
     wordmark when it already points at this page */
  DF.each(document.querySelectorAll('[data-to-top], [data-to-top-link]'), function (b) {
    b.addEventListener('click', function () { DF.toTop(); });
  });
  var brand = /** @type {HTMLAnchorElement|null} */ (navEl.querySelector('[data-home-link]'));
  if (brand) brand.addEventListener('click', function (e) {
    if (brand && brand.pathname === location.pathname && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      if (open) setMenu(false);
      DF.toTop(true);
    }
  });

  /* current section: links marked data-spy follow the section in the middle of the screen */
  var ink = /** @type {HTMLElement|null} */ (navEl.querySelector('.nav__ink'));
  var links = document.querySelectorAll('a[data-spy]');
  /** @type {Record<string, HTMLAnchorElement[]>} */
  var byId = {};
  DF.each(links, function (a) {
    var id = a.getAttribute('data-spy');
    if (!document.getElementById(id)) return;
    (byId[id] = byId[id] || []).push(a);
  });
  var moveInk = function () {
    if (!ink) return;
    var cur = /** @type {HTMLElement|null} */ (navEl.querySelector('.nav__links a[aria-current]'));
    if (!cur || !cur.offsetParent) { ink.classList.remove('is-on'); return; }
    ink.style.setProperty('--x', cur.offsetLeft + 'px');
    ink.style.setProperty('--w', cur.offsetWidth + 'px');
    ink.classList.add('is-on');
  };
  /** @param {string|null} id */
  var setCurrent = function (id) {
    DF.each(links, function (a) { a.removeAttribute('aria-current'); });
    if (id && byId[id]) byId[id].forEach(function (a) { a.setAttribute('aria-current', 'true'); });
    moveInk();
  };
  var ids = Object.keys(byId);
  if (ids.length && 'IntersectionObserver' in window) {
    /** @type {Record<string, boolean>} */
    var inView = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { inView[e.target.id] = e.isIntersecting; });
      var hit = null;
      for (var i = 0; i < ids.length; i++) if (inView[ids[i]]) hit = ids[i];
      setCurrent(hit);
    }, { rootMargin: '-42% 0px -52% 0px' });
    ids.forEach(function (id) { spy.observe(/** @type {Element} */ (document.getElementById(id))); });
    window.addEventListener('resize', moveInk, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
  }
})();
