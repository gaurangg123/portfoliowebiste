// 03 · Engineering domains — four domains, each with its own tone and motif.
const domains = require('../data/domains.js');
const { MOTIFS } = require('./motifs.js');
const { secHead, tags, icon, esc } = require('./ui.js');

const card = (d, i) => `      <article class="domain domain--${d.id}" data-tone="${d.tone}" data-domain data-reveal style="--i:${i}" aria-labelledby="dom-${d.id}">
        <div class="domain__art">${MOTIFS[d.motif]()}</div>
        <div class="domain__body">
          <p class="domain__code"><span>${d.code}</span><span class="domain__bar" aria-hidden="true"></span></p>
          <h3 class="domain__name" id="dom-${d.id}">${esc(d.name)}</h3>
          <p class="domain__line">${d.line}</p>
          <p class="domain__applied"><span class="label">Applied</span> ${d.applied} <a class="domain__link" href="${d.link}">${d.link.startsWith('#') ? 'See the projects' : 'See the project'}<span class="visually-hidden">: ${esc(d.name)}</span> ${icon('arrowRight')}</a></p>
          ${tags(d.tech, 'tag tag--tone')}
        </div>
      </article>`;

const expertise = () => `<section class="section section--alt expertise" id="expertise" aria-labelledby="expertise-title">
  <div class="container">
    ${secHead({ num: '03', label: 'Engineering domains', id: 'expertise-title', title: 'Four domains, <em>one system.</em>', lede: 'Data moves through pipelines, models reason over it, automation acts on it and analytics explains it. These are the domains I work across, and the tools I use in each.' })}
    <div class="domains">
${domains.map(card).join('\n')}
    </div>
  </div>
</section>`;

module.exports = { expertise };
