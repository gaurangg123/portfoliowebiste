// 06 · Education & certifications — verified entries only.
const { degree, certifications } = require('../data/education.js');
const { secHead, icon, esc } = require('./ui.js');

const pct = Math.round((Number(degree.cgpa) / Number(degree.scale)) * 1000) / 10;

const education = () => `<section class="section edu" id="education" aria-labelledby="education-title">
  <div class="container">
    ${secHead({ num: '06', label: 'Education & certifications', id: 'education-title', title: 'Foundations, <em>on record.</em>' })}
    <div class="edu__grid">
      <article class="edu__degree" data-reveal aria-labelledby="degree-title">
        <div class="edu__top">
          <span class="edu__icon">${icon('cap')}</span>
          <p class="label">Degree · ${degree.when}</p>
        </div>
        <h3 class="edu__title" id="degree-title">${degree.title}</h3>
        <p class="edu__school">${esc(degree.school)}</p>
        <dl class="edu__facts">
          <div><dt>Specialization</dt><dd>${degree.specialization}</dd></div>
          <div><dt>Graduated</dt><dd>${degree.graduated}</dd></div>
          <div class="edu__cgpa"><dt>CGPA</dt><dd><b>${degree.cgpa}</b> / ${degree.scale}</dd></div>
        </dl>
        <div class="edu__meter" aria-hidden="true"><span style="--p:${pct}%"></span></div>
      </article>
      <div class="edu__certs">
        <h3 class="label edu__certs-h">Certifications</h3>
        <ul class="edu__list">
${certifications.map((c, i) => `          <li class="cert" data-reveal style="--i:${i}">
            <span class="cert__icon">${icon('award')}</span>
            <div>
              <h4 class="cert__title">${c.title}</h4>
              <p class="cert__issuer">${c.issuer}</p>
              <p class="cert__note">${c.note}</p>
            </div>
          </li>`).join('\n')}
        </ul>
      </div>
    </div>
  </div>
</section>`;

module.exports = { education };
