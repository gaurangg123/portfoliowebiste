/* ---------- experience: the timeline rail fills as the roles are read ---------- */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var wrap = document.querySelector('.career__wrap');
  var fill = /** @type {HTMLElement|null} */ (document.querySelector('[data-career-fill]'));
  if (!wrap || !fill) return;
  var w = /** @type {HTMLElement} */ (wrap), f = /** @type {HTMLElement} */ (fill);
  var near = false, queued = false;
  var update = function () {
    queued = false;
    if (!DF.motionOn()) { f.style.setProperty('--p', '1'); return; }
    var r = w.getBoundingClientRect();
    var p = (window.innerHeight * 0.62 - r.top) / r.height;
    f.style.setProperty('--p', String(Math.max(0.04, Math.min(1, p)).toFixed(3)));
  };
  window.addEventListener('scroll', function () { if (near && !queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  DF.watch(w, function (on) { near = on; if (on) update(); }, '200px 0px');
  DF.onMotion(update);
  update();
})();
