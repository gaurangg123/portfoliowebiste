/* ---------- disciplines: a discipline's illustration moves while its stage is open and
   on screen (or while hovered), and stops otherwise ---------- */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  DF.each(document.querySelectorAll('[data-domain]'), function (disc) {
    var panel = /** @type {HTMLElement} */ (disc.closest('.stepper__panel') || disc);
    var box = disc.closest('[data-stepper]');
    var seen = false, hover = false;
    var set = function () { disc.classList.toggle('is-live', DF.motionOn() && (hover || (seen && !panel.hidden))); };
    disc.addEventListener('pointerenter', function (/** @type {PointerEvent} */ e) { if (e.pointerType === 'mouse') { hover = true; set(); } });
    disc.addEventListener('pointerleave', function () { hover = false; set(); });
    DF.watch(disc, function (on) { seen = on; set(); }, '0px 0px -15% 0px');
    if (box) box.addEventListener('stepper:change', function () { window.setTimeout(set, 0); });
    DF.onMotion(set);
  });
})();
