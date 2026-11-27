// Query the Engineer: every answer comes from the portfolio's data, links only to places
// the data names, and says so when the portfolio doesn't cover a question.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

global.window = {};
require(path.join(ROOT, 'assets/walkthroughs/demos.js'));
const DEMOS = global.window.PortfolioDemos;
delete global.window;
const { PROJECTS, EXPERIMENT_TITLES } = require('../../src/data/projects.js');
const site = require('../../src/data/site.js');
const TITLES = { ...EXPERIMENT_TITLES };
for (const p of PROJECTS) if (DEMOS[p.slug]) TITLES[p.slug] = DEMOS[p.slug].title;
const kb = require('../../src/data/query.js')(TITLES);
const { answer } = require('../../src/scripts/query-engine.js');

const text = (a) => [a.title, ...a.blocks.flatMap((b) => (b.type === 'p' ? [b.text] : b.type === 'tags' ? b.items : b.items.map((i) => `${i.label || ''} ${i.text}`)))].join(' \n ');
const hrefs = (a) => [...a.blocks.flatMap((b) => (b.type === 'list' ? b.items.map((i) => i.href).filter(Boolean) : [])), ...a.links.map((l) => l.href)];
const ALLOWED = new Set([
  ...PROJECTS.filter((p) => p.type === 'Company project').map((p) => `work/${p.slug}/`),
  ...site.sections.map(([id]) => `#${id}`), '#projects',
  `mailto:${site.email}`, site.linkedin, site.github, site.resume,
]);

test('each suggested question is answered, on topic', () => {
  const expect = [
    ['tata', /Tata Technologies/], ['category', /Enterprise Data Migration/], ['tech', /Snowflake Ascent/], ['category', /AI Legal Contract Intelligence/],
    ['approach', /Understand the problem/], ['skills', /Databricks/], ['journey', /Foundation/], ['contact', /gaurangashava@gmail\.com/],
  ];
  kb.suggestions.forEach((q, i) => {
    const a = answer(q, kb);
    assert.equal(a.matched, true, q);
    assert.equal(a.intent, expect[i][0], q);
    assert.match(text(a), expect[i][1], q);
  });
});

test('links come only from the portfolio\'s own data', () => {
  const questions = kb.suggestions.concat(['Tell me about Bug Detailer', 'resume matching', 'power bi', 'What did you study?', 'hello', 'nonsense question xyz', 'https://evil.example', '<a href="javascript:alert(1)">x</a>']);
  for (const q of questions) for (const h of hrefs(answer(q, kb))) assert.ok(ALLOWED.has(h), `${q}: ${h}`);
});

test('the question is never echoed into an answer', () => {
  for (const evil of ['<img src=x onerror=alert(1)>', '<a href="javascript:alert(2)">Snowflake</a>']) {
    const a = answer(evil, kb);
    assert.doesNotMatch(JSON.stringify(a), /onerror|javascript:|<img|<a /, evil);
  }
  assert.equal(answer('<img src=x onerror=alert(1)>', kb).matched, false);
});

test('unknown topics are declined, not guessed', () => {
  for (const q of ['Do you know Kubernetes?', 'What is your salary?', 'Tell me a joke']) {
    const a = answer(q, kb);
    assert.equal(a.matched, false, q);
    assert.equal(a.title, 'Not in this portfolio');
  }
});

test('technology answers cite where the technology appears', () => {
  const snow = text(answer('What is your experience with Snowflake?', kb));
  for (const must of ['Tata Technologies', 'Enterprise Data Migration', 'Snowflake foundational badges', 'Snowflake Ascent', 'Data Engineering']) assert.match(snow, new RegExp(must), must);
  assert.equal(answer('power bi', kb).title, 'Experience with Power BI');
  assert.equal(answer('SQL Server experience', kb).title, 'Experience with Microsoft SQL Server');
  assert.equal(answer('Can I see your resume?', kb).intent, 'contact');
  assert.equal(answer('How does resume matching work?', kb).title, 'Project · AI Resume Matching');
});

test('answers carry no invented numbers', () => {
  for (const q of kb.suggestions) assert.doesNotMatch(text(answer(q, kb)).replace(/10% off/g, ''), /\d+(\.\d+)?\s?%/, q);
});

test('the résumé link is the supplied Drive viewing URL', () => {
  assert.ok(hrefs(answer('How can I contact you?', kb)).includes('https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing'));
});
