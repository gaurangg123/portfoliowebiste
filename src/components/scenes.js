// Stage illustrations for the engineering workflow and the data architecture.
// Original SVG drawings (240×150), coloured by the stage's tone through CSS
// (src/styles/workflow.css). Lines marked .sc-draw draw themselves in when a stage opens.
const svg = (body) => `<svg class="scene" viewBox="0 0 240 150" aria-hidden="true" focusable="false">${body}</svg>`;
const cyl = (x, y, w = 34, h = 30) => `<g class="sc-box"><path d="M${x - w / 2} ${y}v${h}a${w / 2} ${w / 6} 0 0 0 ${w} 0v-${h}"/><ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 6}"/></g>`;
const doc = (x, y, w = 46, h = 58) => `<g class="sc-box"><path d="M${x} ${y}h${w - 12}l12 12v${h - 12}h-${w}z"/></g>${[16, 26, 36, 46].filter((d) => d < h - 6).map((d, i) => `<path class="sc-soft" d="M${x + 8} ${y + d}h${[w - 18, w - 24, w - 16, w - 28][i]}"/>`).join('')}`;

const SCENES = {
  /* ---------- workflow ---------- */
  understand: svg(`${doc(34, 34)}${cyl(162, 44)}<path class="sc-soft" d="M145 74h34M145 64h34"/>
    <circle class="sc-tone sc-draw" cx="92" cy="76" r="26"/><path class="sc-tone sc-draw" d="m111 95 22 22"/>
    <path class="sc-tone" d="M82 76h20M92 66v20"/>
    <g class="sc-chip"><rect x="170" y="98" width="56" height="26" rx="13"/><text x="198" y="115" text-anchor="middle">goal</text></g>`),
  design: svg(`<path class="sc-grid" d="M20 30h200M20 60h200M20 90h200M20 120h200M50 15v120M100 15v120M150 15v120M200 15v120"/>
    <rect class="sc-tone-fill" x="22" y="58" width="52" height="34" rx="8"/><rect class="sc-tone-fill" x="166" y="26" width="52" height="34" rx="8"/><rect class="sc-tone-fill" x="166" y="92" width="52" height="34" rx="8"/>
    <rect class="sc-box" x="96" y="58" width="48" height="34" rx="17"/>
    <path class="sc-tone sc-draw" d="M74 75h22M144 75c12 0 10-32 22-32M144 75c12 0 10 34 22 34"/>
    <circle class="sc-dot" cx="120" cy="75" r="5"/>`),
  build: svg(`<rect class="sc-box" x="18" y="22" width="128" height="104" rx="10"/><path class="sc-soft" d="M18 40h128"/>
    ${[56, 70, 84, 98, 112].map((y, i) => `<path class="${i === 2 ? 'sc-tone sc-draw' : 'sc-soft'}" d="M${32 + [0, 12, 12, 24, 0][i]} ${y}h${[60, 72, 50, 44, 30][i]}"/>`).join('')}
    <g class="sc-gear"><circle class="sc-tone" cx="186" cy="74" r="22"/><circle class="sc-tone" cx="186" cy="74" r="8"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path class="sc-tone" d="M${(186 + Math.cos(r) * 22).toFixed(1)} ${(74 + Math.sin(r) * 22).toFixed(1)}L${(186 + Math.cos(r) * 30).toFixed(1)} ${(74 + Math.sin(r) * 30).toFixed(1)}"/>`; }).join('')}</g>`),
  validate: svg(`<rect class="sc-box" x="22" y="18" width="120" height="114" rx="10"/>
    ${[44, 74, 104].map((y, i) => `<rect class="sc-tone-fill" x="36" y="${y - 9}" width="18" height="18" rx="5"/><path class="sc-tone sc-draw" d="M40 ${y}l4 4 7-8"/><path class="sc-soft" d="M64 ${y}h${[60, 48, 54][i]}"/>`).join('')}
    <path class="sc-tone-fill sc-draw" d="M190 30 160 42v22c0 18 13 33 30 38 17-5 30-20 30-38V42z"/><path class="sc-tone" d="m178 66 9 9 16-17"/>`),
  deploy: svg(`<path class="sc-soft" d="M20 128h200"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect class="${i === 4 ? 'sc-tone-fill' : 'sc-box'}" x="${28 + i * 26}" y="${128 - (24 + i * 16)}" width="16" height="${24 + i * 16}" rx="3"/>`).join('')}
    <path class="sc-tone sc-draw" d="M188 104a34 34 0 1 1 26-38"/><path class="sc-tone" d="m214 54 0 13-13-2"/>
    <circle class="sc-dot" cx="188" cy="70" r="6"/><text class="sc-t" x="188" y="122" text-anchor="middle">iterate</text>`),

  /* ---------- architecture ---------- */
  sources: svg(`${cyl(44, 40)}${doc(92, 24, 42, 52)}<g class="sc-box"><rect x="150" y="28" width="58" height="44" rx="6"/></g><path class="sc-soft" d="M150 42h58M150 56h58M170 28v44M189 28v44"/>
    <text class="sc-t" x="44" y="100" text-anchor="middle">SQL</text><text class="sc-t" x="113" y="100" text-anchor="middle">DOCS</text><text class="sc-t" x="179" y="100" text-anchor="middle">SHEETS</text>
    <path class="sc-tone sc-draw" d="M44 112c0 18 76 10 76 24M113 112v24M179 112c0 18-59 10-59 24"/>`),
  ingest: svg(`${[30, 75, 120].map((y) => `<path class="sc-tone sc-draw" d="M20 ${y}C80 ${y} 90 75 140 75"/>`).join('')}
    <path class="sc-tone-fill" d="M140 50h40l20 25-20 25h-40z"/><path class="sc-tone" d="M200 75h22"/>
    ${[30, 75, 120].map((y) => `<circle class="sc-dot" cx="20" cy="${y}" r="5"/>`).join('')}`),
  process: svg(`${[[26, 38], [40, 62], [22, 84], [44, 104], [30, 122]].map(([x, y]) => `<circle class="sc-box" cx="${x}" cy="${y}" r="7"/>`).join('')}
    <path class="sc-tone-fill" d="M80 30h80l-28 44v40l-24 10V74z"/>
    ${[48, 64, 80, 96].map((y) => `<rect class="sc-tone-fill" x="186" y="${y}" width="34" height="11" rx="3"/>`).join('')}
    <path class="sc-tone sc-draw" d="M54 75h22M164 75h18"/>`),
  warehouse: svg(`${[0, 1, 2].map((i) => `<path class="${i === 0 ? 'sc-tone-fill' : 'sc-box'}" d="M120 ${30 + i * 26}l70 22-70 22-70-22z"/>`).join('')}
    <path class="sc-tone sc-draw" d="M50 52v52l70 22 70-22V52"/>`),
  ai: svg(`${(() => { const L = [[40, [40, 75, 110]], [120, [30, 60, 90, 120]], [200, [55, 95]]]; let e = ''; for (let l = 0; l < 2; l++) for (const a of L[l][1]) for (const b of L[l + 1][1]) e += `<path class="sc-edge" d="M${L[l][0]} ${a}L${L[l + 1][0]} ${b}"/>`; return e + L.map(([x, ys], l) => ys.map((y) => `<circle class="${l === 1 ? 'sc-tone-fill' : 'sc-box'}" cx="${x}" cy="${y}" r="9"/>`).join('')).join(''); })()}
    <path class="sc-tone sc-draw" d="M40 75 120 60 200 55"/>`),
  automation: svg(`<rect class="sc-box" x="16" y="58" width="50" height="34" rx="9"/><circle class="sc-tone-fill" cx="120" cy="75" r="22"/><path class="sc-tone" d="M120 63v24M108 75h24"/>
    <rect class="sc-tone-fill" x="174" y="28" width="50" height="30" rx="9"/><rect class="sc-tone-fill" x="174" y="92" width="50" height="30" rx="9"/>
    <path class="sc-tone sc-draw" d="M66 75h32M142 75c14 0 16-32 32-32M142 75c14 0 16 32 32 32"/><path class="sc-tone" d="m185 43 5 5 9-9M185 107l5 5 9-9"/>`),
  bi: svg(`<rect class="sc-box" x="16" y="16" width="208" height="118" rx="10"/>
    ${[38, 52, 46, 66, 74, 70, 88].map((h, i) => `<rect class="${i === 6 ? 'sc-tone-fill' : 'sc-bar'}" x="${34 + i * 22}" y="${118 - h}" width="13" height="${h}" rx="2"/>`).join('')}
    <path class="sc-tone sc-draw" d="M40 74 62 64 84 70 106 50 128 44 150 48 172 30"/>
    <rect class="sc-chip-r" x="176" y="26" width="38" height="20" rx="6"/>`),
};

module.exports = { SCENES };
