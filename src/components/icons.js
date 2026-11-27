// Inline SVG icons: 24×24, 1.75 stroke, round caps — drawn in the style of Lucide (ISC).
// Decorative by default (aria-hidden); the surrounding control carries the label.
const svg = (body, cls = '', fill = false) =>
  `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" ${fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true" focusable="false">${body}</svg>`;

const P = {
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  arrowUpRight: '<path d="M7 17 17 7"/><path d="M8 7h9v9"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z"/>',
  understand: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M8 10.5h5M10.5 8v5"/>',
  design: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="8.5" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v2h11v-2M12 12v2"/>',
  build: '<path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/><path d="m13.5 4-3 16"/>',
  validate: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.3 2.3 4.4-4.6"/>',
  deploy: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  pin: '<path d="M20 10c0 5-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
  cap: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84l-8.57-3.9a2 2 0 0 0-1.66 0l-8.57 3.9a1 1 0 0 0 0 1.83l8.57 3.9a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  play: '<path d="M7 4.5v15l12.5-7.5z"/>',
  pause: '<path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/>',
  motion: '<path d="M2 12h3l3-8 4 16 3-8h7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  // architecture stages
  sources: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>',
  ingest: '<path d="M12 3v10"/><path d="m8 9 4 4 4-4"/><path d="M3 15h4l2 3h6l2-3h4v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  process: '<path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/>',
  warehouse: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  ai: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="1.6"/><circle cx="20" cy="6" r="1.6"/><circle cx="4" cy="18" r="1.6"/><circle cx="20" cy="18" r="1.6"/><path d="m5.4 7 4.1 3.2M18.6 7l-4.1 3.2M5.4 17l4.1-3.2M18.6 17l-4.1-3.2"/>',
  automation: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M10 6.5h4.5a3 3 0 0 1 3 3V14"/><path d="m15 11.5 2.5 2.5 2.5-2.5"/>',
  bi: '<path d="M3 3v18h18"/><path d="M7 16v-4M11 16V8M15 16v-6M19 16V5"/>',
};

const icon = (name, cls = '') => svg(P[name], cls, name === 'play' || name === 'pause');

// DataForge mark: a forged hexagon with a small network inside it.
const logomark = (id = 'lm', cls = 'logomark') => `<svg class="${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${id}-g" x1="4" y1="3" x2="28" y2="29" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#38BDF8"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
  <path d="M16 2.6 27.6 9.3v13.4L16 29.4 4.4 22.7V9.3z" fill="#0A1020" stroke="url(#${id}-g)" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M16 9.5v6.5m0 0-5.6 3.3M16 16l5.6 3.3" stroke="url(#${id}-g)" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="16" cy="9.2" r="2.2" fill="#38BDF8"/><circle cx="10.2" cy="19.6" r="2.2" fill="#818CF8"/><circle cx="21.8" cy="19.6" r="2.2" fill="#A78BFA"/><circle cx="16" cy="16" r="1.7" fill="#F8FAFC"/>
</svg>`;

module.exports = { icon, logomark, ICON_PATHS: P };
