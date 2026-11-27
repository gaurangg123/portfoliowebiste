// Text contrast for both themes, read from the design tokens themselves
// (src/styles/tokens.css), so a colour change that breaks WCAG AA fails here.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
/** the hex tokens declared in one block, e.g. ':root {' or ':root[data-theme="light"] {' */
const block = (selector) => {
  const start = css.indexOf(selector + ' {');
  assert.ok(start >= 0, `missing ${selector}`);
  const body = css.slice(start, css.indexOf('\n}', start));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\b/g)].map((m) => [m[1], m[2]]));
};
const dark = block(':root');
const light = { ...dark, ...block(':root[data-theme="light"]') };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

for (const [name, t] of [['dark', dark], ['light', light]]) {
  test(`${name} theme: text, links and accents meet WCAG AA on every surface`, () => {
    for (const bg of ['bg-0', 'bg-1', 'card', 'elev']) {
      assert.ok(t[bg], `${name}: --${bg} is a hex colour`);
      for (const fg of ['text', 'text-2', 'cyan', 'violet-tx', 'green', 'amber']) {
        assert.ok(t[fg], `${name}: --${fg} is a hex colour`);
        const r = ratio(t[fg], t[bg]);
        assert.ok(r >= 4.5, `${name}: --${fg} ${t[fg]} on --${bg} ${t[bg]} is ${r.toFixed(2)}:1`);
      }
    }
    // text on the accent fill (primary buttons)
    const onAccent = ratio(t['on-accent'], t.cyan);
    assert.ok(onAccent >= 4.5, `${name}: --on-accent on --cyan is ${onAccent.toFixed(2)}:1`);
  });
}
