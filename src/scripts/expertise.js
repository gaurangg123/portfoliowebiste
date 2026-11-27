/* ---------- disciplines: each illustration moves while its plate is on screen (or
   hovered), and stops otherwise, under reduced motion and "Pause motion" ---------- */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  DF.each(document.querySelectorAll('[data-domain]'), function (dom) {
    var seen = false, hover = false;
    var set = function () { dom.classList.toggle('is-live', DF.motionOn() && (hover || seen)); };
    dom.addEventListener('pointerenter', function (/** @type {PointerEvent} */ e) { if (e.pointerType === 'mouse') { hover = true; set(); } });
    dom.addEventListener('pointerleave', function () { hover = false; set(); });
    DF.watch(dom, function (on) { seen = on; set(); }, '0px 0px -15% 0px');
    DF.onMotion(set);
  });
})();
