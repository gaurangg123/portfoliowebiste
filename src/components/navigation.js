// Floating navigation: wordmark, section links with a moving indicator (desktop),
// a full-screen sheet on small screens, and the résumé. A back-to-top control follows.
const site = require('../data/site.js');
const { icon, logomark } = require('./icons.js');
const { ext } = require('./ui.js');

const navigation = ({ home, base, music = false }) => {
  const h = home ? '' : base;
  const desktop = site.sections.filter(([, , bar]) => bar);
  return `<a class="skip" href="#main">Skip to content</a>

<header class="nav" data-nav>
  <div class="nav__bar">
    <a class="nav__brand" href="${home ? '#top' : base}">${logomark('nav-lm')}<span class="nav__word" aria-hidden="true">DataForge</span><span class="visually-hidden">DataForge, ${site.name}: home</span></a>
    <nav class="nav__primary" aria-label="Main">
      <ul class="nav__links">
${desktop.map(([id, label]) => `        <li><a href="${h}#${id}" data-spy="${id}">${label}</a></li>`).join('\n')}
      </ul>
      <span class="nav__ink" aria-hidden="true"></span>
    </nav>
    <div class="nav__end">
${music ? `      <button class="nav__music js-only" type="button" data-music-mini aria-label="Pause Papercut (instrumental)" hidden>${icon('play', 'i-play')}${icon('pause', 'i-pause')}<span class="nav__music-eq" aria-hidden="true"><i></i><i></i><i></i></span></button>
` : ''}      ${ext(site.resume, `${icon('file')}<span>Resume</span>`, 'btn nav__cta')}
      <button class="nav__menu-btn js-only" type="button" data-menu-btn aria-expanded="false" aria-controls="nav-sheet">${icon('menu', 'i-open')}${icon('close', 'i-close')}<span class="nav__menu-txt">Menu</span></button>
    </div>
  </div>
  <div class="nav__sheet" id="nav-sheet" data-sheet>
    <nav aria-label="All sections">
      <ol class="nav__sheet-links">
${site.sections.map(([id, label], i) => `        <li><a href="${h}#${id}" data-spy="${id}"><span class="nav__num" aria-hidden="true">${String(i + 2).padStart(2, '0')}</span>${label}</a></li>`).join('\n')}
      </ol>
    </nav>
    <div class="nav__sheet-foot">
      ${ext(site.resume, `${icon('download')}<span>Download Resume</span>`, 'btn btn--primary')}
      <div class="nav__social">
        ${ext(site.github, `${icon('github')}<span class="visually-hidden">GitHub</span>`, 'icon-link')}
        ${ext(site.linkedin, `${icon('linkedin')}<span class="visually-hidden">LinkedIn</span>`, 'icon-link')}
        <a class="icon-link" href="mailto:${site.email}">${icon('mail')}<span class="visually-hidden">Email</span></a>
      </div>
    </div>
  </div>
</header>`;
};

const toTop = () => `<a class="to-top js-only" href="#top" data-to-top aria-label="Back to top" hidden>
  <svg class="to-top__ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" pathLength="100"/><circle class="to-top__fill" cx="24" cy="24" r="22" pathLength="100"/></svg>
  ${icon('arrowUp')}
</a>`;

module.exports = { navigation, toTop };
