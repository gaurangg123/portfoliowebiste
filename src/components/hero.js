// 01 · The opening: an asymmetric editorial composition over the 3D lattice.
// The lattice is a <canvas> drawn by src/scripts/hero-lattice.js; without JavaScript a
// still render of the same lattice is shown instead.
const site = require('../data/site.js');
const { PROJECTS } = require('../data/projects.js');
const domains = require('../data/domains.js');
const { icon, ext } = require('./ui.js');

const pad = (n) => String(n).padStart(2, '0');
// an index of what the page documents: counts of real content, not metrics
const INDEX = [
  [pad(PROJECTS.filter((p) => p.type === 'Company project').length), 'Enterprise applications', '#projects'],
  [pad(PROJECTS.filter((p) => p.type === 'Experiment').length), 'AI-agent experiments', '#projects'],
  [pad(domains.length), 'Engineering disciplines', '#expertise'],
];

const hero = () => `<section class="hero" id="home" aria-labelledby="hero-title">
  <div class="hero__art" aria-hidden="true">
    <canvas class="hero__canvas" data-lattice></canvas>
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <p class="hero__vert" aria-hidden="true">Engineering intelligence <i></i> Data &amp; AI engineer <i></i> ${site.brand}</p>

  <div class="container hero__inner">
    <div class="hero__studio">
      <p class="hero__studio-name"><b>${site.brand}</b><span>Digital engineering studio of ${site.name}</span></p>
      <ul class="hero__status" aria-label="Status">
        <li class="chip"><span class="dot"></span>Online</li>
        <li class="chip">${icon('pin')}<span>Pune, IN</span><span class="hero__clock"><span class="visually-hidden">, local time </span><span data-clock>IST</span></span></li>
        <li class="js-only"><button class="chip hero__motion" type="button" data-motion-toggle aria-pressed="false">${icon('motion')}<span data-motion-label>Pause motion</span></button></li>
      </ul>
    </div>

    <p class="hero__kicker"><span>01</span><span aria-hidden="true"> // </span>Data · AI · Automation · Big Data Analytics</p>
    <h1 class="hero__title" id="hero-title">
      <span class="hero__name"><span>Gaurang</span> <span>Ashava.</span></span>
      <span class="hero__sub">${site.tagline}.</span>
      <span class="hero__role">Data &amp; AI Engineer.</span>
    </h1>

    <div class="hero__lower">
      <p class="hero__intro">${site.intro}</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#projects">Explore My Work ${icon('arrowDown', 'i-move')}</a>
        ${ext(site.resume, `Download Resume ${icon('download')}`, 'btn', ' aria-describedby="resume-note"')}
        <a class="btn btn--ghost" href="#contact">Contact Me ${icon('arrowRight', 'i-move')}</a>
        <span class="visually-hidden" id="resume-note">The résumé opens in Google Drive, where it can be downloaded.</span>
      </div>
      <div class="hero__foot">
        <ul class="hero__social" aria-label="Profiles">
          <li>${ext(site.github, `${icon('github')}<span class="visually-hidden">GitHub</span>`, 'icon-link')}</li>
          <li>${ext(site.linkedin, `${icon('linkedin')}<span class="visually-hidden">LinkedIn</span>`, 'icon-link')}</li>
          <li><a class="icon-link" href="mailto:${site.email}">${icon('mail')}<span class="visually-hidden">Email ${site.email}</span></a></li>
        </ul>
        <p class="hero__now"><span class="label">Currently</span> ${site.role} at ${site.company}</p>
      </div>
    </div>

    <ol class="hero__index" aria-label="On this page">
${INDEX.map(([n, label, href]) => `      <li><a href="${href}"><b>${n}</b><span>${label}</span></a></li>`).join('\n')}
    </ol>
  </div>

  <a class="hero__scroll" href="#about"><span class="hero__scroll-txt" aria-hidden="true">Scroll</span><span class="visually-hidden">Scroll to About</span><span class="hero__scroll-line" aria-hidden="true"></span></a>
</section>`;

module.exports = { hero };
