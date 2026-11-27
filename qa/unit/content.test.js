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

test('no contact form: the only form is the Query page\'s question box, which sends nothing', () => {
  for (const page of pages) assert.doesNotMatch(built(page), /<form\b/, page);
  const q = built('query-engineer/index.html');
  const forms = [...q.matchAll(/<form\b[^>]*>/g)].map((m) => m[0]);
  assert.equal(forms.length, 1);
  assert.match(forms[0], /data-qe-form/);
  assert.doesNotMatch(forms[0], /action=|method=/);
});

test('the old terminal is gone; Query the Engineer is its own page', () => {
  for (const page of pages) assert.doesNotMatch(built(page), /data-term|id="terminal"|href="[^"]*#terminal"/i, page);
  const home = built('index.html');
  assert.match(home, /href="query-engineer\/"[^>]*>Explore Query the Engineer/);
  assert.match(built('query-engineer/index.html'), /not an AI chatbot/);
  assert.match(built('sitemap.xml'), /query-engineer\//);
});

test('no link or fragment points at #top', () => {
  for (const page of pages) assert.doesNotMatch(built(page), /href="[^"]*#top"|id="top"/, page);
});

test('the four disciplines list exactly the approved tools', () => {
  assert.deepEqual(Object.fromEntries(domains.map((d) => [d.id, d.tech])), {
    data: ['Snowflake', 'Databricks', 'Python', 'SQL', 'ETL / ELT', 'Data Pipelines', 'Data Warehousing'],
    ai: ['Machine Learning', 'Generative AI', 'Large Language Models', 'Retrieval-Augmented Generation', 'AI Agents', 'Model Evaluation'],
    automation: ['Workflow Automation', 'API Integrations', 'Intelligent Assistants', 'Process Automation'],
    analytics: ['Power BI', 'Tableau', 'DAX', 'Business Intelligence', 'Data Storytelling'],
  });
});

test('the architecture uses the agreed description and only supported technologies', () => {
  const arch = require('../../src/data/architecture.js');
  assert.equal(arch.note, 'An illustrative view of how data engineering, AI and automation can work together to transform raw information into actionable insights.');
  assert.equal(arch.stages.length, 7);
  const tech = arch.stages.flatMap((s) => s.tech);
  for (const t of ['Spark', 'Kafka', 'Airflow', 'Kubernetes', 'dbt', 'Prompt Engineering', 'Data Modeling']) assert.ok(!tech.includes(t), t);
});

test('the engineering workflow: five stages, the agreed lines, documented examples only', () => {
  const wf = require('../../src/data/workflow.js');
  assert.equal(wf.stages.length, 5);
  assert.deepEqual(wf.stages.map((s) => s.name), ['Understand the problem', 'Design the system', 'Build & engineer', 'Test & validate', 'Deploy & improve']);
  const lines = [
    'Understand business requirements, data sources, constraints and desired outcomes',
    'Plan the architecture, technology stack, data flow and implementation strategy',
    'Develop data pipelines, applications, AI capabilities and automation workflows',
    'Validate functionality, data quality, performance, accuracy and reliability',
    'Deploy the solution, monitor its performance and continuously improve it',
  ];
  wf.stages.forEach((s, i) => assert.ok(s.what.startsWith(lines[i]), s.key));
  assert.match(wf.note, /not every activity applies to every project/i);
  const slugs = PROJECTS.map((p) => p.slug);
  const allowed = new Set([...domains.flatMap((d) => d.tech), 'SQL', 'Python', 'Requirement documents', 'Snowflake', 'ETL/ELT', 'ETL / ELT', 'Data Pipelines', 'Data Warehousing',
    'Databricks', 'Generative AI', 'LLMs', 'RAG', 'AI Agents', 'Model Evaluation', 'Testing and debugging', 'Stakeholder feedback', 'Iterative releases', 'Documentation']);
  for (const s of wf.stages) {
    for (const t of s.tools) assert.ok(allowed.has(t), `${s.key}: ${t}`);
    const [, link] = s.example;
    assert.ok(slugs.some((slug) => link.includes(slug)), `${s.key}: example links a documented project`);
  }
  assert.doesNotMatch(JSON.stringify(wf), /\d+(\.\d+)?\s?%/, 'no percentage claims');
});
