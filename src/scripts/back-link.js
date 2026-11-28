/* ---------- a case study's back link returns to where the visitor was ----------
   Arriving from the homepage, "Back" goes back in history, so the homepage opens at the
   place it was left. Arriving from anywhere else (a shared link, a search result), it
   goes to the projects section. */
// @ts-check
(function () {
  'use strict';
  var link = /** @type {HTMLAnchorElement|null} */ (document.querySelector('[data-back]'));
  if (!link) return;
  var a = link;
  /** @type {URL|null} */ var from;
  try { from = document.referrer ? new URL(document.referrer) : null; } catch (e) { from = null; }
  var home = new URL(a.href, location.href);
  var cameFromHome = !!from && from.origin === location.origin && from.pathname === home.pathname && history.length > 1;
  if (!cameFromHome) return;
  a.addEventListener('click', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    history.back();
  });
})();
