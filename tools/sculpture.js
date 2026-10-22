// The hero's record sculpture: layered SVG (static base, rotating record face, static light, static label).
// Grooves and a segmented data ring nod to a vinyl record and to data; one slice is pulled out like a chart segment.
const C = 320, R = 262;
const f = (n) => +n.toFixed(2);
const pt = (r, deg, cx = C, cy = C) => { const a = (deg - 90) * Math.PI / 180; return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))]; };
const sector = (r0, r1, a0, a1) => {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
  return `M${x0} ${y0}A${r1} ${r1} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${large} 0 ${x3} ${y3}Z`;
};
const arc = (r, a0, a1) => { const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1); return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
const GAPS = [[166, 178], [206, 222]];          // track gaps that hold the data arcs
const ARCS = [[214, 12, 22, 132, '#6E1020'], [214, 12, 148, 206, '#F5B3AB'], [172, 9, 214, 318, '#FFFEFA'], [172, 9, 330, 382, '#20201F'], [240, 6, 300, 352, '#F5B3AB']];
const SLICE = [234, 268];

const grooves = (clip) => {
  const out = [];
  for (let r = 116; r <= R - 10; r += 4.1) if (!GAPS.some(([a, b]) => r > a && r < b)) out.push(`<circle cx="${C}" cy="${C}" r="${f(r)}"${clip ? ` clip-path="url(#${clip})"` : ''}/>`);
  return out.join('');
};

function sculpture({ id = 'sc' } = {}) {
  const [s0, s1] = SLICE, [dx, dy] = pt(20, (s0 + s1) / 2, 0, 0);
  const ticks = Array.from({ length: 90 }, (_, i) => {
    const a = i * 4; if (a >= s0 - 1 && a <= s1 + 1) return '';
    const [x0, y0] = pt(R - 2.5, a), [x1, y1] = pt(R - (i % 5 ? 8 : 14), a); return `M${x0} ${y0}L${x1} ${y1}`;
  }).join('');
  const svg = (cls, body) => `<svg class="sculpture__layer ${cls}" viewBox="0 0 640 640" aria-hidden="true" focusable="false">${body}</svg>`;
  const base = svg('sculpture__base', `
        <ellipse cx="${C + 8}" cy="610" rx="222" ry="12" fill="#20201F" opacity=".1"/>
        ${Array.from({ length: 10 }, (_, k) => `<circle cx="${f(C + (k + 1) * 1.05)}" cy="${f(C + (k + 1) * 1.75)}" r="${R}" fill="#6E1020"/>`).join('')}
        <circle cx="${C}" cy="${C}" r="${R}" fill="#BB2436"/>`);
  const spin = svg('sculpture__spin', `
        <g fill="none" stroke="#6E1020" stroke-opacity=".34" stroke-width=".95">${grooves()}</g>
        ${ARCS.map(([r, w, a0, a1, c]) => `<path d="${arc(r, a0, a1)}" stroke="${c}" stroke-width="${w}" fill="none"/>`).join('')}
        <path d="${ticks}" stroke="#6E1020" stroke-opacity=".65" stroke-width="1.5" stroke-linecap="round"/>
        <path d="${sector(108, R + 0.5, s0, s1)}" fill="#6E1020"/>
        <path d="${sector(108, R + 0.5, s0, s1)}" fill="#20201F" fill-opacity=".18"/>
        <g transform="translate(${dx} ${dy})">
          <clipPath id="${id}-slice"><path d="${sector(110, R, s0, s1)}"/></clipPath>
          <path d="${sector(110, R, s0, s1)}" fill="#BB2436" stroke="#6E1020" stroke-width="2"/>
          <g fill="none" stroke="#6E1020" stroke-opacity=".34" stroke-width=".95">${grooves(id + '-slice')}</g>
          <path d="${arc(240, s0 + 4, s1 - 4)}" stroke="#20201F" stroke-width="6" fill="none"/>
          <path d="${sector(110, R, s0, s1)}" fill="#FFFEFA" fill-opacity=".1"/>
        </g>`);
  const light = svg('sculpture__light', `
        <defs><linearGradient id="${id}-shade" x1=".15" y1=".1" x2=".85" y2=".95">
          <stop offset="0" stop-color="#FFFEFA" stop-opacity=".16"/><stop offset=".5" stop-color="#BB2436" stop-opacity="0"/><stop offset="1" stop-color="#6E1020" stop-opacity=".36"/>
        </linearGradient></defs>
        <circle cx="${C}" cy="${C}" r="${R}" fill="url(#${id}-shade)"/>
        <path d="${sector(112, 252, 312, 330)}" fill="#FFFEFA" fill-opacity=".09"/>`);
  const label = svg('sculpture__label', `
        <circle cx="${C + 2.5}" cy="${C + 4.5}" r="100" fill="#6E1020" opacity=".55"/>
        <circle cx="${C}" cy="${C}" r="98" fill="#FFFEFA"/>
        <circle cx="${C}" cy="${C}" r="88" fill="none" stroke="#BB2436" stroke-width="1.5"/>
        <text x="${C}" y="${C + 1}" text-anchor="middle" dominant-baseline="central" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="66" font-weight="700" letter-spacing="-1.5" fill="#20201F">GA</text>`);
  return `<div class="sculpture" aria-hidden="true">
        ${base}
        ${spin}
        ${light}
        ${label}
      </div>`;
}
module.exports = { sculpture };
