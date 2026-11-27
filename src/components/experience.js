// 05 · Professional experience — a timeline whose rail fills as it is read.
const roles = require('../data/experience.js');
const { secHead, tags } = require('./ui.js');

const item = (x, i) => `      <li class="career__item${x.current ? ' is-now' : ''}" data-reveal style="--i:${i}">
        <div class="career__when">
          <p class="career__dates"><time datetime="${x.start}">${x.when}</time></p>
          ${x.current ? '<p class="chip career__now"><span class="dot"></span>Current role</p>' : ''}
        </div>
        <span class="career__node" aria-hidden="true"></span>
        <article class="career__card" aria-labelledby="role-${x.id}">
          <header class="career__head">
            <h3 class="career__role" id="role-${x.id}">${x.role}</h3>
            <p class="career__org">${x.org} <span aria-hidden="true">·</span> ${x.place}</p>
          </header>
          <p class="career__desc">${x.description}</p>
          <p class="label career__k">${x.current ? 'Verified achievements' : 'Highlights'}</p>
          <ul class="career__points">
${x.achievements.map((a) => `            <li>${a}</li>`).join('\n')}
          </ul>
          <details class="career__more">
            <summary>More responsibilities<span class="visually-hidden"> at ${x.org}</span></summary>
            <ul class="career__points">
${x.more.map((a) => `              <li>${a}</li>`).join('\n')}
            </ul>
          </details>
          <div class="career__tech"><p class="label">Technologies</p>${tags(x.tech)}</div>
        </article>
      </li>`;

const experience = () => `<section class="section section--alt career" id="experience" aria-labelledby="experience-title">
  <div class="container">
    ${secHead({ num: '05', label: 'Professional experience', id: 'experience-title', title: 'Where I’ve been <em>building.</em>' })}
    <div class="career__wrap">
      <span class="career__rail" aria-hidden="true"><span class="career__fill" data-career-fill></span></span>
      <ol class="career__list" data-career>
${roles.map(item).join('\n')}
      </ol>
    </div>
  </div>
</section>`;

module.exports = { experience };
