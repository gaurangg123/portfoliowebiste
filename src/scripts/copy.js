/* ---------- copy the email address ---------- */
// @ts-check
(function () {
  'use strict';
  window.DF.each(document.querySelectorAll('[data-copy]'), function (btn) {
    var parent = btn.parentNode;
    var note = parent && parent.querySelector('[data-copy-status]');
    var txt = btn.querySelector('span');
    var label = txt ? txt.textContent : '';
    var timer = 0;
    btn.addEventListener('click', function () {
      /** @param {boolean} ok */
      var done = function (ok) {
        btn.classList.toggle('is-copied', ok);
        if (txt) txt.textContent = ok ? 'Copied' : label;
        if (note) note.textContent = ok ? 'Email address copied to the clipboard.' : 'Couldn’t copy. Select the address instead.';
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.classList.remove('is-copied');
          if (txt) txt.textContent = label;
          if (note) note.textContent = '';
        }, 2600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(btn.getAttribute('data-copy') || '').then(function () { done(true); }, function () { done(false); });
      } else done(false);
    });
  });
})();
