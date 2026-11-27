/* ---------- projects: the filters ----------
   Toggle buttons (aria-pressed) narrow the gallery to one category; the result is
   announced. The lab row hides when none of its experiments match. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var box = document.querySelector('[data-explorer]');
  if (!box) return;
  var buttons = box.querySelectorAll('button[data-filter]');
  var cards = /** @type {NodeListOf<HTMLElement>} */ (box.querySelectorAll('[data-mission]'));
  var lab = /** @type {HTMLElement|null} */ (box.querySelector('.px__lab'));
  var status = box.querySelector('[data-filter-status]');
  var total = cards.length;

  /** @param {string} key */
  var filter = function (key) {
    var shown = 0;
    DF.each(buttons, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key)); });
    DF.each(cards, function (c) {
      var on = key === 'all' || (c.getAttribute('data-cats') || '').split(' ').indexOf(key) !== -1;
      c.hidden = !on;
      c.classList.remove('is-entering');
      if (on) {
        if (DF.motionOn()) { c.style.setProperty('--k', String(shown)); void c.offsetWidth; c.classList.add('is-entering'); }
        shown++;
      }
    });
    if (lab) lab.hidden = !lab.querySelector('[data-mission]:not([hidden])');
    DF.root.setAttribute('data-filtered', key === 'all' ? '' : key);
    if (status) {
      var label = '';
      DF.each(buttons, function (b) { if (b.getAttribute('data-filter') === key) label = (b.firstChild && b.firstChild.textContent) || ''; });
      status.textContent = key === 'all' ? 'Showing all ' + total + ' projects' : 'Showing ' + shown + ' of ' + total + ' projects · ' + label.trim();
    }
  };
  DF.each(buttons, function (b) { b.addEventListener('click', function () { filter(b.getAttribute('data-filter') || 'all'); }); });
  DF.each(cards, function (c) { c.addEventListener('animationend', function () { c.classList.remove('is-entering'); }); });
})();
