// 03 · Engineering disciplines: a discipline explorer. Desktop: the four disciplines in a
// list beside a large stage with that discipline's animated illustration; small screens
// and without JavaScript: a vertical timeline with every detail in place.
const domains = require('../data/domains.js');
const { MOTIFS } = require('./motifs.js');
const { secHead, tags, icon, esc } = require('./ui.js');
const { stepper } = require('./stepper.js');

const body = (d) => `<div class="disc" data-domain>
            <div class="disc__art">${MOTIFS[d.motif]()}<span class="disc__code">${d.code}</span></div>
            <div class="disc__body">
              <p class="disc__line">${d.line}</p>
              <div class="disc__cols">
                <div><p class="label">What it involves</p><ul class="disc__list">${d.involves.map((x) => `<li>${x}</li>`).join('')}</ul></div>
                <div><p class="label">Where I’ve applied it</p><p class="disc__applied">${d.applied} <a href="${d.link}">${d.link.startsWith('#') ? 'See the projects' : 'See the project'}<span class="visually-hidden">: ${esc(d.name)}</span>${icon('arrowRight')}</a></p></div>
              </div>
              <p class="label disc__tools-h">Tools</p>
              ${tags(d.tech, 'tag tag--tone')}
            </div>
          </div>`;

const expertise = () => `<section class="section section--band expertise" id="expertise" aria-labelledby="expertise-title">
  <div class="container">
    ${secHead({ num: '03', label: 'Engineering disciplines', id: 'expertise-title', title: 'Four disciplines, <em>one system.</em>', lede: 'Data moves through pipelines, models reason over it, automation acts on it and analytics explains it. Select a discipline to see what it involves and where I’ve applied it.', split: true })}
    <div data-reveal>
      ${stepper({ id: 'disc', variant: 'side', label: 'Engineering disciplines', steps: domains.map((d) => ({ key: d.id, tone: d.tone, num: d.code, icon: d.icon, name: esc(d.name), short: d.short, body: body(d) })) })}
    </div>
  </div>
</section>`;

module.exports = { expertise };
