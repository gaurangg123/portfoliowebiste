/* ============================================================
   Terminal — command logic (no DOM). Shared by the page, the build (which
   pre-renders the opening output for visitors without JavaScript) and the unit
   tests in qa/unit/. It answers from portfolio data only: nothing is executed,
   nothing is sent anywhere.

   A command returns { lines, clear }. A line is a list of segments:
   { t: text, c?: class, href?: link, ext?: opens in a new tab }.
   ============================================================ */
// @ts-check
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else /** @type {any} */ (root).DFTerminal = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** @typedef {{ t: string, c?: string, href?: string, ext?: boolean }} Seg */
  /** @typedef {Seg[]} Line */

  /** @type {Array<[string, string]>} */
  var COMMANDS = [
    ['help', 'List the available commands'],
    ['about', 'Who I am, in four lines'],
    ['skills', 'The four engineering domains and their tools'],
    ['projects', 'Engineering missions, with links to case studies'],
    ['experience', 'Roles, newest first'],
    ['education', 'Degree and certifications'],
    ['stack', 'Tools by layer, and what this site is built with'],
    ['contact', 'Email, LinkedIn, GitHub and résumé'],
    ['whoami', 'One-line identity'],
    ['history', 'Commands entered in this session'],
    ['clear', 'Clear the screen (or press Ctrl+L)'],
  ];
  var NAMES = COMMANDS.map(function (c) { return c[0]; });
  var ALIASES = { ls: 'projects', cls: 'clear', man: 'help', '?': 'help', resume: 'contact', cv: 'contact' };

  /** @param {string} s @param {number} n */
  var pad = function (s, n) { while (s.length < n) s += ' '; return s; };
  /** @param {string} t @param {string} [c] @returns {Seg} */
  var seg = function (t, c) { return c ? { t: t, c: c } : { t: t }; };
  /** @param {string} t @returns {Line} */
  var head = function (t) { return [seg(t, 'h')]; };
  /** @returns {Line} */
  var blank = function () { return [seg('')]; };

  /** @param {string} input @returns {string[]} names that start with the input */
  function complete(input) {
    var v = String(input || '').trim().toLowerCase();
    if (!v || v.indexOf(' ') !== -1) return [];
    return NAMES.filter(function (n) { return n.indexOf(v) === 0; });
  }

  /**
   * @param {string} input
   * @param {any} data  the JSON from src/data/terminal.js
   * @param {string[]} [history]
   * @returns {{ lines: Line[], clear: boolean, name: string }}
   */
  function run(input, data, history) {
    var raw = String(input || '').trim();
    var word = raw.split(/\s+/)[0].toLowerCase();
    /** @type {any} */ var aliases = ALIASES;
    var name = aliases[word] || word;
    /** @type {Line[]} */ var out = [];
    if (!raw) return { lines: out, clear: false, name: '' };

    switch (name) {
      case 'help':
        out.push(head('Available commands'));
        COMMANDS.forEach(function (c) { out.push([seg(pad(c[0], 12), 'k'), seg(c[1], 'dim')]); });
        out.push(blank());
        out.push([seg('Tip: ', 'dim'), seg('↑ ↓', 'k'), seg(' recall commands · ', 'dim'), seg('Tab', 'k'), seg(' completes a command', 'dim')]);
        break;
      case 'about':
        out.push(head('About'));
        data.about.forEach(function (/** @type {string} */ l) { out.push([seg(l)]); });
        break;
      case 'whoami':
        out.push([seg(data.whoami, 'accent')]);
        break;
      case 'skills':
        data.skills.forEach(function (/** @type {any} */ d, /** @type {number} */ i) {
          if (i) out.push(blank());
          out.push(head(d.name));
          out.push([seg('  ' + d.tech.join(' · '), 'dim')]);
        });
        break;
      case 'projects':
        out.push(head('Engineering missions'));
        data.projects.forEach(function (/** @type {any} */ p) {
          /** @type {Line} */ var line = [seg(pad(p.code, 6), 'k')];
          line.push(p.url ? { t: p.title, href: p.url } : seg(p.title));
          if (p.status) line.push(seg('  ● ' + p.status, 'ok'));
          out.push(line);
          out.push([seg('      ' + p.kicker + ' · ' + p.role, 'dim')]);
        });
        out.push(blank());
        out.push([seg('Select a title to open its case study.', 'dim')]);
        break;
      case 'experience':
        data.experience.forEach(function (/** @type {any} */ x, /** @type {number} */ i) {
          if (i) out.push(blank());
          out.push([seg(x.when, 'k'), seg('  ' + x.role, 'h')]);
          out.push([seg('  ' + x.org + ', ' + x.place, 'dim')]);
          x.points.forEach(function (/** @type {string} */ p) { out.push([seg('  › ', 'k'), seg(p)]); });
        });
        break;
      case 'education':
        out.push(head('Education'));
        out.push([seg(data.education.degree)]);
        out.push([seg('  ' + data.education.detail, 'dim')]);
        out.push(blank());
        out.push(head('Certifications'));
        data.education.certs.forEach(function (/** @type {string} */ c) { out.push([seg('  › ', 'k'), seg(c)]); });
        break;
      case 'stack':
        data.stack.forEach(function (/** @type {[string, string[]]} */ g) {
          out.push([seg(pad(g[0], 11), 'k'), seg(g[1].join(' · '))]);
        });
        break;
      case 'contact':
        out.push(head('Establish connection'));
        out.push([seg(pad('email', 10), 'k'), { t: data.contact.email, href: 'mailto:' + data.contact.email }]);
        out.push([seg(pad('linkedin', 10), 'k'), { t: data.contact.linkedin.replace(/^https:\/\/(www\.)?/, ''), href: data.contact.linkedin, ext: true }]);
        out.push([seg(pad('github', 10), 'k'), { t: data.contact.github.replace(/^https:\/\//, ''), href: data.contact.github, ext: true }]);
        out.push([seg(pad('resume', 10), 'k'), { t: 'Open the résumé (Google Drive)', href: data.contact.resume, ext: true }]);
        break;
      case 'history':
        if (!history || !history.length) out.push([seg('No commands yet.', 'dim')]);
        else history.forEach(function (h, i) { out.push([seg(pad(String(i + 1), 4), 'dim'), seg(h)]); });
        break;
      case 'clear':
        return { lines: [], clear: true, name: name };
      case 'sudo':
        out.push([seg('Permission denied: this shell is read-only. Try ', 'warn'), seg('help', 'k'), seg('.', 'warn')]);
        break;
      default:
        var near = complete(word);
        out.push([seg('command not found: ', 'warn'), seg(raw.slice(0, 40))]);
        out.push(near.length
          ? [seg('Did you mean ', 'dim'), seg(near[0], 'k'), seg('? Type ', 'dim'), seg('help', 'k'), seg(' for the full list.', 'dim')]
          : [seg('Type ', 'dim'), seg('help', 'k'), seg(' to see what this shell can do.', 'dim')]);
        name = '';
    }
    return { lines: out, clear: false, name: name };
  }

  return { COMMANDS: COMMANDS, NAMES: NAMES, run: run, complete: complete };
});
