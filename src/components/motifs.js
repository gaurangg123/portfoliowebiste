// Domain motifs: original SVG illustrations, one per engineering domain.
// On the page they animate (CSS, src/styles/expertise.css) only while a card is
// hovered or focused, or once when it first scrolls into view. The same drawings are
// exported as standalone files to assets/<domain>/ by tools/render-assets.js.
const r = (n) => Math.round(n * 10) / 10;

/* ---------- Data Engineering: sources → pipes → transform → data-centre rack ---------- */
function pipeline() {
  const ys = [50, 110, 170];
  const cyl = (y) => `<g class="m-src"><path d="M26 ${y - 11}v22a22 7 0 0 0 44 0v-22"/><ellipse cx="48" cy="${y - 11}" rx="22" ry="7"/><path class="m-soft" d="M26 ${y}a22 7 0 0 0 44 0"/></g>`;
  const pipe = (y) => `M72 ${y} C128 ${y} 136 110 176 110`;
  const hex = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 2; return `${r(200 + 24 * Math.cos(a))},${r(110 + 24 * Math.sin(a))}`; }).join(' ');
  const slots = [72, 88, 104, 120, 136, 152];
  return `<svg class="motif motif--pipeline" viewBox="0 0 400 220" aria-hidden="true" focusable="false">
    ${ys.map(cyl).join('')}
    <g class="m-pipes">${ys.map((y) => `<path d="${pipe(y)}"/>`).join('')}<path d="M224 110H290"/></g>
    <g class="m-flow">${ys.map((y, i) => `<path style="--d:${i * 0.25}s" d="${pipe(y)}"/>`).join('')}<path style="--d:0.6s" d="M224 110H290"/></g>
    <polygon class="m-node" points="${hex}"/>
    <path class="m-glyph" d="M190 102h20l-7 8v8l-6 3v-11z"/>
    <g class="m-rack">
      <path class="m-rack-top" d="M296 58 318 46h48l-22 12z"/>
      <path class="m-rack-side" d="M340 58 362 46v112l-22 12z"/>
      <rect x="296" y="58" width="44" height="112" rx="3"/>
      ${slots.map((y) => `<path class="m-soft" d="M302 ${y}h24"/>`).join('')}
      ${slots.map((y, i) => `<circle class="m-led" style="--d:${(i * 0.37) % 1.4}s" cx="333" cy="${y}" r="2.2"/>`).join('')}
    </g>
    <text class="m-label" x="48" y="206" text-anchor="middle">SOURCES</text>
    <text class="m-label" x="200" y="152" text-anchor="middle">TRANSFORM</text>
    <text class="m-label" x="329" y="206" text-anchor="middle">WAREHOUSE</text>
  </svg>`;
}

/* ---------- AI & ML: a layered network firing left to right, emitting tokens ---------- */
function neural() {
  const X = [56, 146, 246, 336], N = [3, 5, 5, 2];
  const ys = (n) => Array.from({ length: n }, (_, i) => 110 + (i - (n - 1) / 2) * 36);
  let edges = '';
  for (let l = 0; l < 3; l++) {
    let g = '';
    for (const a of ys(N[l])) for (const b of ys(N[l + 1])) g += `<path d="M${X[l]} ${a}L${X[l + 1]} ${b}"/>`;
    edges += `<g class="m-edges" style="--d:${l * 0.35}s">${g}</g>`;
  }
  const nodes = X.map((x, l) => `<g class="m-layer" style="--d:${l * 0.35}s">${ys(N[l]).map((y) => `<circle cx="${x}" cy="${y}" r="${l === 0 || l === 3 ? 9 : 7}"/>`).join('')}</g>`).join('');
  const tokens = [0, 1, 2].map((i) => `<rect class="m-token" style="--d:${1.4 + i * 0.18}s" x="${360 + i * 0}" y="${78 + i * 24}" width="${[30, 22, 26][i]}" height="12" rx="3"/>`).join('');
  return `<svg class="motif motif--neural" viewBox="0 0 400 220" aria-hidden="true" focusable="false">
    ${edges}${nodes}${tokens}
    <text class="m-label" x="56" y="206" text-anchor="middle">INPUT</text>
    <text class="m-label" x="196" y="206" text-anchor="middle">HIDDEN LAYERS</text>
    <text class="m-label" x="356" y="206" text-anchor="middle">TOKENS</text>
  </svg>`;
}

