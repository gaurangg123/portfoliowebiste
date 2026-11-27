/* ---------- interactive data architecture ----------
   Turns the stage list into tabs (WAI-ARIA tabs pattern, automatic activation):
   pointer or Left/Right/Home/End select a stage and show its panel. Hovering a
   stage previews its connections. Without JavaScript every panel is shown. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var box = document.querySelector('[data-arch]');
  if (!box) return;
  var flow = /** @type {HTMLElement} */ (box.querySelector('[data-arch-flow]'));
  var tabs = /** @type {NodeListOf<HTMLButtonElement>} */ (box.querySelectorAll('.arch__stage'));
  var steps = box.querySelectorAll('.arch__step');
  var panels = /** @type {NodeListOf<HTMLElement>} */ (box.querySelectorAll('[data-arch-panel]'));
  if (!tabs.length || tabs.length !== panels.length) return;

  flow.setAttribute('role', 'tablist');
  flow.setAttribute('aria-label', 'Architecture stages');
  DF.each(steps, function (li, i) { li.setAttribute('role', 'presentation'); li.style.setProperty('--k', String(i)); });
  DF.each(tabs, function (t) { t.setAttribute('role', 'tab'); });
  DF.each(panels, function (p) { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', p.id.replace('arch-panel-', 'arch-tab-')); });

  var current = -1;
  /** @param {number} i @param {string} cls */
  var mark = function (i, cls) {
    DF.each(steps, function (li, k) {
      li.classList.toggle(cls === 'sel' ? 'is-linked' : 'is-peek', k === i - 1 || k === i + 1);
      if (cls === 'sel') li.classList.toggle('is-conn', k === i || k === i + 1);
    });
  };
  /** @param {number} i @param {boolean} [focus] */
  var select = function (i, focus) {
    if (i === current) { if (focus) tabs[i].focus(); return; }
    current = i;
    DF.each(tabs, function (t, k) {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
    });
    DF.each(panels, function (p, k) {
      p.hidden = k !== i;
      p.classList.remove('is-entering');
      if (k === i && DF.motionOn()) { void p.offsetWidth; p.classList.add('is-entering'); }
    });
    mark(i, 'sel');
    if (focus) tabs[i].focus();
  };

  DF.each(tabs, function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (/** @type {KeyboardEvent} */ e) {
      var n = tabs.length, to = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = n - 1;
      if (to < 0) return;
      e.preventDefault();
      select(to, true);
    });
  });
  DF.each(panels, function (p) { p.addEventListener('animationend', function () { p.classList.remove('is-entering'); }); });
  select(0);
})();
