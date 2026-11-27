/* ---------- steppers: workflow, architecture, disciplines ----------
   One stage is open at a time (a single-open accordion). Buttons carry aria-expanded;
   ←/→ (or ↑/↓), Home and End move between stages. The track fills to the open stage.
   Hovering a stage with a mouse on a wide screen opens it too (a preview). Without
   JavaScript every stage is open. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var wide = window.matchMedia('(min-width: 1024px) and (hover: hover)');
  DF.each(document.querySelectorAll('[data-stepper]'), function (box) {
    var nodes = /** @type {NodeListOf<HTMLButtonElement>} */ (box.querySelectorAll('.stepper__node'));
    var panels = /** @type {NodeListOf<HTMLElement>} */ (box.querySelectorAll('.stepper__panel'));
    var steps = box.querySelectorAll('.stepper__step');
    if (!nodes.length || nodes.length !== panels.length) return;
    var current = -1, n = nodes.length;
    box.classList.add('is-enhanced');

    /** @param {number} i @param {boolean} [focus] */
    var open = function (i, focus) {
      if (i !== current) {
        current = i;
        DF.each(nodes, function (b, k) { b.setAttribute('aria-expanded', String(k === i)); });
        DF.each(panels, function (p, k) {
          p.hidden = k !== i;
          p.classList.remove('is-entering');
          if (k === i && DF.motionOn()) { void p.offsetWidth; p.classList.add('is-entering'); }
        });
        DF.each(steps, function (s, k) {
          s.classList.toggle('is-open', k === i);
          s.classList.toggle('is-done', k < i);
          s.classList.toggle('is-next', k === i + 1);
        });
        box.style.setProperty('--at', String(i));
        box.style.setProperty('--progress', String(n > 1 ? i / (n - 1) : 1));
        var tone = steps[i] && steps[i].getAttribute('data-tone');
        if (tone) box.setAttribute('data-active-tone', tone);
        box.dispatchEvent(new CustomEvent('stepper:change', { detail: { index: i } }));
      }
      if (focus) nodes[i].focus();
    };

    DF.each(nodes, function (b, i) {
      b.addEventListener('click', function () { open(i); });
      b.addEventListener('pointerenter', function (/** @type {PointerEvent} */ e) {
        if (e.pointerType === 'mouse' && wide.matches && box.hasAttribute('data-hover')) open(i);
      });
      b.addEventListener('keydown', function (/** @type {KeyboardEvent} */ e) {
        var to = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        if (to < 0) return;
        e.preventDefault();
        open(to, true);
      });
    });
    DF.each(panels, function (p) { p.addEventListener('animationend', function () { p.classList.remove('is-entering'); }); });
    open(0);
    // the track draws itself the first time the stepper is seen
    DF.watch(box, function (on) { if (on) box.classList.add('is-seen'); }, '0px 0px -20% 0px');
  });
})();
