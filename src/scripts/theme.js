/* ---------- light / dark theme ----------
   Dark is the default; the visitor's choice is remembered. The inline head script
   applies it before the first paint, so there is no flash of the other theme. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var meta = document.querySelector('meta[name="theme-color"]');
  var current = function () { return DF.root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; };
  var render = function () {
    var t = current();
    if (meta) meta.setAttribute('content', t === 'light' ? '#F5F7FB' : '#05070D');
    DF.each(document.querySelectorAll('[data-theme-toggle]'), function (b) {
      b.setAttribute('aria-pressed', String(t === 'light'));
      var l = b.querySelector('[data-theme-label]');
      if (l) l.textContent = t === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    });
  };
  DF.each(document.querySelectorAll('[data-theme-toggle]'), function (b) {
    b.addEventListener('click', function () {
      var next = current() === 'light' ? 'dark' : 'light';
      DF.root.setAttribute('data-theme', next);
      try { localStorage.setItem('df-theme', next); } catch (e) { /* private mode: not remembered */ }
      render();
      document.dispatchEvent(new CustomEvent('df:theme'));
    });
  });
  render();
})();
