// Project cover art: original SVG illustrations (1600×1000), one per mission.
// They depict what each project does, with sample labels only. They are not
// screenshots and are labelled "Illustration" wherever they appear.
// Rendered to WebP by tools/render-assets.js; the SVG sources are kept in assets/projects/.
const { ICON_PATHS } = require('../../src/components/icons.js');

const C = { bg: '#0A1020', card: '#101827', elev: '#151F30', line: 'rgba(148,163,184,0.22)', line2: 'rgba(148,163,184,0.4)', text: '#F8FAFC', text2: '#94A3B8', cyan: '#38BDF8', violet: '#8B5CF6', violetTx: '#A78BFA', green: '#34D399', amber: '#FBBF24', red: '#F87171' };
const F = { display: "'Space Grotesk', sans-serif", sans: "'Inter', sans-serif", mono: "'JetBrains Mono', monospace" };

const t = (x, y, s, { size = 30, fill = C.text, weight = 500, font = F.sans, anchor = 'start', ls = 0, op = 1 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}"${op < 1 ? ` opacity="${op}"` : ''}${font === F.mono ? ' style="white-space:pre;font-variant-ligatures:none"' : ''}>${s}</text>`;
const box = (x, y, w, h, { r = 22, fill = C.card, stroke = C.line2, sw = 2, extra = '' } = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${extra}/>`;
const ico = (name, x, y, size, color, sw = 1.75) => `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</g>`;
const bar = (x, y, w, h = 14, fill = 'rgba(148,163,184,0.35)', r = 7) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const glow = (x, y, r, c, op = 0.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#glow-${c})" opacity="${op}"/>`;

const frame = (code, title, tone, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(148,163,184,0.07)" stroke-width="1"/></pattern>
    ${['cyan', 'violet', 'green', 'amber'].map((k) => `<radialGradient id="glow-${k}"><stop offset="0" stop-color="${C[k]}" stop-opacity="0.55"/><stop offset="1" stop-color="${C[k]}" stop-opacity="0"/></radialGradient>`).join('')}
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}"/><stop offset="1" stop-color="${C.violetTx}"/></linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.7" stop-color="${C.bg}" stop-opacity="0"/><stop offset="1" stop-color="${C.bg}" stop-opacity="0.55"/></linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="${C.bg}"/>
  <rect width="1600" height="1000" fill="url(#grid)"/>
  ${glow(1250, 160, 620, tone, 0.35)}${glow(260, 900, 520, tone === 'cyan' ? 'violet' : 'cyan', 0.22)}
  ${body}
  <rect width="1600" height="1000" fill="url(#fade)"/>
  <title>${code} · ${title} — illustration with sample content</title>
</svg>`;

/* M-01 · Knowledge Portal: six capabilities around one platform, four roles below */
function knowledgePortal() {
  const caps = [['search', 'Discover'], ['file', 'Request'], ['check', 'Approve'], ['ai', 'Assistant'], ['bi', 'Leaderboard'], ['automation', 'Share']];
  const cx = 800, cy = 480, R = 330;
  const pos = caps.map((_, i) => { const a = (-90 + i * 60) * Math.PI / 180; return [cx + Math.cos(a) * R * 1.55, cy + Math.sin(a) * R * 0.95]; });
  const hex = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90) * Math.PI / 180; return `${(cx + 150 * Math.cos(a)).toFixed(1)},${(cy + 150 * Math.sin(a)).toFixed(1)}`; }).join(' ');
  return frame('M-01', 'KNOWLEDGE PORTAL', 'cyan', `
    ${pos.map(([x, y], i) => `<path d="M${cx} ${cy} Q ${(cx + x) / 2 + (i % 2 ? 40 : -40)} ${(cy + y) / 2} ${x} ${y}" fill="none" stroke="${i === 3 ? C.violet : C.cyan}" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="${i === 3 ? '0' : '10 12'}"/>`).join('')}
    ${glow(cx, cy, 260, 'cyan', 0.6)}
    <polygon points="${hex}" fill="${C.elev}" stroke="url(#brand)" stroke-width="4"/>
    ${t(cx, cy - 6, 'KNOWLEDGE', { size: 38, font: F.display, weight: 700, anchor: 'middle', ls: 2 })}
    ${t(cx, cy + 40, 'PORTAL', { size: 38, font: F.display, weight: 700, anchor: 'middle', ls: 2 })}
    ${pos.map(([x, y], i) => { const [k, name] = caps[i]; const tone = i === 3 ? C.violetTx : C.cyan; return `${box(x - 160, y - 62, 320, 124, { r: 30, fill: C.card, stroke: i === 3 ? 'rgba(139,92,246,0.6)' : 'rgba(56,189,248,0.45)' })}
      ${ico(k, x - 130, y - 26, 52, tone)}
      ${t(x - 58, y + 14, name, { size: 38, weight: 600 })}`; }).join('')}
    ${['Viewer', 'User', 'Admin', 'Champion'].map((r, i) => `${box(430 + i * 190, 872, 170, 60, { r: 30, fill: 'rgba(16,24,39,0.95)', stroke: C.line2 })}${t(515 + i * 190, 911, r, { size: 26, font: F.mono, anchor: 'middle', fill: C.text })}`).join('')}
  `);
}

/* M-02 · Business Sheet: a spreadsheet becomes a chart, and a chatbot explains it */
function businessSheet() {
  const REV = [64, 70, 68, 76, 81, 79, 88, 96, 92, 108, 120, 132];
  const rows = ['FY2014', 'FY2015', 'FY2016', 'FY2017', '⋮', 'FY2024', 'Current FY'];
  const vals = ['64', '70', '68', '76', '⋮', '120', '132'];
  return frame('M-02', 'BUSINESS SHEET', 'amber', `
    ${box(70, 150, 470, 640, { fill: C.card })}
    <rect x="70" y="150" width="470" height="70" rx="22" fill="${C.elev}"/>
    <rect x="96" y="172" width="26" height="30" rx="4" fill="#059669"/>${t(136, 196, 'sample-data.xlsx', { size: 24, font: F.mono, fill: C.text2 })}
    ${t(110, 270, 'FY', { size: 24, font: F.mono, fill: C.text2, weight: 600 })}${t(500, 270, 'Revenue', { size: 24, font: F.mono, fill: C.text2, weight: 600, anchor: 'end' })}
    ${rows.map((r, i) => `<path d="M90 ${300 + i * 68}H520" stroke="${C.line}" stroke-width="2"/>${t(110, 346 + i * 68, r, { size: 28, font: F.mono })}${t(500, 346 + i * 68, vals[i], { size: 28, font: F.mono, anchor: 'end', fill: i === 6 ? C.amber : C.text })}`).join('')}
    <path d="M570 470 H 650" stroke="${C.amber}" stroke-width="4" stroke-linecap="round"/><path d="M636 452 L 660 470 L 636 488" fill="none" stroke="${C.amber}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    ${box(690, 150, 840, 470, { fill: C.card })}
    ${t(730, 214, 'Revenue · Org A · LOB 2', { size: 30, weight: 600 })}${t(1490, 214, 'Sample data', { size: 22, font: F.mono, fill: C.text2, anchor: 'end' })}
    ${['', '', ''].map((_, i) => `<path d="M730 ${300 + i * 90}H1490" stroke="${C.line}" stroke-width="1.5"/>`).join('')}
    ${REV.map((v, i) => { const h = v / 132 * 300; return `<rect x="${740 + i * 62}" y="${580 - h}" width="40" height="${h}" rx="6" fill="${C.amber}" fill-opacity="${i === 0 || i === 11 ? 1 : 0.35}"/>`; }).join('')}
    <path d="M730 580H1490" stroke="${C.line2}" stroke-width="2"/>
    ${box(690, 660, 840, 230, { fill: C.elev, stroke: 'rgba(251,191,36,0.4)' })}
    ${t(730, 720, 'Chatbot · explains the metrics', { size: 24, font: F.mono, fill: C.amber, weight: 600 })}
    ${box(730, 746, 560, 56, { r: 28, fill: 'rgba(148,163,184,0.12)', stroke: 'none' })}${t(756, 782, 'What does growth mean in this chart?', { size: 26 })}
    ${box(730, 818, 760, 56, { r: 28, fill: 'rgba(251,191,36,0.14)', stroke: 'none' })}${t(756, 854, 'Change across the selected years, as a share of the first.', { size: 26, fill: C.text })}
  `);
}

/* M-03 · Contract Intelligence: a contract, annotated, beside what was extracted */
function contractIntelligence() {
  const lines = [[150, 520], [150, 600], [150, 470], [150, 560], [150, 380]];
  return frame('M-03', 'CONTRACT INTELLIGENCE', 'violet', `
    ${box(90, 140, 720, 800, { fill: '#F8FAFC', stroke: 'none', r: 18 })}
    ${t(140, 220, 'Master services agreement', { size: 36, font: F.display, weight: 700, fill: '#0A1020' })}
    ${t(140, 262, 'sample-services-agreement.pdf · fictional', { size: 20, font: F.mono, fill: '#475569' })}
    <rect x="138" y="300" width="300" height="34" rx="6" fill="rgba(56,189,248,0.35)"/>${bar(450, 310, 300, 14, '#CBD5E1')}
    ${lines.map(([x, w], i) => bar(x, 360 + i * 40, w, 14, '#CBD5E1')).join('')}
    <rect x="138" y="574" width="560" height="36" rx="6" fill="rgba(139,92,246,0.32)"/>
    ${bar(150, 585, 520, 14, '#7C3AED')}
    ${[0, 1, 2].map((i) => bar(150, 640 + i * 40, [600, 480, 540][i], 14, '#CBD5E1')).join('')}
    <path d="M150 790H640" stroke="#38BDF8" stroke-width="6" stroke-linecap="round"/>
    ${[0, 1].map((i) => bar(150, 820 + i * 40, [560, 420][i], 14, '#CBD5E1')).join('')}
    <path d="M760 318 C 860 318 880 250 960 250" fill="none" stroke="${C.cyan}" stroke-width="3" stroke-dasharray="8 8"/>
    <path d="M700 592 C 830 592 860 520 960 520" fill="none" stroke="${C.violet}" stroke-width="3" stroke-dasharray="8 8"/>
    <path d="M640 790 C 820 790 860 760 960 760" fill="none" stroke="${C.cyan}" stroke-width="3" stroke-dasharray="8 8"/>
    ${box(960, 150, 560, 760, { fill: C.card })}
    ${t(1000, 214, 'EXTRACTED INFORMATION', { size: 22, font: F.mono, weight: 600, fill: C.text2, ls: 3 })}
    ${[['Parties', '2', C.cyan], ['Effective', '1 Apr 2025', C.cyan], ['Term', '24 months', C.cyan]].map(([k, v, c], i) => `${box(1000, 240 + i * 92, 480, 76, { r: 16, fill: C.elev, stroke: 'rgba(56,189,248,0.35)' })}${t(1030, 288 + i * 92, k, { size: 26, fill: C.text2 })}${t(1450, 288 + i * 92, v, { size: 28, weight: 600, anchor: 'end', fill: c === C.cyan ? C.text : c })}`).join('')}
    ${box(1000, 530, 480, 120, { r: 16, fill: 'rgba(139,92,246,0.14)', stroke: 'rgba(139,92,246,0.55)' })}
    ${t(1030, 576, 'Obligation · Supplier', { size: 24, font: F.mono, fill: C.violetTx, weight: 600 })}${t(1030, 620, 'Monthly service report', { size: 30, weight: 600 })}
    ${box(1000, 680, 480, 120, { r: 16, fill: C.elev, stroke: C.line2 })}
    ${t(1030, 726, 'Clauses', { size: 24, font: F.mono, fill: C.text2, weight: 600 })}${t(1030, 770, '7 Term · 9 Reporting · 12 Termination', { size: 26 })}
    ${t(1000, 860, 'For human review', { size: 24, font: F.mono, fill: C.green, weight: 600 })}
  `);
}

/* M-04 · Resume Matching: requirements beside evidence, row by row */
function resumeMatching() {
  const rows = [['SQL', 'Required', 'Wrote SQL reports', 'yes'], ['Python', 'Required', 'Data-cleaning scripts', 'yes'], ['2+ years analytics', 'Required', '3 years, junior analyst', 'yes'], ['Dashboards', 'Preferred', 'Spreadsheet charts', 'part']];
  return frame('M-04', 'RESUME MATCHING', 'violet', `
    ${box(80, 150, 620, 760, { fill: C.card })}${t(120, 220, 'ROLE REQUIREMENTS', { size: 22, font: F.mono, weight: 600, fill: C.text2, ls: 3 })}
    ${t(120, 280, 'Data Analyst', { size: 40, font: F.display, weight: 700 })}${t(120, 318, 'Fictional role', { size: 22, font: F.mono, fill: C.text2 })}
    ${box(900, 150, 620, 760, { fill: C.card })}${t(940, 220, 'CANDIDATE PROFILE', { size: 22, font: F.mono, weight: 600, fill: C.text2, ls: 3 })}
    ${t(940, 280, 'Candidate A', { size: 40, font: F.display, weight: 700 })}${t(940, 318, 'Fictional profile', { size: 22, font: F.mono, fill: C.text2 })}
    ${rows.map(([req, need, ev, fit], i) => { const y = 370 + i * 128, c = fit === 'yes' ? C.green : C.amber; return `
      ${box(120, y, 540, 96, { r: 18, fill: C.elev, stroke: C.line2 })}${t(150, y + 44, req, { size: 30, weight: 600 })}${t(150, y + 76, need, { size: 22, font: F.mono, fill: need === 'Required' ? C.violetTx : C.text2 })}
      ${box(940, y, 540, 96, { r: 18, fill: C.elev, stroke: c === C.green ? 'rgba(52,211,153,0.45)' : 'rgba(251,191,36,0.45)' })}${t(970, y + 58, ev, { size: 28 })}
      <path d="M660 ${y + 48} C 780 ${y + 48} 820 ${y + 48} 940 ${y + 48}" stroke="${c}" stroke-width="3" stroke-dasharray="${fit === 'yes' ? '0' : '10 10'}" fill="none"/>
      <circle cx="800" cy="${y + 48}" r="26" fill="${C.bg}" stroke="${c}" stroke-width="3"/>
      ${fit === 'yes' ? `<path d="M788 ${y + 48} l8 8 16 -16" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M788 ${y + 48} h24" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`}`; }).join('')}
    ${t(800, 950, 'People make the decision · no scores or rankings', { size: 24, font: F.mono, anchor: 'middle', fill: C.text2 })}
  `);
}

/* M-05 · Data Migration: SQL Server through four stages into Snowflake */
function dataMigration() {
  const stages = ['Extract', 'Transform', 'Validate', 'Load'];
  const cyl = (x, y) => `<path d="M${x - 90} ${y - 70} v140 a90 28 0 0 0 180 0 v-140" fill="${C.elev}" stroke="${C.line2}" stroke-width="3"/><ellipse cx="${x}" cy="${y - 70}" rx="90" ry="28" fill="#1B2840" stroke="${C.line2}" stroke-width="3"/><path d="M${x - 90} ${y} a90 28 0 0 0 180 0" fill="none" stroke="${C.line}" stroke-width="3"/>`;
  const flake = (x, y, r) => `<g stroke="${C.cyan}" stroke-width="7" stroke-linecap="round">${[0, 60, 120].map((a) => { const rad = a * Math.PI / 180; return `<path d="M${(x - Math.cos(rad) * r).toFixed(1)} ${(y - Math.sin(rad) * r).toFixed(1)}L${(x + Math.cos(rad) * r).toFixed(1)} ${(y + Math.sin(rad) * r).toFixed(1)}"/>`; }).join('')}</g>`;
  return frame('M-05', 'DATA MIGRATION', 'cyan', `
    ${cyl(210, 400)}${t(210, 560, 'SQL Server', { size: 32, weight: 600, anchor: 'middle' })}${t(210, 596, 'Traditional sources', { size: 22, font: F.mono, fill: C.text2, anchor: 'middle' })}
    <path d="M320 400 H 1280" stroke="${C.line2}" stroke-width="4"/>
    <path d="M320 400 H 1280" stroke="${C.cyan}" stroke-width="4" stroke-dasharray="16 22"/>
    ${stages.map((s, i) => { const x = 450 + i * 230; return `${glow(x, 400, 90, 'cyan', 0.5)}<circle cx="${x}" cy="400" r="40" fill="${C.card}" stroke="${C.cyan}" stroke-width="4"/>${t(x, 413, String(i + 1).padStart(2, '0'), { size: 26, font: F.mono, weight: 600, anchor: 'middle', fill: C.cyan })}${t(x, 490, s, { size: 30, weight: 600, anchor: 'middle' })}`; }).join('')}
    ${glow(1390, 400, 200, 'cyan', 0.6)}
    ${box(1290, 300, 200, 200, { r: 40, fill: C.elev, stroke: 'rgba(56,189,248,0.7)', sw: 3 })}${flake(1390, 400, 62)}
    ${t(1390, 560, 'Snowflake', { size: 32, weight: 600, anchor: 'middle' })}${t(1390, 596, 'Cloud data warehouse', { size: 22, font: F.mono, fill: C.text2, anchor: 'middle' })}
    ${t(800, 660, 'AZURE DATA FACTORY · SUPPORTING INFRASTRUCTURE', { size: 22, font: F.mono, weight: 600, fill: C.text2, anchor: 'middle', ls: 2 })}
    ${box(450, 720, 700, 180, { r: 26, fill: 'rgba(16,24,39,0.9)', stroke: C.line2, extra: ' stroke-dasharray="10 8"' })}
    ${t(490, 776, 'ALSO MIGRATED', { size: 22, font: F.mono, weight: 600, fill: C.text2, ls: 3 })}
    ${ico('bi', 490, 806, 56, C.cyan)}${t(566, 846, 'Dashboards', { size: 30, weight: 600 })}
    ${ico('sources', 820, 806, 56, C.cyan)}${t(896, 846, 'Their data sources', { size: 30, weight: 600 })}
  `);
}

/* X-01 · Bug Detailer: screenshot plus description in, structured report out */
function bugDetailer() {
  return frame('X-01', 'BUG DETAILER', 'green', `
    ${box(80, 170, 520, 420, { fill: C.card })}
    <rect x="80" y="170" width="520" height="56" rx="22" fill="${C.elev}"/>${['#F87171', '#FBBF24', '#34D399'].map((c, i) => `<circle cx="${112 + i * 26}" cy="198" r="8" fill="${c}" opacity="0.75"/>`).join('')}
    ${t(120, 290, 'Profile', { size: 32, font: F.display, weight: 700 })}
    ${box(120, 320, 440, 54, { r: 10, fill: C.elev, stroke: C.line2 })}${box(120, 396, 440, 54, { r: 10, fill: C.elev, stroke: C.line2 })}
    ${box(430, 488, 130, 54, { r: 27, fill: C.cyan, stroke: 'none' })}${t(495, 524, 'Save', { size: 26, weight: 700, anchor: 'middle', fill: '#05070D' })}
    ${box(80, 630, 520, 120, { r: 26, fill: 'rgba(148,163,184,0.12)', stroke: 'none' })}${t(112, 700, '“Save does nothing on the', { size: 28 })}${t(112, 736, 'profile page.”', { size: 28 })}
    <path d="M620 470 H 720" stroke="${C.green}" stroke-width="4" stroke-dasharray="10 10"/>
    ${glow(800, 470, 140, 'green', 0.7)}<circle cx="800" cy="470" r="70" fill="${C.card}" stroke="${C.green}" stroke-width="4"/>${ico('ai', 764, 434, 72, C.green, 1.6)}
    ${t(800, 590, 'AI AGENT', { size: 22, font: F.mono, weight: 600, anchor: 'middle', fill: C.green, ls: 3 })}
    <path d="M880 470 H 960" stroke="${C.green}" stroke-width="4" stroke-dasharray="10 10"/>
    ${box(960, 170, 560, 700, { fill: C.card, stroke: 'rgba(52,211,153,0.45)' })}
    ${t(1000, 236, 'BUG REPORT', { size: 22, font: F.mono, weight: 600, fill: C.text2, ls: 3 })}
    ${[['Title', ['Profile changes aren’t saved']], ['Steps', ['Open Profile, change the name,', 'select Save']], ['Expected', ['The change is saved']], ['Actual', ['Nothing happens']]].reduce((acc, [k, vs]) => {
      let y = acc.y;
      let out = t(1000, y, k, { size: 22, font: F.mono, fill: C.text2, weight: 600 });
      vs.forEach((v, j) => { out += t(1000, y + 40 + j * 40, v, { size: 30, weight: 600 }); });
      return { y: y + 70 + vs.length * 40, s: acc.s + out };
    }, { y: 310, s: '' }).s}
    ${t(800, 950, 'Sample input and output · not a live tool', { size: 24, font: F.mono, anchor: 'middle', fill: C.text2 })}
  `);
}

/* X-02 · Web App Builder: existing code plus the logic to follow, proposed changes out */
function webAppBuilder() {
  const code = (x, y, lines) => lines.map(([s, c], i) => t(x, y + i * 46, s, { size: 26, font: F.mono, fill: c || C.text })).join('');
  return frame('X-02', 'WEB APP BUILDER', 'cyan', `
    ${box(70, 170, 600, 360, { fill: '#060A14' })}${t(104, 226, 'cart.js', { size: 22, font: F.mono, fill: C.text2 })}
    ${code(104, 296, [['function total(items) {'], ['  return items.reduce('], ['    (s, i) => s + i.price, 0);'], ['}']])}
    ${box(70, 570, 600, 120, { r: 26, fill: 'rgba(148,163,184,0.12)', stroke: 'none' })}${t(104, 640, '“Members get 10% off.”', { size: 30 })}
    <path d="M690 470 H 740" stroke="${C.cyan}" stroke-width="4" stroke-dasharray="10 10"/>
    ${glow(810, 470, 140, 'cyan', 0.7)}<circle cx="810" cy="470" r="70" fill="${C.card}" stroke="${C.cyan}" stroke-width="4"/>${ico('terminal', 774, 434, 72, C.cyan, 1.6)}
    ${t(810, 590, 'AI AGENT', { size: 22, font: F.mono, weight: 600, anchor: 'middle', fill: C.cyan, ls: 3 })}
    <path d="M880 470 H 930" stroke="${C.cyan}" stroke-width="4" stroke-dasharray="10 10"/>
    ${box(930, 170, 600, 520, { fill: '#060A14', stroke: 'rgba(56,189,248,0.45)' })}${t(964, 226, 'Proposed changes', { size: 22, font: F.mono, fill: C.text2 })}
    <rect x="950" y="262" width="560" height="44" fill="rgba(248,113,113,0.12)"/>
    <rect x="950" y="308" width="560" height="138" fill="rgba(52,211,153,0.12)"/>
    ${code(964, 296, [['- function total(items) {', '#FCA5A5'], ['+ function total(items, isMember) {', C.green], ['+   const s = items.reduce(…);', C.green], ['+   return isMember ? s * 0.9 : s;', C.green]])}
    ${box(964, 580, 300, 64, { r: 32, fill: 'rgba(56,189,248,0.14)', stroke: 'rgba(56,189,248,0.5)' })}${t(1114, 621, 'Developer reviews', { size: 26, weight: 600, anchor: 'middle', fill: C.cyan })}
    ${t(800, 950, 'Sample input and output · not a live tool', { size: 24, font: F.mono, anchor: 'middle', fill: C.text2 })}
  `);
}

module.exports = {
  'knowledge-portal': knowledgePortal,
  'business-sheet': businessSheet,
  'contract-intelligence': contractIntelligence,
  'resume-matching': resumeMatching,
  'data-migration': dataMigration,
  'bug-detailer': bugDetailer,
  'web-app-builder': webAppBuilder,
};
