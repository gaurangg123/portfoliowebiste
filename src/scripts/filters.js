/* ---------- projects: filter by category ----------
   Buttons are toggle buttons (aria-pressed); one is always on. The result count is
   announced politely. The first visible card leads (spans the row). */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var bar = document.querySelector('[data-filters]');
  var grid = document.querySelector('[data-missions]');
  if (!bar || !grid) return;
  var buttons = bar.querySelectorAll('button[data-filter]');
  var cards = grid.querySelectorAll('[data-mission]');
  var status = document.querySelector('[data-filter-status]');
  var total = cards.length;

  /** @param {string} key */
  var apply = function (key) {
    var shown = 0, lead = false;
    DF.each(buttons, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key)); });
    DF.each(cards, function (li) {
      var cats = (li.getAttribute('data-cats') || '').split(' ');
      var on = key === 'all' || cats.indexOf(key) !== -1;
      li.hidden = !on;
      li.classList.remove('is-lead', 'is-entering');
      if (!on) return;
      if (!lead) { li.classList.add('is-lead'); lead = true; }
      if (DF.motionOn()) {
        li.style.setProperty('--k', String(shown));
        void li.offsetWidth;            // restart the entrance animation
        li.classList.add('is-entering');
      }
      shown++;
    });
    if (status) {
      var label = '';
      DF.each(buttons, function (b) { if (b.getAttribute('data-filter') === key) label = (b.firstChild && b.firstChild.textContent) || ''; });
      status.textContent = key === 'all' ? 'Showing all ' + total + ' projects' : 'Showing ' + shown + ' of ' + total + ' projects · ' + label.trim();
    }
  };
  DF.each(buttons, function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-filter') || 'all'); });
  });
  DF.each(cards, function (li) { li.addEventListener('animationend', function () { li.classList.remove('is-entering'); }); });
})();
