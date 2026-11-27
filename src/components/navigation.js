// Navigation.
//   ≥1024px: a narrow, translucent rail fixed to the right edge. The DataForge mark at the
//   top, one icon per homepage section (its name slides out on hover and focus), an ink
//   that glides to the current section, a reading-progress line, then Query the Engineer,
//   the theme switch and the résumé.
//   <1024px: a small floating button opens a full-screen menu; the wordmark sits in the
//   page's masthead and scrolls away with it.
// The wordmark and "Home" return to the top without adding "#top".
const site = require('../data/site.js');
const { icon, logomark } = require('./icons.js');
const { ext } = require('./ui.js');

const themeBtn = (cls = 'icon-link') => `<button class="${cls} theme-btn js-only" type="button" data-theme-toggle aria-pressed="false">${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}<span class="visually-hidden" data-theme-label>Switch to light theme</span></button>`;

/**
 * @param {{ page: 'home'|'case'|'query'|'404', base: string }} o
 *   base: the path from this page to the site root ('' on the homepage)
 */
const navigation = ({ page, base }) => {
  const home = page === 'home';
  const root = home ? './' : base;
  const to = (id) => (id === 'home' ? root : `${home ? '' : base}#${id}`);
  const num = (i) => String(i + 1).padStart(2, '0');
  const queryHref = `${base}${site.queryPath}`;
  const here = (id) => (page === 'case' && id === 'projects' ? ' data-context' : '');
  return `<a class="skip" href="#main">Skip to content</a>

<header class="rail" data-nav data-page="${page}">
  <a class="rail__mono" href="${root}" data-home-link>${logomark('rail-lm')}<span class="visually-hidden">DataForge, ${site.name}: home</span></a>
  <span class="rail__progress" aria-hidden="true"><i data-progress></i></span>
  <nav class="rail__nav" aria-label="Main">
    <ol class="rail__list">
${site.sections.map(([id, label, ico], i) => `      <li><a class="rail__link" href="${to(id)}"${home ? ` data-spy="${id}"` : ''}${id === 'home' ? ' data-home-link' : ''}${here(id)}>${icon(ico)}<span class="rail__label"><b>${num(i)}</b>${label}</span></a></li>`).join('\n')}
    </ol>
    <span class="rail__ink" aria-hidden="true"></span>
  </nav>
  <div class="rail__tools">
    <a class="rail__link rail__link--query" href="${queryHref}"${page === 'query' ? ' aria-current="page"' : ''}>${icon('query')}<span class="rail__label">Query the Engineer</span></a>
    ${themeBtn('rail__link rail__btn')}
    ${ext(site.resume, `${icon('file')}<span class="rail__label">Resume</span>`, 'rail__link rail__resume')}
  </div>
</header>

<a class="masthead" href="${root}" data-home-link>${logomark('mast-lm')}<span aria-hidden="true">DataForge</span><span class="visually-hidden">DataForge, ${site.name}: home</span></a>
<button class="fab js-only" type="button" data-menu-btn aria-expanded="false" aria-controls="nav-sheet">${icon('menu', 'i-open')}${icon('close', 'i-close')}<span class="visually-hidden" data-menu-label>Open menu</span></button>
<div class="sheet" id="nav-sheet" data-sheet role="dialog" aria-modal="true" aria-label="Menu">
  <nav class="sheet__nav" aria-label="All sections">
    <ol class="sheet__links">
${site.sections.map(([id, label], i) => `      <li style="--i:${i}"><a href="${to(id)}"${home ? ` data-spy="${id}"` : ''}${id === 'home' ? ' data-home-link' : ''}><span class="sheet__num" aria-hidden="true">${num(i)}</span>${label}</a></li>`).join('\n')}
    </ol>
  </nav>
  <a class="sheet__query" href="${queryHref}"${page === 'query' ? ' aria-current="page"' : ''}>${icon('query')}<span><b>Query the Engineer</b><span>Ask about my work, on its own page</span></span>${icon('arrowRight', 'i-move')}</a>
  <div class="sheet__foot">
    ${ext(site.resume, `${icon('download')}<span>Download Resume</span>`, 'btn btn--primary')}
    <div class="sheet__icons">
      ${themeBtn()}
      ${ext(site.github, `${icon('github')}<span class="visually-hidden">GitHub</span>`, 'icon-link')}
      ${ext(site.linkedin, `${icon('linkedin')}<span class="visually-hidden">LinkedIn</span>`, 'icon-link')}
      <a class="icon-link" href="mailto:${site.email}">${icon('mail')}<span class="visually-hidden">Email</span></a>
    </div>
  </div>
</div>`;
};

// small screens: back to the top, with the reading progress drawn around it
const toTop = () => `<button class="to-top js-only" type="button" data-to-top aria-label="Back to top">
  <svg class="to-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" pathLength="100"/><circle class="to-top__fill" cx="24" cy="24" r="22" pathLength="100"/></svg>
  ${icon('arrowUp')}
</button>`;

module.exports = { navigation, toTop, themeBtn };
