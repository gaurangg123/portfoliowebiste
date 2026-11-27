const site = require('../data/site.js');
const { icon, logomark } = require('./icons.js');
const { ext } = require('./ui.js');

const footer = ({ home, base }) => {
  const h = home ? '' : base;
  return `<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__brand">
      <a class="footer__mark" href="${home ? '#top' : base}">${logomark('foot-lm')}<span>DataForge</span><span class="visually-hidden">: home</span></a>
      <p class="footer__line">${site.tagline}. Designed and built by ${site.name}.</p>
    </div>
    <nav class="footer__nav" aria-label="Footer">
      <p class="label">Sections</p>
      <ul>
${site.sections.map(([id, label]) => `        <li><a href="${h}#${id}">${label}</a></li>`).join('\n')}
      </ul>
    </nav>
    <div class="footer__nav">
      <p class="label">Connect</p>
      <ul>
        <li><a href="mailto:${site.email}">Email</a></li>
        <li>${ext(site.linkedin, 'LinkedIn')}</li>
        <li>${ext(site.github, 'GitHub')}</li>
        <li>${ext(site.resume, 'Resume')}</li>
      </ul>
    </div>
  </div>
  <div class="container footer__base">
    <p>© <span data-year>2026</span> ${site.name} · ${site.location}</p>
    <a class="link-arrow" href="#top">Back to top ${icon('arrowUp')}</a>
  </div>
</footer>`;
};

module.exports = { footer };
