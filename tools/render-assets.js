#!/usr/bin/env node
// Renders DataForge's original visual assets. Run after `node tools/build.js`:
//   node tools/render-assets.js
// Writes SVG sources and their raster renders (WebP; JPEG for the social card; PNG
// for icons) into assets/<folder>/. Uses Chromium through Playwright so text is set
// in the site's own fonts. Nothing is downloaded; every image is drawn here.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('@playwright/test')); } catch { ({ chromium } = require('playwright')); }

const ROOT = path.resolve(__dirname, '..');
const covers = require('./art/covers.js');
const diagrams = require('./art/diagrams.js');
const { standalone } = require('../src/components/motifs.js');
const { logomark } = require('../src/components/icons.js');
const site = require('../src/data/site.js');

const out = (rel) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };
const save = (rel, data) => { fs.writeFileSync(out(rel), data); console.log('wrote', rel); };
const webp = (png, rel, width, q = 80) => {
  execFileSync('convert', [png, '-resize', `${width}x`, '-strip', '-define', 'webp:method=6', '-quality', String(q), out(rel)]);
  console.log('wrote', rel, fs.statSync(out(rel)).size, 'bytes');
};
const TYPES = { '.woff2': 'font/woff2', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const FONTS = `@font-face{font-family:'Space Grotesk';font-weight:500 700;src:url(/assets/fonts/space-grotesk-latin-var.woff2) format('woff2')}
@font-face{font-family:'Inter';font-weight:400 700;src:url(/assets/fonts/inter-latin-var.woff2) format('woff2')}
@font-face{font-family:'JetBrains Mono';font-weight:400 600;src:url(/assets/fonts/jetbrains-mono-latin-var.woff2) format('woff2')}
html,body{margin:0;background:#05070D}`;

(async () => {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'df-art-'));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // serve the repository at http://art.local/ so pages can load fonts and the script bundle
  let html = '';
  await page.route('http://art.local/**', (route) => {
    const u = new URL(route.request().url());
    if (u.pathname === '/render.html') return route.fulfill({ contentType: 'text/html', body: html });
    const f = path.join(ROOT, decodeURIComponent(u.pathname));
    if (!f.startsWith(ROOT) || !fs.existsSync(f)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: TYPES[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  /** render an HTML body at a size and screenshot it */
  const shot = async (body, w, h, file, type = 'png', quality) => {
    html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}</style></head><body>${body}</body></html>`;
    await page.setViewportSize({ width: w, height: h });
    await page.goto('http://art.local/render.html', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({ path: file, type, quality, clip: { x: 0, y: 0, width: w, height: h } });
  };

  /* ---------- project covers ---------- */
  for (const [slug, draw] of Object.entries(covers)) {
    const svg = draw();
    save(`assets/projects/${slug}.svg`, svg);
    const png = path.join(tmp, slug + '.png');
    await shot(svg, 1600, 1000, png);
    webp(png, `assets/projects/${slug}-1600.webp`, 1600, 78);
    webp(png, `assets/projects/${slug}-800.webp`, 800, 80);
  }

  /* ---------- domain motifs ---------- */
  const DOMAINS = [['data-engineering', 'pipeline', '#38BDF8'], ['ai-ml', 'neural', '#8B5CF6'], ['automation', 'workflow', '#34D399'], ['analytics', 'chart', '#FBBF24']];
  for (const [folder, motif, tone] of DOMAINS) {
    const svg = standalone(motif, tone);
    save(`assets/${folder}/${motif}.svg`, svg);
    const png = path.join(tmp, motif + '.png');
    await shot(`<div style="width:800px;height:440px">${svg.replace('width="800" height="440"', 'width="800" height="440" style="display:block"')}</div>`, 800, 440, png);
    webp(png, `assets/${folder}/${motif}.webp`, 800, 82);
  }

  /* ---------- diagrams and backgrounds ---------- */
  const ref = diagrams.reference();
  save('assets/diagrams/reference-architecture.svg', ref);
  await shot(ref, 1700, 620, path.join(tmp, 'ref.png'));
  webp(path.join(tmp, 'ref.png'), 'assets/diagrams/reference-architecture.webp', 1700, 82);
  save('assets/backgrounds/grid.svg', diagrams.grid());
  save('assets/backgrounds/glow.svg', diagrams.glow());

  /* ---------- hero: still frames of the live lattice (same seed and code as the page) ---------- */
  const lattice = (w, h) => `<div style="position:relative;width:${w}px;height:${h}px;background:#05070D"><canvas data-lattice style="display:block;width:100%;height:100%"></canvas></div><script src="/assets/js/dataforge.js"></script>`;
  await shot(lattice(1600, 1000), 1600, 1000, path.join(tmp, 'lattice.png'));
  webp(path.join(tmp, 'lattice.png'), 'assets/hero/lattice-poster.webp', 1600, 76);
  await shot(lattice(1200, 1200).replace('width:1200px', 'width:1200px;margin-left:-260px'), 1200, 1200, path.join(tmp, 'lattice-sq.png'));
  webp(path.join(tmp, 'lattice-sq.png'), 'assets/hero/lattice-square.webp', 1200, 78);

  /* ---------- social card (1200×630 JPEG) ---------- */
  await shot(`<div style="position:relative;width:1200px;height:630px;overflow:hidden;background:#05070D;font-family:Inter">
    <div style="position:absolute;inset:0;background:linear-gradient(rgba(148,163,184,.06) 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,rgba(148,163,184,.06) 1px,transparent 1px) 0 0/48px 48px"></div>
    <div style="position:absolute;left:110px;top:-45px;width:1100px;height:720px"><canvas data-lattice style="display:block;width:100%;height:100%"></canvas></div>
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,#05070D 0%,rgba(5,7,13,.85) 42%,rgba(5,7,13,0) 75%)"></div>
    <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px;color:#F8FAFC;font:700 22px/1 'Space Grotesk';letter-spacing:.08em;text-transform:uppercase">${logomark('og', 'og-mark').replace('class="og-mark"', 'class="og-mark" width="40" height="40"')}DataForge</div>
    <div style="position:absolute;left:72px;top:170px;color:#F8FAFC;font:700 104px/.9 'Space Grotesk';letter-spacing:-.05em;text-transform:uppercase">Gaurang<br>Ashava.</div>
    <div style="position:absolute;left:72px;top:390px;font:600 44px/1.1 'Space Grotesk';letter-spacing:-.03em;background:linear-gradient(100deg,#38BDF8,#818CF8 55%,#A78BFA);-webkit-background-clip:text;color:transparent">${site.tagline}.</div>
    <div style="position:absolute;left:72px;top:478px;color:#94A3B8;font:500 22px/1.4 'JetBrains Mono'">Data Engineering · AI &amp; ML · Automation · Analytics</div>
    <div style="position:absolute;left:72px;bottom:44px;color:#94A3B8;font:500 18px/1 'JetBrains Mono'">${site.role} · ${site.company}</div>
  </div><script src="/assets/js/dataforge.js"></script>`, 1200, 630, out('assets/og.jpg'), 'jpeg', 88);
  console.log('wrote assets/og.jpg', fs.statSync(out('assets/og.jpg')).size, 'bytes');

  /* ---------- icons ---------- */
  const mark = logomark('fav', 'logomark').replace('class="logomark"', 'xmlns="http://www.w3.org/2000/svg" width="32" height="32"').replace(' aria-hidden="true" focusable="false"', '');
  save('assets/icons/favicon.svg', mark);
  save('assets/icons/logomark.svg', mark.replace('width="32" height="32"', 'width="256" height="256"'));
  await shot(`<div style="width:32px;height:32px">${mark}</div>`, 32, 32, out('assets/icons/favicon-32.png'));
  await shot(`<div style="display:grid;place-items:center;width:180px;height:180px;background:#05070D">${mark.replace('width="32" height="32"', 'width="132" height="132"')}</div>`, 180, 180, out('assets/icons/apple-touch-icon.png'));
  console.log('wrote assets/icons/favicon-32.png, apple-touch-icon.png');

  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
})().catch((e) => { console.error(e); process.exit(1); });
