// Content guardrails: the rules agreed with the owner, checked on every run, so a
// later edit can't quietly add an unverified claim. Run: node --test qa/unit/
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const site = require('../../src/data/site.js');
const { PROJECTS } = require('../../src/data/projects.js');
const domains = require('../../src/data/domains.js');
const roles = require('../../src/data/experience.js');
const edu = require('../../src/data/education.js');

const ROOT = path.resolve(__dirname, '../..');
const RESUME = 'https://drive.google.com/file/d/1LbktI3_wzj6RZ04ig9SzPOV6p41pssqJ/view?usp=sharing';
const built = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const pages = ['index.html', '404.html', ...PROJECTS.filter((p) => p.type === 'Company project').map((p) => `work/${p.slug}/index.html`)];

test('the résumé link is the supplied Drive viewing URL, everywhere', () => {
  assert.equal(site.resume, RESUME);
  for (const page of pages) {
    const hrefs = [...built(page).matchAll(/href="(https:\/\/drive\.google\.com[^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
    assert.ok(hrefs.length > 0, `${page} links the résumé`);
    for (const h of hrefs) assert.equal(h, RESUME, `${page}: ${h}`);
    assert.doesNotMatch(built(page), /export=download|uc\?id=/, `${page}: no forced-download link`);
    assert.doesNotMatch(built(page), /<iframe[^>]+drive\.google/, `${page}: the Drive viewer is not embedded`);
  }
});

test('the designation and education facts are the verified ones', () => {
  assert.equal(site.role, 'GET – Data and AI Engineer');
  assert.equal(roles[0].role, 'GET – Data and AI Engineer');
  assert.equal(roles[0].org, 'Tata Technologies');
  assert.equal(edu.degree.cgpa, '8.68');
  assert.equal(edu.degree.specialization, 'Big Data Analytics');
  assert.equal(edu.certifications.length, 2);
});

test('statuses are only the confirmed ones', () => {
  const status = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.status && p.status[1]]));
  assert.deepEqual(status, {
    'knowledge-portal': null, 'business-sheet': null, 'contract-intelligence': null,
    'resume-matching': 'Live in production', 'data-migration': 'Completed', 'bug-detailer': null, 'web-app-builder': null,
  });
});

test('no invented metrics, percentages, dates or UAT wording in project content', () => {
  const words = JSON.stringify(PROJECTS) + JSON.stringify(domains) + JSON.stringify(roles);
  // the one percentage on the site is the sample "Members get 10% off" input of an experiment
  assert.doesNotMatch(words.replace(/10% off/g, ''), /\d+(\.\d+)?\s?%/, 'no percentage claims');
  assert.doesNotMatch(words, /\bUAT\b|user acceptance/i, 'no UAT wording');
  assert.doesNotMatch(words, /\b(accuracy|adoption|users served|saved \d|hours saved|ROI)\b/i, 'no impact metrics');
  assert.doesNotMatch(words, /\b(deployed on|went live on|launched in) \w+ \d{4}/i, 'no production dates');
  for (const page of pages) assert.doesNotMatch(built(page), /skill[^<]{0,20}\d{2,3}\s?%|proficiency/i, `${page}: no skill percentages`);
});

test('only Data Migration lists technologies; the rest say they are unconfirmed', () => {
  for (const p of PROJECTS.filter((x) => x.type === 'Company project')) {
    if (p.slug === 'data-migration') assert.ok(Array.isArray(p.tech) && p.tech.includes('Snowflake'));
    else assert.equal(p.tech, null, p.slug);
  }
  assert.match(built('work/knowledge-portal/index.html'), /Stack details not yet published/);
});

test('company projects claim no public repository or live demo', () => {
  for (const p of PROJECTS.filter((x) => x.type === 'Company project')) {
    assert.equal(p.repo, null); assert.equal(p.demo, null);
    const html = built(`work/${p.slug}/index.html`);
    assert.match(html, /Repository<\/b>Not public/);
    assert.doesNotMatch(html, /github\.com\/[^"]*\/(knowledge|business|contract|resume|data-migration)/i);
  }
});

test('walkthroughs are never presented as recordings and never autoplay', () => {
  for (const page of pages) {
    const html = built(page);
    assert.doesNotMatch(html, /screen recording|real recording|live product/i, page);
    assert.doesNotMatch(html, /<(video|audio)[^>]*\bautoplay\b/i, page);
  }
  assert.match(built('index.html'), /<audio id="papercut" data-src="[^"]+" preload="none"><\/audio>/, 'Papercut is not requested until Play');
});

test('there is no contact form without a working back end', () => {
  const html = built('index.html');
  const forms = [...html.matchAll(/<form\b[^>]*>/g)].map((m) => m[0]);
  assert.deepEqual(forms.length, 1);
  assert.match(forms[0], /data-term-form/, 'the only form is the terminal prompt');
  assert.doesNotMatch(html, /<form[^>]+action=/);
});
