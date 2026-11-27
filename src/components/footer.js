// A compact footer: the mark and line, the sections, the channels, and back to top.
const site = require('../data/site.js');
const { icon, logomark } = require('./icons.js');
const { ext } = require('./ui.js');

const footer = ({ home, base }) => {
  const h = home ? '' : base;
  return `<footer class="footer">
  <div class="container footer__row">
    <div class="footer__brand">
      <a class="footer__mark" href="${home ? './' : base}">${logomark('foot-lm')}<span>DataForge</span><span class="visually-hidden">: home</span></a>
      <p class="footer__line">${site.tagline} · ${site.name}, ${site.location}</p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <ul>
${site.sections.map(([id, label]) => `        <li><a href="${h}#${id}">${label}</a></li>`).join('\n')}
      </ul>
    </nav>
    <ul class="footer__social" aria-label="Profiles">
      <li><a class="icon-link" href="mailto:${site.email}">${icon('mail')}<span class="visually-hidden">Email</span></a></li>
      <li>${ext(site.linkedin, `${icon('linkedin')}<span class="visually-hidden">LinkedIn</span>`, 'icon-link')}</li>
      <li>${ext(site.github, `${icon('github')}<span class="visually-hidden">GitHub</span>`, 'icon-link')}</li>
      <li>${ext(site.resume, `${icon('file')}<span class="visually-hidden">Resume</span>`, 'icon-link')}</li>
    </ul>
  </div>
  <div class="container footer__base">
    <p>© <span data-year>2026</span> ${site.name} · Designed and built by me</p>
    <button class="link-arrow footer__top js-only" type="button" data-to-top-link>Back to top ${icon('arrowUp')}</button>
  </div>
</footer>`;
};

module.exports = { footer };
