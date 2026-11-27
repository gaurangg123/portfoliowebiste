// 05 · Professional experience: a compact editorial timeline. Large year marks on the
// left, a line with a node per role, the role on the right; the current role is lit.
// Wording is the verified wording (src/data/experience.js).
const roles = require('../data/experience.js');
const edu = require('../data/education.js');
const { secHead, tags } = require('./ui.js');

// "Dec 2023 – Jan 2024" → 2023 — 24; "Oct 2025 – Present" → 2025 — Now
const years = (x) => {
  const ys = [...new Set(x.when.match(/\d{4}/g))];
  if (x.current) return [ys[0], 'Now'];
  return ys.length > 1 ? [ys[0], ys[1].slice(2)] : [ys[0]];
};

const item = (x, i) => {
  const [a, b] = years(x);
  return `      <li class="xp__item${x.current ? ' xp__item--now' : ''}" data-reveal style="--i:${i}">
        <div class="xp__when">
          <p class="xp__year" aria-hidden="true">${a}${b ? `<i>—</i>${b}` : ''}</p>
          <p class="xp__span"><time datetime="${x.start}">${x.when}</time></p>
          ${x.current ? '<p class="chip xp__now"><span class="dot"></span>Current role</p>' : ''}
        </div>
        <span class="xp__node" aria-hidden="true"></span>
        <article class="xp__body" aria-labelledby="role-${x.id}">
          <h3 class="xp__role" id="role-${x.id}">${x.role}</h3>
          <p class="xp__org">${x.org} <span aria-hidden="true">·</span> ${x.place}</p>
          <p class="xp__desc">${x.description}</p>
          <ul class="xp__points">
${x.achievements.map((t) => `            <li>${t}</li>`).join('\n')}
          </ul>
          <details class="disclosure xp__more">
            <summary>${x.current ? 'Responsibilities' : 'More responsibilities'}<span class="visually-hidden"> at ${x.org}</span></summary>
            <ul class="xp__points xp__points--more">
${x.more.map((t) => `              <li>${t}</li>`).join('\n')}
            </ul>
          </details>
          ${tags(x.tech)}
        </article>
      </li>`;
};

const experience = () => `<section class="section section--slant section--slant-r career" id="experience" aria-labelledby="experience-title">
  <div class="container">
    ${secHead({ num: '05', label: 'Professional experience', id: 'experience-title', title: 'Where I’ve been <em>building.</em>', lede: `From software and data internships during a B.Tech at ${edu.degree.school.replace('&', '&amp;')}, to data and AI engineering at Tata Technologies.`, split: true })}
    <ol class="xp">
${roles.map(item).join('\n')}
    </ol>
  </div>
</section>`;

module.exports = { experience };
