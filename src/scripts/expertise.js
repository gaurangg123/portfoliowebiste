/* ---------- domain cards: the motif plays while hovered or focused,
   and once for a few seconds when the card first scrolls into view ---------- */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  DF.each(document.querySelectorAll('[data-domain]'), function (card) {
    var hover = false, focus = false, intro = 0, seen = false;
    var set = function () { card.classList.toggle('is-live', DF.motionOn() && (hover || focus || intro > 0)); };
    card.addEventListener('pointerenter', function (/** @type {PointerEvent} */ e) { if (e.pointerType === 'mouse') { hover = true; set(); } });
    card.addEventListener('pointerleave', function () { hover = false; set(); });
    card.addEventListener('focusin', function () { focus = true; set(); });
    card.addEventListener('focusout', function () { focus = false; set(); });
    DF.watch(card, function (on) {
      if (!on || seen) return;
      seen = true;
      intro = window.setTimeout(function () { intro = 0; set(); }, 3600);
      set();
    }, '0px 0px -25% 0px');
    DF.onMotion(set);
  });
})();