/* ---------- Intelligent Automation: trigger → agent → decision → two actions ---------- */
function workflow() {
  const routes = ['M92 110H124', 'M176 110H216', 'M240 86V57H298', 'M240 134V163H298'];
  return `<svg class="motif motif--workflow" viewBox="0 0 400 220" aria-hidden="true" focusable="false">
    <g class="m-pipes">${routes.map((d) => `<path d="${d}"/>`).join('')}</g>
    <g class="m-run">${routes.map((d, i) => `<path pathLength="100" style="--d:${[0, 0.45, 0.95, 0.95][i]}s" d="${d}"/>`).join('')}</g>
    <rect class="m-box" x="20" y="92" width="72" height="36" rx="10"/>
    <path class="m-glyph" d="M40 104l6 6-6 6M50 116h10"/>
    <circle class="m-node m-agent" cx="150" cy="110" r="26"/>
    <path class="m-glyph" d="M150 97v26M137 110h26M141 101l18 18M159 101l-18 18"/>
    <path class="m-node" d="M240 86l24 24-24 24-24-24z"/>
    <text class="m-glyph-t" x="240" y="114" text-anchor="middle">?</text>
    <rect class="m-box m-end" style="--d:1.5s" x="298" y="40" width="84" height="34" rx="10"/>
    <rect class="m-box m-end" style="--d:1.5s" x="298" y="146" width="84" height="34" rx="10"/>
    <path class="m-glyph m-tick" style="--d:1.7s" d="M310 57l5 5 9-9"/>
    <path class="m-glyph m-tick" style="--d:1.7s" d="M310 163l5 5 9-9"/>
    <text class="m-label" x="56" y="150" text-anchor="middle">TRIGGER</text>
    <text class="m-label" x="150" y="156" text-anchor="middle">AGENT</text>
    <text class="m-label" x="240" y="156" text-anchor="middle">DECIDE</text>
    <text class="m-label" x="352" y="61" text-anchor="middle">ACT</text>
    <text class="m-label" x="352" y="167" text-anchor="middle">NOTIFY</text>
  </svg>`;
}

/* ---------- Analytics & Visualization: bars, a trend line and a comparison marker ---------- */
function chart() {
  const H = [38, 50, 46, 62, 72, 68, 86, 98, 92, 116];   // shape only: no values, no units
  const bars = H.map((h, i) => `<rect class="m-bar${i === H.length - 1 ? ' m-bar--key' : ''}" style="--d:${i * 0.06}s" x="${62 + i * 30}" y="${176 - h}" width="16" height="${h}" rx="3"/>`).join('');
  const line = H.map((h, i) => `${i ? 'L' : 'M'}${70 + i * 30} ${176 - h - 14}`).join('');
  return `<svg class="motif motif--chart" viewBox="0 0 400 220" aria-hidden="true" focusable="false">
    <g class="m-grid">${[56, 96, 136].map((y) => `<path d="M44 ${y}H372"/>`).join('')}</g>
    <path class="m-axis" d="M44 28V176H372"/>
    ${bars}
    <path class="m-line" pathLength="100" d="${line}"/>
    ${H.map((h, i) => (i % 3 === 0 || i === H.length - 1 ? `<circle class="m-pt" style="--d:${0.5 + i * 0.06}s" cx="${70 + i * 30}" cy="${176 - h - 14}" r="3.5"/>` : '')).join('')}
    <g class="m-kpi"><rect x="62" y="22" width="92" height="28" rx="8"/><path class="m-glyph" d="M74 41l6-7 6 7"/><text class="m-label m-label--kpi" x="94" y="40">FY vs FY</text></g>
    <text class="m-label" x="62" y="200">FY2014</text>
    <text class="m-label" x="360" y="200" text-anchor="end">CURRENT FY</text>
  </svg>`;
}

const MOTIFS = { pipeline, neural, workflow, chart };

// a standalone file: same drawing, static, with its colours inlined
const standalone = (name, tone) => MOTIFS[name]()
  .replace('<svg class="motif', `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="440" class="motif`)
  .replace(' aria-hidden="true" focusable="false">', ` role="img"><title>${name} motif</title>
  <style>
    svg{--tone:${tone};background:#0A1020}
    *{fill:none;stroke:#94A3B8;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
    .m-src ellipse,.m-src path,.m-rack rect,.m-rack-top,.m-rack-side,.m-box,.m-kpi rect{fill:#151F30;stroke:rgba(148,163,184,.45)}
    .m-soft{stroke:rgba(148,163,184,.3)} .m-pipes path,.m-grid path{stroke:rgba(148,163,184,.25)} .m-axis{stroke:rgba(148,163,184,.5)}
    .m-flow path,.m-run path{stroke:var(--tone);stroke-width:2.4;stroke-dasharray:6 14}
    .m-node{fill:#101827;stroke:var(--tone);stroke-width:2} .m-glyph{stroke:var(--tone);stroke-width:2}
    .m-led,.m-pt{fill:var(--tone);stroke:none} .m-layer circle{fill:#101827;stroke:var(--tone);stroke-width:2}
    .m-edges path{stroke:var(--tone);stroke-opacity:.28;stroke-width:1} .m-token{fill:var(--tone);fill-opacity:.55;stroke:none}
    .m-bar{fill:var(--tone);fill-opacity:.35;stroke:none} .m-bar--key{fill-opacity:1} .m-line{stroke:var(--tone);stroke-width:2.4}
    .m-end{stroke:var(--tone)} .m-tick{stroke:var(--tone)}
    text{fill:#94A3B8;stroke:none;font:600 10px 'JetBrains Mono',monospace;letter-spacing:.12em} .m-glyph-t{fill:var(--tone);stroke:none;font:700 16px 'Space Grotesk',sans-serif}
  </style>`);

module.exports = { MOTIFS, standalone };
