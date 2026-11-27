/* ---------- hero: local time in Pune ---------- */
// @ts-check
(function () {
  'use strict';
  var el = document.querySelector('[data-clock]');
  if (!el || !window.Intl) return;
  var box = /** @type {HTMLElement} */ (el);
  var fmt;
  try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }); }
  catch (e) { return; }
  var f = fmt;
  var render = function () {
    var t = f.format(new Date());
    box.textContent = t + ' IST';
  };
  render();
  // align to the next minute, then tick each minute
  window.setTimeout(function () { render(); window.setInterval(render, 60000); }, 60000 - (Date.now() % 60000) + 50);
})();
