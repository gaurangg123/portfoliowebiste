// 03 · Engineering disciplines: an editorial spread. Four numbered plates in a staggered
// two-column composition; each has its own animated illustration, what it is, what it
// involves, the tools (the approved lists) and where I've applied it. Everything shows at
// once — nothing hidden behind tabs.
const domains = require('../data/domains.js');
const { MOTIFS } = require('./motifs.js');
const { secHead, tags, icon, esc } = require('./ui.js');

const plate = (d, i) => `      <article class="dom dom--${i % 2 ? 'b' : 'a'}" data-tone="${d.tone}" data-domain data-reveal style="--i:${i % 2}" aria-labelledby="dom-${d.id}">
        <span class="dom__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <div class="dom__art">${MOTIFS[d.motif]()}<span class="dom__code">${d.code}</span></div>
        <div class="dom__body">
          <h3 class="dom__name" id="dom-${d.id}">${esc(d.name)}</h3>
          <p class="dom__short">${d.short}</p>
          <p class="dom__line">${d.line}</p>
          <ul class="dom__list">${d.involves.map((x) => `<li>${x}</li>`).join('')}</ul>
          ${tags(d.tech, 'tag tag--tone')}
          <p class="dom__applied"><span class="label">Applied</span> ${d.applied} <a href="${d.link}">${d.link.startsWith('#') ? 'See the projects' : 'See the project'}<span class="visually-hidden">: ${esc(d.name)}</span>${icon('arrowRight')}</a></p>
        </div>
      </article>`;

const expertise = () => `<section class="section section--slant expertise" id="expertise" aria-labelledby="expertise-title">
  <div class="container">
    ${secHead({ num: '03', label: 'Engineering disciplines', id: 'expertise-title', title: 'Four disciplines, <em>one system.</em>', lede: 'Data moves through pipelines, models reason over it, automation acts on it and analytics explains it. These are the four disciplines I work across.', split: true })}
    <div class="doms">
${domains.map(plate).join('\n')}
    </div>
  </div>
</section>`;

module.exports = { expertise };
