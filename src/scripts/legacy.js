/* ---------- old shareable track links (#/trk-01 … #/trk-05) ----------
   The inline head script redirects fresh loads; this covers a hash change on an
   already-open homepage. */
// @ts-check
(function () {
  'use strict';
  if (!document.querySelector('.page-home')) return;
  var slugs = ['knowledge-portal', 'business-sheet', 'contract-intelligence', 'resume-matching', 'data-migration'];
  window.addEventListener('hashchange', function () {
    var m = location.hash.match(/^#\/trk-0([1-5])$/);
    if (m) location.replace('work/' + slugs[Number(m[1]) - 1] + '/');
  });
})();
