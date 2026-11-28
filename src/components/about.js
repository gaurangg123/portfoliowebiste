// 02 · The engineer behind the systems — an asymmetric editorial introduction: the portrait
// set off-grid, the story beside it, where I am now and where I studied; then one panel
// with the path so far beside how I approach the work. Every line comes from the verified
// profile (src/data/*).
const site = require('../data/site.js');
const edu = require('../data/education.js');
const profile = require('../data/profile.js');
const workflow = require('../data/workflow.js');
const domains = require('../data/domains.js');
const { icon, secHead, esc } = require('./ui.js');

// a slow ribbon of the tools I work with (from the approved discipline lists), between
// the opening and the introduction; decorative, so it is hidden from assistive technology
const ribbon = () => {
  const words = domains.flatMap((d) => d.tech);
  const row = (list) => list.map((w) => `<span>${esc(w)}</span><i></i>`).join('');
  return `<div class="ribbon-wrap" aria-hidden="true"><div class="ribbon">
  <div class="ribbon__row"><div class="ribbon__track">${row(words)}${row(words)}</div></div>
</div></div>`;
};

const about = () => `<section class="section about" id="about" aria-labelledby="about-title">
  <div class="container">
    <div class="about__grid">
      <figure class="about__photo" data-reveal>
        <span class="about__plate" aria-hidden="true"></span>
        <div class="about__frame">
          <picture>
            <source type="image/webp" srcset="assets/profile/gaurang-480.webp 480w, assets/profile/gaurang-800.webp 800w, assets/profile/gaurang-1200.webp 1200w" sizes="(min-width: 1024px) 400px, (min-width: 640px) 60vw, calc(100vw - 32px)" />
            <img src="assets/profile/gaurang.jpg" width="900" height="1200" alt="Gaurang Ashava sitting on a grassy hillside, with wind turbines on the ridge behind him" loading="lazy" decoding="async" />
          </picture>
          <span class="about__corner about__corner--tl" aria-hidden="true"></span><span class="about__corner about__corner--br" aria-hidden="true"></span>
        </div>
        <figcaption class="about__id">
          <span class="about__id-k">${site.name}</span>
          <span class="about__id-v">${site.location} · ${site.timeZone.replace('Asia/Kolkata', 'IST')}</span>
        </figcaption>
      </figure>

      <div class="about__story">
        ${secHead({ num: '02', label: 'About', id: 'about-title', title: 'The engineer behind <em>the systems.</em>' })}
        <p class="about__lead" data-reveal>I’m ${site.firstName}, ${site.role} at ${site.company} in Pune. I joined in October 2025 after a B.Tech in Computer Science Engineering with a specialization in Big Data Analytics.</p>
        <p data-reveal>My path runs from software, to data, to AI: front-end work on live web projects, SQL analysis and reporting in a data-analytics internship, and now data engineering and applied AI on enterprise applications.</p>
        <blockquote class="about__quote" data-reveal><p>${profile.philosophy}</p></blockquote>
        <dl class="about__facts" data-reveal>
          <div><dt>Now</dt><dd><b>${site.role}</b><span>${site.company} · since Oct 2025</span></dd></div>
          <div><dt>Studied</dt><dd><b>B.Tech, Computer Science Engineering</b><span>${esc(edu.degree.school)} · ${edu.degree.specialization}</span></dd></div>
        </dl>
      </div>
    </div>

    <div class="story" data-reveal>
      <div class="story__col">
        <header class="story__head">
          <span class="story__k" aria-hidden="true">i.</span>
          <div><h3 class="story__title">The path so far</h3><p class="story__sub">From software, to data, to AI.</p></div>
        </header>
        <ol class="path">
${profile.chapters.map(([when, name, text]) => `          <li class="path__step">
            <p class="path__when">${when}</p>
            <span class="path__node" aria-hidden="true"></span>
            <div class="path__body"><h4 class="path__name">${esc(name)}</h4><p class="path__text">${esc(text)}</p></div>
          </li>`).join('\n')}
        </ol>
      </div>
      <div class="story__col">
        <header class="story__head">
          <span class="story__k" aria-hidden="true">ii.</span>
          <div><h3 class="story__title">How I approach the work</h3><p class="story__sub">${workflow.note}</p></div>
        </header>
        <ol class="how">
${workflow.stages.map((s) => `          <li class="how__step" data-tone="${s.tone}">
            <span class="how__mark" aria-hidden="true">${icon(s.icon)}<b>${s.num}</b></span>
            <div class="how__body"><h4 class="how__name">${esc(s.name)}</h4><p class="how__what">${s.what}</p></div>
          </li>`).join('\n')}
        </ol>
      </div>
    </div>
  </div>
</section>`;

module.exports = { about, ribbon };
