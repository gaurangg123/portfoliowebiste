// 02 · The engineer behind the systems — an editorial introduction.
// Every line is taken from the verified profile (src/data/*); nothing is added.
const site = require('../data/site.js');
const edu = require('../data/education.js');
const { icon, ext, secHead, esc } = require('./ui.js');

const CHAPTERS = [
  ['2021 – 2025', 'Foundation', `B.Tech in Computer Science Engineering at ${esc(edu.degree.school)}, specializing in ${edu.degree.specialization}.`],
  ['2023', 'Software', 'Front-end development on live web projects at Swap Infotech, in an Agile team.'],
  ['2023 – 2024', 'Data', 'SQL analysis, data collection and reporting in a data-analytics internship at Vertisystem.'],
  ['Oct 2025 – now', 'Data & AI', 'Data engineering and applied AI at Tata Technologies: knowledge platforms, analytics automation, document intelligence and a Snowflake migration.'],
  ['Next', 'Agents', 'Going deeper into agentic coding, managing AI agents and tailoring LLMs to business use cases.'],
];

const about = () => `<section class="section about" id="about" aria-labelledby="about-title">
  <div class="container">
    ${secHead({ num: '02', label: 'About', id: 'about-title', title: 'The engineer behind <em>the systems.</em>' })}
    <div class="about__grid">
      <figure class="about__photo" data-reveal>
        <span class="about__plate" aria-hidden="true"></span>
        <div class="about__frame">
          <picture>
            <source type="image/webp" srcset="assets/profile/gaurang-480.webp 480w, assets/profile/gaurang-800.webp 800w, assets/profile/gaurang-1200.webp 1200w" sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, calc(100vw - 32px)" />
            <img src="assets/profile/gaurang.jpg" width="900" height="1200" alt="Gaurang Ashava sitting on a grassy hillside, with wind turbines on the ridge behind him" loading="lazy" decoding="async" />
          </picture>
          <span class="about__corner about__corner--tl" aria-hidden="true"></span><span class="about__corner about__corner--br" aria-hidden="true"></span>
        </div>
        <figcaption class="about__id">
          <span class="about__id-k">${site.role}</span>
          <span class="about__id-v">${site.company} · ${site.location}</span>
        </figcaption>
      </figure>

      <div class="about__story">
        <p class="about__lead" data-reveal>I’m ${site.firstName}, ${site.role} at ${site.company} in Pune. I joined in October 2025 after a B.Tech in Computer Science Engineering with a specialization in Big Data Analytics.</p>
        <p data-reveal>My path runs from software, to data, to AI: front-end work on live web projects, SQL analysis and reporting in a data-analytics internship, and now data engineering and applied AI on enterprise applications.</p>
        <blockquote class="about__quote" data-reveal><p>I like taking an idea from data, to AI, to an application people use.</p></blockquote>
        <div class="about__foot" data-reveal>
          ${ext(site.resume, `Read my resume ${icon('arrowUpRight', 'i-up')}`, 'btn')}
          <div class="audio" data-music-card>
            <div class="audio__disc" aria-hidden="true"><i></i></div>
            <div class="audio__meta">
              <p class="label">Audio channel</p>
              <p class="audio__title">Papercut <span>· Linkin Park, instrumental</span></p>
            </div>
            <button class="audio__btn js-only" type="button" data-music>${icon('play', 'i-play')}${icon('pause', 'i-pause')}<span class="audio__label">Play</span><span class="visually-hidden"> Papercut by Linkin Park (instrumental)</span></button>
            <p class="audio__status" id="music-status" role="status"></p>
          </div>
        </div>
      </div>
    </div>

    <ol class="path" aria-label="Path so far">
${CHAPTERS.map(([when, name, text], i) => `      <li class="path__step" data-reveal style="--i:${i}">
        <span class="path__node" aria-hidden="true"></span>
        <p class="path__when">${when}</p>
        <h3 class="path__name">${esc(name)}</h3>
        <p class="path__text">${text}</p>
      </li>`).join('\n')}
    </ol>
  </div>
</section>`;

module.exports = { about };
