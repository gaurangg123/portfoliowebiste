// 05 · Professional experience: a career track from 2021 to now, the current role in
// full, and the two internships side by side. Wording is the verified wording.
const roles = require('../data/experience.js');
const edu = require('../data/education.js');
const { secHead, tags } = require('./ui.js');

// the track spans January 2021 to the end of 2026; positions are percentages of that span
const span = (y, m) => ((y - 2021) * 12 + (m - 1)) / (6 * 12) * 100;
const TRACK = [
  { label: 'B.Tech, Computer Science Engineering', when: '2021 – 2025', from: span(2021, 7), to: span(2025, 6), kind: 'edu' },
  { label: 'Swap Infotech', when: 'Jun – Jul 2023', from: span(2023, 6), to: span(2023, 8), kind: 'intern' },
  { label: 'Vertisystem', when: 'Dec 2023 – Jan 2024', from: span(2023, 12), to: span(2024, 2), kind: 'intern' },
  { label: 'Tata Technologies', when: 'Oct 2025 – Present', from: span(2025, 10), to: span(2026, 12), kind: 'now' },
];

const role = (x, i) => `      <article class="role${x.current ? ' role--now' : ''}" data-reveal style="--i:${i}" aria-labelledby="role-${x.id}">
        <header class="role__head">
          <p class="role__when"><time datetime="${x.start}">${x.when}</time>${x.current ? '<span class="chip role__now"><span class="dot"></span>Current role</span>' : ''}</p>
          <h3 class="role__title" id="role-${x.id}">${x.role}</h3>
          <p class="role__org">${x.org} <span aria-hidden="true">·</span> ${x.place}</p>
        </header>
        <div class="role__grid">
          <div class="role__main">
            <p class="role__desc">${x.description}</p>
            <p class="label role__k">${x.current ? 'Verified achievements' : 'Highlights'}</p>
            <ul class="role__points">
${x.achievements.map((a) => `              <li>${a}</li>`).join('\n')}
            </ul>
          </div>
          <div class="role__side">
            <details class="disclosure role__more"${x.current ? ' open' : ''}>
              <summary>${x.current ? 'Responsibilities' : 'More responsibilities'}<span class="visually-hidden"> at ${x.org}</span></summary>
              <ul class="role__points role__points--more">
${x.more.map((a) => `                <li>${a}</li>`).join('\n')}
              </ul>
            </details>
            <div class="role__tech"><p class="label">Technologies</p>${tags(x.tech)}</div>
          </div>
        </div>
      </article>`;

const experience = () => `<section class="section career" id="experience" aria-labelledby="experience-title">
  <div class="container">
    ${secHead({ num: '05', label: 'Professional experience', id: 'experience-title', title: 'Where I’ve been <em>building.</em>', lede: `From software and data internships during a B.Tech at ${edu.degree.school.replace('&', '&amp;')}, to data and AI engineering at Tata Technologies.`, split: true })}
    <figure class="track" data-reveal aria-label="Career track, 2021 to now">
      <div class="track__axis" aria-hidden="true">${[2021, 2022, 2023, 2024, 2025, 2026].map((y) => `<span style="--x:${span(y, 1)}%">${y}</span>`).join('')}</div>
      <ol class="track__bars">
${TRACK.map((t) => `        <li class="track__bar track__bar--${t.kind}" style="--from:${t.from.toFixed(2)}%;--to:${t.to.toFixed(2)}%"><span class="track__label"><b>${t.label}</b> ${t.when}</span></li>`).join('\n')}
      </ol>
    </figure>
    <div class="roles">
${roles.map(role).join('\n')}
    </div>
  </div>
</section>`;

module.exports = { experience };
