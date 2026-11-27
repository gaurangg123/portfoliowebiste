/* ---------- Query the Engineer: the conversation ----------
   Suggested questions and typed questions go to the local engine (query-engine.js);
   the answer is built with DOM calls only, so nothing typed is ever parsed as HTML.
   Links come from the portfolio's data, never from the question. ?q= asks on arrival. */
// @ts-check
(function () {
  'use strict';
  var root = /** @type {HTMLElement|null} */ (document.querySelector('[data-qe]'));
  var kbEl = document.getElementById('qe-kb');
  var engine = /** @type {any} */ (window).DFQuery;
  if (!root || !kbEl || !engine) return;
  var kb = JSON.parse(kbEl.textContent || '{}');
  var base = root.getAttribute('data-base') || '../';
  var log = /** @type {HTMLElement} */ (root.querySelector('[data-qe-log]'));
  var form = /** @type {HTMLFormElement} */ (root.querySelector('[data-qe-form]'));
  var input = /** @type {HTMLInputElement} */ (root.querySelector('[data-qe-input]'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DF = window.DF;
  /** @type {string[]} */ var asked = [];
  /** @type {Array<[string, boolean]>} questions asked while an answer is still arriving */
  var waiting = [];
  var recall = -1, busy = false;

  /** @param {string} tag @param {string} [cls] @param {string} [text] */
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  /** the arrow icon, from a template on the page so the markup stays in one place */
  var tpl = /** @type {HTMLTemplateElement|null} */ (document.getElementById('qe-arrow'));
  var arrow = tpl && tpl.content.firstElementChild;
  /** @param {string} href @param {string} text @param {string} [cls] */
  var link = function (href, text, cls) {
    var a = /** @type {HTMLAnchorElement} */ (el('a', cls, text));
    var external = /^https?:/.test(href);
    a.href = external || /^mailto:/.test(href) ? href : base + href;
    if (external) {
      a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.appendChild(el('span', 'visually-hidden', ' (opens in a new tab)'));
    }
    if (arrow) a.appendChild(arrow.cloneNode(true));
    return a;
  };

  /** @param {any} a an answer from the engine */
  var renderAnswer = function (a) {
    var art = el('article', 'qe-ans');
    art.appendChild(el('h3', 'qe-ans__title', a.title));
    a.blocks.forEach(function (/** @type {any} */ b) {
      if (b.type === 'p') { art.appendChild(el('p', '', b.text)); return; }
      var ul = el('ul', b.type === 'tags' ? 'tags' : 'qe-ans__list');
      b.items.forEach(function (/** @type {any} */ it) {
        if (b.type === 'tags') { ul.appendChild(el('li', 'tag', it)); return; }
        var li = el('li');
        if (it.label) { li.appendChild(el('b', '', it.label)); li.appendChild(document.createTextNode(' ')); }
        li.appendChild(document.createTextNode(it.text));
        if (it.href) {
          li.appendChild(document.createTextNode(' '));
          var go = link(it.href, /^work\//.test(it.href) ? 'Case study' : /^#/.test(it.href) ? 'On the homepage' : /^mailto:/.test(it.href) ? 'Write' : 'Open', 'qe-ans__go');
          if (it.label) go.insertBefore(el('span', 'visually-hidden', ': ' + it.label), go.lastChild);
          li.appendChild(go);
        }
        ul.appendChild(li);
      });
      art.appendChild(ul);
    });
    if (a.links.length) {
      var links = el('ul', 'qe-ans__links');
      a.links.forEach(function (/** @type {any} */ l) { var li = el('li'); li.appendChild(link(l.href, l.text)); links.appendChild(li); });
      art.appendChild(links);
    }
    if (a.follow.length) {
      var next = el('div', 'qe-ans__next');
      next.appendChild(el('span', 'label', 'Ask next'));
      a.follow.forEach(function (/** @type {string} */ q) {
        var b = /** @type {HTMLButtonElement} */ (el('button', 'qe-chip', q));
        b.type = 'button'; b.setAttribute('data-qe-ask', q);
        next.appendChild(b);
      });
      art.appendChild(next);
    }
    return art;
  };

  /** @param {string} question @param {boolean} [fromInput] */
  var ask = function (question, fromInput) {
    var q = String(question || '').replace(/\s+/g, ' ').trim().slice(0, 200);
    if (!q) return;
    if (busy) { waiting.push([q, !!fromInput]); return; }
    busy = true;
    asked.push(q); recall = -1;
    var mine = el('div', 'qe-msg qe-msg--q');
    mine.appendChild(el('p', '', q));
    log.appendChild(mine);
    var reply = el('div', 'qe-msg qe-msg--a is-typing');
    reply.appendChild(el('span', 'qe-msg__who', 'DF')).setAttribute('aria-hidden', 'true');
    var dots = el('span', 'qe-typing');
    dots.innerHTML = '<i></i><i></i><i></i>';
    dots.appendChild(el('span', 'visually-hidden', 'Looking through the portfolio…'));
    reply.appendChild(dots);
    log.appendChild(reply);
    var smooth = DF && DF.motionOn ? DF.motionOn() : !reduce.matches;
    mine.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' });
    var finish = function () {
      reply.classList.remove('is-typing');
      reply.removeChild(dots);
      reply.appendChild(renderAnswer(engine.answer(q, kb)));
      busy = false;
      mine.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
      if (fromInput) input.focus({ preventScroll: true });
      var next = waiting.shift();
      if (next) ask(next[0], next[1]);
    };
    // a short pause reads as a reply; the answer itself is computed instantly, on this device
    if (smooth) setTimeout(finish, 420); else finish();
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    ask(v, true);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    if (!asked.length) return;
    e.preventDefault();
    if (e.key === 'ArrowUp') recall = recall < 0 ? asked.length - 1 : Math.max(0, recall - 1);
    else recall = recall < 0 ? -1 : recall + 1;
    if (recall >= asked.length) recall = -1;
    input.value = recall < 0 ? '' : asked[recall];
  });
  root.addEventListener('click', function (e) {
    var b = /** @type {Element} */ (e.target).closest('[data-qe-ask]');
    if (b) ask(b.getAttribute('data-qe-ask') || '');
  });
  var clear = root.querySelector('[data-qe-clear]');
  if (clear) clear.addEventListener('click', function () {
    DF.each(log.querySelectorAll('.qe-msg:not([data-qe-welcome])'), function (m) { m.remove(); });
    asked = []; recall = -1; waiting = [];
    input.focus();
  });

  var first = new URLSearchParams(location.search).get('q');
  if (first) ask(first);
})();
