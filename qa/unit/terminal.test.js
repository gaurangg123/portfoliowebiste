// Unit tests for the terminal's command logic (src/scripts/terminal-core.js).
// Run: node --test qa/unit/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../../src/scripts/terminal-core.js');
const buildData = require('../../src/data/terminal.js');

const TITLES = {
  'knowledge-portal': 'Enterprise Knowledge Portal', 'business-sheet': 'Business Sheet', 'contract-intelligence': 'AI Legal Contract Intelligence',
  'resume-matching': 'AI Resume Matching', 'data-migration': 'Enterprise Data Migration', 'bug-detailer': 'Bug Detailer', 'web-app-builder': 'Web App Builder',
};
const data = buildData(TITLES);
const text = (r) => r.lines.map((l) => l.map((s) => s.t).join('')).join('\n');

test('every required command exists and answers', () => {
  for (const cmd of ['help', 'about', 'skills', 'projects', 'experience', 'education', 'stack', 'contact', 'clear']) {
    assert.ok(core.NAMES.includes(cmd), `${cmd} is listed`);
    const r = core.run(cmd, data, []);
    if (cmd === 'clear') assert.equal(r.clear, true);
    else assert.ok(r.lines.length > 0, `${cmd} prints something`);
  }
});

test('help lists every command with a description', () => {
  const out = text(core.run('help', data));
  for (const [name, desc] of core.COMMANDS) { assert.match(out, new RegExp(`^${name}\\s`, 'm')); assert.ok(out.includes(desc)); }
});

test('input is trimmed and case-insensitive; aliases resolve', () => {
  assert.equal(core.run('  HELP  ', data).name, 'help');
  assert.equal(core.run('ls', data).name, 'projects');
  assert.equal(core.run('cls', data).clear, true);
  assert.equal(core.run('resume', data).name, 'contact');
});

test('unknown commands say so and suggest a close match', () => {
  const r = core.run('exper', data);
  assert.equal(r.name, '');
  assert.match(text(r), /command not found: exper/);
  assert.match(text(r), /Did you mean experience\?/);
  assert.match(text(core.run('rm -rf /', data)), /command not found/);
});

test('empty input prints nothing', () => {
  assert.deepEqual(core.run('   ', data).lines, []);
});

test('Tab completion: unique prefix, several matches, nothing for spaces', () => {
  assert.deepEqual(core.complete('exp'), ['experience']);
  assert.deepEqual(core.complete('h'), ['help', 'history']);
  assert.deepEqual(core.complete('help me'), []);
  assert.deepEqual(core.complete(''), []);
});

test('projects link only company projects to their case studies', () => {
  const r = core.run('projects', data);
  const links = r.lines.flat().filter((s) => s.href);
  assert.deepEqual(links.map((s) => s.href).sort(), ['work/business-sheet/', 'work/contract-intelligence/', 'work/data-migration/', 'work/knowledge-portal/', 'work/resume-matching/']);
  const out = text(r);
  assert.match(out, /Bug Detailer/);
  assert.match(out, /Live in production/);
  assert.match(out, /Completed/);
});

test('contact uses the email, profiles and the résumé URL unchanged', () => {
  const site = require('../../src/data/site.js');
  const hrefs = core.run('contact', data).lines.flat().filter((s) => s.href).map((s) => s.href);
  assert.ok(hrefs.includes(`mailto:${site.email}`));
  assert.ok(hrefs.includes(site.linkedin));
  assert.ok(hrefs.includes(site.github));
  assert.ok(hrefs.includes('https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing'));
});

test('history lists earlier commands in order', () => {
  assert.match(text(core.run('history', data, [])), /No commands yet/);
  assert.match(text(core.run('history', data, ['help', 'about'])), /1\s+help\n2\s+about/);
});

test('output is plain text segments (never HTML)', () => {
  for (const cmd of core.NAMES) {
    for (const seg of core.run(cmd, data, ['<b>x</b>']).lines.flat()) {
      assert.equal(typeof seg.t, 'string');
      if (seg.href) assert.match(seg.href, /^(mailto:|https:\/\/|work\/)/);
    }
  }
});
