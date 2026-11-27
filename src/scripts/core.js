/* ============================================================
   DataForge — shared helpers (window.DF). Every other script reads these.
   The pages are complete without JavaScript; scripts only add behaviour.
   ============================================================ */
// @ts-check
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** @param {ArrayLike<Element>} list @param {(el: any, i: number) => void} fn */
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /** @param {MediaQueryList} mq @param {(e: MediaQueryListEvent) => void} fn */
  var onMedia = function (mq, fn) {
    if (mq.addEventListener) mq.addEventListener('change', fn);
    else if (mq.addListener) mq.addListener(fn);
  };

  /** the page URL without a fragment that only meant "the top" */
  var dropTopHash = function () {
    if (location.hash === '#top' && history.replaceState) history.replaceState(history.state, '', location.pathname + location.search);
  };

  window.DF = {
    root: root,
    reduce: reduce,
    each: each,
    onMedia: onMedia,
    motionOn: function () { return !reduce.matches && !root.classList.contains('motion-off'); },
    /** @param {() => void} fn called whenever motionOn() may have changed */
    onMotion: function (fn) {
      document.addEventListener('df:motion', fn);
      onMedia(reduce, fn);
    },
    /** @param {Element} el @param {(on: boolean) => void} fn @param {string} [margin] */
    watch: function (el, fn, margin) {
      if (!('IntersectionObserver' in window)) { fn(true); return; }
      new IntersectionObserver(function (entries) {
        fn(entries[entries.length - 1].isIntersecting);
      }, { rootMargin: margin || '0px' }).observe(el);
    },
    /**
     * Back to the top of the page: smooth unless motion is reduced, focus returns to the
     * start of the page for keyboard users, and no "#top" is added to the address.
     * @param {boolean} [home] called from the wordmark
     */
    toTop: function (home) {
      // from the wordmark, a section fragment ("#projects") becomes a new, clean history
      // entry, so Back returns to that section; a bare "#top" is simply dropped
      if (home && location.hash && location.hash !== '#top' && history.pushState) history.pushState(null, '', location.pathname + location.search);
      else dropTopHash();
      window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
      // focus the home link that is showing (the rail's mark, or the masthead on small screens)
      var start = /** @type {HTMLElement|undefined} */ (Array.prototype.filter.call(document.querySelectorAll('[data-home-link]'), function (/** @type {HTMLElement} */ el) { return !!el.offsetParent && !el.closest('[data-sheet]'); })[0]);
      if (start) start.focus({ preventScroll: true });
    },
  };

  dropTopHash();
  each(document.querySelectorAll('[data-year]'), function (el) { el.textContent = String(new Date().getFullYear()); });
})();
