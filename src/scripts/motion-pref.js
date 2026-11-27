/* ---------- "Pause motion": stops every continuous animation on the site ----------
   Remembered for the next visit. Hidden when the device already asks for reduced
   motion, because then nothing loops in the first place. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var btn = document.querySelector('[data-motion-toggle]');
  if (!btn) return;
  var b = /** @type {HTMLElement} */ (btn);
  var label = b.querySelector('[data-motion-label]');
  var item = /** @type {HTMLElement} */ (b.closest('li') || b);

  var render = function () {
    var off = DF.root.classList.contains('motion-off');
    b.setAttribute('aria-pressed', String(off));
    if (label) label.textContent = off ? 'Resume motion' : 'Pause motion';
    item.hidden = DF.reduce.matches;
  };
  b.addEventListener('click', function () {
    var off = !DF.root.classList.contains('motion-off');
    DF.root.classList.toggle('motion-off', off);
    try { localStorage.setItem('df-motion', off ? 'off' : 'on'); } catch (e) { /* private mode: not remembered */ }
    render();
    document.dispatchEvent(new CustomEvent('df:motion'));
  });
  DF.onMedia(DF.reduce, render);
  render();
})();
