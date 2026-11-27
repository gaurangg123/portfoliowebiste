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

  window.DF = {
    root: root,
    reduce: reduce,
    each: each,
    onMedia: onMedia,
    /** motion is on unless the visitor asked for less, or paused it on this site */
    motionOn: function () { return !reduce.matches && !root.classList.contains('motion-off'); },
    /** @param {() => void} fn called whenever motionOn() may have changed */
    onMotion: function (fn) {
      document.addEventListener('df:motion', fn);
      onMedia(reduce, fn);
    },
    /**
     * Calls back with true/false as an element enters or leaves the viewport.
     * @param {Element} el @param {(on: boolean) => void} fn @param {string} [margin]
     */
    watch: function (el, fn, margin) {
      if (!('IntersectionObserver' in window)) { fn(true); return; }
      new IntersectionObserver(function (entries) {
        fn(entries[entries.length - 1].isIntersecting);
      }, { rootMargin: margin || '0px' }).observe(el);
    },
  };

  each(document.querySelectorAll('[data-year]'), function (el) { el.textContent = String(new Date().getFullYear()); });
})();
