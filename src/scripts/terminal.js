/* ---------- terminal: the DOM side ----------
   Echoes each command, prints the answer from DFTerminal (terminal-core.js), keeps
   a history (↑/↓), completes with Tab, clears with `clear` or Ctrl+L. All output is
   built with DOM methods: typed text is never parsed as HTML. */
// @ts-check
(function () {
  'use strict';
  var box = document.querySelector('[data-term]');
  var core = window.DFTerminal;
  var dataEl = document.getElementById('term-data');
  if (!box || !core || !dataEl) return;
  var data = JSON.parse(dataEl.textContent || '{}');
  var out = /** @type {HTMLElement} */ (box.querySelector('[data-term-out]'));
  var body = /** @type {HTMLElement} */ (box.querySelector('[data-term-body]'));
  var form = /** @type {HTMLFormElement} */ (box.querySelector('[data-term-form]'));
  var input = /** @type {HTMLInputElement} */ (box.querySelector('.term__input'));
  if (!out || !body || !form || !input) return;
  /** @type {string[]} */ var history = [];
  var at = 0, draft = '';

  /** @param {Array<{t: string, c?: string, href?: string, ext?: boolean}>} segs @param {string} [cls] */
  var line = function (segs, cls) {
    var p = document.createElement('p');
    p.className = 't-line' + (cls ? ' ' + cls : '');
    segs.forEach(function (s) {
      if (!s.t) return;
      var el;
      if (s.href) {
        el = document.createElement('a');
        el.setAttribute('href', s.href);
        if (s.ext) { el.target = '_blank'; el.rel = 'noopener noreferrer'; }
      } else el = document.createElement('span');
      if (s.c) el.className = 't-' + s.c;
      el.textContent = s.t;
      p.appendChild(el);
    });
    out.appendChild(p);
  };
  var toEnd = function () { body.scrollTop = body.scrollHeight; };

  /** @param {string} raw */
  var exec = function (raw) {
    var cmd = raw.trim();
    line([{ t: data.prompt, c: 'prompt' }, { t: ' ' + cmd }], 't-echo');
    if (cmd) { history.push(cmd); if (history.length > 50) history.shift(); }
    at = history.length; draft = '';
    var r = core.run(cmd, data, history);
    if (r.clear) out.textContent = '';
    else r.lines.forEach(function (/** @type {any} */ l) { line(l); });
    toEnd();
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    exec(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      if (at === history.length) draft = input.value;
      at = Math.max(0, at - 1);
      input.value = history[at];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      at = Math.min(history.length, at + 1);
      input.value = at === history.length ? draft : history[at];
    } else if (e.key === 'Tab' && !e.shiftKey && input.value.trim()) {
      var m = core.complete(input.value);
      if (m.length === 1 && m[0] !== input.value.trim()) { e.preventDefault(); input.value = m[0]; }
      else if (m.length > 1) {
        e.preventDefault();
        line([{ t: m.join('   '), c: 'dim' }]);
        toEnd();
      }
    } else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) {
      e.preventDefault();
      out.textContent = '';
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      var len = input.value.length;
      window.requestAnimationFrame(function () { input.setSelectionRange(len, len); });
    }
  });
  // a click anywhere in the window focuses the prompt, unless it is on a link or a selection
  body.addEventListener('click', function (e) {
    var sel = window.getSelection();
    if (/** @type {Element} */ (e.target).closest('a') || (sel && sel.toString())) return;
    input.focus({ preventScroll: true });
  });
  window.DF.each(document.querySelectorAll('[data-cmd]'), function (b) {
    b.addEventListener('click', function () {
      exec(b.getAttribute('data-cmd') || '');
      input.focus({ preventScroll: true });
    });
  });
  toEnd();
})();
