/* ---------- project walkthroughs ----------
   The player (assets/walkthroughs/) loads on the first "Watch walkthrough" click, so
   it costs nothing until someone asks for one. It never starts on its own. Paths
   resolve from this script's own URL, so they work on every page and base path. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var script = /** @type {HTMLScriptElement|null} */ (document.currentScript);
  var triggers = document.querySelectorAll('[data-demo]');
  if (!triggers.length) return;
  var siteRoot = new URL('../../', (script && script.src) || location.href).href;
  var DEMO_V = '17';
  /** @type {Promise<any>|null} */ var loading = null;
  /** @param {string} tag @param {Record<string, string>} attrs */
  var add = function (tag, attrs) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement(tag);
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      el.onload = resolve; el.onerror = reject;
      document.head.appendChild(el);
    });
  };
  var load = function () {
    if (window.PortfolioWalkthrough && window.PortfolioDemos) return Promise.resolve(window.PortfolioWalkthrough);
    if (!loading) {
      var base = siteRoot + 'assets/walkthroughs/';
      loading = Promise.all([
        add('link', { rel: 'stylesheet', href: base + 'walkthrough.css?v=' + DEMO_V }),
        add('script', { src: base + 'demos.js?v=' + DEMO_V }),
        add('script', { src: base + 'walkthrough.js?v=' + DEMO_V }),
      ]).then(function () { return window.PortfolioWalkthrough; });
      loading.catch(function () { loading = null; });   // allow a retry
    }
    return loading;
  };
  DF.each(triggers, function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-busy') === 'true') return;
      btn.setAttribute('aria-busy', 'true');
      var holder = btn.closest('figure, .mission__card, .cs-links li');
      var note = holder && holder.querySelector('[data-demo-status]');
      load().then(function (player) {
        btn.removeAttribute('aria-busy');
        if (note) note.textContent = '';
        if (!player || !player.open(btn.getAttribute('data-demo'), btn, siteRoot)) throw new Error('missing demo');
      }).catch(function () {
        btn.removeAttribute('aria-busy');
        if (note) note.textContent = 'The walkthrough couldn’t load. Please try again, or read the case study.';
      });
    });
  });
})();
