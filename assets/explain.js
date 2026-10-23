/* ============================================================
   Case-study explanations: selection behaviour only.
   Every explanation is complete HTML without this file; this adds
   - tabs: the Knowledge Portal capability map (mouse, touch, keyboard)
   - pick: select an extracted item or requirement to mark its source
   - sheet: the Business Sheet sample, recomputed from one data set
   - trace: a single, optional pass along the migration flow
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  /* ---------- tabs ---------- */
  each(document.querySelectorAll('[data-xp="tabs"]'), function (box) {
    var list = box.querySelector('[data-xp-tabs]');
    var tabs = list.querySelectorAll('button');
    var panels = box.querySelectorAll('.map__panel');
    var spokes = box.querySelectorAll('.map__spokes path');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Knowledge Portal capabilities');
    var select = function (i, focus) {
      each(tabs, function (t, k) {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
      });
      each(panels, function (p, k) { p.hidden = k !== i; });
      each(spokes, function (s, k) { s.classList.toggle('is-on', k === i); });
      if (focus) tabs[i].focus();
    };
    each(tabs, function (t, i) {
      t.setAttribute('role', 'tab');
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', t.id);
      panels[i].tabIndex = 0;
      t.addEventListener('click', function () { select(i, false); });
    });
    list.addEventListener('keydown', function (e) {
      var i = Array.prototype.indexOf.call(tabs, document.activeElement), n = tabs.length;
      if (i < 0) return;
      var to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select((to + n) % n, true);
    });
    select(0, false);
    box.classList.add('is-ready');
  });

  /* ---------- pick: an item and its source, marked together ---------- */
  each(document.querySelectorAll('[data-xp="pick"]'), function (box) {
    var btns = box.querySelectorAll('[data-pick]');
    var current = null;
    var set = function (key) {
      current = key;
      box.classList.toggle('has-pick', !!key);
      each(btns, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick') === key)); });
      var first = null;
      each(box.querySelectorAll('[data-key]'), function (el) {
        var on = el.getAttribute('data-key') === key;
        el.classList.toggle('is-on', on);
        if (on && !first && el.tagName !== 'TR') first = el;
      });
      /* when the source is off screen (stacked on small screens), bring it into view */
      if (first) {
        var r = first.getBoundingClientRect();
        if (r.bottom < 70 || r.top > window.innerHeight - 40) first.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
      }
    };
    each(btns, function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-pick');
        set(current === key ? null : key);
      });
    });
  });

  /* ---------- sheet: one sample data set drives the table, chart and answer ---------- */
  each(document.querySelectorAll('[data-xp="sheet"]'), function (box) {
    var FY = JSON.parse(box.getAttribute('data-fy'));
    var SERIES = JSON.parse(box.getAttribute('data-series'));
    var MAX = 132;
    var state = { lob: 'LOB 2', from: 6 };
    var q = function (k) { return box.querySelectorAll('[data-bsx="' + k + '"]'); };
    var growth = function (a, b) {
      var g = (b - a) / a * 100;
      return g === Math.round(g) ? g + '%' : '≈ ' + Math.round(g) + '%';
    };
    var render = function () {
      var v = SERIES[state.lob], from = state.from, last = v.length - 1;
      var idx = []; for (var i = from; i <= last; i++) idx.push(i);
      var shown = idx.length > 7 ? idx.slice(0, 2).concat(['gap'], idx.slice(-3)) : idx;
      q('rows')[0].innerHTML = shown.map(function (i) {
        return i === 'gap' ? '<tr class="bsx__gap"><td>⋮</td><td>⋮</td></tr>' : '<tr><td>' + FY[i] + '</td><td>' + v[i] + '</td></tr>';
      }).join('');
      q('bars')[0].innerHTML = v.slice(from).map(function (x, i, a) {
        return '<i style="--h:' + (x / MAX * 100).toFixed(1) + '%"' + (i === 0 || i === a.length - 1 ? ' data-v="' + x + '"' : '') + '></i>';
      }).join('');
      each(q('title'), function (el) { el.textContent = 'Org A · ' + state.lob; });
      q('range')[0].textContent = FY[from] + ' → Current FY';
      q('answer')[0].textContent = 'It’s how much revenue changed across the years you’ve selected, as a share of the first year. For Org A · ' +
        state.lob + ': (' + v[last] + ' − ' + v[from] + ') ÷ ' + v[from] + ' = ' + growth(v[from], v[last]) + ' from ' + FY[from] + ' to the current FY.';
      each(box.querySelectorAll('[data-lob]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lob') === state.lob)); });
      each(box.querySelectorAll('[data-from]'), function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-from') === state.from)); });
    };
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-lob')) state.lob = b.getAttribute('data-lob');
      else if (b.hasAttribute('data-from')) state.from = +b.getAttribute('data-from');
      else return;
      render();
    });
  });

  /* ---------- trace: one pass along the flow, then the static diagram ---------- */
  each(document.querySelectorAll('[data-xp="trace"]'), function (box) {
    var btn = box.querySelector('[data-trace]');
    var steps = box.querySelectorAll('.mflow > li');
    if (!btn || !steps.length) return;
    btn.addEventListener('click', function () {
      if (reduce.matches || box.classList.contains('is-tracing')) return;
      box.classList.add('is-tracing');
      btn.setAttribute('aria-disabled', 'true');
      steps[steps.length - 1].addEventListener('animationend', function done() {
        steps[steps.length - 1].removeEventListener('animationend', done);
        box.classList.remove('is-tracing');
        btn.removeAttribute('aria-disabled');
      });
    });
  });
})();
