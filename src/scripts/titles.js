/* ---------- hero: the rotating role line ----------
   Types each title, holds it, deletes it, moves on. Screen readers get the full list
   once (a visually hidden sentence), so this element is aria-hidden. Still when
   motion is reduced or paused, and while the hero is off screen. */
// @ts-check
(function () {
  'use strict';
  var DF = window.DF;
  var el = /** @type {HTMLElement|null} */ (document.querySelector('[data-typed]'));
  if (!el) return;
  var box = /** @type {HTMLElement} */ (el);
  var titles = /** @type {string[]} */ (JSON.parse(box.getAttribute('data-titles') || '[]'));
  if (titles.length < 2) return;
  var i = 0, n = titles[0].length, deleting = false, timer = 0, visible = true;

  var tick = function () {
    timer = 0;
    if (!DF.motionOn() || !visible) return;
    var word = titles[i];
    if (!deleting) {
      n++;
      box.textContent = word.slice(0, n);
      if (n >= word.length) { deleting = true; timer = window.setTimeout(tick, 1900); return; }
      timer = window.setTimeout(tick, 55 + Math.random() * 40);
    } else {
      n--;
      box.textContent = word.slice(0, n);
      if (n <= 0) { deleting = false; i = (i + 1) % titles.length; timer = window.setTimeout(tick, 320); return; }
      timer = window.setTimeout(tick, 28);
    }
  };
  var sync = function () {
    if (DF.motionOn() && visible) { if (!timer) timer = window.setTimeout(tick, deleting || n < titles[i].length ? 60 : 1900); }
    else {
      window.clearTimeout(timer); timer = 0;
      if (!DF.motionOn()) { box.textContent = titles[i]; n = titles[i].length; deleting = false; }
    }
  };
  DF.watch(box, function (on) { visible = on; sync(); });
  DF.onMotion(sync);
})();
