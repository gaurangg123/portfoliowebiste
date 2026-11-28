#!/usr/bin/env node
// Visual QA capture: screenshots of every homepage section and the case studies at the
// nine viewports in the QA brief, plus automatic layout checks.
//   node qa/capture-screenshots.js <outDir> [baseUrl] [--only=desktop|tablet|mobile] [--full]
// Start the preview first: node tools/serve.js 4173
'use strict';
const fs = require('fs');
const path = require('path');
let chromium;
try { ({ chromium } = require('@playwright/test')); } catch { ({ chromium } = require('playwright')); }

const VIEWPORTS = [
  ['desktop', '1920x1080', 1920, 1080], ['desktop', '1440x900', 1440, 900], ['desktop', '1366x768', 1366, 768],
  ['tablet', '1024x768', 1024, 768], ['tablet', '768x1024', 768, 1024],
  ['mobile', '430x932', 430, 932], ['mobile', '390x844', 390, 844], ['mobile', '375x812', 375, 812], ['mobile', '360x800', 360, 800],
];
const SECTIONS = ['about', 'expertise', 'projects', 'experience', 'education', 'architecture', 'query', 'contact'];
const args = process.argv.slice(2);
const OUT = path.resolve(args[0] || 'qa/screenshots');
const BASE = (args[1] && !args[1].startsWith('--') ? args[1] : 'http://127.0.0.1:4173/portfoliowebiste/');
const ONLY = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
const FULL = args.includes('--full');
const EXT = args.includes('--jpg') ? 'jpg' : 'png';

// layout checks run in the page
const checks = () => {
  const vw = document.documentElement.clientWidth;
  const out = { overflowX: document.documentElement.scrollWidth - vw, offRight: [], clipped: [], brokenImg: [], smallTargets: [] };
  const visible = (el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.clipPath !== 'inset(50%)' && s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0 && !el.closest('[hidden], .nav__sheet, .visually-hidden, dialog'); };
  const name = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase()) + (el.id ? '#' + el.id : '');
  document.querySelectorAll('main *, .nav__bar *, footer *').forEach((el) => {
    if (!visible(el) || el.closest('.hero__art, svg, canvas, .contact__signal, .ribbon-wrap, .px__grid--more, .px__grid--lab, .exp__code, .nf__log')) return;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && out.offRight.length < 12) out.offRight.push(name(el) + ' right=' + Math.round(r.right));
  });
  document.querySelectorAll('.btn, .tag, .chip, .filters button, .demo-btn, .px__cats li, .stepper__name, .hero__name, .sec-head__title, .contact__title').forEach((el) => {
    if (!visible(el)) return;
    if (el.scrollWidth > el.clientWidth + 1 && out.clipped.length < 12) out.clipped.push(name(el) + ' ' + el.scrollWidth + '>' + el.clientWidth);
  });
  document.querySelectorAll('img').forEach((img) => { if (img.complete && img.naturalWidth === 0 && visible(img)) out.brokenImg.push(img.currentSrc || img.src); });
  document.querySelectorAll('main a, main button, .nav a, .nav button, footer a').forEach((el) => {
    if (!visible(el) || el.closest('p, .arch-uses, .cs-links span')) return;
    const r = el.getBoundingClientRect();
    if ((r.height < 24 || r.width < 24) && out.smallTargets.length < 8) out.smallTargets.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  });
  return out;
};

(async () => {
  const browser = await chromium.launch();
  const report = {};
  for (const [kind, label, w, h] of VIEWPORTS) {
    if (ONLY && kind !== ONLY) continue;
    const dir = path.join(OUT, kind);
    fs.mkdirSync(dir, { recursive: true });
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    const shot = (name, opts) => page.screenshot({ path: path.join(dir, `${label}-${name}.${EXT}`), type: EXT === 'jpg' ? 'jpeg' : 'png', quality: EXT === 'jpg' ? 78 : undefined, ...opts });
    await shot('01-hero');
    // scroll through once so every section has settled in
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.7)) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    });
    await page.waitForTimeout(900);
    for (const [i, id] of SECTIONS.entries()) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ block: 'start', behavior: 'instant' }), id);
      await page.waitForTimeout(450);
      // page coordinates (the clip of a full-page shot is measured from the top of the page)
      const box = await page.evaluate((sid) => { const r = document.getElementById(sid).getBoundingClientRect(); return { y: r.top + window.scrollY, height: r.height }; }, id);
      await shot(`${String(i + 2).padStart(2, '0')}-${id}`, { clip: { x: 0, y: Math.max(0, box.y), width: w, height: Math.min(box.height, h * 2.6) }, fullPage: true });
    }
    if (FULL) await shot('00-full', { fullPage: true });
    report[label] = { ...(await page.evaluate(checks)), errors };
    // a case study at the same size
    await page.goto(BASE + 'work/knowledge-portal/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await shot('10-case-head');
    report[label].case = await page.evaluate(checks);
    await page.close();
  }
  fs.writeFileSync(path.join(OUT, 'layout-checks.json'), JSON.stringify(report, null, 2));
  for (const [k, v] of Object.entries(report)) {
    const issues = [v.overflowX > 0 && `overflowX ${v.overflowX}`, v.offRight.length && `off-right: ${v.offRight.join(', ')}`, v.clipped.length && `clipped: ${v.clipped.join(', ')}`, v.brokenImg.length && `broken: ${v.brokenImg.join(', ')}`, v.smallTargets.length && `small: ${v.smallTargets.join(', ')}`, v.errors.length && `errors: ${v.errors.join(' | ')}`, v.case.overflowX > 0 && `case overflowX ${v.case.overflowX}`, v.case.offRight.length && `case off-right: ${v.case.offRight.join(', ')}`].filter(Boolean);
    console.log(k.padEnd(10), issues.length ? issues.join('\n           ') : 'ok');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
