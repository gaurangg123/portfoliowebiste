// 01 · System initialization — the opening screen.
// The 3D lattice is a <canvas> drawn by src/scripts/hero-lattice.js; without
// JavaScript a still render of the same lattice is shown instead.
const site = require('../data/site.js');
const { icon, ext } = require('./ui.js');

const hero = () => `<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__art" aria-hidden="true">
    <canvas class="hero__canvas" data-lattice></canvas>
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>

  <div class="container hero__inner">
    <ul class="hero__status" aria-label="Status">
      <li class="chip"><span class="dot"></span>Online</li>
      <li class="chip">${icon('pin')}<span>Pune, IN</span><span class="hero__clock"><span class="visually-hidden">, local time </span><span data-clock>IST</span></span></li>
      <li class="js-only"><button class="chip hero__motion" type="button" data-motion-toggle aria-pressed="false">${icon('motion')}<span data-motion-label>Pause motion</span></button></li>
    </ul>

    <p class="hero__kicker"><span>01</span> // System initialization<span class="hero__kicker-brand"> · ${site.brand}</span></p>
    <h1 class="hero__title" id="hero-title">
      <span class="hero__name"><span>Gaurang</span> <span>Ashava.</span></span>
      <span class="hero__sub">${site.tagline}.</span>
    </h1>

    <p class="hero__roles">
      <span class="hero__prompt" aria-hidden="true">&gt;_</span>
      <span class="visually-hidden">Roles: ${site.titles.join(', ')}.</span>
      <span class="hero__typed" data-typed data-titles='${JSON.stringify(site.titles)}' aria-hidden="true">${site.titles[0]}</span><span class="hero__caret" aria-hidden="true"></span>
    </p>

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

  <a class="hero__scroll" href="#about"><span class="visually-hidden">Scroll to About</span><span class="hero__scroll-line" aria-hidden="true"></span></a>
</section>`;

module.exports = { hero };
