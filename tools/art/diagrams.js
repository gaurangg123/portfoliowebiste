// Static SVG exports: the reference architecture, the background grid, and the logomark.
const A = require('../../src/data/architecture.js');
const { ICON_PATHS } = require('../../src/components/icons.js');

const reference = () => {
  const S = A.stages, w = 200, gap = 26, x0 = 60, y = 230;
  const cell = (s, i) => {
    const x = x0 + i * (w + gap);
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="220" rx="24" fill="#101827" stroke="${i === 3 ? '#38BDF8' : 'rgba(148,163,184,0.35)'}" stroke-width="2"/>
      <text x="${x + 22}" y="${y + 40}" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="600" fill="#38BDF8" letter-spacing="2">${String(i + 1).padStart(2, '0')}</text>
      <g transform="translate(${x + 22} ${y + 62}) scale(1.6)" fill="none" stroke="#F8FAFC" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[s.icon]}</g>
      <text x="${x + 22}" y="${y + 150}" font-family="'Space Grotesk', sans-serif" font-size="24" font-weight="700" fill="#F8FAFC">${s.short}</text>
      <text x="${x + 22}" y="${y + 186}" font-family="'JetBrains Mono', monospace" font-size="13" fill="#94A3B8">${s.tech.slice(0, 2).join(' · ').replace(/&/g, '&amp;').slice(0, 24)}</text>
    </g>${i < S.length - 1 ? `<path d="M${x + w + 4} ${y + 110}h${gap - 8}" stroke="#38BDF8" stroke-width="2.5"/><path d="M${x + w + gap - 10} ${y + 104}l6 6-6 6" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>` : ''}`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1700 620" width="1700" height="620" role="img">
  <title>Reference data architecture: ${S.map((s) => s.name).join(' → ').replace(/&/g, '&amp;')}</title>
  <rect width="1700" height="620" fill="#0A1020"/>
  <defs><pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(148,163,184,0.07)"/></pattern></defs>
  <rect width="1700" height="620" fill="url(#g)"/>
  <text x="60" y="110" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="600" fill="#94A3B8" letter-spacing="3">DATAFORGE · REFERENCE ARCHITECTURE</text>
  <text x="60" y="166" font-family="'Space Grotesk', sans-serif" font-size="44" font-weight="700" fill="#F8FAFC">From raw data to decisions</text>
  ${S.map(cell).join('\n')}
  <text x="60" y="540" font-family="'Inter', sans-serif" font-size="18" fill="#94A3B8">${A.note}</text>
</svg>`;
};

const grid = () => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M64 0H0V64" fill="none" stroke="#94A3B8" stroke-opacity="0.08" stroke-width="1"/></svg>`;

const glow = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <radialGradient id="a" cx="0.72" cy="0" r="0.7"><stop offset="0" stop-color="#38BDF8" stop-opacity="0.16"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="0" cy="0.1" r="0.6"><stop offset="0" stop-color="#8B5CF6" stop-opacity="0.12"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="#05070D"/><rect width="1600" height="900" fill="url(#a)"/><rect width="1600" height="900" fill="url(#b)"/>
</svg>`;

module.exports = { reference, grid, glow };
